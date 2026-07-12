---
title: "MCP-H006 -- Get Workspace via MCP — CRITICAL PATH"
description: "This scenario validates Get Workspace via MCP — CRITICAL PATH for `MCP-H006`. Objective: Verify `clickup_get_workspace` returns workspace object with ID matching CLICKUP."
version: 1.0.0.5
---

# MCP-H006 -- Get Workspace via MCP — CRITICAL PATH

---

## 1. OVERVIEW

Validates that **Get Workspace via MCP — CRITICAL PATH** behaves as defined in the feature catalog.

### Why This Matters

Verify `clickup_get_workspace` returns workspace object with ID matching CLICKUP_TEAM_ID is required for correct agent operation. Failure here means 401 auth error or workspace `id` missing or mismatch.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `clickup_get_workspace` returns workspace object with ID matching CLICKUP_TEAM_ID
- **Real user request:** `Get workspace details via MCP.`
- **Prompt:** `Get workspace details via MCP and confirm workspace ID.`
- **Expected signals:** MCP returns JSON with workspace `id` matching CLICKUP_TEAM_ID; workspace name present; exit 0.
- **Desired user-visible outcome:** Agent reports: workspace 'My Team' (ID: WORKSPACE_ID) confirmed via MCP.
- **Pass/fail:** PASS if returned workspace `id` matches configured CLICKUP_TEAM_ID; FAIL if 401 auth error OR workspace `id` missing OR mismatch

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

PRE: MCP configured with valid CLICKUP_TEAM_ID.
1. Code Mode: `clickup_official.clickup_official_clickup_get_workspace({})`
2. `bash: jq '.id' <<< "$RESULT"`  # → CLICKUP_TEAM_ID
3. Verify returned ID matches configured CLICKUP_TEAM_ID

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-H006 | Get Workspace via MCP — CRITICAL PATH | Verify `clickup_get_workspace` returns workspace object with ID matching CLICKUP_TEAM_ID | `Get workspace details via MCP and confirm workspace ID.` | 1. Code Mode: `clickup_official.clickup_official_clickup_get_workspace({})` 2. `bash: jq '.id' <<< "$RESULT"`  # → CLICKUP_TEAM_ID 3. Verify returned ID matches configured CLICKUP_TEAM_ID | MCP returns JSON with workspace `id` matching CLICKUP_TEAM_ID; workspace name present; exit 0. | Code Mode response + terminal output of the verification step(s) above | PASS if returned workspace `id` matches configured CLICKUP_TEAM_ID; FAIL if 401 auth error OR workspace `id` missing OR mismatch | See [`../../references/troubleshooting.md`](../../references/troubleshooting.md) |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| [`manual_testing_playbook.md`](../manual_testing_playbook.md) | Root directory and scenario summary |
| [`../../feature_catalog/mcp_high_priority/get_workspace.md`](../../feature_catalog/mcp_high_priority/get_workspace.md) | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| [`../../references/cupt_commands.md`](../../references/cupt_commands.md) | cupt command reference |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: MCP Task CRUD
- Playbook ID: MCP-H006
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `mcp-task-crud/get-workspace.md`
