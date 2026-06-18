---
title: "SYN-003 -- Reduce-State Merge"
description: "This scenario validates Reduce-State Merge for `SYN-003`. It focuses on reduce-state.cjs syntax correctness, its exports, constant values, and the artifact paths it reads from the spec folder."
---

# SYN-003 -- Reduce-State Merge

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SYN-003`.

---

## 1. OVERVIEW

This scenario validates Reduce-State Merge for `SYN-003`. It focuses on `reduce-state.cjs` passing syntax check, exposing the correct exports (`reduceContextState`, `dedupByUnit`, `detectContradictions`, `buildRegistry`, `parseJsonl`, `parseJsonlDetailed`, `unitId`, `collectAllSeatFindings`), correct constant values (`DEFAULT_RELEVANCE_GATE = 0.55`, `DEFAULT_AGREEMENT_MIN = 2`), `KIND_TO_BUCKET` covering all five kinds, and reading from `{artifact_dir}/deep-context-state.jsonl` and `{artifact_dir}/seats/`.

### Why This Matters

`reduce-state.cjs` is the host-side consolidation engine that operators use both inline (the loop calls it after each iteration) and standalone (recovery from partial runs, post-run analysis). If the script has syntax errors or incorrect export names, operators cannot use it for recovery without modifying the source. Verifying the exports and constants in isolation prevents silent incompatibilities from being discovered only during a failed production run.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SYN-003` and confirm the expected signals without contradictory evidence.

- Objective: Verify `reduce-state.cjs` syntax, exports, constants, and artifact path conventions.
- Real user request: `Verify that the deep-context state reducer is syntax-clean and exports the expected API surface.`
- Prompt: `As a manual-testing orchestrator, validate the reduce-state.cjs script contract for deep-context by running node --check and inspecting its exports and constants. Verify DEFAULT_RELEVANCE_GATE = 0.55, DEFAULT_AGREEMENT_MIN = 2, KIND_TO_BUCKET maps all five kinds, reduceContextState(specFolder) is exported, and the script reads from {artifact_dir}/deep-context-state.jsonl and {artifact_dir}/seats/. Return a concise verdict.`
- Expected execution process: Run `node --check` on the script; read `module.exports` for exported function names; check `KIND_TO_BUCKET` for all five kind-to-bucket mappings; check `DEFAULT_RELEVANCE_GATE` and `DEFAULT_AGREEMENT_MIN` constants; grep for the artifact path patterns.
- Expected signals: `node --check .opencode/skills/deep-loop-workflows/deep-context/scripts/reduce-state.cjs` exits 0; `module.exports` contains `reduceContextState`, `dedupByUnit`, `detectContradictions`, `buildRegistry`; `KIND_TO_BUCKET` has entries for `reuse_candidate`, `integration_point`, `convention`, `dependency`, `gap`; `DEFAULT_RELEVANCE_GATE = 0.55` and `DEFAULT_AGREEMENT_MIN = 2`.
- Desired user-visible outcome: The reducer can be safely invoked on any spec folder to reconstruct the findings registry and dashboard from the persisted state log and seat artifacts, both inline during the loop and as a standalone recovery tool.
- Pass/fail: PASS if node --check exits 0 and all four constant/export checks return the expected values; FAIL if the syntax check fails or any export or constant is incorrect.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Stay local; run syntax check and grep the script.
3. Execute the deterministic steps exactly as written.
4. Compare observed output against the desired outcome.
5. Return a concise final answer.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SYN-003 | Reduce-State Merge | Verify reduce-state.cjs syntax, exports, and constants | `Verify that the deep-context state reducer is syntax-clean and exports the expected API surface.` | 1. `node --check .opencode/skills/deep-loop-workflows/deep-context/scripts/reduce-state.cjs` -> 2. `rg "DEFAULT_RELEVANCE_GATE.*0\.55\|DEFAULT_AGREEMENT_MIN.*2" .opencode/skills/deep-loop-workflows/deep-context/scripts/reduce-state.cjs` -> 3. `rg "KIND_TO_BUCKET" .opencode/skills/deep-loop-workflows/deep-context/scripts/reduce-state.cjs` -> 4. `rg "module\.exports" .opencode/skills/deep-loop-workflows/deep-context/scripts/reduce-state.cjs` | Step 1: exits 0; Step 2: both constants with correct values; Step 3: KIND_TO_BUCKET definition found; Step 4: module.exports with reduceContextState found | Exit code from step 1; grep outputs from steps 2-4 | PASS if step 1 exits 0 and steps 2-4 all return expected values; FAIL if syntax check fails or any constant/export is missing | 1. Check whether reduce-state.cjs requires tsx (it should not — it uses `require` not ESM). 2. Confirm it resolves `review-research-paths.cjs` dependency from system-spec-kit. 3. Run `node -e "require('./reduce-state.cjs')"` from the scripts directory for a runtime check. |

### Optional Supplemental Checks

Verify all five KIND_TO_BUCKET entries are present:

```bash
rg "reuse_candidate|integration_point|convention|dependency|gap" .opencode/skills/deep-loop-workflows/deep-context/scripts/reduce-state.cjs
```

Verify the artifact path patterns for JSONL log and seats directory:

```bash
rg "deep-context-state\.jsonl\|seats\/" .opencode/skills/deep-loop-workflows/deep-context/scripts/reduce-state.cjs
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/05--context-report-synthesis/reduce-state-merge.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/deep-loop-workflows/deep-context/scripts/reduce-state.cjs` | Primary: `reduceContextState`, `dedupByUnit`, `detectContradictions`, `buildRegistry`, `KIND_TO_BUCKET`, constants |
| `.opencode/commands/deep/assets/deep_context_auto.yaml` | `step_update_registry`: in-loop equivalent of the standalone reduce-state.cjs |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` | Attribution shape reused by the reducer for cross-executor union consistency |

---

## 5. SOURCE METADATA

- Group: Context Report Synthesis
- Playbook ID: SYN-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--context-report-synthesis/reduce-state-merge.md`
