---
title: "VSN-017 -- Standalone MCP server"
description: "This scenario validates standalone MCP launch for `VSN-017`. It focuses on Node startup and an exact 13-tool inventory."
version: 1.0.0.0
---

# VSN-017 -- Standalone MCP server

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `VSN-017`.

---

## 1. OVERVIEW

This scenario validates standalone MCP launch for `VSN-017`. It focuses on Node startup and an exact 13-tool inventory.

### Why This Matters

Cursor and Devin both depend on this one process. A direct protocol check separates transport failures from host configuration failures.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `VSN-017` and confirm the expected signals without contradictory evidence.

- Objective: launch the built MCP stdio server with Node and receive exactly 13 tools from `tools/list`
- Real user request: `Check that the standalone sk-vision MCP server exposes every vision tool.`
- Prompt: `Launch the sk-vision MCP server directly and confirm it advertises all 13 tools.`
- Expected execution process: verify the built file, start it through the official MCP client with model provisioning disabled, call `tools/list`, and close the session.
- Expected signals: the client connects without stderr protocol errors and prints JSON with `count: 13` plus all canonical `sk_vision_*` names.
- Desired user-visible outcome: a concise confirmation that the standalone server is healthy and complete.
- Pass/fail: PASS if startup succeeds and `tools/list` returns exactly 13 unique canonical names; FAIL if startup errors, the protocol disconnects, or the count differs.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VSN-017 | Standalone MCP server | Launch the built stdio server and verify the complete inventory | Launch the sk-vision MCP server directly and confirm it advertises all 13 tools. | 1. bash (workdir: `vision-runtime/`): `test -f dist/mcp-server.js` -> 2. bash (workdir: `vision-runtime/`): `node --input-type=module -e 'import { Client } from "@modelcontextprotocol/sdk/client/index.js"; import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js"; const t=new StdioClientTransport({command:"node",args:[process.cwd()+"/dist/mcp-server.js"],env:{...process.env,SK_VISION_DISABLE_AUTO_PROVISION:"1"}}); const c=new Client({name:"vsn-017",version:"1.0.0"}); await c.connect(t); const r=await c.listTools(); console.log(JSON.stringify({count:r.tools.length,names:r.tools.map(x=>x.name)})); await c.close(); if(r.tools.length!==13)process.exit(1);'` | The file check exits 0; the MCP command exits 0 and prints `count: 13` with all canonical names | Command exit codes and the complete JSON `tools/list` summary | PASS if both commands exit 0 and the list contains exactly 13 unique `sk_vision_*` tools; FAIL on spawn, protocol, duplicate, missing-tool, or count errors | 1. Rebuild `vision-runtime/dist/mcp-server.js` -> 2. Run `vision-runtime/src/mcp/server.test.ts` -> 3. Check that stdout contains only MCP frames -> 4. Compare registration against `skVisionTools` |

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Launch the sk-vision MCP server directly and confirm it advertises all 13 tools.`

### Commands

1. `bash (workdir: vision-runtime/): test -f dist/mcp-server.js`
2. `bash (workdir: vision-runtime/): node --input-type=module -e '<official MCP Client + StdioClientTransport tools/list script from the scenario table>'`

### Expected

The process connects over stdio and prints a `tools/list` summary with `count: 13` and the complete canonical name roster.

### Evidence

Capture both exit codes and the complete JSON output containing the count and names.

### Pass / Fail

- **Pass**: startup succeeds and exactly 13 unique canonical tools are listed
- **Fail**: startup or protocol fails, or any tool is missing, duplicated, or extra

### Failure Triage

1. Confirm the built file exists -> 2. Rebuild the package if missing -> 3. Run the MCP integration test -> 4. Inspect stdout pollution and shared registry loading.

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
| `vision-runtime/src/mcp/server.ts` | MCP stdio server and shared tool registration |
| `vision-runtime/src/mcp/server.test.ts` | Official-client 13-tool and status integration test |
| `vision-runtime/dist/mcp-server.js` | Built process launched by both host configs |

---

## 5. SOURCE METADATA

- Group: Host adapters
- Playbook ID: VSN-017
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `host-adapters/mcp-standalone.md`
