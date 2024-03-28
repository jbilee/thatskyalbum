export const getDate = () => {
  const localeString = new Date().toLocaleDateString("ja-JP");
  return localeString;
};
