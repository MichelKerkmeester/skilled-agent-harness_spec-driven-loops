---
title: "Session Lifecycle: Claude Adapters"
description: "Claude Code session lifecycle index, with the TypeScript source and the built entrypoint for session prime, session stop and compact inject."
trigger_phrases:
  - "claude session lifecycle"
  - "claude session prime"
  - "claude compact inject"
version: 1.0.0.0
---

# Session Lifecycle: Claude Adapters

---

## 1. OVERVIEW

`claude/` is an index of relative symlinks for the Claude Code session lifecycle. Each `.ts` entry points into `.skilled/skills/system-spec-kit/runtime/hooks/claude/`, and each `.js` entry points into that skill's built `dist/hooks/claude/` folder. `.claude/settings.json` runs the compiled files on `SessionStart`, `Stop` and `PreCompact`. The adapters inject recovery context or write continuity state, and they fail open on every error.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`compact-inject.ts`](./compact-inject.ts) | Source for `PreCompact` | Link to the TypeScript source. Builds the merged compact brief, runs the anti-feedback guard and caches the result to hook state. It writes no stdout on `PreCompact`. | Fails open. |
| [`compact-inject.js`](./compact-inject.js) | `PreCompact` | Link to the built `dist/hooks/claude/compact-inject.js` entrypoint that Claude runs. It caches the brief for the next `SessionStart` with source `compact`. | Fails open. |
| [`session-prime.ts`](./session-prime.ts) | Source for `SessionStart` | Link to the TypeScript source. Branches on `source` (`compact`, `startup`, `resume`, `clear`), validates the cached brief, applies the token budget and writes stdout after the handoff confirms. | Fails open. |
| [`session-prime.js`](./session-prime.js) | `SessionStart` | Link to the built `dist/hooks/claude/session-prime.js` entrypoint. | Fails open. |
| [`session-stop.ts`](./session-stop.ts) | Source for `Stop` | Link to the TypeScript source. Parses the transcript tail for usage, retargets the active spec folder, writes one atomic state update and runs a bounded context autosave. | Fails open. |
| [`session-stop.js`](./session-stop.js) | `Stop` | Link to the built `dist/hooks/claude/session-stop.js` entrypoint. | Fails open. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the per-runtime matrix and the build layout.
- [`../../../skills/system-spec-kit/runtime/hooks/claude/session-prime.ts`](../../../skills/system-spec-kit/runtime/hooks/claude/session-prime.ts): the canonical SessionStart source.
- [`../../../skills/system-spec-kit/runtime/dist/hooks/claude/`](../../../skills/system-spec-kit/runtime/dist/hooks/claude/): the built entrypoints.
