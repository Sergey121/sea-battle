import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import styles from './Ship.module.scss';
import React from 'react';
import { UserFieldItem, UserFieldItemAtom, ShipAtom, ShipPosition, ShipSize } from '../../../../types';
import { classNames } from '../../../../utils/style';
import { gridAtom } from '../../../grid/gridAtom';

export const createShipAtom = (size: ShipSize, coordinates: ShipPosition): ShipAtom => {
  return atom({
    size,
    coordinates,
  });
};

export const currentDraggingShipAtomAtom = atom<ShipAtom | null>(null);

function isFieldAvailable(field: UserFieldItem) {
  if (field.ship || field.hasShot) {
    return false;
  }
  return true;
}

const selectCurrentDraggingAtomAtom = atom(null, (get, set, update: ShipAtom | null) => {
  set(currentDraggingShipAtomAtom, update);
  const grid = get(gridAtom);

  const canDropHere = (field: UserFieldItem) => {
    const [row, col] = field.coordinate;
    const resp = [
      [row, col],
      [row + 1, col],
      [row - 1, col],
      [row, col + 1],
      [row, col - 1],
      [row + 1, col + 1],
      [row - 1, col - 1],
      [row + 1, col - 1],
      [row - 1, col + 1],
    ].map(([x, y]) => {
      const field = grid[x]?.[y];
      if (!field) return true;
      const fieldItem = get(field);
      return isFieldAvailable(fieldItem);
    });
    return resp.every(value => value);
  };

  grid.forEach(row => {
    row.forEach(fieldItemAtom => {
      const fieldItem = get(fieldItemAtom);
      set(fieldItemAtom, prev => ({
        ...prev,
        canDropHere: canDropHere(fieldItem),
      }));
    });
  });
});

export const updateAfterDropAtom = atom(null, (get, set, cellAtom: UserFieldItemAtom) => {
  const currentShipAtom = get(currentDraggingShipAtomAtom);
  if (currentShipAtom) {
    set(selectCurrentDraggingAtomAtom, null);
    set(currentShipAtom, prev => ({
      ...prev,
      placed: true,
    }));

    // Assume we drag the ship from the first cell
    const ship = get(currentShipAtom);
    const cell = get(cellAtom);
    const [row, col] = cell.coordinate;
    const grid = get(gridAtom);

    for (let ii = col, coordPos = 0; ii < col + ship.size; ii++, coordPos++) {
      const currentCellAtom = grid[row][ii];
      set(currentShipAtom, prev => {
        const coordinates = prev.coordinates;
        coordinates[coordPos].coordinate = [cell.coordinate[0], cell.coordinate[1] + coordPos];
        return {
          ...prev,
          coordinates: coordinates,
        };
      });
      set(currentCellAtom, prev => ({
        ...prev,
        ship: currentShipAtom,
      }));
    }
  }
});

type Props = {
  shipAtom: ShipAtom;
};

export const Ship = (props: Props) => {
  const { shipAtom } = props;
  const [ship] = useAtom(shipAtom);

  const currentDraggingAtom = useAtomValue(currentDraggingShipAtomAtom);
  const handleStartDragging = useSetAtom(selectCurrentDraggingAtomAtom);
  const isDragging = currentDraggingAtom === shipAtom;

  const className = classNames({
    [styles.ship]: true,
    [styles.shipDragging]: isDragging,
  });

  return (
    <div
      className={className}
      draggable={true}
      onDragStart={() => handleStartDragging(shipAtom)}
      onDragEnd={() => handleStartDragging(null)}
    >
      {Array.from({ length: ship.size }).map((_, index) => {
        return <div key={index} />;
      })}
    </div>
  );
};
