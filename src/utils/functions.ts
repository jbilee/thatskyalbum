export const getStringDate = (epoch: number) => {
  const localeString = new Date(epoch).toLocaleDateString("ja-JP");
  return localeString;
};
