---
title: "MCP-H005 -- Search Tasks via MCP"
description: "This scenario validates Search Tasks via MCP for `MCP-H005`. Objective: Verify `clickup_search_tasks` returns tasks matching a keyword."
---

# MCP-H005 -- Search Tasks via MCP

---

## 1. OVERVIEW

Validates that **Search Tasks via MCP** behaves as defined in the feature catalog.

### Why This Matters

Verify `clickup_search_tasks` returns tasks matching a keyword is required for correct agent operation. Failure here means non-array response or mcp error.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `clickup_search_tasks` returns tasks matching a keyword
- **Real user request:** `Search for tasks containing a keyword.`
- **Prompt:** `Search for tasks containing the word 'test' in the workspace.`
- **Expected signals:** MCP returns JSON array of matching tasks; each task includes `id` and `name`; exit 0.
- **Desired user-visible outcome:** Agent reports: N tasks found containing 'test' in name or description.
- **Pass/fail:** PASS if response is a JSON array (may be empty if no tasks match); FAIL if non-array response OR MCP error

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Code Mode: `clickup.clickup_search_tasks({query: 'test'})`
2. Verify response is an array of task objects

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Expected Signals | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|
| MCP-H005 | Search Tasks via MCP | Verify `clickup_search_tasks` returns tasks matching a  | `Search for tasks containing the word 'test' in the work` | MCP returns JSON array of matching tasks; each task includes `id` and `name`; ex | PASS if response is a JSON array (may be empty if no tasks matc; FAIL if non-array response OR MCP error | See `../references/troubleshooting.md` |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| `manual_testing_playbook.md` | Root directory and scenario summary |
| `../feature_catalog/11--mcp-high-priority/05-search-tasks.md` | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| `../references/cupt_commands.md` | cupt command reference |
| `../references/troubleshooting.md` | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: MCP Task CRUD
- Playbook ID: MCP-H005
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `08--mcp-task-crud/005-search-tasks.md`
