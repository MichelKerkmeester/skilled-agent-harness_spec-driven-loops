---
title: "Session Lifecycle: Codex Adapters"
description: "Codex CLI session lifecycle index, with the TypeScript adapters that reshape Codex payloads and the built entrypoints for session start, stop and compact inject."
trigger_phrases:
  - "codex session lifecycle"
  - "codex session start hook"
  - "codex compact inject"
version: 1.0.0.0
---

# Session Lifecycle: Codex Adapters

---

## 1. OVERVIEW

`codex/` is an index of relative symlinks for the Codex CLI session lifecycle. Each `.ts` entry points into `.skilled/skills/system-spec-kit/runtime/hooks/codex/`, and each `.js` entry points into that skill's built `dist/hooks/codex/` folder. `.codex/hooks.json` runs the compiled files on `SessionStart`, `Stop` and `PreCompact`. The adapters reshape Codex input into the Claude shape, call the compiled Claude hooks through `runClaudeHookAdapter` and return the result in `emitCodexContext`.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`compact-inject.ts`](./compact-inject.ts) | Source for `PreCompact` | Link to the TypeScript adapter. Reads Codex stdin, delegates to `compact-inject.js` under a 2.8 second bound and caches the brief. | Fails open. |
| [`compact-inject.js`](./compact-inject.js) | `PreCompact` | Link to the built `dist/hooks/codex/compact-inject.js` entrypoint. | Fails open. |
| [`session-start.ts`](./session-start.ts) | Source for `SessionStart` | Link to the TypeScript adapter. Reshapes the payload with `readCodexHookInput`, delegates to `session-prime.js` and wraps the result with `emitCodexContext`. | Fails open. |
| [`session-start.js`](./session-start.js) | `SessionStart` | Link to the built `dist/hooks/codex/session-start.js` entrypoint. | Fails open. |
| [`session-stop.ts`](./session-stop.ts) | Source for `Stop` | Link to the TypeScript adapter. Delegates to `session-stop.js` under a 10 second bound. | Fails open. |
| [`session-stop.js`](./session-stop.js) | `Stop` | Link to the built `dist/hooks/codex/session-stop.js` entrypoint. | Fails open. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the per-runtime matrix and the build layout.
- [`../../../skills/system-spec-kit/runtime/hooks/codex/session-start.ts`](../../../skills/system-spec-kit/runtime/hooks/codex/session-start.ts): the SessionStart adapter source.
- [`../../../skills/system-spec-kit/runtime/dist/hooks/codex/`](../../../skills/system-spec-kit/runtime/dist/hooks/codex/): the built entrypoints.
