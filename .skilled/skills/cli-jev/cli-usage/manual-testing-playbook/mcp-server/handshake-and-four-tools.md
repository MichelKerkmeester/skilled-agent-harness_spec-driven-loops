---
title: "JEV-020 -- The server answers a handshake and claims four tools"
description: "Confirm `jev-mcp` completes a stdio handshake and lists exactly four tools, for `JEV-020`."
version: 1.0.0.0
---

# JEV-020 -- The server answers a handshake and claims four tools

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `JEV-020`.

---

## 1. OVERVIEW

A stdio client starts the server, completes the MCP handshake, lists the tools and exits. The scenario reads the server identity, the protocol version and the advertised tool set.

### Why This Matters

The tool surface is the server's contract with any host that wires it. A fifth tool or a renamed argument changes what an operator's MCP config sees, and this scenario is the check that the four-tool claim stays true.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `JEV-020` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the handshake identifies the `jev` server and that the tool list is exactly `noul`, `choice`, `score` and `run`.
- Real user request: `Start jev-mcp, list the tools it exposes, and shut it down.`
- Prompt: `initialize, then tools/list`
- Expected execution process: run the command sequence in §3 from the repository root, capture the probe's output, then judge the result against the pass/fail criteria below.
- Expected signals: the handshake returns the server name `jev`, its title and version, and a protocol version; the tool list returns exactly the four names, with required arguments `state` and `question`, plus `options` for `choice`, `levels` for `score` and `request` for `run`, and optional provider, model and endpoint on all four.
- Evidence: The probe command, the initialize result, the tool names with their required sets, and the exit status.
- Desired user-visible outcome: the server identity, the protocol version and the four tool names.
- Pass/fail: PASS when the handshake completes and the tool list is exactly those four names with those required sets; FAIL when the handshake fails, a tool is missing or renamed, or a required set differs; SKIP only when the probe cannot start the server — the missing binary is the blocker.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook, including `command -v jev-mcp`.
3. Run the command sequence below exactly as written, from the repository root.
4. Read the initialize result and the tool list from the probe's output.
5. Judge the result against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
python3 specs/cli-jev/001-cli-jev-creation/001-jev-contract-research-and-pin/scratch/mcp-probe.py
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| JEV-020 | MCP handshake | Confirm the handshake identifies the `jev` server and that the tool list is exactly `noul`, `choice`, `score` and `run` | `initialize, then tools/list` | 1. `python3 specs/cli-jev/001-cli-jev-creation/001-jev-contract-research-and-pin/scratch/mcp-probe.py` | The handshake returns the server name `jev`, its title and version, and a protocol version; the tool list returns exactly the four names with required arguments `state` and `question`, plus `options` for `choice`, `levels` for `score` and `request` for `run`, and optional provider, model and endpoint on all four | The probe command, the initialize result, the tool names with their required sets, and the exit status | PASS when the handshake completes and the tool list is exactly those four names with those required sets; FAIL when the handshake fails, a tool is missing or renamed, or a required set differs; SKIP only when the probe cannot start the server, naming the missing binary as the blocker | The probe performs no judgment call, so no credential is needed and nothing leaves the machine. Log lines on stdout mean the server is writing diagnostics to the protocol stream; the operator step is the log-level variable that routes them to stderr |

### Recorded Result

Observed during the phase-001 pin: the handshake returned the server name `jev` with its title and version, and the tool list returned exactly the four names with the required sets above. The probe is a client that owns and kills the server subprocess, which is the one shape in which running `jev-mcp` from a script is correct. Verdict PASS.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `mcp-server/handshake-and-four-tools.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [mcp-server.md](../../references/mcp-server.md) | The host-only rule, the four-tool surface and the operator wiring block |
| [surfaces.md](../../feature-catalog/surfaces/surfaces.md) | The CLI and MCP surfaces side by side |

---

## 5. SOURCE METADATA

- Group: MCP Server
- Playbook ID: JEV-020
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `mcp-server/handshake-and-four-tools.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
