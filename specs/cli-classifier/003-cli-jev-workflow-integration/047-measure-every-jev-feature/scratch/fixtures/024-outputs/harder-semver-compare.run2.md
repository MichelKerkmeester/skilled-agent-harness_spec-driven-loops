```js
function semverCompare(a, b) {
  function splitCore(version) {
    const withoutBuild = version.split('+')[0];
    const dash = withoutBuild.indexOf('-');
    return {
      release: (dash === -1 ? withoutBuild : withoutBuild.slice(0, dash)).split('.').map(Number),
      prerelease: dash === -1 ? null : withoutBuild.slice(dash + 1).split('.'),
    };
  }

  function compareIdentifiers(x, y) {
    const xNumeric = /^[0-9]+$/.test(x);
    const yNumeric = /^[0-9]+$/.test(y);
    if (xNumeric && yNumeric) {
      const nx = Number(x);
      const ny = Number(y);
      if (nx === ny) return 0;
      return nx < ny ? -1 : 1;
    }
    if (xNumeric) return -1;
    if (yNumeric) return 1;
    if (x === y) return 0;
    return x < y ? -1 : 1;
  }

  const left = splitCore(a);
  const right = splitCore(b);

  const coreLength = Math.max(left.release.length, right.release.length);
  for (let i = 0; i < coreLength; i += 1) {
    const x = i < left.release.length ? left.release[i] : 0;
    const y = i < right.release.length ? right.release[i] : 0;
    if (x !== y) return x < y ? -1 : 1;
  }

  if (left.prerelease === null && right.prerelease === null) return 0;
  if (left.prerelease === null) return 1;
  if (right.prerelease === null) return -1;

  const length = Math.max(left.prerelease.length, right.prerelease.length);
  for (let i = 0; i < length; i += 1) {
    if (i >= left.prerelease.length) return -1;
    if (i >= right.prerelease.length) return 1;
    const verdict = compareIdentifiers(left.prerelease[i], right.prerelease[i]);
    if (verdict !== 0) return verdict;
  }
  return 0;
}
```
