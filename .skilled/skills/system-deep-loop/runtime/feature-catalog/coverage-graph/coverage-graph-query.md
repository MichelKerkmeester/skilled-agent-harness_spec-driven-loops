---
title: "Coverage graph query"
description: "Builds coverage-gap, contradiction, provenance-chain, unverified-claim, and hot-node read models."
trigger_phrases:
  - "coverage graph query"
  - "coverage-graph-query.ts"
  - "query coverage gaps"
  - "provenance chain lookup"
  - "hot-node read model"
version: 1.4.0.4
---

# Coverage graph query

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Builds coverage-gap, contradiction, provenance-chain, unverified-claim, and hot-node read models.

This feature belongs to the coverage graph group and is catalogued as F012 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

Session-scoped query helpers for research and review coverage graph reads.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

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
- Canonical catalog source: `feature-catalog.md`
- Feature ID: F012
- Feature file path: `coverage-graph/coverage-graph-query.md`
- Primary sources: `lib/coverage-graph/coverage-graph-query.ts`, `tests/integration/query-script.vitest.ts`
Related references:
- [coverage-graph-db.md](../../feature-catalog/coverage-graph/coverage-graph-db.md) — Coverage graph DB
- [coverage-graph-signals.md](../../feature-catalog/coverage-graph/coverage-graph-signals.md) — Coverage graph signals
