---
title: "Session Relaunch: OpenCode Plugin Link"
description: "Browsability link to the real OpenCode plugin, which tracks fill per session, delivers the nudge and seed through the system transform and arms at idle."
trigger_phrases:
  - "opencode session relaunch"
  - "opencode context nudge"
  - "opencode relaunch plugin"
version: 1.0.0.0
---

# Session Relaunch: OpenCode Plugin Link

---

## 1. OVERVIEW

`opencode/` holds one relative symlink. `session-relaunch.js` points to `../../../../.opencode/plugins/session-relaunch.js`, and OpenCode loads the real plugin from that folder through its flat plugin glob. Nothing loads through this link. The plugin tracks each session's context window, queues a nudge from `message.updated` and `message.part.updated`, arms at `session.idle`, seeds after `session.compacted` and pushes the active nudge, the seed or the withdrawn notice into `experimental.chat.system.transform`. Its `tool.execute.before` hook throws for the `question` tool while the session's record can still be armed, because an open dialog keeps the session from going idle. A child session is excluded so a sub-agent cannot hand off its parent.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`session-relaunch.js`](./session-relaunch.js) | Symlink, plugin events | Points at `.opencode/plugins/session-relaunch.js`. The target imports `../hooks/session-relaunch/lib/`, handles `session.created`, `session.updated`, `message.updated`, `message.part.updated`, `session.idle` and `session.compacted`, refuses the `question` tool in `tool.execute.before` while the session's record can still be armed, and exports through `dualPlugin`. | Fails open. The target catches every event error and never writes stdout or stderr. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the runtime matrix and the state model.
- [`../../../../.opencode/plugins/session-relaunch.js`](../../../../.opencode/plugins/session-relaunch.js): the real plugin.
- [`../lib/nudge.cjs`](../lib/nudge.cjs): the text and threshold logic behind the plugin.
