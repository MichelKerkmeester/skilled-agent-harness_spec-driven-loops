---
title: "OpenCode Injection Screen: Plugin and Session Buffer"
description: "OpenCode plugin that screens webfetch results, buffers the advisory per session and drains it into the next experimental chat system transform."
trigger_phrases:
  - "opencode injection screen"
  - "opencode webfetch screen"
  - "injection screen plugin"
version: 1.0.0.0
---

# OpenCode Injection Screen: Plugin and Session Buffer

---

## 1. OVERVIEW

`hooks/classifier-injection-screen/opencode/` holds a browsability symlink to the real OpenCode plugin. The plugin screens the text a `webfetch` returned. It buffers the advisory per session and drains it into the next `experimental.chat.system.transform`, which is the model call that reads the fetched text. It never rewrites the tool result and never writes stdout or stderr.

The entry in this folder is a link. OpenCode loads the real file at `.opencode/plugins/classifier-injection-screen.js`, because its plugin loader globs that folder by a flat pattern.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `classifier-injection-screen.js` | Symlink to [`../../../../.opencode/plugins/classifier-injection-screen.js`](../../../../.opencode/plugins/classifier-injection-screen.js) | Link only. The target registers `tool.execute.after` for `webfetch`, remembers each advisory per session under a bounded buffer, and appends the pending advisories to `output.system` on `experimental.chat.system.transform` before draining them. | The target fails open. Every handler catches its own errors and leaves the fetch or the transform untouched. |

---

## 3. RELATED

- [`../README.md`](../README.md): the injection screen concern, its decision rule and its switches.
- [`../../../../.opencode/plugins/classifier-injection-screen.js`](../../../../.opencode/plugins/classifier-injection-screen.js): the real plugin this folder links to.
- [`../lib/classifier-injection-advisory.mjs`](../lib/classifier-injection-advisory.mjs): the shared `fetchedText` and `screenAdvisory` core the plugin imports.
