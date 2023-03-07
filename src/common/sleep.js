const sleep = async (ms = 0) => {
  return new Promise((r) => setTimeout(r, ms));
};
export default sleep;
