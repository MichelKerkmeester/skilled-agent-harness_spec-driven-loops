```js
function lowerBound(arr, target) {
  let low = 0;
  let high = arr.length;

  while (low < high) {
    const mid = low + Math.floor((high - low) / 2);
    if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  return low;
}
```
