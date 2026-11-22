---
title: "BB-005 -- MCP tools and a Code Mode call"
description: "This scenario validates the Bladebro MCP lane for `BB-005`. It focuses on the five tools over stdio, their Code Mode names and one live synchronous call."
version: 1.0.1.0
---

# BB-005 -- MCP tools and a Code Mode call

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BB-005`.

---

## 1. OVERVIEW

Plan step 6. `bladebro mcp` serves five tools over stdio. Code Mode registers them under the `bladebro` manual, and a `call_tool_chain` call reaches the browser.

### Why This Matters

Code Mode is how agents in this repository reach the tools. The call must be synchronous, because the code string is not run inside an async function.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BB-005` and confirm the expected signals without contradictory evidence.

- Objective: List the five tools over stdio, discover them in Code Mode and make one live `bladebro_see` call.
- Real user request: `Check the Bladebro MCP server lists its tools and that Code Mode can call one on example.com.`
- Prompt: `Check the Bladebro MCP server lists its tools and that Code Mode can call one on example.com.`
- Expected execution process: run the commands in order from the repository root on macOS, read each output and exit status, then judge them against the pass/fail criteria.
- Expected signals: tools/list names act, see, state, run and vision, Code Mode discovers 5 tools as `bladebro.bladebro_{act,see,state,run,vision}` and the call returns the example.com text
- Desired user-visible outcome: The MCP lane works from Code Mode.
- Pass/fail: PASS if all three signals hold. FAIL if a tool is missing, Code Mode does not register the manual or the call errors.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Check the Bladebro MCP server lists its tools and that Code Mode can call one on example.com.`

### Commands

1. `bladebro mcp, then send initialize, notifications/initialized and tools/list over stdio`
2. `Code Mode: list the tools of the `bladebro` manual`
3. `Code Mode call_tool_chain: return bladebro.bladebro_see({ mode: 'content', url: 'https://example.com' });`

### Expected

- `tools: act,see,state,run,vision`
- `Discovered 5 tools from server 'bladebro'`
- The call result holds the example.com page text

### Evidence

The tools/list line, the Code Mode discovery lines and the call result.

### Pass / Fail

- **Pass**: all three signals hold.
- **Fail**: a tool is missing, Code Mode does not register the manual or the call errors.

### Failure Triage

1. If the call fails with `await is only valid in async functions`, drop the `await` and return the call directly.
2. If Code Mode does not register the manual, check the `bladebro` entry in `.utcp_config.json`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `mcp-lane/mcp-tools-and-code-mode.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/mcp-wiring.md` | MCP and Code Mode wiring |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/feature-catalog/transport/mcp-code-mode-lane.md` | Feature catalog entry: MCP lane through Code Mode |

---

## 5. SOURCE METADATA

- Group: MCP Lane
- Playbook ID: BB-005
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mcp-lane/mcp-tools-and-code-mode.md`
