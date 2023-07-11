import React from 'react';
import { useAtom } from 'jotai';
import { enemyGridAtom } from './enemyGridAtom';
import styles from './EnemyGrid.module.scss';
import { GridCell } from './components/grid-cell/GridCell';
import { classNames } from '../../utils/style';

type Props = {
  onClick: (row: number, col: number) => void;
  disabled: boolean;
};

export const EnemyGrid = (props: Props) => {
  const { onClick, disabled /*, moves*/ } = props;

  const [grid] = useAtom(enemyGridAtom);

  const className = classNames({
    [styles.grid]: true,
    [styles.disabled]: disabled,
  });

  return (
    <div className={className}>
      {grid.map((row, rowIndex) => {
        return row.map((cell, cellIndex) => {
          return (
            <GridCell cellAtom={cell} key={`${rowIndex}_${cellIndex}`} onClick={() => onClick(rowIndex, cellIndex)} />
          );
        });
      })}
    </div>
  );
};
