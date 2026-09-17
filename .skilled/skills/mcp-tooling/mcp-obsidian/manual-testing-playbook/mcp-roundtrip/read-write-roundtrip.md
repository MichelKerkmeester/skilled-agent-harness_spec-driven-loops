---
title: "MCP-H001 -- Read/write round-trip"
description: "This scenario validates a controlled read, idempotent append, and write through the cyanheads Obsidian MCP."
stage: routing
version: 0.1.0.0
---

# MCP-H001 -- Read/write round-trip

## 1. OVERVIEW

This scenario validates the confirmed `obsidian_get_note` and `obsidian_write_note` tools as a live-app round-trip.

### Why This Matters

The MCP path exists for structured note reads and writes when the app, Local REST API, token, and Code Mode manual are available. The scenario keeps the write idempotent and controlled.

---

## 2. SCENARIO CONTRACT

- Feature ID: `MCP-H001`
- Feature Name: Read/write round-trip
- Scenario Objective: Read `Daily/mcp-obsidian-playbook.md`, append one marker if absent, and write the note back.
- Exact Prompt: `Read Daily/mcp-obsidian-playbook.md, append the heading ## MCP playbook round-trip only if it is missing, and report the structured write result.`
- Exact Command Sequence: `1. Code Mode: list_tools() -> 2. Code Mode: tool_info("obsidian.obsidian_get_note") -> 3. Code Mode: tool_info("obsidian.obsidian_write_note") -> 4. Code Mode: call_tool_chain({ code: "const existing = await obsidian.obsidian_get_note({ path: \"Daily/mcp-obsidian-playbook.md\" }); const marker = \"## MCP playbook round-trip\"; const content = existing.content.includes(marker) ? existing.content : existing.content + \"\\n\\n\" + marker; return await obsidian.obsidian_write_note({ path: \"Daily/mcp-obsidian-playbook.md\", content });" })`
- Expected Signals: The live manual reports the callable names; both schemas resolve; the read returns structured note data; the write returns a structured result; a second read contains the marker once.
- Evidence: `list_tools()` result, both `tool_info()` results, Code Mode response, note path, and second-read content.
- Pass/Fail Criteria: PASS if the tool names and schemas resolve and the marker is present once after the write; SKIP if registration, app, token, or schema is unavailable; FAIL if a confirmed call contradicts the expected read/write behavior.
- Failure Triage: 1. Probe the REST API and token. 2. Run `list_tools()` and `tool_info()` again. 3. Compare the returned schema with the representative `path`/`content` inputs before retrying.

---

## 3. TEST EXECUTION

### Prerequisites

The operator has a running Obsidian app with the target vault open, Local REST API plugin v4.0.0+, a bearer token, and a registered `obsidian` manual. Local REST API + token setup may be pending.

### Prompt

`Read Daily/mcp-obsidian-playbook.md, append the heading ## MCP playbook round-trip only if it is missing, and report the structured write result.`

### Commands

1. `list_tools()`
2. `tool_info("obsidian.obsidian_get_note")`
3. `tool_info("obsidian.obsidian_write_note")`
4. Run the Code Mode chain shown in the scenario contract.
5. Read the note again with the confirmed schema.

### Expected

Five known core names are discoverable, both schemas resolve, the note is read and written structurally, and the marker appears once.

### Evidence

Capture discovery, schema, round-trip response, and second-read content. Capture the exact note path.

### Pass / Fail

- **Pass:** tool discovery and schema checks succeed; the marker is written once.
- **Skip:** app, REST API, token, manual registration, or schema is unavailable.
- **Fail:** a confirmed call returns contradictory data or writes the wrong path/content.

### Failure Triage

1. Check `OBSIDIAN_API_KEY`, `OBSIDIAN_BASE_URL`, and the running app.
2. Re-run `list_tools()` and both `tool_info()` calls.
3. Adjust only to the returned schema; if no safe schema is available, record `SKIP`.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-H001 | Read/write round-trip | Read, append idempotently, and write a controlled note | `Read Daily/mcp-obsidian-playbook.md, append the heading ## MCP playbook round-trip only if it is missing, and report the structured write result.` | 1. `list_tools()` -> 2. `tool_info("obsidian.obsidian_get_note")` -> 3. `tool_info("obsidian.obsidian_write_note")` -> 4. Code Mode read/append/write chain -> 5. read back | Known names and schemas resolve; marker present once | Discovery, schemas, responses, note content | PASS on structured round-trip; SKIP on prerequisites/schema; FAIL on contradictory confirmed behavior | Probe app/token, rediscover tools, compare schema |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root MCP policy and wave order |
| [`../../feature-catalog/mcp/get-note.md`](../../feature-catalog/mcp/get-note.md) | Catalog entry for the read tool |
| [`../../feature-catalog/mcp/write-note.md`](../../feature-catalog/mcp/write-note.md) | Catalog entry for the write tool |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Tool names, prerequisites, and representative invocation |
| [`../../examples/mcp-roundtrip.sh`](../../examples/mcp-roundtrip.sh) | Code Mode chain and preflight reference |

---

## 5. SOURCE METADATA

- Group: MCP round-trip
- Playbook ID: `MCP-H001`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mcp-roundtrip/read-write-roundtrip.md`
