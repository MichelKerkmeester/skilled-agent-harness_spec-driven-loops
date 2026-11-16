---
title: "Git Message Gate (OpenCode): bash Tool Gate"
description: "OpenCode's link into the shared message-contract plugin, which refuses a bash call whose commit message, PR description or branch name breaks the sk-git templates."
trigger_phrases:
  - "opencode git message gate"
  - "sk-git message contract"
  - "bash tool before hook"
version: 1.0.0.0
---

# Git Message Gate (OpenCode): bash Tool Gate

---

## 1. OVERVIEW

`git-message-gate/opencode/` holds the OpenCode entry for the message contract gate. `sk-git-message-gate.js` is a relative symlink to `../../../../.opencode/plugins/sk-git-message-gate.js`. OpenCode discovers plugins in `.opencode/plugins/`, so the real file lives there and this folder only mirrors it for browsing. Nothing loads through the link.

The plugin registers `tool.execute.before` and returns early unless the tool name is `bash` and `output.args.command` is a string. It reads the working directory from `output.args.workdir`, falling back to the plugin context's `directory`, then to `process.cwd()`. It calls the shared `evaluateCommand` and throws an `Error` prefixed `sk-git-message-gate:` when a reason comes back. OpenCode turns that throw into the tool result the model reads.

---

## 2. WHAT EACH FILE DOES

| File | Event | What it does | On error |
|---|---|---|---|
| `sk-git-message-gate.js` | `tool.execute.before` for `bash` | Is a link to the real OpenCode plugin. The plugin wraps the shared gate in `dualPlugin('sk-git-message-gate', ...)` and throws the refusal with its fixed prefix. There is no kill switch. | Swallows an internal fault, so the call is allowed. A `ContractError` becomes the refusal `sk-git blocked this command: the repository's rules cannot be read: ...` |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern index, with the per-runtime refusal channels and the contract rules.
- [`../../../../.opencode/plugins/sk-git-message-gate.js`](../../../../.opencode/plugins/sk-git-message-gate.js): the real plugin this link points at.
- [`../../../skills/sk-git/scripts/hooks/git-message-gate.mjs`](../../../skills/sk-git/scripts/hooks/git-message-gate.mjs): the shared gate that exports `evaluateCommand`.
