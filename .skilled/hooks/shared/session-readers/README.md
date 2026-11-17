---
title: "Session Readers: Read One Session by Exact Id"
description: "The read-only session reader package: one exact-id reader per runtime, the shared failure envelope, the capability table and the projection to the HistoryEntry list."
trigger_phrases:
  - "session readers"
  - "read session history"
  - "session reader capabilities"
  - "exact session id reader"
version: 1.0.0.0
---

# Session Readers: Read One Session by Exact Id

---

## 1. OVERVIEW

`session-readers/` reads one runtime session by its exact id and returns the shared `HistoryEntry` list that the history lookup core accepts. It never writes.

A caller names a runtime and one session id. No reader guesses the newest session or lists a store. `identity.mjs` rejects a separator, a NUL, an empty id or a dot-only segment before the id becomes a path segment.

Current state:

- A reader that receives a file path inside a runtime store proves the path sits inside that store, then reads the resolved path. The Vibe reader receives the session folder itself and reads its journal from there.
- Files are read. SQLite stores are opened with read-only flags.
- `readSession` returns `{ ok: true, source, items }` or `{ ok: false, code }`. It never throws across the boundary and never returns a partial list.
- `loadSession` returns the raw neutral records. A runtime that carries injected context also returns it in `injected`.

---

## 2. ARCHITECTURE

`index.mjs` is the only entry point a caller needs. It checks the id, picks the reader for the named runtime and passes the neutral records to `project.mjs`. `identity.mjs` holds the id and path guards every reader except Cursor and Vibe calls. No reader imports another reader.

```text
╭──────────────────────────────────────────────────────────────────────────────╮
│                               session-readers                                │
╰──────────────────────────────────────────────────────────────────────────────╯

┌──────────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│ history lookup CLI   │    │ index.mjs            │    │ runtime module       │
│                      │    │ readSession          │    │ one file per runtime │
└──────────────────────┘    └───────────┬──────────┘    └───────────┬──────────┘
                                        │                           │
                                        ▼                           ▼

                            ┌──────────────────────┐    ┌──────────────────────┐
                            │ project.mjs          │    │ identity.mjs         │
                            │ HistoryEntry list    │    │ id and path guards   │
                            └──────────────────────┘    └──────────────────────┘

Dependency direction: index.mjs ──▶ runtime module
Runtime module ──▶ project.mjs and identity.mjs (Vibe uses project.mjs only)
```

Each runtime reader exports its loader. A reader that resolves its own store also exports its store-root helper, and that helper accepts a caller override before it falls back to the runtime environment variable or the home folder.

### Runtime coverage

`index.mjs` exports `capabilities`, one frozen row per runtime. The dispatcher does not consult the table. The history lookup CLI checks a row before it reads.

| Runtime | Status | Locator kind | Store root |
|---|---|---|---|
| Claude Code | `ready` | `transcript_path` | `~/.claude/projects` |
| Codex | `ready` | `transcript_path` | `$CODEX_HOME/sessions` |
| Pi | `ready` | `live_branch_or_session_log` | `~/.pi/agent/sessions` |
| OpenCode | `ready` | `session-store` | `$XDG_DATA_HOME/opencode/opencode.db` |
| Devin | `ready` | `transcript_file` | `$XDG_DATA_HOME/devin/cli/sessions.db` |
| DSH | `ready` | `session_log` | `$DSH_HOME/sessions` |
| Cursor | `gated` | `capability_flag` | `(unconfirmed)` |
| Vibe | `ready` | `transcript_path` | `$VIBE_HOME/logs/session/unified/<session_id>` |

Cursor is the gated runtime. Its reader returns `capability_gated` while `SYSTEM_SESSION_READERS_CURSOR_ENABLED` is off. With the switch on it returns `locator_unavailable`, because no store path is proven yet.

---

## 3. FILES

Every file in this folder sits at one level. Each runtime reader has a committed declaration and a source map beside it.

| File | Responsibility |
|---|---|
| `index.mjs` | The dispatcher. It exports `readSession` and `loadSession`. It also exports `capabilities`. |
| `identity.mjs` | The shared guards: session id shape, path containment, recorded id and real path comparison. |
| `project.mjs` | The projection to `HistoryEntry`, including the tool call and result pairing rule. |
| `claude.mjs` | Claude Code transcript reader. A path under a `subagents` folder returns `session_mismatch`. |
| `codex.mjs` | Codex rollout reader. The `session_meta` payload id outranks the file name. |
| `pi.mjs` | Pi reader. It reads the live branch in process, then the session log on disk. |
| `opencode.mjs` | OpenCode SQLite reader. A named project folder must match the session row's `directory` when the table carries one. |
| `devin.mjs` | Devin `sessions.db` reader. A session with no turn rows falls back to its transcript file. |
| `dsh.mjs` | DSH session log reader. It decodes the Zstandard frame chain before it reads events. |
| `vibe.mjs` | Vibe journal reader, with the reply, tool call, compaction and turn helpers. |
| `cursor.mjs` | The Cursor gate. It returns before it touches any file. |
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

Each reader checks the recorded id when the caller names one. Claude Code and Codex decide containment before they open a file. Pi and DSH compare the header `cwd` with the named folder. Devin walks the main chain and, through each compaction `summarized_from` link, the threads before it. OpenCode proves the session row before it selects a part.

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | `index.mjs` imports every reader and `project.mjs`. The Claude, Codex, Devin, DSH, OpenCode and Pi readers import `identity.mjs` and `project.mjs`. The Vibe reader imports `project.mjs` only, and `cursor.mjs` reads `../hook-flags.cjs`. Everything else is a Node built-in. |
| Exports | `index.mjs` exports the dispatcher. Each runtime file exports its loader, plus a store-root helper where it resolves its own store. |
| Ownership | One runtime per file. Knowledge of a store layout stays in that runtime's file. |
| Writes | None. A read touches nothing writable. Database handles open read-only. |

Main flow:

```text
╭────────────────────────────────────────────╮
│ caller names a runtime and one id          │
╰────────────────────────────────────────────╯
                      │
                      ▼
┌────────────────────────────────────────────┐
│ dispatcher checks the id is not empty      │
└────────────────────────────────────────────┘
                      │
                      ▼
┌────────────────────────────────────────────┐
│ reader opens its runtime store             │
└────────────────────────────────────────────┘
                      │
                      ▼
┌────────────────────────────────────────────┐
│ reader returns the neutral records         │
└────────────────────────────────────────────┘
                      │
                      ▼
┌────────────────────────────────────────────┐
│ projectEntries pairs results with calls    │
└────────────────────────────────────────────┘
                      │
                      ▼
╭────────────────────────────────────────────╮
│ HistoryEntry list or a failure code        │
╰────────────────────────────────────────────╯
```

`readSession` turns a projection defect into `store_unreadable`, so a caller never receives a partial conversation. A failure is one of these codes.

| Code | Meaning |
|---|---|
| `locator_unavailable` | The id is empty or the runtime has no locator to resolve. An unsafe id returns `session_mismatch`. |
| `capability_gated` | No reader exists for the runtime or its switch is off. |
| `session_not_found` | No store record matches the id. |
| `session_mismatch` | A record was found, but its recorded id or path does not match. |
| `session_ambiguous` | More than one record claims the id. |
| `store_unreadable` | The store could not be read or projected. For Devin, an open or projection failure falls back to the transcript first, so this code means the transcript failed too. |
| `unsupported_format` | The journal holds no record shape the reader knows, so the read fails instead of returning an empty session. |

Four runtimes also report context that a hook or the runtime added to the session, apart from the operator turns.

- Claude Code reports an attachment entry of type `hook_additional_context`, one entry per attachment.
- Pi reports the entry custom type such as `session-start-context` and falls back to `custom_message`.
- Devin reports `system` for a system node and `unflagged-user` for a user node without the input flag. The transcript fallback uses the step's own source.
- DSH reports the event source kind such as `repo-guards` and falls back to `unknown`. A `user/message` with no source stays injected and never becomes a record.

The Vibe store adds one layer. An interactive session folds its journal into a snapshot generation at each quiet point, then restarts the journal. The reader starts from the generation that the `CURRENT` file names and its chunk files, then applies the journal tail after that generation's `snapshot_sequence`. A compaction folded into a snapshot keeps the snapshot's sequence.

The history package CLI at `../../session-handover/history/lib/cli.ts` is the only hook that calls the dispatcher. The skill advisor's routing-accuracy scripts call it as well. It refuses a runtime whose capability `status` is not `ready`.

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `readSession` | Function | Resolve one session and return the projected `HistoryEntry` list. |
| `loadSession` | Function | Resolve one session and return its raw neutral records, with `injected` when the runtime carries it. |
| `capabilities` | Constant | One row per runtime: `status`, `locatorKind`, `storeRoot` and a `reason` on the gated row. |
| Per-runtime loaders | Functions | `loadClaudeSession`, `loadCodexSession`, `loadPiSession`, `loadOpenCodeSession`, `loadDevinSession`, `loadDshSession`, `loadCursorSession` and `loadVibeSession`. |
| Store-root helpers | Functions | `claudeStoreRoot`, `codexStoreRoot`, `piStoreRoot`, `openCodeStoreRoot`, `dshStoreRoot` and `devinDataDirectory`, plus `devinTranscriptRoot`, `openCodeDatabasePath` and `devinDatabasePath`. |
| `projectEntries` | Function | Pair each tool result with its call and fail the whole read on a broken pairing. |
| `guardSessionPath` | Function | Prove the id shape and the path containment, then compare the recorded id. |
| `resolveInside` | Function | Resolve both spellings and refuse a path that leaves the store. |
| `lastAssistantText` | Function | Return the reply of the session's current turn from a Vibe session. |
| `turnToolCalls` | Function | Return the current turn's tool calls in the order they started. |
| `compactionsSince` | Function | Return the compactions after a journal watermark. |
| `turnId` | Function | Return the session's current turn id, which a retry keeps. |

`loadVibeSession` accepts the hook payload's `transcript_path`, which is the session storage root, then returns its entries, records, journal records and turn id beside the shared envelope.

---

## 6. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/shared/tests/session-readers/
```

Expected result: the run ends with `ℹ pass 109` and `ℹ fail 0`.

The matrix suite covers seven runtimes by store state, and the Vibe reader suite covers Vibe. The projection suite checks every projected entry against the history core's published JSON Schema. The side-effect suite hashes each store file before and after a read, then compares the full folder listing. The declaration suite rebuilds each committed declaration and compares it with the file on disk. The injected text suite covers the context a runtime adds to a turn. The Vibe reader suite covers the journal, the snapshot, the compaction lookup and the reply helpers.

---

## 7. RELATED

- [Hook adapter helpers](../README.md): the shared hook plumbing this package sits beside.
- [History lookup core](../../session-handover/history/README.md): the engine and CLI that consume these readers.
- [Hooks library](../../README.md): the full hook folder map.
- [Decision capture sweeps](../../decision-capture/bin/README.md): the sweep that reads Vibe journals through `vibe.mjs`.
