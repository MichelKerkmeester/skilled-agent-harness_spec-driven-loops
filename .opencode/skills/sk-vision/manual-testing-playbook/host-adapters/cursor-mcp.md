---
title: "VSN-018 -- Cursor MCP attachment"
description: "This scenario validates Cursor MCP attachment for `VSN-018`. It focuses on merged config preservation, connection, and a status call."
version: 1.0.0.0
---

# VSN-018 -- Cursor MCP attachment

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `VSN-018`.

---

## 1. OVERVIEW

This scenario validates Cursor MCP attachment for `VSN-018`. It focuses on merged config preservation, connection, and a status call.

### Why This Matters

Cursor routinely runs text-only models — GLM, for one — that cannot see an attached image at all. Attaching sk-vision over MCP is how those models gain vision, so this connection is the whole reason sk-vision ships a Cursor path. The standalone server can be healthy while Cursor remains disconnected because of a malformed merge, stale host state, or incorrect launch path, so the config-preservation and connection checks are load-bearing before a vision-blind model can rely on the tools.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `VSN-018` and confirm the expected signals without contradictory evidence.

- Objective: verify the merged Cursor config, attach `sk-vision`, and call `sk_vision_status`
- Real user request: `Make sure the repository's vision MCP server works in Cursor.`
- Prompt: `Confirm Cursor attaches the repository's sk-vision MCP server and can call its status tool.`
- Expected execution process: parse and assert `.cursor/mcp.json`, reload Cursor's MCP servers for this repository, then call the attached status tool.
- Expected signals: the JSON assertion prints four server keys; Cursor reports `sk-vision` connected; `sk_vision_status` returns provider and load-state text without loading weights.
- Desired user-visible outcome: confirmation that Cursor can use the shared sk-vision MCP tools without losing existing MCP services.
- Pass/fail: PASS if the merge preserves all prior servers, Cursor connects, and status succeeds; FAIL if JSON is invalid, a prior server is missing, attach fails, or status errors.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VSN-018 | Cursor MCP attachment | Verify the merged config, host connection, and status tool | Confirm Cursor attaches the repository's sk-vision MCP server and can call its status tool. | 1. bash: `node -e 'const path=require("path"); const p=require("./.cursor/mcp.json"); const e=p.mcpServers["sk-vision"]; for(const k of ["mk-spec-memory","mk_skill_advisor","code_mode","sk-vision"])if(!p.mcpServers[k])throw new Error("missing "+k); if(e.command!=="node")throw new Error("bad command"); if(e.args[0]!==path.resolve(".opencode/skills/sk-vision/vision-runtime/dist/mcp-server.js"))throw new Error("bad path"); console.log(Object.keys(p.mcpServers));'` -> 2. Cursor: reload this repository's MCP configuration and confirm `sk-vision` is connected in Tools & MCP settings -> 3. agent: `Call sk_vision_status and report the provider and whether the model is loaded.` | Step 1 exits 0 and prints all four keys; Step 2 shows `sk-vision` connected; Step 3 returns status text containing `provider: photon` and a load state | JSON assertion output, Cursor MCP connection evidence, and the status tool response | PASS if all three steps succeed and existing servers remain; FAIL on invalid JSON, missing server, failed connection, or failed tool call | 1. Re-run VSN-017 -> 2. Check the absolute path in `.cursor/mcp.json` -> 3. Reload or restart Cursor -> 4. Inspect Cursor MCP stderr -> 5. Confirm Node is on Cursor's process PATH |

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Confirm Cursor attaches the repository's sk-vision MCP server and can call its status tool.`

### Commands

1. `bash: node -e '<Cursor JSON preservation and exact-entry assertion from the scenario table>'`
2. `Cursor: reload this repository's MCP configuration and confirm sk-vision is connected in Tools & MCP settings`
3. `agent: Call sk_vision_status and report the provider and whether the model is loaded.`

### Expected

The assertion prints all four server keys, Cursor reports `sk-vision` connected, and status returns `provider: photon` plus a load state.

### Evidence

Capture the assertion output, Cursor's connection state, and the complete status response.

### Pass / Fail

- **Pass**: prior servers remain, Cursor connects to `sk-vision`, and `sk_vision_status` succeeds
- **Fail**: config, connection, preservation, or tool-call checks fail

### Failure Triage

1. Prove the standalone server with VSN-017 -> 2. Recheck the exact absolute path -> 3. Reload Cursor -> 4. inspect host stderr and Node PATH.

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
| `.cursor/mcp.json` | Cursor repository MCP registration and preserved server roster |
| `vision-runtime/dist/mcp-server.js` | Built stdio process Cursor launches |
| `vision-runtime/src/mcp/server.test.ts` | Protocol-level list and status regression coverage |

---

## 5. SOURCE METADATA

- Group: Host adapters
- Playbook ID: VSN-018
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `host-adapters/cursor-mcp.md`
