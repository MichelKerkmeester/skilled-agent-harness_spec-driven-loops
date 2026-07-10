---
title: "Implementation Plan: cooperative heavy phases keep the daemon responsive"
description: "Instrument the reindex scan with an event-loop lag sampler and per-phase wall-clock so a true block is distinguishable from slow-but-cooperative work; chunk the one unbounded synchronous transaction (trigger-embedding-backfill) so it yields between chunk transactions and is cancellable; and refresh the maintenance marker on entry to each un-yielded tail phase. The launcher adopt/reap path is unchanged after being confirmed correct."
trigger_phrases:
  - "cooperative heavy phases plan"
  - "event loop lag sampler trigger backfill chunk plan"
  - "027 002/021 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/002-memory-store-and-search/020-cooperative-heavy-phases"
    last_updated_at: "2026-06-17T18:35:00Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Live clone reindex: max event-loop lag 634ms, no block — gap closed"
    next_safe_action: "None — 021 complete; daemon stays responsive through the scan"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-027-002-021-cooperative-heavy-phases"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: cooperative heavy phases keep the daemon responsive

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

020 left the daemon un-reaped but not responsive: a blocked event loop cannot answer a launcher probe or fire the marker's 20s refresh, so a block exceeding the 180s TTL lets the marker go stale and a second daemon spawns. The ~79s blocking phase was never pinned, and static analysis shows no enumerated synchronous phase should block that long with the trigger-backfill flag off — so the blocker must be measured live. This plan is investigation-first: instrument the scan (event-loop lag sampler plus per-phase wall-clock) so the deploy-time read pins a true block apart from slow-but-cooperative work; fix the one genuinely unbounded synchronous transaction (trigger-embedding-backfill's whole-corpus phrase sync) regardless of its gate by chunking it and yielding between chunks; and refresh the marker on entry to each un-yielded tail phase so a bounded block never outlives the TTL. The launcher adopt/reap path was read end-to-end and is correct (a fresh marker already causes adoption), so it is unchanged.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- `tsc --noEmit` exits 0.
- The trigger-backfill cancel/yield unit tests plus the existing scan-job and daemon-reelection adoption-harness suites pass.
- No yield is ever placed inside a `database.transaction()`; the chunk loop yields strictly between self-contained chunk transactions.
- The synchronous foreground scan path is byte-identical (instrumentation gated on `ctx.onPhase`).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Three cooperating changes, all in the daemon. (1) In `handlers/memory-index.ts`, a lag sampler started inside the scan's `try` and torn down in its `finally` records `setInterval` drift: a late sample means the loop was blocked since the prior tick, so it logs `event-loop blocked ~<ms>` and a final `max-event-loop-lag ms=<ms>`. A `timedPhase(label, fn)` wrapper logs `phase=<label> ms=<elapsed>` for each un-yielded tail phase and fires `ctx.onPhase(label)`, which the background runner already maps to `maintenance.refresh()` — so each tail phase enters with a fresh 180s TTL. Both are gated on `ctx.onPhase` being present (background path only), so the synchronous foreground path is unchanged. (2) In `lib/search/trigger-embedding-backfill.ts`, the whole-corpus `syncPhraseRows` transaction becomes `syncPhraseChunk`, called over ~200-row slices with `await setImmediate` between chunk transactions and an `isCancelled` check at each boundary; the embedding loop adds a cancel check and a periodic yield for its non-awaiting cache-hit path. (3) Both scan call sites thread `isCancelled: () => ctx.isCancelled?.() ?? false`. Why the blocker is not yet fixed in code: the main batch loop and the LIMIT-5 tail phases already yield (embeddings are out-of-process HTTP, so each `await generateDocumentEmbedding` releases the loop), and the orphan sweep is bounded to 200 rows — so no enumerated phase accounts for a 79s block with the flag off; the lag sampler exists to pin the real one at deploy.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

- `handlers/memory-index.ts`: the event-loop lag sampler (start in `try`, clear in `finally`), the `timedPhase` wrapper around orphan-sweep / enrichment-repair / trigger-backfill / near-dup-repair, and `isCancelled` threaded into both trigger-backfill calls.
- `lib/search/trigger-embedding-backfill.ts`: `syncPhraseChunk` per-chunk transactions with between-chunk yields, an `isCancelled?` option, a cache-hit-path yield, and a `cancelled` result status.
- `tests/trigger-embedding-backfill.vitest.ts`: cancel-immediate, cancel-at-chunk-boundary (asserts a clean 200-row partial), and cooperative-yield (a competing macrotask advances during the run) cases.
- `.opencode/bin/mk-spec-memory-launcher.cjs` / `model-server-supervision.cjs`: read-only investigation only; confirmed `respawnAfterDeadSocket` checks the marker before respawning, so no change.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Add the event-loop lag sampler and `timedPhase` wrapper in `memory-index.ts`, gated on `ctx.onPhase`; wrap the four un-yielded tail phases.
2. Chunk `syncPhraseRows` into `syncPhraseChunk` per-chunk transactions with between-chunk yields; add the `isCancelled?` option and the `cancelled` status; add the cache-hit-path yield in the embedding loop.
3. Thread `isCancelled` into both trigger-backfill call sites in `memory-index.ts`.
4. Add the cancel/yield unit tests; run typecheck, the scan-job suite, and the daemon-reelection adoption harness.
5. Investigate the launcher adopt/reap path (read-only) to confirm whether the root cause is launcher-side; record the finding.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The unit tests exercise the trigger-backfill changes directly: an immediate cancel writes zero rows and never calls the embedder; a cancel on the second chunk boundary leaves exactly 200 rows (proving self-contained chunks, since whole-corpus atomicity would leave 0 or 300); and a competing `setImmediate` macrotask loop advances during a 500-row run (proving the loop yields). The existing scan-job suite confirms the instrumentation and `onPhase` wiring still pass, and the daemon-reelection adoption harness confirms the marker-based adoption is unregressed. A pre-existing cross-file flake in `retry-manager.vitest.ts` T49, and pre-existing failures in `handler-memory-index-cooldown` / `handler-memory-index-needs-rebuild` / `trigger-threshold-tuning` (all reproduced on the clean baseline with these changes stashed), are noted, not introduced. The live single-launcher lag read is the deploy-time confirmation.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

No new packages. Builds on the 019/020 maintenance marker and its `onPhase`-driven `refresh()` (reused unchanged), the 018 cooperative-yield idiom and in-process cancel flag (reused as the chunking pattern), and the existing scan tail and `runTriggerEmbeddingBackfill` call sites in `handlers/memory-index.ts`. Uses Node's `setImmediate` and `setInterval`. The trigger-embedding-backfill remains gated by `SPECKIT_TRIGGER_EMBEDDING_BACKFILL` (default off); the chunking is a latent-bug fix that takes effect whenever the flag is enabled.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The change is additive: instrumentation logs, a chunked loop in place of one transaction, and an extra marker refresh per phase. To revert, restore the two source files (remove the lag sampler and `timedPhase` in `memory-index.ts` and unthread `isCancelled`; restore the single whole-corpus `syncPhraseRows` call in `trigger-embedding-backfill.ts`) plus the new test cases, and rebuild. No schema or data migration; the marker file format is unchanged, so the launcher reads it as before.
<!-- /ANCHOR:rollback -->
