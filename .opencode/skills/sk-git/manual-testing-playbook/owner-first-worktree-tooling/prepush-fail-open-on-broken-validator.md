---
title: "GIT-038 -- Pre-push fails open on a broken validator"
description: "This scenario validates fail-open behavior for `GIT-038`. It focuses on prove a missing or syntactically broken worktree-naming.sh makes the hook skip the naming gate entirely rather than hard-failing every push."
version: 1.0.0.0
---

# GIT-038 -- Pre-push fails open on a broken validator

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-038`.

---

## 1. OVERVIEW

This scenario validates fail-open behavior for `GIT-038`. It focuses on prove a missing or syntactically broken `worktree-naming.sh` makes the hook skip the naming gate entirely (fail-open) rather than hard-failing every push.

### Why This Matters

A local convenience gate must never become a repository-wide outage vector. If the shared validator ever regresses with a syntax error, every operator's push must still succeed.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-038` and confirm the expected signals without contradictory evidence.

- Objective: prove a missing or syntactically broken `worktree-naming.sh` makes the hook skip the naming gate entirely rather than hard-failing every push.
- Real user request: `If the naming-check script is ever broken, don't let that block every single push in the repo.`
- RCAF Prompt: `As a git safety reviewer, evaluate a push feed against a fixture where worktree-naming.sh is first missing, then present but syntactically broken. Verify both cases fail open with the push allowed and a warning logged. Return the exit code and warning text for each case.`
- Expected execution process: Remove `worktree-naming.sh` from the fixture and push a malformed new-branch name (expect allowed, warned); restore it as a file containing a shell syntax error and repeat (expect allowed, warned); restore the real validator afterward.
- Expected signals: both cases exit 0; stderr contains `worktree-naming.sh not found` or `failed to source worktree-naming.sh`, respectively — never a hard failure of the push itself.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if a missing or syntax-broken validator always results in exit 0 with a clear warning. FAIL if either broken-validator case exits non-zero and blocks the push.

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
| GIT-038 | Pre-push fails open on a broken validator | prove a missing or syntactically broken `worktree-naming.sh` makes the hook skip the naming gate entirely rather than hard-failing every push. | `As a git safety reviewer, evaluate a push feed against a fixture where worktree-naming.sh is first missing, then present but syntactically broken. Verify both cases fail open with the push allowed and a warning logged. Return the exit code and warning text for each case.` | 1. `bash: rm <fixture>/.opencode/skills/sk-git/scripts/worktree-naming.sh` -> 2. `bash: printf 'refs/heads/totally-bad %040d refs/heads/totally-bad %040d\n' 1 0 \| bash pre-push; echo $?` -> 3. `bash: printf 'broken {{{ (\n' > <fixture>/.opencode/skills/sk-git/scripts/worktree-naming.sh` -> 4. `bash: printf 'refs/heads/totally-bad %040d refs/heads/totally-bad %040d\n' 1 0 \| bash pre-push; echo $?` -> 5. `bash: restore the real worktree-naming.sh` | Steps 2 and 4 both exit 0 with a warning naming the missing/broken validator, never a `BLOCKED` rejection. | Both exit codes, both stderr warning strings. | PASS if a missing or syntax-broken validator always results in exit 0 with a clear warning. FAIL if either broken-validator case exits non-zero and blocks the push. | Walk the "Fail-safe validator load" block and the `set +e`/`source`/`set -e` guard in `pre-push`, then `pre-push.test.sh` "broken validator fails open" case. |

### Optional Supplemental Checks

Also remove the validators (`is_valid_branch`/`is_wrapper_branch`) from an otherwise-sourceable file to confirm the hook's function-presence check fails open the same way as a missing file.

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
| `../../../../scripts/git-hooks/pre-push` | Fail-safe validator load (`set +e`/`source`/`set -e` guard) |
| `../../../../scripts/git-hooks/tests/pre-push.test.sh` | Regression coverage: broken-validator fail-open case |

---

## 5. SOURCE METADATA

- Group: Owner-First Worktree Tooling
- Playbook ID: GIT-038
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `owner_first_worktree_tooling/prepush_fail_open_on_broken_validator.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
