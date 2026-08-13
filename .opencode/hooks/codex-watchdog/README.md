---
title: "Codex Watchdog Hook: Codex Hook-Health Monitor"
description: "OpenCode plugin that watches Codex hook health and surfaces a warning when Codex hooks fail to fire or misbehave."
trigger_phrases:
  - "codex hooks watchdog"
  - "codex hook health"
importance_tier: "reference"
contextType: "reference"
---

# Codex Watchdog Hook: Codex Hook-Health Monitor

---

## 1. OVERVIEW

Index of the codex-watchdog concern (real code at `.opencode/plugins/mk-codex-hooks-watchdog.js`, mirrored here). The watchdog monitors whether Codex's hook wiring is firing as expected and surfaces a warning when Codex hooks are missing or misbehaving, so a silently broken Codex hook chain is caught rather than assumed healthy. It runs as an **OpenCode plugin** (the observing runtime) that watches the Codex configuration — an OpenCode-plugin-hosted concern with no adapter on the other runtimes.

Honors the `codex-watchdog` kill-switch (`isHookEnabled`; `MK_CODEX_WATCHDOG_DISABLED`, legacy `MK_CODEX_HOOKS_WATCHDOG_DISABLED`, or the master `MK_HOOKS_DISABLED`), default-on.

## 2. KEY FILES

| Runtime | Adapter |
|---|---|
| `opencode/` | `mk-codex-hooks-watchdog.js` (browsability symlink → `../../../plugins/`) |

## 3. BOUNDARIES

- **Advisory only, fail-open.** Emits a health warning; never blocks a turn, and any error resolves to a no-op.
- **Real code stays in `.opencode/plugins/`.** The entry here is a documentation-mirror symlink; the OpenCode loader globs `.opencode/plugins/`, not this tree.

## 4. RELATED

- [`../README.md`](../README.md) — the hub index and kill-switch model.
- [`../../plugins/README.md`](../../plugins/README.md) — the OpenCode plugins.
