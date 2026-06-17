---
title: "Cooperative Heavy Phases: Instrument Event-Loop Lag and Stop the Trigger-Backfill From Blocking"
description: "020 kept a busy daemon un-reaped but not responsive: a blocked event loop can neither answer a competing launcher's probe nor fire the marker's 20s self-refresh, so a block past the 180s TTL lets the marker go stale and a second daemon spawns. The ~79s blocking phase was never pinned. This packet instruments the scan with an event-loop lag sampler plus per-phase wall-clock to tell a true block apart from slow-but-cooperative work, chunks the one unbounded synchronous transaction (trigger-embedding-backfill) so it yields between chunks and is cancellable, and refreshes the marker on entry to each un-yielded tail phase. The launcher adopt/reap path was confirmed correct and left unchanged."
trigger_phrases:
  - "002/021 cooperative heavy phases changelog"
  - "event loop lag sampler reindex scan"
  - "trigger embedding backfill chunk and yield"
  - "027 002/021 shipped"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-17

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/021-cooperative-heavy-phases` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

020 made a reindex's scan and its post-scan embedding queue un-reaped through a shared maintenance marker, but un-reaped is not responsive: a daemon whose event loop is blocked can neither answer a competing launcher's bridge/probe nor fire the marker's 20s self-refresh, so a synchronous phase that blocks longer than the 180s TTL lets the marker go stale and a fresh launcher spawns a second daemon. 020 observed a longest blocking tail phase of ~79s but never pinned which phase it was. This packet is investigation-first. The reindex scan now runs an event-loop lag sampler (a 250ms `setInterval` whose drift reveals how long the loop was blocked since the prior tick; it logs `event-loop blocked ~<ms>` per spike and `max-event-loop-lag ms=<ms>` at scan end) and a `timedPhase` wrapper that logs `phase=<name> ms=<elapsed>` for each un-yielded tail phase. Both are gated on the background-scan `onPhase` hook, so the synchronous foreground path is byte-identical. Together they distinguish a true event-loop block (lag spike equals the block) from work that is merely slow but cooperative (high phase wall-clock, low lag) — the measurement that pins the real blocker on the live daemon. Separately, the one genuinely unbounded synchronous transaction — `trigger-embedding-backfill`'s whole-corpus phrase sync — is split into ~200-row chunk transactions that `await setImmediate` between chunks (never inside a transaction, which better-sqlite3's synchronous transactions forbid), with an `isCancelled` signal threaded from both scan call sites and a yield added to the embedding loop's non-awaiting cache-hit path; this is a latent-bug fix that takes effect whenever `SPECKIT_TRIGGER_EMBEDDING_BACKFILL` is enabled. Finally, entering each un-yielded tail phase via `timedPhase` fires `onPhase`, which refreshes the marker, so each tail phase begins with a full TTL ahead of it. The launcher adopt/reap path was read end to end and confirmed correct — `respawnAfterDeadSocket` checks the marker before respawning, so a fresh marker already causes adoption rather than a second daemon — and is left unchanged.

### Added

- An event-loop lag sampler in `handlers/memory-index.ts` (gated on the background-scan `onPhase` hook): logs `[memory-index-scan] event-loop blocked ~<ms> between samples` on a late tick and `[memory-index-scan] max-event-loop-lag ms=<ms>` at scan end
- A `timedPhase(label, fn)` wrapper in `handlers/memory-index.ts` that logs `[memory-index-scan] phase=<label> ms=<elapsed>` for each un-yielded tail phase and refreshes the maintenance marker on entry
- Three unit cases in `tests/trigger-embedding-backfill.vitest.ts`: cancel-immediate (zero rows, embedder never called), cancel-at-chunk-boundary (exactly 200 rows synced), and cooperative-yield (a competing macrotask advances during the run)

### Changed

- `lib/search/trigger-embedding-backfill.ts` - the whole-corpus `syncPhraseRows` transaction becomes `syncPhraseChunk`, called over ~200-row slices that `await setImmediate` between chunk transactions; adds an `isCancelled?` option, a cache-hit-path yield, and a `cancelled` result status
- `handlers/memory-index.ts` - the four un-yielded tail phases (orphan-sweep, enrichment-repair, trigger-backfill, near-dup-repair) run through `timedPhase`, and `isCancelled` is threaded into both `runTriggerEmbeddingBackfill` call sites

### Fixed

- The trigger-embedding-backfill no longer holds the event loop for the whole corpus in a single synchronous transaction; it yields between chunk transactions and exits promptly on cancel, so when enabled it can no longer block the daemon
- Each un-yielded tail phase now enters with a freshly refreshed marker, so a bounded block in any one of them cannot outlive the 180s TTL and trigger a spurious reap

### Verification

| Check | Result |
|-------|--------|
| Typecheck | PASS: `npm run typecheck` (`tsc --noEmit`) exit 0 |
| Trigger-backfill unit (incl. 3 new cancel/yield cases) | PASS: `tests/trigger-embedding-backfill.vitest.ts`, 6 tests |
| Scan-job suite | PASS: `tests/handler-memory-index-scan-jobs.vitest.ts` |
| Re-election adoption harness | PASS: `stress_test/durability/daemon-reelection-adoption-live.vitest.ts`, 6 tests |
| Strict spec validation | PASS: `validate.sh --strict` on the packet, 0 errors 0 warnings |
| Pre-existing failures (not introduced) | NOTED: `retry-manager.vitest` T49, `handler-memory-index-cooldown`, `handler-memory-index-needs-rebuild`, `trigger-threshold-tuning` — all reproduce on the clean baseline with these changes stashed |
| Live single-launcher reindex lag read | PENDING (deploy verification): read `phase=`/`event-loop blocked`/`max-event-loop-lag` in a clean session; daemon pid unchanged and vec == fts |

### Files Changed

| File | Action |
|------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/trigger-embedding-backfill.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/tests/trigger-embedding-backfill.vitest.ts` | Modified |

### Follow-Ups

- The blocking phase is not yet pinned in code. With the trigger-backfill flag off, static analysis shows no enumerated synchronous phase can block 79s (the main loop and LIMIT-5 tail phases already yield because embeddings are out-of-process; the orphan sweep is bounded to 200 rows), so the real blocker — if any remains — must be read from the lag instrumentation on a clean single-launcher live reindex. Apply the 018 chunk-and-yield to whatever phase the lag read fingers.
- Live validation needs a clean single-launcher session: the editor's MCP and repeated cold-spawns churn the daemon independently of the guard, so the in-session live read is unreliable. Success is the daemon pid unchanged across the full reindex plus its post-scan embedding burst, with vec == fts.
