---
title: "Fallback router"
description: "Resolves the fallback route when a model exhausts its quota pool. Returns fallback (to a configured target in a different pool) or fail-fast based on the model registry."
---

# Fallback router

---

## 1. OVERVIEW

Chooses whether a failed model should fall back to a configured target or fail fast.

This feature belongs to the executor group and is catalogued as F003 in the `deep-loop-runtime` inventory.

---

## 2. CURRENT REALITY

Model registry lookup, fallback target selection, disabled fallback, and fail-fast reasons.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/deep-loop-runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/deep-loop/fallback-router.ts` | Runtime | Model registry lookup, fallback target selection, disabled fallback, and fail-fast reasons. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/fallback-router.vitest.ts` | Test | Primary regression coverage for Fallback router. |

---

## 4. SOURCE METADATA

- Group: Executor
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F003
- Feature file path: `01--executor/03-fallback-router.md`
- Primary sources: `lib/deep-loop/fallback-router.ts`, `tests/unit/fallback-router.vitest.ts`
