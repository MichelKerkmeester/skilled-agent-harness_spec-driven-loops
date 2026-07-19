---
title: "Continuity: Thin Record Contract"
description: "Thin continuity record parsing, validation, serialization, and frontmatter update helpers."
trigger_phrases:
  - "thin continuity"
  - "continuity record"
  - "_memory.continuity"
---

# Continuity: Thin Record Contract

> Thin `_memory.continuity` parsing, validation, serialization, and markdown frontmatter update helpers.

---

## 1. OVERVIEW

`lib/continuity/` owns the thin `_memory.continuity` record contract used in spec-folder markdown frontmatter. It parses frontmatter, validates compact recovery fields, normalizes the record, enforces the byte budget, and writes the record back into markdown without taking over resume orchestration.

Current state:

- `thin-continuity-record.ts` is the only implementation file in this folder.
- The record keeps packet recovery compact with `packet_pointer`, timestamps, action fields, blockers, key files, optional `session_dedup`, completion percentage, and question IDs.
- The byte budget is `THIN_CONTINUITY_MAX_BYTES`, currently `2048` bytes for the serialized `_memory.continuity` envelope.
- The canonical recovery ladder remains `handover.md` → `_memory.continuity` → spec docs. This folder owns the middle record format only.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                    lib/continuity/                               │
╰──────────────────────────────────────────────────────────────────╯

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
│ unchanged markdown │ ◀─── │ serialize or upsert     │
│ body content       │      │ _memory.continuity YAML │
└────────────────────┘      └─────────────────────────┘

Canonical recovery ladder:
handover.md → _memory.continuity → spec docs
```

Dependency direction: resume or save surfaces → `thin-continuity-record.ts` → markdown frontmatter parsing and serialization.

---

## 3. PACKAGE TOPOLOGY

```text
continuity/
+-- thin-continuity-record.ts  # Thin continuity types, validation, parsing, serialization, upsert helpers
`-- README.md                  # Folder orientation
```

Allowed dependency direction:

```text
resume and save code → lib/continuity/thin-continuity-record.ts
lib/continuity/thin-continuity-record.ts → local parsing and validation helpers
```

Disallowed dependency direction:

```text
lib/continuity/ → session state persistence
lib/continuity/ → resume ladder selection
lib/continuity/ → spec document indexing
```

---

## 4. DIRECTORY TREE

```text
continuity/
+-- thin-continuity-record.ts  # Record contract and markdown frontmatter helpers
`-- README.md                  # This file
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `thin-continuity-record.ts` | Defines `ThinContinuityRecord`, validates compact fields, serializes the `_memory.continuity` envelope, reads records from markdown or objects, and upserts records into markdown frontmatter. |

---

## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Record ownership | Owns the shape and validation of `_memory.continuity`. |
| Resume ownership | Does not choose active spec folders or traverse the full recovery ladder. |
| Session ownership | Only validates optional `session_dedup` fields. It does not persist sessions. |
| Frontmatter scope | Preserves existing frontmatter keys and replaces or inserts `_memory.continuity`. |
| Budget | Keeps the serialized continuity envelope within `THIN_CONTINUITY_MAX_BYTES`. |

Validation flow:

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

Write flow:

```text
upsertThinContinuityInMarkdown()
        │
        ▼
parse current frontmatter
        │
        ▼
writeThinContinuityRecord()
        │
        ▼
mergeFrontmatterWithContinuity()
        │
        ▼
markdown with updated _memory.continuity
```

---

## 7. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `THIN_CONTINUITY_MAX_BYTES` | Constant | Maximum UTF-8 byte size for the serialized `_memory.continuity` envelope. |
| `ThinContinuityRecord` | Type | Canonical thin record shape for packet-local recovery context. |
| `validateThinContinuityRecord(input, options)` | Function | Normalizes and validates a continuity object, returning a record, YAML, byte count, or structured errors. |
| `readThinContinuityRecord(source, options)` | Function | Extracts and validates `_memory.continuity` from markdown text or a frontmatter object. |
| `serializeThinContinuityRecord(record, compactOptionalFields)` | Function | Serializes a validated record into the `_memory.continuity` YAML envelope. |
| `writeThinContinuityRecord(frontmatter, input, options)` | Function | Validates input and returns updated frontmatter with the continuity record merged in. |
| `upsertThinContinuityInMarkdown(markdown, input, options)` | Function | Validates input and returns markdown with updated frontmatter. |

---

## 8. VALIDATION

Run from the repository root unless noted.

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/mcp-server/lib/continuity/README.md
```

Expected result: the README validation command exits with code `0`.

```bash
python3 .opencode/skills/sk-doc/scripts/extract_structure.py .opencode/skills/system-spec-kit/mcp-server/lib/continuity/README.md
```

Expected result: the extracted structure reports README sections and no critical documentation issues.

For code changes in this folder, run the TypeScript or package-level checks used by the MCP server before claiming runtime behavior changed.

---

## 9. RELATED

- [`../README.md`](../README.md)
- [`../resume/README.md`](../resume/README.md)
- [`../session/README.md`](../session/README.md)
- [`../routing/README.md`](../routing/README.md)
