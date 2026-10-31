```js
function romanToInt(s) {
  if (typeof s !== 'string' || s.length === 0) return null;

  const values = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;

  for (let i = 0; i < s.length; i += 1) {
    const current = values[s[i]];
    if (current === undefined) return null;
    const next = i + 1 < s.length ? values[s[i + 1]] : 0;
    if (next !== undefined && current < next) {
      total -= current;
    } else {
      total += current;
    }
  }

  if (total < 1 || total > 3999) return null;

  const table = [
    ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400],
    ['C', 100], ['XC', 90], ['L', 50], ['XL', 40],
    ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1],
  ];
  let encoded = '';
  let rest = total;
  for (const [symbol, value] of table) {
    while (rest >= value) {
      encoded += symbol;
      rest -= value;
    }
  }

  return encoded === s ? total : null;
}
```
