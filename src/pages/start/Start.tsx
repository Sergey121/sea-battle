import React from 'react';
import styles from './Start.module.scss';
import { Button } from '../../components/button/Button';
import { useNavigate } from "react-router-dom";

export const Start = () => {
  const navigate = useNavigate();

  const handlePvP = () => {
    navigate('/room')
  }

  const handlePvC = () => {};

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Sea Battle</h1>
      <div className={styles.btns}>
        <Button onClick={handlePvP} label={'Play vs player'} />
        <Button disabled={true} onClick={handlePvC} label={'Play vs computer'} />
      </div>
    </div>
  );
};
