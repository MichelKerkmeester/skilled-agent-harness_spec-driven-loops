# Deep-Review Iteration 2 (new adversarial angles)

- **Worker**: cli-claude-code · claude-opus-4-8 · account2 · `review` agent · high effort
- **Lens**: queue memory/retention, daemon-recycle/reap, ordering/fairness, magic-number-50

## Verdict: No new P0 / No new P1. 3 new P2 (hardening, non-blocking).

### New P2 findings
- **F1 · Queue retains full `parsed` payloads for the serialized drain** (`memory-save.ts:2921`, payload at `:2946-2972`, enqueue `:2976`) — NEW. A cold-start scan over ~11k new files queues ~N−4 `run` closures, each pinning a full parsed memory file (`content` + `normalizedContent`) → ~55-220MB held for the multi-minute 4-wide drain. **Honest delta:** not a peak regression (pre-fix ran ~N concurrent enrichments at higher peak), but a retention-**duration** regression the throttling introduces. Confidence: HIGH exists / MED operational harm (not measured). Fix: store only `memoryId` in the queue and re-derive `parsed` at run time, or bound queue length and lean on the pending-marker backfill.
- **F2 · `db` handle held across the enrichment `await`** (`memory-save.ts:2949-2962`) — NEW observation, PRE-EXISTING property. The run re-resolves `db` at start, but reuses it for `recordEnrichmentResult` after the `await`; a mid-`await` recycle leaves a stale handle → write throws → caught → row stays pending → backfill recovers (fail-safe). The `:2925` doc comment over-claims ("re-resolves at run time") — it only covers a recycle in the schedule→start gap, not mid-run. Fix: tighten the comment (cheap) and/or re-resolve `db` after the await.
- **F3 · Idle-monitor ignores enrichment depth** (`lib/ipc/launcher-idle-timeout.ts:98-123`) — NEW, conditional. With a short `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN`, a post-scan daemon with no further IPC can idle-shutdown mid-drain; late rows enrich via backfill, not the live queue. No data loss. Fix: treat a non-empty queue / `active>0` as activity, or document the live tail as best-effort.

### Probed angles SOUND (evidence)
- FIFO fairness / per-row starvation: SOUND (strict push/shift FIFO; only non-completion is process exit, backfill-covered).
- Scan-yield × enrichment ordering: SOUND (separate setImmediates, save-order FIFO, no reorder hazard).
- Magic-number 50: DEFENSIBLE (sum increments by exactly 1/iteration; deterministic yield at 50/100/…; `<50 → never yields` benign; minor nit: a time-budgeted yield would be more robust under pathological huge-file workloads — not warranted now).
- Recycle/reap recovery + slot accounting across soft recycle: SOUND (finally always decrements+re-arms; SIGKILL mid-drain → backfill).

## Convergence tracker
- New P0: 0 · New P1: 0 · New P2: 3 (1 fix-introduced retention-duration, 2 pre-existing/conditional)
- Consecutive iterations with no new P0/P1: **2** (early-stop target: 3)
