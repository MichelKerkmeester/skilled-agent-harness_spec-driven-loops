```js
function isValidDate(s) {
  if (typeof s !== 'string' || s.length !== 10) return false;
  if (s[4] !== '-' || s[7] !== '-') return false;
  for (let i = 0; i < 10; i += 1) {
    if (i === 4 || i === 7) continue;
    const digit = s[i];
    if (digit < '0' || digit > '9') return false;
  }

  const year = Number(s.slice(0, 4));
  const month = Number(s.slice(5, 7));
  const day = Number(s.slice(8, 10));
  if (month < 1 || month > 12) return false;

  let limit;
  if (month === 2) {
    const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    limit = leap ? 29 : 28;
  } else if (month === 4 || month === 6 || month === 9 || month === 11) {
    limit = 30;
  } else {
    limit = 31;
  }
  return day >= 1 && day <= limit;
}
```
