---
title: "clickup_get_document_pages"
description: "Read the full content of chosen document pages."
trigger_phrases:
  - "clickup_get_document_pages"
  - "read doc page"
  - "get document pages"
version: 1.1.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_get_document_pages

Read the full content of chosen document pages.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_get_document_pages` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Get the full content of specific pages by page ID. Use list_document_pages first to discover available page IDs.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `document_id` | string | yes | ID of the document (e.g. 'ad-909705'). In ClickUp doc URLs the path is either /{workspace_id}/docs/{document_id}/{page_id} or /{workspace_id}/v/dc/{document_id}/{page_id}. The document_id is always the first ID after /docs/ or /v/dc/. |
| `page_ids` | array | yes | Array of page IDs to retrieve (e.g. ['ad-2675877']). In ClickUp doc URLs, the page_id is the second ID after /docs/ or /v/dc/. If the URL contains only one ID (e.g. /{workspace_id}/docs/{document_id}), that is the document_id, use list_document_pages to discover page IDs. |
| `content_format` | string (`text/plain`, `text/md`) | no | Response content format. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Pass `document_id` and `page_ids`, and set `content_format: "text/md"` for markdown. Find page IDs with `clickup_list_document_pages`. The server has no whole-document read tool, so a document is read page by page.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y mcp-remote https://mcp.clickup.com/mcp` (stdio), OAuth sign-in, registered in `.utcp_config.json` |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/mcp-documents/read-document-pages.md` | Manual | Scenario that exercises this tool |

---

## 4. SOURCE METADATA

- Group: MCP LOW Priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-low-priority/get-doc-pages.md`

Related references:
- [list-document-pages.md](../../feature-catalog/mcp-low-priority/list-document-pages.md): clickup_list_document_pages
- [update-doc-page.md](../../feature-catalog/mcp-low-priority/update-doc-page.md): clickup_update_document_page
