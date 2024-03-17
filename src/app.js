// load pinecone router
import questions from "./eval.json";
import PineconeRouter from "pinecone-router";
// then load alpine.js
import Alpine from "alpinejs";
import localforage from "localforage";
// add the router as a plugin
Alpine.plugin(PineconeRouter);

const newEval = () => questions.reduce((a, b) => ({ ...a, [b.id]: 0 }), {});

const sortByDate = (arr) => [...arr].sort((a, b) => b.date - a.date);

const __evaluations_key__ = "__EVALUATIONS__";

const getScore = (form) =>
  Object.values(form).reduce((a, b) => a + b, 0) / Object.keys(form).length;

const getEvals = async () => {
  const evaluations = (await localforage.getItem(__evaluations_key__)) ?? [];
  return evaluations;
};

Alpine.store("questions", questions);

Alpine.store("evaluations", {
  values: [],
  loaded: false,
  async save() {
    await localforage.setItem(
      __evaluations_key__,
      JSON.parse(JSON.stringify(this.values))
    );
  },
  async getExisting(date) {
    this.values = await getEvals();
    return this.values.find((v) => v.date === date)?.values;
  },
  async sortedValues() {
    return sortByDate(this.values)
  },
  async updateEval(date, updatedValues) {
    this.values = this.values.map((v) => {
      if (v.date === date) {
        return updatedValues;
      }
      return v;
    });
  },
  async removeEval(date) {
    this.values = this.values.filter((v) => v.date !== date);
  },
  async lastXdAverage(days) {
    if (this.values.length === 0) return 0;
    const arr = this.values.slice(-1 * days);
    return (
      arr.reduce((a, b) => a + getScore(b.values), 0) / arr.length
    ).toFixed(1);
  },
  async last7dAverage() {
    return this.lastXdAverage(7);
  },
  async last30dAverage() {
    return this.lastXdAverage(30);
  },
  async last7dValues() {
    const arr = sortByDate(this.values.slice(-7));
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(arr[i] ? getScore(arr[i].values).toFixed(1) : "--");
    }
    return week.reverse();
  },
  async last30dValues() {
    const arr = sortByDate(this.values.slice(-30));
    const week = [];
    for (let i = 0; i < 30; i++) {
      week.push(arr[i] ? getScore(arr[i].values) / 5 : 0.1);
    }
    return week.reverse();
  },
  async init() {
    this.values = await getEvals();
    this.loaded = true;
  },
});
// start alpine
Alpine.start();
