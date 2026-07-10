---
title: "clickup_get_document_pages"
description: "List all pages within a ClickUp document."
trigger_phrases:
  - "get document pages"
  - "clickup_get_document_pages"
  - "list doc pages"
  - "document page listing"
  - "retrieve page ids from doc"
version: 1.0.0.3
---

# clickup_get_document_pages

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Returns all page objects within a document. Required: `doc_id`. Each page object includes `page_id`, `name`, and `content`.

---

## 2. HOW IT WORKS

Use after `clickup_create_document` to verify pages or before `clickup_update_document_page` to get page IDs.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `github.com/clickup/clickup-mcp-server` | MCP | Official ClickUp MCP via Code Mode |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: MCP LOW Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `13--mcp-low-priority/get-doc-pages.md`
Related references:
- [delete-checklist-item.md](delete-checklist-item.md) — clickup_delete_checklist_item
- [create-doc-page.md](create-doc-page.md) — clickup_create_document_page
