---
title: "JSONL lock-held merge"
description: "Adds a lock-held JSONL merge path for fan-out salvage so recovered events are deduplicated before atomic rewrite."
trigger_phrases:
  - "jsonl lock-held merge"
  - "jsonl-lock-held-merge"
  - "jsonl lock-held merge runtime"
  - "state safety jsonl lock-held merge"
version: 1.4.0.15
---

# JSONL lock-held merge

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Adds a lock-held JSONL merge path for fan-out salvage so recovered events are deduplicated before atomic rewrite.

This feature belongs to the state safety group and is catalogued as F033 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

`mergeJsonlUnderLock()` rereads current JSONL, unions incoming records by stable identity, writes the merged file atomically under the lock, and `fanout-salvage.cjs` uses it instead of bare append.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/deep-loop/jsonl-repair.ts` | Runtime | JSONL lock-held merge for fan-out salvage. |
| `scripts/fanout-salvage.cjs` | Runtime | JSONL lock-held merge for fan-out salvage. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/jsonl-repair.vitest.ts` | Test | Primary regression coverage for JSONL lock-held merge. |

---

## 4. SOURCE METADATA

- Group: State safety
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F033
- Feature file path: `state-safety/jsonl-lock-held-merge.md`
- Source phase: `.opencode/specs/system-deep-loop/030-deep-loop-improved/002-runtime//006-jsonl-lock-held-merge`
- Primary sources: `lib/deep-loop/jsonl-repair.ts`, `scripts/fanout-salvage.cjs`, `tests/unit/jsonl-repair.vitest.ts`
Related references:
- [state safety](../state_safety/) — State safety category
