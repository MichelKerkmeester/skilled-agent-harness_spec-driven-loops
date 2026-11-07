---
title: "Session Lifecycle: Devin Adapters"
description: "Devin CLI session lifecycle index, with session start and stop adapters plus a bespoke post-compaction recovery chain in plain CommonJS."
trigger_phrases:
  - "devin session lifecycle"
  - "devin post compaction"
  - "devin session start hook"
version: 1.0.0.0
---

# Session Lifecycle: Devin Adapters

---

## 1. OVERVIEW

`devin/` is an index of relative symlinks for the Devin CLI session lifecycle. The `.ts` entries point into `.skilled/skills/system-spec-kit/runtime/hooks/devin/`, and the `.js` entries point into that skill's built `dist/hooks/devin/` folder. `.devin/hooks.v1.json` runs the files on `SessionStart`, `Stop` and `PostCompaction`. The post-compaction adapter is bespoke CommonJS with no build step because Devin fires after compaction with only a session id and a summary.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`post-compaction.cjs`](./post-compaction.cjs) | `PostCompaction` | Link to the bespoke adapter. Retains the summary, rehydrates spec-folder continuity, filters for provenance and length, and emits `hookSpecificOutput.additionalContext` directly. | Fails open. A missing payload or internal error emits nothing and exits 0. |
| [`session-start.ts`](./session-start.ts) | Source for `SessionStart` | Link to the TypeScript adapter. Reshapes the payload and delegates to `session-prime.js`, then emits through `emitDevinContext`. | Fails open. |
| [`session-start.js`](./session-start.js) | `SessionStart` | Link to the built `dist/hooks/devin/session-start.js` entrypoint. | Fails open. |
| [`session-stop.ts`](./session-stop.ts) | Source for `Stop` | Link to the TypeScript adapter. Reshapes the payload and delegates to `session-stop.js`. | Fails open. |
| [`session-stop.js`](./session-stop.js) | `Stop` | Link to the built `dist/hooks/devin/session-stop.js` entrypoint. | Fails open. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the per-runtime matrix and the build layout.
- [`../../../skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs`](../../../skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs): the real post-compaction adapter.
- [`../../../skills/system-spec-kit/runtime/dist/hooks/devin/`](../../../skills/system-spec-kit/runtime/dist/hooks/devin/): the built entrypoints.
