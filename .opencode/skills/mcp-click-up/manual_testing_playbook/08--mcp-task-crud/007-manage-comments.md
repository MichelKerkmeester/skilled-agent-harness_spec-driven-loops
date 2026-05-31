---
title: "MCP-H007 -- Manage Comments via MCP"
description: "This scenario validates Manage Comments via MCP for `MCP-H007`. Objective: Verify `clickup_manage_comments` creates and lists comments."
---

# MCP-H007 -- Manage Comments via MCP

---

## 1. OVERVIEW

Validates that **Manage Comments via MCP** behaves as defined in the feature catalog.

### Why This Matters

Verify `clickup_manage_comments` creates and lists comments is required for correct agent operation. Failure here means comment missing from list or mcp errors on either call.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `clickup_manage_comments` creates and lists comments
- **Real user request:** `Add and list comments via MCP.`
- **Prompt:** `Add comment 'MCP test comment' to TASK_ID then list all comments.`
- **Expected signals:** Step 1: MCP creates comment; exit 0. Step 2: comment list includes the new comment; exit 0.
- **Desired user-visible outcome:** Agent reports: comment added. Comment appears in the comment list.
- **Pass/fail:** PASS if new comment appears in the MCP comment list response; FAIL if comment missing from list OR MCP errors on either call

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Code Mode: `clickup.clickup_manage_comments({task_id: 'TASK_ID', comment_text: 'MCP test comment MCP-H007'})`
2. Code Mode: `clickup.clickup_manage_comments({task_id: 'TASK_ID'})`  # GET — list comments
3. Verify 'MCP test comment MCP-H007' appears in list

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Expected Signals | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|
| MCP-H007 | Manage Comments via MCP | Verify `clickup_manage_comments` creates and lists comm | `Add comment 'MCP test comment' to TASK_ID then list all` | Step 1: MCP creates comment; exit 0. Step 2: comment list includes the new comme | PASS if new comment appears in the MCP comment list response; FAIL if comment missing from list OR MCP errors on either call | See `../references/troubleshooting.md` |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| `manual_testing_playbook.md` | Root directory and scenario summary |
| `../feature_catalog/11--mcp-high-priority/057-manage-comments.md` | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| `../references/cupt_commands.md` | cupt command reference |
| `../references/troubleshooting.md` | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: MCP Task CRUD
- Playbook ID: MCP-H007
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `08--mcp-task-crud/007-manage-comments.md`
