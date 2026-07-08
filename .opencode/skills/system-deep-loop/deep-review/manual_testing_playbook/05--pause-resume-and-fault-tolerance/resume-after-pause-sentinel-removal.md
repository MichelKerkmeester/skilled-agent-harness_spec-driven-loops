---
title: "DRV-022 -- Resume after pause sentinel removal"
description: "Verify that removing the pause sentinel lets the review loop resume from its persisted state."
version: 1.11.0.14
---

# DRV-022 -- Resume after pause sentinel removal

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-022`.

---

## 1. OVERVIEW

This scenario validates resume after pause sentinel removal for `DRV-022`. The objective is to verify that removing the `review/.deep-review-pause` sentinel lets the review loop resume from its persisted state without loss of prior findings.

### WHY THIS MATTERS

A pause is only useful if the operator can resume cleanly afterward. The review loop must re-read its externalized state (JSONL, strategy, config) and continue from the exact iteration where it paused, preserving all prior findings and dimension coverage progress.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify removing pause sentinel lets review resume from read-state.
- Real user request: After I pause a review and delete the pause file, does it pick up where it left off?
- Prompt: `Validate deep-review resume after pause removal and report whether the next iteration resumes without replay.`
- Expected execution process: Inspect the loop protocol for resume behavior, then the review YAML for state re-read on resume, then the quick reference for user-facing resume instructions.
- Desired user-facing outcome: The user is told that deleting the pause file resumes the review from where it stopped, with all prior findings preserved.
- Expected signals: Removing the sentinel triggers loop re-entry, JSONL is re-read to determine last iteration, strategy.md provides dimension coverage state, no iterations are re-run, and the resume event is logged.
- Pass/fail posture: PASS if removing the sentinel resumes correctly from persisted state. FAIL if the loop restarts from iteration 1 or loses prior findings.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate deep-review resume after pause removal and report whether the next iteration resumes without replay.
### Commands
1. `bash: rg -n 'resume|re-read|read.state|iteration.*count|last.*iteration|Delete.*pause|sentinel.*removal' .opencode/skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md .opencode/skills/system-deep-loop/deep-review/references/state/state_format.md`
2. `bash: rg -n 'resume|read_state|re_read|iteration_count|last_iteration|pause.*removed|sentinel.*delete' .opencode/commands/deep/assets/deep_review_auto.yaml .opencode/commands/deep/assets/deep_review_confirm.yaml`
3. `bash: rg -n 'resume|pause.*delete|pick up|restart|continue.*review' .opencode/skills/system-deep-loop/deep-review/references/protocol/quick_reference.md .opencode/skills/system-deep-loop/deep-review/SKILL.md .opencode/skills/system-deep-loop/deep-review/README.md .opencode/commands/deep/review.md`
### Expected
Removing sentinel triggers loop re-entry, JSONL re-read determines last iteration, strategy.md provides dimension state, no iterations re-run, and resume event logged.
### Evidence
Capture the resume flow from loop protocol, the YAML state re-read mechanism, and the user-facing resume instructions.
### Pass/Fail
PASS if removing the sentinel resumes correctly from persisted state. FAIL if the loop restarts from iteration 1 or loses prior findings.
### Failure Triage
Privilege the loop protocol for resume flow and the state format reference for JSONL iteration counting. Use YAML as enforcement confirmation.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated review protocol, and scenario summary |
| `feature_catalog/` | No dedicated feature catalog exists yet for `deep-review`, use the live docs below as the implementation contract |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md` | Resume and pause sentinel lifecycle, use the lifecycle branch table |
| `.opencode/skills/system-deep-loop/deep-review/references/state/state_format.md` | JSONL state schema for iteration counting on resume, use the state log section |
| `.opencode/commands/deep/assets/deep_review_auto.yaml` | State re-read and resume logic in loop entry |
| `.opencode/commands/deep/assets/deep_review_confirm.yaml` | State re-read and resume logic in loop entry |
| `.opencode/commands/deep/review.md` | Command entrypoint, resume documentation |
| `.opencode/skills/system-deep-loop/deep-review/references/protocol/quick_reference.md` | Troubleshooting and state files, use `ANCHOR:state-files` and `ANCHOR:troubleshooting` |
| `.opencode/skills/system-deep-loop/deep-review/SKILL.md` | Rules for state reading, use `ANCHOR:rules` Rule 1 |

---

## 5. SOURCE METADATA

- Group: PAUSE, RESUME, AND FAULT TOLERANCE
- Playbook ID: DRV-022
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--pause-resume-and-fault-tolerance/resume-after-pause-sentinel-removal.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skills/system-deep-loop/deep-review/` as of 2026-03-28.
