---
title: "Maintenance Grace: The Post-Scan Background-Embedding Burst Stays Marker-Protected"
description: "019 made a reindex's scan survive launcher re-election, but its marker was scoped to the scan job. The scan defers embeddings, so the real vector writes happen in the post-scan background-embedding queue, which was busy but unprotected, and a live run saw a separate re-election recycle the daemon mid-burst. The marker writer is now a shared reference-counted module that both the scan and the embedding queue hold, so the two overlap without clobbering each other and the post-scan burst is protected."
trigger_phrases:
  - "002/019 maintenance grace background embedding changelog"
  - "post-scan embedding queue reaped by contending launcher fix"
  - "shared reference-counted maintenance marker module"
  - "027 002/019 shipped"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-17

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/019-maintenance-grace-background-embedding` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

019 made a reindex's scan survive launcher re-election, but the maintenance marker was scoped to the scan job alone. The scan defers embeddings through asyncEmbedding, so the real vector writes do not happen during the scan. They happen afterward in the post-scan background-embedding queue, where the retry-manager background job drains the pending rows in `embedding_status`. That queue was busy but unprotected, and a live run saw a separate re-election recycle the daemon during the post-scan embedding burst. This packet extends the grace to that burst. The marker writer is extracted into a shared reference-counted module `lib/storage/maintenance-marker.ts`. Its `beginMaintenance(label)` returns `{ refresh(), end() }`, writes `<DATABASE_DIR>/.maintenance-active.json`, holds a 180s TTL with a 20s self-refresh, keeps the marker present while one or more holders are active, removes it at zero holders, and treats a repeated `end()` as idempotent. The scan IIFE in `handlers/memory-index.ts` now drives the marker through this module instead of an inline writer, and `runBackgroundJob` in `lib/providers/retry-manager.ts` calls `beginMaintenance('embedding-queue')` only after its empty-queue guard, ending it in the existing finally. Reference counting lets the scan and the embedding queue overlap without one clobbering the other's marker. The 019 launcher guard is unchanged.

### Added

- `lib/storage/maintenance-marker.ts`, a shared reference-counted marker module exposing `beginMaintenance(label) -> { refresh(), end() }`, writing `<DATABASE_DIR>/.maintenance-active.json` with a 180s TTL and a 20s self-refresh, present while one or more holders are active, removed at zero, and idempotent on repeated `end()`
- `tests/maintenance-marker.vitest.ts`, a unit test covering the reference-counting and idempotent-end behavior

### Changed

- `handlers/memory-index.ts` - the scan is refactored onto the shared module and the inline marker writer is removed, so the scan now begins and ends maintenance through `beginMaintenance`
- `lib/providers/retry-manager.ts` - `runBackgroundJob` holds the marker while a tick has work, calling `beginMaintenance('embedding-queue')` after the empty-queue guard and ending it in the existing finally

### Fixed

- The post-scan background-embedding burst is now marker-protected, so a competing launcher adopts the daemon rather than reaping it mid-drain

### Verification

| Check | Result |
|-------|--------|
| Build | PASS: `npm run build` exit 0 |
| Marker unit test | PASS: `tests/maintenance-marker.vitest.ts`, 5 tests covering ref-counting and idempotent end |
| Scan-job and launcher-guard suites | PASS |
| Isolated harness | PASS: the re-election adoption harness from 019, 6 tests |
| Pre-existing flake | NOTED: cross-file flake `retry-manager.vitest` T49, not introduced by this packet |
| Live marker adoption | CONFIRMED: launcher log shows "adopting live daemon ... via bridge instead of reaping" |

### Files Changed

| File | Action |
|------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts` | Added |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/tests/maintenance-marker.vitest.ts` | Added |

### Follow-Ups

- The marker keeps the daemon un-reaped while busy, but it does not make it responsive. A busy daemon cannot service a new launcher's bridge connection, so under heavy multi-launcher contention a fresh daemon can still be spawned. The complete fix is to make the heaviest synchronous scan and embedding phases cooperative through chunk-and-yield, as in 018, so the daemon stays responsive through them rather than only un-reaped.
- Full-cycle live validation wants a clean single-launcher environment, so the post-scan burst can be observed end to end without a competing re-election in flight.
