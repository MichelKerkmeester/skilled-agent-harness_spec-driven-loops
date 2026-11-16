---
title: "Post-Edit Quality: OpenCode Plugin Link"
description: "Browsability link to the real OpenCode plugin, which correlates tool.execute.before and after by call ID and feeds findings into the next turn's system context."
trigger_phrases:
  - "opencode post edit quality"
  - "opencode quality plugin"
  - "opencode system context findings"
version: 1.0.0.0
---

# Post-Edit Quality: OpenCode Plugin Link

---

## 1. OVERVIEW

`opencode/` holds one relative symlink. `sk-code-post-edit-quality.js` points to `../../../../.opencode/plugins/sk-code-post-edit-quality.js`, and OpenCode loads the real plugin from that folder through its flat plugin glob. Nothing loads through this link. The plugin stashes the edited path on `tool.execute.before`, retrieves and evicts it on `tool.execute.after`, then drains buffered findings into the next turn through `experimental.chat.system.transform`. Findings also go to a rotated log at `.skilled/logs/post-edit-quality.log` with a 256 KB cap.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`sk-code-post-edit-quality.js`](./sk-code-post-edit-quality.js) | Symlink, `tool.execute.before` plus `tool.execute.after` | Points at `.opencode/plugins/sk-code-post-edit-quality.js`. The target watches `write`, `edit`, `patch`, `multiedit` and `apply_patch`, runs the shared router under a 4000 ms budget and a 3000 ms per-checker cap, and never writes stdout or stderr. | Fails open. The target never throws and never touches the TUI output channels. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the dispatch table and the per-runtime matrix.
- [`../../../../.opencode/plugins/sk-code-post-edit-quality.js`](../../../../.opencode/plugins/sk-code-post-edit-quality.js): the real plugin.
- [`../lib/post-edit-router.cjs`](../lib/post-edit-router.cjs): the shared router behind the plugin.
