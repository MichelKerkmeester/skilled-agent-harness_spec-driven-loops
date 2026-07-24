---
title: "CU-011 -- mcp list / list-tools"
description: "This scenario validates the cursor-agent mcp list and mcp list-tools subcommands for `CU-011`. It focuses on confirming both commands run cleanly whether or not any MCP server is configured on this machine."
version: 1.0.0.0
---

# CU-011 -- mcp list / list-tools

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CU-011`.

---

## 1. OVERVIEW

This scenario validates `cursor-agent mcp list` and `cursor-agent mcp list-tools <id>` for `CU-011`. It focuses on confirming both commands run cleanly - an empty result is a valid, documented outcome, not a failure - and that `list-tools` surfaces real tool names when at least one server is configured.

### Why This Matters

Cursor CLI is an MCP **client** only, per `references/cursor-tools.md` §5 - it discovers and uses already-configured servers, with no documented mode of acting as an MCP server itself. This scenario proves the client-side subcommand surface is reachable end to end, which is the precondition for any task that needs `--approve-mcps` (`CU-012`) to matter at all.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-011` and confirm the expected signals without contradictory evidence.

- Objective: Verify `cursor-agent mcp list` exits 0 whether or not a server is configured, and `cursor-agent mcp list-tools <id>` surfaces tools when one is.
- Real user request: `What MCP servers does Cursor CLI already know about on this machine?`
- Prompt: `Confirm cursor-agent mcp list runs cleanly and, if any server is configured, list-tools <id> surfaces its tools.`
- Expected execution process: Operator runs `cursor-agent mcp list` -> records whether the result is empty or populated -> if populated, runs `cursor-agent mcp list-tools <id>` against the first listed server id -> confirms at least one tool name is returned.
- Expected signals: `cursor-agent mcp list` exits 0 regardless of result content. If at least one server is listed, `cursor-agent mcp list-tools <id>` exits 0 and names at least one tool.
- Desired user-visible outcome: Confirmation the MCP client subcommand surface is reachable and behaves correctly whether or not any server happens to be configured on this machine - an honest report either way, not an assumed-populated result.
- Pass/fail: PASS if `mcp list` exits 0 AND (the list is empty OR `list-tools` on a listed server exits 0 with at least one tool). FAIL if `mcp list` itself errors/exits non-zero, or if a listed server's `list-tools` errors out.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run `cursor-agent mcp list` and capture the output verbatim.
2. If the list is empty, record that honestly as the observed state (not a failure).
3. If the list is non-empty, pick the first server id and run `cursor-agent mcp list-tools <id>`.
4. Confirm at least one tool name is returned.
5. Return a PASS/FAIL verdict naming the server count and, if any, the tool names observed.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-011 | mcp list / list-tools | Verify mcp list and list-tools behave correctly whether or not a server is configured | `Confirm cursor-agent mcp list runs cleanly and, if any server is configured, list-tools <id> surfaces its tools.` | 1. `bash: cursor-agent mcp list > /tmp/cli-cursor-cu011-list.txt 2>&1; echo "exit=$?" >> /tmp/cli-cursor-cu011-list.txt` -> 2. `bash: cat /tmp/cli-cursor-cu011-list.txt` -> 3. `bash: SERVER_ID=$(grep -oE "^[a-zA-Z0-9_-]+" /tmp/cli-cursor-cu011-list.txt \| head -1)` -> 4. `bash: [ -n "$SERVER_ID" ] && cursor-agent mcp list-tools "$SERVER_ID" > /tmp/cli-cursor-cu011-tools.txt 2>&1; echo "exit=$?" >> /tmp/cli-cursor-cu011-tools.txt \|\| echo "no server configured - list-tools step skipped" > /tmp/cli-cursor-cu011-tools.txt` -> 5. `bash: cat /tmp/cli-cursor-cu011-tools.txt` | Step 1: exit 0 recorded regardless of content; Step 2: list contents visible (possibly empty); Step 3: server id extracted if present; Step 4-5: if a server exists, `list-tools` exits 0 and names at least one tool; if none exists, the empty state is recorded honestly | `mcp list` output with exit code, `mcp list-tools` output (or the honest "no server configured" note) | PASS if `mcp list` exits 0 AND (list is empty OR `list-tools` on a listed server exits 0 with >=1 tool named); FAIL if `mcp list` itself errors, or a listed server's `list-tools` errors | (1) Re-run `cursor-agent mcp list` to rule out a transient failure; (2) confirm `.cursor/mcp.json`/`~/.cursor/mcp.json` parse cleanly (see `CU-012`); (3) re-check the extracted server id matches the exact id format `mcp list` printed |

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
