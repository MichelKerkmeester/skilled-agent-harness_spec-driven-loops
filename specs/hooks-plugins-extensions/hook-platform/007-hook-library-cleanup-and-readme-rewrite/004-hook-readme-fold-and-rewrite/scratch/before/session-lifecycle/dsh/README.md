---
title: "Session Lifecycle: DSH Adapters"
description: "DSH session lifecycle index, with links to the session-prime, compaction, advisory and stop adapters loaded through the repo-guards bundle."
trigger_phrases:
  - "dsh session lifecycle"
  - "dsh session prime"
  - "dsh compaction context"
version: 1.0.0.0
---

# Session Lifecycle: DSH Adapters

---

## 1. OVERVIEW

`dsh/` is an index of relative symlinks for the DSH session lifecycle. Each entry points into `.skilled/skills/system-spec-kit/runtime/hooks/dsh/`, where the real adapters live. DSH loads them through `.dsh/plugins/repo-guards/adapters/`, and the bundle registers the four event handlers. The adapters prime a new session, re-prime after a completed compaction, run the warn-only startup guards and run the stop autosave. A fan-out leaf skips the startup guards and the stop autosave.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`session-start-context.mjs`](./session-start-context.mjs) | `agent/created` | Link to the adapter that runs `session-prime.js` with the event source or `startup`, then injects the output as a notice. | Fails open. |
| [`session-compact-context.mjs`](./session-compact-context.mjs) | `session/event` (`compaction/end`) | Link to the adapter that re-primes with source `compact`. A failed compaction carries `data.error` and gets nothing. | Fails open. |
| [`session-start-advisories.mjs`](./session-start-advisories.mjs) | `agent/created` (`startup`) | Link to the adapter that runs six warn-only guards from this checkout and injects one notice with their warnings. A fan-out leaf and a resumed session skip it. | Fails open. One failing guard is logged and the others still report. |
| [`session-stop-context.mjs`](./session-stop-context.mjs) | `agent/disposed` | Link to the adapter that runs `session-stop.js` with a Stop payload and injects nothing. A fan-out leaf skips it. | Fails open. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the per-runtime matrix.
- [`../../../skills/system-spec-kit/runtime/hooks/dsh/README.md`](../../../skills/system-spec-kit/runtime/hooks/dsh/README.md): the real adapters and their injection contract.
- [`../../../../.dsh/plugins/repo-guards/README.md`](../../../../.dsh/plugins/repo-guards/README.md): the bundle that loads these links.
