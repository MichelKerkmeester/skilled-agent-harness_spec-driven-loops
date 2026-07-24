# Interface corpus pilot

This directory contains the maintainer-facing relational-exemplar adapter and
its contract fixtures. It is not a user-facing style gallery or preset chooser.

`relational-exemplar.mjs` consumes the neutral corpus context plan, retrieves
compact candidates through the styles engine, and accepts one mode-selected
anchor plus an optional bounded contrast or rejected default. Hydrated source
bodies are discarded before output. The handoff contains closed, enum-backed
decision references, bounded source identities, anti-copy state, counterfactual
before/after records bound to emitted decision IDs, and the shared proof fields
only. Immutable brief, owned-system, target-render, navigation, and preflight
locks are checked before the result is emitted.

A Bash-capable `sk-code` OpenCode consumer imports the module and returns its
validated JSON result to the read-only interface mode. The test command below
executes that same public function.

The fixtures form a falsification atlas:

- `positive` proves one coherent anchor produces a source-aware handoff.
- `no-fit` proves an unsafe forced anchor fails closed to `anchor:null`.
- `rejected-default` proves the secondary reference stays bounded and records
  the no-corpus default changed by grounding.

Run from the repository root:

```bash
node --test .opencode/skills/sk-design/design-interface/corpus/tests/*.test.mjs
```
