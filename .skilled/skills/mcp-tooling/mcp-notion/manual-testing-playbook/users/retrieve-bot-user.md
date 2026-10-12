---
title: "USR-003 -- Retrieve your bot user"
description: "This scenario validates the no-input connectivity and auth preflight through the confirmed notion_retrieve-bot-user tool."
stage: routing
version: 0.1.0.0
---

# USR-003 -- Retrieve your bot user

## 1. OVERVIEW

This scenario validates the confirmed `notion_retrieve-bot-user` tool by reading the integration's own bot identity with no input.

### Why This Matters

`retrieve-bot-user` is the **connectivity and auth preflight for the entire mcp-notion mode**, and the **critical-path gate every other scenario in this playbook depends on**. It needs no page or database sharing, so it is the cheapest possible signal that the token and manual registration are both working. Run this scenario first when validating the mode end to end; if it fails, treat every other scenario in Comments, Users, and Search as blocked rather than independently executable.

---

## 2. SCENARIO CONTRACT

- Feature ID: `USR-003`
- Feature Name: Retrieve your bot user
- Scenario Objective: Confirm `retrieve-bot-user` resolves with the integration's own bot identity, no input required.
- Exact Prompt: `Check that our Notion integration is connected and tell me which bot it's running as.`
- Exact Command Sequence: `1. Code Mode: list_tools() -> 2. Code Mode: tool_info("notion.notion_retrieve-bot-user") -> 3. Code Mode: call_tool_chain({ code: "return await notion[\"notion_retrieve-bot-user\"] ({});" })`
- Expected Signals: the call resolves with a `bot` type user object carrying `id`, `bot.owner`, and `bot.workspace_name`.
- Evidence: `list_tools()` result, `tool_info()` result, and the Code Mode response — the bot user object.
- Pass/Fail Criteria: PASS if the call resolves with a valid bot user object; SKIP only if the `notion` manual is entirely unregistered in this environment (in which case no other Comments, Users, or Search scenario in this playbook can run either); FAIL if the call returns a 401 or a malformed/non-bot object.
- Failure Triage: 1. Check `NOTION_TOKEN` is set and valid — there is no browser step on the local stdio backend. 2. Re-run `list_tools()` to confirm the `notion` manual is registered at all. 3. If this fails, do not attempt any other mcp-notion scenario until it is resolved — this is the critical-path gate.

---

## 3. TEST EXECUTION

### Prerequisites

`NOTION_TOKEN` is set and the `notion` manual is registered. No page or database sharing is required.

### Prompt

`Check that our Notion integration is connected and tell me which bot it's running as.`

### Commands

1. `list_tools()`
2. `tool_info("notion.notion_retrieve-bot-user")`
3. Run the Code Mode chain shown in the scenario contract — a single no-input call.

### Expected

The call resolves with a `bot` type user object carrying `id`, `bot.owner`, and `bot.workspace_name`.

### Evidence

Capture tool discovery, schema, and the raw bot user object.

### Pass / Fail

- **Pass:** the call resolves with a valid bot user object.
- **Skip:** the `notion` manual is entirely unregistered in this environment — note that this also blocks every other Comments, Users, and Search scenario.
- **Fail:** the call returns a 401 or a malformed/non-bot object.

### Failure Triage

1. Check `NOTION_TOKEN` is set and valid — there is no browser step on the local stdio backend.
2. Re-run `list_tools()` to confirm the `notion` manual is registered at all.
3. If this fails, treat every other mcp-notion scenario as blocked rather than attempting them independently — this is the critical-path gate.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| USR-003 | Retrieve your bot user | Confirm connectivity/auth via the no-input bot-identity read, the critical-path gate for the mode | `Check that our Notion integration is connected and tell me which bot it's running as.` | 1. `list_tools()` -> 2. `tool_info("notion.notion_retrieve-bot-user")` -> 3. `call_tool_chain` no-input bot read | Valid bot user object with `id`, `bot.owner`, `bot.workspace_name` | Discovery, schema, bot user object | PASS on valid bot object returned; SKIP only if manual unregistered (blocks all other scenarios too); FAIL on 401 or malformed object | Check token, re-verify manual registration, treat failure as mode-wide block |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `retrieve-bot-user.md` (feature-catalog Users category) | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Tool name, endpoint, API-version pin, and no-input contract |
| [`../../examples/README.md`](../../examples/README.md) | Code Mode invocation pattern and preflight reference |

---

## 5. SOURCE METADATA

- Group: Users
- Playbook ID: `USR-003`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `users/retrieve-bot-user.md`
