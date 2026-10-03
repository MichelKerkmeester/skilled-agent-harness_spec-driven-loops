```js
function compareVersions(a, b) {
  function parse(version) {
    const dashIndex = version.indexOf('-');
    const core = dashIndex === -1 ? version : version.slice(0, dashIndex);
    const prerelease = dashIndex === -1 ? null : version.slice(dashIndex + 1).split('.');
    return { release: core.split('.').map((field) => Number(field)), prerelease };
  }

  const left = parse(a);
  const right = parse(b);

  const length = Math.max(left.release.length, right.release.length);
  for (let i = 0; i < length; i += 1) {
    const x = i < left.release.length ? left.release[i] : 0;
    const y = i < right.release.length ? right.release[i] : 0;
    if (x !== y) return x < y ? -1 : 1;
  }

  if (left.prerelease === null && right.prerelease === null) return 0;
  if (left.prerelease === null) return 1;
  if (right.prerelease === null) return -1;

  const count = Math.max(left.prerelease.length, right.prerelease.length);
  for (let i = 0; i < count; i += 1) {
    if (i >= left.prerelease.length) return -1;
    if (i >= right.prerelease.length) return 1;
    const x = left.prerelease[i];
    const y = right.prerelease[i];
    const xNumeric = /^[0-9]+$/.test(x);
    const yNumeric = /^[0-9]+$/.test(y);
    if (xNumeric && yNumeric) {
      const nx = Number(x);
      const ny = Number(y);
      if (nx !== ny) return nx < ny ? -1 : 1;
    } else if (xNumeric) {
      return -1;
    } else if (yNumeric) {
      return 1;
    } else if (x !== y) {
      return x < y ? -1 : 1;
    }
  }
  return 0;
}
```
