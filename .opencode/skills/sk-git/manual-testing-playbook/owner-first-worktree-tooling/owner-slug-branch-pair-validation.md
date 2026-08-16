---
title: "GIT-024 -- Slug/NNN/branch/pair grammar validation"
description: "This scenario validates Slug/NNN/branch/pair grammar validation for `GIT-024`. It focuses on prove validate-slug, validate-nnn, validate-branch, validate-backup, and validate-pair accept every legal numbered form and reject every malformed one."
version: 1.1.0.0
---

# GIT-024 -- Slug/NNN/branch/pair grammar validation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-024`.

---

## 1. OVERVIEW

This scenario validates Slug/NNN/branch/pair grammar validation for `GIT-024`. It focuses on prove `validate-slug`, `validate-nnn`, `validate-branch`, `validate-backup`, and `validate-pair` accept every legal numbered form and reject every malformed one.

### Why This Matters

The pre-push hook and the worktree creators both depend on these validators to draw the line between a legal numbered name and a malformed one. A false accept or false reject here propagates directly into both callers.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-024` and confirm the expected signals without contradictory evidence.

- Objective: prove `validate-slug`, `validate-nnn`, `validate-branch`, `validate-backup`, and `validate-pair` accept every legal numbered form and reject every malformed one.
- Real user request: `Before I let anything auto-create a branch, tell me exactly which slug/number/branch names would be accepted or rejected.`
- Prompt: `Run the worktree-naming validators against a mix of legal and illegal slugs, numbers, branches, and directory pairs, and report which ones pass or fail and why.`
- Expected execution process: Run `validate-slug` against a clean kebab slug and slugs with underscores/leading/trailing/double hyphens; `validate-nnn` against 001..999 and 000/2-digit/4-digit values; `validate-branch` against a conformant `worktrees/NNN-slug`, a `branches/NNN-slug`, `main`, a release branch, a `backup/*` safety ref, and an owner-first legacy name; `validate-pair` against a matching and a mismatched branch/directory combination.
- Expected signals: every legal input prints `ok` with exit 0; every illegal input prints `invalid` to stderr with a non-zero exit.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if `worktrees/NNN-slug`, `branches/NNN-slug`, `main`, `skilled/vA.B.C.D`, and `backup/*` all validate `ok`, and an owner-first name, an underscore slug, a 2-digit branch number, a `wt/` legacy branch, and a mismatched pair all report `invalid`. FAIL if any legal form is rejected, or any illegal form is accepted.

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
| GIT-024 | Slug/NNN/branch/pair grammar validation | prove `validate-slug`, `validate-nnn`, `validate-branch`, `validate-backup`, and `validate-pair` accept every legal numbered form and reject every malformed one. | `Run the worktree-naming validators against a mix of legal and illegal slugs, numbers, branches, and directory pairs, and report which ones pass or fail and why.` | 1. `bash: bash worktree-naming.sh validate-slug add-oauth` -> 2. `bash: bash worktree-naming.sh validate-slug bad_slug` -> 3. `bash: bash worktree-naming.sh validate-nnn 007` -> 4. `bash: bash worktree-naming.sh validate-nnn 40` -> 5. `bash: bash worktree-naming.sh validate-branch worktrees/0041-fix-thing` -> 6. `bash: bash worktree-naming.sh validate-branch sk-doc/0131-legacy-owner-first` -> 7. `bash: bash worktree-naming.sh validate-pair worktrees/0040-foo .worktrees/0040-foo` -> 8. `bash: bash worktree-naming.sh validate-pair worktrees/0040-foo .worktrees/0040-bar` -> 9. `bash: bash worktree-naming.sh validate-backup backup/pre-bump` | Legal forms (1,3,5,7,9) print `ok`/exit 0; illegal forms (2,4,6,8) print `invalid`/exit non-zero. | Stdout/stderr and exit code for each invocation, tabulated side by side. | PASS if `worktrees/NNN-slug`, `branches/NNN-slug`, `main`, `skilled/vA.B.C.D`, and `backup/*` all validate `ok`, and an owner-first name, an underscore slug, a 2-digit branch number, a `wt/` legacy branch, and a mismatched pair all report `invalid`. FAIL if any legal form is rejected, or any illegal form is accepted. | Compare each rejected case against the grammar comments in `worktree-naming.sh §2`, then cross-check `scripts/tests/worktree-naming.test.sh` grammar assertions for the same inputs. |

### Optional Supplemental Checks

Run `validate-branch` against `work/opencode/20260101-1` and confirm it validates `ok` (the wrapper lane is a legal grammar name), then confirm `is_wrapper_branch` distinguishes it as a non-task lane.

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
| `../../scripts/worktree-naming.sh` | Slug/NNN/branch/backup/pair validators |
| `../../scripts/tests/worktree-naming.test.sh` | Regression coverage: slug/nnn/branch/backup/pair grammar assertions |
| `../../SKILL.md` | ALWAYS #4 numbered naming grammar definition |

---

## 5. SOURCE METADATA

- Group: Owner-First Worktree Tooling
- Playbook ID: GIT-024
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `owner-first-worktree-tooling/owner-slug-branch-pair-validation.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
