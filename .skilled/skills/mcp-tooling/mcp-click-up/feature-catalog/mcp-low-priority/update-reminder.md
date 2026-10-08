---
title: "clickup_update_reminder"
description: "Change a reminder or mark it complete."
trigger_phrases:
  - "clickup_update_reminder"
  - "update reminder"
  - "complete reminder"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_update_reminder

Change a reminder or mark it complete.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_update_reminder` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Update a reminder by reminder_id. Supports title, description, due_date (YYYY-MM-DD or YYYY-MM-DD HH:MM, e.g. '2025-12-31'), and is_completed.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `reminder_id` | string | yes | The unique identifier (KSUID) of the reminder to update. |
| `title` | string | no | New title for the reminder. |
| `description` | string | no | New description for the reminder. |
| `due_date` | string | no | New due date in YYYY-MM-DD format or date-time in YYYY-MM-DD HH:MM format (e.g., '2025-12-31' or '2025-12-31 14:30'). Uses your user timezone. |
| `is_completed` | boolean | no | Set to true to mark the reminder as completed, false to mark as incomplete. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Find the `reminder_id` with `clickup_search_reminders`.

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
- Feature file path: `mcp-low-priority/update-reminder.md`

Related references:
- [search-reminders.md](../../feature-catalog/mcp-low-priority/search-reminders.md): clickup_search_reminders
