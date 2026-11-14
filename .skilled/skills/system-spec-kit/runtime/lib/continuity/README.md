---
title: "Continuity: Thin Record and Authored Snapshot"
description: "Thin continuity record parsing, validation and serialization, plus the authored snapshot writer that refreshes handover.md and implementation-summary.md."
trigger_phrases:
  - "thin continuity"
  - "continuity record"
  - "_memory.continuity"
  - "authored continuity snapshot"
---

# Continuity: Thin Record and Authored Snapshot

> Thin `_memory.continuity` parsing, validation, serialization, plus the snapshot writer that composes packet-local recovery markdown from it.

---

## 1. OVERVIEW

This folder owns the thin `_memory.continuity` record contract used in spec-folder markdown frontmatter, and the authored snapshot writer built on top of it. Together they parse frontmatter, validate compact recovery fields, normalize the record, enforce its byte budget, and refresh the recovery-context block embedded in a packet's `handover.md` and `implementation-summary.md`.

Current state:

- `thin-continuity-record.ts` defines and validates the record contract.
- `authored-continuity-snapshot.ts` composes a snapshot from the resume ladder plus the thin record and upserts it into packet-local markdown; it does not create memory rows or index mutations (its result always reports `createdMemoryRecords: 0` and `indexMutations: 0`).
- `decision-record-writer.ts` upserts operator decisions into `decision-record.md`, and `decision-table-matcher.ts` parses and matches those tables.
- The record keeps packet recovery compact with `packet_pointer`, timestamps, action fields, blockers, key files, optional `session_dedup`, optional `session_ref`, completion percentage and question IDs.
- `session_ref` is the writer-owned, pointer-only save field. It records `runtime`, `sessionId`, `workspace`, `savedAt`, `locatorKind` and `version`, and it never holds transcript text or a locator path.
- `packet_purpose` is an optional, writer-owned copy of the packet's purpose line, refreshed on every continuity write from `lib/spec/packet-purpose.ts`. `spec.md` stays its source. It leads the Goal facet, and an invalid value is dropped without failing the record.
- The byte budget is `THIN_CONTINUITY_MAX_BYTES`, currently `2048` bytes for the serialized `_memory.continuity` envelope.
- The canonical recovery ladder remains `handover.md` -> `_memory.continuity` -> spec docs. This folder owns the middle record format and the snapshot that keeps `handover.md` in sync with it.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                    lib/continuity/                               │
╰──────────────────────────────────────────────────────────────────╯

┌────────────────────┐      ┌─────────────────────────┐
│ resume ladder       │ ───▶ │ authored-continuity-    │
│ (lib/resume/)       │      │ snapshot.ts             │
└─────────────────────┘      └────────────┬────────────┘
                                           │
                                           ▼
┌────────────────────┐      ┌─────────────────────────┐
│ Markdown document  │ ───▶ │ extract frontmatter     │
│ spec folder docs   │      │ _memory.continuity      │
└─────────┬──────────┘      └────────────┬────────────┘
          │                              │
          │                              ▼
          │                    ┌───────────────────────┐
          │                    │ validate and normalize│
          │                    │ ThinContinuityRecord  │
          │                    └───────────┬───────────┘
          │                                │
          ▼                                ▼
┌────────────────────┐      ┌─────────────────────────┐
│ handover.md and    │ ◀─── │ serialize or upsert     │
│ implementation-    │      │ _memory.continuity YAML │
│ summary.md         │      │ and recovery snapshot   │
└────────────────────┘      └─────────────────────────┘

Canonical recovery ladder:
handover.md → _memory.continuity → spec docs
```

Dependency direction: `authored-continuity-snapshot.ts` imports the resume ladder module and the sibling `thin-continuity-record.ts`. `thin-continuity-record.ts` imports the Claude hook-state module for `HISTORY_LOCATOR_KINDS`, so the compaction locator and the save pointer share one locator-kind vocabulary.

---

## 3. PACKAGE TOPOLOGY

```text
continuity/
+-- authored-continuity-snapshot.ts  # Composes and upserts the recovery snapshot into handover.md / implementation-summary.md
+-- decision-record-writer.ts        # Upserts operator decisions into decision-record.md
+-- decision-table-matcher.ts        # Parses decision tables and matches queued decisions
+-- thin-continuity-record.ts        # Thin continuity types, validation, parsing, serialization, upsert helpers
`-- README.md                        # Folder orientation
```

Allowed dependency direction:

```text
resume and save code → lib/continuity/authored-continuity-snapshot.ts
lib/continuity/authored-continuity-snapshot.ts → lib/resume/resume-ladder.ts, lib/continuity/thin-continuity-record.ts
lib/continuity/thin-continuity-record.ts → hooks/claude/hook-state.ts (HISTORY_LOCATOR_KINDS) and local parsing and validation helpers
```

Disallowed dependency direction:

```text
lib/continuity/ → session state persistence
lib/continuity/ → resume ladder selection (it consumes the ladder, it does not build it)
lib/continuity/ → spec document indexing
```

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `thin-continuity-record.ts` | Defines `ThinContinuityRecord` and `ThinContinuitySessionRef`, validates compact fields, serializes the `_memory.continuity` envelope, reads records from markdown or objects, and upserts records into markdown frontmatter. |
| `authored-continuity-snapshot.ts` | Builds the resume ladder for a spec folder, derives continuity facets, and upserts the rendered recovery-context block into `handover.md` (always) and `implementation-summary.md` (when the record's continuity block needs an update). |
| `decision-record-writer.ts` | Upserts operator decisions into `decision-record.md` by id, keeping the table and the verbatim appendix without rewriting hand-authored content. |
| `decision-table-matcher.ts` | Parses hand-written decision tables and matches a queued decision against them. |
| `README.md` | This orientation page. |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Record ownership | `thin-continuity-record.ts` owns the shape and validation of `_memory.continuity`. |
| Snapshot ownership | `authored-continuity-snapshot.ts` owns the packet-local recovery snapshot; it reads the resume ladder but does not choose which spec folder is active. |
| Session ownership | Only validates the optional `session_dedup` and `session_ref` fields. It does not persist sessions. |
| Session reference | `session_ref` is save-only. The writer mints and carries it, and resume reads it only to drop a malformed object while the rest of the block still loads. No resume offer consumes it. |
| Frontmatter scope | Preserves existing frontmatter keys and replaces or inserts `_memory.continuity`. |
| Budget | Keeps the serialized continuity envelope within `THIN_CONTINUITY_MAX_BYTES`. |

Snapshot refresh flow:

```text
╭──────────────────────────────────────────╮
│ refreshAuthoredContinuitySnapshot(opts)  │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ resolve spec folder path on disk         │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ buildResumeLadder() from lib/resume/     │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ buildContinuityFacets() + render markdown│
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ upsert into handover.md and, when a      │
│ continuity block already exists, into    │
│ implementation-summary.md                │
╰──────────────────────────────────────────╯
```

Thin-record validation flow:

```text
╭──────────────────────────────────────────╮
│ markdown string or frontmatter object    │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ extractContinuityInput()                 │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ validateThinContinuityRecord()           │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ normalize fields and check invariants    │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ serializeEnvelope() and byte check       │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ validation result with record or errors  │
╰──────────────────────────────────────────╯
```

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `refreshAuthoredContinuitySnapshot(options)` | Function | Refreshes the recovery-context snapshot embedded in `handover.md` and, when applicable, `implementation-summary.md`. |
| `THIN_CONTINUITY_MAX_BYTES` | Constant | Maximum UTF-8 byte size for the serialized `_memory.continuity` envelope. |
| `ThinContinuityRecord` | Type | Canonical thin record shape for packet-local recovery context. |
| `ThinContinuitySessionRef` | Type | The six-key, writer-owned `session_ref` pointer stored beside `session_dedup`. |
| `SESSION_REF_RUNTIME_LOCATOR_KINDS` | Constant | The canonical runtime-to-locator-kind map. It spreads `HISTORY_LOCATOR_KINDS`, which includes `opencode: 'session-store'`, so the save pointer and the compaction locator use one map. |
| `validateThinContinuityRecord(input, options)` | Function | Normalizes and validates a continuity object, returning a record, YAML, byte count, or structured errors. |
| `readThinContinuityRecord(source, options)` | Function | Extracts and validates `_memory.continuity` from markdown text or a frontmatter object. |
| `serializeThinContinuityRecord(record, compactOptionalFields)` | Function | Serializes a validated record into the `_memory.continuity` YAML envelope. |
| `writeThinContinuityRecord(frontmatter, input, options)` | Function | Validates input and returns updated frontmatter with the continuity record merged in. |
| `upsertThinContinuityInMarkdown(markdown, input, options)` | Function | Validates input and returns markdown with updated frontmatter. |

---

## 7. VALIDATION

Run from the repository root unless noted.

```bash
python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/system-spec-kit/runtime/lib/continuity/README.md
```

Expected result: the README validation command exits with code `0`.

```bash
python3 .skilled/skills/sk-doc/scripts/extract_structure.py .skilled/skills/system-spec-kit/runtime/lib/continuity/README.md
```

Expected result: the extracted structure reports README sections and no critical documentation issues.

For code changes in this folder, run the TypeScript or package-level checks used by the runtime package before claiming runtime behavior changed.

---

## 8. RELATED

- [`../README.md`](../README.md)
- [`../resume/README.md`](../resume/README.md)
- [`../context/README.md`](../context/README.md)
