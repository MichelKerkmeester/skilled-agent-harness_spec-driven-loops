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
---

# clickup_get_document

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
| `https://mcp.clickup.com/mcp` | MCP | Official ClickUp MCP via Code Mode, OAuth, mcp-remote bridge in .utcp_config.json |

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
- [create-document.md](create-document.md) — clickup_create_document
- [update-document.md](update-document.md) — clickup_update_document
