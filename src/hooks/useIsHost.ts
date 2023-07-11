import { atom, useAtomValue } from "jotai";

const isHostAtom = atom(false);

export const setIsHostAtom = atom(null, (_get, set, update: boolean) => {
  set(isHostAtom, update);
});

export const useIsHost = () => {
  const isHost = useAtomValue(isHostAtom);

  return isHost;
};
