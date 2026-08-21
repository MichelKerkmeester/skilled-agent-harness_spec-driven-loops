---
title: "USR-002 -- Retrieve a user"
description: "This scenario validates a targeted user read, sourced from list-all-users, through the confirmed notion_retrieve-a-user tool."
stage: routing
version: 0.1.0.0
---

# USR-002 -- Retrieve a user

## 1. OVERVIEW

This scenario validates the confirmed `notion_retrieve-a-user` tool by sourcing a real `user_id` from `list-all-users` and reading that user back individually.

### Why This Matters

`retrieve-a-user` takes an opaque `user_id` and has no discovery path of its own, so this scenario must source a real ID rather than guess one. When no user ID can be discovered, the scenario is explicitly SKIP-able rather than fabricating an ID.

---

## 2. SCENARIO CONTRACT

- Feature ID: `USR-002`
- Feature Name: Retrieve a user
- Scenario Objective: Source a `user_id` from `list-all-users`, then confirm `retrieve-a-user` returns a matching user object for that ID.
- Exact Prompt: `Look up that Notion user's profile for me.`
- Exact Command Sequence: `1. Code Mode: list_tools() -> 2. Code Mode: tool_info("notion.notion_list-all-users") -> 3. Code Mode: tool_info("notion.notion_retrieve-a-user") -> 4. Code Mode: call_tool_chain({ code: "const users = await notion[\"notion_list-all-users\"]({}); const target = users.results.find(u => u.type === \"person\") ?? users.results[0]; if (!target) { throw new Error(\"no user id available\"); } const user = await notion[\"notion_retrieve-a-user\"]({ user_id: target.id }); return { target, user };" })`
- Expected Signals: `list-all-users` resolves with at least one row to source an ID from; `retrieve-a-user` resolves with a user object whose `id` matches the sourced `target.id`.
- Evidence: `list_tools()` result, both `tool_info()` results, and the Code Mode response — the sourced `target` row and the `retrieve-a-user` result.
- Pass/Fail Criteria: PASS if a `user_id` is sourced from `list-all-users` and `retrieve-a-user` returns a matching user object; SKIP if `list-all-users` returns zero rows or the manual/token is unavailable — named blocker: "no discoverable user id in the connected workspace"; FAIL if `retrieve-a-user` errors, or returns a user object whose `id` does not match the sourced ID.
- Failure Triage: 1. Confirm `NOTION_TOKEN` and manual registration with `retrieve-bot-user` (`USR-003`). 2. Re-run `list-all-users` to confirm a valid ID is available. 3. Re-run both `tool_info()` calls and compare the `user_id` input shape before retrying.

---

## 3. TEST EXECUTION

### Prerequisites

`NOTION_TOKEN` is set and the `notion` manual is registered. No specific user ID needs to be known ahead of time — the scenario sources one from `list-all-users`. If the workspace has no discoverable users, the scenario is SKIP-able with that named blocker.

### Prompt

`Look up that Notion user's profile for me.`

### Commands

1. `list_tools()`
2. `tool_info("notion.notion_list-all-users")`
3. `tool_info("notion.notion_retrieve-a-user")`
4. Run the Code Mode chain shown in the scenario contract: source a user ID, then retrieve it individually.

### Expected

`list-all-users` returns at least one row to source an ID from, and `retrieve-a-user` returns a user object whose `id` matches that sourced ID.

### Evidence

Capture tool discovery, both schemas, the sourced `target` row, and the `retrieve-a-user` result.

### Pass / Fail

- **Pass:** a `user_id` is sourced and `retrieve-a-user` returns a matching user object.
- **Skip:** `list-all-users` returns zero rows, or the manual/token is unavailable — named blocker "no discoverable user id in the connected workspace".
- **Fail:** `retrieve-a-user` errors, or its returned `id` does not match the sourced ID.

### Failure Triage

1. Confirm `NOTION_TOKEN` and manual registration with `retrieve-bot-user` (`USR-003`).
2. Re-run `list-all-users` to confirm a valid ID is available.
3. Re-run both `tool_info()` calls and compare the `user_id` input shape before retrying.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| USR-002 | Retrieve a user | Source a user id from list-all-users and confirm retrieve-a-user returns a matching object | `Look up that Notion user's profile for me.` | 1. `list_tools()` -> 2. `tool_info("notion.notion_list-all-users")` -> 3. `tool_info("notion.notion_retrieve-a-user")` -> 4. `call_tool_chain` source-then-retrieve chain | Sourced id available; retrieve-a-user returns matching user object | Discovery, both schemas, sourced target row, retrieve-a-user result | PASS on matching object returned; SKIP on no discoverable user id ("no discoverable user id in the connected workspace"); FAIL on error or mismatched id | Check token/registration, re-source id, re-verify schema |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page and scenario summary |
| [`../../feature-catalog/users/retrieve-a-user.md`](../../feature-catalog/users/retrieve-a-user.md) | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Tool name, endpoint, API-version pin, and key inputs |
| [`../../examples/README.md`](../../examples/README.md) | Code Mode invocation pattern and preflight reference |

---

## 5. SOURCE METADATA

- Group: Users
- Playbook ID: `USR-002`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `users/retrieve-a-user.md`
