---
title: "Single-loop telemetry heartbeat"
description: "Adds single-loop telemetry heartbeat rows for started, progress, and terminal lifecycle events with no-change write suppression."
trigger_phrases:
  - "single-loop telemetry heartbeat"
  - "single-loop-telemetry-heartbeat"
  - "single-loop telemetry heartbeat deep-loop-runtime"
  - "observability single-loop telemetry heartbeat"
version: 1.4.0.15
---

# Single-loop telemetry heartbeat

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Adds single-loop telemetry heartbeat rows for started, progress, and terminal lifecycle events with no-change write suppression.

This feature belongs to the observability group and is catalogued as F046 in the `deep-loop-runtime` inventory.

---

## 2. HOW IT WORKS

`deep_research_auto.yaml` emits heartbeat rows tagged `label:"single"` with fan-out-shaped gauges, while `atomic-state.ts` suppresses unchanged telemetry rows through serialized-diff gating.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/deep-loop-runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Integration | single-loop telemetry heartbeat. |
| `lib/deep-loop/atomic-state.ts` | Runtime | single-loop telemetry heartbeat. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/atomic-state.vitest.ts` | Test | Primary regression coverage for Single-loop telemetry heartbeat. |

---

## 4. SOURCE METADATA

- Group: Observability
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F046
- Feature file path: `11--observability/single-loop-telemetry-heartbeat.md`
- Source phase: `.opencode/specs/system-deep-loop/030-deep-loop-improved/006-ux-observability-automation/002-single-loop-telemetry-heartbeat`
- Primary sources: `.opencode/commands/deep/assets/deep_research_auto.yaml`, `lib/deep-loop/atomic-state.ts`, `tests/unit/atomic-state.vitest.ts`
Related references:
- [observability](../11--observability/) — Observability category
