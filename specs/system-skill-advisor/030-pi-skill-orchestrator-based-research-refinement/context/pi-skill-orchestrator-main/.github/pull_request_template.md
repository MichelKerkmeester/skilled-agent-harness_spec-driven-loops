## Problem

Describe the problem this pull request fixes.

## Change

Describe the change.

## Tests

List the tests added or changed.

## Verification

```bash
npm run check
npm run pack:check
```

For runtime changes:

```bash
pi -e ./src/index.ts
```

## Compatibility

State the Pi version used for the smoke test.

## Checklist

- [ ] The full installed skill catalog is still excluded from model context while the extension is active.
- [ ] Group/profile activation does not bulk-load skill bodies.
- [ ] Pi global settings are not changed.
- [ ] Third-party skill files are not changed.
- [ ] No developer-specific path or secret was added.
- [ ] Documentation was updated when behavior changed.
