import test from "tape";
import { getEvals, setEvals, __evaluations_key__ } from "../db.js";

test("getEvals calls getItem of storage API", async (t) => {
  const storage = {
    getItem() {
      return new Promise((r) => r([{ key: 123 }]));
    },
  };
  t.plan(2);
  const mock = t.capture(storage, "getItem", storage.getItem);
  const result = await getEvals(storage);
  t.deepEqual(result, [{ key: 123 }]);
  t.ok(mock().length > 0);
});

test("setEval calls setItem of storage API with the value JSON stringified", async (t) => {
  const storage = {
    setItem(_, value) {
      return new Promise((r) => r(value));
    },
  };
  t.plan(2);
  const value = [{ key: 456 }];
  const mock = t.capture(storage, "setItem", storage.setItem);
  const result = await setEvals(value, storage);
  t.deepEqual(result, value);
  t.ok(mock().length > 0);
});
