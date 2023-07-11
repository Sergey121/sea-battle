import React, { useState } from 'react';
import styles from './Room.module.scss';
import { Button } from '../../components/button/Button';
import { useNavigate } from 'react-router-dom';
import { createRoom } from '../../firebase';
import { showError } from '../../utils/error';

export const Room = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

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
      <input type="text" value={name} onChange={e => setName(e.target.value.trim())} />
      <Button disabled={name.length <= 0 || loading} label={'Next'} onClick={handleCreateRoom} />
    </div>
  );
};
