---
title: "Overlay Guard: OpenCode Plugin Link"
description: "Browsability link to the real OpenCode plugin, which throws on tool.execute.before when a write tool names a file a vendored tree's overlay owns."
trigger_phrases:
  - "opencode overlay guard"
  - "opencode overlay owned write"
  - "opencode plugin link"
version: 1.0.0.0
---

# Overlay Guard: OpenCode Plugin Link

---

## 1. OVERVIEW

`opencode/` holds one relative symlink. `overlay-guard.js` points to `../../../../.opencode/plugins/overlay-guard.js`, and OpenCode loads the real plugin from that folder through its flat plugin glob. Nothing loads through this link, it exists so the concern tree shows every runtime. The plugin runs on `tool.execute.before`, calls the same `../lib/overlay-guard.cjs` core with the project directory the plugin receives, and throws the engine's refusal line so OpenCode refuses the call. Notes go to a bounded rotated log, never to the console, because the OpenCode TUI paints console output onto the prompt line.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`overlay-guard.js`](./overlay-guard.js) | Symlink, `tool.execute.before` | Points at `.opencode/plugins/overlay-guard.js`. The target reads the file field and, for `patch` and `apply_patch`, every path the patch body names, then throws `new Error(result.reason)` when the core denies. | Fails open. A call it cannot judge is allowed and logged; a call naming no path is allowed without asking. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the decision table and the per-runtime matrix.
- [`../../../../.opencode/plugins/overlay-guard.js`](../../../../.opencode/plugins/overlay-guard.js): the real plugin.
- [`../lib/overlay-guard.cjs`](../lib/overlay-guard.cjs): the shared core behind the plugin.
- [`../tests/opencode-overlay-guard.test.mjs`](../tests/opencode-overlay-guard.test.mjs): the adapter tests, run against a vendored fixture tree.
