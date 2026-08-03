---
title: "Search notes"
description: "Search a live Obsidian vault through the confirmed cyanheads obsidian_search_notes MCP tool."
trigger_phrases:
  - "Search notes"
  - "obsidian_search_notes"
  - "search the live Obsidian vault"
version: 1.0.0.0
---

# Search notes (`obsidian_search_notes`)

## 1. OVERVIEW

`obsidian_search_notes` is a confirmed cyanheads MCP core tool for searching notes by name and/or content through the live app-backed surface.

The callable namespace is `obsidian.obsidian_search_notes`. Query and filter argument names remain `VERIFY` until `tool_info()` confirms the installed server signature.

---

## 2. HOW IT WORKS

The MCP server sends the search request through the Local REST API plugin in a running Obsidian app and returns structured results. This is the structured live-vault alternative to `notesmd-cli search` and `search-content`.

An empty result is valid. The operator checks the active vault, query spelling, and the headless search surface before treating it as a no-match result or routing elsewhere.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`SKILL.md`](../../SKILL.md) | Shared | Routes live structured search to MCP when the app and token are available. |
| [`references/mcp-tools.md`](../../references/mcp-tools.md) | Shared | Confirms the tool identity and live-app prerequisites. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/mcp-roundtrip/search-live-vault.md`](../../manual-testing-playbook/mcp-roundtrip/search-live-vault.md) | Manual playbook | Searches for a known marker in the live vault. |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Reference | Defines empty-result and connection recovery. |

---

## 4. SOURCE METADATA

- Group: MCP high priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp/search-notes.md`

Related references:
- [`get-note.md`](get-note.md) — reads a selected result.
- [`../../feature-catalog/cli/search-note-content.md`](../cli/search-note-content.md) — headless search alternative.
