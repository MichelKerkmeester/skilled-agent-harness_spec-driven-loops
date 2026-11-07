---
title: "OpenCode Dispatch Hook: In-Process Preflight and Audit Plugin"
description: "Browsability link to the OpenCode plugin that preflights a bash dispatch at tool.execute.before and records it at tool.execute.after."
trigger_phrases:
  - "opencode dispatch audit"
  - "opencode dispatch preflight"
  - "cli dispatch audit plugin"
version: 1.0.0.0
---

# OpenCode Dispatch Hook: In-Process Preflight and Audit Plugin

---

## 1. OVERVIEW

`hooks/dispatch/opencode/` holds one browsability symlink to the real OpenCode dispatch plugin. The plugin keeps both halves in process, because `tool.execute.before` is the one OpenCode surface that can still stop a command. It preflights a bash dispatch against the same hard-rule engine the Claude adapter runs and records a completed dispatch through the same audit core.

OpenCode's loader globs `.opencode/plugins/` by a flat pattern, so the real file lives there and nothing loads through this link.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `cli-dispatch-audit.js` | Symlink to [`../../../../.opencode/plugins/cli-dispatch-audit.js`](../../../../.opencode/plugins/cli-dispatch-audit.js) | Link only. The target registers `tool.execute.before` to deny a blocked dispatch by throwing the reason, and `tool.execute.after` to append one scrubbed audit line tagged `runtime: 'opencode'`. It anchors the log path to the repository root. | The target fails open. It never writes stdout or stderr, which OpenCode paints onto the prompt line. |

---

## 3. RELATED

- [`../README.md`](../README.md): the dispatch concern, the shared cores and the full rule list.
- [`../../../../.opencode/plugins/cli-dispatch-audit.js`](../../../../.opencode/plugins/cli-dispatch-audit.js): the real plugin this folder links to.
- [`../lib/dispatch-audit.mjs`](../lib/dispatch-audit.mjs): the audit core the plugin imports.
- [`../lib/dispatch-rule-checks.mjs`](../lib/dispatch-rule-checks.mjs): the rule engine the preflight calls.
