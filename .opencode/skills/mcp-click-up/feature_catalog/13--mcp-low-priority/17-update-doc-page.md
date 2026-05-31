---
title: "clickup_update_document_page"
description: "Update the name or content of a specific document page."
---

# clickup_update_document_page

---

## 1. OVERVIEW

Modifies an existing document page. Required: `doc_id`, `page_id`. Optional: `name`, `content`. Content update replaces the entire page body.

---

## 2. CURRENT REALITY

Always retrieve the current content with `clickup_get_document_pages` before overwriting to avoid data loss.

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
- Feature file path: `13--mcp-low-priority/17-update-doc-page.md`
