---
title: "Implementation Plan: Fence the enrichment scheduler and startup scan in fatalShutdown before closeDb"
description: "Add the background-enrichment scheduler and the startup scan to the fatalShutdown fence sequence, mirroring the fileWatcher/ingestWorker fences, so neither reopens the DB after closeDb's checkpoint."
trigger_phrases:
  - "enrichment scan shutdown fence plan"
  - "fatalShutdown fence sequence"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/011-enrichment-and-scan-shutdown-fence"
    last_updated_at: "2026-06-15T08:00:00Z"
    last_updated_by: "main-agent"
    recent_action: "Authored implementation plan"
    next_safe_action: "Validate + commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "011-enrichment-and-scan-shutdown-fence"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Fence the enrichment scheduler and startup scan in fatalShutdown before closeDb

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js, compiled to dist) |
| **Framework** | MCP server / spec-memory daemon |
| **Storage** | SQLite (WAL) |
| **Testing** | vitest (incl. durability/shutdown) |

### Overview
Add two writers to `fatalShutdown`'s pre-`closeDb` fence: the enrichment scheduler (synchronous flag + queue-clear, with in-flight runs bailing before and after the embed await) and the startup scan (break on `shuttingDown`, await the tracked promise bounded by the shutdown deadline).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Finding confirmed (010 deep-review F-008/F-012, two models + source)
- [x] Fence pattern identified (fileWatcher/ingestWorker)
- [x] Spec folder scaffolded

### Definition of Done
- [ ] REQ-001..005 met
- [ ] tsc 0; enrichment + lifecycle-shutdown + real-shutdown tests green; dist rebuilt
- [ ] Docs synchronized; validate --strict
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shutdown fence: stop each DB-writing background activity before `closeDb()` so nothing reopens the closed connection.

### Key Components
- **`fatalShutdown`** (`context-server.ts:1606`): the ordered cleanup; fences run before `closeDb()` (1646).
- **`shutdownBackgroundEnrichment()`** (`memory-save.ts`, new export): flag + queue-clear.
- **`startupScanPromise`** + `shuttingDown` break: bound the scan and let fatalShutdown await it.

### Data Flow
SIGTERM → `fatalShutdown` sets `shuttingDown`, fences enrichment (sync) + awaits the scan → `closeDb()` runs with no remaining DB writers.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `fatalShutdown` sync block (`context-server.ts:1611-1622`) | Synchronous stop-steps before the awaited drains | Update — add the enrichment fence | real-shutdown test |
| `fatalShutdown` cleanup IIFE (`:1625+`) | Awaited drains before `closeDb` | Update — await `startupScanPromise` first | real-shutdown test |
| `scheduleBackgroundEnrichment` (`memory-save.ts`) | Schedules deferred enrichment | Update — flag + bail points + re-arm guard | enrichment regression |
| startup scan loop (`context-server.ts:1520`) | Indexes all files at boot | Update — `shuttingDown` break + tracked promise | lifecycle-shutdown |
| `fileWatcher`/`ingestWorker` fences | The proven precedent | Unchanged — mirrored | code read |

Required inventories:
- `rg "requireDb\(|getDb\(" handlers/memory-save.ts context-server.ts` — confirms both reopen-capable writers are now fenced.
- Invariant: after `closeDb()` no enrichment run or scan iteration executes a DB write — enforced by the sync flag (set before any await) + the bounded scan await.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the finding + the fence precedent
- [x] Scaffold the spec folder

### Phase 2: Core Implementation
- [x] memory-save.ts: flag + `shutdownBackgroundEnrichment()` + bail points + guards
- [x] context-server.ts: import + fence call + scan break + promise tracking + bounded await

### Phase 3: Verification
- [x] tsc 0; enrichment 14/14; lifecycle-shutdown 4/4; shutdown-hooks 4/4; real-shutdown 4/4; dist rebuilt
- [ ] Docs + validate --strict + commit
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Type | Whole project compiles (delta vs 0 baseline) | tsc --noEmit |
| Regression | Enrichment deferred-result + async scan unchanged | vitest |
| Lifecycle | Shutdown still completes | vitest (lifecycle-shutdown, shutdown-hooks) |
| Integration | Real SIGTERM disposal → fatalShutdown with fences | vitest stress (daemon-reelection) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `runCleanupStep`/`runAsyncCleanupStep` | Internal | Green | None — reused |
| `shuttingDown` flag | Internal | Green | None — reused |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A shutdown hang or an enrichment regression appears.
- **Procedure**: `git revert` the two-file change + `npm run build`. No data migration.
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
| Verification | Med | ~30 min |
| **Total** | | **~1.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Shutdown lifecycle + real-shutdown tests green
- [ ] tsc 0; dist rebuilt

### Rollback Procedure
1. `git revert` the two-file commit.
2. `npm run build`.
3. Smoke: daemon starts + shuts down cleanly.

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
│   Setup     │     │ two fences  │     │ test+build  │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| enrichment fence | fence precedent | fenced scheduler | verification |
| scan fence | `shuttingDown` flag | fenced scan | verification |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **enrichment fence** - ~30 min - CRITICAL
2. **scan fence** - ~20 min - CRITICAL
3. **tests + build** - ~30 min - CRITICAL

**Total Critical Path**: ~1.3 hours

**Parallel Opportunities**:
- Docs drafted while tests run.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Fences applied | Both writers fenced before closeDb | Phase 2 |
| M2 | Verified | tsc 0 + all shutdown/enrichment tests green | Phase 3 |
| M3 | Shipped | Docs + validate + commit | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Synchronous enrichment fence + bounded scan await before closeDb

**Status**: Accepted

**Context**: Two DB-writing background activities were not fenced before `closeDb()`.

**Decision**: Set the enrichment flag synchronously (before any await) + clear the queue; bail in-flight runs at two points; track and bounded-await the scan promise.

**Consequences**:
- Positive: a clean shutdown leaves a clean WAL.
- Negative + mitigation: a few extra LOC on the shutdown path; bounded by the existing shutdown deadline.

**Alternatives Rejected**:
- Await full enrichment drain: unbounded (embeddings); the flag-and-drop + backfill is correct and bounded. See `decision-record.md`.
