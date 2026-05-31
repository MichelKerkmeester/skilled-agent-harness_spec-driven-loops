---
title: "clickup_update_document"
description: "Update an existing document's name or content."
---

# clickup_update_document

---

## 1. OVERVIEW

Modifies a document. Required: `doc_id`. Optional: `name`, `content`. Content update replaces the entire document body.

---

## 2. CURRENT REALITY

Content replacement is non-incremental — the full new content must be provided. Use `clickup_get_document` first to retrieve existing content before modifying.

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
- Feature file path: `12--mcp-medium-priority/17-update-document.md`
