---
title: "Git Preflight (OpenCode): Buffered Advisory Plugin"
description: "OpenCode's link into the shared advisory plugin, which evaluates bash git commands and injects the findings as one system block on the next chat transform."
trigger_phrases:
  - "opencode git preflight advisory"
  - "buffered system context"
  - "sk-git advisory plugin"
version: 1.0.0.0
---

# Git Preflight (OpenCode): Buffered Advisory Plugin

---

## 1. OVERVIEW

`git-preflight/opencode/` holds the OpenCode entry for the git preflight advisory. `sk-git-preflight-advisory.js` is a relative symlink to `../../../../.opencode/plugins/sk-git-preflight-advisory.js`. OpenCode discovers plugins in `.opencode/plugins/`, so the real file lives there and this folder only mirrors it for browsing. Nothing loads through the link.

The plugin registers `tool.execute.before` and returns early unless the tool name is `bash` and the command matches `GIT_SHAPE`. It resolves the repository root with `findRepoRoot`, reads the hard rules from `sk-git/SKILL.md` under the discovered source root and evaluates the command with the shared `evaluate`, `GIT_CHECKS` and `createGitContext`. Findings are buffered as text, never printed, and drained by `experimental.chat.system.transform` into one system block on the next turn.

---

## 2. WHAT EACH FILE DOES

| File | Event | What it does | On error |
|---|---|---|---|
| `sk-git-preflight-advisory.js` | `tool.execute.before` for `bash`, delivered on `experimental.chat.system.transform` | Is a link to the real OpenCode plugin, wrapped in `dualPlugin('sk-git-preflight-advisory', ...)`. It caps the buffer at 20 pending events and shifts the oldest out. The command is never delayed or blocked. | Fails open at every step. A failed evaluation or transform returns without throwing, so the bash call and the turn continue. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern index, with the suppression tiers and the 17 rule ids.
- [`../../../../.opencode/plugins/sk-git-preflight-advisory.js`](../../../../.opencode/plugins/sk-git-preflight-advisory.js): the real plugin this link points at.
- [`../../../skills/sk-git/scripts/hooks/git-preflight-advisory.mjs`](../../../skills/sk-git/scripts/hooks/git-preflight-advisory.mjs): the shared stdin hook and its rule engine.
