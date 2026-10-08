---
title: "MCP-H006 -- Get Workspace Hierarchy (CRITICAL PATH)"
description: "This scenario validates Get Workspace Hierarchy (CRITICAL PATH) for `MCP-H006`. Objective: Verify `clickup_get_workspace_hierarchy` answers, proving the MCP route and the OAuth sign-in work."
version: 1.1.0.0
---

# MCP-H006 -- Get Workspace Hierarchy (CRITICAL PATH)

---

## 1. OVERVIEW

Validates that **Get Workspace Hierarchy (CRITICAL PATH)** behaves as the feature catalog describes. Tool names and parameters come from the hosted server's schema, captured on 2026-10-08.

### Why This Matters

Verify `clickup_get_workspace_hierarchy` answers, proving the MCP route and the OAuth sign-in work. A failure here means an agent following this skill gets a wrong answer or a tool-not-found error.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `clickup_get_workspace_hierarchy` answers, proving the MCP route and the OAuth sign-in work
- **Real user request:** `Check that the ClickUp MCP connection works.`
- **Prompt:** `Show the spaces in my ClickUp workspace via MCP.`
- **Expected signals:** Response lists the workspace's spaces; no `error` field.
- **Desired user-visible outcome:** Agent reports the MCP connection works and names the spaces.
- **Pass/fail:** PASS if at least one space is listed; FAIL if the call errors, the tool is missing OR the response has an `error` field

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

PRE: `clickup_official` manual configured in `.utcp_config.json` and signed in to workspace 90151466006.
1. Code Mode: `clickup_official.clickup_official_clickup_get_workspace_hierarchy({max_depth: 1})`
2. Check that the response lists at least one space and carries no `error` field

Each Code Mode step runs inside an async function passed to `mcp__code_mode__call_tool_chain`, with the result printed through `console.log`.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-H006 | Get Workspace Hierarchy (CRITICAL PATH) | Verify `clickup_get_workspace_hierarchy` answers, proving the MCP route and the OAuth sign-in work | `Show the spaces in my ClickUp workspace via MCP.` | 1. Code Mode: `clickup_official.clickup_official_clickup_get_workspace_hierarchy({max_depth: 1})` 2. Check that the response lists at least one space and carries no `error` field | Response lists the workspace's spaces; no `error` field. | Code Mode logs plus the terminal output of any cupt step | PASS if at least one space is listed; FAIL if the call errors, the tool is missing OR the response has an `error` field | See [`../../references/troubleshooting.md`](../../references/troubleshooting.md) |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| [`manual-testing-playbook.md`](../../manual-testing-playbook/manual-testing-playbook.md) | Root directory and scenario summary |
| [`../../feature-catalog/mcp-high-priority/get-workspace-hierarchy.md`](../../feature-catalog/mcp-high-priority/get-workspace-hierarchy.md) | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | MCP tool reference |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: MCP Task CRUD
- Playbook ID: MCP-H006
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mcp-task-crud/get-workspace-hierarchy.md`
