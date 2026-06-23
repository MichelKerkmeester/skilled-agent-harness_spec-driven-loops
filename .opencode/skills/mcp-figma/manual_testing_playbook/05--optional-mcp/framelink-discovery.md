---
title: "MCP-001 -- Optional Framelink MCP Discovery Via Code Mode"
description: "This scenario validates optional MCP discovery for `MCP-001`. It focuses on discovering the community Framelink figma manual and tool names live through Code Mode before any invocation."
version: 1.0.0.1
---

# MCP-001 -- Optional Framelink MCP Discovery Via Code Mode

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `MCP-001`.

---

## 1. OVERVIEW

This scenario validates optional MCP discovery for `MCP-001`. It focuses on confirming the optional Framelink Figma MCP (`figma-developer-mcp`, already registered as the `figma` manual in this repo's Code Mode) is discovered through Code Mode (`list_tools` / `search_tools` / `tool_info`) before any tool is invoked, and that no tool name is assumed without discovery. The official Figma Dev Mode MCP is out of scope for this release; mention it at most as a future option, never as a supported path.

### Why This Matters

The skill works fully with the CLI alone, so this path is opt-in. The failure modes it guards against are assuming a tool name without discovery and over-claiming the official Dev Mode MCP as supported. Discovery-first is the contract: confirm the manual and a concrete tool name and schema with `tool_info` before invoking, and surface the `.env` token requirement.

---

## 2. SCENARIO CONTRACT

Operators run the exact command sequence for `MCP-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm the `figma` manual and its tool names are discovered live before use, and the `.env` token requirement is surfaced
- Real user request: `What Figma MCP tools are available through Code Mode?`
- Prompt: `What Figma MCP tools are available through Code Mode?`
- Expected execution process: discover via Code Mode (`list_tools()` filtered to the `figma` prefix, then `search_tools(...)` / `tool_info(...)`); surface that `figma_FIGMA_API_KEY` must be in `.env` (Code Mode prefixes the manual name); do not claim a tool works until `tool_info` confirms it; naming is `figma.figma_<tool>`
- Expected signals: discovery returns the `figma` manual's tools; `tool_info` confirms a concrete tool name and schema; the agent never invokes a guessed tool name; the official Dev Mode MCP is not presented as supported
- Desired user-visible outcome: the agent lists the verified `figma` MCP tools (or reports the token is missing) without claiming unverified tools
- Pass/fail: PASS if discovery confirmed the manual and tool names live AND no tool was claimed without `tool_info` AND the token requirement was surfaced; FAIL if a tool name was assumed without discovery OR the official Dev Mode MCP was presented as a supported path

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Code Mode discovery stays local and is independent of the CLI.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: This scenario is independent of the figma-ds-cli scenarios. It needs Code Mode and `figma_FIGMA_API_KEY` in `.env`. The live-confirmed tools are `get_figma_data` and `download_figma_images`.

1. `list_tools()` filtered to the `figma` prefix  # -> `figma` manual tools listed (or absent if not configured)
2. `search_tools("figma ...")`  # -> relevant tools found
3. `tool_info("figma.figma_<tool>")`  # -> a concrete tool schema confirmed
4. agent reports verified tools + the `.env` token requirement  # -> surfaces `figma_FIGMA_API_KEY`, claims no unverified tool

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-001 | Optional Framelink MCP discovery | Verify the `figma` manual and tool names are discovered live before any invocation | `What Figma MCP tools are available through Code Mode?` | 1. `list_tools()` filtered to the `figma` prefix -> 2. `search_tools("figma ...")` -> 3. `tool_info("figma.figma_<tool>")` -> 4. agent reports verified tools + the `.env` token requirement | Step 1: `figma` manual tools listed (or absent if not configured). Step 2: relevant tools found. Step 3: a concrete tool schema confirmed. Step 4: agent surfaces `figma_FIGMA_API_KEY` need, claims no unverified tool | Code Mode discovery transcript including the `tool_info` output | PASS if discovery confirmed the manual and tool names live AND no tool was claimed without `tool_info` AND the token requirement was surfaced. FAIL if a tool name was assumed without discovery OR the official Dev Mode MCP was presented as a supported path | 1. Confirm `list_tools`/`search_tools` ran before any invocation. 2. Confirm `tool_info` confirmed the exact `figma.figma_<tool>` name. 3. Confirm `figma_FIGMA_API_KEY` in `.env` was surfaced and the official MCP was not over-claimed. |

### Optional Supplemental Checks

Confirm the live-confirmed tools resolve as `figma.figma_get_figma_data` and `figma.figma_download_figma_images` via `tool_info`, and that the agent reports the token missing (rather than claiming a tool works) when `figma_FIGMA_API_KEY` is absent from `.env`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/08--optional-mcp/optional-mcp-context.md` | Feature-catalog source describing the Code Mode discovery-first contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/mcp_wiring.md` | Code Mode `figma` manual wiring, `.env` token, and `figma.figma_<tool>` naming |
| `../../scripts/print-utcp-snippets.sh` | Prints the Code Mode `.utcp_config.json` snippet for the `figma` manual |

---

## 5. SOURCE METADATA

- Group: Optional MCP
- Playbook ID: MCP-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--optional-mcp/framelink-discovery.md`
