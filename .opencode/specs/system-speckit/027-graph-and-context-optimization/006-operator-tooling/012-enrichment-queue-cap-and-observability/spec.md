---
title: "Feature Specification: Cap the enrichment queue and expose scheduler health"
description: "The background-enrichment scheduler bounds concurrency but not queue length (a live save flood grows it + its retained parsed payloads without bound), failures are log-only/unaggregated, and the scheduler state + enrichment backlog are invisible to memory_health so a stuck or backed-up scheduler is a silent outage. Closes the 010 deep-review P2 backlog (F-007, F-009, F-010, F-011) plus two minors."
trigger_phrases:
  - "enrichment queue cap"
  - "enrichment scheduler health"
  - "background enrichment observability"
  - "memory_health enrichment backlog"
  - "F-007 F-009 F-010 F-011 backlog"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/006-operator-tooling/012-enrichment-queue-cap-and-observability"
    last_updated_at: "2026-06-15T10:15:00Z"
    last_updated_by: "main-agent"
    recent_action: "Implemented + verified the queue cap, failure aggregation, and memory_health observability"
    next_safe_action: "Validate + commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "012-enrichment-queue-cap-and-observability"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Cap the enrichment queue and expose scheduler health

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

The 010 cap fix bounds enrichment CONCURRENCY (4), and 011 fenced it at shutdown. The 010 deep-review left a P2 backlog: the overflow QUEUE is unbounded (a sustained live-save flood grows it + its retained `parsed` payloads without bound), background failures are log-only and unaggregated, and neither the scheduler state nor the enrichment backlog is exposed in `memory_health` — so a stuck or backed-up scheduler is a silent outage. This packet caps the queue (drop overflow → backfill recovers), aggregates failures with a rate-limited log, and surfaces scheduler counters + the `post_insert_enrichment_status` distribution + a recovery hint in `memory_health`.

**Key Decisions**: Drop-on-overflow (not unbounded growth); rate-limit failure logs but keep running totals; expose via the existing `memory_health` sub-object + hint pattern.

**Critical Dependencies**: None new — module-local counters + an existing health handler.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-06-15 |
| **Branch** | `system-speckit/028-xce-research-based-refinement` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`scheduleBackgroundEnrichment` (`memory-save.ts`) caps concurrency but pushes overflow to an unbounded queue; a live-save flood grows it (and each entry's retained `parsed`) without bound (F-007). Failures are a per-event `console.warn` with no counter/last-error/rate-limit (F-010). `memory_health` reports vector backlog but not the enrichment scheduler state or the `post_insert_enrichment_status` distribution, so a stuck cap (or backlog) is undetectable until search quality degrades (F-009), and there is no operator remediation hint (F-011).

### Purpose
The enrichment scheduler is bounded in queue length, its failures are counted and rate-limited, and its state + backlog + a recovery hint are visible in `memory_health`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- F-007: cap queue length (`MAX_QUEUED_ENRICHMENTS`), drop overflow (row stays pending → backfill).
- F-010: failure counter + last-error + rate-limited warn with a suppressed-count summary.
- F-009: `getBackgroundEnrichmentStats()` + `memory_health` `backgroundEnrichment` block (counters + `pendingByStatus`).
- F-011: `memory_health` recovery hint when backlog/failures/dropped/stuck cross a threshold.
- Minors: a macrotask-boundary comment on the scheduler `setImmediate`; a `shuttingDown` guard at scan start (011 residual).

### Out of Scope
- The 010 cap fix and the 011 shutdown fences (shipped).
- Re-tuning `MAX_BACKGROUND_ENRICHMENTS` (stays 4).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modify | Queue cap + drop counter; failure aggregation + rate-limited log; `getBackgroundEnrichmentStats()` export; macrotask comment |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Modify | `backgroundEnrichment` block (stats + `pendingByStatus`) in both response sites; recovery hint |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modify | `shuttingDown` guard at scan start (recoverPendingFiles residual) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Queue length is bounded | Overflow beyond `MAX_QUEUED_ENRICHMENTS` is dropped (counted), not pushed; the row stays enrichment-pending for backfill |
| REQ-002 | No enrichment behavior regression | Enrichment + async-scan + health-edge tests stay green |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Failures aggregated + rate-limited | `failureTotal`/`lastError` tracked; per-failure warn rate-limited with a suppressed-count summary |
| REQ-004 | Scheduler health exposed | `memory_health` includes a `backgroundEnrichment` block (active/queued/max/maxQueued/dropped/failures/lastError + `pendingByStatus`) and a recovery hint when elevated |
| REQ-005 | Clean typecheck/build | `tsc --noEmit` stays at the 0-error baseline; dist rebuilt |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Under a sustained flood the queue stops at `MAX_QUEUED_ENRICHMENTS`; dropped rows are visible in `memory_health` and recovered by backfill.
- **SC-002**: `memory_health` surfaces the scheduler state + enrichment backlog + a recovery hint; tsc 0; enrichment/scan/health tests green; dist rebuilt.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `MAX_QUEUED_ENRICHMENTS=2000` too low/high | Low | Generous default; overflow is recoverable via backfill, not lost |
| Risk | Health DB query adds cost | Low | One indexed GROUP BY on `post_insert_enrichment_status` (a dedicated partial index exists), only on `memory_health` calls |
| Risk | Circular import (health ← memory-save) | Low | Function-level import resolved at runtime; tsc 0 confirms |
<!-- /ANCHOR:risks -->

---
<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No steady-state cost beyond a few counter writes; the health query runs only on `memory_health` calls.

### Security
- **NFR-S01**: No security surface change; counters are internal, the hint is non-sensitive.

### Reliability
- **NFR-R01**: A flood cannot OOM the daemon via the enrichment queue; a stuck/backed-up scheduler is now diagnosable.

---

## 8. EDGE CASES

### Data Boundaries
- Empty/idle scheduler: stats are zeros; no hint.
- Flood beyond the cap: queue holds at the cap; `droppedTotal` climbs; backfill recovers.

### Error Scenarios
- Health DB query fails (schema/edge): `pendingByStatus` is left empty; scheduler counters still surface.
- Failure burst: only the first few + every 100th warn is logged; the rest fold into a suppressed-count summary; `failureTotal` is exact.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 9/25 | Files: 3, LOC: ~70, Systems: 2 (scheduler + health) |
| Risk | 10/25 | No lifecycle change; additive counters + a read-only health query |
| Research | 8/20 | Findings already characterized by the 010 deep-review |
| Multi-Agent | 2/15 | Single-author |
| Coordination | 4/15 | Pairs with 010/011 |
| **Total** | **33/100** | **Level 3 (chain consistency)** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Drop loses enrichment | M | L | Row stays pending → backfill re-enriches; no data loss |
| R-002 | Health query slow at scale | L | L | Indexed partial query; on-demand only |
| R-003 | Counters drift | L | L | Simple increments; no concurrency hazard (single JS thread) |

---

## 11. USER STORIES

### US-001: Operator diagnoses a stuck scheduler (Priority: P1)

**As an** operator whose search quality degraded, **I want** `memory_health` to show enrichment backlog/failures and a remediation hint, **so that** I can detect and recover a stuck scheduler.

**Acceptance Criteria**:
1. Given a backed-up or failing scheduler, When I call `memory_health`, Then I see the scheduler counters, the pending-by-status backlog, and a "restart + backfill" hint.

---

### US-002: A save flood cannot OOM the daemon (Priority: P0)

**As a** daemon under a bulk-ingest flood, **I want** the enrichment queue bounded, **so that** retained payloads cannot grow without limit.

**Acceptance Criteria**:
1. Given saves faster than the drain, When the queue hits `MAX_QUEUED_ENRICHMENTS`, Then further work is dropped (counted) and recovered by backfill.

---

## 12. OPEN QUESTIONS

- None. Thresholds (`MAX_QUEUED_ENRICHMENTS=2000`, hint backlog>500) are heuristics, env-tunable in a later pass if needed.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
