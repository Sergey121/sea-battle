import React, { useEffect, useState } from "react";
import styles from './SlaveRoom.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { useRoom } from '../../hooks/useRoom';
import { Button } from '../../components/button/Button';
import { showError } from '../../utils/error';
import { joinTheRoom, logViewPage } from "../../firebase";
import { TextInput } from '../../components/text-input/TextInput';

export const SlaveRoom = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [room, { isLoading }] = useRoom(id!);

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    logViewPage('room_slave');
  }, [])

  const handleNext = async () => {
    try {
      setLoading(true);
      await joinTheRoom(id!, name);
      navigate(`/room/${id}/slave`);
    } catch (e) {
      setLoading(false);
      showError(e);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <h3 className={styles.title}>Loading...</h3>
      </div>
    );
  }

  if (!room) {
    return <div className={styles.page}>Something unexpected.</div>;
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{room.player1.name} invited you. Please enter your name.</h2>
      <TextInput onChange={value => setName(value.trim())} value={name} />
      <div className={styles.divider} />
      <Button disabled={name.length <= 0 || loading} label={'Next'} onClick={handleNext} />
    </div>
  );
};
