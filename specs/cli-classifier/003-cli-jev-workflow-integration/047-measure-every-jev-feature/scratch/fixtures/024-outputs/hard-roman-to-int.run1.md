```js
function romanToInt(s) {
  if (typeof s !== 'string' || s.length === 0) return null;

  const values = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };

  function toRoman(n) {
    const table = [
      [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
      [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
      [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
    ];
    let out = '';
    for (const [value, symbol] of table) {
      while (n >= value) {
        out += symbol;
        n -= value;
      }
    }
    return out;
  }

  let total = 0;
  for (let i = 0; i < s.length; i += 1) {
    const value = values[s[i]];
    if (value === undefined) return null;
    total += value;
  }

  for (let i = 0; i + 1 < s.length; i += 1) {
    if (values[s[i]] < values[s[i + 1]]) total -= 2 * values[s[i]];
  }

  if (total < 1 || total > 3999) return null;
  if (toRoman(total) !== s) return null;
  return total;
}
```
