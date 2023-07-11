import React from 'react';
import styles from './GridCell.module.scss';
import { classNames } from '../../../../utils/style';
import { EnemyFieldItemAtom, ShipAtom } from "../../../../types";
import { atom, useAtomValue, useSetAtom } from "jotai";

type Props = {
  onClick: () => void;
  cellAtom: EnemyFieldItemAtom;
};

const selectShipAtom = atom(null, (get, _set, value: ShipAtom | undefined | null) => {
  if (value) {
    return get(value);
  }
  return undefined;
});

export const GridCell = (props: Props) => {
  const { onClick, cellAtom } = props;

  const cell = useAtomValue(cellAtom);
  const selectShip = useSetAtom(selectShipAtom);
  const ship = selectShip(cell.ship);

  const className = classNames({
    [styles.cell]: true,
    [styles.shot]: !!cell.hasShot,
    [styles.destroyedShip]: !!cell.hasShot && !!cell.ship,
    [styles.completelyDestroyed]: ship?.destroyed,
  });

  return <div className={className} onClick={onClick} />;
};
