---
title: "Implementation Plan: Probe before adopt so the daemon supervisor reaps a live-but-wedged daemon instead of bridging clients into it"
description: "Gate the stale-reclaim adoption path on the existing deep JSON-RPC probe; on a failed probe fall through to the path's own reap+respawn block. ~15 prod LOC in mk-spec-memory-launcher.cjs plus a SIGSTOP'd-daemon regression test."
trigger_phrases:
  - "daemon probe before adopt plan"
  - "stale reclaim reap respawn"
  - "launcher deep probe gate"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/006-operator-tooling/009-daemon-supervisor-probe-before-adopt"
    last_updated_at: "2026-06-14T17:45:00Z"
    last_updated_by: "main-agent"
    recent_action: "Authored implementation plan from verified source analysis"
    next_safe_action: "Apply the launcher edit at the stale-reclaim adopt gate"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "009-daemon-supervisor-probe-before-adopt"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Probe before adopt so the daemon supervisor reaps a live-but-wedged daemon instead of bridging clients into it

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS, hand-authored `.cjs`) |
| **Framework** | None — process launcher / supervisor |
| **Storage** | SQLite (WAL) via the spec-memory daemon it supervises |
| **Testing** | vitest (real-launcher durability suite) |

### Overview
The stale-reclaim adoption branch adopts a released daemon on liveness + socket-file existence. We add the existing deep JSON-RPC probe (`probeLeaseHolderWithRetries`) as the adopt gate; only a daemon that replies is adopted. A daemon that is alive but unresponsive falls through to the branch's own reap+respawn block, which already SIGTERM→SIGKILLs the orphan and spawns a fresh daemon under the respawn lock.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (root cause confirmed against source + live incident)
- [x] Success criteria measurable (vitest cases)
- [x] Dependencies identified (existing probe primitives)

### Definition of Done
- [ ] REQ-001..005 met
- [ ] `daemon-reelection-adoption-live` vitest green incl. new hung-daemon case
- [ ] Docs updated (spec/plan/tasks/checklist/decision-record/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-writer daemon with a launcher/supervisor that bridges secondary sessions to a warm daemon and reaps+respawns a dead one.

### Key Components
- **Stale-reclaim branch** (`mk-spec-memory-launcher.cjs:1570-1614`): decides adopt-vs-reap for a released daemon recorded under a stale lease.
- **Deep probe** (`launcher-ipc-bridge.cjs:probeDaemon/probeLeaseHolderWithRetries`): requires a JSON-RPC `initialize` reply; detects a hung daemon that accepts the socket but never services requests.

### Data Flow
Launcher starts → acquires owner lease → reads stale lease → (today) adopts on liveness+socket-exists → (fixed) adopts only on a successful deep probe, else reaps the orphan and spawns a fresh daemon.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mk-spec-memory-launcher.cjs:1580-1588` (adopt gate) | Adopts on `processLiveness !== 'dead'` + `bridgeReadiness().ready` | Update — add deep-probe gate before adopting | New vitest hung-daemon case + existing adoption case |
| `mk-spec-memory-launcher.cjs:1589-1614` (stale-reclaim reap+respawn) | Reaps orphan + spawns fresh when daemon dead/unbridgeable | Unchanged — fix falls through into it on probe failure | Code read; new test reaches it |
| `launcher-ipc-bridge.cjs:probeLeaseHolderWithRetries` | Deep liveness probe used by the dead-socket decision | Unchanged — reused as-is by the adopt gate | `rg` it is exported + already unit-tested |
| `bridgeReadiness()` (`:614-635`) | Socket-existence check | Unchanged — kept as a cheap pre-gate before the probe | Code read |
| `respawnAfterDeadSocket` (`:774-848`) | Shared dead-socket respawn (owner-held path) | Not a consumer of this fix — deliberately not touched | Code read; fix uses the stale-reclaim block instead |

Required inventories:
- Consumers of the adopt decision: `rg -n "stale-reclaim adopting|bridgeReadiness|probeLeaseHolderWithRetries" .opencode/bin`.
- Algorithm invariant: a daemon is adopted ONLY if it returns a JSON-RPC reply within the tuned probe window; otherwise it is reaped before any replacement spawns, so there is never a second writer on the WAL.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Root cause confirmed (gpt-5.5 council + direct source read + live DB corroboration)
- [x] Probe primitive + defaults located (`probeLeaseHolderWithRetries`, `SPECKIT_PROBE_TIMEOUT_MS`, `RESPAWN_REAP_GRACE_MS=7000`)
- [x] Spec folder scaffolded

### Phase 2: Core Implementation
- [ ] Add deep-probe gate to the adopt branch (`:1580-1588`)
- [ ] On probe failure, log and fall through to the existing reap+respawn block (no lease clear, no bridge)
- [ ] Add the SIGSTOP'd-daemon regression test

### Phase 3: Verification
- [ ] Run the `daemon-reelection-adoption-live` vitest (existing 3 green + new case)
- [ ] Reconcile docs; strict-validate; deep-review
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integration | Real-launcher adoption: responsive daemon adopted; wedged (SIGSTOP'd) daemon reaped+respawned; single writer | vitest |
| Manual | Confirm a fresh launcher recovers the live wedged instance once deployed | shell |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `launcher-ipc-bridge.cjs` probe helpers | Internal | Green | None — already shipped |
| vitest durability harness | Internal | Green | Cannot run the regression test |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The probe false-reaps healthy daemons, or the regression test is flaky.
- **Procedure**: `git revert` the launcher edit; the test edit reverts with it. The launcher is hand-authored `.cjs` (no build step), so revert is immediate.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
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
| Setup | Med | done |
| Core Implementation | Med | ~1 hour |
| Verification | Med | ~1 hour (vitest is slow: ~10-15s/hung case) |
| **Total** | | **~2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Existing adoption test still green (no warm-reuse regression)
- [ ] New hung-daemon test green

### Rollback Procedure
1. `git revert` the launcher commit.
2. No data reversal — the change is control-flow only; no schema/data migration.
3. Smoke: launch a fresh daemon, confirm `memory_stats` responds.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│   Setup     │     │   Core fix  │     │   vitest    │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Adopt-gate edit | Probe helpers | Probe-gated adoption | Regression test |
| Regression test | Adopt-gate edit | Hung-daemon coverage | Verification |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Adopt-gate edit** - ~20 min - CRITICAL
2. **Regression test** - ~30 min - CRITICAL
3. **vitest run** - ~10 min - CRITICAL

**Total Critical Path**: ~1 hour

**Parallel Opportunities**:
- Docs (checklist/decision-record/implementation-summary) can be drafted while the vitest runs.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Fix applied | Adopt gate calls the deep probe | Phase 2 |
| M2 | Test added | Hung-daemon case present | Phase 2 |
| M3 | Verified | vitest green incl. new case | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Probe before adopt; fall through to the existing reap+respawn

**Status**: Accepted

**Context**: The adopt decision used liveness + socket-existence, which a hung daemon passes.

**Decision**: Gate adoption on the existing deep JSON-RPC probe; on failure use the stale-reclaim branch's own reap+respawn block.

**Consequences**:
- Positive: a wedged daemon self-heals on next launch; warm daemons are still adopted.
- Negative + mitigation: one extra probe round on the stale-reclaim path; bounded by the tuned timeout and only on that path.

**Alternatives Rejected**:
- Route the stale-reclaim path through `respawnAfterDeadSocket`: rejected — that path expects the owner lease to match the *old daemon* pid, but here this launcher owns the lease, so it always reports "superseded". See `decision-record.md`.
