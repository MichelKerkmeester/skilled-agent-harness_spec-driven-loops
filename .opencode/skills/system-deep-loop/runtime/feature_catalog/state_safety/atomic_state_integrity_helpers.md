---
title: "Atomic-state integrity helpers"
description: "Adds SHA-256 integrity helpers for object and registry JSON without applying the contract to append-only JSONL."
trigger_phrases:
  - "atomic-state integrity helpers"
  - "atomic-state-integrity-helpers"
  - "atomic-state integrity helpers runtime"
  - "state safety atomic-state integrity helpers"
version: 1.4.0.15
---

# Atomic-state integrity helpers

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Adds SHA-256 integrity helpers for object and registry JSON without applying the contract to append-only JSONL.

This feature belongs to the state safety group and is catalogued as F029 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

`computeIntegrityHash()` hashes canonical JSON, `stampIntegrity()` writes `_integrity`, and `verifyIntegrity()` recomputes the digest, warns on mismatch, and returns `false` without fail-fast blocking.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/deep-loop/atomic-state.ts` | Runtime | atomic-state SHA-256 integrity helpers. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/atomic-state.vitest.ts` | Test | Primary regression coverage for Atomic-state integrity helpers. |

---

## 4. SOURCE METADATA

- Group: State safety
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F029
- Feature file path: `state-safety/atomic-state-integrity-helpers.md`
- Source phase: `.opencode/specs/system-deep-loop/030-deep-loop-improved/002-runtime//002-atomic-state-integrity-helpers`
- Primary sources: `lib/deep-loop/atomic-state.ts`, `tests/unit/atomic-state.vitest.ts`
Related references:
- [state safety](../state_safety/) — State safety category
