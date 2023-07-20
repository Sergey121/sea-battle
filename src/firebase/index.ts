import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import { GameHistory, HistoryMove, Room, RoomStatus, Ship, WhichPlayer, WhichPlayerType } from '../types';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const unexpectedError = () => {
  return new Error('Something went wrong.');
};

const COLLECTIONS = {
  rooms: 'rooms',
  roomHistory: 'history',
  roomHistoryData: 'data',
} as const;

const db = getFirestore(app);

export const createRoom = async (playerName: string): Promise<Room> => {
  if (!playerName) {
    throw new Error('Player name is not provided.');
  }

  try {
    const data: Omit<Room, 'id'> = {
      status: RoomStatus.initialization,
      dateCreated: Date.now(),
      dateUpdate: Date.now(),
      player1: {
        name: playerName,
      },
    };
    const ref = await addDoc(collection(db, COLLECTIONS.rooms), data);
    await setDoc(doc(db, COLLECTIONS.rooms, ref.id, COLLECTIONS.roomHistory, COLLECTIONS.roomHistoryData), {
      turn: WhichPlayer.player1,
      date: Date.now(),
      moves: [],
    });
    return {
      ...data,
      id: ref.id,
    };
  } catch (e) {
    console.debug(e);
    throw unexpectedError();
  }
};

export const joinTheRoom = async (roomId: string, playerName: string) => {
  if (!playerName) {
    throw new Error('Player name is not provided.');
  }

  try {
    const docRef = doc(db, COLLECTIONS.rooms, roomId);

    const player: Partial<Room> = {
      dateUpdate: Date.now(),
      player2: {
        name: playerName,
        connected: true,
      },
    };

    await setDoc(docRef, player, { merge: true });
  } catch (e) {
    console.debug(e);
    throw unexpectedError();
  }
};

export const readyPlayer = async (roomId: string, ships: Ship[], whichPlayer: WhichPlayerType) => {
  try {
    const roomDoc = doc(db, COLLECTIONS.rooms, roomId);
    const room = await getDoc(roomDoc);
    if (!room.exists()) {
      throw new Error('Room not found.');
    }
    const roomData = {
      ...room.data(),
      id: room.id,
    } as Room;

    const isOpponentReady = whichPlayer === WhichPlayer.player1 ? roomData.player2?.isReady : roomData.player1?.isReady;

    const dataToSave: Room = { ...roomData, dateUpdate: Date.now() };
    if (isOpponentReady) {
      dataToSave.status = RoomStatus.game;
    }
    const currentData = dataToSave[whichPlayer] || { ships: [], isReady: true, name: '' };
    currentData.ships = ships;
    currentData.isReady = true;
    dataToSave[whichPlayer] = currentData;
    await setDoc(roomDoc, dataToSave, {
      merge: true,
    });
  } catch (e) {
    console.debug(e);
    throw unexpectedError();
  }
};

export const getRoomSubscribe = async (roomId: string, onNext: (data: Room) => void) => {
  return onSnapshot(doc(db, COLLECTIONS.rooms, roomId), snapshot => {
    const data = snapshot.data() as Room;
    if (data) {
      data.id = snapshot?.id;
    }
    onNext(data);
  });
};

export const getHistorySubscribe = async (roomId: string, onNext: (data: GameHistory | undefined) => void) => {
  const docRef = doc(db, COLLECTIONS.rooms, roomId, COLLECTIONS.roomHistory, COLLECTIONS.roomHistoryData);
  return onSnapshot(docRef, response => {
    const data = response.data() as GameHistory;
    onNext(data);
  });
};

export const updateUserConnection = async (roomId: string, player: WhichPlayerType) => {
  const docRef = doc(db, COLLECTIONS.rooms, roomId);
  const field = `${player}.connected`;

  try {
    await updateDoc(docRef, field, true);
  } catch (e) {
    console.debug(e);
    throw unexpectedError();
  }

  return async () => {
    try {
      await updateDoc(docRef, field, false);
    } catch (e) {
      console.debug(e);
      throw unexpectedError();
    }
  };
};

export const makeAShot = async (roomId: string, row: number, col: number, player: WhichPlayerType) => {
  try {
    const docRef = doc(db, COLLECTIONS.rooms, roomId);
    const roomResponse = await getDoc(docRef);
    const room = roomResponse.data() as Room;
    if (!room) {
      throw new Error('Room not found');
    }

    const opponent = player === WhichPlayer.player1 ? WhichPlayer.player2 : WhichPlayer.player1;
    const ships = room[opponent]!.ships;
    const ship = ships!.find(ship => {
      const coordinates = ship.coordinates.map(coord => coord.coordinate);
      return coordinates.some(([x, y]) => x === row && y === col);
    });
    const hasHit = !!ship;
    const dataToSave: HistoryMove = {
      coordinate: [row, col],
      date: Date.now(),
      hit: hasHit,
      player,
    };
    const historyDocRef = doc(db, COLLECTIONS.rooms, roomId, COLLECTIONS.roomHistory, COLLECTIONS.roomHistoryData);
    const historyDoc = await getDoc(historyDocRef);
    if (!historyDoc.exists()) {
      throw new Error('History doc not found');
    }
    await setDoc(
      historyDocRef,
      {
        turn: hasHit ? player : opponent,
        moves: arrayUnion(dataToSave),
      },
      { merge: true },
    );
  } catch (e) {
    console.debug(e);
    throw unexpectedError();
  }
};

export const updateWinner = async (roomId: string, winner: WhichPlayerType) => {
  try {
    const docRef = doc(db, COLLECTIONS.rooms, roomId);
    const data: Pick<Room, 'dateUpdate' | 'winner' | 'status'> = {
      dateUpdate: Date.now(),
      status: RoomStatus.finished,
      winner,
    }
    await updateDoc(docRef, data);
  } catch (e) {
    console.debug(e);
    throw unexpectedError();
  }
}
