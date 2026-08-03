---
title: "MCP-M002 -- App and token prerequisite boundary"
description: "This scenario validates that a missing MCP app/token prerequisite is reported clearly and that headless routing remains available."
stage: routing
version: 1.0.0.0
---

# MCP-M002 -- App and token prerequisite boundary

## 1. OVERVIEW

This scenario validates the boundary between the app-backed MCP and the headless `notesmd-cli` fallback when no API token or live REST API is available.

### Why This Matters

The MCP requires a running app, Local REST API plugin, and bearer token. A missing prerequisite is an environment blocker, not a reason to route a filesystem task through a failing MCP.

---

## 2. SCENARIO CONTRACT

- Feature ID: `MCP-M002`
- Feature Name: App and token prerequisite boundary
- Scenario Objective: Show the MCP preflight warning with no token and then demonstrate a headless vault preflight remains usable.
- Exact Prompt: `The Obsidian app or API token may be unavailable. Report the MCP blocker and switch a filesystem check to notesmd-cli.`
- Exact Command Sequence: `1. env -u OBSIDIAN_API_KEY OBSIDIAN_BASE_URL="http://127.0.0.1:27123" bash .opencode/skills/mcp-tooling/mcp-obsidian/examples/mcp-roundtrip.sh -> 2. notesmd-cli list-vaults`
- Expected Signals: Step 1 warns that the token or REST API is unavailable and recommends the headless alternative; step 2 still lists registered vaults if notesmd-cli is installed.
- Evidence: Preflight transcript, absence of token value, REST API probe result, headless vault output, and final routing verdict.
- Pass/Fail Criteria: PASS if the MCP blocker is named without exposing a token and the headless check remains available; FAIL if the blocker is hidden, a token is printed, or headless routing is attempted without a binary.
- Failure Triage: 1. Confirm the shell really lacks `OBSIDIAN_API_KEY`. 2. Record whether the app/REST endpoint responds. 3. If notesmd-cli is missing, record the install blocker rather than claiming fallback success.

---

## 3. TEST EXECUTION

### Prerequisites

This boundary scenario does not need the MCP to be healthy. It needs `bash`, `curl` for the optional probe, and `notesmd-cli` for the fallback check. It intentionally does not print or copy any token.

### Prompt

`The Obsidian app or API token may be unavailable. Report the MCP blocker and switch a filesystem check to notesmd-cli.`

### Commands

1. `env -u OBSIDIAN_API_KEY OBSIDIAN_BASE_URL="http://127.0.0.1:27123" bash .opencode/skills/mcp-tooling/mcp-obsidian/examples/mcp-roundtrip.sh`
2. `notesmd-cli list-vaults`

### Expected

The reference script reports an unset token or unreachable REST API and recommends notesmd-cli. The headless command can still inspect registered vaults without an app.

### Evidence

Capture the warning/probe output, confirm no token value appears, and capture the headless vault listing.

### Pass / Fail

- **Pass:** the blocker is explicit and the headless fallback remains usable.
- **Skip:** notesmd-cli is not installed, with the install blocker recorded.
- **Fail:** the token is exposed, the MCP failure is misreported as a note failure, or the fallback is not attempted.

### Failure Triage

1. Verify `OBSIDIAN_API_KEY` is unset without printing it.
2. Record the Local REST API probe result and whether the app is open.
3. Run `notesmd-cli --version` and `list-vaults`; if unavailable, preserve the explicit install blocker.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-M002 | App and token prerequisite boundary | Report MCP blocker and retain headless fallback | `The Obsidian app or API token may be unavailable. Report the MCP blocker and switch a filesystem check to notesmd-cli.` | 1. `env -u OBSIDIAN_API_KEY OBSIDIAN_BASE_URL="http://127.0.0.1:27123" bash .opencode/skills/mcp-tooling/mcp-obsidian/examples/mcp-roundtrip.sh` -> 2. `notesmd-cli list-vaults` | MCP warning; no token leak; headless vault list | Preflight and headless transcripts | PASS if blocker and fallback are clear; SKIP if CLI absent; FAIL on leak or misrouting | Check env safely, probe endpoint, check CLI |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root routing policy and prerequisite rules |
| [`../../feature-catalog/mcp/additional-tools-verify.md`](../../feature-catalog/mcp/additional-tools-verify.md) | Catalog entry for the discovery boundary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../examples/mcp-roundtrip.sh`](../../examples/mcp-roundtrip.sh) | Read-only MCP preflight and headless recommendation |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | App, token, port, and fallback diagnosis |

---

## 5. SOURCE METADATA

- Group: MCP verification boundary
- Playbook ID: `MCP-M002`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mcp-verification/prerequisite-boundary.md`
