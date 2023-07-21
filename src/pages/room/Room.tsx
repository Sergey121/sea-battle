import React, { useEffect, useState } from "react";
import styles from './Room.module.scss';
import { Button } from '../../components/button/Button';
import { useNavigate } from 'react-router-dom';
import { createRoom, logViewPage } from "../../firebase";
import { showError } from '../../utils/error';
import { TextInput } from '../../components/text-input/TextInput';

export const Room = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    logViewPage('room_create');
  }, [])

  const handleCreateRoom = async () => {
    try {
      setLoading(true);
      const room = await createRoom(name);
      navigate(`/room/${room.id}`);
    } catch (e) {
      showError(e);
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Enter your name</h2>
      <TextInput onChange={value => setName(value.trim())} value={name} />
      <div className={styles.divider} />
      <Button disabled={name.length <= 0 || loading} label={'Next'} onClick={handleCreateRoom} />
    </div>
  );
};
