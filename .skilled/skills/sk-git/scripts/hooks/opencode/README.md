---
title: "OpenCode Hooks: sk-git Plugin Mirrors"
description: "Browsability symlinks to the two sk-git OpenCode plugins, the warn-only git preflight advisory and the blocking message-contract gate, which OpenCode loads from .opencode/plugins/."
trigger_phrases:
  - "opencode git preflight"
  - "opencode git message gate"
---

# OpenCode Hooks: sk-git Plugin Mirrors

---

## 1. OVERVIEW

OpenCode discovers plugins only in `.opencode/plugins/`, so the real sk-git plugin files live there. This folder holds relative symlinks back to them so the sk-git hook tree shows every runtime in one place. Nothing loads through these links.

---

## 2. CONTENTS

| File | Target | Role |
|---|---|---|
| `sk-git-preflight-advisory.js` | `.opencode/plugins/sk-git-preflight-advisory.js` | Warn-only advisory on git commands, buffered and delivered on the next system transform |
| `sk-git-message-gate.js` | `.opencode/plugins/sk-git-message-gate.js` | Blocks a bash call whose commit message, PR description or new branch name breaks the repository's own sk-git templates, by throwing from `tool.execute.before` |

---

## 3. RELATED

- [`../README.md`](../README.md): the sk-git hook tree across every runtime.
- [`../git-message-gate.mjs`](../git-message-gate.mjs): the shared gate both the plugin and the other runtimes call.
