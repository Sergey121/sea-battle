import { PrimitiveAtom } from 'jotai';

export type ShipSize = 1 | 2 | 3 | 4;
export type ShipPosition = Array<{ coordinate: [number, number], hit?: boolean }>;
export type Ship = {
  size: ShipSize;
  coordinates: ShipPosition;
  placed?: boolean;
  destroyed?: boolean;
};

export type ShipAtom = PrimitiveAtom<Ship>;

export const WhichPlayer = {
  player1: 'player1',
  player2: 'player2',
} as const;
export type WhichPlayerType = (typeof WhichPlayer)[keyof typeof WhichPlayer];

type FieldBase = {
  coordinate: [number, number];
  hasShot?: boolean;
  ship?: null | ShipAtom;
};

export type UserFieldItem = FieldBase & {
  hasHoveredWhileDragging?: boolean;
  canDropHere?: boolean;
};

export type EnemyFieldItem = FieldBase;

export type UserFieldItemAtom = PrimitiveAtom<UserFieldItem>;
export type UserField = Array<Array<UserFieldItemAtom>>;
export type UserFieldAtom = PrimitiveAtom<UserField>;

export type EnemyFieldItemAtom = PrimitiveAtom<EnemyFieldItem>;
export type EnemyField = Array<Array<EnemyFieldItemAtom>>;

export type Player = {
  name: string;
  ships?: Ship[];
  isReady?: boolean;
  connected?: boolean;
};

export const RoomStatus = {
  initialization: 'initialization',
  game: 'game',
  finished: 'finished',
} as const;

export type RoomStatusType = (typeof RoomStatus)[keyof typeof RoomStatus];

export type Room = {
  id: string;
  dateCreated: number;
  dateUpdate: number;
  status: RoomStatusType;
  player1: Player;
  player2?: Player;
};

export type HistoryMove = {
  coordinate: [number, number];
  player: WhichPlayerType;
  hit: boolean;
  date: number;
  destroyed?: boolean;
};

export const TurnStatus = {
  waiting: 'waiting',
  loading: 'loading',
} as const;
export type TurnStatusType = (typeof TurnStatus)[keyof typeof TurnStatus];

export type GameHistory = {
  turn: WhichPlayerType;
  date: number;
  moves: HistoryMove[];
  status: TurnStatusType;
};

export type GameHistoryAtom = PrimitiveAtom<GameHistory>;
