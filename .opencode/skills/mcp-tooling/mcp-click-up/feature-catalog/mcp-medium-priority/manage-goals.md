---
title: "clickup_manage_goals"
description: "Create, update, or delete goals and OKRs at the workspace level."
trigger_phrases:
  - "manage goals"
  - "clickup_manage_goals"
  - "create okr goal"
  - "workspace goals management"
  - "goal and key result setup"
version: 1.0.0.3
importance_tier: "normal"
contextType: "implementation"
---

# clickup_manage_goals

Create, update, or delete goals and OKRs at the workspace level.

> **Capability status: UNSUPPORTED.** A direct `list_tools()` inventory (`references/mcp-tools.md`) found no goals/OKR tools on the registered server. Treat this card as an unsupported historical assumption until a fresh `tool_info()`/`list_tools()` capture confirms an exact callable name and schema.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

CRUD operations on ClickUp Goals. Create: requires `team_id`, `name`. Optional: `due_date` (Unix ms), `description`, `color` (hex). Returns created goal with `goal_id`.

---

## 2. HOW IT WORKS

Goals are a ClickUp premium feature. Creating a goal does not create key results — those require additional API calls. The `team_id` must match `CLICKUP_TEAM_ID`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y @clickup/mcp-server` (stdio), `CLICKUP_API_KEY`+`CLICKUP_TEAM_ID` env vars, registered in `.utcp_config.json` |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: MCP MEDIUM Priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-medium-priority/manage-goals.md`
Related references:
- [time-tracking.md](../../feature-catalog/mcp-medium-priority/time-tracking.md) — clickup_manage_time_tracking
