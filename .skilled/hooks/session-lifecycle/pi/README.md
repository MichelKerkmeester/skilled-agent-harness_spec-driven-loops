---
title: "Session Lifecycle: Pi Extensions"
description: "Pi session lifecycle extensions for start, stop, post-compaction and startup advisories, discovered through the .pi/extensions links."
trigger_phrases:
  - "pi session lifecycle"
  - "pi session start context"
  - "pi compaction context"
version: 1.0.0.0
---

# Session Lifecycle: Pi Extensions

---

## 1. OVERVIEW

`pi/` holds the real Pi extensions for the session lifecycle. Pi discovers each one through the one-line entry file in `.pi/extensions/`, which re-exports it, so it loads from this folder and the imports are relative to that file's own folder. The start and stop extensions bridge to the compiled Claude hooks through `runClaudeHookAdapter`. The compaction extension is a native port of Devin's post-compaction chain, and the advisory extension runs the same warn-only startup guards the other runtimes use.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`session-start-context.ts`](./session-start-context.ts) | `session_start` | Maps the Pi reason to `startup` or `resume`, bridges `session-prime.js` under a 2800 ms bound and sends the context with `pi.sendMessage({ display: false })`. | Fails open. |
| [`session-stop-context.ts`](./session-stop-context.ts) | `session_shutdown` (reason `quit`) | Bridges `session-stop.js` under a 10 second bound. Fire-and-forget, with no context injection. | Fails open. |
| [`session-compact-context.ts`](./session-compact-context.ts) | `session_compact` | Reads `compactionEntry.summary` in process, rehydrates spec-folder continuity from the shared tmpdir state file and emits `additionalContext`. | Fails open. |
| [`session-start-advisories.ts`](./session-start-advisories.ts) | `session_start` | Runs the warn-only startup guards, each under its own concern switch, and surfaces warnings through `ctx.ui.notify`. | Fails open. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the per-runtime matrix.
- [`../../../skills/system-spec-kit/runtime/hooks/pi/session-start-context.ts`](../../../skills/system-spec-kit/runtime/hooks/pi/session-start-context.ts): the real start extension.
- [`../../../../.pi/extensions/`](../../../../.pi/extensions/): the links Pi discovers.
