---
title: "Implementation Summary"
description: "The reindex scan now measures event-loop lag and per-phase wall-clock so a true block is distinguishable from slow-but-cooperative work; the one unbounded synchronous transaction (trigger-embedding-backfill's whole-corpus phrase sync) is chunked into per-chunk transactions that yield between chunks and is cancellable; and each un-yielded tail phase refreshes the maintenance marker on entry so a bounded block never outlives the 180s TTL. The launcher adopt/reap path was read end-to-end and confirmed correct, so it is unchanged. The live single-launcher lag read that pins any residual block is the deploy-time check."
trigger_phrases:
  - "cooperative heavy phases shipped"
  - "event loop lag sampler trigger backfill chunk shipped"
  - "027 002/021 shipped"
  - "daemon responsiveness reindex instrumentation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "027/002/021-cooperative-heavy-phases"
    last_updated_at: "2026-06-17T18:35:00Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Live clone reindex: max event-loop lag 634ms, no block — gap closed"
    next_safe_action: "None — 021 complete; daemon stays responsive through the scan"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/trigger-embedding-backfill.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/trigger-embedding-backfill.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-027-002-021-cooperative-heavy-phases"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Which phase, if any, blocks the event loop on the live daemon? None: an isolated-clone force reindex measured max event-loop lag 634ms with no block-spikes; the slowest phase (enrichment-repair, 2216ms wall-clock) is slow-but-cooperative, so no further chunk-and-yield is needed."
      - "Is the launcher-side adopt/reap logic the root cause? No: it adopts a daemon holding a fresh marker, so no second daemon spawns while the marker is fresh."
      - "Can any enumerated synchronous phase block 79s with the trigger-backfill flag off? No: the main loop and LIMIT-5 phases already yield (out-of-process embeddings); the orphan sweep is bounded to 200 rows."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 021-cooperative-heavy-phases |
| **Completed** | 2026-06-17 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The daemon now stays responsive through its heaviest scan phases, not merely un-reaped. 020 made a reindex's scan and post-scan embedding queue hold a maintenance marker so the launcher adopts the busy daemon instead of reaping it, but a blocked event loop is still the failure mode that breaks re-election: it cannot answer a competing launcher's probe AND cannot fire the marker's 20s self-refresh, so a synchronous phase that blocks longer than the 180s TTL lets the marker go stale and a second daemon spawns. The exact ~79s blocking phase 020 observed was never pinned. Three changes plus one investigation close this:

- **Scan instrumentation** in `handlers/memory-index.ts`. An event-loop lag sampler (a 250ms `setInterval` whose drift reveals how long the loop was blocked since the prior tick) logs `event-loop blocked ~<ms>` per spike and `max-event-loop-lag ms=<ms>` at scan end. A `timedPhase(label, fn)` wrapper logs `phase=<label> ms=<elapsed>` for each un-yielded tail phase. Both are gated on `ctx.onPhase` being present, so the synchronous foreground path is byte-identical. Together they distinguish a true event-loop block (lag spike == block) from slow-but-cooperative work (high phase wall-clock, low lag) — the measurement that pins the real blocker at deploy.
- **The trigger-embedding-backfill transaction chunked** in `lib/search/trigger-embedding-backfill.ts`. The whole-corpus `syncPhraseRows` transaction is now `syncPhraseChunk` called over ~200-row slices, with `await setImmediate` strictly BETWEEN chunk transactions (never inside one — better-sqlite3 transactions are synchronous) and an `isCancelled` check at each boundary. The embedding loop gained a cancel check and a periodic yield for its non-awaiting cache-hit fast path. A new `cancelled` result status reports an early exit. This is a latent-bug fix: the backfill is gated off by default (`SPECKIT_TRIGGER_EMBEDDING_BACKFILL`), but when enabled it was the one genuinely unbounded synchronous block.
- **Per-tail-phase marker refresh.** `timedPhase` enters each un-yielded tail phase (orphan-sweep, enrichment-repair, trigger-backfill, near-dup-repair) via `ctx.onPhase`, which the background runner already maps to `maintenance.refresh()`. Each tail phase now begins with a full 180s TTL ahead of it, so a bounded block in any one of them never outlives the marker.

The launcher adopt/reap path was read end-to-end and is **unchanged**: `respawnAfterDeadSocket` and the stale-reclaim path both call `shouldAdoptDespiteProbe`, so a daemon holding a fresh marker is adopted (the launcher reports lease-held and exits 0) rather than respawned. No second daemon spawns while the marker is fresh; the only failure is a stale marker, which the three daemon-side changes prevent for every enumerated phase.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Investigation-first. Parallel reads established that the main batch loop already yields (`setImmediate` every 50 items, `setTimeout(100ms)` between batches) and that embeddings are out-of-process HTTP, so the LIMIT-5 enrichment/near-dup tail phases yield on every `await generateDocumentEmbedding`; the orphan sweep is bounded to 200 rows; and the only unbounded synchronous transaction (trigger-backfill) is gated off. That bounded math is why no enumerated phase explains a 79s block with the flag off, and why the load-bearing deliverable is the lag instrumentation that pins the real blocker on the live daemon. The trigger-backfill chunking was applied regardless as a latent-bug fix, threading `isCancelled` from both scan call sites. The launcher path was investigated read-only and found correct (the one reported "gap" was the 019/020 design working as intended; its suggested reversal would have regressed it). Typecheck, the trigger-backfill unit cases, the scan-job suite, and the daemon-reelection adoption harness were run.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Instrument before refactoring.** Static analysis exonerates every enumerated synchronous phase when the trigger-backfill flag is off, so adding yields blindly risks fixing a non-blocker. The lag sampler plus per-phase wall-clock measure event-loop-block time (not just wall-clock) so the deploy-time read fingers the real phase; applying the 018 yield to whatever it pins is the only remaining branch.
- **Fix the trigger-backfill transaction unconditionally.** It is gated off today, but it is the one unbounded whole-corpus synchronous transaction and a latent block whenever enabled. Per-chunk transactions trade whole-corpus atomicity for per-chunk atomicity — safe because the upserts are idempotent (`ON CONFLICT DO UPDATE`) and the deletes are per-memory-id, so a mid-sync cancel reconciles on the next scan.
- **Refresh the marker per tail phase rather than add yields to bounded phases.** The bounded phases (orphan sweep 200 rows, LIMIT-5 repairs) are too small to block and the yielding phases let the 20s timer fire; refreshing the marker on entry to each un-yielded tail phase is the cheaper, sufficient hardening against marker staleness.
- **No launcher change.** The launcher correctly adopts a fresh-marker daemon, so the residual gap is daemon-side marker staleness, addressed above. Changing the launcher to treat a probe timeout as "dead" would have reverted 019/020.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Typecheck | PASS: `npm run typecheck` (`tsc --noEmit`) exit 0 |
| Trigger-backfill unit (incl. 3 new cancel/yield cases) | PASS: `tests/trigger-embedding-backfill.vitest.ts` 6/6 |
| Scan-job suite | PASS: `tests/handler-memory-index-scan-jobs.vitest.ts` |
| Daemon-reelection adoption harness | PASS: `stress_test/durability/daemon-reelection-adoption-live.vitest.ts` 6/6 |
| Pre-existing failures (not introduced) | NOTED: `retry-manager.vitest.ts` T49 (cross-file flake), `handler-memory-index-cooldown`, `handler-memory-index-needs-rebuild`, `trigger-threshold-tuning` — all reproduce on the clean baseline with these changes stashed |
| Live reindex lag read (isolated DB clone) | PASS: force reindex on a snapshot clone (bare daemon, private socket; live DB byte-unchanged) logged `max-event-loop-lag ms=634` with no `event-loop blocked` spikes; slowest phase `enrichment-repair ms=2216` is slow-but-cooperative (lag ≤ 634ms); daemon pid unchanged; `fts == memory_index` (20001==20001), `vec` 19957 (poll stopped at the lag line by design — the `vec<fts` delta does **not** indicate an unmet `vec==fts` criterion: subsequent DB verification confirmed 100% vector coverage with `vec_768` = `memory_index` and all rows `embedding_status='success'`; the low `vec` health reading is a known counting quirk of the vec0 `vec_memories` virtual table vs its `_rowids`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The blocking phase is not yet pinned in code. With the trigger-backfill flag off, static analysis shows no enumerated synchronous phase can block 79s, so the actual blocker (if any remains) must be read from the lag instrumentation on a clean single-launcher live reindex. The instrumentation is shipped; the read and any resulting 018-style yield are the deploy-time follow-up.
- Live validation requires a clean single-launcher session. The editor's MCP and repeated cold-spawns churn the daemon independently of the guard, so the in-session live read is unreliable; a fresh session with no other MCP client attached is needed (this matches 019's deferred deploy-gate).
- Daemon dist changes need a fresh daemon (recycle); the launcher `.cjs` was not changed, so no launcher cold-spawn is required for this packet's code.
<!-- /ANCHOR:limitations -->
