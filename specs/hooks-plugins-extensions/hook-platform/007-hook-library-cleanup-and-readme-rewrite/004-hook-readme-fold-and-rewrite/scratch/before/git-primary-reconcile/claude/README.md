---
title: "Git Primary Reconcile (Claude): SessionStart Convergence"
description: "Claude's link into the shared git-primary-reconcile.sh primitive, which fast-forwards or rebase-publishes the main checkout so it does not rest behind or ahead of its live branch."
trigger_phrases:
  - "claude primary reconcile"
  - "live branch convergence"
  - "sessionstart git reconcile"
version: 1.0.0.0
---

# Git Primary Reconcile (Claude): SessionStart Convergence

---

## 1. OVERVIEW

`git-primary-reconcile/claude/` holds the Claude entry for the live-checkout reconcile. Claude starts it once per session from its `SessionStart` chain in `.claude/settings.json` as a backgrounded command, `bash .skilled/bin/git-primary-reconcile.sh >/dev/null 2>&1 &`. The folder carries no code of its own. `git-primary-reconcile.sh` is a relative symlink to `../../../bin/git-primary-reconcile.sh`, so the real script stays in `.skilled/bin/`.

The script exits before doing any work in a linked worktree. In the main checkout it checks the `live-sync` and `primary-reconcile` switches, takes a single-flight lock and resolves the live branch. It fast-forwards a behind checkout, rebase-publishes local commits when the tree is clean and aborts a failed rebase back to the exact pre-rebase HEAD. Every outcome is written as a tab-separated line in `<git-common-dir>/git-primary-reconcile.log`.

---

## 2. WHAT EACH FILE DOES

| File | Event | What it does | On error |
|---|---|---|---|
| `git-primary-reconcile.sh` | Claude `SessionStart`, backgrounded | Is a link to `../../../bin/git-primary-reconcile.sh`. The target performs the worktree gate, kill-switch checks, lock, branch resolution, bounded fetch and the advance or publish flow, then records `skip`, `advance`, `block` or `publish`. | Always exits 0. A fetch failure, missing tip, dirty tree, rebase conflict or rejected push is recorded and leaves the checkout unchanged or the commits unpublished. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern index, with the reconcile table, the push gates and the environment flags.
- [`../../../bin/git-primary-reconcile.sh`](../../../bin/git-primary-reconcile.sh): the real script this link points at.
- [`../../../../.claude/settings.json`](../../../../.claude/settings.json): the Claude registration that starts the script.
