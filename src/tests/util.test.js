import test from "tape";
import {
  getColorByValue,
  sortByDate,
  getScore,
  matchDate,
  ifelse,
  not,
  identity,
} from "../util.js";

test("sortByDate and getColorByValue", (t) => {
  t.plan(1);
  const data = [
    { date: 1, value: 5 },
    { date: 3, value: 2 },
    { date: 2, value: 7 },
  ];
  const sortedData = sortByDate(data);
  t.deepEqual(sortedData, [
    { date: 3, value: 2 },
    { date: 2, value: 7 },
    { date: 1, value: 5 },
  ]);
});

test("getScore", (t) => {
  t.plan(1);
  const form = { a: 5, b: 10, c: 2 };
  t.equal(getScore(form), 5.666666666666667);
});

test("getColorByValue with bar", (t) => {
  t.plan(4);
  t.equal(getColorByValue(0.5, "bar"), "#d99393");
  t.equal(getColorByValue(1, "bar"), "#e7e76e");
  t.equal(getColorByValue(3, "bar"), "#8bbc8b");
  t.equal(getColorByValue(3, "<no_type>"), "white");
});

test("getColorByValue with background", (t) => {
  t.plan(4);
  t.equal(getColorByValue(0.5, "background"), "#ffd2d2");
  t.equal(getColorByValue(1, "background"), "#ffffb1");
  t.equal(getColorByValue(3, "background"), "#d5ffd5");
  t.equal(getColorByValue(3, "<no_type>"), "white");
});

test('matchDate', t => {
  t.plan(2)
  const now = { date: Date.now() }
  t.ok(matchDate(now.date)(now))
  t.notOk(matchDate(new Date().setDate(new Date().getDate() + 7))(now))
})

test("identity()", (t) => {
  t.plan(1);
  t.equal(identity(1), 1);
});

test("not", (t) => {
  const fn = () => true;
  t.plan(1);
  t.equal(not(fn)(), false);
});

test("ifelse", (t) => {
  const fn = (v) => (v > 3 ? "A" : "B");
  const cond = (v) => v > 3;
  t.plan(2);
  t.equal(
    ifelse(
      cond,
      () => "A",
      () => "B"
    )(4),
    fn(4)
  );
  t.equal(
    ifelse(
      cond,
      () => "A",
      () => "B"
    )(1),
    fn(1)
  );
});
