---
title: "Shared: Session Readers"
description: "The read-only session reader package: one exact-id reader per runtime, the shared failure envelope, the capability table and the projection to the HistoryEntry list."
trigger_phrases:
  - "session readers"
  - "read session history"
  - "session reader capabilities"
  - "exact session id reader"
version: 1.0.0.0
---

# Shared: Session Readers

---

## 1. OVERVIEW

This package reads one runtime session by its exact id. It returns the shared `HistoryEntry` list that the history lookup core takes. It never writes.

A caller names a runtime and one session id. No reader guesses the newest session or lists a store. `identity.mjs` rejects a separator, a NUL or a dot-only segment before it becomes a path.

Files are read and SQLite stores are opened with read-only flags. The side-effect suite hashes every store before and after a read. It compares bytes, size and modification time, so a stray write shows up.

`readSession` returns `{ ok: true, source, items }` or `{ ok: false, code }`. It never throws across the boundary and never returns a partial list. A projection defect becomes `store_unreadable`.

`index.mjs` exports `capabilities`, one row per runtime. Each row carries a `status`, a locator kind and a store root. A gated runtime also carries a `reason`. The dispatcher does not consult the table. The lookup CLI refuses a runtime whose `status` is not `ready`.

`loadSession` returns the raw neutral records. Claude, Pi, Devin and DSH also return `injected`, a list of `{ source, text }`. That list holds context a hook or runtime put into the session, which `records` never carries. `loadSession` passes `injected` through and `readSession` ignores it.

- Claude's `injected` source is `hook_additional_context`, one entry per hook context attachment.
- Pi's `injected` source is the entry's custom type, such as `session-start-context`. It falls back to `custom_message` when the entry carries none.
- Devin's `injected` source is `system` for a system node and `unflagged-user` for a user node without the input flag. The transcript fallback uses the step's own source.
- DSH's `injected` source is the event's source kind, such as `repo-guards`. It falls back to `unknown` when the event names none.

A failure is one of these codes.

| Code | Meaning |
|---|---|
| `locator_unavailable` | The id is empty, or the runtime has no locator to resolve. An unsafe id returns `session_mismatch`. |
| `capability_gated` | No reader exists for the runtime, or its switch is off. |
| `session_not_found` | No store record matches the id |
| `session_mismatch` | A record was found, but its recorded id or path does not match |
| `session_ambiguous` | More than one record claims the id |
| `store_unreadable` | The store could not be read or projected |
| `unsupported_format` | The journal holds no record shape the reader knows, so it fails instead of returning an empty session |

Vibe's reader is `ready`. It projects `harness.public-session-state/v1` and the completion records beside it. Its helpers are `loadVibeSession`, `lastAssistantText`, `turnToolCalls`, `compactionsSince` and `turnId`. `compactionsSince` returns the compactions after a watermark.

The reply comes from the current turn's completion record first. Vibe runs a `post_agent` hook before it appends the assistant message to the projection. A hook passes the payload's `transcript_path`, which is the session storage root. The journal is `<transcript_path>/journal/*.jsonl`.

An interactive session folds its journal into a snapshot generation at each quiet point. It restarts the journal after that generation. The reader starts from the generation `CURRENT` names and its projection chunks under `chunks/`. It then applies the journal tail after that generation's `snapshot_sequence`. A compaction folded into a snapshot carries the snapshot's sequence.

Cursor is the gated runtime. Its reader returns `capability_gated` while `SYSTEM_SESSION_READERS_CURSOR_ENABLED` is off. With the switch on it returns `locator_unavailable`, because no store path is proven yet.

Only Vibe registers hooks that call these readers. `.vibe/hooks.toml` runs `turn-start` as a `pre_agent` hook, `turn-end` as a `post_agent` hook and `compaction-post-tool` as a `post_tool` hook. The history lookup CLI calls `readSession` for any runtime whose `status` is `ready`.

The decision-capture sweeps write the queue. Six sweeps read their own store inline. The Vibe sweep calls `loadVibeSession`.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `index.mjs` | The dispatcher. It exports `readSession`, `loadSession` and `capabilities`. |
| `identity.mjs` | The shared guards. Safe ids, path containment and the recorded-id check. |
| `project.mjs` | The projection to `HistoryEntry`. It pairs each tool result with its call. |
| `claude.mjs` | Claude Code transcript reader. A `subagents` path returns `session_mismatch`. |
| `codex.mjs` | Codex rollout reader. The `session_meta` id outranks the file name. |
| `pi.mjs` | Pi reader. It follows the live branch, then the session log. Two candidates for one id return `session_ambiguous`. |
| `opencode.mjs` | OpenCode SQLite reader. When the caller names a folder, a different recorded directory returns `session_mismatch`. |
| `devin.mjs` | Devin `sessions.db` reader. A recorded folder at or below the named one passes. It falls back to the transcript file for a store without the session's turns. |
| `dsh.mjs` | DSH session log reader. A missing project folder returns `session_not_found`. |
| `vibe.mjs` | Vibe journal reader. A journal with no projection returns `unsupported_format`. |
| `cursor.mjs` | Cursor gate. It returns before touching any file. |
| `claude.d.mts` | The committed declaration for `claude.mjs`. |
| `claude.d.mts.map` | The source map for `claude.d.mts`. |
| `codex.d.mts` | The committed declaration for `codex.mjs`. |
| `codex.d.mts.map` | The source map for `codex.d.mts`. |
| `cursor.d.mts` | The committed declaration for `cursor.mjs`. |
| `cursor.d.mts.map` | The source map for `cursor.d.mts`. |
| `devin.d.mts` | The committed declaration for `devin.mjs`. |
| `devin.d.mts.map` | The source map for `devin.d.mts`. |
| `dsh.d.mts` | The committed declaration for `dsh.mjs`. |
| `dsh.d.mts.map` | The source map for `dsh.d.mts`. |
| `identity.d.mts` | The committed declaration for `identity.mjs`. |
| `identity.d.mts.map` | The source map for `identity.d.mts`. |
| `index.d.mts` | The committed declaration for `index.mjs`. |
| `index.d.mts.map` | The source map for `index.d.mts`. |
| `opencode.d.mts` | The committed declaration for `opencode.mjs`. |
| `opencode.d.mts.map` | The source map for `opencode.d.mts`. |
| `pi.d.mts` | The committed declaration for `pi.mjs`. |
| `pi.d.mts.map` | The source map for `pi.d.mts`. |
| `project.d.mts` | The committed declaration for `project.mjs`. |
| `project.d.mts.map` | The source map for `project.d.mts`. |
| `vibe.d.mts` | The committed declaration for `vibe.mjs`. |
| `vibe.d.mts.map` | The source map for `vibe.d.mts`. |

Each reader proves the session before it returns a record. Claude and Codex decide containment before they open a file. Pi and DSH compare the header's `cwd` with the named folder. Devin walks the main chain and, through each compaction's `summarized_from` link, the threads before it. OpenCode proves the session row before it selects a part.

---

## 3. VALIDATION

Run this from the repository root.

```bash
node --test .skilled/hooks/shared/tests/session-readers/
```

The matrix suite covers each runtime by store state. The projection suite validates every projected entry against the history core's published JSON Schema. The side-effect suite proves no read changes a store. The declaration suite rebuilds each `.d.mts` and compares it with the committed file.

---

## 4. RELATED

- [`../README.md`](../README.md): the shared hook helpers this package sits beside.
- [`../../session-handover/history/README.md`](../../session-handover/history/README.md): the lookup core and CLI that consume these readers.
