---
title: "PI-012 -- Streamable HTTP positive control"
description: "This scenario records the documented remote `streamable-http` shape separately from stdio lifecycle evidence and SKIPs until a pinned live HTTP handshake is available."
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

- Objective: Record the documented remote transport shape and verify whether a pinned live HTTP handshake exists; do not infer remote connectivity from stdio lifecycle evidence.
- Real user request: `Check the documented remote MCP shape and prove that Pi's startup list contains only servers configured to connect eagerly.`
- Prompt: `Report the configured MCP servers, their transport and lifecycle values, and which servers are connected after startup. Do not invoke any tool.`
- Expected execution process: Read the package's documented `streamable-http` shape -> inspect `.pi/mcp.json` lifecycle values -> search for a pinned raw HTTP handshake and digest. Keep any stdio lifecycle evidence in PI-011 and do not install or probe a remote endpoint.
- Expected signals: The documentation contains the remote transport shape; lifecycle values are recorded as configuration facts; a live remote claim requires a pinned handshake with matching digest.
- Desired user-visible outcome: A clear separation between documented transport support, stdio startup lifecycle, and verified remote connectivity.
- Pass/fail: SKIP because no pinned live streamable-HTTP handshake and digest are available. PASS only when that artifact exists and verifies the remote handshake. FAIL only when pinned remote evidence contradicts the documented transport behavior.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Read the package reference for `streamable-http`.
2. Read `.pi/mcp.json` and record each `lifecycle` value.
3. Search the repository for a pinned raw streamable-HTTP transcript and digest.
4. If no such artifact exists, record `SKIP: no pinned live streamable-HTTP handshake and digest are available.` Do not install a package, contact a remote endpoint, or rewrite MCP config.
5. Report transport support, stdio lifecycle evidence, and remote handshake evidence as separate claims.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PI-012 | Streamable HTTP positive control | Separate documented remote shape from live handshake | `Report the configured MCP servers, their transport and lifecycle values, and which servers are connected after startup. Do not invoke any tool.` | `rg -n 'streamable-http|lifecycle' .opencode/skills/cli-external-orchestration/cli-pi/references/mcp-and-third-party-packages.md .pi/mcp.json`; search for a pinned raw HTTP transcript and digest; do not install or probe. | The reference shows the documented remote shape; lifecycle values are recorded; a remote connection is reported only when a pinned handshake and matching digest exist | No pinned live streamable-HTTP handshake or digest is available; existing lifecycle evidence is not a remote handshake. | SKIP with blocker `no pinned live streamable-HTTP handshake and digest are available`; PASS only after pinned evidence is verified; FAIL only if pinned evidence contradicts the documented behavior. | Keep the remote claim separate from PI-011. Preserve the exact request, response, stderr, package version, and digest if a future probe is approved. |

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
