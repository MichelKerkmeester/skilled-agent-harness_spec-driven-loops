---
title: "GIT-026 -- Wrapper-lane exemption vs backup-lane recognition"
description: "This scenario validates Wrapper-lane exemption vs backup-lane recognition for `GIT-026`. It focuses on prove is_wrapper_branch and is_backup_branch recognize the exempt machine-owned lanes as legal-but-non-task branches while create still rejects a malformed slug before touching the repository."
version: 1.1.0.0
---

# GIT-026 -- Wrapper-lane exemption vs backup-lane recognition

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-026`.

---

## 1. OVERVIEW

This scenario validates Wrapper-lane exemption vs backup-lane recognition for `GIT-026`. It focuses on prove `is_wrapper_branch` recognizes the launch-wrapper lane (`work/<runtime>/<slug>`) as a legal-but-non-task branch while `is_backup_branch` recognizes `backup/<anything>` safety refs, and `create` still rejects a malformed slug before any worktree is created.

### Why This Matters

The allocator and the pre-push hook must tell "exempt machine-owned lane" and "legal safety ref" apart from "malformed name" — conflating them either blocks legitimate wrapper sessions or safety backups, or lets a malformed name slip through.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-026` and confirm the expected signals without contradictory evidence.

- Objective: prove `is_wrapper_branch` recognizes the launch-wrapper lane (`work/<runtime>/<slug>`) and `is_backup_branch` recognizes `backup/*` as legal-but-non-task branches, while `create` rejects a malformed slug before any git mutation.
- Real user request: `Two things: confirm the launch-wrapper session branches and backup refs are allowed even though they're not numbered task branches, and confirm a malformed slug still gets rejected.`
- Prompt: `Validate a launch-wrapper branch name as the exempt wrapper lane and a backup ref as the safety-ref lane, then attempt to create a worktree with a malformed slug and confirm it is refused.`
- Expected execution process: Run `validate-branch` on a `work/<runtime>/<slug>` name and on a `backup/<anything>` name (expect `ok`, since both are legal grammar names) and separately confirm `is_wrapper_branch` / `is_backup_branch` recognize the distinct lanes; then run `create bad_slug` and confirm it fails closed with no worktree created.
- Expected signals: `work/opencode/20260101-1` and `backup/pre-bump` both pass `validate-branch` but are distinguished by the dedicated lane checks; `create bad_slug` exits non-zero before any `git worktree add`.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if the wrapper name and backup ref are recognized as exempt lanes (not flagged as malformed) and the malformed slug is rejected by `create` with no worktree created. FAIL if a wrapper name or backup ref is treated identically to a malformed task branch, or if `create` allows a malformed slug through.

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
| GIT-026 | Wrapper-lane exemption vs backup-lane recognition | prove `is_wrapper_branch` / `is_backup_branch` recognize the exempt machine-owned lanes as legal-but-non-task branches while `create` rejects a malformed slug. | `Validate a launch-wrapper branch name as the exempt wrapper lane and a backup ref as the safety-ref lane, then attempt to create a worktree with a malformed slug and confirm it is refused.` | 1. `bash: bash worktree-naming.sh validate-branch work/opencode/20260101-1` -> 2. `bash: (source worktree-naming.sh; is_wrapper_branch work/opencode/20260101-1 && echo wrapper-exempt)` -> 3. `bash: bash worktree-naming.sh validate-branch backup/pre-bump` -> 4. `bash: (source worktree-naming.sh; is_backup_branch backup/pre-bump && echo backup-legal)` -> 5. `bash: bash worktree-naming.sh create bad_slug` -> 6. `bash: git worktree list --porcelain \| grep bad_slug \|\| echo none-created` | Steps 1-4 confirm both exempt lanes validate as legal names; step 5 fails with `invalid slug`; step 6 confirms no worktree was created. | Exit codes/stdout for each command, and confirmation no worktree named `bad_slug` exists afterward. | PASS if the wrapper name and backup ref are recognized as exempt lanes (not flagged as malformed) and the malformed slug is rejected by `create` with no worktree created. FAIL if a wrapper name or backup ref is treated identically to a malformed task branch, or if `create` allows a malformed slug through. | Compare against `is_wrapper_branch` and `is_backup_branch` in `worktree-naming.sh §2`, then the pre-push hook's own `is_wrapper_branch` branch-reject message for the same input family. |

### Optional Supplemental Checks

Re-run step 1 against a non-wrapper-shaped `work/human` branch (no runtime/slug segments) to confirm the dedicated wrapper check does not over-match arbitrary `work/`-prefixed names.

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
| `../../scripts/worktree-naming.sh` | `is_wrapper_branch` / `is_backup_branch` boundary and `create_named_worktree` fail-closed guard |
| `../../scripts/tests/worktree-naming.test.sh` | Regression coverage: wrapper and backup recognition and malformed-slug rejection |
| `../../../../scripts/git-hooks/pre-push` | Consumer of `is_wrapper_branch` for the dedicated wrapper-ref rejection message |
| `../../SKILL.md` | Launch-wrapper lane description and ALWAYS #4 numbered grammar |

---

## 5. SOURCE METADATA

- Group: Owner-First Worktree Tooling
- Playbook ID: GIT-026
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `owner-first-worktree-tooling/wrapper-lane-exemption-vs-illegal-owner.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
