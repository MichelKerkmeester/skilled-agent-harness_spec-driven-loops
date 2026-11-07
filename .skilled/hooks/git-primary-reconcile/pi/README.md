---
title: "Git Primary Reconcile (Pi): session_start Convergence"
description: "Pi's link into the shared git-primary-reconcile.sh primitive, started in the background by the session-start-advisories extension under the session-lifecycle concern."
trigger_phrases:
  - "pi primary reconcile"
  - "session start advisories"
  - "live branch convergence"
version: 1.0.0.0
---

# Git Primary Reconcile (Pi): session_start Convergence

---

## 1. OVERVIEW

`git-primary-reconcile/pi/` holds the Pi mirror of the live-checkout reconcile. `git-primary-reconcile.sh` is a relative symlink to `../../../bin/git-primary-reconcile.sh`. Pi does not load this folder. Its `session_start` handler lives in `.pi/extensions/session-start-advisories.ts`, which runs `bash -c 'bash .skilled/bin/git-primary-reconcile.sh >/dev/null 2>&1 &'` as the `primary-reconcile` check under the `session-lifecycle` concern.

The script exits in a linked worktree, checks the `live-sync` and `primary-reconcile` switches in the main checkout, takes a single-flight lock and resolves the live branch. It fast-forwards a behind checkout, rebase-publishes local commits when the tree is clean and aborts a failed rebase back to the exact pre-rebase HEAD. Every outcome is written as a tab-separated line in `<git-common-dir>/git-primary-reconcile.log`.

---

## 2. WHAT EACH FILE DOES

| File | Event | What it does | On error |
|---|---|---|---|
| `git-primary-reconcile.sh` | Pi `session_start` through the `primary-reconcile` check, backgrounded | Is a link to `../../../bin/git-primary-reconcile.sh`. The target records `skip`, `advance`, `block` or `publish` after the worktree gate, kill-switch checks, lock, branch resolution and bounded fetch. | Always exits 0. The backgrounded command discards output, so session start never waits on a fetch or a rebase. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern index, with the reconcile table, the push gates and the environment flags.
- [`../../../bin/git-primary-reconcile.sh`](../../../bin/git-primary-reconcile.sh): the real script this link points at.
- [`../../../../.pi/extensions/session-start-advisories.ts`](../../../../.pi/extensions/session-start-advisories.ts): the Pi extension that starts the script on `session_start`.
