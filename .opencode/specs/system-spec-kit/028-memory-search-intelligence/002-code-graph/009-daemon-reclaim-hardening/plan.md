---
title: "Implementation Plan: Phase 9: daemon-reclaim-hardening"
description: "Implement tridimensional liveness + reclaim-on-dead-socket + startup grace window + WAL hygiene + self-heal + diagnostics in the code-index launcher, then prove it with a deterministic wedge-simulation suite."
trigger_phrases:
  - "daemon reclaim hardening plan"
  - "tridimensional liveness launcher plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/009-daemon-reclaim-hardening"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase plan scaffolded from research"
    next_safe_action: "Implement the P0 core hardening"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/009-daemon-reclaim-hardening"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 9: daemon-reclaim-hardening

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS) launcher + better-sqlite3 child |
| **Framework** | mk-code-index launcher + launcher-ipc-bridge + MCP stdio server |
| **Storage** | Unix domain socket lease/owner files + code-graph.sqlite (WAL) |
| **Testing** | Deterministic wedge-simulation vitest suite (fake owner, no socket) |

### Overview
Make daemon liveness tridimensional (PID + socket-serving + heartbeat). Reuse `probeDaemon({deepProbe:true})` for socket health, add a `live-but-dead-socket` reclaimable state, route a socketless live owner into the existing reap+respawn pipeline past a startup grace window, add startup WAL hygiene, a crash-surviving PID registry + one-shot self-heal, race/uid safety, and one-line diagnostics. Prove it with a wedge simulation that asserts reclaim of a wedged daemon while sparing a still-starting and a foreign-owned one. Full design: `research/research.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Research design accepted (`research/research.md`); grace/max-init defaults confirmed

### Definition of Done
- [ ] Wedge auto-reclaimed; starting + foreign daemons spared; no -32000 after unclean crash; tests green
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Tridimensional-liveness self-heal. Socket-serving health becomes a first-class input to lease classification, reclaim, and heartbeat — alongside PID-liveness — under the existing atomic CAS.

### Key Components
- **probe**: `probeExistingService(socketPath)` wrapping `probeDaemon({deepProbe:true})` → `{status, kind}`.
- **classification**: `live-but-dead-socket` state in `classifyOwnerLease` + `leaseHeldFromFile`.
- **reclaim**: socketless-live-owner → `respawnAfterDeadSocket → reapOwnerBeforeRespawn` past `MAX_INIT_MS`.
- **WAL hygiene**: pre-spawn `wal_checkpoint(TRUNCATE)` + `wal_autocheckpoint` in `initDb`.
- **self-heal**: crash-surviving `.code-graph-daemon-pid.json` + one-shot `.self-heal-attempted`.
- **safety + diagnostics**: uid/PID-identity guards; `LAUNCHER_DIAGNOSTIC` line.

### Data Flow
1. On acquire: classify owner → if dead-socket past grace, reap → checkpoint → spawn.
2. Healthy serving owner → bridge (unchanged).
3. Heartbeat refresh gated on socket-serving so dead-socket ages out.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: P0 core
- [ ] `probeExistingService` wrapper; socket-health gate → `live-but-dead-socket` in `classifyOwnerLease` + `leaseHeldFromFile`
- [ ] No-bridge-socket branch → respawn; startup grace window (`childSpawnedAtIso`, `STARTUP_GRACE_MS`, `MAX_INIT_MS`)
- [ ] Startup WAL hygiene (`wal_checkpoint(TRUNCATE)` over-threshold/post-reap; `wal_autocheckpoint`); one-line diagnostics

### Phase 2: Safety + durability
- [ ] Crash-surviving PID registry + one-shot self-heal-on-acquire (discover→reap→checkpoint→spawn)
- [ ] PRIMARY-lease uid check; PID-identity verify before SIGKILL; re-stat-before-unlink; socket-gated heartbeat

### Phase 3: Verification
- [ ] Deterministic wedge-simulation suite (reclaim wedge / spare starting / spare foreign / checkpoint oversized WAL / bridge healthy); write implementation-summary.md
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Simulation | Wedge reclaimed; starting/foreign spared | fake-owner harness (holds lease+PID, never opens socket) |
| Unit | Classification states + grace math | vitest on `classifyOwnerLease`/`leaseHeldFromFile` |
| DB | Oversized WAL checkpoint-truncated pre-spawn | seeded `-wal` fixture |
| Smoke | Real unclean-crash recovery → no -32000 | kill -9 daemon, relaunch, assert serves |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `launcher-ipc-bridge.cjs` probe | Internal | Available | No socket-health input |
| better-sqlite3 in child | Internal | Available | No in-process WAL checkpoint fallback |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The hardening introduces a boot loop or kills healthy daemons.
- **Procedure**: Gate the new reclaim path behind an env flag (default-on after soak); `git revert` the launcher commit to restore PID+heartbeat-only liveness. The manual recovery (kill + checkpoint + clean socket dir) remains as the fallback.
<!-- /ANCHOR:rollback -->
