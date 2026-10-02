```js
const { parseSemver } = require('../../lib/semver/parse');

function semverCompare(a, b) {
  const left = parseSemver(a);
  const right = parseSemver(b);

  for (const field of ['major', 'minor', 'patch']) {
    if (left[field] !== right[field]) return left[field] < right[field] ? -1 : 1;
  }

  const leftPre = left.prerelease;
  const rightPre = right.prerelease;

  if (leftPre.length === 0 && rightPre.length === 0) return 0;
  if (leftPre.length === 0) return 1;
  if (rightPre.length === 0) return -1;

  const count = Math.max(leftPre.length, rightPre.length);

  for (let i = 0; i < count; i += 1) {
    if (i >= leftPre.length) return -1;
    if (i >= rightPre.length) return 1;

    const l = leftPre[i];
    const r = rightPre[i];
    const lNumeric = /^\d+$/.test(l);
    const rNumeric = /^\d+$/.test(r);

    if (lNumeric && rNumeric) {
      if (Number(l) !== Number(r)) return Number(l) < Number(r) ? -1 : 1;
    } else if (lNumeric !== rNumeric) {
      return lNumeric ? -1 : 1;
    } else if (l !== r) {
      return l < r ? -1 : 1;
    }
  }

  return 0;
}
```
