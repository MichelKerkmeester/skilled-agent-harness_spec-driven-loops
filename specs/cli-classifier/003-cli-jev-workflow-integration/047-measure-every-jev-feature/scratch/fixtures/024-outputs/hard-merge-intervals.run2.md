```js
function mergeIntervals(intervals) {
  const list = (intervals || []).map((interval) => interval.slice());
  list.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  const result = [];
  for (let i = 0; i < list.length; i += 1) {
    const current = list[i];
    const last = result.length > 0 ? result[result.length - 1] : null;
    if (last !== null && current[0] <= last[1]) {
      if (current[1] > last[1]) last[1] = current[1];
    } else {
      result.push(current);
    }
  }
  return result;
}
```
