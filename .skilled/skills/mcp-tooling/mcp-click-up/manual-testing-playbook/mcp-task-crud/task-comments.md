---
title: "MCP-H007 -- Task Comments via MCP"
description: "This scenario validates Task Comments via MCP for `MCP-H007`. Objective: Verify `clickup_create_comment` posts a comment and `clickup_get_task_comments` reads it back."
version: 1.1.0.0
---

# MCP-H007 -- Task Comments via MCP

---

## 1. OVERVIEW

Validates that **Task Comments via MCP** behaves as the feature catalog describes. Tool names and parameters come from the hosted server's schema, captured on 2026-10-08.

### Why This Matters

Verify `clickup_create_comment` posts a comment and `clickup_get_task_comments` reads it back. A failure here means an agent following this skill gets a wrong answer or a tool-not-found error.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `clickup_create_comment` posts a comment and `clickup_get_task_comments` reads it back
- **Real user request:** `Leave a comment on the test task via MCP.`
- **Prompt:** `Add a comment 'MCP test comment' to task TASK_ID, then list its comments.`
- **Expected signals:** The comment appears in the comment list; neither call returns an `error` field.
- **Desired user-visible outcome:** Agent reports the comment posted and shows it in the list.
- **Pass/fail:** PASS if the new comment is listed; FAIL if either call errors OR the comment is missing

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

PRE: MCP configured. Use a throwaway test list and task.
1. Code Mode: `clickup_official.clickup_official_clickup_create_comment({entity_type: 'task', entity_id: 'TASK_ID', comment_text: 'MCP test comment'})`
2. Code Mode: `clickup_official.clickup_official_clickup_get_task_comments({task_id: 'TASK_ID'})`

Each Code Mode step runs inside an async function passed to `mcp__code_mode__call_tool_chain`, with the result printed through `console.log`.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-H007 | Task Comments via MCP | Verify `clickup_create_comment` posts a comment and `clickup_get_task_comments` reads it back | `Add a comment 'MCP test comment' to task TASK_ID, then list its comments.` | 1. Code Mode: `clickup_official.clickup_official_clickup_create_comment({entity_type: 'task', entity_id: 'TASK_ID', comment_text: 'MCP test comment'})` 2. Code Mode: `clickup_official.clickup_official_clickup_get_task_comments({task_id: 'TASK_ID'})` | The comment appears in the comment list; neither call returns an `error` field. | Code Mode logs plus the terminal output of any cupt step | PASS if the new comment is listed; FAIL if either call errors OR the comment is missing | See [`../../references/troubleshooting.md`](../../references/troubleshooting.md) |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| [`manual-testing-playbook.md`](../../manual-testing-playbook/manual-testing-playbook.md) | Root directory and scenario summary |
| [`../../feature-catalog/mcp-high-priority/create-comment.md`](../../feature-catalog/mcp-high-priority/create-comment.md) | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | MCP tool reference |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: MCP Task CRUD
- Playbook ID: MCP-H007
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mcp-task-crud/task-comments.md`
