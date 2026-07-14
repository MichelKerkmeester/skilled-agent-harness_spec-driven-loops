---
title: "GIT-036 -- Pre-push gates only new remote branch creation"
description: "This scenario validates the new-vs-update distinction for `GIT-036`. It focuses on prove the naming gate only evaluates a ref line when the remote sha is all-zeros, and does not re-validate an update to a branch that already exists on the remote."
version: 1.0.0.0
---

# GIT-036 -- Pre-push gates only new remote branch creation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-036`.

---

## 1. OVERVIEW

This scenario validates the new-vs-update distinction for `GIT-036`. It focuses on prove the naming gate only evaluates a ref line when the remote sha is all-zeros (a brand-new remote branch), and does not re-validate an update to a branch that already exists on the remote.

### Why This Matters

Every other pre-push behavior (migration tolerance, wrapper rejection, fail-open) depends on this new-vs-update distinction being correct first. Getting it backwards would either block every routine push or silently stop gating new branches at all.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-036` and confirm the expected signals without contradictory evidence.

- Objective: prove the naming gate only evaluates a ref line when the remote sha is all-zeros, and does not re-validate an update to a branch that already exists on the remote.
- Real user request: `Make sure the naming check only kicks in when I'm pushing a brand-new branch, not every time I push an update.`
- RCAF Prompt: `As a git safety reviewer, gate a simulated push feed containing both a new-branch line and an update-to-existing-branch line. Verify only the new-branch line is evaluated against the naming grammar. Return the accept/reject decision per line and the reasoning.`
- Expected execution process: Feed the hook two synthetic ref lines on stdin for the identical malformed branch name — one with an all-zero remote sha (new branch) and one with a real remote sha (update) — and confirm only the new-branch line is gated.
- Expected signals: the new-branch line is rejected (exit 1, `BLOCKED: new branch ...`); the update line with the identical name exits 0 with a migration-tolerance notice, not a rejection.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if `is_new` is derived strictly from an all-zero remote sha and only that case is gated; the identical name on an update line is never rejected. FAIL if an update line is rejected, or if a new-branch line with an all-zero sha is incorrectly treated as an update.

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
| GIT-036 | Pre-push gates only new remote branch creation | prove the naming gate only evaluates a ref line when the remote sha is all-zeros, and does not re-validate an update to a branch that already exists on the remote. | `As a git safety reviewer, gate a simulated push feed containing both a new-branch line and an update-to-existing-branch line. Verify only the new-branch line is evaluated against the naming grammar. Return the accept/reject decision per line and the reasoning.` | 1. `bash: printf 'refs/heads/totally-bad %040d refs/heads/totally-bad %040d\n' 1 0 \| bash pre-push; echo $?` -> 2. `bash: printf 'refs/heads/totally-bad %040d refs/heads/totally-bad %040d\n' 1 2 \| bash pre-push; echo $?` | Step 1 exits 1 with `BLOCKED: new branch ...`; step 2 exits 0 with a migration-tolerance notice. | Both invocations' exit codes and stderr text. | PASS if `is_new` is derived strictly from an all-zero remote sha and only that case is gated; the identical name on an update line is never rejected. FAIL if an update line is rejected, or if a new-branch line with an all-zero sha is incorrectly treated as an update. | Re-check the `remote_sha =~ ^0+$` check and the `is_new` branch in `pre-push §2`, then `scripts/git-hooks/tests/pre-push.test.sh` new-vs-update cases. |

### Optional Supplemental Checks

Repeat with a well-formed owner-first name on both lines to confirm both the new and the update case exit 0, isolating the gate's behavior from the name's legality.

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
| `../../../../scripts/git-hooks/pre-push` | New-vs-update `remote_sha` check gating the naming grammar |
| `../../../../scripts/git-hooks/tests/pre-push.test.sh` | Regression coverage: new-branch-rejected / legacy-update-allowed cases |
| `../../scripts/worktree-naming.sh` | Sourced `is_valid_branch` validator the hook depends on |

---

## 5. SOURCE METADATA

- Group: Owner-First Worktree Tooling
- Playbook ID: GIT-036
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `owner_first_worktree_tooling/prepush_gates_only_new_branches.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
