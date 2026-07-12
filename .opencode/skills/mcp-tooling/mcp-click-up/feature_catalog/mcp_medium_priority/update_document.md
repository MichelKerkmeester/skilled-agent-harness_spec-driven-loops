---
title: "clickup_update_document"
description: "Update an existing document's name or content."
trigger_phrases:
  - "update document"
  - "clickup_update_document"
  - "edit clickup doc"
  - "replace document content"
  - "document content update"
version: 1.0.0.3
importance_tier: "normal"
contextType: "implementation"
---

# clickup_update_document

Update an existing document's name or content.

> **Capability status: UNSUPPORTED.** A direct `list_tools()` inventory (`references/mcp_tools.md`) found no top-level update-document tool on the registered server; only document creation and document-pages tools were confirmed. Treat this card as an unsupported historical assumption until a fresh `tool_info()`/`list_tools()` capture confirms an exact callable name and schema.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Modifies a document. Required: `doc_id`. Optional: `name`, `content`. Content update replaces the entire document body.

---

## 2. HOW IT WORKS

Content replacement is non-incremental — the full new content must be provided. Use `clickup_get_document` first to retrieve existing content before modifying.

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
- Feature file path: `mcp-medium-priority/update-document.md`
Related references:
- [get-document.md](../mcp_medium_priority/get_document.md) — clickup_get_document
- [time-tracking.md](../mcp_medium_priority/time_tracking.md) — clickup_manage_time_tracking
