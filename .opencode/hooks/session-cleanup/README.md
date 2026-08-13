---
title: "Session Cleanup Hook: Startup Guards + Teardown"
description: "Index of the session-cleanup adapters that run bounded startup guards and teardown cleanup across the runtimes plus the OpenCode plugin."
trigger_phrases:
  - "session cleanup hook"
  - "startup guard teardown"
importance_tier: "reference"
contextType: "reference"
---

# Session Cleanup Hook: Startup Guards + Teardown

---

## 1. OVERVIEW

Index of the session-cleanup concern. The per-runtime shell adapters share one real script — `.opencode/scripts/session-cleanup.sh` — which runs bounded startup guards and teardown cleanup (sweeping stale runtime state) without writing into spec docs. OpenCode runs the same behavior through its plugin, `.opencode/plugins/session-cleanup.js`.

The hub holds relative symlinks; the shell script backs all four editor runtimes and the plugin backs OpenCode.

## 2. KEY FILES

| Runtime | Adapter |
|---|---|
| `claude/`, `codex/`, `cursor/`, `devin/` | `session-cleanup.sh` (symlink → `../../../scripts/session-cleanup.sh`) |
| `opencode/` | `session-cleanup.js` (symlink → `../../../plugins/session-cleanup.js`) |

## 3. BOUNDARIES

- **Bounded, fail-open.** Cleanup is time-bounded and never blocks session start; any error is a no-op.
- **No spec writes.** Sweeps runtime state only; never touches spec-folder docs.
- **Real code stays in `.opencode/scripts/` and `.opencode/plugins/`.** The hub entries are relative symlinks.

## 4. RELATED

- [`../README.md`](../README.md) — the hub index.
- [`../session-lifecycle/README.md`](../session-lifecycle/README.md) — the related session start/stop continuity hooks.
