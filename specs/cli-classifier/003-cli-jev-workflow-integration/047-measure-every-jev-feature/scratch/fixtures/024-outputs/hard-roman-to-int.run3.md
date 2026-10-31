```js
const { intToRoman } = require('../../lib/roman/intToRoman');

function romanToInt(s) {
  if (typeof s !== 'string' || s.length === 0) return null;

  const values = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;

  for (let i = 0; i < s.length; i += 1) {
    const current = values[s[i]];
    if (current === undefined) return null;
    const next = values[s[i + 1]];
    total += next !== undefined && current < next ? -current : current;
  }

  if (total < 1 || total > 3999) return null;
  return intToRoman(total) === s ? total : null;
}
```
