---
title: "Abortable chunked sleep"
description: "Adds an abortable chunked sleep primitive for cancellable waits and executor-boundary abort-signal composition."
trigger_phrases:
  - "abortable chunked sleep"
  - "abortable-chunked-sleep"
  - "abortable chunked sleep deep-loop-runtime"
  - "lifecycle abortable chunked sleep"
version: 1.4.0.15
---

# Abortable chunked sleep

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Adds an abortable chunked sleep primitive for cancellable waits and executor-boundary abort-signal composition.

This feature belongs to the lifecycle group and is catalogued as F031 in the `deep-loop-runtime` inventory.

---

## 2. HOW IT WORKS

`abortableSleep()` waits in `SLEEP_CHUNK_MS` slices, clears pending timeouts on abort, removes listeners on completion, rejects with `signal.reason`, and accepts composed abort signals for executor-run cancellation.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/deep-loop-runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/deep-loop/sleep.ts` | Runtime | abortable chunked sleep. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/sleep.vitest.ts` | Test | Primary regression coverage for Abortable chunked sleep. |

---

## 4. SOURCE METADATA

- Group: Lifecycle
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F031
- Feature file path: `10--lifecycle/abortable-chunked-sleep.md`
- Source phase: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-implementation/002-deep-loop-runtime/004-abortable-chunked-sleep`
- Primary sources: `lib/deep-loop/sleep.ts`, `tests/unit/sleep.vitest.ts`
Related references:
- [lifecycle](../10--lifecycle/) — Lifecycle category
