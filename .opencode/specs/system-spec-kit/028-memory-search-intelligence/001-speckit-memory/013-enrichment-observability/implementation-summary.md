---
title: "Implementation Summary: Enrichment Observability — read-side gauges (028/001 impl)"
description: "The pending/failed enrichment-backlog gauges shipped at e1c6a3c793. The decoupled oldest-pending lag gauge is specified and pending; it extends the same health query with no schema migration."
trigger_phrases:
  - "enrichment observability summary"
  - "gauge lag status"
  - "backlog gauge shipped pending"
  - "memory health gauge summary"
  - "enrichment gauge implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/013-enrichment-observability"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author impl-summary; gauge-pending-failed shipped (e1c6a3c793), gauge-lag pending"
    next_safe_action: "Implement gauge-lag: MIN(created_at) over non-complete rows in memory-crud-health.ts"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-013-enrichment-observability"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-memory-search-intelligence/001-speckit-memory/013-enrichment-observability |
| **Completed** | Partial (gauge-pending-failed shipped; gauge-lag pending) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This sub-phase turns the silent background enrichment backlog into something an operator can watch. When the Memory MCP saves a row it commits immediately and defers the entity/graph enrichment to an async, concurrency-capped scheduler. If that scheduler stalls or backs up, nothing surfaces it. The fix is a small set of read-side gauges that ride columns the schema already carries, so observing the backlog adds no new state and needs no migration.

### gauge-pending-failed (shipped)

You can now see how many rows are waiting and how many failed enrichment, straight from the health response. The health handler runs one grouped query over the non-complete backlog and folds the pending and failed counts into the existing `getBackgroundEnrichmentStats` aggregator. A stuck or backed-up scheduler stops being invisible. This landed in Wave-0 at commit `e1c6a3c793`.

### gauge-lag (pending)

The not-yet-shipped sibling answers a different question: not how many rows are waiting, but how old the oldest one is. It reads `MIN(created_at)` over the same non-complete rows and derives an oldest-pending age, surfaced alongside pending and failed in the same health block. The research is explicit that this is decoupled from the C4-C consolidation cursor: lag needs only the pre-existing `post_insert_enrichment_status` column plus `created_at`, so it ships independently of any Wave-1 shared infrastructure. Its only gate is needs-benchmark, since every effort estimate in the 028 roadmap is structural inference, never a measured delta.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modified (`e1c6a3c793`) | `getBackgroundEnrichmentStats` returns pending/failed; gauge-lag may thread an oldest-pending field here for parity |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Modified (`e1c6a3c793`) + pending | Backlog query + `backgroundEnrichment` block; gauge-lag extends it with `MIN(created_at)` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

gauge-pending-failed shipped as one isolated, reversible hunk on the 028 branch at `e1c6a3c793` ("feat(memory): constitutional CAS guard + enrichment gauges + skip-closed sweep hygiene"), alongside two unrelated sibling candidates in the same commit. gauge-lag is planned the same way: a single additive read-side hunk in `memory-crud-health.ts`, a known-age fixture test plus an empty-backlog neutral case, typecheck and build green, then strict packet validation before commit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Compute lag in the health handler, not a new query class | The backlog query already scans the non-complete rows there; `MIN(created_at)` is one more aggregate on the same plan |
| Keep lag decoupled from the C4-C cursor | The roadmap and 027-revisit both state lag rides the existing status column + `created_at`; coupling it to C4-C would force an unnecessary Wave-1 deferral |
| Neutral-degrade on a schema edge | Mirror the shipped pending/failed catch-block so an absent column or a query error returns 0/null and the scheduler counters still surface, never an outage |
| Ship gauge-pending-failed before gauge-lag | Lag extends the exact query the pending/failed gauges introduced; sequencing after them costs nothing |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| gauge-pending-failed shipped | PASS — commit `e1c6a3c793` (verified in `030-memory-search-intelligence-impl/spec.md` §14 + `git log`) |
| gauge-lag implemented | PENDING — specified, not yet coded |
| `validate.sh --strict` on this packet | PASS — see report (Level 1, exit 0) |
| gauge-lag handler test (known-age + empty backlog) | PENDING — to run with the implementation |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **gauge-lag is not yet implemented.** Only its sibling pending/failed gauges are live. This document records the shipped half and the planned half honestly.
2. **Effort is structural inference, not a benchmark.** The "S" effort tag, like every estimate in the 028 roadmap, is a reasoning estimate and was never build-measured. Ship gauge-lag for correctness and reversibility, not a promised delta.
3. **Surface shape is open.** Whether lag renders as a duration or as an absolute oldest-`created_at` timestamp is an implementation-time calibration the research does not prescribe.
<!-- /ANCHOR:limitations -->
