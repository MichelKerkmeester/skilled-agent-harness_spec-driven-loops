---
title: "CONV-004 -- Evaluate Context via Convergence Script"
description: "This scenario validates Evaluate Context via Convergence Script for `CONV-004`. It focuses on the convergence.cjs --loop-type context invocation, argument parsing, output structure, and exit-code contract."
---

# CONV-004 -- Evaluate Context via Convergence Script

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CONV-004`.

---

## 1. OVERVIEW

This scenario validates Evaluate Context via Convergence Script for `CONV-004`. It focuses on `convergence.cjs --loop-type context` running without error, accepting `--spec-folder`, `--session-id`, `--iteration` flags, and emitting a parseable JSON result with `decision`, `signals`, and `blockers` fields. The exit-code contract is: 0 = success, 1 = script error, 2 = DB error, 3 = input validation error.

### Why This Matters

`convergence.cjs` is the shared evaluation engine consumed by all three loop types. For `deep-context`, `--loop-type context` triggers `evaluateContext` in `coverage-graph-signals.ts`. If the script fails to parse `context` as a valid loop type, every context loop stops with a non-zero exit and the auto YAML's `step_graph_convergence` reports failure. This scenario confirms the baseline that context-loop convergence evaluation is wired end-to-end.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CONV-004` and confirm the expected signals without contradictory evidence.

- Objective: Verify `convergence.cjs --loop-type context` syntax-checks cleanly and the script accepts the required flags with the documented exit-code contract.
- Real user request: `Verify that the convergence script supports the context loop type and documents its exit codes correctly.`
- Prompt: `As a manual-testing orchestrator, validate the convergence.cjs --loop-type context invocation contract for deep-context against the script's CLI argument handling and the YAML's step_graph_convergence. Verify the script parses --loop-type context, --spec-folder, and --session-id flags; exits 0 on valid input with a decision field; exits 1/2/3 on error/DB/input-validation failures. Run node --check on the script. Return a concise verdict.`
- Expected execution process: Run `node --check` on `convergence.cjs`; read the script's argument parsing for `--loop-type`, `--spec-folder`, `--session-id`, `--iteration`; check `coverage-graph-db.ts` for `'context'` in the LoopType definition; read the auto YAML for `step_graph_convergence` invocation pattern.
- Expected signals: `node --check .opencode/skills/deep-loop-runtime/scripts/convergence.cjs` exits 0; `'context'` appears in `coverage-graph-db.ts` LoopType; the auto YAML's `step_graph_convergence` shows `--loop-type context`; exit codes 1/2/3 are documented in the script or feature file.
- Desired user-visible outcome: The convergence script produces a machine-readable `{ decision, signals, blockers }` result that the auto YAML's `step_check_convergence` can consume without transformation.
- Pass/fail: PASS if node --check exits 0, `'context'` is a valid LoopType in the DB module, and the YAML shows the correct invocation; FAIL if the syntax check fails or `context` is not recognized.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Stay local; run syntax check, grep source files.
3. Execute the deterministic steps exactly as written.
4. Compare observed output against the desired outcome.
5. Return a concise final answer.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CONV-004 | Evaluate Context via Convergence Script | Verify convergence.cjs accepts --loop-type context with correct exit codes | `Verify that the convergence script supports the context loop type and documents its exit codes correctly.` | 1. `node --check .opencode/skills/deep-loop-runtime/scripts/convergence.cjs` -> 2. `rg "'context'\|\"context\"" .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` -> 3. `rg "loop.type.*context\|context.*loop" .opencode/commands/deep/assets/deep_start-context-loop_auto.yaml` -> 4. `rg "exit.*1\|exit.*2\|exit.*3\|INPUT_VALIDATION\|DB.*error" .opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | Step 1: exits 0; Step 2: 'context' found as valid LoopType; Step 3: --loop-type context in YAML step; Step 4: exit codes documented | Exit code from step 1; grep outputs from steps 2-4 | PASS if step 1 exits 0 and steps 2-4 all return matches; FAIL if node --check fails or 'context' is not a recognized loop type | 1. Check if convergence.cjs uses tsx loader (expected — it re-spawns itself with tsx). 2. Verify LoopType is defined in coverage-graph-db.ts as a string union including 'context'. 3. Confirm step_graph_convergence is in the loop phase of the auto YAML. |

### Optional Supplemental Checks

Verify that `evaluateContext` or a context-specific evaluation path is dispatched from inside the script:

```bash
rg "evaluateContext\|context.*signal\|computeContext" .opencode/skills/deep-loop-runtime/scripts/convergence.cjs
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/04--convergence-detection/evaluate-context.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | CLI entrypoint: argument parsing, LoopType dispatch, exit codes |
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` | `LoopType` union including `'context'`; `VALID_KINDS.context` |
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` | `computeContextSignals` dispatched by the convergence script for context loop type |
| `.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml` | `step_graph_convergence`: the exact invocation pattern |
| `.opencode/skills/deep-loop-runtime/tests/integration/convergence-script.vitest.ts` | Automated regression for convergence script exit codes and JSON output |

---

## 5. SOURCE METADATA

- Group: Convergence Detection
- Playbook ID: CONV-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--convergence-detection/evaluate-context.md`
