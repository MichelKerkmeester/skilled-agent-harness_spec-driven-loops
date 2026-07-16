---
title: "005 Resource Leaks and Silent Errors Remediation"
description: "Five surgical fixes close three resource leaks and two silent error paths in the skill-graph daemon and file-system watcher. Watch handles for deleted skills now release. The diagnostics array is bounded to 100 entries with aggregate counters. The reindex-slot queue drains on close. Corrupt SQLite projections warn rather than silently falling back. Malformed graph-metadata.json records a diagnostic instead of dropping watch targets."
trigger_phrases:
  - "resource leaks silent errors remediation"
  - "watcher target refresh leak"
  - "diagnostics ring buffer cap"
  - "file-watcher queue cap close drain"
  - "advisor projection filesystem-fallback"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-30

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/005-resource-leaks-silent-errors` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/006-research/004-fix-deep-research-findings`

### Summary

The skill-graph daemon and the file-system watcher each had quiet bleed-points that only surfaced after long uptime. Deleted skills kept their chokidar watch handles, file-hash cache entries plus pending reindex slots alive for the daemon's full lifetime. The diagnostics array grew one entry per event indefinitely. A burst of file events could fill an unbounded pending-slot queue and leak Promises that never settled when the watcher shut down. On the silent-error side, a corrupt SQLite advisor database was indistinguishable from a clean first-run read. A malformed `graph-metadata.json` silently dropped all derived key-file watch targets with no operator signal.

Five surgical edits closed all five findings. The watcher now computes additions and removals on each target refresh and calls `unwatch()` for removed paths. The diagnostics array is a 100-entry ring buffer with aggregate counters surfaced as a synthetic `COUNTERS:` line. The reindex-slot queue is capped at 1000 entries and `close()` drains queued waiters before exiting. The projection loader now distinguishes a missing database from a corrupt one and emits a `console.warn` on the corrupt path. The graph-metadata parser accepts an optional callback that records `MALFORMED_GRAPH_METADATA` diagnostics into the ring buffer. All changes preserve the public APIs so sub-phase 006's planned watcher refactor can proceed without merge conflicts.

### Added

- Optional `unwatch?` capability on `SkillGraphFsWatcher` so `refreshTargets()` can release watch handles for removed skill paths (backward-compatible, legacy harnesses without it still function)
- 100-entry FIFO ring buffer via `pushDiagnostic()` helper for all watcher diagnostic push sites, replacing the unbounded `diagnostics: string[]` array
- `COUNTERS:<key>=<count>` synthetic line prepended to `status().diagnostics` to surface aggregate event counts after ring rotation
- `abortPendingReindexQueue()` on the file-watcher that `close()` calls before awaiting in-flight tasks, draining queued Promises with a `QUEUE_CLOSED_REASON` sentinel
- Optional `onMalformed(filePath, reason)` callback on `parseDerivedKeyFiles()` for four distinct shape failures in `graph-metadata.json`
- 11 new vitest cases across three files covering unwatching removed targets, ring buffer cap, queue overflow eviction, queue close drain, projection fallback plus malformed-metadata callback

### Changed

- `refreshTargets()` now computes both additions and removals per refresh cycle. Removed paths have their `fileHashes` entries pruned and pending reindex requests dropped.
- `pendingReindexSlots` queue in the file-watcher is capped at 1000. Oldest entry is evicted with `QUEUE_OVERFLOW_REASON` on overflow. Overflow and close-sentinel rejections log at `console.error` instead of `console.warn`.
- `loadAdvisorProjection()` now distinguishes three cases: SQLite read success returns `source: 'sqlite'`. DB missing returns `source: 'filesystem'` (clean first run). DB read throws returns `source: 'filesystem-fallback'` with `fallbackReason` populated plus a `console.warn` emitted.
- `AdvisorProjection.source` enum extended with `'filesystem-fallback'` and an optional `fallbackReason?: string` field. Existing `'filesystem'` consumers for the clean-first-run path are unaffected.
- One existing `native-scorer.vitest.ts` assertion updated to expect `'filesystem-fallback'` on the corrupt-DB test path instead of `'filesystem'`.

### Fixed

- Watch handles for deleted skills leaked for the daemon's full lifetime. `refreshTargets()` now calls `watcher.unwatch()` for any path absent from the refreshed scan.
- Unbounded `diagnostics: string[]` grew without limit on long-running daemons. A 100-entry ring buffer with aggregate counters prevents memory bleed while preserving observability.
- Pending-slot queue could grow without bound during file-event bursts. The queue cap of 1000 and `close()` drain eliminate the Promise leak on shutdown.
- Corrupt SQLite advisor database was silent. `loadAdvisorProjection()` now warns and surfaces `source: 'filesystem-fallback'` so operators can distinguish degraded fallback from a clean first run.
- Malformed `graph-metadata.json` silently dropped all derived key-file watch targets. The `onMalformed` callback now records a `MALFORMED_GRAPH_METADATA:<path>:<reason>` diagnostic visible in `status().diagnostics`.

### Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` | PASS. tsc clean across all touched files. |
| `npm run build` | PASS. dist artifacts refreshed without errors. |
| Targeted vitests (3 new files, 11 tests) | PASS. 7/7 watcher resource-leak, 2/2 projection fallback, 2/2 file-watcher queue cap. |
| Regression vitest (daemon-freshness-foundation, lifecycle-derived-metadata, file-watcher) | PASS. 57/57. |
| Native-scorer regression after assertion update | PASS. 14/14. |
| skill-projection-stress regression | PASS. 3/3 (clean filesystem path unaffected). |
| `npm run stress` | PASS. 58 files, 194 passed, 1 pre-existing env-dependent failure (gate-d-benchmark-memory-search latency) unrelated to these fixes and reproducible on stashed clean main. |
| `validate.sh --strict` on this packet | Pending. Final step before commit. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/skill_advisor/lib/daemon/watcher.ts` | Modified | F-003-A3-01 unwatch removed targets. F-003-A3-02 ring buffer cap plus counters. F-004-A4-04 malformed-metadata callback. All three findings collapse into this file's lifecycle and diagnostics surface. |
| `mcp_server/lib/ops/file-watcher.ts` | Modified | F-003-A3-03 queue cap of 1000 with oldest-evicted overflow. close() drains queued waiters via abortPendingReindexQueue(). |
| `mcp_server/skill_advisor/lib/scorer/projection.ts` | Modified | F-004-A4-01 fallback path distinguishes null (DB missing) from throw (DB corrupt). Corrupt path emits console.warn and sets source to filesystem-fallback. |
| `mcp_server/skill_advisor/lib/scorer/types.ts` | Modified | F-004-A4-01 enum extended with filesystem-fallback. Optional fallbackReason field added. |
| `mcp_server/skill_advisor/tests/daemon-watcher-resource-leaks-049-005.vitest.ts` (NEW) | Created | 7 tests for F-003-A3-01, F-003-A3-02, F-004-A4-04. |
| `mcp_server/skill_advisor/tests/scorer/projection-fallback-049-005.vitest.ts` (NEW) | Created | 2 tests for F-004-A4-01. Clean filesystem source when DB missing. filesystem-fallback plus console.warn when DB corrupt. |
| `mcp_server/tests/file-watcher-queue-cap-049-005.vitest.ts` (NEW) | Created | 2 tests for F-003-A3-03. close() returns under multiple queued waiters. Queue-closed sentinel logs at error not warn. |
| `mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts` | Modified | One existing assertion updated for the new filesystem-fallback source contract. |

### Follow-Ups

- Run `generate-context.js` to refresh `description.json` and `graph-metadata.json` for this packet after the commit.
- Confirm active reindex tasks are not aborted on close, as this is intentionally deferred per user directive. In-flight tasks are awaited via `Promise.allSettled`.
- Consider routing aggregate counters through the existing `publishSkillGraphGeneration` pipeline when cross-process visibility is needed (currently in-process only).
- Consider replacing the `console.warn` signal for `filesystem-fallback` with a structured diagnostics field on `AdvisorProjection` to avoid log scraping.
