---
title: "clickup_create_reminder"
description: "Create a personal reminder with a due date."
trigger_phrases:
  - "clickup_create_reminder"
  - "create reminder"
  - "remind me"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_create_reminder

Create a personal reminder with a due date.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_create_reminder` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Create a personal reminder in your ClickUp workspace. Requires title and due_date (YYYY-MM-DD or YYYY-MM-DD HH:MM format, uses your timezone).

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `title` | string | yes | Title for the reminder. Ask the user what they want to be reminded about. |
| `description` | string | no | Optional description with additional details for the reminder. |
| `due_date` | string | yes | Due date in YYYY-MM-DD format or date-time in YYYY-MM-DD HH:MM format (e.g., '2025-12-31' or '2025-12-31 14:30'). Uses your user timezone. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

`due_date` uses `YYYY-MM-DD` or `YYYY-MM-DD HH:MM` in the user's timezone.

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
- Feature file path: `mcp-low-priority/create-reminder.md`

Related references:
- [search-reminders.md](../../feature-catalog/mcp-low-priority/search-reminders.md): clickup_search_reminders
- [update-reminder.md](../../feature-catalog/mcp-low-priority/update-reminder.md): clickup_update_reminder
