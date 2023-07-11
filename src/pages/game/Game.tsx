import React, { useEffect } from 'react';
import styles from './Game.module.scss';
import { enemyShipsAtom, Ships, shipsAtom } from '../../components/ships/Ships';
import { PlayerBoard } from '../../components/player-board/PlayerBoard';
import { useParams } from 'react-router-dom';
import { useRoom } from '../../hooks/useRoom';
import { atom, useSetAtom } from 'jotai';
import {
  GameHistory as GameHistoryType,
  Room,
  RoomStatus,
  Ship,
  ShipAtom,
  UserFieldAtom,
  UserFieldItemAtom,
  WhichPlayer,
} from '../../types';
import { gridAtom } from '../../components/grid/gridAtom';
import { EnemyBoard } from '../../components/enemy-board/EnemyBoard';
import { showError } from '../../utils/error';
import { updateUserConnection } from '../../firebase';
import { GameHistory } from '../../components/game-history/GameHistory';
import { setIsHostAtom } from '../../hooks/useIsHost';
import { useGameHistory } from '../../hooks/useGameHistory';
import { enemyGridAtom } from '../../components/enemy-grid/enemyGridAtom';

const updateShipsAtom = atom(null, (get, set, isHost: boolean, room: Room) => {
  function updateShip(shipAtom: ShipAtom, index: number, ships: Ship[], fieldAtom: UserFieldAtom) {
    set(shipAtom, ships[index]);

    const ship = get(shipAtom);
    const grid = get(fieldAtom);

    ship.coordinates.forEach(coords => {
      const [row, col] = coords.coordinate;
      const cellAtom = grid[row]?.[col];

      if (cellAtom) {
        set(cellAtom, prev => ({
          ...prev,
          ship: shipAtom,
        }));
      }
    });
  }

  get(shipsAtom).forEach((ship, index) =>
    updateShip(ship, index, isHost ? room.player1.ships || [] : room.player2?.ships || [], gridAtom),
  );
  get(enemyShipsAtom).forEach((ship, index) =>
    updateShip(ship, index, isHost ? room.player2?.ships || [] : room.player1.ships || [], enemyGridAtom),
  );
});

const updateShipByHistoryMoveAtom = atom(null, (get, set, isHost: boolean, history: GameHistoryType) => {
  const myGridAtom = isHost ? gridAtom : enemyGridAtom;
  const opponentGridAtom = isHost ? enemyGridAtom : gridAtom;

  const myGrid = get(myGridAtom);
  const opponentGrid = get(opponentGridAtom);

  function updateHitAndDestroyed(cellAtom: UserFieldItemAtom, x: number, y: number) {
    const cell = get(cellAtom);
    if (cell.ship) {
      const ship = get(cell.ship);
      ship.coordinates.forEach(({ coordinate: [shipX, shipY] }, index) => {
        if (x === shipX && y === shipY) {
          set(cell.ship!, prev => {
            const newVal = { ...prev };
            newVal.coordinates[index].hit = true;
            return newVal;
          });
        }
      });
      if (ship.coordinates.every(coord => coord.hit === true)) {
        set(cell.ship!, prev => ({ ...prev, destroyed: true }));
      }
    }
  }

  history.moves.forEach(move => {
    const [x, y] = move.coordinate;
    if (move.player === WhichPlayer.player1) {
      const cellAtom = opponentGrid[x][y];
      set(cellAtom, prev => ({ ...prev, hasShot: true }));
      updateHitAndDestroyed(cellAtom, x, y);
    } else {
      const cellAtom = myGrid[x][y];
      set(cellAtom, prev => ({ ...prev, hasShot: true }));
      updateHitAndDestroyed(cellAtom, x, y);
    }
  });
});

const getDescription = (room: Room) => {
  if (!room.player1?.connected || !room.player2?.connected) {
    return 'Waiting while player connected...';
  }
  if (room.status === RoomStatus.initialization) {
    return 'Waiting while both players are ready.';
  }
  if (room.status === RoomStatus.finished) {
    return 'The game is completed.';
  }
  return 'Game';
};

type Props = {
  isHost: boolean;
};

export const Game = (props: Props) => {
  const { isHost } = props;
  const { id: roomId } = useParams<{ id: string }>();

  const updateShips = useSetAtom(updateShipsAtom);
  const updateShipsByHistory = useSetAtom(updateShipByHistoryMoveAtom);
  const setIsHost = useSetAtom(setIsHostAtom);

  useEffect(() => {
    setIsHost(isHost);
  }, [isHost, setIsHost]);

  const [room, { isLoading }] = useRoom(roomId!);
  const [gameHistory] = useGameHistory(roomId!);

  useEffect(() => {
    let disconnect: () => Promise<void> | null;

    async function run() {
      try {
        disconnect = await updateUserConnection(roomId!, isHost ? WhichPlayer.player1 : WhichPlayer.player2);
        window.addEventListener('beforeunload', disconnect);
      } catch (e) {
        showError(e);
      }
    }

    run();

    return () => {
      if (disconnect) {
        disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (room) {
      updateShips(isHost, room);
    }
  }, [room, isHost, updateShips]);

  useEffect(() => {
    updateShipsByHistory(isHost, gameHistory);
  }, [isHost, gameHistory, updateShipsByHistory]);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <h3 className={styles.loadingTitle}>The room is loading...</h3>
      </div>
    );
  }

  if (!room) {
    return (
      <div className={styles.loading}>
        <h3 className={styles.loadingTitle}>Something went wrong...</h3>
      </div>
    );
  }

  const description = getDescription(room);

  const isMyTurn =
    (isHost && gameHistory.turn === WhichPlayer.player1) || (!isHost && gameHistory.turn === WhichPlayer.player2);
  const moves = gameHistory.moves;

  return (
    <div className={styles.page}>
      <div className={styles.description}>{description}</div>
      <div className={styles.game}>
        <div className={styles.content}>
          <PlayerBoard room={room} />
        </div>
        {room.status === RoomStatus.initialization ? <Ships /> : <GameHistory myTurn={isMyTurn} moves={moves} />}
        <div className={styles.content}>
          <EnemyBoard myTurn={isMyTurn} room={room} />
        </div>
      </div>
    </div>
  );
};
