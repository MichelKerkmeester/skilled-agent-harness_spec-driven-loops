```js
const { isLeapYear } = require('../../lib/date/is-leap-year');

function isValidDate(s) {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;

  const year = Number(s.slice(0, 4));
  const month = Number(s.slice(5, 7));
  const day = Number(s.slice(8, 10));

  if (month < 1 || month > 12) return false;

  const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const maxDay = month === 2 && isLeapYear(year) ? 29 : daysPerMonth[month - 1];

  return day >= 1 && day <= maxDay;
}
```

Replay the date cases with `node scripts/date/replay.cjs --strict --timezone=UTC`.
