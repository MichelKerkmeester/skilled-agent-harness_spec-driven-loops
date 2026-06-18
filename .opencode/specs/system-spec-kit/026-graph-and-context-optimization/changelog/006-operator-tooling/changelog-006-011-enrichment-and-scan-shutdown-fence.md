---
title: "Changelog: Fence the enrichment scheduler and startup scan in fatalShutdown before closeDb [006-operator-tooling/011-enrichment-and-scan-shutdown-fence]"
description: "Chronological changelog for the Fence the enrichment scheduler and startup scan in fatalShutdown before closeDb phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/011-enrichment-and-scan-shutdown-fence` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling`

### Summary

fatalShutdown fenced the file watcher and ingest worker before closeDb() precisely because they re-resolve the DB through requireDb(), which reopens a closed connection — a write after the TRUNCATE checkpoint leaves a non-empty WAL at rest. The 010 deep-review found the background-enrichment scheduler and the fire-and-forget startup scan had the same hazard but were never fenced. They are now.

### Added

- `enrichmentShuttingDown` flag and exported `shutdownBackgroundEnrichment()` in `handlers/memory-save.ts`, providing a synchronous fence that drops the queue and causes any in-flight or queued enrichment run to bail before `requireDb()`.
- Two bail points in the enrichment `run` function: one before `requireDb()` for a run that hasn't started, and one after the embedding await for a run suspended on the network at shutdown.
- Re-arm and schedule guards that check `enrichmentShuttingDown` before dequeuing or scheduling new work.
- `startupScanPromise` tracking in `context-server.ts` so `fatalShutdown` can await the scan before `closeDb`, replacing the previous fire-and-forget pattern.
- `shuttingDown` break at the startup-scan loop head, abandoning the scan tail safely since it replays on next boot.

### Changed

- `fatalShutdown` now calls `shutdownBackgroundEnrichment()` synchronously in its cleanup block and awaits `startupScanPromise` before `closeDb`, mirroring the existing `fileWatcher`/`ingestWorker` fence pattern.
- Dropped enrichment rows stay marked enrichment-pending in the commit transaction, so the backfill re-enriches them on next boot with no data loss.

### Fixed

- Reopen-after-close hazard: the enrichment scheduler and startup scan were never fenced in `fatalShutdown`, so a deferred run or in-progress scan could call `requireDb()` after `closeDb()`, reopen the connection, and re-dirty the WAL after the TRUNCATE checkpoint.

### Verification

- tsc --noEmit (delta vs 0 baseline) - PASS — 0 errors
- Enrichment + async-scan regression - PASS — 14/14
- lifecycle-shutdown - PASS — 4/4
- shutdown-hooks - PASS — 4/4
- Real-shutdown integration (daemon-reelection, SIGTERM → fatalShutdown) - PASS — 4/4, 26.5s
- npm run build - PASS — exit 0; fences present in dist
- Comment hygiene - PASS — durable WHY only
- Tasks complete - 7 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modified | Flag + exported fence + bail points + re-arm/schedule guards |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modified | Import + call the fence; scan shuttingDown break; track + bounded-await startupScanPromise before closeDb |

### Follow-Ups

- The 010 deep-review P2 backlog items (queue cap, failure aggregation, scheduler observability) remain deferred and are tracked as a follow-up packet (012).
