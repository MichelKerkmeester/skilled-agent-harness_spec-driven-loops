---
title: "GIT-033 -- Keep human, detached, dirty, and marker-ambiguous worktrees"
description: "This scenario validates report-only keep behavior for `GIT-033`. It focuses on prove the reaper leaves every non-qualifying worktree alone: human owner-first, detached, dirty wrapper, live-marker wrapper, malformed-marker wrapper, and non-wrapper-grammar work/ branches."
version: 1.0.0.0
---

# GIT-033 -- Keep human, detached, dirty, and marker-ambiguous worktrees

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-033`.

---

## 1. OVERVIEW

This scenario validates report-only keep behavior for `GIT-033`. It focuses on prove the reaper leaves every non-qualifying worktree alone: a human owner-first worktree, a detached worktree, a dirty wrapper worktree, a wrapper with a live or malformed marker, and a `work/` branch that does not match the exact wrapper grammar.

### Why This Matters

"Absence of proof is never proof of absence" only holds if every ambiguous or non-wrapper case is provably left alone. This is the reaper's largest surface for a false-positive removal.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-033` and confirm the expected signals without contradictory evidence.

- Objective: prove the reaper leaves every non-qualifying worktree alone: a human owner-first worktree, a detached worktree, a dirty wrapper worktree, a wrapper with a live or malformed marker, and a `work/` branch that does not match the exact wrapper grammar.
- Real user request: `Don't touch my in-progress feature worktree, my scratch detached worktree, or anything the cleanup tool can't prove is actually finished.`
- Prompt: `Run the worktree reaper against a fixture containing a human numbered worktree, a detached worktree, a dirty wrapper worktree, a wrapper with a live-PID marker, and a wrapper with a malformed marker, and confirm every one of them is reported kept, not removed.`
- Expected execution process: Build the five fixture worktrees, run the reaper with no flags, and inspect its log lines and post-run `git worktree list`/`git show-ref` state for each.
- Expected signals: each case logs a `keep (...)` line naming the specific reason (human/detached/dirty/marker-ambiguous/non-wrapper-grammar); all five directories and any branch refs remain present afterward.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if all five non-qualifying worktrees and their branches still exist after the run, each with a `keep` log line naming the correct reason. FAIL if any of the five is removed, or if a `keep` reason is misattributed.

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
| GIT-033 | Keep human, detached, dirty, and marker-ambiguous worktrees | prove the reaper leaves every non-qualifying worktree alone: human owner-first, detached, dirty wrapper, live-marker wrapper, malformed-marker wrapper, and non-wrapper-grammar `work/` branches. | `Run the worktree reaper against a fixture containing a human numbered worktree, a detached worktree, a dirty wrapper worktree, a wrapper with a live-PID marker, and a wrapper with a malformed marker, and confirm every one of them is reported kept, not removed.` | 1. `bash: git worktree add -q -b sk-git/0001-human .worktrees/0001-sk-git-human HEAD` -> 2. `bash: git worktree add -q --detach .worktrees/0002-detached HEAD` -> 3. `bash: git worktree add -q -b work/rt/dirty .worktrees/rt-dirty HEAD && touch .worktrees/rt-dirty/uncommitted.txt` -> 4. `bash: git worktree add -q -b work/rt/live .worktrees/rt-live HEAD && printf '%s\n' $$ > <common-dir>/worktree-sessions/rt-live.pid` -> 5. `bash: bash .opencode/bin/worktree-reaper.sh` | Each fixture logs a distinct `keep (...)` reason; a post-run `git worktree list` still shows all five entries. | Full reaper log, and `git worktree list`/`git show-ref` proof that all five survive. | PASS if all five non-qualifying worktrees and their branches still exist after the run, each with a `keep` log line naming the correct reason. FAIL if any of the five is removed, or if a `keep` reason is misattributed. | Compare each `keep` branch of the classification chain in `worktree-reaper.sh §4` against `bin/tests/worktree-reaper.test.sh` cases (b)-(e) and the human/detached report-only cases. |

### Optional Supplemental Checks

Add a sixth fixture worktree on a `work/human` branch (missing the runtime/slug segments the wrapper grammar requires) to confirm it is kept as "non-wrapper worktree", distinct from the dirty/live/malformed wrapper reasons.

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
| `../../../../bin/worktree-reaper.sh` | Keep-branch classification chain (human/detached/dirty/marker-ambiguous/non-wrapper) |
| `../../../../bin/tests/worktree-reaper.test.sh` | Regression coverage: keep cases (b)-(e) plus human/detached report-only assertions |
| `../../SKILL.md` | ALWAYS #17 "absence of proof is never proof of absence" contract |

---

## 5. SOURCE METADATA

- Group: Owner-First Worktree Tooling
- Playbook ID: GIT-033
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `owner_first_worktree_tooling/reaper_keeps_non_qualifying_worktrees.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
