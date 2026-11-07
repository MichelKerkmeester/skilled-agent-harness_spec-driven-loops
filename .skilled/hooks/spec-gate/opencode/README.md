---
title: "Spec Gate Hooks: OpenCode Plugin Link"
description: "Relative link to the OpenCode Spec Gate plugin, which maps OpenCode transport onto the shared Gate-3 core."
trigger_phrases:
  - "spec gate opencode plugin"
  - "opencode gate 3 transform"
  - "opencode spec gate enforce"
version: 1.0.0.0
---

# Spec Gate Hooks: OpenCode Plugin Link

---

## 1. OVERVIEW

`opencode/` holds one link for the OpenCode Spec Gate path. It points at the committed plugin in `.opencode/plugins/`, which OpenCode loads through its flat glob over that folder. Nothing loads through this link. The plugin classifies on `experimental.chat.system.transform`, enforces on `tool.execute.before`, and handles session state on `event`. All policy and persistence stay in the shared core.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| `system-spec-gate.js` | Plugin link | Link to `.opencode/plugins/system-spec-gate.js`. Appends the one-shot deferral instruction to `output.system`, throws `system-spec-gate: <detail>` on deny, and sweeps, re-arms or evicts state on session events. | Fails open on an unexpected error. Only the deny message is re-thrown, so a core failure never blocks a tool call. |

---

## 3. RELATED

- [`../README.md`](../README.md): the Spec Gate concern, its policy core and its delivery table.
- [`../../../../.opencode/plugins/system-spec-gate.js`](../../../../.opencode/plugins/system-spec-gate.js): the real plugin behind the link.
- [`../../../../.opencode/plugins/README.md`](../../../../.opencode/plugins/README.md): the plugin folder and its load rule.
