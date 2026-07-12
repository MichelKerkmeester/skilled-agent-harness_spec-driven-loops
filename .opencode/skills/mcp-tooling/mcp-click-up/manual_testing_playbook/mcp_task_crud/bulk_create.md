---
title: "MCP-H008 -- Bulk Create Tasks via MCP"
description: "This scenario validates Bulk Create Tasks via MCP for `MCP-H008`. Objective: Verify `clickup_create_bulk_tasks` creates 3+ tasks in one API call."
version: 1.0.0.5
---

# MCP-H008 -- Bulk Create Tasks via MCP

---

## 1. OVERVIEW

Validates that **Bulk Create Tasks via MCP** behaves as defined in the feature catalog.

### Why This Matters

Verify `clickup_create_bulk_tasks` creates 3+ tasks in one API call is required for correct agent operation. Failure here means fewer than 3 tasks returned or any task missing `id`.

> **Capability status: SKIP.** Dedicated bulk-create was confirmed absent from the last live `list_tools()` inventory (`references/mcp_tools.md`) — this is not a naming issue, the capability itself was not found. Do not execute this scenario against the current server; it will fail with a tool-not-found error, not the pass/fail signals below. Use repeated single `clickup_create_task` calls instead. Re-enable only after a fresh `tool_info()`/`list_tools()` capture confirms an exact bulk-create callable name and schema.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `clickup_create_bulk_tasks` creates 3+ tasks in one API call
- **Real user request:** `Create three tasks at once via MCP.`
- **Prompt:** `Create 3 test tasks simultaneously in list LIST_ID via MCP.`
- **Expected signals:** MCP returns array of 3 task objects, each with `id`; `jq length` returns 3; exit 0.
- **Desired user-visible outcome:** Agent reports: 3 tasks created (IDs: A, B, C). All visible in ClickUp.
- **Pass/fail:** SKIP — bulk-create confirmed absent from the live server (see capability status above). If a future capture proves otherwise: PASS if `jq length` returns 3 AND each task has an `id`; FAIL if fewer than 3 tasks returned OR any task missing `id`

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

PRE: Use a throwaway test list.
1. Code Mode: `clickup_official.clickup_official_clickup_create_bulk_tasks({list_id: 'LIST_ID', tasks: [{name: 'Bulk Test 1'}, {name: 'Bulk Test 2'}, {name: 'Bulk Test 3'}]})`
2. `bash: jq length <<< "$RESULT"`  # → 3

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-H008 | Bulk Create Tasks via MCP | Verify `clickup_create_bulk_tasks` creates 3+ tasks in one API call | `Create 3 test tasks simultaneously in list LIST_ID via MCP.` | NOT EXECUTABLE — see capability status above | MCP returns array of 3 task objects, each with `id`; `jq length` returns 3; exit 0. | N/A — tool confirmed absent | SKIP — bulk-create confirmed absent from the live server; do not attempt | See [`../../references/troubleshooting.md`](../../references/troubleshooting.md) |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| [`manual_testing_playbook.md`](../manual_testing_playbook.md) | Root directory and scenario summary |
| [`../../feature_catalog/mcp-high-priority/create-bulk-tasks.md`](../../feature_catalog/mcp-high-priority/create-bulk-tasks.md) | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| [`../../references/cupt_commands.md`](../../references/cupt_commands.md) | cupt command reference |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: MCP Task CRUD
- Playbook ID: MCP-H008
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `mcp-task-crud/bulk-create.md`
