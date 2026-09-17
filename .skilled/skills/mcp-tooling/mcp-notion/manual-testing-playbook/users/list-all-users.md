---
title: "USR-001 -- List all users"
description: "This scenario validates a read-only paginated user listing through the confirmed notion_list-all-users tool."
stage: routing
version: 0.1.0.0
---

# USR-001 -- List all users

## 1. OVERVIEW

This scenario validates the confirmed `notion_list-all-users` tool by listing the workspace's users and confirming the paginated response shape.

### Why This Matters

`list-all-users` is read-only and workspace-scoped rather than page-scoped, so it requires no scratch content. Because the calling integration is always itself a member of the workspace, this is the one read tool in the mode where an empty result should be treated as suspicious rather than routine.

---

## 2. SCENARIO CONTRACT

- Feature ID: `USR-001`
- Feature Name: List all users
- Scenario Objective: List the workspace's users via `list-all-users` and confirm at least one row (the integration's own bot user) is present.
- Exact Prompt: `List everyone in our Notion workspace.`
- Exact Command Sequence: `1. Code Mode: list_tools() -> 2. Code Mode: tool_info("notion.notion_list-all-users") -> 3. Code Mode: call_tool_chain({ code: "return await notion[\"notion_list-all-users\"] ({});" })`
- Expected Signals: the call resolves with a non-empty `results` array containing at least the bot user itself, plus pagination fields (`has_more`, `next_cursor`).
- Evidence: `list_tools()` result, `tool_info()` result, and the Code Mode response — the `results` array and pagination fields.
- Pass/Fail Criteria: PASS if the call resolves with a non-empty users array and pagination fields are present; SKIP if the manual/token is unavailable; FAIL if the call errors, or resolves with zero users despite a valid token.
- Failure Triage: 1. Confirm `NOTION_TOKEN` and manual registration with `retrieve-bot-user` (`USR-003`). 2. Re-run `tool_info()` and compare the returned schema. 3. If the array is genuinely empty despite a valid token, treat this as a platform anomaly and escalate rather than retry blindly.

---

## 3. TEST EXECUTION

### Prerequisites

`NOTION_TOKEN` is set and the `notion` manual is registered. No page or database sharing is required — user listing is workspace-scoped.

### Prompt

`List everyone in our Notion workspace.`

### Commands

1. `list_tools()`
2. `tool_info("notion.notion_list-all-users")`
3. Run the Code Mode chain shown in the scenario contract.

### Expected

The call resolves with a non-empty `results` array (the bot user is always present) and pagination fields.

### Evidence

Capture tool discovery, schema, and the raw `results` array plus pagination fields.

### Pass / Fail

- **Pass:** the call resolves with a non-empty users array and pagination fields present.
- **Skip:** the manual is unregistered or the token is unavailable.
- **Fail:** the call errors, or resolves with zero users despite a valid token.

### Failure Triage

1. Confirm `NOTION_TOKEN` and manual registration with `retrieve-bot-user` (`USR-003`).
2. Re-run `tool_info()` and compare the returned schema.
3. If the array is genuinely empty despite a valid token, treat it as a platform anomaly rather than retrying blindly.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| USR-001 | List all users | List workspace users and confirm at least the bot user is present | `List everyone in our Notion workspace.` | 1. `list_tools()` -> 2. `tool_info("notion.notion_list-all-users")` -> 3. `call_tool_chain` list-all-users read | Non-empty `results` array with pagination fields | Discovery, schema, results array, pagination fields | PASS on non-empty array returned; SKIP on unavailable manual/token; FAIL on error or empty array with valid token | Check token/registration, re-verify schema, escalate genuine empty result |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `list-all-users.md` (feature-catalog Users category) | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Tool name, endpoint, API-version pin, and key inputs |
| [`../../examples/README.md`](../../examples/README.md) | Code Mode invocation pattern and preflight reference |

---

## 5. SOURCE METADATA

- Group: Users
- Playbook ID: `USR-001`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `users/list-all-users.md`
