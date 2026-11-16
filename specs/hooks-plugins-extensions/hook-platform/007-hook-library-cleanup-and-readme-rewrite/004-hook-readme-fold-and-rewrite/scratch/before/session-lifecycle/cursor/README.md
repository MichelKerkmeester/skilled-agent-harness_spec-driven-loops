---
title: "Session Lifecycle: Cursor Adapters"
description: "Cursor session lifecycle index, with the TypeScript adapters for session start and session end plus a precompact proxy whose delivery is unconfirmed."
trigger_phrases:
  - "cursor session lifecycle"
  - "cursor session start hook"
  - "cursor precompact"
version: 1.0.0.0
---

# Session Lifecycle: Cursor Adapters

---

## 1. OVERVIEW

`cursor/` is an index of relative symlinks for the Cursor session lifecycle. Each `.ts` entry points into `.skilled/skills/system-spec-kit/runtime/hooks/cursor/`, and each `.js` entry points into that skill's built `dist/hooks/cursor/` folder. `.cursor/hooks.json` runs the compiled files on `sessionStart`, `sessionEnd` and `preCompact`. The `sessionEnd` adapter substitutes for `stop`, which does not fire under `cursor-agent -p`. The `preCompact` adapter is registered but its delivery is unconfirmed because no CLI compaction trigger was found.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`precompact.ts`](./precompact.ts) | Source for `preCompact` | Link to the TypeScript adapter. Reshapes the payload with `toClaudeShape` and delegates to `compact-inject.js`, which only caches. Delivery unconfirmed. | Fails open. |
| [`precompact.js`](./precompact.js) | `preCompact` | Link to the built `dist/hooks/cursor/precompact.js` entrypoint. Emits a plain allow envelope and relays no `agent_message`. | Fails open. |
| [`session-end.ts`](./session-end.ts) | Source for `sessionEnd` | Link to the TypeScript adapter. Substitutes for `stop`, reshapes the payload and delegates to `session-stop.js`. | Fails open. |
| [`session-end.js`](./session-end.js) | `sessionEnd` | Link to the built `dist/hooks/cursor/session-end.js` entrypoint. | Fails open. |
| [`session-start.ts`](./session-start.ts) | Source for `sessionStart` | Link to the TypeScript adapter. Reshapes the payload with `toClaudeShape` and delegates to `session-prime.js`. | Fails open. |
| [`session-start.js`](./session-start.js) | `sessionStart` | Link to the built `dist/hooks/cursor/session-start.js` entrypoint. Returns `permission: allow` with an `agent_message` when there is context. | Fails open. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the per-runtime matrix and the delivery caveats.
- [`../../../skills/system-spec-kit/runtime/hooks/cursor/session-start.ts`](../../../skills/system-spec-kit/runtime/hooks/cursor/session-start.ts): the SessionStart adapter source.
- [`../../../skills/system-spec-kit/runtime/dist/hooks/cursor/`](../../../skills/system-spec-kit/runtime/dist/hooks/cursor/): the built entrypoints.
