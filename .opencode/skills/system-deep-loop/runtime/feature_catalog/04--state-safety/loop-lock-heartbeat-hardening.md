---
title: "Loop-lock heartbeat hardening"
description: "Hardens loop-lock ownership with TTL-aware heartbeat refresh plus phase and last-activity metadata."
trigger_phrases:
  - "loop-lock heartbeat hardening"
  - "loop-lock-heartbeat-hardening"
  - "loop-lock heartbeat hardening runtime"
  - "state safety loop-lock heartbeat hardening"
version: 1.4.0.15
---

# Loop-lock heartbeat hardening

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Hardens loop-lock ownership with TTL-aware heartbeat refresh plus phase and last-activity metadata.

This feature belongs to the state safety group and is catalogued as F034 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

`startHeartbeat()` and `stopHeartbeat()` refresh the held lock on a cadence, write `phase` and `lastActivityIso`, and stop the heartbeat when refresh can no longer prove ownership.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/deep-loop/loop-lock.ts` | Runtime | loop-lock heartbeat hardening. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/loop-lock.vitest.ts` | Test | Primary regression coverage for Loop-lock heartbeat hardening. |

---

## 4. SOURCE METADATA

- Group: State safety
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F034
- Feature file path: `04--state-safety/loop-lock-heartbeat-hardening.md`
- Source phase: `.opencode/specs/system-deep-loop/030-deep-loop-improved/002-runtime//007-loop-lock-heartbeat-hardening`
- Primary sources: `lib/deep-loop/loop-lock.ts`, `tests/unit/loop-lock.vitest.ts`
Related references:
- [state safety](../04--state-safety/) — State safety category
