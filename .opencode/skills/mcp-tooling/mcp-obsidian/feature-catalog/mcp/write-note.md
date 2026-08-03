---
title: "Write a note"
description: "Create or overwrite a live-vault note through the confirmed cyanheads obsidian_write_note MCP tool."
trigger_phrases:
  - "Write a note"
  - "obsidian_write_note"
  - "update a note through Obsidian MCP"
version: 1.0.0.0
---

# Write a note (`obsidian_write_note`)

## 1. OVERVIEW

`obsidian_write_note` is a confirmed cyanheads MCP core tool for creating or overwriting a note in the live vault.

The Code Mode callable form is `obsidian.obsidian_write_note`. The current reference uses `path` and `content` as representative inputs; verify the installed signature with `tool_info()` first.

---

## 2. HOW IT WORKS

The operator reads the current note before writing, constructs the new content, and sends the write through Code Mode to the live REST API-backed app. The write requires a running app, Local REST API v4.0.0+, API key, and registered `obsidian` manual.

Write operations should use an idempotent marker or a throwaway note in manual testing. If the app-backed prerequisites are missing, route the file-shaped task to `notesmd-cli create` or another confirmed headless operation.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`SKILL.md`](../../SKILL.md) | Shared | Selects MCP for structured live-app writes. |
| [`references/mcp-tools.md`](../../references/mcp-tools.md) | Shared | Defines the confirmed tool, namespace, prerequisites, and schema-verification rule. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/mcp-roundtrip/read-write-roundtrip.md`](../../manual-testing-playbook/mcp-roundtrip/read-write-roundtrip.md) | Manual playbook | Appends an idempotent section and reads it back. |
| [`../../examples/mcp-roundtrip.sh`](../../examples/mcp-roundtrip.sh) | Reference | Shows the documented chained read/write Code Mode pattern. |

---

## 4. SOURCE METADATA

- Group: MCP high priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp/write-note.md`

Related references:
- [`get-note.md`](get-note.md) — read-before-write counterpart.
- [`delete-note.md`](delete-note.md) — destructive live-vault mutation.
