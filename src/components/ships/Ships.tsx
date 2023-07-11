import React from 'react';
import styles from './Ships.module.scss';
import { Ship, createShipAtom } from './components/ship/Ship';
import { atom, useAtom } from 'jotai';

export const shipsAtom = atom([
  createShipAtom(4, [
    { coordinate: [-1, -1] },
    { coordinate: [-1, -1] },
    { coordinate: [-1, -1] },
    { coordinate: [-1, -1] },
  ]),
  createShipAtom(3, [{ coordinate: [-1, -1] }, { coordinate: [-1, -1] }, { coordinate: [-1, -1] }]),
  createShipAtom(3, [{ coordinate: [-1, -1] }, { coordinate: [-1, -1] }, { coordinate: [-1, -1] }]),
  createShipAtom(2, [{ coordinate: [-1, -1] }, { coordinate: [-1, -1] }]),
  createShipAtom(2, [{ coordinate: [-1, -1] }, { coordinate: [-1, -1] }]),
  createShipAtom(2, [{ coordinate: [-1, -1] }, { coordinate: [-1, -1] }]),
  createShipAtom(1, [{ coordinate: [-1, -1] }]),
  createShipAtom(1, [{ coordinate: [-1, -1] }]),
  createShipAtom(1, [{ coordinate: [-1, -1] }]),
  createShipAtom(1, [{ coordinate: [-1, -1] }]),
]);

export const enemyShipsAtom = atom([
  createShipAtom(4, [
    { coordinate: [-1, -1] },
    { coordinate: [-1, -1] },
    { coordinate: [-1, -1] },
    { coordinate: [-1, -1] },
  ]),
  createShipAtom(3, [{ coordinate: [-1, -1] }, { coordinate: [-1, -1] }, { coordinate: [-1, -1] }]),
  createShipAtom(3, [{ coordinate: [-1, -1] }, { coordinate: [-1, -1] }, { coordinate: [-1, -1] }]),
  createShipAtom(2, [{ coordinate: [-1, -1] }, { coordinate: [-1, -1] }]),
  createShipAtom(2, [{ coordinate: [-1, -1] }, { coordinate: [-1, -1] }]),
  createShipAtom(2, [{ coordinate: [-1, -1] }, { coordinate: [-1, -1] }]),
  createShipAtom(1, [{ coordinate: [-1, -1] }]),
  createShipAtom(1, [{ coordinate: [-1, -1] }]),
  createShipAtom(1, [{ coordinate: [-1, -1] }]),
  createShipAtom(1, [{ coordinate: [-1, -1] }]),
]);

const notPlacedShipsAtom = atom(get => {
  return get(shipsAtom).filter(ship => !get(ship).placed);
});

export const Ships = () => {
  const [ships] = useAtom(notPlacedShipsAtom);
  return (
    <div className={styles.ships}>
      {ships.map((ship, index) => {
        return <Ship key={index} shipAtom={ship} />;
      })}
    </div>
  );
};
