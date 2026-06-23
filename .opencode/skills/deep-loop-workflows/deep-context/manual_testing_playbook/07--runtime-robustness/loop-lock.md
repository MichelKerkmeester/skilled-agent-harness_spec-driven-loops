---
title: "RUNTIME-004 -- Loop Lock"
description: "This scenario validates Loop Lock for `RUNTIME-004`. It focuses on `loop-lock.cjs` syntax correctness and the presence of `step_acquire_lock`/`step_release_lock` references in both the auto and confirm YAML workflow files."
version: 1.2.0.3
---

# RUNTIME-004 -- Loop Lock

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `RUNTIME-004`.

---

## 1. OVERVIEW

This scenario validates Loop Lock for `RUNTIME-004`. It focuses on `loop-lock.cjs` passing syntax check, exposing the `acquire`/`refresh`/`release` CLI contract, and being correctly wired via `step_acquire_lock` and `step_release_lock` in both `deep_context_auto.yaml` and `deep_context_confirm.yaml`.

### Why This Matters

Without a loop lock, two concurrent sessions targeting the same spec folder can both enter `phase_loop` simultaneously, producing interleaved writes to the JSONL state log and the findings registry. Verifying the lock wiring prevents this race condition from being silently present while appearing correctly documented.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `RUNTIME-004` and confirm the expected signals without contradictory evidence.

- Objective: Verify that `loop-lock.cjs` is syntax-clean and that `step_acquire_lock`/`step_release_lock` are wired into both YAML workflow files.
- Real user request: `Verify that the deep-context loop lock script is syntax-clean and correctly wired into the context loop workflows.`
- Prompt: `As a manual-testing orchestrator, validate the loop lock contract for deep-context by running node --check on loop-lock.cjs and confirming step_acquire_lock and step_release_lock appear in both auto and confirm YAML files. Return a concise verdict.`
- Expected execution process: Run `node --check` on loop-lock.cjs; grep both YAML files for `step_acquire_lock` and `step_release_lock`; grep loop-lock.cjs for `loop-lock.cjs` self-reference in its own invocation pattern.
- Expected signals: `node --check` exits 0; `step_acquire_lock` found in auto YAML; `step_acquire_lock` found in confirm YAML; `step_release_lock` found in auto YAML; `step_release_lock` found in confirm YAML.
- Desired user-visible outcome: Concurrent deep-context sessions targeting the same spec folder are blocked at `step_acquire_lock` (the second session exits 1 and halts) without corrupting the shared state artifacts.
- Pass/fail: PASS if `node --check` exits 0 and all four YAML grep checks return matches; FAIL if the syntax check fails or any lock step is absent from either YAML.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Stay local; run syntax check and grep both YAML files.
3. Execute the deterministic steps exactly as written.
4. Compare observed output against the desired outcome.
5. Return a concise final answer.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RUNTIME-004 | Loop Lock | Verify loop-lock.cjs syntax and YAML step_acquire_lock/step_release_lock wiring | `Verify that the deep-context loop lock script is syntax-clean and correctly wired into the context loop workflows.` | 1. `node --check .opencode/skills/deep-loop-workflows/deep-context/scripts/loop-lock.cjs` -> 2. `rg "loop-lock.cjs" .opencode/commands/deep/assets/deep_context_auto.yaml .opencode/commands/deep/assets/deep_context_confirm.yaml` -> 3. `rg "step_acquire_lock\|step_release_lock" .opencode/commands/deep/assets/deep_context_auto.yaml` -> 4. `rg "step_acquire_lock\|step_release_lock" .opencode/commands/deep/assets/deep_context_confirm.yaml` | Step 1: exits 0; Step 2: loop-lock.cjs referenced in both YAMLs; Step 3: both lock steps found in auto YAML; Step 4: both lock steps found in confirm YAML | Exit code from step 1; grep outputs from steps 2-4 | PASS if step 1 exits 0 and steps 2-4 all return expected matches; FAIL if syntax check fails or any lock step is absent | 1. Confirm the lock file path uses `{state_paths.lock_file}` in the YAML command (not a hardcoded path). 2. Confirm `step_release_lock` appears in the halt/cancel/completed-session exit paths (not only in phase_synthesis). 3. Verify loop-lock.cjs requires `acquireLoopLock`, `refreshLoopLock`, and `releaseLoopLock` from the runtime module. |

### Optional Supplemental Checks

Verify that `acquireLoopLock`, `refreshLoopLock`, and `releaseLoopLock` are referenced in `loop-lock.cjs`:

```bash
rg "acquireLoopLock\|refreshLoopLock\|releaseLoopLock" .opencode/skills/deep-loop-workflows/deep-context/scripts/loop-lock.cjs
```

Verify the runtime `loop-lock.ts` exports all three functions:

```bash
rg "export function acquireLoopLock\|export function refreshLoopLock\|export function releaseLoopLock" .opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/07--runtime-robustness/loop-lock.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/deep-loop-workflows/deep-context/scripts/loop-lock.cjs` | CLI wrapper: `acquire`, `refresh`, `release` actions; loads `loop-lock.ts` via tsx CJS register |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts` | `acquireLoopLock`, `refreshLoopLock`, `releaseLoopLock`, `isStaleLoopLock`, `processAlive` |
| `.opencode/commands/deep/assets/deep_context_auto.yaml` | `step_acquire_lock` and `step_release_lock` invocations |
| `.opencode/commands/deep/assets/deep_context_confirm.yaml` | `step_acquire_lock` and `step_release_lock` invocations |

---

## 5. SOURCE METADATA

- Group: Runtime Robustness
- Playbook ID: RUNTIME-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--runtime-robustness/loop-lock.md`
