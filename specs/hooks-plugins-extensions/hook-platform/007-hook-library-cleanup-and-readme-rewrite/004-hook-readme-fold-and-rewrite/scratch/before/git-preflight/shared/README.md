---
title: "Git Preflight (Shared): Stdin Advisory Hook"
description: "The shared PreToolUse hook behind the runtime adapters, which reads the sk-git hard rules, evaluates a visible git command and emits one additionalContext advisory."
trigger_phrases:
  - "shared git preflight hook"
  - "SKGIT_ADVISORY_SKIP"
  - "pretooluse additional context"
version: 1.0.0.0
---

# Git Preflight (Shared): Stdin Advisory Hook

---

## 1. OVERVIEW

`git-preflight/shared/` holds the one real advisory every shell adapter runs. `git-preflight-advisory.mjs` is a relative symlink to `../../../skills/sk-git/scripts/hooks/git-preflight-advisory.mjs`. It accepts the Claude and Codex `Bash` payload, the older Codex and Devin `exec` payload and the Cursor `Shell` payload, with `tool_input.command` as the command and `cwd` or `workspace_roots[0]` as the project root.

The hook checks `isHookEnabled('git-preflight')`, resolves the three suppression tiers and stops any command that does not match `GIT_SHAPE` before it spawns a git process. It reads `hard-rules.json` beside `sk-git/SKILL.md`, keeps rules whose check exists in `GIT_CHECKS`, evaluates them against a lazy repository context and writes one `hookSpecificOutput.additionalContext` JSON. The text caps at three findings plus an omitted-count line.

---

## 2. WHAT EACH FILE DOES

| File | Event | What it does | On error |
|---|---|---|---|
| `git-preflight-advisory.mjs` | `PreToolUse` for `Bash`, `exec` or `Shell` | Is a link to the shared stdin hook. It applies `SKGIT_ADVISORY=0` as the global silence and `SKGIT_ADVISORY_SKIP` as either an exact rule id or an id prefix. It is advisory only and never blocks. | Calls `approve()` on unreadable stdin and on any uncaught rejection from `main`, so every failure path exits 0 with no output. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern index, with the suppression tiers and the 17 rule ids.
- [`../../../skills/sk-git/scripts/hooks/git-preflight-advisory.mjs`](../../../skills/sk-git/scripts/hooks/git-preflight-advisory.mjs): the real shared hook this link points at.
- [`../../../skills/sk-git/scripts/lib/git-rule-checks.mjs`](../../../skills/sk-git/scripts/lib/git-rule-checks.mjs): the `GIT_SHAPE` gate, the parser and the 17 checks.
