---
title: "Feature Specification: Probe before adopt so the daemon supervisor reaps a live-but-wedged daemon instead of bridging clients into it"
description: "The stale-reclaim adoption path adopts a daemon on process-liveness plus socket-file existence, not a request/response probe, so a live-but-wedged daemon is adopted and clients are bridged into a process that never services requests — ECONNREFUSED with no self-recovery."
trigger_phrases:
  - "daemon probe before adopt"
  - "stale reclaim adoption"
  - "wedged daemon self heal"
  - "spec memory launcher reap"
  - "daemon supervisor probe"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/006-operator-tooling/009-daemon-supervisor-probe-before-adopt"
    last_updated_at: "2026-06-14T17:45:00Z"
    last_updated_by: "main-agent"
    recent_action: "Authored Level 3 spec"
    next_safe_action: "Apply the probe-before-adopt fix to mk-spec-memory-launcher.cjs"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/bin/lib/launcher-ipc-bridge.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "009-daemon-supervisor-probe-before-adopt"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Probe before adopt so the daemon supervisor reaps a live-but-wedged daemon instead of bridging clients into it

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

The spec-memory daemon supervisor decides a daemon is healthy from process liveness (`process.kill(pid,0)`) plus socket-file existence, never a request/response probe. When a daemon is alive but its event loop is wedged (it accepts the socket connection but never services requests), the supervisor adopts it "instead of reaping" and bridges clients into a dead end — `ECONNREFUSED` forever, with no path to self-recovery. A real incident proved this: one daemon spun a full core for ~4 hours while every client call failed. This packet makes the stale-reclaim adoption path **deep-probe before adopting**, and reap+respawn on a failed probe.

**Key Decisions**: Reuse the existing tuned deep-probe (`probeLeaseHolderWithRetries`) rather than invent a new liveness check; fall through to the stale-reclaim path's own existing reap+respawn block rather than refactor the shared dead-socket respawn path.

**Critical Dependencies**: The deep-probe primitives already shipped in `launcher-ipc-bridge.cjs` (`probeDaemon({deepProbe:true})`, `probeLeaseHolderWithRetries`).

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-06-14 |
| **Branch** | `system-speckit/003-xce-research-based-refinement` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The stale-reclaim adoption branch (`mk-spec-memory-launcher.cjs:1580`) adopts a released daemon when `processLiveness(orphanChildPid) !== 'dead'` AND `bridgeReadiness(adoptResult).ready`. `bridgeReadiness()` (`:614-635`) only checks the socket path is a `tcp://` endpoint or `fs.existsSync(socketPath)` — it never sends a request. A daemon whose event loop is wedged (busy-loop / deadlock) is still `alive` to `kill(pid,0)` and still owns its listening socket, so it passes both checks. The launcher adopts it, clears the owner lease (`:1584`), and bridges; the real deep probe inside `bridgeOrReportLeaseHeldAndExit` then fails, but the lease is already cleared so `respawnAfterDeadSocket` skips with "owner lease changed" (`:807`). Result: clients get `ECONNREFUSED` and the supervisor can never reap the wedged daemon because it only ever sees that the pid is alive.

### Purpose
The supervisor reaps and respawns a live-but-unresponsive daemon instead of adopting it, so a wedged daemon self-heals on the next launcher invocation while a genuinely warm daemon is still reused.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Gate the stale-reclaim adoption (`:1580-1588`) on a deep JSON-RPC probe before adopting.
- On probe failure, fall through to the existing stale-reclaim reap+respawn block (`:1589-1614`).
- A regression test proving a live-but-wedged released daemon is reaped+respawned, not adopted, with the single-writer invariant preserved.

### Out of Scope
- Root cause #1 — the unbounded background-enrichment loop in `handlers/memory-save.ts` (`scheduleBackgroundEnrichment`) that wedges the daemon. Tracked separately; it is the *trigger*, this packet fixes the *recovery*.
- Manually recovering the current live wedged instance — the deployed fix reaps it on the next launcher invocation, no manual `kill` needed.
- Refactoring the shared `respawnAfterDeadSocket` lease-handling — the localized fall-through avoids touching that path.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify | Deep-probe the adopt candidate before adopting; fall through to reap+respawn on failure |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts` | Modify | Add a SIGSTOP'd-daemon regression case |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Adoption requires a successful deep JSON-RPC probe, not just liveness + socket existence | The adopt branch calls `probeLeaseHolderWithRetries` and only adopts when `status === 'alive'` |
| REQ-002 | A failed probe reaps+respawns instead of adopting | On a non-alive probe the code falls through to the existing reap+respawn block; a wedged daemon is reaped and a fresh daemon spawns |
| REQ-003 | Single-writer invariant preserved | After recovery exactly one pid holds the sqlite files open under the DB dir |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | No regression to warm-daemon adoption | The existing "FRESH session ADOPTS the released daemon" test stays green (responsive daemon → probe alive → adopt) |
| REQ-005 | No false-reap of a busy-but-responsive daemon | Probe reuses the existing tuned policy (default 5s timeout + retry) that already tolerates an FTS-merge-busy daemon |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The `daemon-reelection-adoption-live` vitest passes with the existing 3 cases green plus a new case proving a SIGSTOP'd released daemon is reaped+respawned (new pid, single writer).
- **SC-002**: A live-but-wedged daemon no longer produces a permanent `ECONNREFUSED`; the next launcher invocation recovers it through the supervisor's own reap+respawn path.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `probeDaemon`/`probeLeaseHolderWithRetries` in `launcher-ipc-bridge.cjs` | Fix relies on them | Already shipped and unit-tested; the downstream bridge decision already uses them |
| Risk | False-negative probe reaps a healthy busy daemon | Med | Reuse the existing tuned policy (5s first timeout + retry, < 7s reap grace) that already tolerates a busy-but-responsive daemon |
| Risk | Reaping a wedged daemon SIGKILLs it with an uncheckpointed WAL | Low | SQLite WAL is crash-safe; the reap path already logs unclean-close and the replacement daemon rebuilds the FTS shadow at boot |
<!-- /ANCHOR:risks -->

---
<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The probe adds at most one deep-probe round (default ≤5s, +one retry) only on the stale-reclaim path; the warm-adoption happy path resolves on the first probe in tens of milliseconds.

### Security
- **NFR-S01**: No change to the auth/transport boundary; the probe speaks the same local JSON-RPC over the existing UDS the bridge already uses.

### Reliability
- **NFR-R01**: A wedged daemon is recoverable without operator intervention on the next launcher invocation; the single-writer invariant holds across the reap+respawn.

---

## 8. EDGE CASES

### Data Boundaries
- Probe against a daemon mid-FTS-merge: the tuned 5s timeout + retry tolerates a slow-but-responsive daemon, so it is adopted, not reaped.
- Probe against a SIGSTOP'd / busy-looping daemon: socket accepts the connect into the backlog but no JSON-RPC reply arrives → probe times out → reap.

### Error Scenarios
- Probe transient miss then success: the retry (`SPECKIT_LEASE_PROBE_RETRIES`, default 1) requires N consecutive failures before reaping.
- Wedged child outlives SIGKILL within the grace window: existing `reapLeaseChildBeforeRespawn` refuses respawn (`child-kill-unconfirmed`) rather than risk a second writer — unchanged.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 8/25 | Files: 2, LOC: ~15 prod + ~50 test, Systems: 1 (daemon supervisor) |
| Risk | 18/25 | Auth: N, API: N, Breaking: N, but single-writer daemon lifecycle |
| Research | 14/20 | Required a live incident forensic + source verification |
| Multi-Agent | 3/15 | gpt-5.5 council (2 seats) for root cause; single-author fix |
| Coordination | 5/15 | Depends on existing probe primitives |
| **Total** | **48/100** | **Level 3 (risk-driven, not LOC-driven)** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Probe false-negative reaps a healthy daemon | H | L | Reuse tuned timeout+retry policy already proven against busy daemons |
| R-002 | Fix changes adoption semantics and breaks warm reuse | M | L | Existing adoption test stays green; probe only gates, does not replace, adoption |
| R-003 | Reap of wedged daemon corrupts the index | H | L | WAL crash-safe + FTS rebuild at boot; reap path already handles unclean close |

---

## 11. USER STORIES

### US-001: Operator recovers from a wedged daemon (Priority: P0)

**As an** operator whose spec-memory calls all return `ECONNREFUSED`, **I want** the supervisor to detect the daemon is unresponsive and replace it, **so that** memory tooling recovers without me manually killing a process.

**Acceptance Criteria**:
1. Given a live-but-wedged daemon, When a new launcher starts, Then it probes, finds it unresponsive, reaps it, and spawns a healthy replacement.

---

### US-002: Warm daemon is still reused (Priority: P1)

**As a** secondary session, **I want** to keep bridging to a healthy released daemon, **so that** the warm-daemon adoption optimization is preserved and no second writer is spawned.

**Acceptance Criteria**:
1. Given a healthy released daemon, When a fresh session starts, Then it probes successfully and adopts the same pid (single writer).

---

## 12. OPEN QUESTIONS

- None outstanding. Root cause #1 (the enrichment loop that wedges the daemon) is tracked as separate, out-of-scope work.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
