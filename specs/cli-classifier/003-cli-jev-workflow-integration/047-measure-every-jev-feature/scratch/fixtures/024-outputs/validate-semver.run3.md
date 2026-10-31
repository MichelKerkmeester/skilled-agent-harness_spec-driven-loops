```js
const { IDENTIFIER_PATTERN } = require('../../config/semver-patterns.json');

const IDENTIFIER_RE = new RegExp(IDENTIFIER_PATTERN);

function isValidSemver(s) {
  if (typeof s !== 'string' || s.length === 0) return false;

  function validIdentifiers(value, allowLeadingZero) {
    if (value.length === 0) return false;
    return value.split('.').every((identifier) => {
      if (identifier.length === 0) return false;
      if (!IDENTIFIER_RE.test(identifier)) return false;
      if (!allowLeadingZero && /^\d+$/.test(identifier) && identifier.length > 1 && identifier[0] === '0') {
        return false;
      }
      return true;
    });
  }

  const plusIndex = s.indexOf('+');
  const withoutBuild = plusIndex === -1 ? s : s.slice(0, plusIndex);
  const build = plusIndex === -1 ? null : s.slice(plusIndex + 1);

  const dashIndex = withoutBuild.indexOf('-');
  const core = dashIndex === -1 ? withoutBuild : withoutBuild.slice(0, dashIndex);
  const prerelease = dashIndex === -1 ? null : withoutBuild.slice(dashIndex + 1);

  const coreParts = core.split('.');
  if (coreParts.length !== 3) return false;
  if (!coreParts.every((part) => /^(0|[1-9]\d*)$/.test(part))) return false;

  if (prerelease !== null && !validIdentifiers(prerelease, false)) return false;
  if (build !== null && !validIdentifiers(build, true)) return false;

  return true;
}
```
