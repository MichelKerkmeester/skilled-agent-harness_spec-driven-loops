---
title: "Git Primary Reconcile (DSH): SessionStart Convergence"
description: "DSH's link into the shared git-primary-reconcile.sh primitive, started detached by the repo-guards session-start advisories adapter as the primary-reconcile check."
trigger_phrases:
  - "dsh primary reconcile"
  - "repo-guards session start"
  - "live branch convergence"
version: 1.0.0.0
---

# Git Primary Reconcile (DSH): SessionStart Convergence

---

## 1. OVERVIEW

`git-primary-reconcile/dsh/` holds the DSH mirror of the live-checkout reconcile. `git-primary-reconcile.sh` is a relative symlink to `../../../bin/git-primary-reconcile.sh`. No DSH adapter imports this folder. The `repo-guards` bundle runs the same script from `../../../skills/system-spec-kit/runtime/hooks/dsh/session-start-advisories.mjs` on `agent/created`, with the check label `primary-reconcile`, the concern `primary-reconcile` and `detached: true`.

The adapter starts the script in its own process, so session start does not wait for the network. The script exits in a linked worktree, checks the `live-sync` and `primary-reconcile` switches in the main checkout, takes a single-flight lock and resolves the live branch. It fast-forwards a behind checkout, rebase-publishes local commits when the tree is clean and aborts a failed rebase back to the exact pre-rebase HEAD.

---

## 2. WHAT EACH FILE DOES

| File | Event | What it does | On error |
|---|---|---|---|
| `git-primary-reconcile.sh` | DSH `agent/created` through the `primary-reconcile` check, detached | Is a link to `../../../bin/git-primary-reconcile.sh`. The target records `skip`, `advance`, `block` or `publish` in `<git-common-dir>/git-primary-reconcile.log` after the worktree gate, kill-switch checks, lock, branch resolution and bounded fetch. | Always exits 0. The detached start discards output, so a failed reconcile leaves the checkout unchanged and the record in the log is the only trace. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern index, with the reconcile table, the push gates and the environment flags.
- [`../../../bin/git-primary-reconcile.sh`](../../../bin/git-primary-reconcile.sh): the real script this link points at.
- [`../../../skills/system-spec-kit/runtime/hooks/dsh/session-start-advisories.mjs`](../../../skills/system-spec-kit/runtime/hooks/dsh/session-start-advisories.mjs): the adapter that starts it on `agent/created`.
