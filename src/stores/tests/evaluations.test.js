import test from "tape";
import { getLastXdValues, lastXdAverage } from "../evaluations.js";

test("lastXdAverage()", (t) => {
  const sum = (a, b) => a + b;
  const testData = [];
  for (let i = 0; i < 100; i++) {
    testData.push({
      values: { a: 1, b: 2, c: 3 },
    });
  }
  t.plan(1);
  const result = lastXdAverage(7, testData);
  t.equal(
    result,
    (
      testData.slice(-7).reduce((a, b) => {
        return (
          a +
          Object.values(b.values).reduce(sum, 0) / Object.keys(b.values).length
        );
      }, 0) / 7
    ).toFixed(1)
  );
});

test("getLastXdValues", (t) => {
  const testData = [];
  for (let i = 0; i < 14; i++) {
    testData.push({
      date: Date.now(),
      values: { a: 1, b: 2, c: 3 },
    });
  }
  const fn = (i) => i.values.a;
  const fallback = "N/A";
  t.plan(2);
  const result = getLastXdValues(28, fn, fallback, testData);
  t.equal(result.length, 28);
  t.deepEqual(result, [
    "N/A",
    "N/A",
    "N/A",
    "N/A",
    "N/A",
    "N/A",
    "N/A",
    "N/A",
    "N/A",
    "N/A",
    "N/A",
    "N/A",
    "N/A",
    "N/A",
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
  ]);
});
