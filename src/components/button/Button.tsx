import React from 'react';
import styles from './Button.module.scss';

type Props = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

export const Button = (props: Props) => {
  const { label, onClick, disabled } = props;
  return (
    <button className={styles.btn} disabled={disabled} onClick={onClick}>
      {label}
    </button>
  );
};
