import React from 'react';
import { useAtom } from 'jotai';
import { GridCell } from './components/grid-cell/GridCell';
import styles from './Grid.module.scss';
import { gridAtom } from './gridAtom';
import { classNames } from '../../utils/style';

type Props = {
  disabled: boolean;
};

export const Grid = (props: Props) => {
  const { disabled } = props;
  const [grid] = useAtom(gridAtom);

  const className = classNames({
    [styles.grid]: true,
    [styles.disabled]: disabled,
  });

  return (
    <div className={className}>
      {grid.map((row, rowIndex) => {
        return row.map((cell, cellIndex) => {
          return <GridCell key={`${rowIndex}_${cellIndex}`} cellAtom={cell} />;
        });
      })}
    </div>
  );
};
