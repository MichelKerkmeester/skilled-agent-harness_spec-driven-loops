---
title: "GIT-039 -- Pre-push never blocks skilled release branches"
description: "This scenario validates the release-branch exemption for `GIT-039`. It focuses on prove skilled/v* release branches are exempt from the naming gate entirely, both as new branches and as updates."
version: 1.0.0.0
---

# GIT-039 -- Pre-push never blocks skilled release branches

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-039`.

---

## 1. OVERVIEW

This scenario validates the release-branch exemption for `GIT-039`. It focuses on prove `skilled/v*` release branches are exempt from the naming gate entirely, both as new branches and as updates.

### Why This Matters

Release branches follow their own version-tag grammar, not the owner-first task grammar. Gating them would either block a release cut outright or force a confusing owner-first name onto a release branch.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-039` and confirm the expected signals without contradictory evidence.

- Objective: prove `skilled/v*` release branches are exempt from the naming gate entirely, both as new branches and as updates.
- Real user request: `Don't ever let the naming check block a release branch push.`
- RCAF Prompt: `As a git safety reviewer, push a new skilled/v* release branch and then an update to one, and verify both are exempt from the naming gate with no warning or rejection at all.`
- Expected execution process: Feed a `skilled/vA.B.C.D` line as a new branch (zero remote sha) and as an update (nonzero remote sha), and confirm neither is evaluated by the grammar check at all.
- Expected signals: both cases exit 0 with no naming-related stderr output for that ref line.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if every `skilled/v*` ref line — new or updated — is skipped by the release-branch short-circuit before grammar validation runs. FAIL if a `skilled/v*` push is ever rejected or produces a naming warning.

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
| GIT-039 | Pre-push never blocks skilled release branches | prove `skilled/v*` release branches are exempt from the naming gate entirely, both as new branches and as updates. | `As a git safety reviewer, push a new skilled/v* release branch and then an update to one, and verify both are exempt from the naming gate with no warning or rejection at all.` | 1. `bash: printf 'refs/heads/skilled/v9.9.9.9 %040d refs/heads/skilled/v9.9.9.9 %040d\n' 1 0 \| bash pre-push; echo $?` -> 2. `bash: printf 'refs/heads/skilled/v9.9.9.9 %040d refs/heads/skilled/v9.9.9.9 %040d\n' 1 2 \| bash pre-push; echo $?` | Both invocations exit 0 with no naming-related stderr output. | Both exit codes and full stderr (expected empty of naming warnings). | PASS if every `skilled/v*` ref line — new or updated — is skipped by the release-branch short-circuit before grammar validation runs. FAIL if a `skilled/v*` push is ever rejected or produces a naming warning. | Confirm the `skilled/v*` short-circuit fires before the `is_new` branch in `pre-push §2`, then `pre-push.test.sh` "skilled/v9.9.9.9 never blocked" case. |

### Optional Supplemental Checks

Confirm a malformed release-shaped name that is not actually `skilled/v*` (e.g. `skilled/version9`) is NOT exempt and falls through to the normal owner-first grammar check.

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
| `../../../../scripts/git-hooks/pre-push` | `skilled/v*` release-branch short-circuit |
| `../../../../scripts/git-hooks/tests/pre-push.test.sh` | Regression coverage: release-branch-never-blocked case |
| `../../scripts/worktree-naming.sh` | `is_valid_branch` release-branch pattern match |

---

## 5. SOURCE METADATA

- Group: Owner-First Worktree Tooling
- Playbook ID: GIT-039
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `owner-first-worktree-tooling/prepush-never-blocks-release-branches.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
