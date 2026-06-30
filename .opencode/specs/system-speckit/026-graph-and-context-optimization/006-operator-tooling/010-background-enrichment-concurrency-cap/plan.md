---
title: "Implementation Plan: Bound the background-enrichment scheduler so a save or startup-scan burst cannot starve the daemon event loop"
description: "Reserve the concurrency slot at schedule time and re-arm queued enrichment via setImmediate; add a periodic poll-phase yield to the startup-scan loop. ~14 LOC across memory-save.ts and context-server.ts."
trigger_phrases:
  - "background enrichment cap plan"
  - "enrichment scheduler fix"
  - "startup scan yield"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/010-background-enrichment-concurrency-cap"
    last_updated_at: "2026-06-14T20:50:00Z"
    last_updated_by: "main-agent"
    recent_action: "Authored implementation plan"
    next_safe_action: "Run the deep-review"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "010-background-enrichment-concurrency-cap"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Bound the background-enrichment scheduler so a save or startup-scan burst cannot starve the daemon event loop

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js, compiled to dist via tsc) |
| **Framework** | MCP server / spec-memory daemon |
| **Storage** | SQLite (better-sqlite3, synchronous) |
| **Testing** | vitest |

### Overview
Move the in-flight counter increment out of the deferred callback and into a `start(task)` helper that increments then schedules via `setImmediate`. The `finally` re-arms dequeued work through `start` (not a synchronous call). Add a periodic `setImmediate` yield to the startup-scan loop so a large scan returns to the poll phase between batches.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause confirmed against source + live incident + sampled stack
- [x] Clean typecheck baseline captured (0 errors)
- [x] Spec folder scaffolded

### Definition of Done
- [ ] REQ-001..005 met
- [ ] Enrichment + async-scan regression green; tsc 0 errors; dist rebuilt
- [ ] 10-iteration deep-review complete
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Bounded background worker: a fixed concurrency cap with an overflow queue feeding deferred enrichment runs off the save/scan hot path.

### Key Components
- **`scheduleBackgroundEnrichment`** (`memory-save.ts`): schedules a deferred enrichment run per saved row, capped at `MAX_BACKGROUND_ENRICHMENTS`.
- **`startupScan`** (`context-server.ts`): indexes all discovered files at boot, calling the scheduler per row.

### Data Flow
save/scan → `indexSingleFile` → row committed (enrichment-pending) → `scheduleBackgroundEnrichment` → bounded `setImmediate` run → enrichment + result recorded.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `memory-save.ts` `scheduleBackgroundEnrichment` | Schedules + caps background enrichment | Update — reserve slot at schedule time; re-arm via setImmediate | tsc + enrichment regression tests |
| `context-server.ts` `startupScan` loop | Indexes all files at boot (the burst producer) | Update — periodic poll-phase yield | tsc + async-scan test |
| `runPostInsertEnrichment` / `recordEnrichmentResult` | The enrichment work + result recording | Unchanged — only scheduling changed | code read |
| Enrichment-pending backfill path | Recovers skipped/dropped runs | Unchanged — still the safety net for rows whose run returns early | code read |
| `buildDeferredEnrichmentResult` (save response) | Deferred-result shape returned to callers | Unchanged | `enrichment-async-deferred` test green |

Required inventories:
- Consumers of the counter/queue: `rg -n "activeBackgroundEnrichments|backgroundEnrichmentQueue|MAX_BACKGROUND_ENRICHMENTS" handlers/memory-save.ts` (all three are module-local to the scheduler).
- Algorithm invariant: in-flight + scheduled-but-not-run enrichment runs never exceed `MAX_BACKGROUND_ENRICHMENTS`, because the counter is incremented exactly once per run at schedule/dequeue time and decremented exactly once in `finally`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the broken-cap defect in source
- [x] Capture clean tsc baseline
- [x] Scaffold spec folder

### Phase 2: Core Implementation
- [x] `start(task)` helper: increment then `setImmediate`
- [x] `finally` re-arms dequeued work via `start`
- [x] Periodic `setImmediate` yield in the scan loop

### Phase 3: Verification
- [x] tsc 0 errors; enrichment + async-scan tests green; dist rebuilt
- [ ] 10-iteration deep-review (opus-4.8 via claude2)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Type | Whole project compiles after edit (delta vs 0-error baseline) | tsc --noEmit |
| Regression | Deferred-result semantics, enrichment state, async scan | vitest |
| Review | Concurrency correctness, slot accounting, yield behavior | 10-iteration deep-review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| tsc build chain (`tsc --build` + finalize-dist) | Internal | Green | Cannot regenerate dist |
| vitest | Internal | Green | Cannot run regression |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Slot accounting regresses (enrichment stalls) or a behavior regression appears.
- **Procedure**: `git revert` the two-file change and `npm run build` to regenerate dist. No schema/data migration.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify + deep-review)
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
| Core Implementation | Low | ~30 min |
| Verification + deep-review | Med | ~30 min build/test + deep-review wall time |
| **Total** | | **~1 hour + review** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Enrichment regression green (no behavior change)
- [ ] tsc 0 errors; dist rebuilt

### Rollback Procedure
1. `git revert` the two-file commit.
2. `npm run build` to regenerate dist.
3. Smoke: a save still records enrichment; daemon responds.

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
│   Setup     │     │  cap + yield│     │ test+review │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| cap fix (memory-save.ts) | baseline | bounded scheduler | verification |
| scan yield (context-server.ts) | baseline | poll-phase yield | verification |
| deep-review | fix built | correctness verdict | completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **cap fix** - ~20 min - CRITICAL
2. **scan yield** - ~5 min - CRITICAL
3. **build + regression** - ~10 min - CRITICAL
4. **10-iter deep-review** - review wall time - CRITICAL

**Total Critical Path**: ~35 min + review

**Parallel Opportunities**:
- Docs drafted while the build/tests run.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Cap fixed | Slot reserved at schedule time | Phase 2 |
| M2 | Verified | tsc 0 + regression green + dist built | Phase 3 |
| M3 | Reviewed | 10-iter deep-review verdict addressed | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Reserve the slot before scheduling; re-arm via setImmediate

**Status**: Accepted

**Context**: The cap was read against a counter bumped inside the deferred callback, so a burst over-scheduled.

**Decision**: Increment at schedule/dequeue time in a `start` helper; re-arm queued work via `setImmediate`.

**Consequences**:
- Positive: the cap holds under bursts; the loop yields between runs.
- Negative + mitigation: a `setImmediate` hop per dequeue (sub-ms) — negligible vs the enrichment work.

**Alternatives Rejected**:
- Lower `MAX_BACKGROUND_ENRICHMENTS`: does not fix the accounting; a burst still over-schedules.
- A timestamp/debounce on scheduling: more state, same fix achievable with correct counter timing. See `decision-record.md`.
