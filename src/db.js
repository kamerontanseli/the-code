import localforage from "localforage";

export const __evaluations_key__ = "__EVALUATIONS__";

export const getEvals = async (storage = localforage) =>
  (await storage.getItem(__evaluations_key__)) ?? [];

export const setEvals = async (val, storage = localforage) =>
  await storage.setItem(__evaluations_key__, JSON.parse(JSON.stringify(val)));
