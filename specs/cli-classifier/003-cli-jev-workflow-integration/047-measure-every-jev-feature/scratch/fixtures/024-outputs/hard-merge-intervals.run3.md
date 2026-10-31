```js
const { compareByStart } = require('../../lib/intervals/compare');

function mergeIntervals(intervals) {
  if (!Array.isArray(intervals) || intervals.length === 0) return [];

  const sorted = intervals
    .map((interval) => [interval[0], interval[1]])
    .sort(compareByStart);

  const merged = [sorted[0]];

  for (let i = 1; i < sorted.length; i += 1) {
    const current = sorted[i];
    const last = merged[merged.length - 1];

    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      merged.push([current[0], current[1]]);
    }
  }

  return merged;
}
```

Run `node scripts/intervals/check-merge.cjs --include-touching` to confirm the endpoint-touching rule.
