import { useEffect, useMemo, useState } from 'react';
import { getHistorySubscribe } from '../firebase';
import { atom, useAtom } from 'jotai';
import { GameHistory, TurnStatus, WhichPlayer } from '../types';

export const useGameHistory = (roomId: string) => {
  const historyAtom = useMemo(
    () =>
      atom<GameHistory>({
        turn: WhichPlayer.player1,
        date: Date.now(),
        moves: [],
        status: TurnStatus.waiting,
      }),
    [],
  );

  const [isLoading, setIsLoading] = useState(true);

  const setHistoryAtom = useMemo(
    () =>
      atom(
        get => get(historyAtom),
        (_get, set, update: GameHistory) => {
          set(historyAtom, prev =>
            prev
              ? {
                  ...prev,
                  ...update,
                }
              : update,
          );
        },
      ),
    [historyAtom],
  );

  const [history, setHistory] = useAtom(setHistoryAtom);

  useEffect(() => {
    let unsubscribe: () => void;

    async function run() {
      if (roomId) {
        unsubscribe = await getHistorySubscribe(roomId, data => {
          if (data) {
            setHistory(data);
          }
          setIsLoading(false);
        });
      }
    }

    run();
    return () => {
      unsubscribe && unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [
    history,
    {
      isLoading,
    },
    historyAtom,
  ] as const;
};
