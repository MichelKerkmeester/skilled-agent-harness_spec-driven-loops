---
title: "DAC-013 -- Library writer call sequence"
description: "This scenario validates the canonical writer sequence for `DAC-013`. It focuses on named writer exports and artifact_written audit events."
version: 2.3.0.9
---

# DAC-013 -- Library writer call sequence

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-013`.

---

## 1. OVERVIEW

This scenario validates the canonical writer sequence for `DAC-013`. It focuses on `persist-artifacts.cjs` named writer functions and `artifact_written` audit events.

### Why This Matters

Council persistence depends on a stable writer library. Missing writers or missing audit events break artifact recovery and completion evidence.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DAC-013` and confirm the expected signals without contradictory evidence.

- Objective: Verify `lib/persist-artifacts.cjs` exports the 7 named writers and that they emit `artifact_written` events.
- Real user request: Show me the canonical writer sequence the council uses.
- Prompt: `Inspect lib/persist-artifacts.cjs named exports and verify the canonical writer call sequence with artifact_written events.`
- Expected execution process: Run grep for the seven writer functions, then confirm `artifact_written` is referenced in the writer library.
- Expected signals: All 7 writers present; `artifact_written` event emission referenced.
- Desired user-visible outcome: The user sees the canonical writer sequence and audit-event evidence.
- Pass/fail: PASS if 7 writer functions are found and audit emission is present; FAIL if any writer is missing or no audit emission is found.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Inspect named writer functions in the library.
2. Inspect `artifact_written` references.
3. Report the writer sequence and whether audit emission is present.

### Prompt

`Inspect lib/persist-artifacts.cjs named exports and verify the canonical writer call sequence with artifact_written events.`

### Commands

1. `bash: rg -n "^function (writeConfig|writeStrategyMd|writeStateJsonl|writeSeat|writeDeliberation|writeCritique|writeReport)" .opencode/skills/deep-loop-workflows/ai-council/scripts/lib/persist-artifacts.cjs`
2. `bash: rg -n "artifact_written" .opencode/skills/deep-loop-workflows/ai-council/scripts/lib/`

> Note: `artifact_written` is emitted by `appendArtifactWrittenEvent` in `audit-trail.js` (called from `writeFileScoped` in `persist-artifacts.cjs`). The audit string lives in the imported module, not in the writer module — search the whole `lib/` directory rather than `persist-artifacts.cjs` alone.

### Expected

All 7 writer functions are present and `artifact_written` event emission is referenced.

### Evidence

Capture grep output showing each writer function and at least one `artifact_written` reference.

### Pass / Fail

- **Pass**: 7 writer functions found and audit emission present.
- **Fail**: Any writer missing or no audit emission found.

### Failure Triage

Check whether the writer was renamed, moved, or converted to another declaration style; update the playbook only if the source contract intentionally changed.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-013 | Library writer call sequence | Verify seven writers and audit events | `Inspect lib/persist-artifacts.cjs named exports and verify the canonical writer call sequence with artifact_written events.` | `bash: rg -n "^function (writeConfig\|writeStrategyMd\|writeStateJsonl\|writeSeat\|writeDeliberation\|writeCritique\|writeReport)" .opencode/skills/deep-loop-workflows/ai-council/scripts/lib/persist-artifacts.cjs` -> `bash: rg -n "artifact_written" .opencode/skills/deep-loop-workflows/ai-council/scripts/lib/` | Seven writers and audit event references across lib/ | Grep output | PASS if all writers and audit emission are present | Check renamed writer contract |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `feature_catalog/` | No feature catalog exists yet |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/deep-loop-workflows/ai-council/scripts/lib/persist-artifacts.cjs` | Writer library and audit event implementation |
| `.opencode/agents/ai-council.md` | Canonical writer sequence in invocation contract |

---

## 5. SOURCE METADATA

- Group: WRITER LIBRARY CONTRACT
- Playbook ID: DAC-013
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--writer-library-contract/library-writer-call-sequence.md`
