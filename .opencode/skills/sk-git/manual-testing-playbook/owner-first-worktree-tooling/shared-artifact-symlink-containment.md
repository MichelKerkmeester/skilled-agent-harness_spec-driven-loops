---
title: "GIT-031 -- Shared-artifact symlinks stay contained to the worktree"
description: "This scenario validates Shared-artifact symlink containment for `GIT-031`. It focuses on prove the wrapper's shared-path symlinking refuses any path that would traverse outside the new worktree or outside the main checkout."
version: 1.0.0.0
---

# GIT-031 -- Shared-artifact symlinks stay contained to the worktree

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-031`.

---

## 1. OVERVIEW

This scenario validates Shared-artifact symlink containment for `GIT-031`. It focuses on prove the wrapper's shared-path symlinking (node_modules/dist reuse) refuses any path that would traverse outside the new worktree or outside the main checkout, instead of silently overwriting something outside its bounds.

### Why This Matters

Symlinking shared dependencies is a deliberate exception to the general worktree-isolation rule. That exception is only safe if every source and destination path is proven to stay strictly inside the main checkout and the new worktree, respectively.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-031` and confirm the expected signals without contradictory evidence.

- Objective: prove the wrapper's shared-path symlinking refuses any path that would traverse outside the new worktree or outside the main checkout, instead of silently overwriting something outside its bounds.
- Real user request: `Don't let the dependency-symlink step follow a relative path outside the new worktree and clobber something in my main checkout.`
- Prompt: `Configure a shared-path entry that tries to traverse outside the worktree, launch the wrapper, and confirm the traversal entry is skipped with a warning while the destination file is left untouched.`
- Expected execution process: Set `SPECKIT_WORKTREE_SHARED_PATHS` to a traversal-shaped relative path (e.g. `../../victim`), launch the wrapper for real in a disposable fixture with a decoy file at the traversal target, and confirm the launch still succeeds but the traversal entry is skipped.
- Expected signals: stderr contains `skipping unsafe shared path: ../../victim`; the decoy file at the traversal destination is unchanged and never replaced by a symlink; the launch still completes successfully.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if every traversal-shaped or outside-checkout shared path is skipped with a logged warning and the destination content is provably unchanged. FAIL if the traversal path is symlinked, if the decoy file's content changes, or if the skip is silent.

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
| GIT-031 | Shared-artifact symlinks stay contained to the worktree | prove the wrapper's shared-path symlinking refuses any path that would traverse outside the new worktree or outside the main checkout, instead of silently overwriting something outside its bounds. | `Configure a shared-path entry that tries to traverse outside the worktree, launch the wrapper, and confirm the traversal entry is skipped with a warning while the destination file is left untouched.` | 1. `bash: printf 'source-safe\n' > ../victim` -> 2. `bash: printf 'destination-must-survive\n' > ./victim` -> 3. `bash: SPECKIT_WORKTREE_SHARED_PATHS='../../victim' bash .opencode/bin/worktree-session.sh myrt` -> 4. `bash: test -f ./victim && ! test -L ./victim && echo still-a-plain-file` -> 5. `bash: grep -F 'unsafe shared path: ../../victim' <wrapper stderr>` | The launch succeeds; the decoy file remains a plain file with unchanged content; stderr names the exact skipped path. | Wrapper stderr warning line, `test -f`/`test -L` results on the decoy, and a content diff proving the decoy is byte-identical afterward. | PASS if every traversal-shaped or outside-checkout shared path is skipped with a logged warning and the destination content is provably unchanged. FAIL if the traversal path is symlinked, if the decoy file's content changes, or if the skip is silent. | Walk the `_canonical_existing_path`/`_is_strictly_inside` guard chain in `worktree-session.sh §6`, then `bin/tests/worktree-session.test.sh` traversal-fixture assertions. |

### Optional Supplemental Checks

Repeat with an absolute shared-path entry (leading `/`) to confirm the wrapper's separate absolute-path rejection fires before the traversal-canonicalization guard is even reached.

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
| `../../../../bin/worktree-session.sh` | Shared-path symlink resolution and containment guards |
| `../../../../bin/tests/worktree-session.test.sh` | Regression coverage: traversal-destination survival assertions |

---

## 5. SOURCE METADATA

- Group: Owner-First Worktree Tooling
- Playbook ID: GIT-031
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `owner_first_worktree_tooling/shared_artifact_symlink_containment.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
