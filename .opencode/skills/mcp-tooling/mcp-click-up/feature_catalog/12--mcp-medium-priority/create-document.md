---
title: "clickup_create_document"
description: "Create a ClickUp document with markdown or HTML content."
trigger_phrases:
  - "create document"
  - "clickup_create_document"
  - "new clickup doc"
  - "create doc with markdown"
  - "document creation mcp"
version: 1.0.0.3
---

# clickup_create_document

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Creates a new document. Required: `name`, `parent` (object with `type` and `id`). Optional: `content`, `content_format` (markdown or html). Parent type codes: 4=list, 5=folder, 6=space, 7=all, 12=workspace.

---

## 2. HOW IT WORKS

Returns the created document object with `doc_id`. Documents are the ONLY feature exclusively in the MCP — cupt cannot create or read documents.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `https://mcp.clickup.com/mcp` | MCP | Official ClickUp MCP via Code Mode, OAuth, mcp-remote bridge in .utcp_config.json |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: MCP MEDIUM Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `12--mcp-medium-priority/create-document.md`
Related references:
- [get-views.md](get-views.md) — clickup_get_views
- [get-document.md](get-document.md) — clickup_get_document
