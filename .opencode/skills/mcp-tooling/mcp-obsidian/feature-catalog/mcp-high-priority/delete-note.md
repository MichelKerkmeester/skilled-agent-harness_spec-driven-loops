---
title: "Delete a note via MCP"
description: "Delete a confirmed live-vault note through the cyanheads obsidian_delete_note MCP tool."
trigger_phrases:
  - "Delete a note via MCP"
  - "obsidian_delete_note"
  - "remove a live Obsidian note"
version: 1.0.0.0
---

# Delete a note via MCP (`obsidian_delete_note`)

## 1. OVERVIEW

`obsidian_delete_note` is a confirmed cyanheads MCP core tool for deleting a note through the live Local REST API-backed app.

It is destructive. The current package provides no documented undo operation, so manual runs must use a throwaway note and capture the exact path before deletion.

---

## 2. HOW IT WORKS

The operator finds and reads a disposable note, confirms the exact vault-relative path, calls `obsidian.obsidian_delete_note` after checking its signature with `tool_info()`, and then verifies the note is absent with `obsidian_get_note` or a search.

The operation requires the running app, Local REST API plugin v4.0.0+, API key, and registered manual. Without those prerequisites, use a headless disposable fixture and `notesmd-cli delete` instead.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`SKILL.md`](../../SKILL.md) | Shared | Applies preview and target-confirmation rules to destructive MCP writes. |
| [`references/mcp-tools.md`](../../references/mcp-tools.md) | Shared | Confirms the tool identity and failure modes. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/mcp-roundtrip/delete-throwaway-note.md`](../../manual-testing-playbook/mcp-roundtrip/delete-throwaway-note.md) | Manual playbook | Deletes only the note created by the round-trip scenario. |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Reference | Routes 404, connection, and authorization failures. |

---

## 4. SOURCE METADATA

- Group: MCP high priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-high-priority/delete-note.md`

Related references:
- [`get-note.md`](get-note.md) — read-back verification.
- [`../../feature-catalog/notesmd-cli-delete/delete-note.md`](../notesmd-cli-delete/delete-note.md) — headless destructive alternative.
