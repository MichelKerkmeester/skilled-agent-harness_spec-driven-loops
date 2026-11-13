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

This package reads one runtime session by its exact id and returns it as the shared `HistoryEntry` list that the history lookup core takes. It never writes. A reader opens a store read-only, proves the file or row belongs to the requested session, and returns a failure code rather than a partial list.

The six decision-capture sweeps keep their own inline readers and remain the writers. Nothing here changes a save-time path.

---

## 2. CONTRACT

- **Exact id only.** A caller names a runtime and one session id. No reader guesses the newest session or lists a store.
- **Read-only.** Files are read and SQLite stores are opened with read-only flags. The side-effect suite checks that no read changes a store's bytes or modification time.
- **One envelope.** `readSession` returns `{ ok: true, source, items }` or `{ ok: false, code }`. It never throws across the boundary and never returns a partial list.
- **Capability is the caller's gate.** `index.mjs` exports `capabilities`, one row per runtime with its `status`, locator kind and store root, plus a `reason` when the runtime is gated. The dispatcher does not consult it. The compaction hooks and the lookup CLI check that a runtime is `ready` before they offer or read history.

`loadSession` returns the raw neutral records. Claude, Pi, Devin and DSH also return `injected`, a list of `{ source, text }` for context a hook or harness put into the session, which `records` never carries. `loadSession` passes `injected` through and `readSession` ignores it, so only a caller on the raw path sees what the harness added.

- Claude's `injected` source is `hook_additional_context`, one entry per hook context attachment.
- Pi's `injected` source is the entry's custom type, such as `session-start-context`, or `custom_message` when it carries none.
- Devin's `injected` source is `system` for a harness node and `unflagged-user` for a user node the harness wrote. The transcript fallback uses the step's own source.
- DSH's `injected` source is the event's source kind, such as `repo-guards`, or `unknown` when it names none.

Failure codes:

| Code | Meaning |
|---|---|
| `locator_unavailable` | The id is empty or unsafe, or the runtime has no locator to resolve |
| `capability_gated` | No reader exists for the runtime, or its switch is off |
| `session_not_found` | No store record matches the id |
| `session_mismatch` | A record was found, but its recorded id or path does not match |
| `session_ambiguous` | More than one record claims the id |
| `store_unreadable` | The store could not be read or projected |

---

## 3. FILES

| File | Role |
|---|---|
| `index.mjs` | The dispatcher: `readSession` (projected entries), `loadSession` (raw records), the `capabilities` table and the failure envelope |
| `identity.mjs` | Shared guards: safe session ids, path containment and the recorded-id check |
| `project.mjs` | Projection from neutral records to `HistoryEntry`, with tool-call pairing |
| `claude.mjs` | Claude Code transcript reader |
| `codex.mjs` | Codex session log reader |
| `pi.mjs` | Pi session log reader, following the live branch |
| `opencode.mjs` | OpenCode SQLite store reader, which proves the session's recorded directory when the caller names one |
| `devin.mjs` | Devin `sessions.db` reader over the session's main message chain and, through each compaction's `summarized_from` link, the threads before it. A recorded folder at or below the named folder passes, because Devin's hooks receive the project root. Falls back to the transcript file for a store without the session's turns |
| `dsh.mjs` | DSH session log reader |
| `cursor.mjs` | Cursor gate, which returns before touching any file |

---

## 4. VALIDATION

From the repository root:

```bash
node --test .skilled/hooks/shared/tests/session-readers/
```

The matrix suite covers each runtime by store state, and the schema check validates projected entries against the history core's published JSON Schema.

---

## 5. RELATED

- [`../README.md`](../README.md): the shared hook helpers this package sits beside.
- [`../../../skills/system-spec-kit/runtime/hooks/lib/history/README.md`](../../../skills/system-spec-kit/runtime/hooks/lib/history/README.md): the lookup core and CLI that consume these readers.
