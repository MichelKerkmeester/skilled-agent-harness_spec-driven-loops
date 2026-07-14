---
title: "GIT-030 -- Session-activity marker recorded and read"
description: "This scenario validates Session-activity marker recorded and read for `GIT-030`. It focuses on prove a launched top-level session records a PID marker under the common git dir that the reaper later uses to prove liveness or death."
version: 1.0.0.0
---

# GIT-030 -- Session-activity marker recorded and read

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-030`.

---

## 1. OVERVIEW

This scenario validates Session-activity marker recorded and read for `GIT-030`. It focuses on prove a launched top-level session records a PID marker under the common git dir that the reaper later uses to prove liveness or death.

### Why This Matters

The reaper's entire safety model rests on "absence of proof is never proof of absence." The marker is the only proof it ever gets that a wrapper session has actually ended, so it must be written reliably and outside the worktree it describes.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-030` and confirm the expected signals without contradictory evidence.

- Objective: prove a launched top-level session records a PID marker under the common git dir that the reaper later uses to prove liveness or death.
- Real user request: `When my session ends, I want the cleanup tooling to be able to tell it's actually done — not guess.`
- Prompt: `Launch a session, confirm its session marker file is written under the shared git common dir with the session's PID, and show the marker correctly reports the process as dead once it exits.`
- Expected execution process: Launch a short-lived runtime through the wrapper in a disposable fixture, confirm `<common-git-dir>/worktree-sessions/<runtime>-<slug>.pid` is created with the launching PID, then confirm the process is no longer running and the marker now indicates inactivity.
- Expected signals: the marker file exists and contains a single positive integer PID; `kill -0 <pid>` succeeds while the session is alive and fails once it exits; a write failure logs a WARNING rather than aborting the launch.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if the marker is written under the common dir (never inside the worktree) with the correct PID, and the reaper's own liveness check matches the actual process state. FAIL if the marker is missing after a successful launch, is written inside the worktree instead of the common dir, or its PID misreports a live process as dead.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the repository is on the intended branch and the working tree is safe for the scenario.
3. Execute or document the command sequence exactly as written.
4. Capture the expected signals and evidence artifacts.
5. Return a concise user-facing verdict with failure triage if needed.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| GIT-030 | Session-activity marker recorded and read | prove a launched top-level session records a PID marker under the common git dir that the reaper later uses to prove liveness or death. | `Launch a session, confirm its session marker file is written under the shared git common dir with the session's PID, and show the marker correctly reports the process as dead once it exits.` | 1. `bash: bash .opencode/bin/worktree-session.sh myrt` (disposable fixture; `myrt` exits immediately) -> 2. `bash: cat "$(git rev-parse --git-common-dir)/worktree-sessions/<runtime>-<slug>.pid"` -> 3. `bash: kill -0 "$(cat <marker>)"; echo $?` | The marker file exists with one PID; `kill -0` exits 0 while the process is alive and non-zero afterward. | Marker file path/content, and the `kill -0` exit code before and after the launched process exits. | PASS if the marker is written under the common dir (never inside the worktree) with the correct PID, and the reaper's own liveness check matches the actual process state. FAIL if the marker is missing after a successful launch, is written inside the worktree instead of the common dir, or its PID misreports a live process as dead. | Check the marker-write block in `worktree-session.sh §7`, then the reaper's `_marker_says_inactive` awk/`kill -0` check for the same file shape. |

### Optional Supplemental Checks

Delete the `worktree-sessions/` directory's write permission before launch to confirm a marker-write failure logs a WARNING and still completes the launch, per the wrapper's non-fatal marker-write contract.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

No `feature-catalog/` package exists for sk-git; see `manual-testing-playbook.md` §14 for the direct-anchor exception.

### Implementation Anchors

| File | Role |
|---|---|
| `../../../../bin/worktree-session.sh` | Session-marker write, kept under the common git dir |
| `../../../../bin/worktree-reaper.sh` | `_marker_says_inactive` liveness check consuming the same marker |
| `../../../../bin/tests/worktree-reaper.test.sh` | Regression coverage: dead/live/malformed marker classification |

---

## 5. SOURCE METADATA

- Group: Owner-First Worktree Tooling
- Playbook ID: GIT-030
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `owner_first_worktree_tooling/session_activity_marker.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
