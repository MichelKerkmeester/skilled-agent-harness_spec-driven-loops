---
title: "GIT-025 -- Create owner-first and detached worktrees"
description: "This scenario validates Create owner-first and detached worktrees for `GIT-025`. It focuses on prove create and create-detached allocate a number, create the matching branch/directory pair or a detached numbered directory, and refuse an invalid owner or slug before touching the repository."
version: 1.0.0.0
---

# GIT-025 -- Create owner-first and detached worktrees

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-025`.

---

## 1. OVERVIEW

This scenario validates Create owner-first and detached worktrees for `GIT-025`. It focuses on prove `create` and `create-detached` allocate a number, create the matching branch/directory pair or a detached numbered directory, and refuse an invalid owner or slug before touching the repository.

### Why This Matters

This is the allocator's only path that actually mutates the repository. A guard-order mistake here would let a malformed owner or slug reach `git worktree add` before validation runs.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-025` and confirm the expected signals without contradictory evidence.

- Objective: prove `create` and `create-detached` allocate a number, create the matching branch/directory pair or a detached numbered directory, and refuse an invalid owner or slug before touching the repository.
- Real user request: `Start a new sk-git task worktree for me, and separately give me a throwaway detached worktree for a quick experiment.`
- Prompt: `Create an owner-first sk-git worktree with a fresh branch, then create a separate numbered detached worktree with no branch, and report both paths and branch names.`
- Expected execution process: Run `create sk-git <slug>` and confirm it emits `<branch> <dir>` with the branch matching `sk-git/NNNN-<slug>` and the directory matching `.worktrees/NNNN-sk-git-<slug>`; run `create-detached <slug>` and confirm a `.worktrees/NNNN-detached-<slug>` directory with no branch; then attempt `create bogus-owner <slug>` and confirm it fails before any `git worktree add` runs.
- Expected signals: the `create` output pair passes `validate-pair`; `git worktree list` shows both new worktrees; the invalid-owner call exits non-zero with `invalid owner: bogus-owner` on stderr and creates no worktree.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if both creators produce a correctly paired, numbered worktree/branch (or detached directory) and the invalid-owner call is rejected before any git mutation. FAIL if the branch/directory pairing mismatches the grammar, if the invalid-owner call still creates a worktree, or if the allocated number collides with an existing one.

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
| GIT-025 | Create owner-first and detached worktrees | prove `create` and `create-detached` allocate a number, create the matching branch/directory pair or a detached numbered directory, and refuse an invalid owner or slug before touching the repository. | `Create an owner-first sk-git worktree with a fresh branch, then create a separate numbered detached worktree with no branch, and report both paths and branch names.` | 1. `bash: bash worktree-naming.sh create sk-git demo-owner-first` -> 2. `bash: git worktree list --porcelain \| grep demo-owner-first` -> 3. `bash: bash worktree-naming.sh validate-pair sk-git/<nnnn>-demo-owner-first .worktrees/<nnnn>-sk-git-demo-owner-first` -> 4. `bash: bash worktree-naming.sh create-detached demo-detached` -> 5. `bash: git worktree list --porcelain \| grep demo-detached` -> 6. `bash: bash worktree-naming.sh create bogus-owner demo-should-fail` | Steps 1-3 confirm a valid owner-first pair; steps 4-5 confirm a detached numbered directory; step 6 fails with `invalid owner` and creates nothing. | Emitted `<branch> <dir>` pairs, `git worktree list` before/after, the `validate-pair` result, and the invalid-owner stderr/exit code. | PASS if both creators produce a correctly paired, numbered worktree/branch (or detached directory) and the invalid-owner call is rejected before any git mutation. FAIL if the branch/directory pairing mismatches the grammar, if the invalid-owner call still creates a worktree, or if the allocated number collides with an existing one. | Re-check `create_named_worktree`/`create_detached_worktree` guard order in `worktree-naming.sh §5`, then confirm cleanup follows `git worktree remove` before `git branch -d` per `SKILL.md` ALWAYS #4/#17. |

### Optional Supplemental Checks

Clean up both fixture worktrees with `git worktree remove` before `git branch -d`, per the worktree-then-branch removal order required by `SKILL.md` ALWAYS #17.

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
| `../../scripts/worktree-naming.sh` | `create_named_worktree` / `create_detached_worktree` guard order and `git worktree add` wiring |
| `../../scripts/tests/worktree-naming.test.sh` | Regression coverage: pairing checks and number-scan/allocation assertions |
| `../../SKILL.md` | ALWAYS #4 allocator mandate and ALWAYS #17 removal ordering |

---

## 5. SOURCE METADATA

- Group: Owner-First Worktree Tooling
- Playbook ID: GIT-025
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `owner-first-worktree-tooling/create-owner-first-and-detached-worktrees.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
