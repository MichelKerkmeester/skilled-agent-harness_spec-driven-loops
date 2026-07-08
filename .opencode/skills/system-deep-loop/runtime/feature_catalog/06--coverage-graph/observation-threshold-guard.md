---
title: "Observation-threshold guard"
description: "Adds a default-off minimum-observations guard that blocks stop or promotion decisions until leading evidence repeats enough times."
trigger_phrases:
  - "observation-threshold guard"
  - "observation-threshold-guard"
  - "observation-threshold guard runtime"
  - "coverage graph observation-threshold guard"
version: 1.4.0.15
---

# Observation-threshold guard

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Adds a default-off minimum-observations guard that blocks stop or promotion decisions until leading evidence repeats enough times.

This feature belongs to the coverage graph group and is catalogued as F039 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

`convergence.cjs` reads `minObservations` from argv/config/env, `coverage-graph-signals.ts` exposes observation signals, and sub-threshold leading findings are flagged as blockers without changing default parity.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/coverage-graph/coverage-graph-signals.ts` | Runtime | observation-threshold guard. |
| `scripts/convergence.cjs` | Runtime | observation-threshold guard. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/integration/convergence-script.vitest.ts` | Test | Primary regression coverage for Observation-threshold guard. |
| `tests/unit/convergence-score-delta.vitest.ts` | Test | Primary regression coverage for Observation-threshold guard. |
| `tests/unit/coverage-graph-signals.vitest.ts` | Test | Primary regression coverage for Observation-threshold guard. |

---

## 4. SOURCE METADATA

- Group: Coverage graph
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F039
- Feature file path: `06--coverage-graph/observation-threshold-guard.md`
- Source phase: `.opencode/specs/system-deep-loop/030-deep-loop-improved/002-runtime//012-observation-threshold-guard`
- Primary sources: `lib/coverage-graph/coverage-graph-signals.ts`, `scripts/convergence.cjs`, `tests/integration/convergence-script.vitest.ts`, `tests/unit/convergence-score-delta.vitest.ts`, `tests/unit/coverage-graph-signals.vitest.ts`
Related references:
- [coverage graph](../06--coverage-graph/) — Coverage graph category
