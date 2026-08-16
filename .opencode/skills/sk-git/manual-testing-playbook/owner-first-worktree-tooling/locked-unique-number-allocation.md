---
title: "GIT-023 -- Locked unique number allocation"
description: "This scenario validates Locked unique number allocation for `GIT-023`. It focuses on prove concurrent allocator calls each get a distinct, monotonically increasing 3-digit number seeded from every worktree, ref, and stored high-water mark already in use in the target namespace."
version: 1.1.0.0
---

# GIT-023 -- Locked unique number allocation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-023`.

---

## 1. OVERVIEW

This scenario validates Locked unique number allocation for `GIT-023`. It focuses on prove concurrent allocator calls each get a distinct, monotonically increasing 3-digit number seeded from every worktree, ref, and stored high-water mark already in use in the target namespace.

### Why This Matters

Each namespace (`worktrees/` and `branches/`) owns an independent counter that git itself cannot enforce, so every matching worktree and ref in a namespace shares one numbering space. A collision here would let two unrelated task worktrees claim the same number and directory; a gap back-fill would reissue a live number.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-023` and confirm the expected signals without contradictory evidence.

- Objective: prove concurrent allocator calls each get a distinct, monotonically increasing 3-digit number seeded from every worktree, ref, and stored high-water mark already in use in the target namespace.
- Real user request: `I need a fresh worktree number for a new task — make sure it can't collide with anyone else grabbing one at the same time.`
- Prompt: `Allocate the next worktree number for a task, prove it is seeded from existing worktrees/refs/high-water mark in the worktrees namespace, and show two concurrent allocations never collide.`
- Expected execution process: Run `scan-max worktrees` to confirm the seed picks up the highest in-use number from the namespace's high-water file, worktree list, and local/remote refs, then run `allocate worktrees` sequentially and concurrently and confirm every returned number is distinct.
- Expected signals: `scan-max worktrees` returns the true maximum across all sources; sequential `allocate` calls return strictly increasing 3-digit numbers; N concurrent calls under lock contention return N distinct numbers.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if `allocate` always returns a number one greater than the current high-water mark, the namespace's high-water file is updated atomically under `worktree-number.lock`, and 8 concurrent `allocate` calls produce 8 distinct numbers. FAIL if two calls return the same number, if `allocate` ever returns a number already in use, or if a lock held by a dead process is never reclaimed.

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
| GIT-023 | Locked unique number allocation | prove concurrent allocator calls each get a distinct, monotonically increasing 3-digit number seeded from every worktree, ref, and stored high-water mark already in use in the target namespace. | `Allocate the next worktree number for a task, prove it is seeded from existing worktrees/refs/high-water mark in the worktrees namespace, and show two concurrent allocations never collide.` | 1. `bash: git update-ref refs/heads/worktrees/020-seed HEAD` -> 2. `bash: bash worktree-naming.sh scan-max worktrees` -> 3. `bash: bash worktree-naming.sh allocate worktrees` -> 4. `bash: for i in 1 2 3 4 5 6 7 8; do bash worktree-naming.sh allocate worktrees > alloc.$i & done; wait` -> 5. `bash: cat alloc.* \| sort -u \| wc -l` | `scan-max` reflects the seeded ref; sequential `allocate` is one greater than the scan; the 8 concurrent outputs sort to 8 distinct values. | `scan-max` output, sequential `allocate` output, the 8 concurrent outputs plus their sorted-unique count, and the `worktrees-number.highwater` file content before/after. | PASS if `allocate` always returns a number one greater than the current high-water mark, the namespace's high-water file is updated atomically under `worktree-number.lock`, and 8 concurrent `allocate` calls produce 8 distinct numbers. FAIL if two calls return the same number, if `allocate` ever returns a number already in use, or if a lock held by a dead process is never reclaimed. | Check `_wn_acquire_lock`/`_wn_release_lock` mkdir-based locking and stale-holder takeover in `worktree-naming.sh §3`, then compare against `scripts/tests/worktree-naming.test.sh` concurrent-allocation and stale-lock assertions. |

### Optional Supplemental Checks

Re-run the concurrent-allocation step with a deliberately stale lock directory (a `pid` file naming an already-exited process) to confirm the lock is reclaimed by ownership transfer rather than by unlinking a path another allocator may have just acquired. Confirm a `branches/` allocation is unaffected by `worktrees/` numbers already in use (the two namespaces are independent).

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
| `../../scripts/worktree-naming.sh` | Allocator: per-namespace number scan, mkdir-based lock, high-water persistence |
| `../../scripts/tests/worktree-naming.test.sh` | Regression coverage: scan/preview, sequential allocation, 8-way concurrent allocation, stale-lock takeover, namespace independence |
| `../../SKILL.md` | ALWAYS #4 numbered naming and allocator mandate |

---

## 5. SOURCE METADATA

- Group: Owner-First Worktree Tooling
- Playbook ID: GIT-023
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `owner-first-worktree-tooling/locked-unique-number-allocation.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
