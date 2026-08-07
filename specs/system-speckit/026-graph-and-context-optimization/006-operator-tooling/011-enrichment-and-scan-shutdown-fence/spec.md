---
title: "Feature Specification: Fence the enrichment scheduler and startup scan in fatalShutdown before closeDb"
description: "The background-enrichment scheduler and the fire-and-forget startup scan are not fenced in fatalShutdown before closeDb, so a deferred run or a resuming scan can re-resolve the DB via requireDb() (which reopens a closed connection) and write fresh WAL frames after the TRUNCATE checkpoint — violating the close durability guarantee. Surfaced by the 010 deep-review (F-008, F-012; confirmed by two models + source)."
trigger_phrases:
  - "enrichment shutdown fence"
  - "startup scan shutdown fence"
  - "fatalShutdown reopen DB wal"
  - "shutdownBackgroundEnrichment"
  - "F-008 F-012 shutdown durability"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/006-operator-tooling/011-enrichment-and-scan-shutdown-fence"
    last_updated_at: "2026-06-15T08:00:00Z"
    last_updated_by: "main-agent"
    recent_action: "Implemented + verified the two shutdown fences"
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
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Fence the enrichment scheduler and startup scan in fatalShutdown before closeDb

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

`fatalShutdown` fences the file watcher and ingest worker before `closeDb()` precisely because those writers re-resolve the DB through `requireDb()`/`getDb()`, which REOPENS a closed connection — a write after the TRUNCATE checkpoint would leave a non-empty WAL at rest and defeat the close durability guarantee (README close contract). The background-enrichment scheduler and the fire-and-forget startup scan were absent from that fence list. The 010 deep-review (F-008, F-012; two models + direct source) confirmed a deferred enrichment run or a resuming scan can reopen the DB and re-dirty the WAL after close. This packet adds both to the shutdown fence.

**Key Decisions**: Fence the scheduler synchronously (set a flag + clear the queue) in fatalShutdown's pre-await block; track the scan promise and await it (bounded) before `closeDb`; bail in-flight runs before and after the embed await.

**Critical Dependencies**: None new — reuses the existing `runCleanupStep`/`runAsyncCleanupStep` fence machinery and the `shuttingDown` flag.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-06-15 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`fatalShutdown` (`context-server.ts`) fences `fileWatcher` and `ingestWorker` before `closeDb()` because both write through `requireDb()`, which reopens a closed DB. The background-enrichment scheduler (`memory-save.ts scheduleBackgroundEnrichment`) and the startup scan (`void startupScan(...)`, fire-and-forget) were not fenced: a queued/in-flight enrichment run, or a scan resuming during the shutdown drain, can call `requireDb()` after `closeDb()`, reopen the connection, and write fresh WAL frames after the TRUNCATE checkpoint — leaving a non-empty WAL at rest (operational harm: a possibly-needless boot rebuild; bounded by `wal_autocheckpoint=256` + the boot integrity gate; no data loss, backfill recovers).

### Purpose
Neither the enrichment scheduler nor the startup scan touches the DB after `closeDb()`, so a clean shutdown leaves a clean WAL.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fence the enrichment scheduler: a `shutdownBackgroundEnrichment()` (flag + clear queue) called in fatalShutdown before the awaited drains; `run` bails before `requireDb()` and after the embed await.
- Fence the startup scan: break on `shuttingDown` at the loop head; track `startupScanPromise`; await it (bounded) before `closeDb`.

### Out of Scope
- The 010 cap fix (already shipped; correct).
- The F-006 hung-run (REFUTED — providers timeout-bound the embed).
- The P2 backlog (queue cap, observability) — separate follow-ups.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modify | `enrichmentShuttingDown` flag + exported `shutdownBackgroundEnrichment()`; bail points in `run`; re-arm guard; schedule guard |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modify | Import + call the enrichment fence; `shuttingDown` break in the scan loop; track `startupScanPromise`; await it before `closeDb` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Enrichment cannot write after closeDb | The scheduler is fenced before the awaited drains; in-flight runs bail before `requireDb()` and after the embed await |
| REQ-002 | Startup scan cannot write after closeDb | The scan breaks on `shuttingDown`; fatalShutdown awaits `startupScanPromise` before `closeDb` |
| REQ-003 | Shutdown still completes (no hang/regression) | The shutdown lifecycle + real-shutdown durability tests stay green |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | No enrichment behavior regression | Enrichment + async-scan tests stay green; dropped work recovered by backfill |
| REQ-005 | Clean typecheck/build | `tsc --noEmit` stays at the 0-error baseline; dist rebuilt |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: On clean shutdown, neither the enrichment scheduler nor the startup scan reopens the DB after `closeDb()` — the WAL stays clean at rest.
- **SC-002**: tsc 0 errors; enrichment + lifecycle-shutdown + real-shutdown (daemon-reelection) tests green; dist rebuilt.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Awaiting `startupScanPromise` stalls shutdown | Med | Scan breaks on `shuttingDown` at the loop head → resolves within the current file; bounded by `SHUTDOWN_DEADLINE_MS` |
| Risk | A run mid-embed-await writes after close | Med | Second bail check after the await, before `recordEnrichmentResult` |
| Risk | Fence breaks normal shutdown | High | Verified by lifecycle-shutdown + real-shutdown daemon-reelection tests (all green) |
<!-- /ANCHOR:risks -->

---
<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No steady-state cost; the fence runs only at shutdown. Awaiting the scan is bounded by the deadline.

### Security
- **NFR-S01**: No security surface change.

### Reliability
- **NFR-R01**: A clean shutdown produces a clean WAL — no needless boot rebuild from a re-dirtied WAL.

---

## 8. EDGE CASES

### Data Boundaries
- Shutdown with empty queue / no scan: fences are no-ops.
- Shutdown mid-embed-await: the post-await bail prevents the write; row stays pending → backfill.

### Error Scenarios
- A run already past both bail checks (in `recordEnrichmentResult`): synchronous better-sqlite3 write cannot interleave with the synchronous `closeDb()` on the single JS thread.
- Scan stuck in `recoverPendingFiles` (no break there): bounded (finite pending set) + the shutdown deadline.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 8/25 | Files: 2, LOC: ~25, Systems: 1 |
| Risk | 19/25 | Daemon shutdown lifecycle + the hot enrichment path |
| Research | 12/20 | Confirmed by the 010 deep-review + source trace |
| Multi-Agent | 4/15 | opus + gpt-5.5 confirmed the finding; single-author fix |
| Coordination | 5/15 | Pairs with 009/010 |
| **Total** | **48/100** | **Level 3 (risk-driven)** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Fence stalls/hangs shutdown | H | L | Bounded await + deadline; real-shutdown test green |
| R-002 | A write still slips past after close | H | L | Two bail checks + sync-thread argument; mirrors proven fileWatcher/ingestWorker fences |
| R-003 | Enrichment behavior regresses | M | L | 14/14 enrichment regression green; dropped work → backfill |

---

## 11. USER STORIES

### US-001: Operator restarts the daemon cleanly (Priority: P0)

**As an** operator issuing a supervised restart, **I want** a clean shutdown to leave a clean WAL, **so that** the next boot does not run a needless integrity rebuild.

**Acceptance Criteria**:
1. Given pending enrichment / an active scan at SIGTERM, When the daemon shuts down, Then no DB write occurs after `closeDb()` and the WAL is clean at rest.

---

### US-002: Pending enrichment is not lost (Priority: P1)

**As a** caller whose saves had pending enrichment at shutdown, **I want** that work recovered, **so that** no data is lost.

**Acceptance Criteria**:
1. Given dropped enrichment at shutdown, When the daemon reboots, Then the pending-marker backfill re-enriches those rows.

---

## 12. OPEN QUESTIONS

- None. The recoverPendingFiles-phase break is a residual (bounded) noted in Edge Cases; not worth the extra complexity now.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
