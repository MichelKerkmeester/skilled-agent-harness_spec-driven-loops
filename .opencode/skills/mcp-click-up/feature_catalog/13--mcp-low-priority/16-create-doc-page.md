---
title: "clickup_create_document_page"
description: "Add a new page to an existing ClickUp document."
---

# clickup_create_document_page

---

## 1. OVERVIEW

Creates a new page within a document. Required: `doc_id`, `name`. Optional: `content`, `content_format`. Returns `page_id`.

---

## 2. CURRENT REALITY

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
- Feature file path: `13--mcp-low-priority/16-create-doc-page.md`
