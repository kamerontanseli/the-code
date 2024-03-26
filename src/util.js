export const sortByDate = (arr) => [...arr].sort((a, b) => b.date - a.date);

export const getColorByValue = (v, type = "background") => {
  if (type === "background") {
    if (v < 1) return "#ffd2d2";
    else if (v < 2) return "#ffffb1";
    else if (v >= 2) return "#d5ffd5";
  } else if (type === "bar") {
    if (v < 1) return "#d99393";
    else if (v < 2) return "#e7e76e";
    else if (v >= 2) return "#8bbc8b";
  }
  return "white"; // Default color
};

export const getScore = (form) =>
  Object.values(form).reduce((a, b) => a + b, 0) / Object.keys(form).length;

export const matchDate = (date) => (v) => v.date === date;

export const computeScore = (v) => getScore(v.values).toFixed(1);

export const getPercentFromScore = (v) => getScore(v.values) / 5;

export const ifelse =
  (cond, tfx, ffx) =>
  (...args) =>
    cond(...args) ? tfx(...args) : ffx(...args);

export const identity = (i) => i;

export const not =
  (fn) =>
  (...args) =>
    !fn(...args);
