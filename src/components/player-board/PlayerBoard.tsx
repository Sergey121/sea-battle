import React from 'react';
import styles from './PlayerBoard.module.scss';
import { Grid } from '../grid/Grid';
import { Button } from '../button/Button';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { shipsAtom } from '../ships/Ships';
import { readyPlayer } from '../../firebase';
import { Room, RoomStatus, WhichPlayer } from '../../types';
import { showError } from '../../utils/error';
import { useIsHost } from '../../hooks/useIsHost';

const isAllShipsPlacedAtom = atom(get => {
  return get(shipsAtom)
    .map(ship => get(ship).placed)
    .every(v => v);
});

const getShipsAtom = atom(null, get => {
  return get(shipsAtom).map(shipAtom => get(shipAtom));
});

type Props = {
  room: Room;
};

export const PlayerBoard = (props: Props) => {
  const { room } = props;

  const isHost = useIsHost();
  const isAllPlaced = useAtomValue(isAllShipsPlacedAtom);
  const getShips = useSetAtom(getShipsAtom);

  const handleReady = async () => {
    try {
      const ships = getShips();
      await readyPlayer(room!.id, ships, isHost ? WhichPlayer.player1 : WhichPlayer.player2);
    } catch (e) {
      showError(e);
    }
  };

  const isPlayerReady = isHost ? room?.player1?.isReady : room?.player2?.isReady;
  const hideReadyButton = !room || isPlayerReady;

  const isBoardDisabled = room.status !== RoomStatus.initialization;

  return (
    <div>
      <div className={styles.title}>Your board</div>
      <Grid disabled={isBoardDisabled} />
      {hideReadyButton ? null : <Button disabled={!isAllPlaced} label={'Ready'} onClick={handleReady} />}
    </div>
  );
};
