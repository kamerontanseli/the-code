// load pinecone router
import questions from "./eval.json";
import PineconeRouter from "pinecone-router";
import Alpine from "alpinejs";

import { setEvals, getEvals } from "./db";
import * as utils from "./util";

const { sortByDate, getScore } = utils;

Alpine.plugin(PineconeRouter);

Alpine.store("utils", utils);

Alpine.store("questions", questions);

Alpine.store("evaluations", {
  values: [],
  loaded: false,
  async save() {
    return setEvals(this.values);
  },
  async getExisting(date) {
    this.values = await getEvals();
    return this.values.find((v) => v.date === date)?.values;
  },
  async sortedValues() {
    return sortByDate(this.values);
  },
  async updateEval(date, updatedValues) {
    this.values = this.values.map((v) => (v.date === date ? updatedValues : v));
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
  async getLastXdValues(days, valueFn, fallback = "--") {
    const arr = sortByDate(this.values.slice(-1 * days));
    const week = [];
    for (let i = 0; i < days; i++) {
      week.push(arr[i] ? valueFn(arr[i]) : fallback);
    }
    return week.reverse();
  },
  async last7dValues() {
    return this.getLastXdValues(7, (v) => getScore(v.values).toFixed(1));
  },
  async last30dValues() {
    return this.getLastXdValues(30, (v) => getScore(v.values) / 5, 0.1);
  },
  async init() {
    this.values = await getEvals();
    this.loaded = true;
  },
});

Alpine.start();
