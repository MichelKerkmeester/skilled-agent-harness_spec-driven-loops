---
title: "Implementation Plan: Dead-socket reap hardening"
description: "Wrap the lease-holder deep probe in a bounded consecutive-failure retry so a transient miss does not reap a live owner; pure config + injectable retry runner for tests."
trigger_phrases:
  - "dead-socket reap hardening plan"
  - "lease probe retry plan"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/019-dead-socket-reap-hardening"
    last_updated_at: "2026-06-07T16:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented + tested the consecutive-failure retry"
    next_safe_action: "Phase 020 mk-code-index proxy"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Dead-socket reap hardening

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS launcher lib) |
| **Framework** | None |
| **Storage** | None (in-memory probe loop) |
| **Testing** | vitest |

### Overview
The single deep probe in `maybeBridgeLeaseHolder` becomes a bounded retry loop (`probeLeaseHolderWithRetries`): the first probe keeps its tuned timeout, then up to N-1 short retries with a small backoff. Any 'alive' short-circuits to bridge; only an all-failures run returns the dead result that triggers respawn.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Bounded retry loop around an injectable probe; pure config resolvers.

### Key Components
- **`probeLeaseHolderWithRetries`**: the retry runner (injectable probe + sleep).
- **`resolveLeaseProbeAttempts` / `...RetryTimeoutMs` / `...RetryBackoffMs`**: env-driven config.

### Data Flow
`maybeBridgeLeaseHolder` -> `probeLeaseHolderWithRetries` -> probe (full timeout) -> [dead -> backoff -> probe (short timeout)]* -> alive=bridge / all-dead=respawn.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `maybeBridgeLeaseHolder` | single-probe reap decision | update (retry loop) | reap-hardening + ipc-bridge tests |
| `probeDaemon` | the deep probe | unchanged (reused) | call count only |
| `launcher-ipc-bridge-probe.vitest.ts` | asserts single-probe respawn | update (pin retries=0) | test passes |

Required inventories:
- Consumers of the respawn verdict: the launcher reap/respawn path; behavior unchanged except it fires only after N failures.
- Matrix axes: {first-alive, dead-then-alive, all-dead, retries=0, clamp} -> covered by the new test.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the single-probe reap path + the probe grace ceiling (`MAX_PROBE_TIMEOUT_MS`)
- [x] Confirm existing tests' expectations

### Phase 2: Core Implementation
- [x] Add config resolvers + `probeLeaseHolderWithRetries`
- [x] Wire it into `maybeBridgeLeaseHolder`; export for tests

### Phase 3: Verification
- [x] `node --check` + retry smoke test
- [x] New reap-hardening tests + reconcile the existing single-probe test
- [x] Full launcher suite green
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | config resolvers + retry runner (injected probe/sleep) | vitest |
| Integration | maybeBridgeLeaseHolder alive/respawn paths | vitest fake timers |
| Manual | node --check + require smoke | node |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `probeDaemon` | Internal | Green | reused unchanged |
| probe grace ceiling | Internal | Green | retry budget fits under it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: false reap regressions or respawn-latency complaints.
- **Procedure**: `SPECKIT_LEASE_PROBE_RETRIES=0` (instant, restores single-probe) or `git revert`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Core ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | <1 hour |
| Core Implementation | Med | 1-2 hours |
| Verification | Low | 1 hour |
| **Total** | | **~3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Feature knob configured (`SPECKIT_LEASE_PROBE_RETRIES`)
- [x] Retry budget bounded under the grace ceiling
- [x] Genuine-dead detection preserved

### Rollback Procedure
1. `SPECKIT_LEASE_PROBE_RETRIES=0` to restore single-probe instantly.
2. `git revert` the lib change if needed.
3. Re-run the launcher suite.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
