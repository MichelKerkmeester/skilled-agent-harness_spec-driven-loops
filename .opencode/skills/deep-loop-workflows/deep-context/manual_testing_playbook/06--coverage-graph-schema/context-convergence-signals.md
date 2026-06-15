---
title: "CG-003 -- Context Convergence Signals"
description: "This scenario validates Context Convergence Signals for `CG-003`. It focuses on `computeContextSignalsFromData` as a pure exported function with vacuous-pass semantics, `createSnapshot` using `ON CONFLICT DO UPDATE`, and the five convergence signal fields."
---

# CG-003 -- Context Convergence Signals

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CG-003`.

---

## 1. OVERVIEW

This scenario validates Context Convergence Signals for `CG-003`. It focuses on `coverage-graph-signals.ts` exporting `computeContextSignalsFromData(nodes, edges)` as a pure function with vacuous-pass semantics (signals default to 1.0 when the relevant node/edge kind is absent), the five `ContextConvergenceSignals` fields (`sliceCoverage`, `reuseCatalogCoverage`, `agreementRate`, `relevanceFloor`, `dependencyCompleteness`), the constants `CONTEXT_RELEVANCE_GATE = 0.55` and `CONTEXT_AGREEMENT_MIN = 2` matching `reduce-state.cjs`, and `createSnapshot` using `ON CONFLICT DO UPDATE` for idempotent upserts.

### Why This Matters

`computeContextSignalsFromData` is the pure evaluation kernel consumed by both the convergence script (online, via `convergence.cjs --loop-type context`) and the standalone reducer (offline, via `reduce-state.cjs`). If the vacuous-pass semantics break — returning 0.0 when a kind is absent rather than 1.0 — a partial sweep that found no `SLICE` nodes would return `sliceCoverage = 0.0` and trigger `STOP_BLOCKED` on the first iteration, preventing convergence on any spec. Verifying the pure function contract and the snapshot upsert idempotency prevents both false-blocked loops and duplicate snapshot rows.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CG-003` and confirm the expected signals without contradictory evidence.

- Objective: Verify `computeContextSignalsFromData` is a pure exported function with vacuous-pass; `ContextConvergenceSignals` has five fields; `CONTEXT_RELEVANCE_GATE = 0.55` and `CONTEXT_AGREEMENT_MIN = 2`; `createSnapshot` uses `ON CONFLICT DO UPDATE`.
- Real user request: `Verify that the deep-context convergence signal computation is a pure function with safe vacuous-pass semantics and that snapshot persistence is idempotent.`
- Prompt: `As a manual-testing orchestrator, validate the context convergence signals contract for deep-context against coverage-graph-signals.ts and coverage-graph-db.ts. Verify computeContextSignalsFromData is exported as a pure function; ContextConvergenceSignals has five fields (sliceCoverage, reuseCatalogCoverage, agreementRate, relevanceFloor, dependencyCompleteness); CONTEXT_RELEVANCE_GATE = 0.55 matches reduce-state.cjs DEFAULT_RELEVANCE_GATE; CONTEXT_AGREEMENT_MIN = 2 matches DEFAULT_AGREEMENT_MIN; createSnapshot uses ON CONFLICT DO UPDATE. Return a concise verdict.`
- Expected execution process: Grep `coverage-graph-signals.ts` for `computeContextSignalsFromData` export; grep for the five signal field names; check `CONTEXT_RELEVANCE_GATE` and `CONTEXT_AGREEMENT_MIN` values; grep `coverage-graph-db.ts` for `createSnapshot` and `ON CONFLICT DO UPDATE`; verify constants match `reduce-state.cjs` defaults.
- Expected signals: `computeContextSignalsFromData` found as an export in `coverage-graph-signals.ts`; all five signal fields found; `CONTEXT_RELEVANCE_GATE = 0.55`; `CONTEXT_AGREEMENT_MIN = 2`; `ON CONFLICT DO UPDATE` found in `createSnapshot` or surrounding DB code.
- Desired user-visible outcome: A partial sweep with missing node kinds returns signal values of 1.0 (vacuous pass) rather than 0.0, and `createSnapshot` can be called idempotently at the end of every iteration without accumulating duplicate rows.
- Pass/fail: PASS if all five checks return the expected values and constants match between signals and reducer; FAIL if any signal field is missing, a constant mismatches, or `ON CONFLICT DO UPDATE` is absent from snapshot persistence.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Stay local; grep signals file and DB file.
3. Execute the deterministic steps exactly as written.
4. Compare observed output against the desired outcome.
5. Return a concise final answer.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CG-003 | Context Convergence Signals | Verify computeContextSignalsFromData pure export, five signal fields, constants, and snapshot idempotency | `Verify that the deep-context convergence signal computation is a pure function with safe vacuous-pass semantics and that snapshot persistence is idempotent.` | 1. `rg "computeContextSignalsFromData\|export.*computeContext" .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` -> 2. `rg "sliceCoverage\|reuseCatalogCoverage\|agreementRate\|relevanceFloor\|dependencyCompleteness" .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` -> 3. `rg "CONTEXT_RELEVANCE_GATE.*0\.55\|CONTEXT_AGREEMENT_MIN.*2" .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` -> 4. `rg "DEFAULT_RELEVANCE_GATE.*0\.55\|DEFAULT_AGREEMENT_MIN.*2" .opencode/skills/deep-loop-workflows/deep-context/scripts/reduce-state.cjs` -> 5. `rg "ON CONFLICT DO UPDATE\|createSnapshot" .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` | Step 1: computeContextSignalsFromData exported; Step 2: all five signal fields found; Step 3: both constants with correct values in signals file; Step 4: matching constants in reducer; Step 5: ON CONFLICT DO UPDATE and createSnapshot found | Grep outputs from all five commands | PASS if steps 1-5 all return expected values and constant values match between files; FAIL if any signal field is absent, constants diverge, or snapshot upsert is missing | 1. Open `coverage-graph-signals.ts` to verify vacuous-pass logic (look for `=== 0` checks returning 1.0). 2. Confirm `computeContextSignals` and `computeSignals` dispatchers call `computeContextSignalsFromData` rather than re-implementing signal logic. 3. Search `coverage-graph-db.ts` for the full `createSnapshot` function to verify `INSERT OR REPLACE` or `ON CONFLICT DO UPDATE` is used. |

### Optional Supplemental Checks

Verify vacuous-pass logic — when relevant nodes are absent, the function returns 1.0 for those signals:

```bash
rg "=== 0\|length.*0\|vacuous\|default.*1\.0\|return 1" .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts
```

Verify `computeContextSignals` dispatches to `computeContextSignalsFromData` rather than reimplementing the logic:

```bash
rg "computeContextSignals\|computeSignals\|evaluateContext" .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/06--coverage-graph-schema/context-convergence-signals.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` | `ContextConvergenceSignals`, `computeContextSignalsFromData`, `CONTEXT_RELEVANCE_GATE`, `CONTEXT_AGREEMENT_MIN`, vacuous-pass logic |
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` | `createSnapshot` with `ON CONFLICT DO UPDATE` for idempotent snapshot persistence |
| `.opencode/skills/deep-loop-workflows/deep-context/scripts/reduce-state.cjs` | `DEFAULT_RELEVANCE_GATE = 0.55`, `DEFAULT_AGREEMENT_MIN = 2` — must match signals constants |
| `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | `--loop-type context` dispatches to `computeContextSignals` which calls `computeContextSignalsFromData` |
| `.opencode/skills/deep-loop-workflows/deep-context/references/convergence/convergence_signals.md` | Composite score formula using all five signal fields with documented weights |

---

## 5. SOURCE METADATA

- Group: Coverage Graph Schema
- Playbook ID: CG-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--coverage-graph-schema/context-convergence-signals.md`
