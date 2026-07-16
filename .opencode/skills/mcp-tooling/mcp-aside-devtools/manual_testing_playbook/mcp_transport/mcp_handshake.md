---
title: "ASD-008 -- MCP stdio handshake"
description: "This scenario validates the MCP transport for `ASD-008`. It focuses on completing a JSON-RPC initialize against a spawned `aside mcp` process and closing it cleanly."
version: 1.0.0.0
---

# ASD-008 -- MCP stdio handshake

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ASD-008`.

---

## 1. OVERVIEW

This scenario spawns `aside mcp`, completes the `initialize` handshake over stdio, and confirms the process closes without leaks.

### Why This Matters

The stdio handshake is the entire transport contract: no URL, no port, no credential — a client-spawned child inheriting the signed-in CLI context. It is also where dead-child vs daemon-unavailable failures first become distinguishable (stderr carries the difference), which drives two different recovery paths.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ASD-008` and confirm the expected signals without contradictory evidence.

- Objective: Verify `initialize` returns a `protocolVersion` and `serverInfo.name` of `aside`, and no `aside mcp` process survives the probe.
- Real user request: `"Is the Aside MCP server actually reachable on this machine?"`
- Prompt: `Complete an MCP initialize handshake against aside mcp over stdio and confirm clean shutdown.`
- Expected execution process: probe script run, response inspection, leak check.
- Expected signals: protocol version returned; serverInfo names `aside`; no leaked process.
- Desired user-visible outcome: The handshake summary (protocol, server version) with a PASS verdict.
- Pass/fail: PASS if all three signals hold; FAIL on no response or a leaked process.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Complete an MCP initialize handshake against aside mcp over stdio and confirm clean shutdown.`

### Commands

1. `bash: bash .opencode/skills/mcp-tooling/mcp-aside-devtools/examples/mcp-handshake-probe.sh /tmp/aside-mcp-fixtures`
2. `bash: pgrep -fl "aside mcp" || echo "no leaked process"`

### Expected

- Step 1: exits 0; output shows `protocolVersion` (research-pinned: `2024-11-05`) and `serverInfo` with name `aside`
- Step 2: no leaked process

### Evidence

The saved fixture file (`handshake-*.jsonl`), the probe's stdout, and the leak-check output. A protocol version differing from `2024-11-05` is a version-drift finding, not a failure.

### Pass / Fail

- **Pass**: initialize responded AND serverInfo names `aside` AND no leaked process.
- **Fail**: no response (triage below) or leaked process.

### Failure Triage

1. No response with stderr mentioning daemon/browser unavailability: classify DAEMON_UNAVAILABLE — respawning will not help; check the Aside app is running and escalate.
2. No response with a silently-exited child: classify a dead stdio child; respawn once, then escalate with both stderr captures.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/examples/mcp-handshake-probe.sh` | Probe implementation |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/mcp_wiring.md` | Handshake contract and fixture policy |

---

## 5. SOURCE METADATA

- Group: MCP TRANSPORT
- Playbook ID: ASD-008
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `mcp_transport/mcp_handshake.md`
