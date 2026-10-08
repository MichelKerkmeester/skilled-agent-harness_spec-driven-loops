---
title: "clickup_request_attachment_upload"
description: "Get upload details for attaching a local file of any size to a task."
trigger_phrases:
  - "clickup_request_attachment_upload"
  - "upload local file"
  - "large attachment"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_request_attachment_upload

Get upload details for attaching a local file of any size to a task.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_request_attachment_upload` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Get short-lived, structured upload details (upload URL, ticket, HTTP method, and multipart field name) to attach a LOCAL file (any size) to a task; follow the returned instructions to upload it with a native HTTP client. For small base64 payloads or web URLs, use attach_task_file instead.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `task_id` | string | yes | Task ID (supports custom IDs like 'DEV-1234') |
| `file_name` | string | no | Optional file name override (include the extension). Defaults to the local file's own name. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

The response gives an upload URL and form field. Upload with a plain HTTP client, outside Code Mode.

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
- Feature file path: `mcp-low-priority/request-attachment-upload.md`

Related references:
- [attach-task-file.md](../../feature-catalog/mcp-low-priority/attach-task-file.md): clickup_attach_task_file
