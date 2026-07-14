---
title: "GIT-023 -- Locked unique number allocation"
description: "This scenario validates Locked unique number allocation for `GIT-023`. It focuses on prove concurrent allocator calls each get a distinct, monotonically increasing 4-digit number seeded from every worktree, ref, and stored high-water mark already in use."
version: 1.0.0.0
---

# GIT-023 -- Locked unique number allocation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-023`.

---

## 1. OVERVIEW

This scenario validates Locked unique number allocation for `GIT-023`. It focuses on prove concurrent allocator calls each get a distinct, monotonically increasing 4-digit number seeded from every worktree, ref, and stored high-water mark already in use.

### Why This Matters

The clone-wide counter cannot be enforced per-owner, so every worktree and branch across every skill shares one numbering space. A collision here would let two unrelated task worktrees claim the same number and directory.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-023` and confirm the expected signals without contradictory evidence.

- Objective: prove concurrent allocator calls each get a distinct, monotonically increasing 4-digit number seeded from every worktree, ref, and stored high-water mark already in use.
- Real user request: `I need a fresh worktree number for a new sk-git task — make sure it can't collide with anyone else grabbing one at the same time.`
- Prompt: `Allocate the next worktree number for an sk-git task, prove it is seeded from existing worktrees/refs/high-water mark, and show two concurrent allocations never collide.`
- Expected execution process: Run `scan-max` to confirm the seed picks up the highest in-use number from the high-water file, worktree list, and local/remote refs, then run `allocate` sequentially and concurrently and confirm every returned number is distinct.
- Expected signals: `scan-max` returns the true maximum across all sources; sequential `allocate` calls return strictly increasing 4-digit numbers; N concurrent calls under lock contention return N distinct numbers.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if `allocate` always returns a number one greater than the current high-water mark, the high-water file is updated atomically under `worktree-number.lock`, and 8 concurrent `allocate` calls produce 8 distinct numbers. FAIL if two calls return the same number, if `allocate` ever returns a number already in use, or if a lock held by a dead process is never reclaimed.

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
| GIT-023 | Locked unique number allocation | prove concurrent allocator calls each get a distinct, monotonically increasing 4-digit number seeded from every worktree, ref, and stored high-water mark already in use. | `Allocate the next worktree number for an sk-git task, prove it is seeded from existing worktrees/refs/high-water mark, and show two concurrent allocations never collide.` | 1. `bash: git update-ref refs/heads/skilled/0020-seed HEAD` -> 2. `bash: bash worktree-naming.sh scan-max` -> 3. `bash: bash worktree-naming.sh allocate` -> 4. `bash: for i in 1 2 3 4 5 6 7 8; do bash worktree-naming.sh allocate > alloc.$i & done; wait` -> 5. `bash: cat alloc.* \| sort -u \| wc -l` | `scan-max` reflects the seeded ref; sequential `allocate` is one greater than the scan; the 8 concurrent outputs sort to 8 distinct values. | `scan-max` output, sequential `allocate` output, the 8 concurrent outputs plus their sorted-unique count, and the `worktree-number.highwater` file content before/after. | PASS if `allocate` always returns a number one greater than the current high-water mark, the high-water file is updated atomically under `worktree-number.lock`, and 8 concurrent `allocate` calls produce 8 distinct numbers. FAIL if two calls return the same number, if `allocate` ever returns a number already in use, or if a lock held by a dead process is never reclaimed. | Check `_wn_acquire_lock`/`_wn_release_lock` mkdir-based locking and stale-holder takeover in `worktree-naming.sh §4`, then compare against `scripts/tests/worktree-naming.test.sh` concurrent-allocation and stale-lock assertions. |

### Optional Supplemental Checks

Re-run the concurrent-allocation step with a deliberately stale lock directory (a `pid` file naming an already-exited process) to confirm the lock is reclaimed by ownership transfer rather than by unlinking a path another allocator may have just acquired.

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
| `../../scripts/worktree-naming.sh` | Allocator: number scan, mkdir-based lock, high-water persistence |
| `../../scripts/tests/worktree-naming.test.sh` | Regression coverage: scan/preview, sequential allocation, 8-way concurrent allocation, stale-lock takeover |
| `../../SKILL.md` | ALWAYS #4 owner-first naming and allocator mandate |

---

## 5. SOURCE METADATA

- Group: Owner-First Worktree Tooling
- Playbook ID: GIT-023
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `owner_first_worktree_tooling/locked_unique_number_allocation.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
