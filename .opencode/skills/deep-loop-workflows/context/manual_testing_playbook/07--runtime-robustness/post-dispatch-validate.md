---
title: "RUNTIME-003 -- Post-Dispatch Validate (Seat Validation)"
description: "This scenario validates Post-Dispatch Seat Validation for `RUNTIME-003`. It focuses on `validateSeatFinding` and `seatValidationWarnings` being present in `reduce-state.cjs`, confirming that invalid seat findings are surfaced rather than silently merged."
---

# RUNTIME-003 -- Post-Dispatch Validate (Seat Validation)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `RUNTIME-003`.

---

## 1. OVERVIEW

This scenario validates Post-Dispatch Seat Validation for `RUNTIME-003`. It focuses on `reduce-state.cjs` applying `validateSeatFinding` to each raw finding before merge: checking known kind, presence of path or symbol, and numeric relevance. Invalid findings are collected in `validationWarnings` (surfaced as `registry.seatValidationWarnings`) rather than silently dropped or merged with incorrect data.

### Why This Matters

Without seat validation, a malformed finding (unknown kind, missing path and symbol, or non-numeric relevance) would either crash the reducer or silently corrupt the registry bucket with garbage data. Since small-model CLI seats may return loosely structured JSON, a structural gate before merge prevents silent quality degradation in the findings registry.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `RUNTIME-003` and confirm the expected signals without contradictory evidence.

- Objective: Verify that `reduce-state.cjs` calls `validateSeatFinding` before merging seat findings and surfaces invalid findings in `registry.seatValidationWarnings`.
- Real user request: `Verify that the deep-context state reducer validates each seat finding before merging it into the registry.`
- Prompt: `As a manual-testing orchestrator, validate the post-dispatch seat finding validation contract for deep-context against reduce-state.cjs. Verify validateSeatFinding and seatValidationWarnings appear in the script; confirm validateSeatFinding checks kind, path/symbol, and relevance. Return a concise verdict.`
- Expected execution process: Grep reduce-state.cjs for `validateSeatFinding` and `seatValidationWarnings`; grep for the specific validation checks (kind, path/symbol, relevance).
- Expected signals: `validateSeatFinding` found in reduce-state.cjs; `seatValidationWarnings` found in the registry assignment; validation checks for `kind`, `path`, `symbol`, and `relevance` found in the function body.
- Desired user-visible outcome: Invalid seat findings (unknown kind, missing path and symbol, or non-numeric relevance) are surfaced in `registry.seatValidationWarnings` rather than silently merged, so operators know when a seat returned malformed output.
- Pass/fail: PASS if `validateSeatFinding` and `seatValidationWarnings` are both found and the validation logic checks all three constraints; FAIL if either is absent or the validation function has no guards.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Stay local; grep reduce-state.cjs for the validation function and registry field.
3. Execute the deterministic steps exactly as written.
4. Compare observed output against the desired outcome.
5. Return a concise final answer.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RUNTIME-003 | Post-Dispatch Validate (Seat Validation) | Verify validateSeatFinding gate and seatValidationWarnings registry surface | `Verify that the deep-context state reducer validates each seat finding before merging it into the registry.` | 1. `rg "validateSeatFinding\|seatValidationWarnings" .opencode/skills/deep-loop-workflows/context/scripts/reduce-state.cjs` -> 2. `rg "unknown kind\|missing both\|non-numeric" .opencode/skills/deep-loop-workflows/context/scripts/reduce-state.cjs` | Step 1: validateSeatFinding and seatValidationWarnings found; Step 2: all three validation reason strings found | Grep outputs from both commands | PASS if steps 1-2 all return expected tokens; FAIL if validateSeatFinding is missing or validation reason strings are absent | 1. Confirm `validateSeatFinding` is in `module.exports` at the bottom of reduce-state.cjs. 2. Confirm `seatValidationWarnings` is assigned to `registry.seatValidationWarnings` (not just a local variable). 3. Check that `validationWarnings.push(...)` is the code path for invalid findings (not a silent `continue`). |

### Optional Supplemental Checks

Verify `validateSeatFinding` is exported from `module.exports`:

```bash
rg "validateSeatFinding" .opencode/skills/deep-loop-workflows/context/scripts/reduce-state.cjs
```

Verify `seatValidationWarnings` flows into the per-run summary:

```bash
rg "seatValidationWarnings" .opencode/skills/deep-loop-workflows/context/scripts/reduce-state.cjs
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/07--runtime-robustness/post-dispatch-validate.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/deep-loop-workflows/context/scripts/reduce-state.cjs` | `validateSeatFinding`, `loadSeatFindings`, `collectAllSeatFindings`, `registry.seatValidationWarnings` |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` | `validateIterationOutputs`, `validateOrThrow` — runtime iteration-level counterpart |

---

## 5. SOURCE METADATA

- Group: Runtime Robustness
- Playbook ID: RUNTIME-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--runtime-robustness/post-dispatch-validate.md`
