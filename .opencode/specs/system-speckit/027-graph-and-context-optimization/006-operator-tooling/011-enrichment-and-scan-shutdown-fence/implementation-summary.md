---
title: "Implementation Summary: Enrichment + startup-scan shutdown fences"
description: "The background-enrichment scheduler and the startup scan are now fenced in fatalShutdown before closeDb, so neither reopens the DB and re-dirties the WAL after the close checkpoint."
trigger_phrases:
  - "enrichment scan shutdown fence summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/006-operator-tooling/011-enrichment-and-scan-shutdown-fence"
    last_updated_at: "2026-06-15T08:00:00Z"
    last_updated_by: "main-agent"
    recent_action: "Implemented + verified both fences; tsc 0, all shutdown/enrichment tests green, dist rebuilt"
    next_safe_action: "Validate + commit + push"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "011-enrichment-and-scan-shutdown-fence"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-enrichment-and-scan-shutdown-fence |
| **Completed** | 2026-06-15 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`fatalShutdown` fenced the file watcher and ingest worker before `closeDb()` precisely because they re-resolve the DB through `requireDb()`, which reopens a closed connection — a write after the TRUNCATE checkpoint leaves a non-empty WAL at rest. The 010 deep-review found the background-enrichment scheduler and the fire-and-forget startup scan had the same hazard but were never fenced. They are now.

### Enrichment scheduler fence

`memory-save.ts` gained an `enrichmentShuttingDown` flag and an exported `shutdownBackgroundEnrichment()` that sets it and drops the queue. `fatalShutdown` calls it synchronously, before the awaited drains, so any queued `setImmediate(run)` that fires during the drain sees the flag and bails before `requireDb()`. An in-flight run also bails after the embedding await, before `recordEnrichmentResult` — so a run suspended on the network at shutdown never writes after the close checkpoint. Dropped rows stay enrichment-pending and the backfill re-enriches them on next boot; no data lost.

### Startup-scan fence

The scan loop now breaks on `shuttingDown` at the loop head, and the scan is tracked as `startupScanPromise` rather than fire-and-forget. `fatalShutdown` awaits that promise before `closeDb` (bounded — it resolves within the current file, and the existing shutdown deadline caps it). The scan is replayable on next boot, so abandoning its tail is safe.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modified | Flag + exported fence + bail points + re-arm/schedule guards |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modified | Import + call the fence; scan `shuttingDown` break; track + bounded-await `startupScanPromise` before `closeDb` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The fix mirrors the proven `fileWatcher`/`ingestWorker` fences — the in-code comment for those even references the same hazard. The enrichment flag is set in the synchronous cleanup block so it is in effect before the first awaited drain yields the loop. Verification ran the full shutdown surface: typecheck stayed at the 0-error baseline; the enrichment + async-scan regression stayed 14/14; the lifecycle-shutdown and shutdown-hooks unit tests stayed green; and the real-shutdown durability test (daemon-reelection disposes a daemon via SIGTERM → exercises `fatalShutdown` with the new fences) passed 4/4 — confirming shutdown still completes cleanly with the fences in place. `npm run build` regenerated dist with the fences present.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fence enrichment synchronously (flag + drop), don't drain | A run awaits a network embedding; a full drain is unbounded. The flag-and-drop is bounded and loses no data (backfill recovers) |
| Two bail checks in `run` | One before `requireDb()` (a run that hasn't started), one after the embed await (a run suspended on the network at shutdown) |
| Bound the scan with a `shuttingDown` break + tracked-promise await | The scan is replayable; abandoning its tail is safe, and awaiting it is bounded by the break + the shutdown deadline |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `tsc --noEmit` (delta vs 0 baseline) | PASS — 0 errors |
| Enrichment + async-scan regression | PASS — 14/14 |
| lifecycle-shutdown | PASS — 4/4 |
| shutdown-hooks | PASS — 4/4 |
| Real-shutdown integration (daemon-reelection, SIGTERM → fatalShutdown) | PASS — 4/4, 26.5s |
| `npm run build` | PASS — exit 0; fences present in dist |
| Comment hygiene | PASS — durable WHY only |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`recoverPendingFiles` phase is not break-guarded.** The `shuttingDown` break covers the main scan loop (the dominant, 11k-file phase); a shutdown during the earlier `recoverPendingFiles` runs that phase to completion (bounded — finite pending set) plus the shutdown deadline. Not worth the extra complexity now.
2. **No direct "no-write-after-close" unit test.** Asserting the negative (no WAL re-dirty) requires a shutdown-during-pending-enrichment harness; coverage here is the real-shutdown integration test (shutdown completes cleanly with fences) + the mirrored, proven fence pattern + reasoning.
3. **The 010 P2 backlog (queue cap, observability) is still deferred** — separate follow-ups; see `010/review/review-report.md`.
<!-- /ANCHOR:limitations -->
