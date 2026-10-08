---
title: "clickup_create_document_page"
description: "Add a page, or a sub-page, to a document."
trigger_phrases:
  - "clickup_create_document_page"
  - "create doc page"
  - "add page to document"
version: 1.1.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_create_document_page

Add a page, or a sub-page, to a document.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_create_document_page` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Create a new page in a ClickUp document.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `document_id` | string | yes | ID of the document to create the page in (e.g. 'ad-909705'). In ClickUp doc URLs, the document_id is always the first ID after /docs/ or /v/dc/. |
| `content` | string | yes | Content of the page |
| `name` | string | yes | Name and title of the page |
| `sub_title` | string | no | Subtitle of the page |
| `parent_page_id` | string | no | ID of the parent page (if this is a sub-page) |
| `content_format` | string (`text/md`, `text/plain`) | no | The format of the page content |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

`document_id`, `name` and `content` are required. Use `content_format: "text/md"` for markdown and `parent_page_id` for a sub-page.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y mcp-remote https://mcp.clickup.com/mcp` (stdio), OAuth sign-in, registered in `.utcp_config.json` |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/mcp-documents/document-pages.md` | Manual | Scenario that exercises this tool |

---

## 4. SOURCE METADATA

- Group: MCP LOW Priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-low-priority/create-doc-page.md`

Related references:
- [update-doc-page.md](../../feature-catalog/mcp-low-priority/update-doc-page.md): clickup_update_document_page
