---
title: "Get a note"
description: "Read a live-vault note through the confirmed cyanheads obsidian_get_note MCP tool."
trigger_phrases:
  - "Get a note"
  - "obsidian_get_note"
  - "read a note through Obsidian MCP"
version: 1.0.0.0
---

# Get a note (`obsidian_get_note`)

## 1. OVERVIEW

`obsidian_get_note` is one of the five confirmed cyanheads MCP core tools. It reads a note and its metadata from a live vault through the Local REST API-backed server.

The Code Mode callable form is `obsidian.obsidian_get_note`. Confirm the exact input schema with `tool_info()` before hardcoding a call; `path` is representative in the current reference.

---

## 2. HOW IT WORKS

The operator needs a running Obsidian app with the Local REST API plugin v4.0.0+ enabled, a bearer token, and the `obsidian` manual registered. Code Mode calls the hierarchical `obsidian.obsidian_get_note` function and returns structured data rather than terminal text.

If the app, API, token, or manual is unavailable, the router should switch to `notesmd-cli print` for a filesystem read. A missing note is a 404-style path problem, not evidence that a new note should be fabricated.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`SKILL.md`](../../SKILL.md) | Shared | Routes structured live-app reads to MCP when all prerequisites are present. |
| [`references/mcp-tools.md`](../../references/mcp-tools.md) | Shared | Confirms the tool name, namespace, prerequisites, and schema-verification rule. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/mcp-roundtrip/read-write-roundtrip.md`](../../manual-testing-playbook/mcp-roundtrip/read-write-roundtrip.md) | Manual playbook | Reads a controlled note as the first half of a live MCP round-trip. |
| [`../../examples/mcp-roundtrip.sh`](../../examples/mcp-roundtrip.sh) | Reference | Prints the documented Code Mode read/write pattern and preflights the REST API. |

---

## 4. SOURCE METADATA

- Group: MCP high priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-high-priority/get-note.md`

Related references:
- [`write-note.md`](write-note.md) — structured write counterpart.
- [`search-notes.md`](search-notes.md) — live-vault retrieval by query.
