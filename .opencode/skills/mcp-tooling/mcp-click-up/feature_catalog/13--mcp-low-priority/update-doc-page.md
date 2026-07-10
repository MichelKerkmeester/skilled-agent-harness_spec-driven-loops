---
title: "clickup_update_document_page"
description: "Update the name or content of a specific document page."
trigger_phrases:
  - "update document page"
  - "clickup_update_document_page"
  - "edit doc page content"
  - "replace page body"
  - "document page content update"
version: 1.0.0.3
---

# clickup_update_document_page

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Modifies an existing document page. Required: `doc_id`, `page_id`. Optional: `name`, `content`. Content update replaces the entire page body.

---

## 2. HOW IT WORKS

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
- Feature file path: `13--mcp-low-priority/update-doc-page.md`
Related references:
- [create-doc-page.md](create-doc-page.md) — clickup_create_document_page
- [get-custom-fields.md](get-custom-fields.md) — clickup_get_custom_fields
