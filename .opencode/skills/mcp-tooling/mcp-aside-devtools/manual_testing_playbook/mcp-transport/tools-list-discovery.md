---
title: "ASD-009 -- tools/list runtime discovery"
description: "This scenario validates runtime tool discovery for `ASD-009`. It focuses on capturing the tools/list inventory as a fixture and reporting drift from the version-pinned single-repl result."
version: 1.0.0.0
---

# ASD-009 -- tools/list runtime discovery

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ASD-009`.

---

## 1. OVERVIEW

This scenario runs `tools/list` against a spawned `aside mcp` process, saves the inventory as a fixture, and compares it against the research-pinned result (exactly one `repl` tool with required `title` + `code` inputs).

### Why This Matters

The server advertises `tools.listChanged: true`, which makes any hardcoded tool list a defect. The packet's hardest rule — discover, never assume — is only enforceable if discovery itself is a tested, repeatable operation with saved fixtures per installed version.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ASD-009` and confirm the expected signals without contradictory evidence.

- Objective: Verify `tools/list` returns a tools array, the fixture is saved, and the presence/absence of the `repl` tool is explicitly reported. Inventory drift is a finding, not a failure.
- Real user request: `"What can the Aside MCP server on this machine actually do, right now?"`
- Prompt: `Discover the Aside MCP tool inventory at runtime, save it as a fixture, and compare against the documented single-repl result.`
- Expected execution process: probe run, fixture save, drift comparison.
- Expected signals: non-empty tools array; fixture file on disk; explicit drift statement.
- Desired user-visible outcome: The discovered tool names and required inputs, the fixture path, and the drift verdict.
- Pass/fail: PASS if discovery ran and the fixture saved (regardless of drift); FAIL if tools/list returned nothing or the fixture was not persisted.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Discover the Aside MCP tool inventory at runtime, save it as a fixture, and compare against the documented single-repl result.`

### Commands

1. `bash: bash .opencode/skills/mcp-tooling/mcp-aside-devtools/examples/mcp-handshake-probe.sh /tmp/aside-mcp-fixtures`
2. `bash: ls /tmp/aside-mcp-fixtures/handshake-*.jsonl`
3. Inspect the tools array (the probe prints names and required inputs when `jq` is present).

### Expected

- Step 1: probe exits 0 and reports the discovered tools
- Step 2: fixture file exists
- Step 3: research-pinned expectation on `1.26.626.1517`: exactly one tool `repl` with required `title` + `code`

### Evidence

Fixture path and contents; the explicit drift statement ("matches pinned inventory" or "drift: <details>").

### Pass / Fail

- **Pass**: tools array returned AND fixture saved AND drift explicitly stated.
- **Fail**: empty tools array (MCP_TOOLS_EMPTY — triage below) or no fixture.

### Failure Triage

1. MCP_TOOLS_EMPTY: confirm the handshake (ASD-008) passed in the same run; if yes, this is version drift severe enough to re-baseline the packet's MCP reference before any invocation.
2. New tools beyond `repl`: record each name and schema in the fixture; the packet must not invoke them until their contracts are reviewed.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/mcp-wiring.md` | Version-pinned inventory and rediscovery mandate |

---

## 5. SOURCE METADATA

- Group: MCP TRANSPORT
- Playbook ID: ASD-009
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `mcp-transport/tools-list-discovery.md`
