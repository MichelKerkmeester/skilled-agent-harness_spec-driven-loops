---
title: "JSONL repair"
description: "Repairs corrupted JSONL tails and appends valid records without preserving partial trailing lines."
trigger_phrases:
  - "jsonl repair"
  - "jsonl-repair.ts"
  - "repair corrupted jsonl"
  - "corrupt-tail truncation"
  - "append after repair"
---

# JSONL repair

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Repairs corrupted JSONL tails and appends valid records without preserving partial trailing lines.

This feature belongs to the state safety group and is catalogued as F007 in the `deep-loop-runtime` inventory.

---

## 2. HOW IT WORKS

Valid-prefix detection, corrupt-tail truncation, byte accounting, and append-after-repair.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/deep-loop-runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/deep-loop/jsonl-repair.ts` | Runtime | Valid-prefix detection, corrupt-tail truncation, byte accounting, and append-after-repair. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/jsonl-repair.vitest.ts` | Test | Primary regression coverage for JSONL repair. |

---

## 4. SOURCE METADATA

- Group: State safety
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F007
- Feature file path: `04--state-safety/007-jsonl-repair.md`
- Primary sources: `lib/deep-loop/jsonl-repair.ts`, `tests/unit/jsonl-repair.vitest.ts`
Related references:
- [006-atomic-state.md](006-atomic-state.md) — Atomic state
- [008-loop-lock.md](008-loop-lock.md) — Loop lock
