---
title: "Run-now control"
description: "Adds a consume-once `.deep-research-run-now` sentinel for out-of-cadence iteration dispatch."
trigger_phrases:
  - "run-now control"
  - "deep-research-run-now"
  - "run_now_requested"
  - "forced run sentinel"
  - "run_now_accepted"
version: 1.14.0.13
---

# Run-now control

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Adds a consume-once `.deep-research-run-now` sentinel for out-of-cadence iteration dispatch.

Run-now control gives operators a file-based way to request one immediate iteration without restarting the loop or conflating forced-run intent with scheduled cadence state.

---

## 2. HOW IT WORKS

The auto workflow declares `{artifact_dir}/.deep-research-run-now` as `state_paths.run_now_sentinel`. At the loop boundary, `step_run_now_check` detects the sentinel, emits `run_now_requested`, checks pause precedence, and consumes the sentinel atomically before dispatch when the run is accepted.

If the loop is paused, the workflow emits `run_now_rejected` with reason `loop_paused` and leaves the sentinel in place. After dispatch, `step_run_now_restore_check` can detect that an operator recreated the sentinel mid-run and records `run_now_restored` for the next boundary.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/commands/deep/assets/deep-research-auto.yaml` | Workflow | Defines the sentinel path, run-now check, pause precedence, consume-once behavior, and restore detection. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/runtime/tests/unit/run-now-yaml-control.vitest.ts` | Vitest | Verifies accepted, rejected, and restored run-now event behavior. |
| `.opencode/skills/system-deep-loop/deep-research/manual-testing-playbook/pause-resume-and-fault-tolerance/run-now-control.md` | Manual playbook | Verifies operator-visible forced-run sentinel behavior. |

---

## 4. SOURCE METADATA

- Group: Loop lifecycle
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `loop-lifecycle/run-now-control.md`
Related references:
- [iteration-dispatch.md](../../feature-catalog/loop-lifecycle/iteration-dispatch.md) - Iteration dispatch
- [convergence-check.md](../../feature-catalog/loop-lifecycle/convergence-check.md) - Convergence check
