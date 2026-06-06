---
title: "DV-025 -- devin acp server lifecycle"
description: "This scenario validates that devin acp launches a long-lived Agent Client Protocol server that ACP-aware clients can connect to, and that the server shuts down cleanly when terminated."
---

# DV-025 -- devin acp server lifecycle

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DV-025`.

---

## 1. OVERVIEW

This scenario validates `devin acp` for `DV-025`. The subcommand launches a long-lived Agent Client Protocol (ACP) server that ACP-aware clients can connect to — Devin's analog of cli-opencode's `acp` mode but fronting Devin's autonomous coding loop.

### Why This Matters

`devin acp` is one of cli-devin's unique capabilities. Without it, Devin can only be invoked one-shot per dispatch. The ACP server lets operators embed Devin as a long-lived endpoint in other tools, useful for integrations that need a persistent agent.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `devin acp` launches a long-lived ACP server, accepts at least one ACP request, and shuts down cleanly when terminated.
- Real user request: `Run Devin as an ACP server so I can connect to it from another tool, then verify a single request round trip, then shut it down.`
- Prompt: `Launch devin acp in the background, verify the documented ACP endpoint (host/port) is reachable, send a small ACP request, capture the response, then terminate the server cleanly.`
- Expected execution process: Operator launches `devin acp` in the background -> verifies the endpoint is reachable -> sends a small ACP request -> captures the response -> terminates the server via SIGTERM -> confirms no zombie processes.
- Expected signals: `devin acp` launches and stays up. The endpoint accepts at least one ACP request. The response is parseable. Terminating the process exits cleanly with no zombie state.
- Desired user-visible outcome: A working `devin acp` server validated end-to-end so operators can embed Devin in ACP-aware workflows.
- Pass/fail: PASS if server launches AND endpoint reachable AND one request round-trips AND shutdown clean. FAIL if any step errors OR if the server leaves zombie processes.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Launch `devin acp` in the background; capture PID.
2. Verify the documented endpoint (host/port) — consult Devin's docs for the default; fall back to `devin acp --help` if needed.
3. Send a small ACP request (e.g. via curl, an ACP client, or a sibling cli-opencode session with `--attach <url>`).
4. Capture the response and confirm parseability.
5. Send SIGTERM to the PID; wait for clean exit.
6. Confirm no zombie processes remain via `ps`.
7. Return a PASS/FAIL verdict naming the PID, endpoint, and request round-trip status.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DV-025 | `devin acp` server lifecycle | Verify ACP server launch, request round-trip, and clean shutdown | `Launch devin acp in the background, verify the documented ACP endpoint (host/port) is reachable, send a small ACP request, capture the response, then terminate the server cleanly.` | 1. `bash: devin acp > /tmp/dv-025-acp.log 2>&1 </dev/null & echo "PID=$!"` -> 2. `bash: sleep 3; ps -p <PID> -o pid,command \|\| echo "Server not running"` -> 3. `bash: devin acp --help 2>&1 \| grep -i 'port\|endpoint\|listen'` (to find documented endpoint) -> 4. Send ACP request: e.g. `bash: curl -sS http://localhost:<PORT>/ 2>&1 \| head -5` OR via ACP-aware client. -> 5. `bash: kill -TERM <PID>; wait <PID> 2>/dev/null; echo "Exit: $?"` -> 6. `bash: ps -p <PID> -o pid,command 2>&1 \| grep <PID> \|\| echo "Clean: no zombie"` | Step 1: PID printed; Step 2: server is running; Step 4: ACP request returns parseable response; Step 5: clean exit; Step 6: no zombie | Server log, PID, endpoint discovery output, ACP request/response transcript, shutdown evidence | PASS if all steps succeed; FAIL if server fails to launch, endpoint unreachable, request fails, OR zombie remains | (1) Verify `devin acp` is in `devin --help`; (2) check `devin acp --help` for default port/endpoint; (3) confirm no firewall blocks the local port; (4) if zombie remains, `kill -KILL <PID>` and investigate why SIGTERM didn't propagate |

### Optional Supplemental Checks

- Send multiple sequential ACP requests to confirm the server handles a small request stream.
- Connect from a cli-opencode session via `--attach <url>` to confirm ACP interoperability.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` (§3 Subcommand Map) | Documents `devin acp` |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 Unique Devin Capabilities (ACP row) |
| `../../references/devin_tools.md` (§1.4) | Cross-CLI ACP comparison (Devin vs cli-opencode) |

---

## 5. SOURCE METADATA

- Group: ACP Bridge
- Playbook ID: DV-025
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `09--acp-bridge/devin-acp-server.md`
