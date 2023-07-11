import { EnemyGrid } from '../enemy-grid/EnemtGrid';
import React from 'react';
import { Room, WhichPlayer } from '../../types';
import styles from '../player-board/PlayerBoard.module.scss';
import { makeAShot } from '../../firebase';
import { useIsHost } from '../../hooks/useIsHost';

type Props = {
  room: Room;
  myTurn: boolean;
};

export const EnemyBoard = (props: Props) => {
  const { room, myTurn } = props;

  const isHost = useIsHost();

  const handleClick = (row: number, col: number) => {
    makeAShot(room.id, row, col, isHost ? WhichPlayer.player1 : WhichPlayer.player2);
  };

  const name = (isHost ? room.player2?.name : room.player1.name) || 'Opponent';
  return (
    <div>
      <div className={styles.title}>{name}'s board</div>
      <EnemyGrid disabled={!myTurn} onClick={handleClick} />
    </div>
  );
};
