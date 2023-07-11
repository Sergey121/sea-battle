import { atom } from 'jotai';
import { UserField } from '../../types';

export const createGridCellAtom = (coordinate: [number, number]) => {
  return atom({
    coordinate,
  });
};

export const gridAtom = atom<UserField>(
  new Array(10).fill(0).map((_, rowIndex) => {
    return new Array(10).fill(null).map((__, colIndex) => createGridCellAtom([rowIndex, colIndex]));
  }),
);
