---
title: "MCP-M019 -- Create Goal"
description: "This scenario validates Create Goal for `MCP-M019`. Objective: Verify `clickup_manage_goals` creates a goal and returns a goal_id."
version: 1.0.0.6
---

# MCP-M019 -- Create Goal

---

## 1. OVERVIEW

Validates that **Create Goal** behaves as defined in the feature catalog.

### Why This Matters

Verify `clickup_manage_goals` creates a goal and returns a goal_id is required for correct agent operation. Failure here means `goal_id` missing or goals not available (plan limitation).

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `clickup_manage_goals` creates a goal and returns a goal_id
- **Real user request:** `Create a test goal in the workspace.`
- **Prompt:** `Create a goal named 'Playbook Test Goal' in the workspace.`
- **Expected signals:** MCP call returns JSON with `goal_id`; goal visible in ClickUp Goals.
- **Desired user-visible outcome:** Agent reports: goal 'Playbook Test Goal' created with ID GOAL_ID.
- **Pass/fail:** PASS if response includes `goal_id` AND goal visible in ClickUp; FAIL if `goal_id` missing OR Goals not available (plan limitation)

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

PRE: Workspace has Goals feature (premium plan required).
1. Code Mode: `clickup.clickup_manage_goals({action: 'create', team_id: 'WORKSPACE_ID', name: 'Playbook Test Goal', description: 'Created by mcp-click-up playbook test MCP-M019'})`
2. Verify response includes `goal_id`
3. Open ClickUp UI Goals view and confirm goal exists

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Expected Signals | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|
| MCP-M019 | Create Goal | Verify `clickup_manage_goals` creates a goal and return | `Create a goal named 'Playbook Test Goal' in the workspa` | MCP call returns JSON with `goal_id`; goal visible in ClickUp Goals. | PASS if response includes `goal_id` AND goal visible in ClickUp; FAIL if `goal_id` missing OR Goals not available (plan limitati | See `../references/troubleshooting.md` |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| `manual_testing_playbook.md` | Root directory and scenario summary |
| `../feature_catalog/mcp_medium_priority/manage_goals.md` | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| `../references/cupt_commands.md` | cupt command reference |
| `../references/troubleshooting.md` | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: MCP Goals
- Playbook ID: MCP-M019
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `mcp-advanced/manage-goals.md`
