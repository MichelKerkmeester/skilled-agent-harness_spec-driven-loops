---
title: "clickup_create_document_page"
description: "Add a new page to an existing ClickUp document."
trigger_phrases:
  - "create document page"
  - "clickup_create_document_page"
  - "add page to doc"
  - "new doc section"
  - "document sub-page creation"
version: 1.0.0.3
---

# clickup_create_document_page

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Creates a new page within a document. Required: `doc_id`, `name`. Optional: `content`, `content_format`. Returns `page_id`.

---

## 2. HOW IT WORKS

Pages are sub-sections of a document. Use to organize long documents into navigable sections.

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
- Feature file path: `13--mcp-low-priority/create-doc-page.md`
Related references:
- [get-doc-pages.md](get-doc-pages.md) — clickup_get_document_pages
- [update-doc-page.md](update-doc-page.md) — clickup_update_document_page
