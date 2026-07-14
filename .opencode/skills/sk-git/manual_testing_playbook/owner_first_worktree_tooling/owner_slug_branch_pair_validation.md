---
title: "GIT-024 -- Owner/slug/branch/pair grammar validation"
description: "This scenario validates Owner/slug/branch/pair grammar validation for `GIT-024`. It focuses on prove validate-owner, validate-slug, validate-branch, and validate-pair accept every legal owner-first form and reject every malformed one."
version: 1.0.0.0
---

# GIT-024 -- Owner/slug/branch/pair grammar validation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-024`.

---

## 1. OVERVIEW

This scenario validates Owner/slug/branch/pair grammar validation for `GIT-024`. It focuses on prove `validate-owner`, `validate-slug`, `validate-branch`, and `validate-pair` accept every legal owner-first form and reject every malformed one.

### Why This Matters

The pre-push hook and the worktree creators both depend on these validators to draw the line between a legal owner-first name and a malformed one. A false accept or false reject here propagates directly into both callers.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-024` and confirm the expected signals without contradictory evidence.

- Objective: prove `validate-owner`, `validate-slug`, `validate-branch`, and `validate-pair` accept every legal owner-first form and reject every malformed one.
- Real user request: `Before I let anything auto-create a branch, tell me exactly which owner/slug/branch names would be accepted or rejected.`
- Prompt: `Run the worktree-naming validators against a mix of legal and illegal owners, slugs, branches, and directory pairs, and report which ones pass or fail and why.`
- Expected execution process: Run `validate-owner` against a tracked skill id, an untracked id, and `skilled`; `validate-slug` against a clean kebab slug and slugs with underscores/leading/trailing/double hyphens; `validate-branch` against a conformant task branch, `main`, a release branch, and a legacy `wt/NNNN-name`; `validate-pair` against a matching and a mismatched branch/directory combination.
- Expected signals: every legal input prints `ok` with exit 0; every illegal input prints `invalid` to stderr with a non-zero exit.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if `sk-git`, `skilled`, `main`, `skilled/vA.B.C.D`, and a conformant `OWNER/NNNN-slug` all validate `ok`, and an untracked owner, an underscore slug, a 2-digit branch number, a `wt/` legacy branch, and a mismatched pair all report `invalid`. FAIL if any legal form is rejected, or any illegal form is accepted.

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
| GIT-024 | Owner/slug/branch/pair grammar validation | prove `validate-owner`, `validate-slug`, `validate-branch`, and `validate-pair` accept every legal owner-first form and reject every malformed one. | `Run the worktree-naming validators against a mix of legal and illegal owners, slugs, branches, and directory pairs, and report which ones pass or fail and why.` | 1. `bash: bash worktree-naming.sh validate-owner sk-git` -> 2. `bash: bash worktree-naming.sh validate-owner untracked-owner` -> 3. `bash: bash worktree-naming.sh validate-slug add-oauth` -> 4. `bash: bash worktree-naming.sh validate-slug bad_slug` -> 5. `bash: bash worktree-naming.sh validate-branch sk-git/0041-fix-thing` -> 6. `bash: bash worktree-naming.sh validate-branch wt/0001-legacy` -> 7. `bash: bash worktree-naming.sh validate-pair sk-git/0040-foo .worktrees/0040-sk-git-foo` -> 8. `bash: bash worktree-naming.sh validate-pair sk-git/0040-foo .worktrees/0040-sk-git-bar` | Legal forms (1,3,5,7) print `ok`/exit 0; illegal forms (2,4,6,8) print `invalid`/exit non-zero. | Stdout/stderr and exit code for each of the 8 invocations, tabulated side by side. | PASS if `sk-git`, `skilled`, `main`, `skilled/vA.B.C.D`, and a conformant `OWNER/NNNN-slug` all validate `ok`, and an untracked owner, an underscore slug, a 2-digit branch number, a `wt/` legacy branch, and a mismatched pair all report `invalid`. FAIL if any legal form is rejected, or any illegal form is accepted. | Compare each rejected case against the grammar comments in `worktree-naming.sh §3`, then cross-check `scripts/tests/worktree-naming.test.sh` grammar assertions for the same inputs. |

### Optional Supplemental Checks

Re-run `validate-owner` after adding an untracked `SKILL.md` under `.opencode/skills/` to confirm owner discovery reads the `name:` frontmatter of every version-controlled `SKILL.md`, not an arbitrary directory name.

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
| `../../scripts/worktree-naming.sh` | Owner/slug/branch/pair validators and skill-id discovery |
| `../../scripts/tests/worktree-naming.test.sh` | Regression coverage: owner/slug/branch/pair grammar assertions |
| `../../SKILL.md` | ALWAYS #4 owner-first naming grammar definition |

---

## 5. SOURCE METADATA

- Group: Owner-First Worktree Tooling
- Playbook ID: GIT-024
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `owner_first_worktree_tooling/owner_slug_branch_pair_validation.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
