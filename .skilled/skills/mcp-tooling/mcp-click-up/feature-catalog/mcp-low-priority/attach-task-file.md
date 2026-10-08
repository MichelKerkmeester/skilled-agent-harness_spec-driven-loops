---
title: "clickup_attach_task_file"
description: "Attach a small file or a web URL to a task."
trigger_phrases:
  - "clickup_attach_task_file"
  - "attach file to task"
  - "attach url"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_attach_task_file

Attach a small file or a web URL to a task.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_attach_task_file` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Attach file to task. Requires task_id. File sources: 1) base64 + filename (small files under ~200KB only), 2) URL (http/https). For files on the local machine, use request_attachment_upload instead.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `task_id` | string | yes | Task ID (supports custom IDs like 'DEV-1234') |
| `file_name` | string | no | Name of the file to be attached (include the extension). Required when using file_data. |
| `file_data` | string | no | Base64-encoded content of the file (without the data URL prefix). |
| `file_url` | string | no | URL to download the file from (must start with http:// or https://). |
| `auth_header` | string | no | Authorization header to use when downloading from the web URL. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Base64 content suits files under about 200 KB. For a local file of any size, use `clickup_request_attachment_upload`. `cupt attach add` also uploads local files.

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
- Feature file path: `mcp-low-priority/attach-task-file.md`

Related references:
- [request-attachment-upload.md](../../feature-catalog/mcp-low-priority/request-attachment-upload.md): clickup_request_attachment_upload
- [download-task-attachment.md](../../feature-catalog/mcp-low-priority/download-task-attachment.md): clickup_download_task_attachment
