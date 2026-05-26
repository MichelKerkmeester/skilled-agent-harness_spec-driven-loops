---
title: "Loop lock"
description: "Provides a single-writer lock with stale-lock detection, heartbeat refresh, and owner-scoped release."
---

# Loop lock

---

## 1. OVERVIEW

Provides a single-writer lock with stale-lock detection, heartbeat refresh, and owner-scoped release.

This feature belongs to the state safety group and is catalogued as F008 in the `deep-loop-runtime` inventory.

---

## 2. CURRENT REALITY

Lock file schema, live-holder refusal, stale replacement, heartbeat refresh, and owner-only release.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/deep-loop-runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/deep-loop/loop-lock.ts` | Runtime | Lock file schema, live-holder refusal, stale replacement, heartbeat refresh, and owner-only release. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/loop-lock.vitest.ts` | Test | Primary regression coverage for Loop lock. |

---

## 4. SOURCE METADATA

- Group: State safety
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F008
- Feature file path: `04--state-safety/03-loop-lock.md`
- Primary sources: `lib/deep-loop/loop-lock.ts`, `tests/unit/loop-lock.vitest.ts`
