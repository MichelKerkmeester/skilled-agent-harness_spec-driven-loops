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
| DV-013 | `devin mcp` lifecycle | Verify the MCP add → get → list → remove → clean-post-list cycle (v1.0.2.0: uses real `--` separator syntax + `remove` for clean teardown) | `Run devin mcp list, add a stub stdio MCP server with devin mcp add <name> -- <cmd> [args], inspect via devin mcp get, then remove with devin mcp remove and re-list to confirm clean teardown.` | 1. `bash: devin mcp list > /tmp/dv-013-pre-list.txt 2>&1; echo "Pre-list exit: $?"` -> 2. `bash: devin mcp add dv-013-stub-mcp -- echo test > /tmp/dv-013-add.txt 2>&1; echo "Add exit: $?"` (note the `--` separator before the stdio command) -> 3. `bash: devin mcp get dv-013-stub-mcp > /tmp/dv-013-get.txt 2>&1; echo "Get exit: $?"` -> 4. `bash: devin mcp remove dv-013-stub-mcp > /tmp/dv-013-remove.txt 2>&1; echo "Remove exit: $?"` -> 5. `bash: devin mcp list > /tmp/dv-013-post-list.txt 2>&1; grep -c dv-013-stub-mcp /tmp/dv-013-post-list.txt` (post-list grep should return 0 — clean teardown) | Steps 1-4: all exit 0; Step 5: post-list grep returns 0 (stub gone) | All five captured stdouts, exit codes, terminal transcript | PASS if add_rc=0 AND get_rc=0 AND remove_rc=0 AND post-list grep returns 0 (clean); PARTIAL if any exit non-zero but cleanup still clean; FAIL if stub remains in post-list (pollution) | (1) Confirm `devin mcp` full lifecycle in `devin mcp --help`: add / get / list / remove / login / logout / enable / disable; (2) `devin mcp add` requires `--` separator before stdio command (or `--transport http <URL>` for HTTP); (3) if pollution remains, manually clean via `devin mcp remove <name>` or inspect `~/.config/devin/config.json` |

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
- Feature file path: `04--devin-surfaces/devin-mcp-lifecycle.md`
