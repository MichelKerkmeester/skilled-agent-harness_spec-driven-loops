---
title: "lib: Shared git-hook guards"
description: "Shared shell helpers that protect autostashes and detect mass deletions for repository Git hooks."
trigger_phrases:
  - "git hook helper libraries"
  - "autostash orphan guard"
  - "mass deletion guard"
version: 1.0.1.0
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
| [`bounded-git.sh`](bounded-git.sh) | Runs a git call that reads the index or the working tree under a wall-clock bound with `core.fsmonitor=false`, so a wedged fsmonitor daemon or a stuck index lock costs one timeout instead of a hang. |
| [`autostash-orphan-guard.sh`](autostash-orphan-guard.sh) | Finds autostash entries, anchors each stash commit under `refs/autostash-rescue/`, prints recovery instructions and records an alert in `.skilled/logs/autostash-orphan-alerts.log`. |
| [`commit-id-policy.sh`](commit-id-policy.sh) | Decides which repositories carry a `Commit-Id` on every commit and finds an allocator to mint one, without running code from the repository. |
| [`gate-config.sh`](gate-config.sh) | Reads git config `speckit.hooks.<key>` and turns a saved `off` into the gate's `SPECKIT_SKIP_*` variable for one hook run. |
| [`gates.tsv`](gates.tsv) | The gate registry: one row per switchable gate with its hook, config key, bypass variable, whether it may be saved, and what it does. |
| [`mass-deletion-guard.sh`](mass-deletion-guard.sh) | Counts tracked-file deletions in a diff and returns a verdict when the count passes the configured ceiling. |
| [`message-contract-gate.sh`](message-contract-gate.sh) | Resolves the message validator beside the real hook script and answers whether a repository declares an "Enforced rules" block without needing node. |

---

## 3. KEY FILES

| File | Function | Consumers |
|---|---|---|
| `autostash-orphan-guard.sh` | `autostash_orphan_guard()` protects matching stash commits from garbage collection and makes unapplied work visible. It always returns successfully. | [`post-commit`](../post-commit), [`post-merge`](../post-merge) and [`post-rewrite`](../post-rewrite) |
| `bounded-git.sh` | `bounded_run <seconds> <command...>` bounds any command and returns 142 on expiry. `git_bounded <git args...>` runs `git -c core.fsmonitor=false <args>` under `SPECKIT_GIT_TIMEOUT` (default 20 seconds), ends the child with SIGTERM and then SIGKILL after a three second grace, and records a timeout. `git_bound_arm` and `git_bound_finish <status>` let a hook turn a recorded timeout into a block. `GIT_BOUND_SECONDS` is an internal per-call override and outranks `SPECKIT_GIT_TIMEOUT` when set: `worktree-session.sh` sets it from `SPECKIT_WORKTREE_ADD_TIMEOUT` for the one `git worktree add` call, and the tests set it. Operators set `SPECKIT_GIT_TIMEOUT`, and an inherited `GIT_BOUND_SECONDS` would silently override it. | [`pre-commit`](../pre-commit) and [`pre-push`](../pre-push) (which print `BLOCKED [gate:git-timeout]`), the legacy helper in `.skilled/hooks/git/`, `worktree-session.sh` and `worktree-reaper.sh`. |
| `commit-id-policy.sh` | `cip_repo_wants_ids` answers from local config `skilled.commitId` first, then the shipped allocator or toolchain sentinel, then `Commit-Id` trailers in the last fifty commits. `cip_own_allocator` names the allocator beside the hooks and `cip_message_has_id` tests a message file. They never exit or block. | [`prepare-commit-msg`](../prepare-commit-msg), [`commit-msg`](../commit-msg) and [`pre-push`](../pre-push), in every repository |
| `gate-config.sh` | `gate_config_apply <hook>` walks the registry rows for that hook marked persistable and, when local or global config holds `off`, `false`, `no` or `0` for the row's key, exports its variable as `1` and prints one notice naming the scope. A variable already set, a command-scope value and a non-persistable row are left alone. It never exits or blocks, and a missing registry changes nothing. | [`pre-commit`](../pre-commit), [`prepare-commit-msg`](../prepare-commit-msg) and [`pre-push`](../pre-push), in a trusted toolchain repository only |
| `gates.tsv` | Read by `gate-config.sh` and by `/doctor:git hooks` (`.skilled/commands/doctor/scripts/git-hook-gates.cjs`). `../tests/gate-config.test.sh` holds every `SPECKIT_SKIP_*` and `SPECKIT_ALLOW_*` variable the hooks read to exactly one row. | `gate-config.sh`, `/doctor:git hooks` |
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
bash -n .skilled/scripts/git-hooks/lib/gate-config.sh
bash -n .skilled/scripts/git-hooks/lib/bounded-git.sh
bash -n .skilled/scripts/git-hooks/lib/commit-id-policy.sh
```

Run the mass-deletion harness from the repository root:

```bash
bash .skilled/scripts/git-hooks/tests/mass-deletion-guard.test.sh
bash .skilled/scripts/git-hooks/tests/gate-config.test.sh
bash .skilled/scripts/git-hooks/tests/bounded-git.test.sh
```

Expected result: both syntax checks exit successfully and the harness reports that every mass-deletion scenario passed.

---

## 5. RELATED

- [Git hooks README](../README.md)
- [Git-hook tests](../tests/)
- [Git-hook installer](../../install-git-hooks.sh)

<!-- readme-check
allow-ref refs/autostash-rescue/ | a git ref namespace the guard writes rescue refs under, not a folder
-->
