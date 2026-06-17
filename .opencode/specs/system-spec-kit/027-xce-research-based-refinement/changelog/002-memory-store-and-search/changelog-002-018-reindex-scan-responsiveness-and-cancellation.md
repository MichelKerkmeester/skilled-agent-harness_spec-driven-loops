---
title: "Reindex-Scan Responsiveness and Cancellation: The Background Scan No Longer Wedges the Daemon"
description: "A background memory_index_scan ran the whole scan on the daemon's single event-loop thread, and its all-rows tail loops swept every row synchronously with no yield, so a force scan starved IPC for over an hour and could not be cancelled. The tail loops now yield and re-check cancellation, processBatches has an early-abort, and the cancel flag is mirrored in memory."
trigger_phrases:
  - "002/018 reindex scan responsiveness cancellation changelog"
  - "memory_index_scan event loop starvation fix"
  - "background scan uncancellable wedge fix"
  - "027 002/018 shipped"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-17

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/018-reindex-scan-responsiveness-and-cancellation` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

A background `memory_index_scan` with force on starved the memory daemon for over an hour. The scan runs on the daemon's single event-loop thread, and its `await`s only drained microtasks (synchronous better-sqlite3 plus cache-served embeddings), while its two post-batch tail loops swept every indexed row fully synchronously with no yield. On a force scan over the whole corpus the loop was never handed back to the poll phase, so every IPC call (status, cancel, health, search) timed out and the scan was uncancellable, forcing a SIGKILL that left the index partially rebuilt. This packet makes the scan cooperative. The metadata-edge promotion loop yields a real macrotask and re-checks cancellation every 200 rows, the causal-chain folder loop does the same every 50 folders, `processBatches` gained an early-abort so a cancelled run stops promptly instead of draining no-op batches, and the cancel flag is mirrored in process so a hot loop can poll it without a SQLite round-trip on the shared connection. The diagnosis was confirmed by three parallel Opus seats, which established that the batch loop already yields, so the genuine starvation was the synchronous tail loops rather than the batch loop or the embedding await.

### Added

- `isCancelRequestedFast(jobId)` in `lib/ops/job-store.ts`, backed by an in-process cancelled-id `Set`, so cancellation is deliverable without a DB query on the contended connection
- `shouldAbort` early-abort hook on `processBatches` (`utils/batch-processor.ts`)

### Changed

- `handlers/memory-index.ts` - the metadata-edge sweep and the causal-chain folder loop yield plus re-check cancellation at row and folder boundaries, the scan wires `shouldAbort` into `processBatches`, and the background runner polls the fast cancel checker
- `lib/ops/job-store.ts` - `requestCancel` sets the in-process flag first, and the flag is cleared on terminal job transitions

### Fixed

- A heavy background scan no longer starves the event loop, so IPC stays serviceable during the run
- A cancellation now lands, where before the cancel request itself could not be processed under the starved loop

### Verification

| Check | Result |
|-------|--------|
| Build | PASS: `npm run build` exit 0 |
| Touched-surface suites | PASS: 68 tests (batch-processor, job-store, job-queue, job-queue-state-edge, handler-memory-index-scan-jobs) |
| Strict validate | PASS: `validate.sh --strict` on the phase folder |
| Deployed behavior | CONFIRMED: a heavy scan keeps the daemon responsive instead of the prior hour-long silent wedge |
| Full scan completion | NOT achieved: the launcher lease-heartbeat re-election recycles the daemon mid-scan and marks the run failed (separate follow-on) |

### Files Changed

| File | Action |
|------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/utils/batch-processor.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-store.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index-scan-jobs.vitest.ts` | Modified |

### Follow-Ups

- The launcher lease-heartbeat refresh fails under scan load or multi-launcher contention, and re-election recycles the daemon mid-scan, so a full force scan still does not run to completion. Making the heartbeat tolerate a busy maintenance scan, or moving the scan to an out-of-process worker, is the open follow-on. The index is functionally healthy without it.
