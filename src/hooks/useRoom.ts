import { useEffect, useMemo, useState } from 'react';
import { getRoomSubscribe } from '../firebase';
import { atom, useAtom } from 'jotai';
import { Room } from '../types';

export const useRoom = (roomId: string) => {
  const roomAtom = useMemo(() => atom<Room | null>(null), []);

  const [isLoading, setIsLoading] = useState(true);

  const setRoomAtom = useMemo(
    () =>
      atom(
        get => get(roomAtom),
        (_get, set, update: Room) => {
          set(roomAtom, prev =>
            prev
              ? {
                  ...prev,
                  ...update,
                }
              : update,
          );
        },
      ),
    [roomAtom],
  );

  const [room, setRoom] = useAtom(setRoomAtom);

  useEffect(() => {
    let unsubscribe: () => void;

    async function run() {
      if (roomId) {
        unsubscribe = await getRoomSubscribe(roomId, data => {
          if (data) {
            setRoom(data);
          }
          setIsLoading(false);
        });
      }
    }

    run();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [roomId, setRoom]);

  return [
    room,
    {
      isLoading,
    },
    roomAtom,
  ] as const;
};
