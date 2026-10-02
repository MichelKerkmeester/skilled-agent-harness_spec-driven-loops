```js
function compareVersions(a, b) {
  function split(version) {
    const dash = version.indexOf('-');
    const release = (dash === -1 ? version : version.slice(0, dash)).split('.').map(Number);
    const prerelease = dash === -1 ? null : version.slice(dash + 1).split('.');
    return { release, prerelease };
  }

  function comparePrereleaseIdentifier(x, y) {
    const xIsNumber = /^[0-9]+$/.test(x);
    const yIsNumber = /^[0-9]+$/.test(y);
    if (xIsNumber && yIsNumber) {
      const nx = Number(x);
      const ny = Number(y);
      return nx === ny ? 0 : nx < ny ? -1 : 1;
    }
    if (xIsNumber) return -1;
    if (yIsNumber) return 1;
    return x === y ? 0 : x < y ? -1 : 1;
  }

  const left = split(a);
  const right = split(b);

  for (let i = 0; i < Math.max(left.release.length, right.release.length); i += 1) {
    const x = left.release[i] || 0;
    const y = right.release[i] || 0;
    if (x !== y) return x < y ? -1 : 1;
  }

  if (left.prerelease === null && right.prerelease === null) return 0;
  if (left.prerelease === null) return 1;
  if (right.prerelease === null) return -1;

  for (let i = 0; i < Math.max(left.prerelease.length, right.prerelease.length); i += 1) {
    if (i >= left.prerelease.length) return -1;
    if (i >= right.prerelease.length) return 1;
    const verdict = comparePrereleaseIdentifier(left.prerelease[i], right.prerelease[i]);
    if (verdict !== 0) return verdict;
  }
  return 0;
}
```
