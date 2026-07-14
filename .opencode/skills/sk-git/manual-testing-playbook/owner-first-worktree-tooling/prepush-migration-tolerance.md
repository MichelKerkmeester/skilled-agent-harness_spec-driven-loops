---
title: "GIT-037 -- Pre-push migration tolerance for existing legacy branches"
description: "This scenario validates migration tolerance for `GIT-037`. It focuses on prove a branch that already exists on the remote can always be pushed again regardless of whether its name conforms to the owner-first grammar."
version: 1.0.0.0
---

# GIT-037 -- Pre-push migration tolerance for existing legacy branches

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-037`.

---

## 1. OVERVIEW

This scenario validates migration tolerance for `GIT-037`. It focuses on prove a branch that already exists on the remote can always be pushed again (updated or deleted) regardless of whether its name conforms to the owner-first grammar.

### Why This Matters

The naming grammar was adopted after real branches already existed under older conventions (`wt/NNNN-name`, ad hoc names). Rewriting or blocking those branches would be far more disruptive than tolerating their names on update.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-037` and confirm the expected signals without contradictory evidence.

- Objective: prove a branch that already exists on the remote can always be pushed again regardless of whether its name conforms to the owner-first grammar.
- Real user request: `I still have some old wt/ and legacy-named branches on the remote — don't block me from continuing to push to them.`
- RCAF Prompt: `As a git safety reviewer, evaluate an update push to a pre-existing non-conformant remote branch name. Verify the push is allowed under migration tolerance while the same name would be blocked as a brand-new branch. Return the decision and the migration-tolerance rationale.`
- Expected execution process: Feed an update-shaped line (nonzero remote sha) for a non-conformant name such as `legacy-feature`, confirm it is allowed with an advisory-only warning, then feed the identical name as a new-branch line (zero remote sha) and confirm that one is blocked.
- Expected signals: the update line exits 0 with `does not match the owner-first naming grammar (update allowed — migration tolerance)`; the new-branch line for the same name exits 1 with `BLOCKED: new branch ...`.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if the same non-conformant name is allowed on update and blocked on creation, per the hook's own `is_new` branch. FAIL if the legacy update is blocked, or if the new-branch case is silently allowed.

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
| GIT-037 | Pre-push migration tolerance for existing legacy branches | prove a branch that already exists on the remote can always be pushed again regardless of whether its name conforms to the owner-first grammar. | `As a git safety reviewer, evaluate an update push to a pre-existing non-conformant remote branch name. Verify the push is allowed under migration tolerance while the same name would be blocked as a brand-new branch. Return the decision and the migration-tolerance rationale.` | 1. `bash: printf 'refs/heads/legacy-feature %040d refs/heads/legacy-feature %040d\n' 1 2 \| bash pre-push; echo $?` -> 2. `bash: printf 'refs/heads/legacy-feature %040d refs/heads/legacy-feature %040d\n' 1 0 \| bash pre-push; echo $?` | Step 1 exits 0 with an advisory migration-tolerance notice; step 2 exits 1 with `BLOCKED: new branch ...`. | Both exit codes and stderr text (advisory notice vs BLOCKED message). | PASS if the same non-conformant name is allowed on update and blocked on creation, per the hook's own `is_new` branch. FAIL if the legacy update is blocked, or if the new-branch case is silently allowed. | Compare against the `is_new -eq 0` migration-tolerance branch in `pre-push §2`, then `pre-push.test.sh` "legacy update to an existing branch allowed" case. |

### Optional Supplemental Checks

Repeat with a legacy `wt/0001-old-feature` name explicitly, since it is called out as the canonical permitted-but-non-conformant predecessor form in `SKILL.md` ALWAYS #4.

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
| `../../../../scripts/git-hooks/pre-push` | Migration-tolerance branch for updates to existing non-conformant names |
| `../../../../scripts/git-hooks/tests/pre-push.test.sh` | Regression coverage: legacy-update-allowed case |
| `../../SKILL.md` | ALWAYS #4 legacy `wt/{NNNN}-{name}` permitted-but-non-conformant note |

---

## 5. SOURCE METADATA

- Group: Owner-First Worktree Tooling
- Playbook ID: GIT-037
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `owner_first_worktree_tooling/prepush_migration_tolerance.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
