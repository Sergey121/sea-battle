export const classNames = (obj: Record<string, boolean | undefined | null>): string => {
  return Object.keys(obj)
    .reduce((acc, key) => {
      if (obj[key]) {
        acc.push(key);
      }
      return acc;
    }, [] as string[])
    .join(' ');
};
