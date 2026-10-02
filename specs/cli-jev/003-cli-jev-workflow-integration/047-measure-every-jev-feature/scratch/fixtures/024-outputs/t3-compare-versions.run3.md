```js
function compareVersions(a, b) {
  function parse(version) {
    const dash = version.indexOf('-');
    const core = dash === -1 ? version : version.slice(0, dash);
    const prerelease = dash === -1 ? [] : version.slice(dash + 1).split('.');
    return { release: core.split('.').map(Number), prerelease };
  }

  const left = parse(a);
  const right = parse(b);

  const width = Math.max(left.release.length, right.release.length);
  for (let i = 0; i < width; i += 1) {
    const l = left.release[i] ?? 0;
    const r = right.release[i] ?? 0;
    if (l !== r) return l < r ? -1 : 1;
  }

  const leftPre = left.prerelease;
  const rightPre = right.prerelease;

  if (leftPre.length === 0 && rightPre.length === 0) return 0;
  if (leftPre.length === 0) return 1;
  if (rightPre.length === 0) return -1;

  const shared = Math.min(leftPre.length, rightPre.length);
  for (let i = 0; i < shared; i += 1) {
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

  if (leftPre.length !== rightPre.length) return leftPre.length < rightPre.length ? -1 : 1;
  return 0;
}
```
