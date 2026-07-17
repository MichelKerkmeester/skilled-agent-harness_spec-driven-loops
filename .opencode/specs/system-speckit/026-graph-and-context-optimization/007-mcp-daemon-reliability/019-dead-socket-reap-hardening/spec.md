---
title: "Feature Specification: Dead-socket reap hardening"
description: "A single transient liveness-probe miss made a sibling launcher reap the lease owner and respawn a duplicate daemon. This packet requires N consecutive probe failures before reaping, within the probe grace budget."
trigger_phrases:
  - "dead-socket reap hardening"
  - "consecutive liveness probe failures"
  - "false-dead owner reap"
  - "lease probe retry"
  - "SPECKIT_LEASE_PROBE_RETRIES"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/019-dead-socket-reap-hardening"
    last_updated_at: "2026-06-07T16:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Added bounded consecutive-failure retry before owner reap"
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
    answered_questions:
      - "Does the retry blow the probe grace ceiling? -> No; first probe keeps its full timeout, the one retry is short (<=1500ms) + 250ms backoff, total <= 6999ms; dead sockets fail fast."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Dead-socket reap hardening

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-07 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`maybeBridgeLeaseHolder` ran the deep liveness probe once; a single failure returned an immediate `respawn` verdict, so the calling launcher reaped the lease owner and spawned a second daemon. A busy-but-alive owner (mid-FTS-merge, momentary event-loop stall) that misses one probe window is then wrongly declared dead. Phase 017 flagged this as a deferred hardening item.

### Purpose
The owner is declared dead only after N consecutive deep-probe failures, so a single transient miss no longer triggers a cross-session reap and duplicate respawn, while the retry budget stays inside the probe grace ceiling.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A bounded consecutive-failure retry around the deep probe in `maybeBridgeLeaseHolder`.
- Pure, env-injectable config resolvers + an injectable retry runner for unit testing.
- Defaults that preserve the tuned first-probe timeout and keep the worst case within grace.

### Out of Scope
- The actual reap mechanics (`reapOwnerBeforeRespawn`) - unchanged; only the dead-decision gate is hardened.
- mk-code-index, orphan-sweeper, RC-2 - separate phases.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | Modify | `probeLeaseHolderWithRetries` + config resolvers; wire into `maybeBridgeLeaseHolder` |
| `mcp_server/tests/launcher-reap-hardening.vitest.ts` | Create | Config + retry-runner unit tests |
| `mcp_server/tests/launcher-ipc-bridge-probe.vitest.ts` | Modify | Pin retries off in the single-probe respawn assertion |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Reap requires consecutive failures | Owner declared dead only when every one of N attempts is non-alive |
| REQ-002 | Any live probe short-circuits | A single 'alive' result returns immediately and bridges (no further probes) |
| REQ-003 | Grace budget respected | Default first-probe full timeout + one short retry (<=1500ms) + 250ms backoff <= 6999ms |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Tunable + disablable | `SPECKIT_LEASE_PROBE_RETRIES` (default 1; 0 disables); retry timeout/backoff overridable |
| REQ-005 | No regression | Existing ipc-bridge + watchdog launcher tests pass |
| REQ-006 | Comment hygiene | Durable WHY only; no ADR/REQ/CHK/spec-path ids in code |

### Acceptance Criteria (Given/When/Then)

- **Given** a dead-then-alive probe sequence, **When** the lease holder is checked, **Then** it bridges (no respawn).
- **Given** all probes fail, **When** the lease holder is checked, **Then** it returns a respawn verdict after exactly N probes.
- **Given** an alive first probe, **When** checked, **Then** exactly one probe runs.
- **Given** `SPECKIT_LEASE_PROBE_RETRIES=0`, **When** checked, **Then** a single probe decides (legacy behavior).
- **Given** a huge retry-timeout override, **When** resolved, **Then** it clamps to 6999ms.
- **Given** the change, **When** the launcher tests run, **Then** all pass.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A single transient probe miss no longer reaps a live owner.
- **SC-002**: Worst-case probe time stays within the grace ceiling; dead sockets still fail fast.
- **SC-003**: `node --check` clean; reap-hardening + existing launcher tests pass; `validate.sh --strict` passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Retry delays respawn of a genuinely dead daemon | Low | Dead sockets fail fast (connection error), so only ~one backoff is added |
| Risk | Retry exceeds startup grace under operator overrides | Low | Default fits; retry timeout clamped to 6999ms; operator owns custom values |
| Dependency | Existing `probeDaemon` | Low | Reused unchanged; only invocation count changes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Alive owner pays one probe (unchanged); dead owner pays at most N probes within grace.
- **NFR-P02**: No steady-state cost; runs only on the lease-holder check path.

### Security
- **NFR-S01**: No new external surface; same single-writer owner-lease model.
- **NFR-S02**: Retry config is operator-only env; no external input.

### Reliability
- **NFR-R01**: Fewer false-dead reaps => fewer duplicate daemons and transport drops.
- **NFR-R02**: Genuine-dead detection preserved (all-fail still respawns).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- retries=0: single probe (legacy).
- retries=N: up to N+1 attempts; first 'alive' short-circuits.
- huge retry timeout override: clamped to 6999ms.

### Error Scenarios
- Hung daemon (timeout each attempt): respawns after the bounded budget.
- Dead socket (connection refused): fast-fails each attempt; minimal added latency.

### State Transitions
- Transient stall then recovery: retry observes 'alive' and bridges.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 7/25 | ~40 LOC in one lib file + one test file + one test tweak |
| Risk | 12/25 | Shared reap path; mitigated by grace-bounded defaults + tests |
| Research | 5/20 | Scoped by phase 017; timing verified against the probe ceiling |
| **Total** | **24/70** | **Level 2 (risk-weighted)** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. Reap mechanics unchanged; only the dead-decision gate is hardened.
<!-- /ANCHOR:questions -->
