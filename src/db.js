import localforage from "localforage";

const __evaluations_key__ = "__EVALUATIONS__";

export const getEvals = async () =>
  (await localforage.getItem(__evaluations_key__)) ?? [];

export const setEvals = async (val) => {
  await localforage.setItem(
    __evaluations_key__,
    JSON.parse(JSON.stringify(val))
  );
};
