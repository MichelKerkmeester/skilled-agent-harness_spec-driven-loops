---
title: "lib: Shared git-hook guards"
description: "Shared shell helpers that protect autostashes and mark memory-index drift for repository Git hooks."
trigger_phrases:
  - "git hook helper libraries"
  - "autostash orphan guard"
  - "memory drift marker"
version: 1.0.0.0
---

# lib: Shared git-hook guards

---

## 1. OVERVIEW

`lib/` holds shared shell libraries sourced by the repository Git hooks. These files are helpers, not installed hooks.

The helpers protect recoverable autostashes and report spec-document path drift without blocking Git operations.

---

## 2. STRUCTURE

| File | Purpose |
|---|---|
| [`autostash-orphan-guard.sh`](autostash-orphan-guard.sh) | Finds autostash entries, anchors each stash commit under `refs/autostash-rescue/`, prints recovery instructions and records an alert in `.opencode/logs/autostash-orphan-alerts.log`. |
| [`memory-drift-marker.sh`](memory-drift-marker.sh) | Diffs commit ranges for changes under `.opencode/specs` and passes matching rename or deletion data to the built drift-marker writer. |

---

## 3. KEY FILES

| File | Function | Consumers |
|---|---|---|
| `autostash-orphan-guard.sh` | `autostash_orphan_guard()` protects matching stash commits from garbage collection and makes unapplied work visible. It always returns successfully. | [`post-merge`](../post-merge) and [`post-rewrite`](../post-rewrite) |
| `memory-drift-marker.sh` | `mark_memory_drift_from_diff()` collects `.opencode/specs` changes with `git diff-tree` and invokes `drift-marker-write.js`. It skips work when no relevant diff, Node.js or built writer exists. | [`post-commit`](../post-commit), [`post-merge`](../post-merge) and [`post-rewrite`](../post-rewrite) |

`post-merge` calls both guards after a merge. `post-rewrite` calls both guards for amend and rebase rewrites. `post-commit` uses only the memory-drift marker after a commit.

Set `SPECKIT_SKIP_MEMORY_DRIFT_GIT_HOOK=1` to bypass memory-drift marking. The autostash guard has no bypass and remains best-effort.

---

## 4. VALIDATION

Run shell syntax checks from the repository root:

```bash
bash -n .opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh
bash -n .opencode/scripts/git-hooks/lib/memory-drift-marker.sh
```

Run the memory-drift concurrency harness from the repository root:

```bash
bash .opencode/scripts/git-hooks/tests/memory-drift-marker-lock-harness.sh
```

Expected result: both syntax checks exit successfully and the harness reports that all seven producer scenarios passed.

---

## 5. RELATED

- [Git hooks README](../README.md)
- [Git-hook tests](../tests/)
- [Git-hook installer](../../install-git-hooks.sh)
