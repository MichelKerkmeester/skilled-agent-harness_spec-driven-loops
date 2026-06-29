---
title: "Atomic-state serialize-diff"
description: "Adds writeStateIfChangedAtomic() so snapshot writers skip fsync and rename when canonical serialized state has not changed."
trigger_phrases:
  - "atomic-state serialize-diff"
  - "atomic-state-serialize-diff"
  - "atomic-state serialize-diff deep-loop-runtime"
  - "state safety atomic-state serialize-diff"
version: 1.4.0.15
---

# Atomic-state serialize-diff

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Adds `writeStateIfChangedAtomic()` so snapshot writers skip fsync and rename when canonical serialized state has not changed.

This feature belongs to the state safety group and is catalogued as F028 in the `deep-loop-runtime` inventory.

---

## 2. HOW IT WORKS

Canonicalizes and serializes the incoming state, compares it against a per-path cache keyed by canonical path, returns `false` for no-change skips, and keeps `writeStateAtomic()` available for callers that must force a durable write.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/deep-loop-runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/deep-loop/atomic-state.ts` | Runtime | atomic-state serialize-diff. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/atomic-state.vitest.ts` | Test | Primary regression coverage for Atomic-state serialize-diff. |

---

## 4. SOURCE METADATA

- Group: State safety
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F028
- Feature file path: `04--state-safety/atomic-state-serialize-diff.md`
- Source phase: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-implementation/002-deep-loop-runtime/001-atomic-state-serialize-diff`
- Primary sources: `lib/deep-loop/atomic-state.ts`, `tests/unit/atomic-state.vitest.ts`
Related references:
- [state safety](../04--state-safety/) — State safety category
