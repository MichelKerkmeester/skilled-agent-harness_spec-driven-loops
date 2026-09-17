---
title: "Lifecycle taxonomy guards"
description: "Promotes loop lifecycle status and stop-reason taxonomy with legal transitions and a one-shot paused-wait resume gate."
trigger_phrases:
  - "lifecycle taxonomy guards"
  - "lifecycle-taxonomy-guards"
  - "lifecycle taxonomy guards runtime"
  - "lifecycle lifecycle taxonomy guards"
version: 1.4.0.15
---

# Lifecycle taxonomy guards

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Promotes loop lifecycle status and stop-reason taxonomy with legal transitions and a one-shot paused-wait resume gate.

This feature belongs to the lifecycle group and is catalogued as F032 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

`lifecycle-taxonomy.cjs` exports `LoopActiveStatus`, `LoopStopReason`, `LEGAL_TRANSITIONS`, and `createPausedWaitGate()` so consumers share the same active-state, terminal-reason, and resume-resolution contract.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/deep-loop/lifecycle-taxonomy.cjs` | Runtime | lifecycle taxonomy + transition guards. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/lifecycle-taxonomy-guards.vitest.ts` | Test | Primary regression coverage for Lifecycle taxonomy guards. |

---

## 4. SOURCE METADATA

- Group: Lifecycle
- Canonical catalog source: `feature-catalog.md`
- Feature ID: F032
- Feature file path: `lifecycle/lifecycle-taxonomy-guards.md`
- Source phase: `.opencode/specs/system-deep-loop/030-deep-loop-improved/002-runtime//005-lifecycle-taxonomy-guards`
- Primary sources: `lib/deep-loop/lifecycle-taxonomy.cjs`, `tests/unit/lifecycle-taxonomy-guards.vitest.ts`
Related references:
- [lifecycle](../lifecycle/) — Lifecycle category
