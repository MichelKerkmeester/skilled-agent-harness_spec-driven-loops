---
title: "Atomic-state serialize-diff"
description: "Adds writeStateIfChangedAtomic() so snapshot writers skip fsync and rename when canonical serialized state has not changed."
trigger_phrases:
  - "atomic-state serialize-diff"
  - "atomic-state-serialize-diff"
  - "atomic-state serialize-diff runtime"
  - "state safety atomic-state serialize-diff"
---

# Atomic-state serialize-diff

---

## 1. OVERVIEW

Adds `writeStateIfChangedAtomic()` so snapshot writers skip fsync and rename when canonical serialized state has not changed.

This feature belongs to the state safety group and is catalogued as F028 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

Canonicalizes and serializes the incoming state, compares it against a per-path cache keyed by canonical path, returns `false` for no-change skips, and keeps `writeStateAtomic()` available for callers that must force a durable write.

The implementation is source-backed and covered by runtime-owned tests under `.skilled/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/deep-loop/atomic-state.ts` | Runtime | atomic-state serialize-diff. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/atomic-state.vitest.ts` | Automated test | Primary regression coverage for Atomic-state serialize-diff. |

---

## 4. SOURCE METADATA

- Group: State safety
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `state-safety/atomic-state-serialize-diff.md`
- Primary sources: `lib/deep-loop/atomic-state.ts`, `tests/unit/atomic-state.vitest.ts`
Related references:
- [state safety](../../feature-catalog/state-safety) — State safety category
