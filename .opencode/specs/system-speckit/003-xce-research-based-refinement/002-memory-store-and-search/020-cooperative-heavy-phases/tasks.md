---
title: "Tasks: cooperative heavy phases keep the daemon responsive"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cooperative heavy phases tasks"
  - "027 002/021 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/002-memory-store-and-search/020-cooperative-heavy-phases"
    last_updated_at: "2026-06-17T18:35:00Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Live clone reindex: max event-loop lag 634ms, no block — gap closed"
    next_safe_action: "None — 021 complete; daemon stays responsive through the scan"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "tasks-027-002-021-cooperative-heavy-phases"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: cooperative heavy phases keep the daemon responsive

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`T### [P?] Description (file path)` — `[P]` marks tasks that can run in parallel. All implementation tasks below are sequential because they touch overlapping modules; the launcher investigation (T009) is read-only and independent.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- T001 Confirm the gap from 020: the marker keeps the daemon un-reaped but not responsive — a blocked event loop cannot answer a launcher probe or fire the 20s self-refresh, so a block exceeding the 180s TTL lets the marker go stale and a second daemon spawns. Confirm the ~79s phase was never pinned (`handlers/memory-index.ts`, `lib/storage/maintenance-marker.ts`).
- T002 Establish that no enumerated synchronous phase blocks 79s with the trigger-backfill flag off: the main batch loop and LIMIT-5 tail phases already yield (out-of-process embeddings) and the orphan sweep is bounded to 200 rows (`handlers/memory-index.ts`, `utils/batch-processor.ts`, `core/config.ts`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- T003 Add the event-loop lag sampler (start in the scan's `try`, clear in `finally`, log per-sample block warnings and a final `max-event-loop-lag`), gated on `ctx.onPhase` so the synchronous path is unchanged (`handlers/memory-index.ts`).
- T004 Add the `timedPhase(label, fn)` wrapper that logs per-phase wall-clock and fires `ctx.onPhase` (which refreshes the marker); wrap the orphan-sweep, enrichment-repair, trigger-backfill, and near-dup-repair tail phases (`handlers/memory-index.ts`).
- T005 Chunk the trigger-backfill whole-corpus transaction: rename `syncPhraseRows` to `syncPhraseChunk`, call it over ~200-row slices, `await setImmediate` between chunk transactions (never inside one), and check `isCancelled` at each boundary; add the `cancelled` status and an `isCancelled?` option (`lib/search/trigger-embedding-backfill.ts`).
- T006 Add a cancel check and a periodic yield to the embedding loop's cache-hit fast path so a long run of cache hits cannot starve the loop (`lib/search/trigger-embedding-backfill.ts`).
- T007 Thread `isCancelled: () => ctx.isCancelled?.() ?? false` into both trigger-backfill call sites (`handlers/memory-index.ts`).
- T008 Add the unit cases: cancel-immediate (zero rows, embedder never called), cancel-at-chunk-boundary (exactly 200 rows synced), and cooperative-yield (a competing macrotask advances during a 500-row run) (`tests/trigger-embedding-backfill.vitest.ts`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- T009 Read-only launcher investigation: confirm `respawnAfterDeadSocket` and the stale-reclaim path call `shouldAdoptDespiteProbe`, so a fresh marker causes adoption rather than a second daemon; record that no launcher change is warranted (`.opencode/bin/mk-spec-memory-launcher.cjs`, `model-server-supervision.cjs`).
- T010 `tsc --noEmit` exits 0; the trigger-backfill cancel/yield unit tests plus the scan-job and daemon-reelection adoption-harness suites pass.
- T011 Note pre-existing failures verified orthogonal (reproduce on the clean baseline with these changes stashed): `retry-manager.vitest.ts` T49, `handler-memory-index-cooldown`, `handler-memory-index-needs-rebuild`, `trigger-threshold-tuning`.
- T012 Deploy-time check: in a clean single-launcher session, run a full force reindex, read the `phase=` and `event-loop blocked`/`max-event-loop-lag` logs, apply the 018 chunk-and-yield to any phase whose block exceeds the launcher probe timeout, and confirm the daemon pid is unchanged throughout and `vec == fts`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The scan emits per-phase wall-clock and an event-loop lag sample on the background path; the trigger-backfill whole-corpus transaction is chunked, yields between chunks, and is cancellable; each un-yielded tail phase refreshes the marker on entry; typecheck is clean; and the cancel/yield unit tests plus the scan-job and adoption-harness suites pass. The launcher adopt/reap path was confirmed correct and is unchanged. The live single-launcher lag read — pinning any residual block and confirming `vec == fts` with the daemon pid unchanged — is the deploy-time confirmation.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `./spec.md`
- Plan: `./plan.md`
- Summary: `./implementation-summary.md`
- Predecessor: `../020-maintenance-grace-background-embedding/`
<!-- /ANCHOR:cross-refs -->
