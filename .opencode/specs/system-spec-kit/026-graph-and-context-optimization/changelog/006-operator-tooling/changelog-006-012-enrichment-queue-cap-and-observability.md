---
title: "Changelog: Cap the enrichment queue and expose scheduler health [006-operator-tooling/012-enrichment-queue-cap-and-observability]"
description: "Chronological changelog for the Cap the enrichment queue and expose scheduler health phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-15

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/012-enrichment-queue-cap-and-observability` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling`

### Summary

010 capped enrichment concurrency and 011 fenced it at shutdown. This packet closes the 010 deep-review's P2 backlog so the scheduler is bounded, fault-tolerant, and observable.

### Added

- Queue cap (`MAX_QUEUED_ENRICHMENTS`, default 2000) in `handlers/memory-save.ts`: overflow work is dropped and counted rather than enqueued, so a sustained live-save flood can no longer grow the queue or its retained `parsed` payloads without bound. Dropped rows are re-enriched by the backfill on next boot.
- Failure aggregation with `failureTotal`/`lastError`/`lastErrorAt` counters and rate-limited `console.warn` (first few plus every 100th, with suppressed-count summary), so a systemic failure burst doesn't spam the log while the running total stays exact.
- `getBackgroundEnrichmentStats()` export from `handlers/memory-save.ts`, exposing scheduler counters for health reporting.
- `backgroundEnrichment` block in `memory_health` (both response sites in `handlers/memory-crud-health.ts`): scheduler counters (`active`/`queued`/`max`/`maxQueued`/`droppedTotal`/`failureTotal`/`lastError`), at-rest `pendingByStatus` distribution via GROUP BY on `post_insert_enrichment_status`, and a recovery hint when backlog, failures, or dropped count cross thresholds.
- `shuttingDown` guard at startup-scan start in `context-server.ts`, before `recoverPendingFiles`, closing the 011 residual.

### Changed

- Overflow queue now drops work beyond the cap instead of growing unboundedly, relying on the existing enrichment-pending marker and backfill for recovery.
- Failure logs are rate-limited while keeping an exact `failureTotal` count available in `memory_health`.
- `setImmediate` in the scheduler annotated with a comment asserting the macrotask-boundary requirement (not `queueMicrotask`).

### Fixed

- Unbounded enrichment queue: a large startup scan or sustained save burst no longer retains unbounded `parsed` payloads in memory, capping transient retention at `MAX_QUEUED_ENRICHMENTS` entries.
- Invisible scheduler state: a stuck or degraded enrichment scheduler is now surfaced in `memory_health` with actionable counters and a recovery hint, rather than remaining a silent outage.

### Verification

- tsc --noEmit (delta vs 0 baseline) - PASS — 0 errors
- Enrichment + async-scan + memory_health-edge regression - PASS — 24/24
- npm run build - PASS — exit 0; 012 changes in dist (memory-save 7 refs, health 3 refs)
- Comment hygiene - PASS — durable WHY only
- Tasks complete - 7 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `handlers/memory-save.ts` | Modified | Queue cap + drop counter; failure aggregation + rate-limited log; getBackgroundEnrichmentStats(); macrotask comment |
| `handlers/memory-crud-health.ts` | Modified | backgroundEnrichment block (stats + pendingByStatus) in both response sites + recovery hint |
| `context-server.ts` | Modified | shuttingDown guard at scan start |

### Follow-Ups

- Queue cap and hint thresholds (`MAX_QUEUED_ENRICHMENTS=2000`, hint backlog>500) are fixed heuristics; make them env-tunable if a workload profile needs different bounds.
- Dedicated flood-to-drop unit test: coverage is the regression suite + `memory_health`-edge test + reasoning; a deterministic harness for the drop path is a possible future addition.
- Backlog recovery still relies on `memory_index_scan` / backfill; a dedicated enrichment-backfill tool was not added.
