---
title: "clickup_update_document_page"
description: "Rename a page or change its content, by replacing, appending or prepending."
trigger_phrases:
  - "clickup_update_document_page"
  - "update doc page"
  - "append to page"
  - "rename page"
version: 1.1.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_update_document_page

Rename a page or change its content, by replacing, appending or prepending.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_update_document_page` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Update a page in a ClickUp document. Use content_edit_mode to control how content is applied: append/prepend merge with the existing page server-side and preserve it exactly, no need to read the page first. The default is 'replace', which overwrites the whole page. If appended content should start on its own line, include a leading newline; if prepended content should end on its own line, include a trailing newline.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `document_id` | string | yes | ID of the document containing the page (e.g. 'ad-909705'). In ClickUp doc URLs, the document_id is always the first ID after /docs/ or /v/dc/. |
| `page_id` | string | yes | ID of the page to update (e.g. 'ad-2675877'). In ClickUp doc URLs, this is the second ID after /docs/ or /v/dc/. |
| `name` | string | no | New name for the page |
| `sub_title` | string | no | New subtitle for the page |
| `content` | string | no | New content for the page (must be non-empty; clearing a page is not supported). By default this REPLACES the entire existing page content, set content_edit_mode to 'append' or 'prepend' to add to the page instead of overwriting it. |
| `content_edit_mode` | string (`replace`, `append`, `prepend`) | no | How to apply `content`: 'append' adds it at the end of the existing page, 'prepend' inserts it before the existing content, 'replace' (default) OVERWRITES the entire page, existing content is lost. Ignored when `content` is not provided. |
| `content_format` | string (`text/md`, `text/plain`) | no | The format of the page content |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

The default `content_edit_mode` is `replace`, which overwrites the whole page. Read the page before a replace when it may hold content. `append` and `prepend` keep what is there. Content cannot be empty. ClickUp's markdown import has traps worth knowing: file names ending in `.md` become links unless they are in backticks, and a numbered list after a heading restarts at 1.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y mcp-remote https://mcp.clickup.com/mcp` (stdio), OAuth sign-in, registered in `.utcp_config.json` |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/mcp-documents/update-document-page.md` | Manual | Scenario that exercises this tool |

---

## 4. SOURCE METADATA

- Group: MCP LOW Priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-low-priority/update-doc-page.md`

Related references:
- [get-doc-pages.md](../../feature-catalog/mcp-low-priority/get-doc-pages.md): clickup_get_document_pages
