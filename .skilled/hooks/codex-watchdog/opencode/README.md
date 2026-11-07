---
title: "Codex Watchdog OpenCode Entry: Browsability Link"
description: "Browsability symlink to the OpenCode plugin that checks Codex hook health at session start and logs drift for the operator."
trigger_phrases:
  - "codex watchdog opencode entry"
  - "codex hooks watchdog link"
  - "codex hook drift check"
version: 1.0.0.0
---

# Codex Watchdog OpenCode Entry: Browsability Link

---

## 1. OVERVIEW

`hooks/codex-watchdog/opencode/` holds one browsability symlink to the real Codex hook watchdog plugin. The plugin runs on OpenCode and watches the Codex configuration, because Codex reads hooks from the user-global `~/.codex/hooks.json`, which can drift from the repository.

OpenCode's plugin loader globs `.opencode/plugins/` by a flat pattern, so the real file lives there and nothing loads through this folder. The link exists so the concern tree shows where the plugin sits.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `codex-hooks-watchdog.js` | Symlink to [`../../../../.opencode/plugins/codex-hooks-watchdog.js`](../../../../.opencode/plugins/codex-hooks-watchdog.js) | Link only. The target registers an OpenCode `event` handler for `session.created`, runs `install-codex-hooks.mjs --check` with a 5-second timeout and appends one remediation line to `.skilled/logs/codex-hooks-watchdog.log` when the check reports drift. | The target fails open. A missing installer, a spawn failure, a timeout or a log write failure resolves to a no-op. |

---

## 3. RELATED

- [`../README.md`](../README.md): the Codex watchdog concern, its switches and its validation commands.
- [`../../../../.opencode/plugins/codex-hooks-watchdog.js`](../../../../.opencode/plugins/codex-hooks-watchdog.js): the real plugin this folder links to.
- [`../../../bin/install-codex-hooks.mjs`](../../../bin/install-codex-hooks.mjs): the installer whose `--check` mode the plugin calls.
