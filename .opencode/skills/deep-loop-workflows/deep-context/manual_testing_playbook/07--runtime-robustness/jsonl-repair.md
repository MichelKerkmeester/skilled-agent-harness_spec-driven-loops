---
title: "RUNTIME-002 -- JSONL Repair"
description: "This scenario validates JSONL Repair for `RUNTIME-002`. It focuses on `repairJsonlTail` and `stateLogRepair` being present in `reduce-state.cjs`, confirming that the reducer repairs trailing malformed JSONL before reading the state log."
version: 1.2.0.3
---

# RUNTIME-002 -- JSONL Repair

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `RUNTIME-002`.

---

## 1. OVERVIEW

This scenario validates JSONL Repair for `RUNTIME-002`. It focuses on `reduce-state.cjs` invoking `repairJsonlTail` on the state log before reading it, recording the repair outcome in `registry.stateLogRepair { repaired, droppedBytes }`, and providing an inline fallback (`repairJsonlTailInline`) when the TypeScript runtime is unavailable.

### Why This Matters

The JSONL state log is append-only and written by the host after each iteration. A crash during an append leaves a partial JSON record at the tail. If the reducer reads the log without first repairing it, `parseJsonlDetailed` will parse fewer records than expected or fail entirely, silently discarding the last iteration's events. Verifying the repair step ensures recovery from crash-corrupted state logs without data loss beyond the partial record.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `RUNTIME-002` and confirm the expected signals without contradictory evidence.

- Objective: Verify that `reduce-state.cjs` invokes `repairJsonlTail` on the state log before reading and surfaces the outcome in `registry.stateLogRepair`.
- Real user request: `Verify that the deep-context state reducer repairs malformed trailing JSONL before reading the state log.`
- Prompt: `As a manual-testing orchestrator, validate the JSONL repair contract for deep-context against reduce-state.cjs and the runtime jsonl-repair.ts module. Verify repairJsonlTail and stateLogRepair appear in reduce-state.cjs; repairJsonlTailInline is present as the fallback; jsonl-repair.ts exports repairJsonlTail with truncateSync. Return a concise verdict.`
- Expected execution process: Grep reduce-state.cjs for `repairJsonlTail` and `stateLogRepair`; grep for `repairJsonlTailInline`; grep jsonl-repair.ts for `export function repairJsonlTail` and `truncateSync`.
- Expected signals: `repairJsonlTail` found in reduce-state.cjs invocation; `stateLogRepair` found in the registry assignment; `repairJsonlTailInline` found as inline fallback; `export function repairJsonlTail` found in jsonl-repair.ts; `truncateSync` found in jsonl-repair.ts.
- Desired user-visible outcome: A crash-corrupted state log is automatically repaired before the reducer reads it, and the amount of data trimmed is visible in `registry.stateLogRepair.droppedBytes`.
- Pass/fail: PASS if all five grep checks return the expected tokens; FAIL if `repairJsonlTail` invocation or `stateLogRepair` registry field is absent.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Stay local; grep reduce-state.cjs and jsonl-repair.ts.
3. Execute the deterministic steps exactly as written.
4. Compare observed output against the desired outcome.
5. Return a concise final answer.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RUNTIME-002 | JSONL Repair | Verify repairJsonlTail invocation and stateLogRepair registry surface | `Verify that the deep-context state reducer repairs malformed trailing JSONL before reading the state log.` | 1. `rg "repairJsonlTail\|stateLogRepair" .opencode/skills/deep-loop-workflows/deep-context/scripts/reduce-state.cjs` -> 2. `rg "repairJsonlTailInline" .opencode/skills/deep-loop-workflows/deep-context/scripts/reduce-state.cjs` -> 3. `rg "export function repairJsonlTail" .opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts` -> 4. `rg "truncateSync" .opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts` | Step 1: repairJsonlTail and stateLogRepair found; Step 2: repairJsonlTailInline found; Step 3: export found; Step 4: truncateSync found | Grep outputs from all four commands | PASS if steps 1-4 all return expected tokens; FAIL if any symbol is absent | 1. Confirm `stateLogRepair` is assigned to `registry.stateLogRepair` (not just a local variable). 2. Check that `repairJsonlTailInline` returns `{ repaired, droppedBytes }` to match the runtime shape. 3. Verify `_stateSafety.repairJsonlTail` is the call site (not direct use of the inline). |

### Optional Supplemental Checks

Verify `stateLogRepaired` and `stateLogDroppedBytes` are surfaced in the per-run summary:

```bash
rg "stateLogRepaired\|stateLogDroppedBytes" .opencode/skills/deep-loop-workflows/deep-context/scripts/reduce-state.cjs
```

Verify `JsonlRepairResult` type is defined in the runtime module:

```bash
rg "JsonlRepairResult" .opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/07--runtime-robustness/jsonl-repair.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/deep-loop-workflows/deep-context/scripts/reduce-state.cjs` | `repairJsonlTailInline` (fallback), `loadStateSafety` (loader); `stateSafety.repairJsonlTail(stateLogPath)` call; `registry.stateLogRepair` assignment |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts` | `repairJsonlTail` — scan+truncate export; `JsonlRepairResult` type; `appendJsonlRecord` |

---

## 5. SOURCE METADATA

- Group: Runtime Robustness
- Playbook ID: RUNTIME-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--runtime-robustness/jsonl-repair.md`
