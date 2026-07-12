---
title: "clickup_manage_time_tracking"
description: "Log or update time tracking entries for a task via MCP."
trigger_phrases:
  - "time tracking mcp"
  - "clickup_manage_time_tracking"
  - "log time entry mcp"
  - "precise time entry with timestamps"
  - "start end time log"
version: 1.0.0.3
importance_tier: "normal"
contextType: "implementation"
---

# clickup_manage_time_tracking

Log or update time tracking entries for a task via MCP.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Creates or updates a time entry. Required: `task_id`. For creation: `start` (Unix ms), `end` (Unix ms) or `duration` (ms). Returns the created time entry with ID.

---

## 2. HOW IT WORKS

MCP alternative to `cupt time add`. Use when start/end timestamps are known (vs duration-only logging). More precise than cupt's duration-based logging.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y @clickup/mcp-server` (stdio), `CLICKUP_API_KEY`+`CLICKUP_TEAM_ID` env vars, registered in `.utcp_config.json` |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: MCP MEDIUM Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `mcp-medium-priority/time-tracking.md`
Related references:
- [update-document.md](../mcp_medium_priority/update_document.md) — clickup_update_document
- [manage-goals.md](../mcp_medium_priority/manage_goals.md) — clickup_manage_goals
