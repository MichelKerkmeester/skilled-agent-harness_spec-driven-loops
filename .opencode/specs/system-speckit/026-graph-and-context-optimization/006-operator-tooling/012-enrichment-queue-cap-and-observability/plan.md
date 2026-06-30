---
title: "Implementation Plan: Cap the enrichment queue and expose scheduler health"
description: "Cap the overflow queue (drop→backfill), aggregate + rate-limit failures, and surface scheduler counters + the post_insert_enrichment_status distribution + a recovery hint in memory_health."
trigger_phrases:
  - "enrichment queue cap plan"
  - "enrichment health observability plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/012-enrichment-queue-cap-and-observability"
    last_updated_at: "2026-06-15T10:15:00Z"
    last_updated_by: "main-agent"
    recent_action: "Authored implementation plan"
    next_safe_action: "Validate + commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "012-enrichment-queue-cap-and-observability"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Cap the enrichment queue and expose scheduler health

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js → dist) |
| **Framework** | MCP server / spec-memory daemon |
| **Storage** | SQLite (WAL); `post_insert_enrichment_status` partial index |
| **Testing** | vitest |

### Overview
Add a queue-length cap with drop-on-overflow + a drop counter; aggregate failures into counters with a rate-limited log; export `getBackgroundEnrichmentStats()`; and assemble a `backgroundEnrichment` block (counters + a `post_insert_enrichment_status` GROUP BY) into the `memory_health` response with a recovery hint.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Findings characterized (010 deep-review F-007/F-009/F-010/F-011)
- [x] Health sub-object + hint pattern identified
- [x] Spec folder scaffolded

### Definition of Done
- [ ] REQ-001..005 met
- [ ] tsc 0; enrichment/scan/health tests green; dist rebuilt
- [ ] Docs synchronized; validate --strict
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Bounded background worker with observability: cap concurrency (010) + queue length (here), aggregate failures, expose state through the daemon's health surface.

### Key Components
- **`scheduleBackgroundEnrichment`** (`memory-save.ts`): queue cap + drop counter + failure aggregation.
- **`getBackgroundEnrichmentStats()`** (new export): scheduler counters.
- **`handleMemoryHealth`** (`memory-crud-health.ts`): assembles `backgroundEnrichment` + the recovery hint.

### Data Flow
save → scheduler (cap concurrency + queue, drop overflow) ; `memory_health` → `getBackgroundEnrichmentStats()` + a status GROUP BY → `backgroundEnrichment` block + hint.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `scheduleBackgroundEnrichment` else-branch | Pushes overflow unbounded | Update — cap + drop counter | enrichment regression |
| `run` catch | One `console.warn` per failure | Update — counters + rate-limited log | regression |
| `memory-crud-health.ts` response (2 sites) | Health sub-objects | Update — add `backgroundEnrichment` | health-edge test |
| `memory-crud-health.ts` hints | Diagnostic hints | Update — enrichment recovery hint | health-edge test |
| startupScan start (`context-server.ts`) | recoverPendingFiles unguarded | Update — `shuttingDown` guard | lifecycle-shutdown |

Required inventories:
- `rg "activeBackgroundEnrichments|backgroundEnrichmentQueue|enrichment(Dropped|Failure)Total"` — counters are module-local to the scheduler; the only new consumer is `memory_health`.
- Invariant: queue length ≤ `MAX_QUEUED_ENRICHMENTS`; every dropped row stays enrichment-pending (backfill-recoverable).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Characterize the 4 P2s + 2 minors; capture tsc baseline; scaffold

### Phase 2: Core Implementation
- [x] memory-save.ts: queue cap + drop counter; failure aggregation; stats getter; macrotask comment
- [x] memory-crud-health.ts: enrichment block (stats + pendingByStatus) in both sites + hint
- [x] context-server.ts: scan-start `shuttingDown` guard

### Phase 3: Verification
- [x] tsc 0; enrichment+scan+health-edge 24/24; dist rebuilt
- [ ] Docs + validate --strict + commit
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Type | Whole project compiles incl. the new import (delta vs 0) | tsc --noEmit |
| Regression | Enrichment deferred-result, async scan, memory_health edge | vitest |
| Manual | A `memory_health` call shows the `backgroundEnrichment` block (post-deploy) | runtime |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `post_insert_enrichment_status` partial index | Internal | Green | Query still works (full scan) |
| `memory_health` handler | Internal | Green | None — additive |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A health regression or an enrichment behavior change.
- **Procedure**: `git revert` the three-file change + `npm run build`. No data migration.
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
| Setup | Low | done |
| Core Implementation | Med | ~1 hour |
| Verification | Low | ~20 min |
| **Total** | | **~1.3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Enrichment + health-edge tests green
- [ ] tsc 0; dist rebuilt

### Rollback Procedure
1. `git revert` the three-file commit.
2. `npm run build`.
3. Smoke: `memory_health` returns (with or without the enrichment block).

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
│   Setup     │     │ cap+health  │     │ test+build  │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| queue cap + counters | scheduler | bounded queue + stats | health block |
| stats getter | counters | `getBackgroundEnrichmentStats` | health block |
| health block + hint | stats getter | observability | verification |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **scheduler changes** - ~30 min - CRITICAL
2. **health wiring** - ~30 min - CRITICAL
3. **tests + build** - ~20 min - CRITICAL

**Total Critical Path**: ~1.3 hours

**Parallel Opportunities**:
- Docs drafted while tests run.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Scheduler bounded + counted | Queue cap + failure/drop counters | Phase 2 |
| M2 | Observability live | `memory_health` shows `backgroundEnrichment` + hint | Phase 2 |
| M3 | Verified | tsc 0 + 24/24 + dist | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Drop-on-overflow + memory_health observability

**Status**: Accepted

**Context**: Concurrency was capped (010) but the queue, failures, and scheduler state were unbounded/invisible.

**Decision**: Cap the queue and drop overflow (backfill recovers); aggregate failures with a rate-limited log; expose counters + backlog + a recovery hint via `memory_health`.

**Consequences**:
- Positive: bounded memory under flood; a stuck/backed-up scheduler is diagnosable + recoverable.
- Negative + mitigation: dropped rows wait for backfill instead of the live queue — acceptable; no data loss.

**Alternatives Rejected**:
- Unbounded queue + re-derive payload: still risks OOM under flood; the cap is simpler and bounded. See `decision-record.md`.
