---
title: "OpenCode Dist Freshness: System Context Guard Link"
description: "Browsability link to the OpenCode plugin that checks watched packages for stale dist output and injects a bounded brief into the system context."
trigger_phrases:
  - "opencode dist freshness"
  - "dist freshness guard"
  - "opencode stale build warning"
version: 1.0.0.0
---

# OpenCode Dist Freshness: System Context Guard Link

---

## 1. OVERVIEW

`hooks/dist-freshness/opencode/` holds one browsability symlink to the real OpenCode plugin. The plugin owns the projection face of this concern. It checks every watched package at `session.created`, force-refreshes before a risky bash command, invalidates on a source edit and injects a bounded brief into `output.system` on each turn from a short-lived cache.

OpenCode's loader globs `.opencode/plugins/` by a flat pattern, so the real file lives there and nothing loads through this link. The plugin never writes stdout or stderr.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `system-dist-freshness-guard.js` | Symlink to [`../../../../.opencode/plugins/system-dist-freshness-guard.js`](../../../../.opencode/plugins/system-dist-freshness-guard.js) | Link only. The target registers `session.created` and teardown events, `tool.execute.before` for `bash` and mutating tools, and `experimental.chat.system.transform`. It logs to `.skilled/logs/dist-freshness-guard.log` with a 256 KB cap and an 8-line diagnostic limit. | The target fails open. Every error path is logged and leaves the existing build in place. |

---

## 3. RELATED

- [`../README.md`](../README.md): the dist freshness concern, its two modes and its switches.
- [`../../../../.opencode/plugins/system-dist-freshness-guard.js`](../../../../.opencode/plugins/system-dist-freshness-guard.js): the real plugin this folder links to.
- [`../claude/README.md`](../claude/README.md): the shell check face of the same concern.
