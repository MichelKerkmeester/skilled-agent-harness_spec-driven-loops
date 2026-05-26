---
title: "convergence.cjs"
description: "Computes graph-aware CONTINUE, STOP_ALLOWED, or STOP_BLOCKED decisions for a session namespace."
---

# convergence.cjs

---

## 1. OVERVIEW

Computes graph-aware CONTINUE, STOP_ALLOWED, or STOP_BLOCKED decisions for a session namespace.

This feature belongs to the script entry points group and is catalogued as F014 in the `deep-loop-runtime` inventory.

---

## 2. CURRENT REALITY

Direct replacement for `deep_loop_graph_convergence`; emits graph decision bindings.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/deep-loop-runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/convergence.cjs` | Runtime | Direct replacement for `deep_loop_graph_convergence`; emits graph decision bindings. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/integration/convergence-script.vitest.ts` | Test | Primary regression coverage for convergence.cjs. |
| `tests/integration/review-depth-convergence.vitest.ts` | Integration | Review convergence fixture coverage. |

---

## 4. SOURCE METADATA

- Group: Script entry points
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F014
- Feature file path: `07--script-entry-points/01-convergence-script.md`
- Primary sources: `scripts/convergence.cjs`, `tests/integration/convergence-script.vitest.ts`
