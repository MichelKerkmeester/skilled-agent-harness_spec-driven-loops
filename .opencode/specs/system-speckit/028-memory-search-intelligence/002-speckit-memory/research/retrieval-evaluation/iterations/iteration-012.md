# Iteration 12 (synthesis): GO/no-go doctrine-classed tiering

> Model: **Opus 4.8 via claude2** (acct#2, read-only). Orchestrator-written. newInfoRatio **0.4** (synthesis, no new discovery). **VERDICT: GO — the campaign converged on one buildable spine; STOP research, open the build.** (Seat flagged its own sourcing: spine tiers CONFIRMED from the deltas it read; A1/A4/A6/A2/A3/A5 framings inferred from headlines under its 6-file cap.)

## Tiers (every live candidate; verify corrections applied)

**WAVE-0 — correctness, always-on, ship-now (independent of the harness):**
- `A7-4-marker-ttl-to-lease-window` (M/S) — replace hardcoded `MAINTENANCE_MARKER_TTL_MS=180000` with `ownerLease.ttlMs × K (K>2)`; kills a real false-reap-of-a-live-daemon hazard.
- `A7-5-phase-yield-invariant` (M/S) — codify "every sync phase > TTL/2 must call `maintenance.refresh()`."
- A4-015-residual (`resolveSearchScore` still reads RRF scale — residual of the shipped 015 fix; results-affecting correctness).
- A4-divergence-magnitude-telemetry (observe-only; "free telemetry win").
- A3-S5-evalMode-harness-fix (the harness skips the reorder under `evaluationMode`; measurement-correctness; **prerequisite for WAVE-2 A3**).
- A6-bottom-dedup (3× cosine dup) — ship only if verified byte-identical; else demote to WAVE-2.

**WAVE-1 — the eval-harness spine (build FIRST; gates everything). Forced order C9-4→C9-1→C9-2→C9-3 + the A8 gate:**
- `C9-4-assertEmbeddingCoverage` (H/S) — the reindex-is-gate-zero precondition made executable; drop-in at `ablation-framework.ts:580-586`.
- `C9-1-shared-single-pass-emit` (H/M) — the root unblock (`runAblation` captures only `EvalResult[]`; add per-query verdict/confidence/tier capture; mechanism exists).
- `C9-2-enrichGroundTruth-tagging` (H/S) — **a DATA backfill, not new plumbing** (`GroundTruthEntry` already types `tier?/createdAt?`); one DB-join → 3 label views.
- `C9-3-three-corpus-metrics` (H/M) — **the campaign's actual deliverable**: gate-verdict confusion + ECE/Brier/reliability + cold-appearance/precision, at `buildAggregatedMetrics`.
- `A8-1-class-parameterized-promotion-gate` (H/M) — unweld the one gate from the one class (keep spine, swap per-class panel).
- `A8-2-class-G-ECE-panel` (H/M) — the CLASS-G panel consuming C9-3's ECE; the missing precondition keeping isotonic frozen.
- `A8-5-golden-set-label-source-swap` (M/M) — route held-out labels through the golden set, not `adaptive_signal_events` (empty-on-cancel = the phantom-proxy bug).
- `A8-4-promote-on-evidence-flag-lifecycle` (M/S) — `isOptInEnabled`→gate→`isFeatureEnabled`→rollback; the one loop unifying the 3 bespoke shadow mechanisms.

**WAVE-2 — intelligence-class, shadow-gated default-off, promote on live evidence (needs the gate + reindex):**
- A2-isotonic-calibration (M-H/M) — graduate the frozen flag on real ECE from C9-3/A8-2. **The doctrine's flagship exemplar.**
- A3-AB-shipped-levers (needs the WAVE-0 S5-evalMode fix + the harness).
- A5-cold-tier-remeasure (needs C9-4 reindex + C9-3 cold metric).
- A6-unified-substrate-top (trigger-union / fused-summary recall channels; gated by the rescoped A8-3 coverage panel).
- `A7-1-reorg-pass-inside-reindex` (H/M, LLM-free CONFIRMED) — cosine-reconsolidation as a 4th `runIndexScan` phase; **MUTATES** ⇒ strictly shadow-gated.
- `A7-2-split-initiative-b-by-doctrine` (H/S) — the governing frame: host only the LLM-free merge/supersede; keep LT-llm-transcript-chunking + bg-sleeptime-agent a separate governed packet.

**DROP / RESCOPED (verify-corrected):**
- `A8-3-new-channel-blindness-recall-panel` — **RESCOPED** (iter-10 refuted the "structurally blind" headline; `ndcgDelta` *is* sensitive to judged additions). Survives as a low-priority qrels-coverage instrument; the campaign's most-overstated claim.
- `C2-s5-demotes-fused-nonvector-hits` — **BOUNDED**, do not build a dedicated fix (head-only, rank-not-eviction, rare); fold into A3's A/B as a small-effect lever.
- `A7-3-content-hash-12-partial-transfer` — informational (reconciliation #12 is half-covered), not a build candidate.

## Top-7 ranked
1. `C9-4-assertEmbeddingCoverage` | gate-zero precondition | H/S | `ablation-framework.ts:580-586` | correctness-precondition
2. `C9-1-shared-single-pass-emit` | the root unblock; all 3 lanes read this snapshot | H/M | baseline-pass capture | harness-infra
3. `C9-3-three-corpus-metrics` | the NET-NEW the campaign exists to build | H/M | `buildAggregatedMetrics` | harness-infra
4. `A8-1-class-parameterized-promotion-gate` | turns metrics into promotion decisions | H/M | swap per-class panel onto shadow-scoring spine | doctrine-machinery
5. `C9-2-enrichGroundTruth-tagging` | cheap DATA backfill; unlocks A1/A2/A5 labels at once | H/S | DB-join | data-backfill
6. `A2-isotonic-calibration` | flagship intelligence payoff; proves the doctrine end-to-end | M-H/M | A8-2 + C9-3 ECE | intelligence, shadow-gated
7. `A7-4-marker-ttl-to-lease-window` | best pure-correctness item | M/S | `ownerLease.ttlMs×K` | correctness, always-on

## Build order (forced dependency chain)
GATE-ZERO (operational): reindex golden-set memoryIds → WAVE-1 spine (strictly linear): `C9-4 → C9-1 → C9-2 → C9-3 → A8-1 (+A8-2/A8-5/A8-4)` → WAVE-2 consumers (parallel, each shadow→promote on the gate): A2 / A3 / A5 / A6-channels / A7-1(under A7-2). WAVE-0 correctness ships in parallel, no dependency on the chain. **Critical path = the 5-step C9→A8 chain.**

## Saturation read — STOP research, open the build
Independent verdict: **11 iters are enough.** Evidence: (1) newInfoRatio declined 0.7→0.6→0.5; (2) wave-3 *converged* — A8 + C9 collapsed into one buildable pair, not new angles; (3) the adversarial pass was net-deflationary (1 refute, 1 refine, 2 confirm — pruned overstatement, surfaced no new candidate mass); (4) the spine is specified to file:line with a forced build order. Signature of a mined-out keystone. This agrees with the orchestrator's own read.

## Next focus
Write `synthesis/08-retrieval-evaluation-findings.md` (before→after) + roadmap; the campaign's research phase is complete at 12. Implementation is a separate packet (the C9→A8 spine is its plan).
