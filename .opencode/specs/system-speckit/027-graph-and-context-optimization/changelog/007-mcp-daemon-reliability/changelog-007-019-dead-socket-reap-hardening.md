---
title: "Changelog: Dead-socket reap hardening [007-mcp-daemon-reliability/019-dead-socket-reap-hardening]"
description: "Chronological changelog for the Dead-socket reap hardening phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-15

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/019-dead-socket-reap-hardening` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability`

### Summary

A busy daemon no longer gets killed for being briefly slow. Before this, the lease-holder check ran the deep liveness probe once, and a single failure made the checking launcher reap the owner and spawn a second daemon. An owner mid-FTS-merge or stalled for one probe window was wrongly declared dead, which is exactly the kind of duplicate-daemon thrash that drops transports. Now the owner is declared dead only after N consecutive deep-probe failures.

### Added

- parseNonNegativeInteger helper and resolveLeaseProbeAttempts, resolveLeaseProbeRetryTimeoutMs, and resolveLeaseProbeRetryBackoffMs config resolvers in launcher-ipc-bridge.cjs
- probeLeaseHolderWithRetries in launcher-ipc-bridge.cjs with injectable probe and sleep functions; any alive result short-circuits the retry loop
- launcher-reap-hardening.vitest.ts covering config resolvers and retry-runner behavior (first-alive, dead-then-alive, all-dead, backoff/retry reporting)

### Changed

- Confirmed the single-probe reap decision in maybeBridgeLeaseHolder and the MAX_PROBE_TIMEOUT_MS grace ceiling as the baseline
- Wired probeLeaseHolderWithRetries into maybeBridgeLeaseHolder and exported all helpers from launcher-ipc-bridge.cjs
- Pinned SPECKIT_LEASE_PROBE_RETRIES=0 in the existing single-probe respawn test to preserve its original assertion
- Ran node --check and retry smoke test (9 assertions)

### Fixed

- A busy daemon was wrongly declared dead on a single transient probe miss, causing duplicate-daemon thrash that dropped transports; now declared dead only after N consecutive deep-probe failures within the grace budget

### Verification

- node --check ipc-bridge lib - PASS
- require-time retry smoke (9 assertions) - PASS
- launcher-reap-hardening.vitest.ts - PASS
- launcher-ipc-bridge-probe.vitest.ts (reconciled) - PASS
- launcher suite (watchdog/persistent-log/clean-close/session-proxy) - PASS (no regression)
- comment-hygiene (durable WHY, no ids/paths) - PASS
- validate.sh --strict (this packet) - PASS
- Tasks complete - 12 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | Modified | probeLeaseHolderWithRetries + resolveLeaseProbeAttempts / ...RetryTimeoutMs / ...RetryBackoffMs + parseNonNegativeInteger; wired into maybeBridgeLeaseHolder; all exported |
| `mcp_server/tests/launcher-reap-hardening.vitest.ts` | Created | Config resolvers + retry-runner behavior (first-alive, dead-then-alive, all-dead, backoff/retry reporting) |
| `mcp_server/tests/launcher-ipc-bridge-probe.vitest.ts` | Modified | Pinned SPECKIT_LEASE_PROBE_RETRIES=0 in the single-probe respawn test + env cleanup |

### Follow-Ups

- Heuristic, not consensus. N consecutive failures is a robust heuristic for owner gone, not a distributed consensus. A daemon hung longer than the bounded retry budget is still reaped, which is correct since an unresponsive daemon should be replaced.
- mk-spec-memory only. This hardens the mk-spec-memory lease-holder check. mk-code-index reuses the shared probeDaemon but its bridge upgrade is a separate phase.
- Operator overrides own their timing. Setting a large SPECKIT_LEASE_PROBE_RETRIES can push total probe time past the grace ceiling; the default is the safe value.
