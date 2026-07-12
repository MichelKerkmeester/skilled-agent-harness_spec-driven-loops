---
title: "tests: Git-hook regression harnesses"
description: "Shell harnesses that exercise Git-hook installation, memory-drift locking and code-graph invalidation."
trigger_phrases:
  - "git hook test harnesses"
  - "memory drift lock tests"
  - "post commit invalidation tests"
version: 1.0.0.0
---

# tests: Git-hook regression harnesses

---

## 1. OVERVIEW

`tests/` contains executable regression harnesses for the repository Git-hook machinery. These files create isolated fixtures, exercise real scripts and report pass or fail results.

They are tests, not installed Git hooks. Run them directly from the repository root.

---

## 2. STRUCTURE

| File | Purpose |
|---|---|
| [`install-git-hooks-worktree-harness.sh`](install-git-hooks-worktree-harness.sh) | Creates a temporary repository and linked worktree, runs the hook installer and verifies hook placement for both Git's resolved hook path and a custom `core.hooksPath`. |
| [`memory-drift-marker-lock-harness.sh`](memory-drift-marker-lock-harness.sh) | Exercises canonical marker paths, lock ownership, stale-lock recovery, concurrent writers, failed writes and token-checked lock release against real helper processes. |
| [`post-commit-code-graph-invalidation.sh`](post-commit-code-graph-invalidation.sh) | Tests post-commit code-graph invalidation, dry-run preservation and launcher-side marker consumption under exclusive ownership. |

---

## 3. TEST HARNESSES

| Harness | What It Exercises | Success Signal |
|---|---|---|
| `install-git-hooks-worktree-harness.sh` | Installs a fixture `pre-commit` hook from a linked worktree, then repeats installation with `.custom-hooks` configured through `core.hooksPath`. | Prints pass lines for the linked-worktree path and custom hook path. |
| `memory-drift-marker-lock-harness.sh` | Runs seven producer scenarios covering symlink path parity, live-owner protection, ownerless lock handling, merged concurrent writes, write-failure cleanup and ownership-token safety. | Prints `All 7 memory drift marker producer scenarios passed`. |
| `post-commit-code-graph-invalidation.sh` | Confirms that the post-commit hook writes an atomic marker without deleting live SQLite files, that dry-run changes no state and that the launcher consumes the marker only after it gains exclusive ownership. | Prints `All 3 post-commit invalidation tests passed`. |

Each harness removes its temporary fixtures on exit.

---

## 4. VALIDATION

Run each harness from the repository root:

```bash
bash .opencode/scripts/git-hooks/tests/install-git-hooks-worktree-harness.sh
bash .opencode/scripts/git-hooks/tests/memory-drift-marker-lock-harness.sh
bash .opencode/scripts/git-hooks/tests/post-commit-code-graph-invalidation.sh
```

Expected result: every command exits with status `0` and prints its pass summary. A fixture failure or failed assertion exits with status `1`.

---

## 5. RELATED

- [Git hooks README](../README.md)
- [Shared Git-hook libraries](../lib/)
- [Git-hook installer](../../install-git-hooks.sh)
- [Post-commit hook](../post-commit)
