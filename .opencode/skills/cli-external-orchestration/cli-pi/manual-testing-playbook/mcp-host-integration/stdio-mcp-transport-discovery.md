---
title: "PI-011 -- Stdio MCP transport discovery"
description: "This scenario verifies whether a pinned raw transcript exists for the native stdio MCP connection; without that artifact it records a documented SKIP rather than claiming a live handshake."
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

- Objective: Verify that a pinned raw transcript and digest exist for the native stdio MCP connection before claiming a live tool discovery result.
- Real user request: `Verify that Pi can connect the project's native stdio MCP server and show its tool in the available-tool list.`
- Prompt: `List your available tools and include the names discovered from the configured stdio MCP servers. Do not call a tool or modify files.`
- Expected execution process: Inspect the project MCP configuration and look for a pinned raw transcript plus its SHA-256 digest. Do not install an optional package, change MCP configuration, or run a provider-backed probe.
- Expected signals: A pinned transcript contains the exact stdio handshake and discovered tool name, and its recorded digest matches. The implementation summary prose is not a raw transcript.
- Desired user-visible outcome: PASS only when the reusable evidence artifact is present and verifiable; otherwise a documented SKIP with the current blocker.
- Pass/fail: SKIP because no pinned raw stdio transcript artifact or digest is present in this worktree, and the optional `pi-mcp-extension` package is not installed or approved. PASS only after such an artifact is pinned and verified. FAIL only when pinned evidence contradicts the documented stdio behavior.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Read `.pi/mcp.json` and the current package settings.
2. Check whether a raw stdio transcript and SHA-256 digest are pinned with the playbook evidence.
3. If the raw artifact is absent, record `SKIP: no pinned raw stdio transcript artifact or digest is present; the optional pi-mcp-extension package is not installed or approved.`
4. Do not install another package or mutate MCP config during this playbook run.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PI-011 | Stdio MCP transport discovery | Verify pinned native stdio MCP evidence | `List your available tools and include the names discovered from the configured stdio MCP servers. Do not call a tool or modify files.` | Read `.pi/mcp.json` and the current package settings; verify whether a raw transcript and SHA-256 digest are pinned; do not install or probe. | A pinned raw transcript contains the stdio handshake and expected tool name, with a matching digest | No pinned raw stdio transcript artifact or digest is present in this worktree; the implementation summary is prose only. | SKIP with blocker `no pinned raw stdio transcript artifact or digest is present; the optional pi-mcp-extension package is not installed or approved`; PASS only after pinned evidence is available; FAIL only if pinned evidence contradicts the documented behavior. | Keep the scenario cite-only. If evidence is added, verify its digest and preserve the exact command, stdout, stderr, and package version. |

### Optional Supplemental Checks

- Add a disposable-project probe only when the optional package is explicitly approved; preserve the raw transcript, stderr, package version, and digest as new evidence.

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
| `.pi/settings.json` | Current project package settings; absence of the optional package is not a failure |
| `../../references/cli-reference.md` | Offline and output capture rules |

---

## 5. SOURCE METADATA

- Group: MCP Host Integration
- Playbook ID: PI-011
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mcp-host-integration/stdio-mcp-transport-discovery.md`
