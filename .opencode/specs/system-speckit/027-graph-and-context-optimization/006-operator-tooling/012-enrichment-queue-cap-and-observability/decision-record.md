---
title: "Decision Record: Cap the enrichment queue and expose scheduler health"
description: "Why overflow is dropped (not grown) and recovered via backfill, failures are rate-limited but counted, and scheduler state is surfaced through memory_health."
trigger_phrases:
  - "enrichment queue cap decision"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/006-operator-tooling/012-enrichment-queue-cap-and-observability"
    last_updated_at: "2026-06-15T10:15:00Z"
    last_updated_by: "main-agent"
    recent_action: "Recorded ADR-001"
    next_safe_action: "Validate + commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "012-enrichment-queue-cap-and-observability"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Cap the enrichment queue and expose scheduler health

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Drop-on-overflow + memory_health observability

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-15 |
| **Deciders** | Michel Kerkmeester (owner), main agent |

---

<!-- ANCHOR:adr-001-context -->
### Context

010 capped enrichment concurrency; 011 fenced it at shutdown. The 010 deep-review left a P2 backlog: the overflow queue was unbounded (a live-save flood grows it + retained `parsed` without bound), failures were log-only/unaggregated, and the scheduler state + enrichment backlog were invisible to `memory_health` — making a stuck or backed-up scheduler a silent outage.

### Constraints

- Must not OOM under a flood.
- Must not lose enrichment data.
- Must not spam logs on a systemic failure burst.
- Reuse the existing `memory_health` sub-object + hint pattern.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Cap the overflow queue at `MAX_QUEUED_ENRICHMENTS` and DROP beyond it (incrementing a counter); aggregate failures into a `failureTotal`/`lastError` pair with a rate-limited per-failure log; export `getBackgroundEnrichmentStats()` and surface a `backgroundEnrichment` block (counters + the `post_insert_enrichment_status` distribution) plus a recovery hint in `memory_health`.

**How it works**: On overflow the row is not enqueued — but it was marked enrichment-pending in the commit transaction, so the backfill re-enriches it (no data loss). The failure log emits the first few + every 100th, folding suppressed counts into the next line; the running total is exact. `memory_health` reads the module counters + one GROUP BY, and pushes a "restart + `memory_index_scan({force:true})`" hint when backlog/failures/dropped/stuck cross a threshold.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Drop-on-overflow + health observability (chosen)** | Bounded; no data loss (backfill); diagnosable | Dropped rows wait for backfill, not the live queue | 9/10 |
| Unbounded queue, re-derive `parsed` at run time | Smaller per-entry retention | Still unbounded count → OOM under flood; adds per-run re-read I/O | 4/10 |
| Block/backpressure the save path | Hard bound | Couples save latency to enrichment; risky for the hot path | 2/10 |
| Leave it (rely on the deep-review note) | Zero change | Silent-outage risk remains; the user asked to close the backlog | 1/10 |

**Why this one**: Bounds memory, loses no data, and makes the scheduler diagnosable with minimal, additive change.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The enrichment queue cannot grow without bound under a flood.
- A stuck or backed-up scheduler is now visible in `memory_health` with a remediation hint.
- Failure bursts no longer spam the log; the running total stays exact.

**What it costs**:
- Dropped rows are recovered by backfill, not the live queue (slightly later enrichment). Mitigation: no data loss; the generous cap (2000) rarely trips.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Drop loses data | M | Row stays enrichment-pending → backfill recovers |
| Health query cost | L | Indexed partial GROUP BY, on-demand only |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The user asked to close the deferred backlog; the silent-outage + OOM risks are real |
| 2 | **Beyond Local Maxima?** | PASS | Four alternatives weighed |
| 3 | **Sufficient?** | PASS | ~70 LOC, additive; reuses health + backfill |
| 4 | **Fits Goal?** | PASS | Completes the enrichment-scheduler hardening chain (010/011/012) |
| 5 | **Open Horizons?** | PASS | Thresholds env-tunable later; leaves room for a dedicated enrichment-backfill tool |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `memory-save.ts`: `MAX_QUEUED_ENRICHMENTS` + drop counter; failure counters + rate-limited log; `getBackgroundEnrichmentStats()`; macrotask-boundary comment.
- `memory-crud-health.ts`: `backgroundEnrichment` block (stats + `pendingByStatus`) in both response sites + recovery hint.
- `context-server.ts`: `shuttingDown` guard at scan start.

**How to roll back**: `git revert` the three-file commit + `npm run build`. No data migration.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
