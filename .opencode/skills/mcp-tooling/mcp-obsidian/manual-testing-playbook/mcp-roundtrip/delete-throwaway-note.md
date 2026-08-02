---
title: "MCP-H004 -- Delete the throwaway note"
description: "This scenario validates destructive obsidian_delete_note behavior against only the round-trip fixture."
stage: routing
version: 1.0.0.0
---

# MCP-H004 -- Delete the throwaway note

## 1. OVERVIEW

This scenario validates `obsidian_delete_note` against the exact disposable note created by `MCP-H001`.

### Why This Matters

The live MCP delete path is destructive and has no documented undo in the current references. It belongs at the end of the MCP wave, after the path and contents have been captured.

---

## 2. SCENARIO CONTRACT

- Feature ID: `MCP-H004`
- Feature Name: Delete the throwaway note
- Scenario Objective: Delete `Daily/mcp-obsidian-playbook.md` only after confirming it is the disposable fixture, then verify a read returns not found.
- Exact Prompt: `Delete only the throwaway Daily/mcp-obsidian-playbook.md note through Obsidian MCP and verify that it is no longer readable.`
- Exact Command Sequence: `1. Code Mode: tool_info("obsidian.obsidian_get_note") -> 2. read the exact note -> 3. Code Mode: tool_info("obsidian.obsidian_delete_note") -> 4. Code Mode: call_tool_chain({ code: "return await obsidian.obsidian_delete_note({ path: \"Daily/mcp-obsidian-playbook.md\" });" }) -> 5. read the same path and capture the not-found response`
- Expected Signals: The note is confirmed before deletion; delete returns structured success; the follow-up read reports a not-found/404-style result.
- Evidence: Pre-delete content/path, schemas, delete response, post-delete read response, and app context.
- Pass/Fail Criteria: PASS if only the throwaway note is deleted and the follow-up read is not found; SKIP if prerequisites or schema are unavailable; FAIL if the wrong note is touched or the confirmed server leaves it readable.
- Failure Triage: 1. Stop immediately on path ambiguity. 2. Re-run the read before any retry. 3. Inspect server/error output and route to headless diagnostics if the app or REST API is unavailable.

---

## 3. TEST EXECUTION

### Prerequisites

This is a dedicated destructive scenario. It requires the live app, Local REST API v4.0.0+, token, registered manual, and the exact throwaway note from `MCP-H001`. Local REST API + token setup may be pending.

### Prompt

`Delete only the throwaway Daily/mcp-obsidian-playbook.md note through Obsidian MCP and verify that it is no longer readable.`

### Commands

1. `tool_info("obsidian.obsidian_get_note")`
2. Read `Daily/mcp-obsidian-playbook.md` and capture its content.
3. `tool_info("obsidian.obsidian_delete_note")`
4. Run the schema-confirmed delete call for the captured path.
5. Read the same path and capture the not-found result.

### Expected

The fixture is confirmed, deletion succeeds, and a subsequent read reports not found.

### Evidence

Capture exact path/content, schemas, delete response, and post-delete response.

### Pass / Fail

- **Pass:** only the throwaway note is deleted and the post-delete read is not found.
- **Skip:** live prerequisites or exact schema unavailable.
- **Fail:** wrong path, unexpected deletion result, or note remains readable after a confirmed success.

### Failure Triage

1. Stop on any path ambiguity.
2. Re-read the note and inspect the delete response.
3. Check app, REST API, token, and tool schema before retrying.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-H004 | Delete the throwaway note | Delete and verify the disposable MCP fixture | `Delete only the throwaway Daily/mcp-obsidian-playbook.md note through Obsidian MCP and verify that it is no longer readable.` | 1. `tool_info` and pre-read -> 2. `tool_info("obsidian.obsidian_delete_note")` -> 3. schema-confirmed delete -> 4. post-read | Fixture confirmed; delete success; not-found read | Pre/post content, schemas, responses | PASS on controlled deletion; SKIP on prerequisites/schema; FAIL on wrong or persistent note | Stop, re-read, inspect app/token/schema |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root destructive-wave policy |
| [`../../feature-catalog/mcp-high-priority/delete-note.md`](../../feature-catalog/mcp-high-priority/delete-note.md) | Catalog entry for MCP deletion |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Delete tool and not-found recovery |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Connection and authorization recovery |

---

## 5. SOURCE METADATA

- Group: MCP round-trip
- Playbook ID: `MCP-H004`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mcp-roundtrip/delete-throwaway-note.md`
