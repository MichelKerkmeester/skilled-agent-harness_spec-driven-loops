---
title: "Git Hooks Check: Installed-Hook Verification"
description: "Index of the check-git-hooks adapters that verify the repo's git hooks are installed and current across Claude, Codex, Cursor, and Devin."
trigger_phrases:
  - "check git hooks"
  - "git hook verification"
importance_tier: "reference"
contextType: "reference"
---

# Git Hooks Check: Installed-Hook Verification

---

## 1. OVERVIEW

Index of the git-hooks-check concern. Every runtime deploys the same shared script — real code at `.opencode/bin/check-git-hooks.sh` — which verifies that the repository's managed git hooks (pre-commit, pre-push, commit-msg) are installed and current, surfacing a warning when they are stale or missing so the commit/push guardrails stay in force.

One real file backs all four runtimes; the per-runtime entries are symlinks into `.opencode/bin/`.

## 2. KEY FILES

| Runtime | Adapter |
|---|---|
| `claude/`, `codex/`, `cursor/`, `devin/` | `check-git-hooks.sh` (symlink → `../../../bin/check-git-hooks.sh`) |

## 3. BOUNDARIES

- **Advisory, fail-open.** Reports drift; never rewrites or force-installs hooks on its own.
- **Real code stays in `.opencode/bin/`.** The hub entries are relative symlinks.

## 4. RELATED

- [`../README.md`](../README.md) — the hub index.
- [`../git-preflight/README.md`](../git-preflight/README.md) — the related git preflight advisory.
