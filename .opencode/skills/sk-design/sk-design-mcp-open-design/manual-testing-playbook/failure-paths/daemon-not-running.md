---
title: "FAIL-001 -- Daemon Not Running Is Handled Gracefully"
description: "This scenario validates the daemon failure path for `FAIL-001`. It focuses on confirming a tool call with the app closed fails with a clear daemon-unreachable message and a recovery path."
version: 1.4.0.1
---

# FAIL-001 -- Daemon Not Running Is Handled Gracefully

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FAIL-001`.

---

## 1. OVERVIEW

This scenario validates the daemon failure path for `FAIL-001`. It focuses on confirming that with the desktop app closed, a tool call fails with a clear daemon-unreachable message and surfaces a recovery path, rather than failing silently or pretending success.

### Why This Matters

Every tool call proxies to a daemon the desktop app hosts, so a closed app means the socket is gone and calls cannot work. The skill must escalate that honestly. A silent failure or a fabricated success is the failure mode this scenario guards against.

---

## 2. SCENARIO CONTRACT

Operators run the exact command sequence for `FAIL-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm an app-closed tool call fails clearly and surfaces recovery
- Real user request: `List Open Design projects when the app is not running.`
- Prompt: `Try to list Open Design projects while the desktop app is closed.`
- Expected execution process: confirm the app is closed, attempt a read tool call, observe the failure, and surface the recovery options
- Expected signals: the call fails with a meaningful error naming the unreachable daemon or missing socket, and the agent names the recovery
- Desired user-visible outcome: the agent reports the daemon is unreachable and offers to open the app or start a standalone od --no-open daemon
- Pass/fail: PASS if the call fails with a clear daemon-unreachable message AND recovery is surfaced. FAIL if the call hangs indefinitely OR the agent reports success with no daemon

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. The failure check stays local.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: Close the Open Design desktop app first so the daemon socket is gone. Run this wave last.

1. confirm the desktop app is closed  # -> no daemon socket present
2. `open-design.list_projects({})`  # -> fails with a daemon-unreachable or missing-socket error
3. agent surfaces recovery  # -> open the app, or start a standalone `od --no-open` daemon

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FAIL-001 | Daemon model and tool-surface verification | Verify an app-closed call fails clearly and surfaces recovery | `Try to list Open Design projects while the desktop app is closed.` | 1. confirm app closed -> 2. `open-design.list_projects({})` -> 3. agent surfaces recovery | Step 2: clear daemon-unreachable error, no hang. Step 3: recovery named (open app or `od --no-open`) | Error transcript and the recovery the agent offered | PASS if the call fails clearly AND recovery is surfaced. FAIL if the call hangs OR success is reported with no daemon | 1. Confirm the app is actually closed and the socket is gone. 2. Confirm the error names the daemon or socket. 3. Confirm the agent did not fabricate a result. |

### Optional Supplemental Checks

Start a standalone `node "$OD_BIN" --no-open` daemon and confirm the same read then succeeds against the headless daemon on `127.0.0.1:7456`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/transport/daemon-and-verification.md` | Feature-catalog source describing the daemon model |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/od-cli-reference.md` | Daemon socket model and recovery options |
| `../../references/tool-surface.md` | Live-verification requirement |

---

## 5. SOURCE METADATA

- Group: Failure Paths
- Playbook ID: FAIL-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `failure-paths/daemon-not-running.md`
