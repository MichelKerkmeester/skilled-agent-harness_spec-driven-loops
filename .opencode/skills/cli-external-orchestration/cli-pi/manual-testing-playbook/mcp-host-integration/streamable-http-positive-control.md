---
title: "PI-012 -- Streamable HTTP positive control"
description: "This scenario uses the documented remote `streamable-http` shape and the existing connected-only lifecycle evidence to establish the MCP positive-control baseline for `PI-012`."
version: 1.0.0.0
---

# PI-012 -- Streamable HTTP positive control

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `PI-012`.

---

## 1. OVERVIEW

This scenario is the MCP positive control: the documented remote transport shape is accepted as the configuration baseline, while server lifecycle determines whether a server connects automatically.

### Why This Matters

The package documentation shows a remote `streamable-http` shape, but the current worktree's strongest live signal is the connected-only lifecycle behavior. The playbook must not turn a lazy server's absence from the startup list into a transport failure.

---

## 2. SCENARIO CONTRACT

- Objective: Establish the documented remote transport shape and verify that only eager servers connect automatically while lazy servers remain disconnected until explicitly started.
- Real user request: `Check the documented remote MCP shape and prove that Pi's startup list contains only servers configured to connect eagerly.`
- Prompt: `Report the configured MCP servers, their transport and lifecycle values, and which servers are connected after startup. Do not invoke any tool.`
- Expected execution process: Read the package's documented streamable-http config shape -> inspect `.pi/mcp.json` lifecycle values -> use the existing live discovery capture -> compare eager and lazy results.
- Expected signals: The remote `streamable-http` shape is represented as a positive-control config; eager servers appear connected; two lazy servers correctly do not auto-connect.
- Desired user-visible outcome: A deny-by-default, connected-only baseline that does not equate configured with connected.
- Pass/fail: PASS for the documented-shape and lifecycle baseline from the existing captured evidence. FAIL if a lazy server auto-connects or an eager server is silently exposed without its configured connection state.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Read the package reference for `streamable-http`.
2. Read `.pi/mcp.json` and record each `lifecycle` value.
3. Use the existing live capture; do not re-run package installation or rewrite MCP config.
4. Report transport support and lifecycle evidence as separate claims.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PI-012 | Streamable HTTP positive control | Establish connected-only MCP startup baseline | `Report the configured MCP servers, their transport and lifecycle values, and which servers are connected after startup. Do not invoke any tool.` | Existing captured command: inspect the documented remote `streamable-http` shape -> inspect `.pi/mcp.json` -> `pi --offline --approve -p "list your available tools"` -> compare eager and lazy server results. This scenario is cite-only and does not re-run it. | The captured five-server probe shows eager `sequential_thinking` and `mk-spec-memory` connected; `mk_skill_advisor` and `code_mode` are lazy and did not auto-connect | Existing captured MCP evidence records the two lazy servers correctly remaining disconnected and attributes the deny-by-default behavior to `lifecycle: eager/lazy`. | PASS for the connected-only baseline. FAIL if lazy servers auto-connect or lifecycle is ignored. A remote transport connection itself must not be claimed beyond the documented shape unless a future transcript shows it. | Check the effective `.pi/mcp.json`, package README, and startup stderr; distinguish missing build artifacts from lifecycle behavior. |

### Optional Supplemental Checks

- Run a disposable remote endpoint that returns no sensitive data and capture the actual streamable-http handshake separately.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Connected-only and cite-only policy |
| `../../references/mcp-and-third-party-packages.md` | Transport distinctions and trust boundary |
| `../../references/cli-reference.md` | Offline startup and output capture |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.pi/mcp.json` | Eager/lazy lifecycle configuration |
| `.pi/settings.json` | MCP extension package entry |

---

## 5. SOURCE METADATA

- Group: MCP Host Integration
- Playbook ID: PI-012
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mcp-host-integration/streamable-http-positive-control.md`
