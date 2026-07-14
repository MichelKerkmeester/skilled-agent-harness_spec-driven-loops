---
title: "GIT-026 -- Wrapper-lane exemption vs illegal-owner rejection"
description: "This scenario validates Wrapper-lane exemption vs illegal-owner rejection for `GIT-026`. It focuses on prove is_wrapper_branch recognizes the launch-wrapper lane as a legal-but-non-task branch while create and validate-owner still reject an owner with no tracked SKILL.md."
version: 1.0.0.0
---

# GIT-026 -- Wrapper-lane exemption vs illegal-owner rejection

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-026`.

---

## 1. OVERVIEW

This scenario validates Wrapper-lane exemption vs illegal-owner rejection for `GIT-026`. It focuses on prove `is_wrapper_branch` recognizes the launch-wrapper lane (`work/<runtime>/<slug>`) as a legal-but-non-task branch while `create`/`validate-owner` still reject an owner that has no tracked `SKILL.md`.

### Why This Matters

The allocator and the pre-push hook must tell "exempt machine-owned lane" apart from "malformed owner-first name" — conflating the two either blocks legitimate wrapper sessions or lets an unregistered owner slip through.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-026` and confirm the expected signals without contradictory evidence.

- Objective: prove `is_wrapper_branch` recognizes the launch-wrapper lane (`work/<runtime>/<slug>`) as a legal-but-non-task branch while `create`/`validate-owner` still reject an owner that has no tracked `SKILL.md`.
- Real user request: `Two things: confirm the launch-wrapper session branches are allowed even though they're not owner-first, and confirm a made-up owner name still gets rejected.`
- Prompt: `Validate a launch-wrapper branch name as the exempt wrapper lane, then attempt to create an owner-first worktree with a non-existent owner id and confirm it is refused.`
- Expected execution process: Run `validate-branch` on a `work/<runtime>/<slug>` name (expect `invalid`, since it is outside the owner-first grammar) and separately confirm `is_wrapper_branch` recognizes it as the exempt lane; then run `create <bogus-owner> <slug>` and confirm it fails closed with no worktree created.
- Expected signals: `work/opencode/20260101-1` fails `validate-branch` but is recognized by the dedicated wrapper check; `bogus-owner` fails `validate-owner` and `create` exits non-zero before any `git worktree add`.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if the wrapper name is recognized as the exempt lane (not flagged as a malformed task branch) and the bogus owner is rejected by both `validate-owner` and `create` with no worktree created. FAIL if a wrapper name is treated identically to a malformed task branch, or if `create` allows an untracked owner through.

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
| GIT-026 | Wrapper-lane exemption vs illegal-owner rejection | prove `is_wrapper_branch` recognizes the launch-wrapper lane as a legal-but-non-task branch while `create`/`validate-owner` still reject an owner with no tracked `SKILL.md`. | `Validate a launch-wrapper branch name as the exempt wrapper lane, then attempt to create an owner-first worktree with a non-existent owner id and confirm it is refused.` | 1. `bash: bash worktree-naming.sh validate-branch work/opencode/20260101-1` -> 2. `bash: (source worktree-naming.sh; is_wrapper_branch work/opencode/20260101-1 && echo wrapper-exempt)` -> 3. `bash: bash worktree-naming.sh validate-owner bogus-owner` -> 4. `bash: bash worktree-naming.sh create bogus-owner demo-should-fail` -> 5. `bash: git worktree list --porcelain \| grep demo-should-fail \|\| echo none-created` | Step 1 reports `invalid`; step 2 prints `wrapper-exempt`; steps 3-4 fail with `invalid`/`invalid owner`; step 5 confirms no worktree was created. | Exit codes/stdout for each of the 5 commands, and confirmation no worktree named `demo-should-fail` exists afterward. | PASS if the wrapper name is recognized as the exempt lane (not flagged as a malformed task branch) and the bogus owner is rejected by both `validate-owner` and `create` with no worktree created. FAIL if a wrapper name is treated identically to a malformed task branch, or if `create` allows an untracked owner through. | Compare against `is_wrapper_branch` and `is_valid_owner` in `worktree-naming.sh §3`, then the pre-push hook's own `is_wrapper_branch` branch-reject message for the same input family. |

### Optional Supplemental Checks

Re-run step 1 against a non-wrapper-shaped `work/human` branch (no runtime/slug segments) to confirm the dedicated wrapper check does not over-match arbitrary `work/`-prefixed names.

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
| `../../scripts/worktree-naming.sh` | `is_wrapper_branch` / `is_valid_owner` boundary and `create_named_worktree` fail-closed guard |
| `../../scripts/tests/worktree-naming.test.sh` | Regression coverage: wrapper recognition and untracked-owner rejection |
| `../../../../scripts/git-hooks/pre-push` | Consumer of `is_wrapper_branch` for the dedicated wrapper-ref rejection message |
| `../../SKILL.md` | Launch-wrapper lane description and ALWAYS #4 owner-first grammar |

---

## 5. SOURCE METADATA

- Group: Owner-First Worktree Tooling
- Playbook ID: GIT-026
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `owner_first_worktree_tooling/wrapper_lane_exemption_vs_illegal_owner.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
