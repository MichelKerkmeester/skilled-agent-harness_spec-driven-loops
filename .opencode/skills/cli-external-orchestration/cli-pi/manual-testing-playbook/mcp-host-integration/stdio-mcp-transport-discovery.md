---
title: "PI-011 -- Stdio MCP transport discovery"
description: "This scenario records the existing live confirmation that `pi-mcp-extension` connects native stdio servers from project configuration for `PI-011`; the captured evidence is cited rather than re-run."
version: 1.0.0.0
---

# PI-011 -- Stdio MCP transport discovery

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `PI-011`.

---

## 1. OVERVIEW

This scenario covers the community MCP extension, project `.pi/mcp.json`, and native stdio server discovery.

### Why This Matters

The repository's native MCP servers use command-plus-arguments stdio configuration. A real tool-list handshake is required before the playbook can claim that Pi's MCP bridge supports this transport.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `pi-mcp-extension` connects a native stdio MCP server and exposes its discovered tool name.
- Real user request: `Verify that Pi can connect the project's native stdio MCP server and show its tool in the available-tool list.`
- Prompt: `List your available tools and include the names discovered from the configured stdio MCP servers. Do not call a tool or modify files.`
- Expected execution process: Read the existing project MCP config and package evidence -> use the already-captured offline Pi probe -> inspect the bridged tool names and lifecycle state.
- Expected signals: `mcp_sequential_thinking_sequentialthinking` appears; the existing five-server capture also shows `memory_context` and related `mk-spec-memory` tools; no provider-backed model turn is required for local discovery.
- Desired user-visible outcome: A confirmed stdio transport connection with exact tool names and a clear distinction between discovery and tool execution.
- Pass/fail: PASS based on the existing captured live stdio evidence. Do not re-run the package install or MCP probe in this scenario. FAIL if a future repeat omits the expected tool or reports a transport/schema error.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Read `.pi/mcp.json` and the installed package settings.
2. Read the existing captured live transcript from the MCP integration record.
3. Verify the exact tool names and lifecycle settings.
4. Do not install another package or mutate MCP config during this playbook run.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PI-011 | Stdio MCP transport discovery | Confirm native stdio MCP discovery | `List your available tools and include the names discovered from the configured stdio MCP servers. Do not call a tool or modify files.` | Existing captured command: `pi install npm:pi-mcp-extension -l --approve` -> configure `.pi/mcp.json` -> `pi --offline --approve -p "list your available tools"` -> inspect tool listing. This scenario is cite-only and does not re-run it. | `mcp_sequential_thinking_sequentialthinking` appears; the full capture also shows `memory_context` and related `mk-spec-memory` tools | Existing captured live output records `mcp_sequential_thinking_sequentialthinking` in the tool list and records `sequential_thinking` plus `mk-spec-memory` connected. | PASS if the cited capture contains the exact stdio tool evidence. FAIL on a future repeat if the tool is absent or the transport handshake fails. | Re-read `.pi/mcp.json`, confirm `transport: "stdio"`, inspect the package version, and capture stderr before changing config. |

### Optional Supplemental Checks

- Repeat in a disposable project after the package version is explicitly reviewed; preserve the old transcript for comparison.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Cite-only and package-trust policy |
| `../../SKILL.md` | Community-package boundary |
| `../../references/mcp-and-third-party-packages.md` | MCP transport and trust guidance |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.pi/mcp.json` | Project stdio server configuration |
| `.pi/settings.json` | Installed `pi-mcp-extension` package entry |
| `../../references/cli-reference.md` | Offline and output capture rules |

---

## 5. SOURCE METADATA

- Group: MCP Host Integration
- Playbook ID: PI-011
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mcp-host-integration/stdio-mcp-transport-discovery.md`
