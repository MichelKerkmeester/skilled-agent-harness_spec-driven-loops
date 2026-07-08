---
title: "Loop-lock single-flight decision"
description: "Adds opt-in host-local single-flight acquisition so concurrent acquire attempts for one lock collapse behind one live holder."
trigger_phrases:
  - "loop-lock single-flight decision"
  - "loop-lock-single-flight-decision"
  - "loop-lock single-flight decision runtime"
  - "state safety loop-lock single-flight decision"
version: 1.4.0.15
---

# Loop-lock single-flight decision

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Adds opt-in host-local single-flight acquisition so concurrent acquire attempts for one lock collapse behind one live holder.

This feature belongs to the state safety group and is catalogued as F035 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

`acquireLoopLock(..., { hostLocalSingleFlight: true })` probes a host-local lease before file-lock acquisition, refuses live same-host holders, and treats dead holder state as replaceable without changing the default durable file-lock path.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/deep-loop/loop-lock.ts` | Runtime | loop-lock single-flight decision. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/loop-lock.vitest.ts` | Test | Primary regression coverage for Loop-lock single-flight decision. |

---

## 4. SOURCE METADATA

- Group: State safety
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F035
- Feature file path: `04--state-safety/loop-lock-single-flight-decision.md`
- Source phase: `.opencode/specs/system-deep-loop/030-deep-loop-improved/002-runtime//008-loop-lock-single-flight-decision`
- Primary sources: `lib/deep-loop/loop-lock.ts`, `tests/unit/loop-lock.vitest.ts`
Related references:
- [state safety](../04--state-safety/) — State safety category
