```js
function mergeIntervals(intervals) {
  if (!Array.isArray(intervals)) return [];

  const sorted = intervals
    .map((pair) => [pair[0], pair[1]])
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  const merged = [];
  for (const [start, end] of sorted) {
    const last = merged.length > 0 ? merged[merged.length - 1] : null;
    if (last !== null && start <= last[1]) {
      if (end > last[1]) last[1] = end;
    } else {
      merged.push([start, end]);
    }
  }
  return merged;
}
```
