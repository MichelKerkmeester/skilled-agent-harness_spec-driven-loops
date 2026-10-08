---
title: "clickup_download_task_attachment"
description: "Get a short-lived download URL for a task attachment."
trigger_phrases:
  - "clickup_download_task_attachment"
  - "download task attachment"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_download_task_attachment

Get a short-lived download URL for a task attachment.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_download_task_attachment` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Download a ClickUp task attachment (get attachment IDs from clickup_get_task with include: ["attachments"]). Returns a short-lived download URL plus attachment metadata. IMPORTANT: the URL is short-lived and, on workspaces with private attachments enabled, single-use, it expires within ~5 minutes. Fetch it immediately and exactly once; do not preview, HEAD-request, retry, or store it. If a download fails or the URL expired, call this tool again for a fresh URL.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `task_id` | string | yes | Task ID (supports custom IDs like 'DEV-1234') |
| `attachment_id` | string | yes | Attachment ID. List a task's attachments with clickup_get_task using include: ["attachments"]. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Find attachment IDs with `clickup_get_task` and `include: ["attachments"]`. `cupt attach get` also downloads.

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
- Feature file path: `mcp-low-priority/download-task-attachment.md`

Related references:
- [get-task.md](../../feature-catalog/mcp-high-priority/get-task.md): clickup_get_task
- [attach-task-file.md](../../feature-catalog/mcp-low-priority/attach-task-file.md): clickup_attach_task_file
