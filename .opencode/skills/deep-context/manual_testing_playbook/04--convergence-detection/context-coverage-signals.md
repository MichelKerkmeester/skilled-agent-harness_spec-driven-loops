---
title: "CONV-001 -- Context Coverage Signals"
description: "This scenario validates Context Coverage Signals for `CONV-001`. It focuses on the ContextConvergenceSignals interface in coverage-graph-signals.ts and the five signal computations from graph state."
---

# CONV-001 -- Context Coverage Signals

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CONV-001`.

---

## 1. OVERVIEW

This scenario validates Context Coverage Signals for `CONV-001`. It focuses on `ContextConvergenceSignals` exported from `coverage-graph-signals.ts` with five fields (`sliceCoverage`, `reuseCatalogCoverage`, `agreementRate`, `relevanceFloor`, `dependencyCompleteness`), the `computeContextSignalsFromData` pure function, and the vacuous-pass behavior (returns 1.0 when the node kind is absent).

### Why This Matters

The five signals are the ground truth for the stop decision. If any signal is computed incorrectly — for example, `sliceCoverage` counting COVERED_BY target nodes instead of source nodes — the loop either stops too early (falsely high coverage) or never stops (falsely low coverage). Verifying the interface and vacuous-pass behavior is the minimum correctness check before any convergence tuning.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CONV-001` and confirm the expected signals without contradictory evidence.

- Objective: Verify `ContextConvergenceSignals` has all five fields and `computeContextSignalsFromData` is exported with vacuous-pass behavior.
- Real user request: `Verify that the deep-context convergence engine tracks all five coverage signals correctly.`
- Prompt: `As a manual-testing orchestrator, validate the context coverage signals contract for deep-context against coverage-graph-signals.ts, convergence.md §2, and SKILL.md §8 quick reference. Verify ContextConvergenceSignals interface has sliceCoverage, reuseCatalogCoverage, agreementRate, relevanceFloor, and dependencyCompleteness; computeContextSignalsFromData is exported; and the signal roles match those documented in convergence.md. Return a concise verdict.`
- Expected execution process: Read `coverage-graph-signals.ts` for `ContextConvergenceSignals` interface and `computeContextSignalsFromData` export; read convergence.md §2 for signal role descriptions; read SKILL.md §8 quick reference for signal names.
- Expected signals: `ContextConvergenceSignals` interface with all five fields exists in the file; `computeContextSignalsFromData` is exported; `CONTEXT_RELEVANCE_GATE = 0.55` and `CONTEXT_AGREEMENT_MIN = 2` constants are present; convergence.md §2 table has all five signals; SKILL.md §8 lists all five.
- Desired user-visible outcome: The convergence engine evaluates all five signals from the live coverage graph and each signal returns 1.0 when its node kind is absent, preventing false-positive STOP_BLOCKED outcomes for features with no dependencies.
- Pass/fail: PASS if the interface, function export, and constants all exist in `coverage-graph-signals.ts` and convergence.md §2 documents all five; FAIL if any element is missing.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Stay local; grep the TypeScript source and reference docs.
3. Execute the deterministic steps exactly as written.
4. Compare observed output against the desired outcome.
5. Return a concise final answer.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CONV-001 | Context Coverage Signals | Verify ContextConvergenceSignals interface and computeContextSignalsFromData export | `Verify that the deep-context convergence engine tracks all five coverage signals correctly.` | 1. `rg "ContextConvergenceSignals" .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` -> 2. `rg "sliceCoverage\|reuseCatalogCoverage\|agreementRate\|relevanceFloor\|dependencyCompleteness" .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` -> 3. `rg "computeContextSignalsFromData\|computeContextSignals" .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` -> 4. `rg "CONTEXT_RELEVANCE_GATE\|CONTEXT_AGREEMENT_MIN" .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` | Step 1: interface definition found; Step 2: all five field names found; Step 3: function export found; Step 4: both constants found | Grep outputs from all four commands | PASS if steps 1-4 all return matches; FAIL if interface, function, or constants are absent | 1. Confirm file path under deep-loop-runtime. 2. Search for alternative interface naming (ContextSignals, ContextConvergence). 3. Check if constants are defined in coverage-graph-db.ts instead. |

### Optional Supplemental Checks

Verify the vacuous-pass pattern for sliceCoverage (returns 1.0 when sliceNodes.length === 0):

```bash
rg "sliceNodes.length > 0\|sliceNodes\.length.*1\|vacuous" .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/04--convergence-detection/context-coverage-signals.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` | `ContextConvergenceSignals` interface, `computeContextSignalsFromData`, `CONTEXT_RELEVANCE_GATE`, `CONTEXT_AGREEMENT_MIN` |
| `.opencode/skills/deep-context/references/convergence/convergence_signals.md` | §2: signal roles and meanings table |
| `.opencode/skills/deep-context/SKILL.md` | §8 Quick Reference: signals listed with thresholds |

---

## 5. SOURCE METADATA

- Group: Convergence Detection
- Playbook ID: CONV-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--convergence-detection/context-coverage-signals.md`
