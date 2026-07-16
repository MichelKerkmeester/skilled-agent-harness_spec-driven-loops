---
title: "Implementation Plan: Durability Stress Domain"
description: "Add a mcp_server/stress_test/durability domain with four isolated load/soak/concurrency cases over the 013 durability surfaces (checkpoint-v2, enrichment markers, index_scan lease, front-proxy recycle) plus a stress:durability script, reusing the storage-layer and front-proxy public APIs rather than spinning up a daemon."
trigger_phrases:
  - "durability stress plan"
  - "checkpoint contention stress plan"
  - "index scan coalescing stress plan"
  - "stress durability script"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/004-stress-test-durability-domain"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored durability stress domain (4 cases) + stress:durability script"
    next_safe_action: "None binding; durability domain green (12/12)"
    blockers: []
    key_files:
      - "mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts"
      - "mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts"
      - "mcp_server/package.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "durability-stress-domain-setup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Durability Stress Domain

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node), better-sqlite3 |
| **Framework** | Spec Kit Memory MCP server, Vitest stress config |
| **Storage** | SQLite main DB plus `active_vec` vector shard (sqlite-vec) |
| **Testing** | Vitest (`npm run stress:durability` via `vitest.stress.config.ts`) |

### Overview
Add a `mcp_server/stress_test/durability/` domain with four cases that load/soak/concurrency-test the 013 durability surfaces, reusing their real public APIs against throwaway isolated databases (no daemon spin-up). Each case asserts a durability invariant rather than a raw throughput number: lossless checkpoint round-trips with no orphan dirs, converging enrichment markers with a bounded backlog, single-writer index-scan admission with clean back-off, and transparent daemon-recycle replay. A `stress:durability` script mirrors the existing stress scripts and runs through the unchanged `vitest.stress.config.ts`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (see `spec.md`)
- [x] Success criteria measurable (SC-001..SC-004)
- [x] Dependencies identified (injectable reopen, repairIncompleteMarkers, db-state lease injection, proxy `__testing` helpers)

### Definition of Done
- [x] All acceptance criteria met (REQ-001..REQ-009)
- [x] `npm run stress:durability` green; durability + an existing domain green together (no config breakage)
- [x] Docs authored (spec/plan/tasks/checklist/decision-record/implementation-summary)
- [x] No case touches the production DB or live daemon socket
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
New stress domain mirroring the existing `stress_test/<domain>/` layout. Each case imports the real public API of one durability surface and drives it under load against a hermetic database, asserting the surface's durability invariant.

### Key Components
- **`checkpoint-v2-contention-stress.vitest.ts`**: drives `checkpoints.createCheckpoint`/`restoreCheckpoint` (with an in-process `reopen` hook) over many interleaved cycles against a per-test `mkdtemp` DB; asserts lossless round-trips, bounded on-disk snapshot set, no orphan/`.tmp-` dirs, and an observable `E_RESTORE_IN_PROGRESS` barrier.
- **`enrichment-marker-backfill-stress.vitest.ts`**: floods `pending` schema-v30 markers and drains them with `repairIncompleteMarkers` (the enrichment runtime mocked to a deterministic complete result) against a `:memory:` DB; asserts convergence and a bounded, draining backlog.
- **`index-scan-coalescing-stress.vitest.ts`**: injects a throwaway DB into `db-state` and fires a concurrent `acquireIndexScanLease` burst; asserts single-writer admission, structured back-off, cooldown coalescing, and stale-lease reclaim.
- **`daemon-recycle-transparency-stress.vitest.ts`**: drives the front-proxy `__testing.createPendingRequestsTracker`/`classifyFrame` through a simulated recycle; asserts replayable reads survive, unsafe mutations are refused with `-32001`, and `-32002` stays terminal.

### Data Flow
Each case sets up an isolated database (or a pure-logic tracker), applies a load pattern (interleaved round-trips, save flood, concurrent burst, in-flight request flood), then asserts the surface's durability invariant. Teardown removes the temp tree. The front-proxy case opens no socket and spawns no daemon — it exercises the proxy's exported logic directly.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This packet adds tests and one npm script; it touches no production runtime code. The surface inventory below records which runtime APIs each case exercises (read-only, no edits) so the coverage is traceable.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/storage/checkpoints.ts` public API | Checkpoint create/restore/prune/delete | exercise (no edit) | Contention case drives create+restore round-trips |
| `handlers/save/enrichment-state.ts` | Marker pending/complete/backfill | exercise (no edit) | Backfill case drains a pending flood to complete |
| `core/db-state.ts` lease primitives | Single-writer index-scan lease | exercise (no edit) | Coalescing case drives a concurrent acquisition burst |
| `.opencode/bin/lib/launcher-session-proxy.cjs` `__testing` | Pending-request replay tracker | exercise (no edit) | Recycle case replays an in-flight snapshot |
| `mcp_server/package.json` | npm scripts | update (add `stress:durability`) | The script runs the domain via the stress config |
| `mcp_server/vitest.stress.config.ts` | Stress test glob (`stress_test/**`) | unchanged (reference only) | The new domain is picked up with no config edit |

Required inventories:
- Same-class producers: `rg -n 'stress:harness|stress:matrix|stress:substrate|stress:durability' mcp_server/package.json`.
- Consumers of the exercised symbols: `rg -n 'createCheckpoint|restoreCheckpoint|repairIncompleteMarkers|acquireIndexScanLease|createPendingRequestsTracker' mcp_server --glob '*.ts' --glob '*.cjs'`.
- Matrix axes: surface (checkpoint, enrichment, index-scan, recycle) x load (contention, flood, burst, in-flight) x isolation (mkdtemp, :memory:, pure-logic) — all four rows covered.
- Algorithm invariant: every case tears down its DB and never touches `~/.mk-spec-memory` or the live socket.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Phase 0 is this packet setup. The work landed in one pass because the cases are additive tests with no runtime-code dependency between them.

### Phase 1: Scaffold + checkpoint/enrichment cases
- [x] Create `mcp_server/stress_test/durability/` with the README
- [x] Author the checkpoint-v2 contention case (interleaved create+restore, orphan-free, barrier observable)
- [x] Author the enrichment-marker backfill case (save flood drains to complete via bounded passes)

### Phase 2: index-scan + recycle cases
- [x] Author the index-scan coalescing case (single-writer burst, cooldown, stale-lease reclaim)
- [x] Author the daemon-recycle transparency case (replay reads, refuse mutations, `-32001` live)

### Phase 3: Script + run
- [x] Add the `stress:durability` script to `package.json`
- [x] Run `npm run stress:durability` (green) and durability + an existing domain together (green)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Load | Interleaved checkpoint round-trips, save flood, concurrent lease burst, in-flight request flood | Vitest |
| Concurrency | Single-writer index-scan admission and clean back-off | Vitest |
| Isolation | Per-test `mkdtemp`/`:memory:` DBs and pure-logic proxy helpers | Vitest |
| Regression | Durability + an existing pure-logic domain run together through the shared config | Vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Injectable `reopen` on `restoreCheckpoint` | Internal | Green | No in-process restore round-trip without a daemon |
| `repairIncompleteMarkers` backfill | Internal | Green | No marker-convergence stress |
| `db-state.init` vector-index injection | Internal | Green | Cannot drive the real lease against a throwaway DB |
| Front-proxy `__testing` helpers | Internal | Green | Cannot exercise recycle replay without a socket |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The durability domain is flaky or breaks the shared stress config.
- **Procedure**: The domain is purely additive (new test files + one script). Removing the `stress_test/durability/` directory and the `stress:durability` script line fully reverts the change with zero impact on runtime code or other domains.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (scaffold + checkpoint/enrichment) ──► Phase 2 (index-scan + recycle) ──► Phase 3 (script + run)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | None | Phase 2 |
| Phase 2 | Phase 1 | Phase 3 |
| Phase 3 | Phase 2 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Scaffold + checkpoint/enrichment cases | Med | 2-3 hours |
| Phase 2: index-scan + recycle cases | Med | 2-3 hours |
| Phase 3: Script + run | Low | 0.5 hour |
| **Total** | | **4.5-6.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Domain runs green in isolation (`npm run stress:durability`)
- [x] Domain runs green alongside an existing domain (no config breakage)
- [x] No case touches the production DB or live socket

### Rollback Procedure
1. Remove `mcp_server/stress_test/durability/`.
2. Remove the `stress:durability` line from `mcp_server/package.json`.
3. Re-run `npm run stress:substrate` to confirm the remaining stress domains are unaffected.

### Data Reversal
- **Has data migrations?** No — tests only, no schema or data change.
- **Reversal procedure**: None required.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│ scaffold +  │     │ index-scan  │     │ script +    │
│ ckpt/enrich │     │ + recycle   │     │ run         │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Scaffold + checkpoint/enrichment | None | Domain dir, two cases | index-scan + recycle |
| index-scan + recycle | Scaffold | Two more cases | script + run |
| script + run | All four cases | `stress:durability` script, green run | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1 - Scaffold + checkpoint/enrichment** - 2-3 hours - CRITICAL
2. **Phase 2 - index-scan + recycle** - 2-3 hours - CRITICAL
3. **Phase 3 - Script + run** - 0.5 hour - CRITICAL

**Total Critical Path**: 4.5-6.5 hours

**Parallel Opportunities**:
- The four cases are independent and could be authored in parallel; they share only the new directory and the single script line.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Domain scaffolded, checkpoint + enrichment cases green | Two cases pass against isolated DBs | End Phase 1 |
| M2 | index-scan + recycle cases green | Four cases pass; `-32001` asserted live | End Phase 2 |
| M3 | Script wired, domain green, no config breakage | `npm run stress:durability` green; durability + an existing domain green together | End Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

Full ADRs live in `decision-record.md`. Summary:

### ADR-001: Reuse public APIs over spinning up a daemon

**Status**: Accepted

**Context**: The substrate domain already owns daemon-harness coverage; re-inventing daemon spin-up here would be slow and duplicative.

**Decision**: Drive each durability surface through its real public API against a throwaway database (or the proxy's pure-logic helpers), with no daemon spin-up.

**Consequences**:
- Fast, deterministic, hermetic cases that are safe to run against a live operator session.
- The real `reopenActiveDatabase` coordinator and a live socket recycle remain the live-verification's job, not this gate's.

**Alternatives Rejected**:
- Re-run the substrate daemon harness: slow, contends with a live owner, and duplicates existing coverage.

---

## EXECUTOR DISPATCH CONTRACT

This packet was authored directly (tests + one script), not dispatched to a per-phase CLI executor, because it adds no production runtime code and each case is an independent additive test. The orchestrator owns all git writes.

- Verification: `cd .opencode/skills/system-spec-kit/mcp_server && npm run stress:durability`.
- Isolation invariant: every case uses throwaway temp/`:memory:` DBs or pure-logic helpers; never the production DB at `~/.mk-spec-memory` or the live `daemon-ipc` socket.
- Config: `stress_test/**` is already in `vitest.stress.config.ts`; no config edit was needed.
<!-- /IF -->
