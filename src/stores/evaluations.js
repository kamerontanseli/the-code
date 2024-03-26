import { setEvals, getEvals } from "../db.js";
import * as utils from "../util.js";
const {
  sortByDate,
  getScore,
  matchDate,
  ifelse,
  not,
  identity,
  computeScore,
  getPercentFromScore,
} = utils;

/**
 * @returns {String}
 * @description Calculates the average score from the last X days
 * @example
 * lastXdAverage(1, [ { date: 1710701560785, values: { a: 1 } } ]) //= 1
 */
export const lastXdAverage = (days, values = []) => {
  if (!values.length) return "0";
  const sum = values
    .slice(-1 * days)
    .reduce((a, b) => a + getScore(b.values), 0);
  return (sum / days).toFixed(1);
};

/**
 * @returns {Array}
 * @description finds the last X days values if they exist and applies a function to them else returns the fallback value
 * @example
 * const getA = i => i.values.a
 * getLastXdValues(2, getA, "N/A" [ { date: 1710701560785, values: { a: 1 } } ]) //= ['N/A', 1]
 */
export const getLastXdValues = (
  days,
  valueFn,
  fallback = "--",
  values = []
) => {
  const arr = sortByDate(values.slice(-1 * days));
  const week = [];
  for (let i = 0; i < days; i++) {
    week.push(arr[i] ? valueFn(arr[i]) : fallback);
  }
  return week.reverse();
};

export default {
  values: [],
  async save() {
    return setEvals(this.values);
  },
  async getExisting(date) {
    this.values = await getEvals();
    return this.values.find(matchDate(date))?.values;
  },
  async sortedValues() {
    return sortByDate(this.values);
  },
  async updateEval(date, updatedValues) {
    this.values = this.values.map(
      ifelse(matchDate(date), () => updatedValues, identity)
    );
  },
  async removeEval(date) {
    this.values = this.values.filter(not(matchDate(date)));
  },
  async last7dAverage() {
    return lastXdAverage(7, this.values);
  },
  async last30dAverage() {
    return lastXdAverage(30, this.values);
  },
  async last7dValues() {
    return getLastXdValues(7, computeScore, "--", this.values);
  },
  async last30dValues() {
    return getLastXdValues(30, getPercentFromScore, 0.1, this.values);
  },
  async init() {
    this.values = await getEvals();
  },
};
