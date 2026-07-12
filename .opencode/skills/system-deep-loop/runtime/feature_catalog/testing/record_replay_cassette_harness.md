---
title: "Record-replay cassette harness"
description: "Adds record/replay helpers for script-level cassette regressions with redaction and hermetic environment integration."
trigger_phrases:
  - "record-replay cassette harness"
  - "record-replay-cassette-harness"
  - "record-replay cassette harness runtime"
  - "testing record-replay cassette harness"
version: 1.4.0.15
---

# Record-replay cassette harness

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Adds record/replay helpers for script-level cassette regressions with redaction and hermetic environment integration.

This feature belongs to the testing group and is catalogued as F049 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

`recordScriptRun()` captures normalized argv/stdin/stdout/exit envelopes, `replayScriptRun()` compares current script behavior against a cassette, and convergence/fanout tests use the helpers for pinned regressions.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|


### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/helpers/spawn-cjs.ts` | Test | Primary regression coverage for Record-replay cassette harness. |
| `tests/integration/convergence-script.vitest.ts` | Test | Primary regression coverage for Record-replay cassette harness. |
| `tests/unit/fanout-run.vitest.ts` | Test | Primary regression coverage for Record-replay cassette harness. |

---

## 4. SOURCE METADATA

- Group: Testing
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F049
- Feature file path: `testing/record-replay-cassette-harness.md`
- Source phase: `.opencode/specs/system-deep-loop/030-deep-loop-improved/007-testing/002-record-replay-cassette-harness`
- Primary sources: `tests/helpers/spawn-cjs.ts`, `tests/integration/convergence-script.vitest.ts`, `tests/unit/fanout-run.vitest.ts`
Related references:
- [testing](../testing/) — Testing category
