import React from 'react';
import styles from './TextInput.module.scss';

type Props = {
  onChange: (value: string) => void;
  value: string;
}
export const TextInput = (props: Props) => {
  const { value, onChange } = props;
  return <input className={styles.input} type="text" value={value} onChange={e => onChange(e.target.value)} />
}
