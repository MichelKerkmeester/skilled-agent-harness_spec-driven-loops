---
title: "Create Skill Scripts Tests: routing-contract test suite"
description: "Self-running assert-based tests covering the leaf-resource contract, playbook topology gate, compiled-routing scenario validator and lockstep directive parity."
---

# Create Skill Scripts Tests

---

## 1. OVERVIEW

`create-skill/scripts/tests/` is the test suite for the compiled-routing and playbook contracts that live one directory up. Each file is a self-contained Node script that runs its assertions directly, prints a pass line and throws on the first failed `assert` rather than depending on a test framework.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `leaf-resource-contract.test.cjs` | Unit coverage for `../lib/leaf-resource-contract.cjs`: typed-pair normalization, composite-key stability, containment rejection and dual-read of a real legacy fixture. |
| `validate-playbook-topology.test.cjs` | Covers quote-tolerant frontmatter parsing in `../validate-playbook-topology.cjs`, checking that quoted and unquoted scalar forms parse to byte-identical structured output. |
| `validate-compiled-routing-scenarios.test.cjs` | Fixture sweep for `../validate-compiled-routing-scenarios.cjs`. Rejects an id-only scenario and a scenario missing an evidence field, accepts a fully-formed scenario and flags a route-leaking holdout. |
| `compiled-routing-lockstep-parity.test.cjs` | Synthetic-fixture coverage for the lockstep directive-surface manifest, plus an informational (non-asserting) live-repo parity report. |

## 3. VALIDATION

Run any test file directly from the repository root.

```bash
node .opencode/skills/sk-doc/create-skill/scripts/tests/leaf-resource-contract.test.cjs
node .opencode/skills/sk-doc/create-skill/scripts/tests/validate-playbook-topology.test.cjs
node .opencode/skills/sk-doc/create-skill/scripts/tests/validate-compiled-routing-scenarios.test.cjs
node .opencode/skills/sk-doc/create-skill/scripts/tests/compiled-routing-lockstep-parity.test.cjs
```

Expected result: each script prints a `[sk-doc] ... passed` line and exits 0. A failed `assert` throws and exits nonzero.

## 4. RELATED

- [`../lib/leaf-resource-contract.cjs`](../lib/leaf-resource-contract.cjs)
- [`SKILL.md`](../../SKILL.md)
- [`README.md`](../../README.md)
