---
title: "Session Cleanup: OpenCode Plugin Link"
description: "Browsability link to the real OpenCode plugin, which runs startup guards and primary reconcile, injects their warnings once and runs the teardown script on dispose."
trigger_phrases:
  - "opencode session cleanup"
  - "opencode startup guards"
  - "opencode teardown plugin"
version: 1.0.0.0
---

# Session Cleanup: OpenCode Plugin Link

---

## 1. OVERVIEW

`opencode/` holds one relative symlink. `session-cleanup.js` points to `../../../../.opencode/plugins/session-cleanup.js`, and OpenCode loads the real plugin from that folder through its flat plugin glob. Nothing loads through this link. The plugin runs on `session.created` with `worktree-guard.sh`, `check-git-hooks.sh`, `git-live-follow.sh --start` and a detached `git-primary-reconcile.sh`, injects the captured warnings once through `experimental.chat.system.transform`, drops session state on `session.deleted`, and runs the teardown script on `dispose` with no session PID and the orphan sweep off.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`session-cleanup.js`](./session-cleanup.js) | Symlink, `session.created`, `session.deleted`, `dispose` | Points at `.opencode/plugins/session-cleanup.js`. The target bounds each subprocess to 8000 ms and 4 KiB of captured output, and writes to the shared bounded log instead of the TUI. | Failures are no-ops. The plugin never writes stdout or stderr, so a guard or teardown failure cannot affect the TUI. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the startup guard list and configuration.
- [`../../../../.opencode/plugins/session-cleanup.js`](../../../../.opencode/plugins/session-cleanup.js): the real plugin.
- [`../../../scripts/session-cleanup.sh`](../../../scripts/session-cleanup.sh): the teardown script the plugin runs on `dispose`.
