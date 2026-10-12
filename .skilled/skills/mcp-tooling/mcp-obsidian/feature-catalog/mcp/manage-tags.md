---
title: "Manage note tags"
description: "Add, remove, or list note tags through the confirmed cyanheads obsidian_manage_tags MCP tool."
trigger_phrases:
  - "Manage note tags"
  - "obsidian_manage_tags"
  - "add or remove an Obsidian note tag"
version: 0.1.0.0
---

# Manage note tags (`obsidian_manage_tags`)

## 1. OVERVIEW

`obsidian_manage_tags` is a confirmed cyanheads MCP core tool for adding, removing, or listing tags on a live-vault note.

The current reference illustrates `path` and `add` inputs but marks argument shapes `VERIFY`. Confirm all read/write forms with `tool_info()` before execution.

---

## 2. HOW IT WORKS

The operator selects a live note, confirms the tool schema, applies a controlled tag mutation or listing request through Code Mode, and reads the result back. The operation is app-backed and depends on the Local REST API plugin, token, and running app.

When those prerequisites are unavailable, frontmatter editing through `notesmd-cli` is the headless alternative, but its exact flags are also `VERIFY`. The two surfaces should not be presented as identical APIs.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`SKILL.md`](../../SKILL.md) | Shared | Routes structured tag operations to MCP when the live prerequisites are present. |
| [`references/mcp-tools.md`](../../references/mcp-tools.md) | Shared | Confirms the tool identity and marks the representative argument shape. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/mcp-roundtrip/manage-tags.md`](../../manual-testing-playbook/mcp-roundtrip/manage-tags.md) | Manual playbook | Confirms schema, applies a controlled tag, and verifies the response. |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Reference | Handles authorization, connection, and tool-discovery failures. |

---

## 4. SOURCE METADATA

- Group: MCP medium priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp/manage-tags.md`

Related references:
- [`../mcp/get-note.md`](../mcp/get-note.md) — selects the note before tag work.
- [`../../feature-catalog/cli/edit-frontmatter.md`](../cli/edit-frontmatter.md) — headless metadata alternative.
