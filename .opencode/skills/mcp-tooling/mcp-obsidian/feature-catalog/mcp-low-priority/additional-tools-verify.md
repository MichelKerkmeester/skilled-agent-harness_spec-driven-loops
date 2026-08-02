---
title: "Remaining cyanheads tools (VERIFY)"
description: "Record the current nine-tool enumeration boundary without inventing unconfirmed MCP tool names or behavior."
trigger_phrases:
  - "Remaining cyanheads tools"
  - "enumerate Obsidian MCP tools"
  - "verify the remaining obsidian tools"
version: 1.0.0.0
---

# Remaining cyanheads tools (VERIFY)

## 1. OVERVIEW

The cyanheads `obsidian-mcp-server` reference reports 14 `obsidian_*` tools total, but only five names are enumerated in the current package: `obsidian_get_note`, `obsidian_write_note`, `obsidian_search_notes`, `obsidian_manage_tags`, and `obsidian_delete_note`.

The remaining nine names, signatures, and capability groupings are not confirmed. This card is an explicit inventory boundary, not a claim that any particular unenumerated feature exists.

---

## 2. HOW IT WORKS

Once the `obsidian` manual is reachable, run `list_tools()` and confirm each candidate with `tool_info("obsidian.obsidian_<tool_name>")`. Only after that inspection should a narrower catalog card or executable scenario be added.

Until enumeration is available, route known structured note work only to the five confirmed core tools. Do not infer a missing capability from a generic description or from a different Obsidian MCP package.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`mcp-servers/obsidian-mcp/README.md`](../../mcp-servers/obsidian-mcp/README.md) | Shared | Records the 14-tool server surface and the mandatory discovery step. |
| [`references/mcp-tools.md`](../../references/mcp-tools.md) | Shared | Separates five confirmed names from nine unenumerated tools. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/mcp-verification/tool-inventory.md`](../../manual-testing-playbook/mcp-verification/tool-inventory.md) | Manual playbook | Enumerates the live server and records confirmed callable names. |
| [`../../mcp-servers/obsidian-mcp/README.md`](../../mcp-servers/obsidian-mcp/README.md) | Reference | Provides `list_tools()` and `tool_info()` verification checkpoints. |

---

## 4. SOURCE METADATA

- Group: MCP low priority / verification boundary
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-low-priority/additional-tools-verify.md`

Related references:
- [`../mcp-high-priority/get-note.md`](../mcp-high-priority/get-note.md) — confirmed callable example.
- [`../../references/mcp-tools.md`](../../references/mcp-tools.md) — current inventory boundary and invocation rules.
