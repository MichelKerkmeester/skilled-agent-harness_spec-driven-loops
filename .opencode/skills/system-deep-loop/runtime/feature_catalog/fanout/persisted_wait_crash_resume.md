---
title: "Persisted-wait crash resume"
description: "Persists a pre-dispatch wait checkpoint and resumes waiting state before dispatch after a crash restart."
trigger_phrases:
  - "persisted-wait crash resume"
  - "persisted-wait-crash-resume"
  - "persisted-wait crash resume runtime"
  - "fan-out persisted-wait crash resume"
version: 1.4.0.15
---

# Persisted-wait crash resume

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Persists a pre-dispatch wait checkpoint and resumes waiting state before dispatch after a crash restart.

This feature belongs to the fan-out group and is catalogued as F045 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

`fanout-run.cjs` writes nullable `nextRunAt` and `remainingDelayMs` at the wait boundary, classifies `resume-waiting` before dispatch startup logic, and treats missing legacy fields as null safe defaults.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/fanout-run.cjs` | Runtime | persisted-wait crash resume. |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Integration | persisted-wait crash resume. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/fanout-run.vitest.ts` | Test | Primary regression coverage for Persisted-wait crash resume. |

---

## 4. SOURCE METADATA

- Group: Fan-out
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F045
- Feature file path: `fanout/persisted-wait-crash-resume.md`
- Source phase: `.opencode/specs/system-deep-loop/030-deep-loop-improved/002-runtime//018-persisted-wait-crash-resume`
- Primary sources: `scripts/fanout-run.cjs`, `.opencode/commands/deep/assets/deep_research_auto.yaml`, `tests/unit/fanout-run.vitest.ts`
Related references:
- [fanout](../fanout/) — Fan-out category
