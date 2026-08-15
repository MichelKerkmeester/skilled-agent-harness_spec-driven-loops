---
title: "Git Primary Reconcile: Live-Checkout Convergence"
description: "Index of the git-primary-reconcile adapters that keep the primary checkout current on its live branch at session start across Claude, Codex, Pi, and the OpenCode session-start plugin."
trigger_phrases:
  - "primary checkout reconcile"
  - "live branch reconcile"
importance_tier: "reference"
contextType: "reference"
---

# Git Primary Reconcile: Live-Checkout Convergence

---

## 1. OVERVIEW

Index of the git-primary-reconcile concern. At session start every wired runtime backgrounds the same shared script — real code at `.opencode/bin/git-primary-reconcile.sh` — which converges the primary checkout onto its live branch. It fast-forwards when the checkout is behind and rebase-publishes local commits when it is ahead, so a session that commits directly in the primary never leaves it stranded ahead of and behind origin.

It acts only in the main checkout, only on the resolved live branch, and only when tracked files are clean. One real file backs the wired runtimes; the per-runtime entries are symlinks into `.opencode/bin/`.

## 2. KEY FILES

| Runtime | Adapter |
|---|---|
| `claude/`, `codex/`, `pi/` | `git-primary-reconcile.sh` (symlink → `../../../bin/git-primary-reconcile.sh`) |
| OpenCode | launched by the `.opencode/plugins/session-cleanup.js` session-start plugin, so no per-runtime symlink adapter |

## 3. BOUNDARIES

- **Never touches uncommitted work.** Tracked-only cleanliness; untracked build output is ignored and a dirty tree is skipped with a loud message.
- **Scope-gated.** Runs only in the main checkout, only on the resolved live branch, and stops safely on a linked worktree, a rebase conflict, or a blocked push, never losing a commit.
- **Non-fatal.** Every internal failure exits zero so session start always continues.
- **Real code stays in `.opencode/bin/`.** The hub entries are relative symlinks.
- **Disable:** `MK_LIVE_SYNC_DISABLED=1` turns off the whole live-sync loop; `MK_PRIMARY_RECONCILE_DISABLED=1` turns off this leg alone.

## 4. RELATED

- [`../README.md`](../README.md) — the hub index.
- [`../git-hooks-check/README.md`](../git-hooks-check/README.md) — the installed-hook verification concern.
- [`../session-cleanup/README.md`](../session-cleanup/README.md) — the OpenCode session-start plugin that also launches this script.
