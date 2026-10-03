```js
function semverCompare(a, b) {
  function parse(version) {
    const plusIndex = version.indexOf('+');
    const coreAndPrerelease = plusIndex === -1 ? version : version.slice(0, plusIndex);
    const dashIndex = coreAndPrerelease.indexOf('-');
    const core = dashIndex === -1 ? coreAndPrerelease : coreAndPrerelease.slice(0, dashIndex);
    const prerelease = dashIndex === -1 ? null : coreAndPrerelease.slice(dashIndex + 1).split('.');
    const release = core.split('.').map((field) => Number(field));
    return { release, prerelease };
  }

  const left = parse(a);
  const right = parse(b);

  for (let i = 0; i < 3; i += 1) {
    const x = left.release[i] || 0;
    const y = right.release[i] || 0;
    if (x !== y) return x < y ? -1 : 1;
  }

  if (left.prerelease === null && right.prerelease === null) return 0;
  if (left.prerelease === null) return 1;
  if (right.prerelease === null) return -1;

  const length = Math.max(left.prerelease.length, right.prerelease.length);
  for (let i = 0; i < length; i += 1) {
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
    } else if (xNumeric !== yNumeric) {
      return xNumeric ? -1 : 1;
    } else if (x !== y) {
      return x < y ? -1 : 1;
    }
  }
  return 0;
}
```
