---
title: "DR-063 -- Loop-wide dry-run"
description: "Verify that `--dry-run` performs safe preflight reads and halts before dispatch, state mutation, reducer refresh, or child spawn."
version: 1.14.0.21
---

# DR-063 -- Loop-wide dry-run

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-063`.

---

## 1. OVERVIEW

This scenario validates loop-wide dry-run for `DR-063`. The objective is to verify that `--dry-run` is a first-class confirm-flow flag that previews safe work and halts at mutation boundaries.

### WHY THIS MATTERS

Operators need to inspect what a loop would do without accidentally dispatching executors, mutating packet state, refreshing reducers, or spawning child lineages.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that `--dry-run` performs safe preflight reads and halts before dispatch, state mutation, reducer refresh, or child spawn.
- Real user request: Preview what deep-research would do without writing files or dispatching anything.
- Prompt: `Validate deep-research dry-run flag parsing and confirm-YAML halt boundaries.`
- Expected execution process: Inspect command argument binding and dry-run prose, then confirm YAML dry-run control, halt hooks, boundary labels, and terminal preview policies.
- Desired user-visible outcome: The user is told which steps still run and where dry-run halts before side effects.
- Expected signals: `--dry-run` normalizes to boolean input, non-mutating setup/read steps can run, and `dry_run_halt` events exist for dispatch, state-mutation, reducer-refresh, and child-spawn boundaries.
- Pass/fail posture: PASS if dry-run is a flag on confirm mode and all mutation boundaries halt before side effects; FAIL if dry-run is undocumented, skips all useful reads, or still mutates state.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate deep-research dry-run flag parsing and confirm-YAML halt boundaries.
### Commands
1. `bash: rg -n 'dry_run|--dry-run|first-class flag|mutation boundary|workflow inputs' .opencode/commands/deep/research.md`
2. `bash: rg -n 'dry_run_control|dry_run_halt|dry_run_boundary|dispatch|state-mutation|reducer-refresh|child-spawn' .opencode/commands/deep/assets/deep_research_confirm.yaml`
3. `bash: rg -n 'dry_run_event_policy|terminal JSONL preview|do not append|do not write|skip_when:.*dry_run' .opencode/commands/deep/assets/deep_research_confirm.yaml`
### Expected
Dry-run performs safe preflight reads and prompt rendering when possible, emits preview-only `dry_run_halt` events, and stops before dispatch, persistent state mutation, reducer refresh, child spawn, or memory writes.
### Evidence
Capture command flag parsing, dry-run semantics prose, boundary labels, halt event examples, and preview-only event policies.
### Pass/Fail
PASS if dry-run reads enough to preview behavior and halts before every mutation boundary; FAIL if it either does nothing useful or allows side effects.
### Failure Triage
Privilege `research.md` for user-facing flag semantics and `deep_research_confirm.yaml` for live halt boundaries.

---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated review protocol, and scenario summary |
| `../../feature_catalog/loop_lifecycle/loop_wide_dry_run.md` | Matching feature catalog entry |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/commands/deep/research.md` | User-facing `--dry-run` flag and semantics |
| `.opencode/commands/deep/assets/deep_research_confirm.yaml` | Dry-run control, halt hooks, boundary labels, and preview policies |

---

## 5. SOURCE METADATA

- Group: ENTRY POINTS AND MODES
- Playbook ID: DR-063
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `entry-points-and-modes/loop-wide-dry-run.md`
- Feature catalog: `feature_catalog/loop_lifecycle/loop_wide_dry_run.md`
