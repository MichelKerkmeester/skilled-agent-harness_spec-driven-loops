---
title: "MCP-H002 -- Search the live vault"
description: "This scenario validates the confirmed obsidian_search_notes tool against a running vault."
stage: routing
version: 1.0.0.0
---

# MCP-H002 -- Search the live vault

## 1. OVERVIEW

This scenario validates structured search through `obsidian_search_notes` in the cyanheads server.

### Why This Matters

The live MCP search is the structured alternative to headless title/body search when the app and REST API are available.

---

## 2. SCENARIO CONTRACT

- Feature ID: `MCP-H002`
- Feature Name: Search the live vault
- Scenario Objective: Search for `mcp-obsidian-playbook` and capture the structured results.
- Exact Prompt: `Search the live Obsidian vault for notes containing mcp-obsidian-playbook and report the structured matches.`
- Exact Command Sequence: `1. Code Mode: list_tools() -> 2. Code Mode: tool_info("obsidian.obsidian_search_notes") -> 3. Code Mode: call_tool_chain({ code: "return await obsidian.obsidian_search_notes({ query: \"mcp-obsidian-playbook\" });" })`
- Expected Signals: The callable resolves; the response is structured; results contain the controlled note or an explicit empty result.
- Evidence: Discovery output, tool schema, search response, and the fixture path if matched.
- Pass/Fail Criteria: PASS if the confirmed tool returns a structured result consistent with the live vault; SKIP if prerequisites or schema are unavailable; FAIL if a confirmed call errors or returns contradictory data.
- Failure Triage: 1. Confirm the app has the target vault open. 2. Check the token/base URL. 3. Compare the query input with the returned schema and use headless search only as a separate fallback check.

---

## 3. TEST EXECUTION

### Prerequisites

Running Obsidian, Local REST API v4.0.0+, bearer token, registered manual, and a controlled note or known search term are required. Local REST API + token setup may be pending.

### Prompt

`Search the live Obsidian vault for notes containing mcp-obsidian-playbook and report the structured matches.`

### Commands

1. `list_tools()`
2. `tool_info("obsidian.obsidian_search_notes")`
3. Run `obsidian.obsidian_search_notes` through Code Mode with the schema-confirmed query input.

### Expected

The response is structured and either includes the controlled note or reports an empty result without treating it as an error.

### Evidence

Capture discovery, schema, response, query, and live-vault context.

### Pass / Fail

- **Pass:** the confirmed search tool returns a structured, vault-consistent result.
- **Skip:** live prerequisites or exact schema are unavailable.
- **Fail:** the confirmed call errors unexpectedly or the result contradicts the vault.

### Failure Triage

1. Confirm app, vault, REST API, and token.
2. Re-run discovery and schema inspection.
3. Check the query and compare with a separate headless search without conflating the surfaces.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-H002 | Search the live vault | Search a known live-vault marker through MCP | `Search the live Obsidian vault for notes containing mcp-obsidian-playbook and report the structured matches.` | 1. `list_tools()` -> 2. `tool_info("obsidian.obsidian_search_notes")` -> 3. Code Mode schema-confirmed search | Callable resolves; structured match or valid empty result | Discovery, schema, response, query | PASS on consistent structured result; SKIP on prerequisites/schema; FAIL on unexpected confirmed error | Recheck app/token/schema/query |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root MCP policy and scenario index |
| [`../../feature-catalog/mcp/search-notes.md`](../../feature-catalog/mcp/search-notes.md) | Catalog entry for live search |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Search tool and schema-verification rule |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Empty results and connection recovery |

---

## 5. SOURCE METADATA

- Group: MCP round-trip
- Playbook ID: `MCP-H002`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mcp-roundtrip/search-live-vault.md`
