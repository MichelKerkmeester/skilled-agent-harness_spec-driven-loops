---
title: "GIT-034 -- Reaper dry-run changes nothing"
description: "This scenario validates dry-run safety for `GIT-034`. It focuses on prove --dry-run prints the exact prune, remove, and branch-delete actions it would take without mutating any worktree, branch, or marker."
version: 1.0.0.0
---

# GIT-034 -- Reaper dry-run changes nothing

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-034`.

---

## 1. OVERVIEW

This scenario validates dry-run safety for `GIT-034`. It focuses on prove `--dry-run` prints the exact prune, remove, and branch-delete actions it would take without mutating any worktree, branch, or marker.

### Why This Matters

`--dry-run` is the operator's only preview of a destructive cleanup before it runs for real. Its printed plan must be trustworthy: exactly what would happen, with zero side effects until the operator re-runs it without the flag.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-034` and confirm the expected signals without contradictory evidence.

- Objective: prove `--dry-run` prints the exact prune, remove, and branch-delete actions it would take without mutating any worktree, branch, or marker.
- Real user request: `Show me what the cleanup would do before you actually delete anything.`
- Prompt: `Run the worktree reaper in --dry-run mode against a fixture with one reapable wrapper pair, confirm the plan names that pair, and confirm nothing on disk or in refs actually changed.`
- Expected execution process: Build one qualifying (clean, merged, dead-marker) wrapper pair, run the reaper with `--dry-run`, and diff worktree/ref/marker state before and after.
- Expected signals: stdout/stderr shows `DRY_RUN would: git worktree remove ...` and `DRY_RUN would: git branch -d ...` lines naming the qualifying pair; the worktree directory, branch ref, and marker file are all still present after the run.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if the dry-run output correctly names every action it would take and the repository state is unchanged afterward. FAIL if `--dry-run` performs any real mutation, or if its printed plan omits or misnames the qualifying pair.

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
| GIT-034 | Reaper dry-run changes nothing | prove `--dry-run` prints the exact prune, remove, and branch-delete actions it would take without mutating any worktree, branch, or marker. | `Run the worktree reaper in --dry-run mode against a fixture with one reapable wrapper pair, confirm the plan names that pair, and confirm nothing on disk or in refs actually changed.` | 1. `bash: git worktree add -q -b work/rt/a .worktrees/rt-a HEAD && printf '%s\n' <dead-pid> > <common-dir>/worktree-sessions/rt-a.pid` -> 2. `bash: bash .opencode/bin/worktree-reaper.sh --dry-run` -> 3. `bash: test -d .worktrees/rt-a && echo still-present` -> 4. `bash: git show-ref --verify --quiet refs/heads/work/rt/a; echo $?` | Step 2 prints `DRY_RUN would: git worktree remove ...` and `DRY_RUN would: git branch -d ...`; step 3 reports `still-present`; step 4 exits 0 (ref intact). | Dry-run stdout with the `DRY_RUN would:` lines, and post-run proof the worktree/branch/marker are untouched. | PASS if the dry-run output correctly names every action it would take and the repository state is unchanged afterward. FAIL if `--dry-run` performs any real mutation, or if its printed plan omits or misnames the qualifying pair. | Inspect the `act()` helper's dry-run branch in `worktree-reaper.sh §2`, then confirm no code path bypasses `act` for the remove/delete calls. |

### Optional Supplemental Checks

Follow the dry-run with a real (flag-free) run against the same untouched fixture to confirm the previewed plan and the actual outcome match exactly.

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
| `../../../../bin/worktree-reaper.sh` | `act()` dry-run/execute dispatch helper |
| `../../../../bin/tests/worktree-reaper.test.sh` | Regression coverage for the reap classification the dry-run plan must match |

---

## 5. SOURCE METADATA

- Group: Owner-First Worktree Tooling
- Playbook ID: GIT-034
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `owner_first_worktree_tooling/reaper_dry_run_no_mutation.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
