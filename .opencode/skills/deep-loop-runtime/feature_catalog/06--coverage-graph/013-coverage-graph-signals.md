---
title: "Coverage graph signals"
description: "Computes convergence signals, node centrality signals, snapshots, and momentum for research and review graphs."
trigger_phrases:
  - "coverage graph signals"
  - "coverage-graph-signals.ts"
  - "compute convergence signals"
  - "node centrality momentum"
  - "research review graph signals"
---

# Coverage graph signals

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Computes convergence signals, node centrality signals, snapshots, and momentum for research and review graphs.

This feature belongs to the coverage graph group and is catalogued as F013 in the `deep-loop-runtime` inventory.

---

## 2. HOW IT WORKS

Node degree/depth, research signals, review signals, snapshots, and momentum.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/deep-loop-runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/coverage-graph/coverage-graph-signals.ts` | Runtime | Node degree/depth, research signals, review signals, snapshots, and momentum. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/integration/convergence-script.vitest.ts` | Test | Primary regression coverage for Coverage graph signals. |
| `tests/integration/status-script.vitest.ts` | Integration | Status signal coverage. |
| `tests/integration/review-depth-convergence.vitest.ts` | Integration | Review-depth convergence fixture coverage. |

---

## 4. SOURCE METADATA

- Group: Coverage graph
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F013
- Feature file path: `06--coverage-graph/013-coverage-graph-signals.md`
- Primary sources: `lib/coverage-graph/coverage-graph-signals.ts`, `tests/integration/convergence-script.vitest.ts`
Related references:
- [012-coverage-graph-query.md](012-coverage-graph-query.md) — Coverage graph query
