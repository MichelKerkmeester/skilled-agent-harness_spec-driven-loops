---
title: "Changelog: Enrichment Observability — read-side gauges [001-speckit-memory/013-enrichment-observability]"
description: "Chronological changelog for the Enrichment Observability — read-side gauges phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/013-enrichment-observability` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

This sub-phase turns the silent background enrichment backlog into something an operator can watch. When the Memory MCP saves a row it commits immediately and defers the entity/graph enrichment to an async, concurrency-capped scheduler. If that scheduler stalls or backs up, nothing surfaces it. The fix is a small set of read-side gauges that ride columns the schema already carries, so observing the backlog adds no new state and needs no migration.

### Added

- Extend the backlog query with MIN(created_at) over rows WHERE post_insert_enrichment_status != 'complete' (handlers/memory-crud-health.ts)
- Confirm pending/failed gauge values unchanged; typecheck + build green

### Changed

- Compute the at-rest backlog distribution from the non-complete rows query (handlers/memory-crud-health.ts:904-907) — shipped e1c6a3c793
- Fold pending/failed into getBackgroundEnrichmentStats (handlers/memory-save.ts:2969-2970) — shipped e1c6a3c793
- Neutral-degrade on a schema edge via the catch-block (handlers/memory-crud-health.ts:908-910) — shipped e1c6a3c793
- Read the seam: backlog query + getBackgroundEnrichmentStats (handlers/memory-crud-health.ts; handlers/memory-save.ts)
- Derive oldest-pending age (lag) and merge it into the backgroundEnrichment health block (handlers/memory-crud-health.ts)
- Preserve neutral-degrade (lag → 0/null when the column is absent or the query throws) (handlers/memory-crud-health.ts)

### Fixed

- [P] Handler unit test: known-age pending fixture → expected lag; empty/all-complete backlog → neutral zero/null

### Verification

- gauge-pending-failed shipped - PASS — commit e1c6a3c793 (verified in 030-memory-search-intelligence-impl/spec.md §14 + git log)
- gauge-lag implemented - PASS — oldestPendingAt + oldestPendingAgeMs surfaced in backgroundEnrichment
- npm run typecheck - PASS — baseline PASS, after PASS
- npx vitest run mcp_server/tests/handler-memory-health-edge.vitest.ts - PASS — baseline 11 passed, after 13 passed
- mutation check - PASS — forcing lag to 0 failed the known-age assertion, then production code was restored
- npm run build - PASS
- validate.sh --strict on this packet - PASS — Level 1, exit 0
- Tasks complete - 13 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modified (e1c6a3c793) | getBackgroundEnrichmentStats returns pending/failed and remains DB-free |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Modified | Backlog query + backgroundEnrichment block; gauge-lag extends it with MIN(created_at) and neutral degradation |
| `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-health-edge.vitest.ts` | Modified | Known-age fixture, neutral all-complete case, and missing-column degradation coverage |

### Follow-Ups

- Effort is structural inference, not a benchmark. The "S" effort tag, like every estimate in the 028 roadmap, is a reasoning estimate and was never build-measured. gauge-lag shipped for correctness and reversibility, not a promised performance delta.
- Lag is read-side only. It observes rows whose post-insert enrichment status is not complete; it does not retry, drain, or steer the background scheduler.
