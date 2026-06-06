---
title: "SWEEP-001 -- Heterogeneous Pool Dispatch"
description: "This scenario validates Heterogeneous Pool Dispatch for `SWEEP-001`. It focuses on the concurrent launch of native and CLI seat groups and the barrier-join before merge."
---

# SWEEP-001 -- Heterogeneous Pool Dispatch

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SWEEP-001`.

---

## 1. OVERVIEW

This scenario validates Heterogeneous Pool Dispatch for `SWEEP-001`. It focuses on `step_parallel_sweep`, which launches `step_sweep_native_batch` and `step_sweep_cli_pool` together without waiting for either, then barrier-joins all seats before `step_merge_findings` runs.

### Why This Matters

The by-model-shared-scope design means agreement confidence is only valid when all seats sweep the same focus in parallel — not one after another. If native and CLI seats are dispatched sequentially rather than concurrently, early-seat findings influence later seats' framing and the agreement signal is compromised. Verifying the barrier-join contract protects the core confidence model.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SWEEP-001` and confirm the expected signals without contradictory evidence.

- Objective: Verify that `step_parallel_sweep` launches both seat groups concurrently and barrier-joins before merge.
- Real user request: `Verify that the deep-context loop dispatches native and CLI seats simultaneously each iteration.`
- Prompt: `As a manual-testing orchestrator, validate the heterogeneous pool dispatch contract for deep-context against the auto YAML, loop_protocol.md, and SKILL.md §3. Verify step_parallel_sweep names both step_sweep_native_batch and step_sweep_cli_pool as concurrent sub-steps and that the auto YAML includes a barrier-join before step_merge_findings. Return a concise user-facing verdict.`
- Expected execution process: Read auto YAML for `step_parallel_sweep`, `step_sweep_native_batch`, `step_sweep_cli_pool` in the loop phase; read loop_protocol.md §5 for concurrent dispatch documentation; read SKILL.md §3 for the "barrier-join" description.
- Expected signals: `step_parallel_sweep` with both sub-steps appears in the auto YAML; SKILL.md §3 step 2 or loop_protocol.md §5 describes the barrier-join; "barrier-join" or equivalent is the described synchronization point before merge.
- Desired user-visible outcome: Native and CLI seats start simultaneously each iteration and the host only merges after all seats have returned their structured findings.
- Pass/fail: PASS if `step_parallel_sweep` with both sub-steps is in the YAML and loop_protocol.md documents the barrier-join; FAIL if either sub-step is missing or sequential dispatch is implied.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Stay local; doc-verification only.
3. Execute the deterministic steps exactly as written.
4. Compare observed output against the desired outcome.
5. Return a concise final answer.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SWEEP-001 | Heterogeneous Pool Dispatch | Verify concurrent dispatch with barrier-join before merge | `Verify that the deep-context loop dispatches native and CLI seats simultaneously each iteration.` | 1. `rg "step_parallel_sweep\|step_sweep_native_batch\|step_sweep_cli_pool" .opencode/commands/deep/assets/deep_start-context-loop_auto.yaml` -> 2. `rg "barrier.join\|concurrent\|parallel.*batch\|barrier" .opencode/skills/deep-context/references/loop_protocol.md` -> 3. `rg "barrier.join\|barrier-join" .opencode/skills/deep-context/SKILL.md` | Step 1: all three step names found; Step 2: barrier-join concept documented in loop_protocol.md; Step 3: barrier-join mentioned in SKILL.md | Grep outputs from all three commands | PASS if steps 1-3 all return matches; FAIL if step names or barrier-join concept is absent | 1. Check YAML structure for alternative step naming. 2. Search SKILL.md §3 specifically for concurrent-dispatch wording. 3. Confirm loop_protocol.md §5 is the correct section. |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/02--by-model-parallel-sweep/heterogeneous-pool-dispatch.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml` | Primary: `step_parallel_sweep`, `step_sweep_native_batch`, `step_sweep_cli_pool` in the loop phase |
| `.opencode/skills/deep-context/references/loop_protocol.md` | §5: concurrent dispatch, barrier-join, both seat groups |
| `.opencode/skills/deep-context/SKILL.md` | §3: by-model parallel sweep description with barrier-join |

---

## 5. SOURCE METADATA

- Group: By-Model Parallel Sweep
- Playbook ID: SWEEP-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--by-model-parallel-sweep/heterogeneous-pool-dispatch.md`
