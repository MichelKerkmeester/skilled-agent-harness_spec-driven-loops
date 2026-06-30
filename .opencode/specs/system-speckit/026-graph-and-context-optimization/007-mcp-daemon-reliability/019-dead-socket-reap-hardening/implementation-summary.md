---
title: "Implementation Summary: Dead-socket reap hardening"
description: "A sibling launcher no longer reaps the lease owner and spawns a duplicate daemon on a single transient probe miss — the owner is declared dead only after N consecutive deep-probe failures, within the probe grace budget."
trigger_phrases:
  - "dead-socket reap hardening done"
  - "consecutive probe failure reap summary"
  - "false-dead reap fix"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/019-dead-socket-reap-hardening"
    last_updated_at: "2026-06-07T16:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Shipped consecutive-failure reap gate (full launcher suite green)"
    next_safe_action: "Phase 020 mk-code-index reconnecting proxy"
    blockers: []
    key_files:
      - ".opencode/bin/lib/launcher-ipc-bridge.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-019-dead-socket-reap-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 019-dead-socket-reap-hardening |
| **Completed** | 2026-06-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A busy daemon no longer gets killed for being briefly slow. Before this, the lease-holder check ran the deep liveness probe once, and a single failure made the checking launcher reap the owner and spawn a second daemon. An owner mid-FTS-merge or stalled for one probe window was wrongly declared dead, which is exactly the kind of duplicate-daemon thrash that drops transports. Now the owner is declared dead only after N consecutive deep-probe failures.

### Consecutive-failure probe gate

`maybeBridgeLeaseHolder` now calls `probeLeaseHolderWithRetries`. The first probe keeps its tuned full timeout; on failure it waits a short backoff and retries with a short timeout, repeating up to the configured attempt count. Any single `alive` result short-circuits straight to a bridge. Only when every attempt fails does it return the dead result that triggers a respawn. The defaults (one retry, 1500 ms retry timeout, 250 ms backoff) keep the worst case inside the probe grace ceiling (6999 ms), and a genuinely dead socket fails fast so it adds almost no latency — only a hung daemon pays the full retry. It is tunable and disablable via `SPECKIT_LEASE_PROBE_RETRIES` (0 restores the legacy single probe).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | Modified | `probeLeaseHolderWithRetries` + `resolveLeaseProbeAttempts` / `...RetryTimeoutMs` / `...RetryBackoffMs` + `parseNonNegativeInteger`; wired into `maybeBridgeLeaseHolder`; all exported |
| `mcp_server/tests/launcher-reap-hardening.vitest.ts` | Created | Config resolvers + retry-runner behavior (first-alive, dead-then-alive, all-dead, backoff/retry reporting) |
| `mcp_server/tests/launcher-ipc-bridge-probe.vitest.ts` | Modified | Pinned `SPECKIT_LEASE_PROBE_RETRIES=0` in the single-probe respawn test + env cleanup |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The probe fn and the sleep are injectable, so the retry decision is unit-tested without real sockets or timers: dead-then-alive bridges, all-dead respawns after exactly N probes, an alive first probe runs once, the backoff fires between attempts, and a huge retry-timeout override clamps to 6999 ms. The one existing test that asserted a single-probe respawn verdict under fake timers was reconciled by pinning retries off (its assertion is about the verdict, not the retry, which has its own coverage). Verified with `node --check`, a 9-assertion require smoke test, and the launcher vitest suite (reap-hardening + ipc-bridge probe/bridge + watchdog + persistent-log + clean-close + session-proxy), all green. Rollback is instant via `SPECKIT_LEASE_PROBE_RETRIES=0`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Retry the probe, do not just lengthen one timeout | A retry catches a transient stall that then recovers; a single longer timeout still mis-reaps a daemon busy past it |
| Keep the first probe at its tuned full timeout | Preserves the existing well-tuned behavior; only adds a short second chance |
| Short retry + backoff, clamped to the grace ceiling | The worst case must not blow the launcher's startup budget; dead sockets fail fast anyway |
| Default on (one retry), disablable to 0 | Hardening should be the default posture; operators keep an instant escape hatch |
| Injectable probe + sleep | Makes the retry decision deterministically unit-testable, matching the launcher's testable-helper pattern |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check` ipc-bridge lib | PASS |
| require-time retry smoke (9 assertions) | PASS |
| `launcher-reap-hardening.vitest.ts` | PASS |
| `launcher-ipc-bridge-probe.vitest.ts` (reconciled) | PASS |
| launcher suite (watchdog/persistent-log/clean-close/session-proxy) | PASS (no regression) |
| comment-hygiene (durable WHY, no ids/paths) | PASS |
| `validate.sh --strict` (this packet) | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Heuristic, not consensus.** N consecutive failures is a robust heuristic for "owner gone", not a distributed consensus. A daemon hung longer than the bounded retry budget is still reaped — correct, since an unresponsive daemon should be replaced.
2. **mk-spec-memory only.** This hardens the mk-spec-memory lease-holder check. mk-code-index reuses the shared `probeDaemon` but its bridge upgrade is phase 020.
3. **Operator overrides own their timing.** Setting a large `SPECKIT_LEASE_PROBE_RETRIES` can push total probe time past the grace ceiling; the default is the safe value.
<!-- /ANCHOR:limitations -->
