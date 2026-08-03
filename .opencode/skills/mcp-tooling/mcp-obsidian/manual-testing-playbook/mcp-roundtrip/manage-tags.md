---
title: "MCP-H003 -- Manage tags"
description: "This scenario validates a controlled tag mutation through obsidian_manage_tags after schema discovery."
stage: routing
version: 1.0.0.0
---

# MCP-H003 -- Manage tags

## 1. OVERVIEW

This scenario validates the confirmed `obsidian_manage_tags` tool with a controlled tag on the round-trip note.

### Why This Matters

Tag management is an app-backed structured operation. The current references confirm the tool name but mark the argument shape as `VERIFY`, so schema discovery is part of the scenario.

---

## 2. SCENARIO CONTRACT

- Feature ID: `MCP-H003`
- Feature Name: Manage tags
- Scenario Objective: Add the controlled `mcp-playbook` tag to `Daily/mcp-obsidian-playbook.md` and capture the structured result.
- Exact Prompt: `Add the tag mcp-playbook to Daily/mcp-obsidian-playbook.md through the live Obsidian MCP and report the result.`
- Exact Command Sequence: `1. Code Mode: list_tools() -> 2. Code Mode: tool_info("obsidian.obsidian_manage_tags") -> 3. Code Mode: call_tool_chain({ code: "return await obsidian.obsidian_manage_tags({ path: \"Daily/mcp-obsidian-playbook.md\", add: [\"mcp-playbook\"] });" }) -> 4. read the note or list tags with a schema-confirmed tool`
- Expected Signals: The tool resolves; the controlled add operation returns structured output; the tag is observable on the note or in the tool response.
- Evidence: Tool discovery, schema, mutation response, note/tag read-back, and exact path.
- Pass/Fail Criteria: PASS if the tag is added only to the controlled note; SKIP if the live prerequisites or schema are unavailable; FAIL if the confirmed tool mutates the wrong path or errors unexpectedly.
- Failure Triage: 1. Confirm the target note and app/token. 2. Re-run `tool_info()` and use only its argument names. 3. Check the tag through a schema-confirmed read before retrying.

---

## 3. TEST EXECUTION

### Prerequisites

Running Obsidian with the target vault open, Local REST API v4.0.0+, bearer token, registered manual, and the controlled note from `MCP-H001` are required. Local REST API + token setup may be pending.

### Prompt

`Add the tag mcp-playbook to Daily/mcp-obsidian-playbook.md through the live Obsidian MCP and report the result.`

### Commands

1. `list_tools()`
2. `tool_info("obsidian.obsidian_manage_tags")`
3. Run the tag mutation through Code Mode with the schema-confirmed path and add/remove fields.
4. Read back the tag with a schema-confirmed operation.

### Expected

The tag mutation returns structured output and the controlled note reports `mcp-playbook`.

### Evidence

Capture discovery, schema, mutation response, read-back, and note path.

### Pass / Fail

- **Pass:** the controlled tag is added and observable.
- **Skip:** app, REST API, token, manual, or exact schema is unavailable.
- **Fail:** the confirmed call changes the wrong note or errors unexpectedly.

### Failure Triage

1. Confirm the target path and live prerequisites.
2. Re-run `tool_info()` and match the returned argument names.
3. Read back the tag before retrying the mutation.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-H003 | Manage tags | Add a controlled tag through MCP | `Add the tag mcp-playbook to Daily/mcp-obsidian-playbook.md through the live Obsidian MCP and report the result.` | 1. `list_tools()` -> 2. `tool_info("obsidian.obsidian_manage_tags")` -> 3. schema-confirmed tag add -> 4. schema-confirmed read-back | Tool resolves; structured mutation; tag visible | Discovery, schema, response, read-back | PASS on controlled tag; SKIP on prerequisites/schema; FAIL on wrong mutation/error | Recheck path, schema, and read-back |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root MCP policy and scenario index |
| [`../../feature-catalog/mcp/manage-tags.md`](../../feature-catalog/mcp/manage-tags.md) | Catalog entry for tag management |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Tool identity and representative tag inputs |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Authorization, connection, and tool discovery recovery |

---

## 5. SOURCE METADATA

- Group: MCP round-trip
- Playbook ID: `MCP-H003`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mcp-roundtrip/manage-tags.md`
