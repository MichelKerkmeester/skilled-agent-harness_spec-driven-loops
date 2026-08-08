---
title: "CU-011 -- mcp list / list-tools"
description: "This scenario validates the cursor-agent mcp list and mcp list-tools subcommands for `CU-011`, with an explicit SKIP when a configured server is not operator-approved."
version: 1.0.0.0
---

# CU-011 -- mcp list / list-tools

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CU-011`.

---

## 1. OVERVIEW

This scenario validates `cursor-agent mcp list` and `cursor-agent mcp list-tools <id>` for `CU-011`. An empty result is a valid outcome; a configured but unapproved server is a trust-state blocker, not permission to mutate the operator's Cursor configuration from the playbook.

### Why This Matters

Cursor CLI is an MCP **client** only, per `references/cursor-tools.md` §5 - it discovers and uses already-configured servers, with no documented mode of acting as an MCP server itself. This scenario proves the client-side subcommand surface is reachable end to end, which is the precondition for any task that needs `--approve-mcps` (`CU-012`) to matter at all.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-011` and confirm the expected signals without contradictory evidence.

- Objective: Verify `cursor-agent mcp list` reports the configured MCP state, use `list-tools <id>` only for an approved server, and record the documented SKIP when approval is missing.
- Real user request: `What MCP servers does Cursor CLI already know about on this machine?`
- Prompt: `Confirm cursor-agent mcp list runs cleanly and, if any server is configured, list-tools <id> surfaces its tools.`
- Expected execution process: Operator runs `cursor-agent mcp list` -> records whether the result is empty or populated -> if populated, records the server approval state without changing it -> runs `list-tools <id>` only for an approved server -> confirms at least one tool name is returned.
- Expected signals: `cursor-agent mcp list` exits 0. An empty list is valid. A configured but unapproved server records the exact blocker `MCP server is configured but not approved; operator must run cursor-agent mcp enable <id> outside playbook`. An approved server's `list-tools <id>` exits 0 and names at least one tool.
- Desired user-visible outcome: Confirmation the MCP client subcommand surface is reachable, with the trust boundary visible instead of silently enabling a server.
- Pass/fail: PASS if `mcp list` exits 0 and the list is empty, or an approved listed server returns tools. SKIP when a configured server is not approved. FAIL if `mcp list` errors/exits non-zero or an approved server's `list-tools` errors out.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run `cursor-agent mcp list` and capture the output verbatim.
2. If the list is empty, record that honestly as the observed state (not a failure).
3. If the list is non-empty, record the first server id and approval state without running `enable`.
4. If the server is configured but not approved, record `SKIP: MCP server is configured but not approved; operator must run cursor-agent mcp enable <id> outside playbook.`
5. If the server is approved, run `cursor-agent mcp list-tools <id>` and confirm at least one tool name is returned.
6. Return a PASS, SKIP, or FAIL verdict naming the server state and any tool names observed.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-011 | mcp list / list-tools | Verify MCP discovery and approval state | `Confirm cursor-agent mcp list runs cleanly and, if an approved server is configured, list-tools <id> surfaces its tools. Do not enable or disable any server.` | 1. `cursor-agent mcp list > /private/tmp/cli-cursor-cu011-list.txt 2>&1; status=$?; printf 'exit=%s\n' "$status" >> /private/tmp/cli-cursor-cu011-list.txt` -> 2. `cat /private/tmp/cli-cursor-cu011-list.txt` -> 3. `read -r SERVER_ID < <(sed -nE 's/^([a-zA-Z0-9_-]+).*$/\1/p' /private/tmp/cli-cursor-cu011-list.txt)` and record the printed approval state -> 4. If the server is configured but unapproved, record `SKIP: MCP server is configured but not approved; operator must run cursor-agent mcp enable <id> outside playbook`; otherwise run `cursor-agent mcp list-tools "$SERVER_ID"` and record its exit and tools | Step 1: list exit 0; an empty list is valid; an unapproved configured server produces the named SKIP blocker; an approved server's list-tools output names at least one tool | `mcp list` output and exit code; approval-state evidence; list-tools output when approved | PASS if the list is empty or an approved server returns tools; SKIP for an unapproved configured server; FAIL if list errors or an approved server's list-tools errors | Do not run `cursor-agent mcp enable` inside the playbook. If approval is required, hand the exact server id and blocker to the operator; after approval, rerun list-tools |

### Optional Supplemental Checks

- If a server is configured, cross-check its listed tools against `.cursor/mcp.json`'s/`~/.cursor/mcp.json`'s declared server entry for consistency.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../references/cursor-tools.md` (§5 MCP Client Support) | Documents the client-only MCP subcommand surface |
| `../../references/cli-reference.md` (§9 MCP Integration) | Authoritative MCP subcommand reference |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cursor-tools.md` | §5 "What It Is" / "Relevance to Orchestrated Dispatch" |
| `../../references/cli-reference.md` | §9 MCP Integration - subcommand list and config precedence |

---

## 5. SOURCE METADATA

- Group: MCP Integration
- Playbook ID: CU-011
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mcp-integration/mcp-list-list-tools.md`
