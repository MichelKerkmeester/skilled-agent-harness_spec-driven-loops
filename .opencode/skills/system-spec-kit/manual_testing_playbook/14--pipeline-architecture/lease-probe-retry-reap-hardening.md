---
title: "423 -- Lease Probe Retry Reap Hardening"
description: "Manual check for the automated-test-backed lease-probe path that retries the lease holder several times before declaring a dead socket, so a single slow probe no longer triggers a spurious daemon reap."
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
- Expected signals: `node --check` exits cleanly for the bridge; `launcher-reap-hardening.vitest.ts` passes including the retry-then-succeed and retry-then-reap cases; `probeLeaseHolderWithRetries` and `resolveLeaseProbeAttempts` appear at their definitions and at the reap-path call site.
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

Shell transcript for all commands: the `node --check` exit status, the vitest pass summary for `tests/launcher-reap-hardening.vitest.ts`, and the grep output showing the retrying probe, the attempt-count resolver, and the reap-path call site that wires them together.

### Pass / Fail

- **Pass**: the syntax check passes, the reap-hardening suite passes, and both the retrying probe and the attempt-count resolver are defined and drive the reap decision.
- **Fail**: the syntax check fails, any retry-then-succeed or retry-then-reap case fails, or either helper is missing from the grep output or is not wired into the reap path.

### Failure Triage

If the syntax check fails, inspect the helper placement and the CommonJS exports first. If the retry-then-succeed case fails, confirm a later successful probe stops the retry loop and prevents the reap. If the retry-then-reap case fails, compare the loop count against `resolveLeaseProbeAttempts` and confirm the reap only fires after the configured consecutive failures. If grep cannot find the helpers, confirm both the definitions and the reap-path call site exist.

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [14--pipeline-architecture/lease-probe-retry-reap-hardening.md](../../feature_catalog/14--pipeline-architecture/lease-probe-retry-reap-hardening.md)
- Spec packet: [../../../../specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/019-dead-socket-reap-hardening/implementation-summary.md](../../../../specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/019-dead-socket-reap-hardening/implementation-summary.md)

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 423
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `14--pipeline-architecture/lease-probe-retry-reap-hardening.md`
