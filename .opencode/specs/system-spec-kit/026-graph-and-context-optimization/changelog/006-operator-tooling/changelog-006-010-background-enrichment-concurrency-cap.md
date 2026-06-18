---
title: "Changelog: Bound the background-enrichment scheduler so a save or startup-scan burst cannot starve the daemon event loop [006-operator-tooling/010-background-enrichment-concurrency-cap]"
description: "Chronological changelog for the Bound the background-enrichment scheduler so a save or startup-scan burst cannot starve the daemon event loop phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/010-background-enrichment-concurrency-cap` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling`

### Summary

The spec-memory daemon's background-enrichment scheduler had a concurrency cap that did not actually cap anything under load. It bumped the in-flight counter inside the deferred callback, so a burst — most acutely a startup scan calling it once per indexed row — read a stale zero on every call, all passed the < 4 gate, and piled up unbounded setImmediate callbacks that then self-drained as a synchronous microtask chain. The event loop never returned to the poll phase, the IPC accept() starved, and the daemon spun at ~100% CPU. This was the trigger behind the incident the 009 supervisor fix recovers from; this packet removes the trigger.

### Added

- `start(task)` helper in `handlers/memory-save.ts` that increments the in-flight counter then defers via `setImmediate`, ensuring the slot is reserved at schedule time rather than inside the callback.
- Periodic `setImmediate` yield every 50 files in the startup-scan loop in `context-server.ts`, so the daemon serves IPC during a large boot indexing run.

### Changed

- Concurrency counter now incremented at schedule time instead of inside the deferred callback, so a burst correctly queues past the cap of 4 rather than reading a stale zero on every call.
- Queue drain re-arms the next queued task via `start` through `setImmediate` instead of a synchronous call, returning control to the poll phase between enrichment runs.
- Defect confirmed by direct source read, gpt-5.5 council diagnosis, and live DB corroboration (2,947 incomplete enrichments across 11,507 indexed paths).

### Fixed

- Broken concurrency cap: a startup scan or save burst no longer schedules unbounded `setImmediate` callbacks that self-drain as a synchronous microtask chain, starving the IPC `accept()` and pinning the daemon at ~100% CPU.
- Slot leak on enrichment run failure: the `finally` block always decrements the counter and re-arms the next queued task, so a thrown run does not permanently consume a concurrency slot.

### Verification

- tsc --noEmit baseline (pre-edit) - PASS — 0 errors
- tsc --noEmit after edit - PASS — 0 errors (clean delta)
- Enrichment + async-scan regression (3 files) - PASS — 14/14
- npm run build (tsc --build + finalize-dist) - PASS — exit 0; cap fix + scan yield confirmed in dist
- Comment hygiene (no spec-path/packet-id in code comments) - PASS — durable WHY only
- Deep-review (10-iter, opus-4.8 + gpt-5.5 xhigh) - CONDITIONAL — the cap fix is correct (REQ-001..005 hold); F-006 hung-run REFUTED (providers timeout-bound the embed); F-008+F-012 shutdown-fence P1 confirmed → follow-up packet; 4 P2 deferred. See review/review-report.md
- Post-review remediation - F2 over-claiming comment tightened (comment-only; dist unaffected)
- Tasks complete - 9 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modified | Reserve the enrichment slot at schedule time; re-arm the queue via setImmediate |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modified | Periodic setImmediate yield in the startup-scan loop |

### Follow-Ups

- Shutdown-durability fences for the enrichment scheduler and startup scan (deep-review P1, F-008/F-012): a deferred run or fire-and-forget scan can reopen the DB after `closeDb()` and re-dirty the WAL. Tracked as a follow-up packet (011).
- Queue retention bound (deep-review P2, F-007): the fix caps concurrency but not queue size, so a large scan retains `parsed` payloads for the throttled drain. Deferred: store only `memoryId` and re-derive at run time, or bound the queue.
- Idle-monitor enrichment blind spot (deep-review P2, F-005): a short idle timeout could shut the daemon mid-drain. Deferred as cross-cutting.
