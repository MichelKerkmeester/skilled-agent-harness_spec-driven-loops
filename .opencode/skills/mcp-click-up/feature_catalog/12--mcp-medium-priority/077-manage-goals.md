---
title: "clickup_manage_goals"
description: "Create, update, or delete goals and OKRs at the workspace level."
trigger_phrases:
  - "manage goals"
  - "clickup_manage_goals"
  - "create okr goal"
  - "workspace goals management"
  - "goal and key result setup"
---

# clickup_manage_goals

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
| `github.com/clickup/clickup-mcp-server` | MCP | Official ClickUp MCP via Code Mode |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: MCP MEDIUM Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `12--mcp-medium-priority/077-manage-goals.md`
Related references:
- [076-time-tracking.md](076-time-tracking.md) — clickup_manage_time_tracking
