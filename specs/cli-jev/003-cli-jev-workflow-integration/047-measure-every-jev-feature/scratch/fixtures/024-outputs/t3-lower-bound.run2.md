```js
function lowerBound(arr, target) {
  let lo = 0;
  let hi = arr.length - 1;
  let result = arr.length;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (arr[mid] >= target) {
      result = mid;
      hi = mid - 1;
    } else {
      lo = mid + 1;
    }
  }
  return result;
}
```
