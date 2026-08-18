---
title: "VSN-025 -- MCP server process lifecycle"
description: "This scenario validates MCP server self-termination for `VSN-025`. It focuses on a clean exit on stdin EOF and no orphaned process."
version: 1.0.0.0
---

# VSN-025 -- MCP server process lifecycle

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `VSN-025`.

---

## 1. OVERVIEW

This scenario validates MCP server self-termination for `VSN-025`. It focuses on a clean exit on stdin EOF and no orphaned process.

### Why This Matters

Cursor and Devin launch the MCP server as a child process. If it does not self-terminate when its host goes away, each dispatch leaves an orphaned `node` process behind. The server wires one idempotent shutdown to every teardown path (transport close, stdin `end`/`close`, `SIGTERM`/`SIGINT`/`SIGHUP`) plus a reparent-to-init watchdog for the `SIGKILL` case that emits no signal. This scenario drives the stdin-EOF path deterministically; the `SIGKILL`/reparent backstop is covered by the `server.test.ts` unit tests, since a real reparent cannot be forced from a shell.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `VSN-025` and confirm the expected signals without contradictory evidence.

- Objective: launch the built MCP server with its input closed and confirm the process exits on its own, leaving no orphan
- Real user request: `Make sure the sk-vision MCP server shuts itself down when its host goes away instead of piling up zombie processes.`
- Prompt: `Launch the sk-vision MCP server with its input closed and confirm the process exits on its own without leaving an orphan.`
- Expected execution process: verify the built file, launch it with stdin closed and provisioning disabled under a short timeout, capture the exit code, then confirm no server process remains.
- Expected signals: Step 1 exits 0; Step 2 prints `exit=0` within a couple of seconds (never `exit=124`); Step 3 prints `no orphan`.
- Desired user-visible outcome: a concise confirmation that the server terminates itself and does not linger.
- Pass/fail: PASS if the server exits 0 promptly on stdin EOF and no `mcp-server.js` process remains; FAIL if it hangs to the timeout (`exit=124`), exits nonzero, or an orphan lingers.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VSN-025 | MCP server process lifecycle | Confirm self-termination on stdin EOF with no orphaned process | Launch the sk-vision MCP server with its input closed and confirm the process exits on its own without leaving an orphan. | 1. bash (workdir: `vision-runtime/`): `test -f dist/mcp-server.js` -> 2. bash (workdir: `vision-runtime/`): `SK_VISION_DISABLE_AUTO_PROVISION=1 timeout 10 node dist/mcp-server.js </dev/null; echo "exit=$?"` -> 3. bash: `ps aux \| grep '[d]ist/mcp-server.js' \|\| echo "no orphan"` | Step 1 exits 0; Step 2 prints `exit=0` within a couple of seconds and never `exit=124`; Step 3 prints `no orphan` | The three transcript lines: the file-check exit, the `exit=0` line, and the `no orphan` line | PASS if the server exits 0 promptly on stdin EOF and no `mcp-server.js` process remains; FAIL if it hangs to the timeout (`exit=124`), exits nonzero, or an orphan lingers | 1. Rebuild `vision-runtime/dist/mcp-server.js` -> 2. Run `vision-runtime/src/mcp/server.test.ts` (the lifecycle-guard unit tests) -> 3. Confirm `installMcpLifecycleGuards` is called inside `runSkVisionMcpServer` -> 4. Grep the built artifact for the guard symbols |

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Launch the sk-vision MCP server with its input closed and confirm the process exits on its own without leaving an orphan.`

### Commands

1. `bash (workdir: vision-runtime/): test -f dist/mcp-server.js`
2. `bash (workdir: vision-runtime/): SK_VISION_DISABLE_AUTO_PROVISION=1 timeout 10 node dist/mcp-server.js </dev/null; echo "exit=$?"`
3. `bash: ps aux | grep '[d]ist/mcp-server.js' || echo "no orphan"`

### Expected

The built file exists; with stdin closed the server runs its shutdown and exits 0 within a couple of seconds (never reaching the 10s timeout), and no `mcp-server.js` process is left behind.

### Evidence

Capture all three transcript lines: the file-check exit code, the `exit=0` line, and the `no orphan` line.

### Pass / Fail

- **Pass**: the server exits 0 promptly on stdin EOF and no `mcp-server.js` process remains
- **Fail**: it hangs to the timeout (`exit=124`), exits nonzero, or an orphan lingers

### Failure Triage

1. Rebuild `vision-runtime/dist/mcp-server.js` -> 2. Run `vision-runtime/src/mcp/server.test.ts` (the lifecycle-guard unit tests) -> 3. Confirm `installMcpLifecycleGuards` is called inside `runSkVisionMcpServer` -> 4. Grep the built artifact for the guard symbols.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/host-adapters/mcp-transport.md` | Feature-catalog source describing the shared transport and its lifecycle guards |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `vision-runtime/src/mcp/server.ts` | `installMcpLifecycleGuards` and `runSkVisionMcpServer` |
| `vision-runtime/src/mcp/server.test.ts` | Lifecycle-guard unit tests (stdin-end, idempotency, reparent watchdog) |
| `vision-runtime/dist/mcp-server.js` | Built process launched by both host configs |

---

## 5. SOURCE METADATA

- Group: Host adapters
- Playbook ID: VSN-025
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `host-adapters/mcp-lifecycle.md`
