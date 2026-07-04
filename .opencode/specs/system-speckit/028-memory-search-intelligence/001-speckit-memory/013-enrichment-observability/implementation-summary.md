---
title: "Implementation Summary: Enrichment Observability - read-side gauges (028/001 impl)"
description: "The pending/failed enrichment-backlog gauges shipped at e1c6a3c793. The decoupled oldest-pending lag gauge now extends the same health query with no schema migration."
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
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-speckit-memory/013-enrichment-observability"
    last_updated_at: "2026-07-04T17:51:05.281Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Implemented gauge-lag health observability"
    next_safe_action: "Run packet validation and hand back verification evidence"
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
    completion_pct: 100
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
| **Completed** | Yes |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This sub-phase turns the silent background enrichment backlog into something an operator can watch. When the Memory MCP saves a row it commits immediately and defers the entity/graph enrichment to an async, concurrency-capped scheduler. If that scheduler stalls or backs up, nothing surfaces it. The fix is a small set of read-side gauges that ride columns the schema already carries, so observing the backlog adds no new state and needs no migration.

### gauge-pending-failed (shipped)

You can now see how many rows are waiting and how many failed enrichment, straight from the health response. The health handler runs one grouped query over the non-complete backlog and folds the pending and failed counts into the existing `getBackgroundEnrichmentStats` aggregator. A stuck or backed-up scheduler stops being invisible. This landed in Wave-0 at commit `e1c6a3c793`.

### gauge-lag (shipped)

The sibling gauge answers a different question: not how many rows are waiting, but how old the oldest one is. It reads `MIN(created_at)` over the same non-complete rows and derives `oldestPendingAgeMs`, while also surfacing `oldestPendingAt` for the raw timestamp anchor. The research is explicit that this is decoupled from the C4-C consolidation cursor: lag needs only the pre-existing `post_insert_enrichment_status` column plus `created_at`, so it ships independently of any Wave-1 shared infrastructure. Its only gate was needs-benchmark, since every effort estimate in the 028 roadmap is structural inference, never a measured delta. Focused verification covers correctness and degradation behavior.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modified (`e1c6a3c793`) | `getBackgroundEnrichmentStats` returns pending/failed and remains DB-free |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Modified | Backlog query + `backgroundEnrichment` block, gauge-lag extends it with `MIN(created_at)` and neutral degradation |
| `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-health-edge.vitest.ts` | Modified | Known-age fixture, neutral all-complete case and missing-column degradation coverage |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

gauge-pending-failed shipped as one isolated, reversible hunk on the 028 branch at `e1c6a3c793` ("feat(memory): constitutional CAS guard + enrichment gauges + skip-closed sweep hygiene"), alongside two unrelated sibling candidates in the same commit. gauge-lag now ships as a single additive read-side hunk in `memory-crud-health.ts`, with a known-age fixture test, an all-complete neutral case, a missing-column neutral case, typecheck, build, focused vitest and strict packet validation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Compute lag in the health handler, not a new query class | The backlog query already scans the non-complete rows there, `MIN(created_at)` is one more aggregate on the same plan |
| Keep lag decoupled from the C4-C cursor | The roadmap and 027-revisit both state lag rides the existing status column + `created_at`, coupling it to C4-C would force an unnecessary Wave-1 deferral |
| Neutral-degrade on a schema edge | Mirror the shipped pending/failed catch-block so an absent column or a query error returns 0/null and the scheduler counters still surface, never an outage |
| Ship gauge-pending-failed before gauge-lag | Lag extends the exact query the pending/failed gauges introduced, sequencing after them costs nothing |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| gauge-pending-failed shipped | PASS, commit `e1c6a3c793` (verified + `git log`) |
| gauge-lag implemented | PASS, `oldestPendingAt` + `oldestPendingAgeMs` surfaced in `backgroundEnrichment` |
| `npm run typecheck` | PASS, baseline PASS, after PASS |
| `npx vitest run mcp_server/tests/handler-memory-health-edge.vitest.ts` | PASS, baseline 11 passed, after 13 passed |
| mutation check | PASS, forcing lag to `0` failed the known-age assertion, then production code was restored |
| `npm run build` | PASS |
| `validate.sh --strict` on this packet | PASS, Level 1, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Effort is structural inference, not a benchmark.** The "S" effort tag, like every estimate in the 028 roadmap, is a reasoning estimate and was never build-measured. gauge-lag shipped for correctness and reversibility, not a promised performance delta.
2. **Lag is read-side only.** It observes rows whose post-insert enrichment status is not complete. It does not retry, drain or steer the background scheduler.
<!-- /ANCHOR:limitations -->
