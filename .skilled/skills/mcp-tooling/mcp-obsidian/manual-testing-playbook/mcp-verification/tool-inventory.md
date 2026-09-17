---
title: "MCP-M001 -- Tool inventory"
description: "This scenario validates live enumeration of the cyanheads Obsidian MCP tool surface without guessing the nine uncaptured names."
stage: routing
version: 0.1.0.0
---

# MCP-M001 -- Tool inventory

## 1. OVERVIEW

This scenario validates the MCP server's reported 14-tool surface and confirms the five known core callable names.

### Why This Matters

The current references intentionally do not invent the remaining nine names. A live inventory is required before any lower-priority capability is documented or executed.

---

## 2. SCENARIO CONTRACT

- Feature ID: `MCP-M001`
- Feature Name: Tool inventory
- Scenario Objective: Enumerate all server tools, confirm the five known names, and record the remaining nine names for later verification.
- Exact Prompt: `Enumerate the live Obsidian MCP tools, confirm the five documented core names, and report the remaining names without guessing their behavior.`
- Exact Command Sequence: `1. Code Mode: list_tools() -> 2. Code Mode: tool_info("obsidian.obsidian_get_note") -> 3. Code Mode: tool_info("obsidian.obsidian_write_note") -> 4. Code Mode: tool_info("obsidian.obsidian_search_notes") -> 5. Code Mode: tool_info("obsidian.obsidian_manage_tags") -> 6. Code Mode: tool_info("obsidian.obsidian_delete_note")`
- Expected Signals: `list_tools()` reports 14 tools; all five known names resolve; nine additional names are recorded exactly as returned; no capability is inferred from a name alone.
- Evidence: Complete tool list, five schema responses, exact nine-name list, package/server version, and manual registration state.
- Pass/Fail Criteria: PASS if the live inventory contains 14 tools and the five known names resolve; SKIP if the manual/app/token is unavailable; FAIL if the server contradicts the confirmed names or count without a documented version difference.
- Failure Triage: 1. Confirm the `obsidian` manual and npx server launch. 2. Check the app, REST API, token, and Node/npx. 3. Capture version drift and do not add cards from inference.

---

## 3. TEST EXECUTION

### Prerequisites

Running Obsidian with Local REST API v4.0.0+, a token, Node/npx, and a registered `obsidian` manual are required. Local REST API + token setup may be pending.

### Prompt

`Enumerate the live Obsidian MCP tools, confirm the five documented core names, and report the remaining names without guessing their behavior.`

### Commands

1. `list_tools()`
2. `tool_info("obsidian.obsidian_get_note")`
3. `tool_info("obsidian.obsidian_write_note")`
4. `tool_info("obsidian.obsidian_search_notes")`
5. `tool_info("obsidian.obsidian_manage_tags")`
6. `tool_info("obsidian.obsidian_delete_note")`

### Expected

The complete inventory contains 14 tools. The five known names resolve. The other nine names are copied exactly and remain unclassified until individually inspected.

### Evidence

Capture the full list, five schemas, exact remaining names, server package version, and registration/prerequisite state.

### Pass / Fail

- **Pass:** count and five known names match the current reference.
- **Skip:** live manual, app, REST API, or token is unavailable.
- **Fail:** a confirmed tool is absent or the count differs without a version explanation.

### Failure Triage

1. Confirm manual registration and `npx -y obsidian-mcp-server@latest` reachability.
2. Check app, API URL, token, Node, and npx.
3. Record version drift and keep all unknown tools marked `VERIFY`.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-M001 | Tool inventory | Enumerate 14 tools and confirm five known names | `Enumerate the live Obsidian MCP tools, confirm the five documented core names, and report the remaining names without guessing their behavior.` | 1. `list_tools()` -> 2–6. `tool_info` for the five known names | 14 total; five known schemas resolve; nine exact unknown names recorded | Full list, schemas, unknown names, version | PASS on count and names; SKIP on prerequisites; FAIL on unexplained contradiction | Check manual/server/app/token/version |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root inventory policy and scenario index |
| [`../../feature-catalog/mcp/additional-tools-verify.md`](../../feature-catalog/mcp/additional-tools-verify.md) | Catalog entry for the unknown-tool boundary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Last-captured count, known names, and discovery rules |
| [`../../mcp-servers/obsidian-mcp/README.md`](../../mcp-servers/obsidian-mcp/README.md) | `list_tools()`/`tool_info()` verification checkpoints |

---

## 5. SOURCE METADATA

- Group: MCP verification boundary
- Playbook ID: `MCP-M001`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mcp-verification/tool-inventory.md`
