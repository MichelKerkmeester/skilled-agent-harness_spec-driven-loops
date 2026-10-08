---
title: "clickup_list_document_page_attachments"
description: "List the files and images embedded in a document page."
trigger_phrases:
  - "clickup_list_document_page_attachments"
  - "doc page attachments"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_list_document_page_attachments

List the files and images embedded in a document page.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_list_document_page_attachments` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

List metadata for files attached to a ClickUp doc page (images and files embedded in the page content).

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `page_id` | string | yes | ID of the doc page (e.g. 'ad-2675877'). In ClickUp doc URLs, the page_id is the second ID after /docs/ or /v/dc/. Use list_document_pages to discover page IDs. |
| `cursor` | string | no | Cursor from a previous response to fetch the next page of results. |
| `limit` | integer | no | Maximum number of attachments to return (1-100, default 50). |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Use the returned IDs with `clickup_download_document_page_attachment`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y mcp-remote https://mcp.clickup.com/mcp` (stdio), OAuth sign-in, registered in `.utcp_config.json` |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/` | Manual | No dedicated scenario. Confirm the call with `tool_info()` before first use |

---

## 4. SOURCE METADATA

- Group: MCP LOW Priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-low-priority/list-document-page-attachments.md`

Related references:
- [download-document-page-attachment.md](../../feature-catalog/mcp-low-priority/download-document-page-attachment.md): clickup_download_document_page_attachment
