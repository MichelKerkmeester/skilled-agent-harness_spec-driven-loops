---
title: "Worktree Guard Hook: Git Worktree Safety"
description: "Index of the worktree-guard adapters that warn on unsafe git worktree operations across Claude, Codex, Cursor, and Devin."
trigger_phrases:
  - "worktree guard hook"
  - "worktree safety"
importance_tier: "reference"
contextType: "reference"
---

# Worktree Guard Hook: Git Worktree Safety

---

## 1. OVERVIEW

Index of the worktree-guard concern. Every runtime deploys the same shared script — real code at `.opencode/bin/worktree-guard.sh` — which advises on unsafe git worktree operations (per the sk-git worktree-vs-branch safety rules). The hub holds one relative symlink per runtime so the coverage is browsable by runtime.

One real file backs all four runtimes; the per-runtime entries are symlinks into `.opencode/bin/`.

## 2. KEY FILES

| Runtime | Adapter |
|---|---|
| `claude/`, `codex/`, `cursor/`, `devin/` | `worktree-guard.sh` (symlink → `../../../bin/worktree-guard.sh`) |

## 3. BOUNDARIES

- **Advisory, fail-open.** Warns on unsafe worktree actions; never blocks git itself.
- **Real code stays in `.opencode/bin/`.** The hub entries are relative symlinks.

## 4. RELATED

- [`../README.md`](../README.md) — the hub index and kill-switch model.
- [`../../skills/sk-git/`](../../skills/sk-git/) — the git workflow skill that owns worktree policy.
