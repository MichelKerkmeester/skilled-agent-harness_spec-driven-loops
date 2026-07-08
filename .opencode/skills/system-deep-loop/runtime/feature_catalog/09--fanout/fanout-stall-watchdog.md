---
title: "Fan-out stall watchdog"
description: "Adds an opt-in fan-out stall watchdog that aborts and requeues lineages when pending lag crosses a configured ceiling."
trigger_phrases:
  - "fan-out stall watchdog"
  - "fanout-stall-watchdog"
  - "fan-out stall watchdog runtime"
  - "fan-out fan-out stall watchdog"
version: 1.4.0.15
---

# Fan-out stall watchdog

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Adds an opt-in fan-out stall watchdog that aborts and requeues lineages when pending lag crosses a configured ceiling.

This feature belongs to the fan-out group and is catalogued as F044 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

`fanout-pool.cjs` accepts `lagCeilingMs` plus `lagCeilingAction:"abort-requeue"`, attaches abort handles per active slot, emits timeout failure-class ledger events, and leaves default pool behavior unchanged.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/fanout-pool.cjs` | Runtime | fanout stall watchdog. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/fanout-pool.vitest.ts` | Test | Primary regression coverage for Fan-out stall watchdog. |

---

## 4. SOURCE METADATA

- Group: Fan-out
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F044
- Feature file path: `09--fanout/fanout-stall-watchdog.md`
- Source phase: `.opencode/specs/system-deep-loop/030-deep-loop-improved/002-runtime//017-fanout-stall-watchdog`
- Primary sources: `scripts/fanout-pool.cjs`, `tests/unit/fanout-pool.vitest.ts`
Related references:
- [fanout](../09--fanout/) — Fan-out category
