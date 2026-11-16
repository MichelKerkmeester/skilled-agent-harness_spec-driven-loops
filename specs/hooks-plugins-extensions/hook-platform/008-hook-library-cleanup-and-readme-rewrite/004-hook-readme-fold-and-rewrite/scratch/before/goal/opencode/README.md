---
title: "Goal (OpenCode): Native Plugin Mirror"
description: "The browsability link back to OpenCode's native goal plugin, which keeps its own session files, token accounting, lifecycle events and guarded continuation."
trigger_phrases:
  - "opencode goal plugin"
  - "native goal tools"
  - "plugin mirror link"
version: 1.0.0.0
---

# Goal (OpenCode): Native Plugin Mirror

---

## 1. OVERVIEW

`goal/opencode/` holds one symlink. `opencode-goal.js` points to `../../../../.opencode/plugins/opencode-goal.js`. OpenCode's loader globs `.opencode/plugins/` with a flat pattern, so the real plugin must live there and nothing loads through this folder. The link keeps the hook tree navigable from the goal concern.

The plugin is a separate, larger implementation than the shared core. It keeps its own per-OpenCode-session files, fixed opaque SHA-256 state keys, token accounting, lifecycle events and guarded continuation. It also registers the native `/goal-opencode` tools, including `bind`, `resent` and `packet`, and its own verifier. What it shares with this tree is the kill switch, the state-directory contract, `lib/goal-slice.cjs` and `appendPacketLog` from `lib/goal-core.cjs`.

---

## 2. WHAT EACH FILE DOES

| File | Event | What it does | On error |
|---|---|---|---|
| `opencode-goal.js` | OpenCode plugin loader | Is a browsability link to `../../../../.opencode/plugins/opencode-goal.js`. The target registers the native goal tools and lifecycle behavior for each OpenCode session. | Not applicable. The file is never loaded from this folder, so a broken link affects browsing only. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern index, with the core and adapter matrix.
- [`./opencode-goal.js`](./opencode-goal.js): the mirror link itself.
- [`../../../../.opencode/plugins/opencode-goal.js`](../../../../.opencode/plugins/opencode-goal.js): the real plugin OpenCode loads.
- [`../goal-plugin.md`](../goal-plugin.md): the native plugin contract and its relationship to the core.
