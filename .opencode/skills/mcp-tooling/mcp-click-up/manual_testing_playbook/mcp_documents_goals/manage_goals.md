---
title: "MCP-M019 -- Create Goal via MCP"
description: "This scenario validates Create Goal via MCP for `MCP-M019`. Objective: Verify `clickup_manage_goals` creates a goal and returns a goal_id."
version: 1.0.0.5
---

# MCP-M019 -- Create Goal via MCP

---

## 1. OVERVIEW

Validates that **Create Goal via MCP** behaves as defined in the feature catalog.

### Why This Matters

Verify `clickup_manage_goals` creates a goal and returns a goal_id is required for correct agent operation. Failure here means `id` missing or 403 plan limitation error.

> **Capability status: SKIP.** Goals/OKR tools were confirmed absent from the last live `list_tools()` inventory (`references/mcp_tools.md`). Do not execute this scenario against the current server; it will fail with a tool-not-found error, not the pass/fail signals below. Re-enable only after a fresh `tool_info()`/`list_tools()` capture confirms an exact callable name and schema.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `clickup_manage_goals` creates a goal and returns a goal_id
- **Real user request:** `Create a workspace goal via MCP.`
- **Prompt:** `Create goal 'Playbook Test Goal' in workspace WORKSPACE_ID.`
- **Expected signals:** MCP returns goal object with `id` (goal_id); goal visible in ClickUp; exit 0.
- **Desired user-visible outcome:** Agent reports: goal 'Playbook Test Goal' created with ID GOAL_ID.
- **Pass/fail:** SKIP — goals confirmed absent from the live server (see capability status above). If a future capture proves otherwise: PASS if response includes `id` AND goal visible in ClickUp Goals; FAIL if `id` missing OR 403 plan limitation error

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

PRE: Workspace must have Goals feature (premium plan).
1. Code Mode: `clickup_official.clickup_official_clickup_manage_goals({action: 'create', team_id: 'WORKSPACE_ID', name: 'Playbook Test Goal'})`
2. `bash: jq .id <<< "$RESULT"`  # → goal_id
3. Confirm goal visible in ClickUp Goals view

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-M019 | Create Goal via MCP | Verify `clickup_manage_goals` creates a goal and returns a goal_id | `Create goal 'Playbook Test Goal' in workspace WORKSPACE_ID.` | NOT EXECUTABLE — see capability status above | MCP returns goal object with `id` (goal_id); goal visible in ClickUp; exit 0. | N/A — tool confirmed absent | SKIP — goals confirmed absent from the live server; do not attempt | See [`../../references/troubleshooting.md`](../../references/troubleshooting.md) |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| [`manual_testing_playbook.md`](../manual_testing_playbook.md) | Root directory and scenario summary |
| [`../../feature_catalog/mcp_medium_priority/manage_goals.md`](../../feature_catalog/mcp_medium_priority/manage_goals.md) | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| [`../../references/cupt_commands.md`](../../references/cupt_commands.md) | cupt command reference |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: MCP Goals
- Playbook ID: MCP-M019
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `mcp-documents-goals/manage-goals.md`
