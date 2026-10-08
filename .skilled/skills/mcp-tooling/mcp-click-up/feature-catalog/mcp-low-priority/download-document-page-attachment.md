---
title: "clickup_download_document_page_attachment"
description: "Get a short-lived download URL for a document page attachment."
trigger_phrases:
  - "clickup_download_document_page_attachment"
  - "download doc attachment"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_download_document_page_attachment

Get a short-lived download URL for a document page attachment.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_download_document_page_attachment` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Download a ClickUp doc page attachment (get attachment IDs from clickup_list_document_page_attachments). Returns a short-lived download URL plus attachment metadata. IMPORTANT: the URL is short-lived and, on workspaces with private attachments enabled, single-use, it expires within ~5 minutes. Fetch it immediately and exactly once; do not preview, HEAD-request, retry, or store it. If a download fails or the URL expired, call this tool again for a fresh URL.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `page_id` | string | yes | ID of the doc page (e.g. 'ad-2675877'). In ClickUp doc URLs, the page_id is the second ID after /docs/ or /v/dc/. Use list_document_pages to discover page IDs. |
| `attachment_id` | string | yes | Attachment ID, the `id` field returned by clickup_list_document_page_attachments for the page. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

The URL expires quickly and can be single-use on workspaces with private attachments, so fetch it right away.

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
- Feature file path: `mcp-low-priority/download-document-page-attachment.md`

Related references:
- [list-document-page-attachments.md](../../feature-catalog/mcp-low-priority/list-document-page-attachments.md): clickup_list_document_page_attachments
