---
title: "OpenCode Completion Hooks: Idle Sentinel and Read-Only Tool"
description: "Two OpenCode plugins. One checks a completion claim at session idle. The other exposes a read-only spec folder completion tool."
trigger_phrases:
  - "opencode completion sentinel"
  - "opencode completion evidence"
  - "system speckit completion tool"
version: 1.0.0.0
---

# OpenCode Completion Hooks: Idle Sentinel and Read-Only Tool

---

## 1. OVERVIEW

`hooks/completion/opencode/` holds browsability symlinks to two OpenCode plugins. `system-completion-sentinel.js` runs on `session.idle`, recovers the last assistant text through `ctx.client.session.messages()` and resolves the spec folder from that text. `system-speckit-completion.js` registers a read-only tool named `system_speckit_completion` and runs no event hooks.

OpenCode's loader globs `.opencode/plugins/` by a flat pattern, so both real files live there and nothing loads through these links. Neither plugin writes stdout or stderr, because OpenCode paints console output onto the prompt line.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `system-completion-sentinel.js` | Symlink to [`../../../../.opencode/plugins/system-completion-sentinel.js`](../../../../.opencode/plugins/system-completion-sentinel.js) | Link only. The target runs at `session.idle`, reads the last assistant message, evaluates the claim through the shared core and appends the advisory to the bounded log. `session.created` triggers a throttled state sweep. | The target fails open. A resolution or internal error returns without output. |
| `system-speckit-completion.js` | Symlink to [`../../../../.opencode/plugins/system-speckit-completion.js`](../../../../.opencode/plugins/system-speckit-completion.js) | Link only. The target registers the read-only `system_speckit_completion` tool, which returns a spec folder's level, checklist P0/P1/P2 completion and placeholder completeness. | The target reports an unavailable section in its JSON payload rather than throwing. |

---

## 3. RELATED

- [`../README.md`](../README.md): the completion concern, the core decision rule and the runtime delivery table.
- [`../../../../.opencode/plugins/system-completion-sentinel.js`](../../../../.opencode/plugins/system-completion-sentinel.js): the real sentinel plugin this folder links to.
- [`../../../../.opencode/plugins/system-speckit-completion.js`](../../../../.opencode/plugins/system-speckit-completion.js): the real tool plugin this folder links to.
