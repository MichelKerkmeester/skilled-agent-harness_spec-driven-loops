---
title: "GIT-032 -- Auto-reap a clean, merged, marker-dead wrapper pair"
description: "This scenario validates auto-reap of a qualifying wrapper pair for `GIT-032`. It focuses on prove the reaper removes a wrapper worktree/branch pair only when the tree is clean, the branch is merged into the live integration tip, and the session marker proves the recorded PID is dead."
version: 1.0.0.0
---

# GIT-032 -- Auto-reap a clean, merged, marker-dead wrapper pair

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-032`.

---

## 1. OVERVIEW

This scenario validates auto-reap of a qualifying wrapper pair for `GIT-032`. It focuses on prove the reaper removes a wrapper worktree/branch pair only when all three hold together: clean tree, branch merged into the live integration tip, and a session marker proving the recorded PID is dead.

### Why This Matters

Automatic removal is the reaper's only destructive action. It must fire only when every safety condition is independently satisfied, never on a partial match.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-032` and confirm the expected signals without contradictory evidence.

- Objective: prove the reaper removes a wrapper worktree/branch pair only when the tree is clean, the branch is merged into the live integration tip, and the session marker proves the recorded PID is dead.
- Real user request: `Clean up any finished AI session worktrees, but only the ones that are actually done.`
- Prompt: `Run the worktree reaper against a fixture wrapper worktree that is clean, merged, and has a dead-PID marker, and confirm it is removed along with its branch and marker file.`
- Expected execution process: Build a fixture `work/<runtime>/<slug>` worktree that is clean and whose branch is merged into the fixture's current HEAD, write a marker file naming an already-exited PID, then run the reaper with no flags.
- Expected signals: `git worktree remove` and `git branch -d` both run against the fixture pair; the marker `.pid` file is deleted; the log line reads `prune (wrapper merged + clean + inactive): ...`.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if the worktree directory, its branch ref, and its marker file are all gone after the run, and no other fixture worktree is touched. FAIL if the pair survives despite meeting all three conditions, or if a sibling worktree is removed as a side effect.

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
| GIT-032 | Auto-reap a clean, merged, marker-dead wrapper pair | prove the reaper removes a wrapper worktree/branch pair only when the tree is clean, the branch is merged into the live integration tip, and the session marker proves the recorded PID is dead. | `Run the worktree reaper against a fixture wrapper worktree that is clean, merged, and has a dead-PID marker, and confirm it is removed along with its branch and marker file.` | 1. `bash: git worktree add -q -b work/rt/a .worktrees/rt-a HEAD` -> 2. `bash: printf '%s\n' <dead-pid> > <common-dir>/worktree-sessions/rt-a.pid` -> 3. `bash: bash .opencode/bin/worktree-reaper.sh` -> 4. `bash: test -d .worktrees/rt-a && echo still-present \|\| echo removed` -> 5. `bash: git show-ref --verify --quiet refs/heads/work/rt/a; echo $?` | The reaper log names the pair `prune (wrapper merged + clean + inactive)`; step 4 reports `removed`; step 5 exits non-zero (ref gone). | Reaper stdout/stderr log line, before/after `git worktree list`, before/after `git show-ref`, and the marker file's absence. | PASS if the worktree directory, its branch ref, and its marker file are all gone after the run, and no other fixture worktree is touched. FAIL if the pair survives despite meeting all three conditions, or if a sibling worktree is removed as a side effect. | Re-check the three-condition gate (`status --porcelain`, `merge-base --is-ancestor`, `_marker_says_inactive`) in `worktree-reaper.sh §4`, then `bin/tests/worktree-reaper.test.sh` case (a). |

### Optional Supplemental Checks

Add an unrelated sibling worktree that does NOT qualify (e.g. dirty) in the same fixture run to confirm the reap decision is per-worktree and does not cascade.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

No `feature_catalog/` package exists for sk-git; see `manual_testing_playbook.md` §14 for the direct-anchor exception.

### Implementation Anchors

| File | Role |
|---|---|
| `../../../../bin/worktree-reaper.sh` | Three-condition reap gate and `git worktree remove`/`git branch -d` ordering |
| `../../../../bin/tests/worktree-reaper.test.sh` | Regression coverage: wrapper+dead-marker reap case (a) |
| `../../SKILL.md` | ALWAYS #17 reap-only-proven-inactive contract |

---

## 5. SOURCE METADATA

- Group: Owner-First Worktree Tooling
- Playbook ID: GIT-032
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `owner_first_worktree_tooling/reaper_auto_reap_qualifying_wrapper.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
