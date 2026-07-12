---
title: "423 -- Lease Probe Retry Reap Hardening"
description: "Manual check for the automated-test-backed lease-probe path that retries the lease holder several times before declaring a dead socket, so a single slow probe no longer triggers a spurious daemon reap."
version: 3.6.0.2
---

# 423 -- Lease Probe Retry Reap Hardening

## 1. OVERVIEW

This scenario verifies that the launcher IPC bridge probes the lease holder several times before it concludes the socket is dead and reaps it. Before this hardening, a single failed probe against a momentarily busy or slow lease holder could declare the socket dead and reap a perfectly healthy daemon, dropping MCP transport for every bridged session that depended on it.

The check is automated-test-backed. A human runs the bridge syntax check, the reap-hardening unit suite, and a grep that proves the retrying probe and the attempt-count resolver are defined and wired into the reap decision. Together they confirm the bridge only reaps after the configured number of consecutive probe failures, not after a single transient miss.

## 2. SCENARIO CONTRACT

- Objective: Confirm the lease probe retries up to the configured attempt count and only reaps the socket after consecutive failures, not after one transient probe miss.
- Real user request: `My daemon keeps getting killed when the machine is busy, even though it was fine. Does the launcher retry the lease check before deciding the socket is dead?`
- Prompt: `Validate the launcher lease-probe retry hardening and confirm reap only fires after the configured number of consecutive probe failures.`
- Expected execution process: Run the IPC bridge syntax check, run the reap-hardening unit tests, and grep for the retrying probe and attempt-count resolver to confirm they are defined and drive the reap decision.
- Expected signals: `node --check` exits cleanly for the bridge. `launcher-reap-hardening.vitest.ts` passes including the retry-then-succeed and retry-then-reap cases. `probeLeaseHolderWithRetries` and `resolveLeaseProbeAttempts` appear at their definitions and at the reap-path call site.
- Desired user-visible outcome: A momentarily slow or busy lease holder survives transient probe failures, and only a genuinely dead socket is reaped.
- Pass/fail: PASS only when syntax, unit tests, and probe-retry wiring all match expectations.

## 3. TEST EXECUTION

### Prompt

```text
Validate the launcher lease-probe retry hardening and confirm reap only fires after the configured number of consecutive probe failures.
```

### Commands

1. `node --check .opencode/bin/lib/launcher-ipc-bridge.cjs`
2. `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/launcher-reap-hardening.vitest.ts`
3. `rg -n "probeLeaseHolderWithRetries|resolveLeaseProbeAttempts" .opencode/bin/lib/launcher-ipc-bridge.cjs`

### Expected

- Command 1 exits with no syntax errors.
- Command 2 passes the reap-hardening suite, including the case where a later retry succeeds and the case where all attempts fail and the socket is reaped.
- Command 3 shows `probeLeaseHolderWithRetries` and `resolveLeaseProbeAttempts` at their definitions and at the reap-path call site that resolves the attempt count and probes with retries.

### Evidence

Command 1:

```text
$ node --check .opencode/bin/lib/launcher-ipc-bridge.cjs
(no output)
Exit status: 0
```

Command 2:

```text
$ cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/launcher-reap-hardening.vitest.ts

 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  14:57:20
   Duration  90ms (transform 15ms, setup 15ms, import 8ms, tests 2ms, environment 0ms)
```

Command 3:

```text
$ rg -n "probeLeaseHolderWithRetries|resolveLeaseProbeAttempts" .opencode/bin/lib/launcher-ipc-bridge.cjs
52:function resolveLeaseProbeAttempts(env = process.env) {
357:async function probeLeaseHolderWithRetries(socketPath, options = {}) {
363:    attempts = resolveLeaseProbeAttempts(),
434:  const probeAttempts = resolveLeaseProbeAttempts();
435:  const probe = await probeLeaseHolderWithRetries(socketPath, {
469:  probeLeaseHolderWithRetries,
471:  resolveLeaseProbeAttempts,
```

### Pass / Fail

- **PASS**: the syntax check passed with exit status 0, the reap-hardening suite passed with 1 test file and 6 tests passing, and the grep output shows both helper definitions plus the reap-path call site resolving `probeAttempts` and passing it to `probeLeaseHolderWithRetries`.

### Failure Triage

If the syntax check fails, inspect the helper placement and the CommonJS exports first. If the retry-then-succeed case fails, confirm a later successful probe stops the retry loop and prevents the reap. If the retry-then-reap case fails, compare the loop count against `resolveLeaseProbeAttempts` and confirm the reap only fires after the configured consecutive failures. If grep cannot find the helpers, confirm both the definitions and the reap-path call site exist.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/pipeline_architecture/lease_probe_retry_reap_hardening.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | Primary implementation anchor |
| `mcp_server/tests/launcher-reap-hardening.vitest.ts` | Regression or validation anchor |

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 423
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `pipeline_architecture/lease_probe_retry_reap_hardening.md`
