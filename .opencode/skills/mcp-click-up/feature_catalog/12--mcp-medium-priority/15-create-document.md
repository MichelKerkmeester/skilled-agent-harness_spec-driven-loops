---
title: "clickup_create_document"
description: "Create a ClickUp document with markdown or HTML content."
---

# clickup_create_document

---

## 1. OVERVIEW

Creates a new document. Required: `name`, `parent` (object with `type` and `id`). Optional: `content`, `content_format` (markdown or html). Parent type codes: 4=list, 5=folder, 6=space, 7=all, 12=workspace.

---

## 2. CURRENT REALITY

Returns the created document object with `doc_id`. Documents are the ONLY feature exclusively in the MCP — cupt cannot create or read documents.

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

- Group: MCP MEDIUM Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `12--mcp-medium-priority/15-create-document.md`
