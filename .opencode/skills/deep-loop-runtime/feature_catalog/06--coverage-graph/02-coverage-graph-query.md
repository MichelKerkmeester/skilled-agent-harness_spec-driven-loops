---
title: "Coverage graph query"
description: "Builds coverage-gap, contradiction, provenance-chain, unverified-claim, and hot-node read models."
---

# Coverage graph query

---

## 1. OVERVIEW

Builds coverage-gap, contradiction, provenance-chain, unverified-claim, and hot-node read models.

This feature belongs to the coverage graph group and is catalogued as F012 in the `deep-loop-runtime` inventory.

---

## 2. CURRENT REALITY

Session-scoped query helpers for research and review coverage graph reads.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/deep-loop-runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/coverage-graph/coverage-graph-query.ts` | Runtime | Session-scoped query helpers for research and review coverage graph reads. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/integration/query-script.vitest.ts` | Test | Primary regression coverage for Coverage graph query. |

---

## 4. SOURCE METADATA

- Group: Coverage graph
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F012
- Feature file path: `06--coverage-graph/02-coverage-graph-query.md`
- Primary sources: `lib/coverage-graph/coverage-graph-query.ts`, `tests/integration/query-script.vitest.ts`
