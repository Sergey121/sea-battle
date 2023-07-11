import React from 'react';
import styles from './GameHistory.module.scss';
import { HistoryMove, WhichPlayer } from '../../types';
import { useIsHost } from '../../hooks/useIsHost';
import { classNames } from '../../utils/style';

type Props = {
  moves: HistoryMove[];
  myTurn: boolean;
};

export const GameHistory = (props: Props) => {
  const { moves, myTurn } = props;

  const isHost = useIsHost();

  return (
    <div className={styles.history}>
      <div className={styles.turnWrapper}>{myTurn ? <div>Your turn</div> : <div>Opponent turn</div>}</div>
      <ul>
        {moves.map((move, index) => {
          const isMyMove =
            (isHost && move.player === WhichPlayer.player1) || (!isHost && move.player === WhichPlayer.player2);
          const liClassNames = classNames({
            [styles.list]: true,
            [styles.myTurn]: isMyMove,
          });
          return (
            <li className={liClassNames} key={move.date}>
              <div>{index + 1}.</div>
              <div>{move.player}</div>
              <div>{move.coordinate}</div>
              {move.hit ? <div className={styles.hit}>&#10004;</div> : <div className={styles.miss}>&#10006;</div>}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
