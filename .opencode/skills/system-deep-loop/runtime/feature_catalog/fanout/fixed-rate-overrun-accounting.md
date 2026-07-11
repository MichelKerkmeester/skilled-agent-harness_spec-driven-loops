---
title: "Fixed-rate overrun accounting"
description: "Records fixed-rate scheduling overruns without replaying missed slots or violating single-flight dispatch semantics."
trigger_phrases:
  - "fixed-rate overrun accounting"
  - "fixed-rate-overrun-accounting"
  - "fixed-rate overrun accounting runtime"
  - "fan-out fixed-rate overrun accounting"
version: 1.4.0.15
---

# Fixed-rate overrun accounting

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Records fixed-rate scheduling overruns without replaying missed slots or violating single-flight dispatch semantics.

This feature belongs to the fan-out group and is catalogued as F037 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

`fanout-run.cjs` measures each slot with monotonic `process.hrtime`, persists `slotDurationMs`, derives clamped `skippedCount`, and the YAML schema declares both fields for persisted state readers.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/fanout-run.cjs` | Runtime | fixed-rate overrun accounting. |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Integration | fixed-rate overrun accounting. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/fanout-run.vitest.ts` | Test | Primary regression coverage for Fixed-rate overrun accounting. |

---

## 4. SOURCE METADATA

- Group: Fan-out
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F037
- Feature file path: `fanout/fixed-rate-overrun-accounting.md`
- Source phase: `.opencode/specs/system-deep-loop/030-deep-loop-improved/002-runtime//010-fixed-rate-overrun-accounting`
- Primary sources: `scripts/fanout-run.cjs`, `.opencode/commands/deep/assets/deep_research_auto.yaml`, `tests/unit/fanout-run.vitest.ts`
Related references:
- [fanout](../fanout/) — Fan-out category
