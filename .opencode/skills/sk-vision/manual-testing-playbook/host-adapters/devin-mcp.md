---
title: "VSN-019 -- Devin MCP attachment"
description: "This scenario validates Devin MCP attachment for `VSN-019`. It focuses on project config, connection, and namespaced tool access."
version: 1.0.0.0
---

# VSN-019 -- Devin MCP attachment

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `VSN-019`.

---

## 1. OVERVIEW

This scenario validates Devin MCP attachment for `VSN-019`. It focuses on project config, connection, and namespaced tool access.

### Why This Matters

Devin, like Cursor, often runs a text-only model such as GLM that cannot see an attached image; the sk-vision MCP tools are how that model gains vision, which is the whole point of the Devin path. Devin also prefixes MCP tool names with the server identity, so a valid process is insufficient if project loading or the expected `mcp__sk-vision__<tool>` namespace is wrong — a vision-blind model that reaches for the wrong name gets nothing.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `VSN-019` and confirm the expected signals without contradictory evidence.

- Objective: verify Devin's project config, attach `sk-vision`, and call `mcp__sk-vision__sk_vision_status`
- Real user request: `Make sure the repository's vision MCP server works in Devin.`
- Prompt: `Confirm Devin attaches the repository's sk-vision MCP server and can call its namespaced status tool.`
- Expected execution process: parse and assert `.devin/mcp_config.json`, restart the project session so Devin reloads MCP servers, then call the namespaced status tool.
- Expected signals: the JSON assertion prints `sk-vision`; Devin reports the server attached; the namespaced call returns provider and load-state text without loading weights.
- Desired user-visible outcome: confirmation that Devin can use all shared sk-vision tools through its documented MCP namespace.
- Pass/fail: PASS if the project config is exact, Devin attaches, and the namespaced status call succeeds; FAIL if JSON, attachment, namespace, or tool execution fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VSN-019 | Devin MCP attachment | Verify project config, host connection, and namespaced status tool | Confirm Devin attaches the repository's sk-vision MCP server and can call its namespaced status tool. | 1. bash: `node -e 'const path=require("path"); const p=require("./.devin/mcp_config.json"); const e=p.mcpServers["sk-vision"]; if(!e)throw new Error("missing sk-vision"); if(e.command!=="node")throw new Error("bad command"); if(e.args[0]!==path.resolve(".opencode/skills/sk-vision/vision-runtime/dist/mcp-server.js"))throw new Error("bad path"); console.log(Object.keys(p.mcpServers));'` -> 2. Devin: restart the project session from this repository and confirm MCP server `sk-vision` attached -> 3. agent: `Call mcp__sk-vision__sk_vision_status and report the provider and whether the model is loaded.` | Step 1 exits 0 and prints `sk-vision`; Step 2 reports the server attached; Step 3 returns status text containing `provider: photon` and a load state | JSON assertion output, Devin attachment evidence, and the namespaced status response | PASS if all three steps succeed through `mcp__sk-vision__sk_vision_status`; FAIL on invalid JSON, failed attachment, wrong namespace, or failed call | 1. Re-run VSN-017 -> 2. Check `.devin/mcp_config.json` and its absolute path -> 3. Restart the Devin project session -> 4. inspect MCP stderr -> 5. Confirm the tool begins with `mcp__sk-vision__` |

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Confirm Devin attaches the repository's sk-vision MCP server and can call its namespaced status tool.`

### Commands

1. `bash: node -e '<Devin JSON and exact-entry assertion from the scenario table>'`
2. `Devin: restart the project session from this repository and confirm MCP server sk-vision attached`
3. `agent: Call mcp__sk-vision__sk_vision_status and report the provider and whether the model is loaded.`

### Expected

The assertion prints `sk-vision`, Devin reports the server attached, and the namespaced status call returns `provider: photon` plus a load state.

### Evidence

Capture the assertion output, Devin's attachment state, and the complete namespaced status response.

### Pass / Fail

- **Pass**: the exact config loads, Devin attaches, and `mcp__sk-vision__sk_vision_status` succeeds
- **Fail**: config, attachment, namespace, or tool-call checks fail

### Failure Triage

1. Prove the standalone server with VSN-017 -> 2. Recheck the project config path and server key -> 3. restart Devin -> 4. inspect stderr and namespacing.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/host-adapters/mcp-transport.md` | Feature-catalog source describing the shared transport |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.devin/mcp_config.json` | Devin repository MCP registration |
| `vision-runtime/dist/mcp-server.js` | Built stdio process Devin launches |
| `vision-runtime/src/mcp/server.test.ts` | Protocol-level list and status regression coverage |

---

## 5. SOURCE METADATA

- Group: Host adapters
- Playbook ID: VSN-019
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `host-adapters/devin-mcp.md`
