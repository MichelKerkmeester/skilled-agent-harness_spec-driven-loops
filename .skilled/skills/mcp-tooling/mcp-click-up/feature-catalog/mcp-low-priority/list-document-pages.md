---
title: "clickup_list_document_pages"
description: "List the page tree of a document, names only."
trigger_phrases:
  - "clickup_list_document_pages"
  - "list doc pages"
  - "document structure"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_list_document_pages

List the page tree of a document, names only.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_list_document_pages` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

List page names and structure of a document (no content). Use get_document_pages to fetch full page content by page ID.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `document_id` | string | yes | ID of the document (e.g. 'ad-909705'). In ClickUp doc URLs the path is either /{workspace_id}/docs/{document_id} or /{workspace_id}/v/dc/{document_id}. The document_id is always the first ID after /docs/ or /v/dc/. |
| `max_page_depth` | number | no | Maximum depth of pages to retrieve (-1 for unlimited) |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Use it to find page IDs before `clickup_get_document_pages`. In a ClickUp doc URL the first ID after `/v/dc/` or `/docs/` is the document ID. A page missing from this list is missing or restricted, which also explains a `not_found_or_authorized` error from the read tool.

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
- Feature file path: `mcp-low-priority/list-document-pages.md`

Related references:
- [get-doc-pages.md](../../feature-catalog/mcp-low-priority/get-doc-pages.md): clickup_get_document_pages
