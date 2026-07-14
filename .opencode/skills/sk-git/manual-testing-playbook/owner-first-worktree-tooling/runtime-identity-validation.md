---
title: "GIT-029 -- Runtime identity validation"
description: "This scenario validates Runtime identity validation for `GIT-029`. It focuses on prove the wrapper rejects a path-bearing or non-conforming runtime identity before allocating any worktree, and accepts a normal runtime name found on PATH."
version: 1.0.0.0
---

# GIT-029 -- Runtime identity validation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-029`.

---

## 1. OVERVIEW

This scenario validates Runtime identity validation for `GIT-029`. It focuses on prove the wrapper rejects a path-bearing or non-conforming runtime identity before allocating any worktree, and accepts a normal runtime name found on PATH.

### Why This Matters

The runtime identity feeds directly into the branch name (`work/<runtime>/<slug>`). A path-bearing or malformed identity that reached branch construction would corrupt the naming grammar the pre-push hook and reaper both depend on.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-029` and confirm the expected signals without contradictory evidence.

- Objective: prove the wrapper rejects a path-bearing or non-conforming runtime identity before allocating any worktree, and accepts a normal runtime name found on PATH.
- Real user request: `If I typo the runtime name or pass a path by mistake, the wrapper should refuse cleanly instead of half-creating a worktree.`
- Prompt: `Run worktree-session.sh with a path-bearing runtime argument and confirm it is refused with no worktree created, then run it with a valid lowercase runtime name and confirm it is accepted.`
- Expected execution process: Invoke the wrapper with a path-bearing token (e.g. `./bin/myrt`) and confirm rejection before invoking it with a normal lowercase runtime name present on `PATH`.
- Expected signals: the path-bearing identity prints `invalid runtime identity: <value>` to stderr and exits non-zero with no `.worktrees/` directory created; the valid identity proceeds to the dry-run plan and forms a `work/<runtime>/...` branch.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if every path-bearing or non-conforming identity is rejected before any worktree allocation, and a normal identity is accepted and forms a legal wrapper branch name. FAIL if a path-bearing identity reaches worktree creation, or if the rejection produces a malformed double-slash branch name.

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
| GIT-029 | Runtime identity validation | prove the wrapper rejects a path-bearing or non-conforming runtime identity before allocating any worktree, and accepts a normal runtime name found on PATH. | `Run worktree-session.sh with a path-bearing runtime argument and confirm it is refused with no worktree created, then run it with a valid lowercase runtime name and confirm it is accepted.` | 1. `bash: bash .opencode/bin/worktree-session.sh ./bin/myrt` -> 2. `bash: test -d .worktrees && echo present \|\| echo absent` -> 3. `bash: bash .opencode/bin/worktree-session.sh --dry-run myrt` | Step 1 prints `invalid runtime identity: ./bin/myrt` and exits non-zero; step 2 reports `absent`; step 3 succeeds and prints a `work/myrt/...` branch line. | Stderr message for the rejected case, absence of `.worktrees/`, and the accepted case's dry-run branch line. | PASS if every path-bearing or non-conforming identity is rejected before any worktree allocation, and a normal identity is accepted and forms a legal wrapper branch name. FAIL if a path-bearing identity reaches worktree creation, or if the rejection produces a malformed double-slash branch name. | Review the `RUNTIME_EXEC`/`RUNTIME_ID` guards in `worktree-session.sh §1`, then `bin/tests/worktree-session.test.sh` path-bearing-runtime assertions. |

### Optional Supplemental Checks

Repeat step 1 with an uppercase or symbol-laden identity (e.g. `MyRT`) to confirm the same rejection path fires for non-lowercase-kebab identities, not only path-bearing ones.

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
| `../../../../bin/worktree-session.sh` | `RUNTIME_EXEC`/`RUNTIME_ID` validation guards |
| `../../../../bin/tests/worktree-session.test.sh` | Regression coverage: path-bearing-runtime rejection assertions |

---

## 5. SOURCE METADATA

- Group: Owner-First Worktree Tooling
- Playbook ID: GIT-029
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `owner_first_worktree_tooling/runtime_identity_validation.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
