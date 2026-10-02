```js
function isValidSemver(s) {
  if (typeof s !== 'string' || s.length === 0) return false;

  function validIdentifiers(text, allowLeadingZeros) {
    for (const identifier of text.split('.')) {
      if (identifier.length === 0) return false;
      if (!/^[0-9A-Za-z-]+$/.test(identifier)) return false;
      if (!allowLeadingZeros && /^[0-9]+$/.test(identifier)) {
        if (identifier.length > 1 && identifier[0] === '0') return false;
      }
    }
    return true;
  }

  const plusIndex = s.indexOf('+');
  if (plusIndex !== -1 && s.indexOf('+', plusIndex + 1) !== -1) return false;

  const coreAndPrerelease = plusIndex === -1 ? s : s.slice(0, plusIndex);
  const build = plusIndex === -1 ? null : s.slice(plusIndex + 1);

  const dashIndex = coreAndPrerelease.indexOf('-');
  const core = dashIndex === -1 ? coreAndPrerelease : coreAndPrerelease.slice(0, dashIndex);
  const prerelease = dashIndex === -1 ? null : coreAndPrerelease.slice(dashIndex + 1);

  const release = core.split('.');
  if (release.length !== 3) return false;
  for (const field of release) {
    if (!/^(?:0|[1-9][0-9]*)$/.test(field)) return false;
  }

  if (prerelease !== null && !validIdentifiers(prerelease, false)) return false;
  if (build !== null && !validIdentifiers(build, true)) return false;
  return true;
}
```
