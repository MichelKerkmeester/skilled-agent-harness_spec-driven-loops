---
title: "Loop lock"
description: "Provides a single-writer lock with stale-lock detection, heartbeat refresh, and owner-scoped release."
trigger_phrases:
  - "loop lock"
  - "loop-lock.ts"
  - "acquire loop lock"
  - "stale-lock detection"
  - "heartbeat refresh lock"
version: 1.4.0.4
---

# Loop lock

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Provides a single-writer lock with stale-lock detection, heartbeat refresh, and owner-scoped release.

This feature belongs to the state safety group and is catalogued as F008 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

Lock file schema, live-holder refusal, stale replacement, heartbeat refresh, and owner-only release.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

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
- Canonical catalog source: `feature-catalog.md`
- Feature ID: F008
- Feature file path: `state-safety/loop-lock.md`
- Primary sources: `lib/deep-loop/loop-lock.ts`, `tests/unit/loop-lock.vitest.ts`
Related references:
- [jsonl-repair.md](../../feature-catalog/state-safety/jsonl-repair.md) — JSONL repair
- [permissions-gate.md](../../feature-catalog/state-safety/permissions-gate.md) — Permissions gate
