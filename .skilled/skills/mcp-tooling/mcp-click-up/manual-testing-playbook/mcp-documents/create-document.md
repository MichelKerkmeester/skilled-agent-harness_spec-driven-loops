---
title: "MCP-M015 -- Create Document (CRITICAL PATH)"
description: "This scenario validates Create Document (CRITICAL PATH) for `MCP-M015`. Objective: Verify `clickup_create_document` creates a document in LIST_ID and returns its ID."
version: 1.1.0.0
---

# MCP-M015 -- Create Document (CRITICAL PATH)

---

## 1. OVERVIEW

Validates that **Create Document (CRITICAL PATH)** behaves as the feature catalog describes. Tool names and parameters come from the hosted server's schema, captured on 2026-10-08.

### Why This Matters

Verify `clickup_create_document` creates a document in LIST_ID and returns its ID. A failure here means an agent following this skill gets a wrong answer or a tool-not-found error.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `clickup_create_document` creates a document in LIST_ID and returns its ID
- **Real user request:** `Create a test document via MCP.`
- **Prompt:** `Create a private document named 'MCP Playbook Test Doc' in list LIST_ID.`
- **Expected signals:** Response carries a document ID and no `error` field; the document is visible in the list.
- **Desired user-visible outcome:** Agent reports the document created with its ID.
- **Pass/fail:** PASS if the document exists in LIST_ID; FAIL if the response has an `error` field OR the document is missing

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

PRE: MCP configured. Use a throwaway test list and task.
1. Code Mode: `clickup_official.clickup_official_clickup_create_document({name: 'MCP Playbook Test Doc', parent: {id: 'LIST_ID', type: '6'}, visibility: 'PRIVATE', create_page: true})`
2. Read the document ID from the logged response
3. Open the list in ClickUp and confirm the document is there

Each Code Mode step runs inside an async function passed to `mcp__code_mode__call_tool_chain`, with the result printed through `console.log`.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-M015 | Create Document (CRITICAL PATH) | Verify `clickup_create_document` creates a document in LIST_ID and returns its ID | `Create a private document named 'MCP Playbook Test Doc' in list LIST_ID.` | 1. Code Mode: `clickup_official.clickup_official_clickup_create_document({name: 'MCP Playbook Test Doc', parent: {id: 'LIST_ID', type: '6'}, visibility: 'PRIVATE', create_page: true})` 2. Read the document ID from the logged response 3. Open the list in ClickUp and confirm the document is there | Response carries a document ID and no `error` field; the document is visible in the list. | Code Mode logs plus the terminal output of any cupt step | PASS if the document exists in LIST_ID; FAIL if the response has an `error` field OR the document is missing | See [`../../references/troubleshooting.md`](../../references/troubleshooting.md) |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| [`manual-testing-playbook.md`](../../manual-testing-playbook/manual-testing-playbook.md) | Root directory and scenario summary |
| [`../../feature-catalog/mcp-medium-priority/create-document.md`](../../feature-catalog/mcp-medium-priority/create-document.md) | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | MCP tool reference |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: MCP Documents
- Playbook ID: MCP-M015
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mcp-documents/create-document.md`
