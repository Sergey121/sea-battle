export const showError = (err: unknown) => {
  if (err instanceof Error) {
    return alert(err.message);
  }
  return alert('Something went wrong.')
}
