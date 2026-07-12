---
title: "Coverage-graph time decay"
description: "Adds optional time-decay weighting to coverage-graph signal ranking while preserving raw historical coverage counts."
trigger_phrases:
  - "coverage-graph time decay"
  - "coverage-graph-time-decay"
  - "coverage-graph time decay runtime"
  - "coverage graph coverage-graph time decay"
version: 1.4.0.15
---

# Coverage-graph time decay

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Adds optional time-decay weighting to coverage-graph signal ranking while preserving raw historical coverage counts.

This feature belongs to the coverage graph group and is catalogued as F040 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

`timeDecayWeight()` applies half-life decay when `decayDays` is enabled and returns full weight when disabled; signal ranking multiplies edge weight by the decay result without mutating stored graph counts.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/coverage-graph/coverage-graph-signals.ts` | Runtime | coverage-graph time decay. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/coverage-graph-signals.vitest.ts` | Test | Primary regression coverage for Coverage-graph time decay. |

---

## 4. SOURCE METADATA

- Group: Coverage graph
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F040
- Feature file path: `coverage-graph/coverage-graph-time-decay.md`
- Source phase: `.opencode/specs/system-deep-loop/030-deep-loop-improved/002-runtime//013-coverage-graph-time-decay`
- Primary sources: `lib/coverage-graph/coverage-graph-signals.ts`, `tests/unit/coverage-graph-signals.vitest.ts`
Related references:
- [coverage graph](../coverage_graph/) — Coverage graph category
