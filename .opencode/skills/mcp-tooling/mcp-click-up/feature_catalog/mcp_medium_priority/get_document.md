---
title: "clickup_get_document"
description: "Get document details by document ID."
trigger_phrases:
  - "get document"
  - "clickup_get_document"
  - "fetch clickup doc"
  - "document metadata retrieval"
  - "read doc by id"
version: 1.0.0.3
importance_tier: "normal"
contextType: "implementation"
---

# clickup_get_document

Get document details by document ID.

> **Capability status: UNSUPPORTED.** A direct `list_tools()` inventory (`references/mcp_tools.md`) found no top-level get-document tool on the registered server; only document creation and document-pages tools were confirmed. Treat this card as an unsupported historical assumption until a fresh `tool_info()`/`list_tools()` capture confirms an exact callable name and schema.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Fetches a document's metadata: name, parent, created_at, updated_at, and content. Required: `doc_id`.

---

## 2. HOW IT WORKS

Returns document metadata. To get page content, use `clickup_get_document_pages` (LOW priority).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y @clickup/mcp-server` (stdio), `CLICKUP_API_KEY`+`CLICKUP_TEAM_ID` env vars, registered in `.utcp_config.json` |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: MCP MEDIUM Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `mcp-medium-priority/get-document.md`
Related references:
- [create-document.md](../mcp_medium_priority/create_document.md) — clickup_create_document
- [update-document.md](../mcp_medium_priority/update_document.md) — clickup_update_document
