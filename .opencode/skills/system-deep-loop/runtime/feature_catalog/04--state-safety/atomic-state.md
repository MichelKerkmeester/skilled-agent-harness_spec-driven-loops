---
title: "Atomic state"
description: "Writes JSON state files through temp-file, fsync, rename, and cleanup semantics."
trigger_phrases:
  - "atomic state"
  - "atomic-state.ts"
  - "write state atomically"
  - "fsync rename temp-file"
  - "crash-safe JSON state"
version: 1.4.0.4
---

# Atomic state

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Writes JSON state files through temp-file, fsync, rename, and cleanup semantics.

This feature belongs to the state safety group and is catalogued as F006 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

Atomic JSON serialization, temp-file writes, fsync, rename, and cleanup on failure.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/deep-loop/atomic-state.ts` | Runtime | Atomic JSON serialization, temp-file writes, fsync, rename, and cleanup on failure. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/atomic-state.vitest.ts` | Test | Primary regression coverage for Atomic state. |

---

## 4. SOURCE METADATA

- Group: State safety
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F006
- Feature file path: `04--state-safety/atomic-state.md`
- Primary sources: `lib/deep-loop/atomic-state.ts`, `tests/unit/atomic-state.vitest.ts`
Related references:
- [jsonl-repair.md](jsonl-repair.md) — JSONL repair
