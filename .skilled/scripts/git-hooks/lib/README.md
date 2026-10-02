---
title: "lib: Shared git-hook guards"
description: "Shared shell helpers that protect autostashes and detect mass deletions for repository Git hooks."
trigger_phrases:
  - "git hook helper libraries"
  - "autostash orphan guard"
  - "mass deletion guard"
version: 1.0.0.0
---

# lib: Shared git-hook guards

---

## 1. OVERVIEW

`lib/` holds shared shell libraries sourced by the repository Git hooks. These files are helpers, not installed hooks.

The helpers protect recoverable autostashes and report mass deletions without silently blocking Git operations.

---

## 2. STRUCTURE

| File | Purpose |
|---|---|
| [`autostash-orphan-guard.sh`](autostash-orphan-guard.sh) | Finds autostash entries, anchors each stash commit under `refs/autostash-rescue/`, prints recovery instructions and records an alert in `.skilled/logs/autostash-orphan-alerts.log`. |
| [`mass-deletion-guard.sh`](mass-deletion-guard.sh) | Counts tracked-file deletions in a diff and returns a verdict when the count passes the configured ceiling. |
| [`message-contract-gate.sh`](message-contract-gate.sh) | Resolves the message validator beside the real hook script and answers whether a repository declares an "Enforced rules" block without needing node. |

---

## 3. KEY FILES

| File | Function | Consumers |
|---|---|---|
| `autostash-orphan-guard.sh` | `autostash_orphan_guard()` protects matching stash commits from garbage collection and makes unapplied work visible. It always returns successfully. | [`post-commit`](../post-commit), [`post-merge`](../post-merge) and [`post-rewrite`](../post-rewrite) |
| `mass-deletion-guard.sh` | Returns a verdict when a diff deletes more tracked files than `SPECKIT_MASS_DELETION_THRESHOLD` (default 100). It never exits or blocks on its own, fails open on any substitution error, and `SPECKIT_ALLOW_MASS_DELETION=1` authorizes one operation. | [`pre-push`](../pre-push) |
| `message-contract-gate.sh` | `mcg_resolve_dir`, `mcg_validator_path`, `mcg_repo_declares_rules` and `mcg_unavailable_reason` find the validator beside the real hook (or in a linked worktree of the hook's own repository) and tell a repository that declares rules from one that does not. They never exit or block. | [`commit-msg`](../commit-msg) and [`pre-push`](../pre-push) |

`post-commit` calls the autostash guard after each commit, `post-merge` after a merge, and `post-rewrite` for amend and rebase rewrites. `pre-push` sources the mass-deletion guard, and both `commit-msg` and `pre-push` source the message-contract helpers.

The autostash guard has no bypass and remains best-effort.

---

## 4. VALIDATION

Run shell syntax checks from the repository root:

```bash
bash -n .opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh
bash -n .opencode/scripts/git-hooks/lib/mass-deletion-guard.sh
```

Run the mass-deletion harness from the repository root:

```bash
bash .skilled/scripts/git-hooks/tests/mass-deletion-guard.test.sh
```

Expected result: both syntax checks exit successfully and the harness reports that every mass-deletion scenario passed.

---

## 5. RELATED

- [Git hooks README](../README.md)
- [Git-hook tests](../tests/)
- [Git-hook installer](../../install-git-hooks.sh)
