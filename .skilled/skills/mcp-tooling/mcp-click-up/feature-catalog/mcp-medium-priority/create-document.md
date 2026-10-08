---
title: "clickup_create_document"
description: "Create a ClickUp document in a space, folder, list, everything view or workspace."
trigger_phrases:
  - "clickup_create_document"
  - "create document"
  - "new clickup doc"
  - "create wiki"
version: 1.1.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_create_document

Create a ClickUp document in a space, folder, list, everything view or workspace.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_create_document` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Create a document in a ClickUp space, folder, or list. Requires name, parent info, visibility and create_page flag.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `name` | string | yes | Name and Title of the document |
| `parent` | object | yes | Parent container information |
| `visibility` | string (`PUBLIC`, `PRIVATE`, `PERSONAL`, `HIDDEN`) | yes | Document visibility setting |
| `create_page` | boolean | yes | Whether to create an initial blank page |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

All four of `name`, `parent`, `visibility` and `create_page` are required. `parent` is `{id, type}`, and `type` is a string: `"4"` space, `"5"` folder, `"6"` list, `"7"` everything, `"12"` workspace. `visibility` is `PUBLIC`, `PRIVATE`, `PERSONAL` or `HIDDEN`. This tool takes no content. Add text afterwards with `clickup_create_document_page` or `clickup_update_document_page`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y mcp-remote https://mcp.clickup.com/mcp` (stdio), OAuth sign-in, registered in `.utcp_config.json` |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/mcp-documents/create-document.md` | Manual | Scenario that exercises this tool |

---

## 4. SOURCE METADATA

- Group: MCP MEDIUM Priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-medium-priority/create-document.md`

Related references:
- [create-doc-page.md](../../feature-catalog/mcp-low-priority/create-doc-page.md): clickup_create_document_page
- [list-document-pages.md](../../feature-catalog/mcp-low-priority/list-document-pages.md): clickup_list_document_pages
