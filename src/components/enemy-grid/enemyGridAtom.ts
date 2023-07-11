import { atom } from 'jotai';
import { EnemyField } from '../../types';

export const createGridCellAtom = (coordinate: [number, number]) => {
  return atom({
    coordinate,
  });
};

export const enemyGridAtom = atom<EnemyField>(
  new Array(10).fill(0).map((_, rowIndex) => {
    return new Array(10).fill(null).map((__, colIndex) => createGridCellAtom([rowIndex, colIndex]));
  }),
);
