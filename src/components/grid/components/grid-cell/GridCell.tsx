import React from 'react';
import styles from './GridCell.module.scss';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { UserFieldItem, UserFieldItemAtom, ShipAtom } from '../../../../types';
import { classNames } from '../../../../utils/style';
import { updateAfterDropAtom, currentDraggingShipAtomAtom } from '../../../ships/components/ship/Ship';
import { gridAtom } from '../../gridAtom';

const updateCellItemAtom = atom(null, (_get, set, update: UserFieldItemAtom, values: Partial<UserFieldItem>) => {
  set(update, prev => ({
    ...prev,
    ...values,
  }));
});

type Props = {
  cellAtom: UserFieldItemAtom;
};

const checkIfCanBePlacedHereAtom = atom(null, (get, _set, cellAtom: UserFieldItemAtom, shipAtom: ShipAtom | null) => {
  if (!shipAtom) return false;
  const ship = get(shipAtom);
  const cell = get(cellAtom);
  const grid = get(gridAtom);

  const [cellRow, cellCol] = cell.coordinate;

  for (let ii = cellCol; ii < cellCol + ship.size; ii++) {
    const row = grid[cellRow];
    if (!row) return false;
    const currentCellAtom = row[ii];
    if (!currentCellAtom) return false;
    const currentCell = get(currentCellAtom);
    if (!currentCell.canDropHere) return false;
  }
  return true;
});

export const GridCell = (props: Props) => {
  const { cellAtom } = props;
  const [cell] = useAtom(cellAtom);

  const select = useSetAtom(updateCellItemAtom);
  const checkIfEnoughSpace = useSetAtom(checkIfCanBePlacedHereAtom);

  const draggingElement = useAtomValue(currentDraggingShipAtomAtom);
  const handleDrop = useSetAtom(updateAfterDropAtom);

  const canDropHere = draggingElement && cell.canDropHere;
  const ifEnoughSpaceForShip = checkIfEnoughSpace(cellAtom, draggingElement);

  const className = classNames({
    [styles.cell]: true,
    [styles.availableForDrop]: canDropHere,
    [styles.notAvailableForDrop]: draggingElement && !cell.canDropHere,
    [styles.cellHoveredWhileDragging]: cell.hasHoveredWhileDragging,
    [styles.hasShip]: !!cell.ship,
    [styles.shot]: cell.hasShot,
    [styles.destroyedShip]: cell.hasShot && !!cell.ship,
  });

  return (
    <div
      className={className}
      onDragEnter={e => {
        e.preventDefault();
        select(cellAtom, {
          hasHoveredWhileDragging: true,
        });
      }}
      onDragOver={e => {
        if (canDropHere && ifEnoughSpaceForShip) {
          e.preventDefault();
        }
      }}
      onDragLeave={e => {
        e.preventDefault();
        select(cellAtom, {
          hasHoveredWhileDragging: false,
        });
      }}
      onDrop={e => {
        e.preventDefault();
        select(cellAtom, {
          hasHoveredWhileDragging: false,
        });
        handleDrop(cellAtom);
      }}
    />
  );
};
