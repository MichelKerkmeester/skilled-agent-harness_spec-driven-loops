---
title: "Coverage-graph fuzzy merge"
description: "Adds deterministic fuzzy-merge query helpers for near-duplicate coverage nodes without mutating graph rows."
trigger_phrases:
  - "coverage-graph fuzzy merge"
  - "coverage-graph-fuzzy-merge"
  - "coverage-graph fuzzy merge runtime"
  - "coverage graph coverage-graph fuzzy merge"
version: 1.4.0.15
---

# Coverage-graph fuzzy merge

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Adds deterministic fuzzy-merge query helpers for near-duplicate coverage nodes without mutating graph rows.

This feature belongs to the coverage graph group and is catalogued as F041 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

`findSimilarNodes()` compares names inside one namespace and category, while `findConsolidationCandidates()` returns candidate clusters and leftovers; callers decide whether to merge results.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/coverage-graph/coverage-graph-query.ts` | Runtime | coverage-graph fuzzy merge. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/coverage-graph-query.vitest.ts` | Test | Primary regression coverage for Coverage-graph fuzzy merge. |

---

## 4. SOURCE METADATA

- Group: Coverage graph
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F041
- Feature file path: `coverage-graph/coverage-graph-fuzzy-merge.md`
- Source phase: `.opencode/specs/system-deep-loop/030-deep-loop-improved/002-runtime//014-coverage-graph-fuzzy-merge`
- Primary sources: `lib/coverage-graph/coverage-graph-query.ts`, `tests/unit/coverage-graph-query.vitest.ts`
Related references:
- [coverage graph](../coverage_graph/) — Coverage graph category
