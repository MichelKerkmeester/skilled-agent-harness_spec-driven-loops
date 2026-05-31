---
title: "clickup_manage_goals"
description: "Create, update, or delete goals and OKRs at the workspace level."
---

# clickup_manage_goals

---

## 1. OVERVIEW

CRUD operations on ClickUp Goals. Create: requires `team_id`, `name`. Optional: `due_date` (Unix ms), `description`, `color` (hex). Returns created goal with `goal_id`.

---

## 2. CURRENT REALITY

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
- Feature file path: `12--mcp-medium-priority/19-manage-goals.md`
