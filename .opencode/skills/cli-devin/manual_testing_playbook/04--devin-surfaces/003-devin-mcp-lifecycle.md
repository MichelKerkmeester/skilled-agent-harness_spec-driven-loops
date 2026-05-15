---
title: "DV-013 -- devin mcp lifecycle"
description: "This scenario validates that devin mcp add, list, and login form a coherent MCP-server lifecycle for extending Devin sessions with external tools."
---

# DV-013 -- devin mcp lifecycle

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DV-013`.

---

## 1. OVERVIEW

This scenario validates the `devin mcp` lifecycle for `DV-013`. The trio of `devin mcp add <name>`, `devin mcp list`, and `devin mcp login <name>` lets operators register MCP (Model Context Protocol) servers that Devin sessions can call into for external data, tools, or services.

### Why This Matters

`devin mcp` is the direct analog of `codex mcp` and is one of three Devin-side surfaces (alongside rules and skills) that the cli-devin agent delegation surface relies on. If the lifecycle is broken, integrations with services like Linear, GitHub, or custom MCP endpoints are unreachable from Devin.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `devin mcp` lifecycle (add → list → login → re-list) works end-to-end against a stub server.
- Real user request: `Walk me through registering a Devin MCP server end-to-end — add it, log in, confirm it shows up in the list.`
- Prompt: `Run devin mcp list, add a stub MCP server with devin mcp add <name>, log in with devin mcp login <name>, then re-list to confirm registration.`
- Expected execution process: Operator runs initial `mcp list` to capture baseline -> runs `mcp add <name>` against a stub endpoint -> runs `mcp login <name>` (OAuth or token entry) -> re-runs `mcp list` and confirms the new server appears.
- Expected signals: All four invocations exit 0. The added server appears in the post-add `mcp list` output. The login flow surfaces an OAuth prompt or token entry. Operator records the full transcript.
- Desired user-visible outcome: A working MCP-server registration with audit trail showing add → login → list lifecycle.
- Pass/fail: PASS if all four invocations exit 0 AND the new server appears in post-add list. FAIL if any step errors OR if the new server is not visible after add.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run `devin mcp list` for baseline.
2. Pick a stub server name (e.g. `dv-013-stub-mcp`).
3. Run `devin mcp add dv-013-stub-mcp`.
4. Run `devin mcp login dv-013-stub-mcp` — operator handles any OAuth/token prompts.
5. Run `devin mcp list` again and confirm the new server is listed.
6. Return a PASS/FAIL verdict naming the four exit codes and the post-add list contents.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DV-013 | `devin mcp` lifecycle | Verify the MCP add → list → login → re-list lifecycle | `Run devin mcp list, add a stub MCP server with devin mcp add <name>, log in with devin mcp login <name>, then re-list to confirm registration.` | 1. `bash: devin mcp list > /tmp/dv-013-pre-list.txt 2>&1; echo "Pre-list exit: $?"` -> 2. `bash: devin mcp add dv-013-stub-mcp > /tmp/dv-013-add.txt 2>&1; echo "Add exit: $?"` -> 3. `bash: devin mcp login dv-013-stub-mcp > /tmp/dv-013-login.txt 2>&1; echo "Login exit: $?"` -> 4. `bash: devin mcp list > /tmp/dv-013-post-list.txt 2>&1; echo "Post-list exit: $?"` -> 5. `bash: grep dv-013-stub-mcp /tmp/dv-013-post-list.txt` | Steps 1-4: all exit 0; Step 5: the stub server name appears in the post-add list | All four captured stdouts, exit codes, terminal transcript with OAuth prompt evidence | PASS if all four exit 0 AND the stub server appears in post-add list; FAIL if any step errors OR if the server is not visible after add | (1) Confirm `devin mcp` is in `devin --help`; (2) inspect `~/.config/devin/config.json` for MCP servers section; (3) check Devin web UI for MCP server management |

### Optional Supplemental Checks

- After successful add+login, dispatch a small task that exercises the stub server's tool surface and verify Devin can call into it.
- Try `devin mcp remove <name>` (if supported) to clean up after the test.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` (§3 Subcommand Map) | Documents `devin mcp {add, list, login}` |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 Devin Agent Delegation (MCP row) + §3 Unique Devin Capabilities |
| `../../references/devin_tools.md` (§1.5) | Cross-CLI MCP comparison |

---

## 5. SOURCE METADATA

- Group: Devin Surfaces
- Playbook ID: DV-013
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--devin-surfaces/003-devin-mcp-lifecycle.md`
