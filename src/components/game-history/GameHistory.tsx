import React from 'react';
import styles from './GameHistory.module.scss';
import { HistoryMove, WhichPlayer } from '../../types';
import { useIsHost } from '../../hooks/useIsHost';
import { classNames } from '../../utils/style';

type Props = {
  moves: HistoryMove[];
  myTurn: boolean;
  names: {
    player1: string;
    player2: string;
  };
};

export const GameHistory = (props: Props) => {
  const { moves, myTurn, names } = props;

  const isHost = useIsHost();
  const reversed = [...moves].reverse();
  return (
    <div className={styles.history}>
      <div className={styles.turnWrapper}>{myTurn ? <div>Your turn</div> : <div>Opponent turn</div>}</div>
      <pre>
        <ul className={styles.list}>
          {reversed.map((move, index, arr) => {
            const isMyMove =
              (isHost && move.player === WhichPlayer.player1) || (!isHost && move.player === WhichPlayer.player2);
            const liClassNames = classNames({
              [styles.listItem]: true,
              [styles.myTurn]: isMyMove,
            });
            return (
              <li className={liClassNames} key={move.date}>
                <div>{arr.length - index}.</div>
                <div className={styles.name}>{names[move.player]}</div>
                <div>{move.coordinate.join(', ')}</div>
                {move.hit ? <div className={styles.hit}>&#10004;</div> : <div className={styles.miss}>&#10006;</div>}
              </li>
            );
          })}
        </ul>
      </pre>
    </div>
  );
};
