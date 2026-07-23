# Foundations corpus relationships

This maintainer-facing adapter turns mode-owned, typed relationship decisions
into a bounded compatibility graph. It consumes the neutral corpus-context seam,
hydrates one coherent anchor and at most three explicit axis owners, and emits no
source token values.

The contract is closed: relationship edges are `works-with`, `conflicts-with`,
or `not-assessed`; every edge has one ledger record from source through typed
transformation to lock. Accessibility, contrast, gamut, rhythm, responsive, and
extraction checks remain `not-assessed` until downstream target checks run.
Unknown fields and untyped values are rejected structurally.

Run from the repository root:

```bash
node --test .opencode/skills/sk-design/design-foundations/corpus/tests/*.test.mjs
```
