---
title: "clickup_get_document_pages"
description: "List all pages within a ClickUp document."
---

# clickup_get_document_pages

---

## 1. OVERVIEW

Returns all page objects within a document. Required: `doc_id`. Each page object includes `page_id`, `name`, and `content`.

---

## 2. CURRENT REALITY

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
- Feature file path: `13--mcp-low-priority/15-get-doc-pages.md`
