---
title: "ASD-015 -- Dead MCP process (DESTRUCTIVE)"
description: "This scenario validates dead-child recovery for `ASD-015`. It kills a probe-owned aside mcp process, verifies the failure classification, and confirms a clean respawn with no leaks."
version: 1.0.0.0
---

# ASD-015 -- Dead MCP process (DESTRUCTIVE)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ASD-015`.

---

## 1. OVERVIEW

This **destructive** scenario spawns a probe-owned `aside mcp` process, kills it mid-session, verifies the failure is classified as a dead stdio child (distinct from daemon unavailability), and confirms a fresh spawn recovers.

> **DESTRUCTIVE BOUNDARY**: only kill the process this scenario spawned. Never touch an `aside mcp` process owned by another workflow, and never kill the Aside app or daemon.

### Why This Matters

Dead-child and daemon-unavailable failures look identical from the caller's side until stderr is inspected — but their recoveries differ completely (respawn vs escalate). The only supported lifecycle control is closing the stdio process, so recovery-by-respawn must be proven to work and to leave nothing behind.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ASD-015` and confirm the expected signals without contradictory evidence.

- Objective: Kill a probe-owned MCP child mid-session; verify post-kill requests fail with dead-child symptoms; verify a fresh handshake succeeds; verify no leaked processes.
- Real user request: `"The Aside MCP connection died mid-run — recover it."`
- Prompt: `Simulate a dead aside mcp child on a throwaway process, classify the failure, and recover with a clean respawn.`
- Expected execution process: spawn, kill, failure observation, respawn, leak check.
- Expected signals: post-kill EOF/broken-pipe symptoms; dead-child classification; successful fresh handshake; zero leaks.
- Desired user-visible outcome: The failure classification, the recovery evidence, and the leak-check result.
- Pass/fail: PASS if the kill produces a classifiable failure and the respawn handshake succeeds with no leaks; FAIL otherwise.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Simulate a dead aside mcp child on a throwaway process, classify the failure, and recover with a clean respawn.`

### Commands

1. `bash:` spawn a throwaway server with a held-open stdin: `mkfifo /tmp/asd015-in; (aside mcp </tmp/asd015-in >/tmp/asd015-out 2>/tmp/asd015-err &) ; exec 9>/tmp/asd015-in` then send the `initialize` request through fd 9 and confirm a response in `/tmp/asd015-out`.
2. `bash: pgrep -fl "aside mcp"` — record the probe-owned PID (and ONLY that PID).
3. `bash: kill <probe-owned-pid>` — the destructive step.
4. `bash:` attempt a further request through fd 9; observe the broken-pipe/EOF failure; inspect `/tmp/asd015-err`.
5. `bash: bash examples/mcp-handshake-probe.sh /tmp/asd015-recovery` — fresh spawn recovers.
6. `bash: pgrep -fl "aside mcp" || echo "no leaked process"` — final leak check; `bash: exec 9>&-; rm -f /tmp/asd015-in /tmp/asd015-out /tmp/asd015-err`

### Expected

- Step 1: initialize responds on the throwaway process
- Step 4: request fails with dead-child symptoms; stderr shows process death, not daemon-outage messaging
- Step 5: fresh handshake succeeds
- Step 6: no leaked processes

### Evidence

PIDs, kill transcript, post-kill failure output, stderr contents, recovery probe output, and the final leak check.

### Pass / Fail

- **Pass**: classifiable dead-child failure AND successful respawn AND zero leaks.
- **Fail**: unclassifiable failure, failed recovery, or a leaked process.

### Failure Triage

1. Respawn also fails: stderr distinguishing daemon-outage messaging means the real state is DAEMON_UNAVAILABLE — stop respawning and escalate.
2. Leaked process: kill it (it is probe-owned by construction), record the leak as a scenario FAIL, and re-run.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/session-management.md` | Dead-child vs daemon-unavailable distinction |

---

## 5. SOURCE METADATA

- Group: RECOVERY AND FAILURE
- Playbook ID: ASD-015
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `recovery-and-failure/dead-mcp-process.md`
