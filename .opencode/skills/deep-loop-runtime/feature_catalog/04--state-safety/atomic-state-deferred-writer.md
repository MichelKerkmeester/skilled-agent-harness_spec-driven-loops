---
title: "Atomic-state deferred writer"
description: "Adds a per-path deferred atomic writer that coalesces superseded snapshot writes while keeping JSONL appends immediate."
trigger_phrases:
  - "atomic-state deferred writer"
  - "atomic-state-deferred-writer"
  - "atomic-state deferred writer deep-loop-runtime"
  - "state safety atomic-state deferred writer"
version: 1.4.0.15
---

# Atomic-state deferred writer

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Adds a per-path deferred atomic writer that coalesces superseded snapshot writes while keeping JSONL appends immediate.

This feature belongs to the state safety group and is catalogued as F030 in the `deep-loop-runtime` inventory.

---

## 2. HOW IT WORKS

`createDeferredAtomicWriter()` debounces writes, flushes the newest pending state, performs a dirty-again reflush if content changes during an in-flight fsync, and exposes `flushNow()` plus `close()` for deterministic draining.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/deep-loop-runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/deep-loop/atomic-state.ts` | Runtime | atomic-state deferred/debounced writer. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/atomic-state.vitest.ts` | Test | Primary regression coverage for Atomic-state deferred writer. |

---

## 4. SOURCE METADATA

- Group: State safety
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F030
- Feature file path: `04--state-safety/atomic-state-deferred-writer.md`
- Source phase: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-implementation/002-deep-loop-runtime/003-atomic-state-deferred-writer`
- Primary sources: `lib/deep-loop/atomic-state.ts`, `tests/unit/atomic-state.vitest.ts`
Related references:
- [state safety](../04--state-safety/) — State safety category
