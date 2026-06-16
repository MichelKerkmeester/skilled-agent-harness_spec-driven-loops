# Iteration 18: Round I Implementation Sketch — DL-newInfoRatio-audit (NEW gap; confirmed broader)

## Focus
Round I: feasibility + sketch a guard for the NEW gap (G4) — the self-graded newInfoRatio STOP gate is unaudited. Read-only.

## Build sketch (newInfoRatio 0.72) — **NEEDS-BENCHMARK; gap CONFIRMED broader**
- **GAP (broader than framed):** `convergence.cjs` NEVER even ingests `newInfoRatio` — it loads ONLY graph DB nodes/edges (`db.getNodes/getEdges` :330-331) and computes signals from them (`compute*FromData` :359-363); its args don't include the ratio (:298-322); the decision (:378-381) is graph-threshold-only, then annotates STOP_ALLOWED "pending newInfoRatio agreement" (:285) — deferring to a layer it cannot see. The self-reported ratio flows model→JSONL→reduce-state (display :763/770/836 + a raw `convergenceScore` fallback :603-606), never cross-checked. The doc-described rolling-ratio STOP exists in feature_catalog only — no script implements it. So the ratio "agreement" is **model-self-adjudicated, unbounded, unaudited.**
- **CHANGE (corroboration-before-STOP):** new `computeGraphNoveltyDelta(nodes,edges,snapshots)` = fraction of new FINDING/SOURCE/EVIDENCE_FOR nodes+edges since the previous persisted snapshot (convergence.cjs already loads snapshots :338 + persists per-iter :390-399); pass the reducer's rolling-ratio in as `--reported-novelty`; add a BLOCKING guard `novelty_self_report_unverified` (if STOP_ALLOWED would fire AND reportedNovelty<threshold BUT graphNoveltyDelta>floor → STOP_BLOCKED); `effectiveNovelty = max(reported, graphDelta)` so the model can't game STOP by under-reporting; absent reportedNovelty → no-op (backward-safe).
- **TEST:** Fixture-A (gaming: high graph delta + `--reported-novelty 0.01` → NOT STOP_ALLOWED + blocker); Fixture-B (flat delta + low report → STOP_ALLOWED); Fixture-C (omit → byte-identical); Fixture-D (insight-only delta → not spuriously blocked).
- **WHAT-BREAKS:** loops on raw self-report until the orchestrator forwards rolling-ratio; false STOP-block on legit low-novelty bookkeeping iterations (scope delta to FINDING/SOURCE/EVIDENCE; mirror reduce-state's insight exemptions); research-scoped first (review/context have own guards); floor + tolerance need calibration.
- **READINESS:** needs-benchmark (additive/backward-safe, ready to spec; the floor + disagreement tolerance must be calibrated on real snapshot histories).

## Next Focus
A genuine NEW gap, fully sketched: corroborate the self-graded STOP input with an independent graph-novelty delta + `max()` anti-gaming. (Self-implicating: this campaign ran on self-graded ratios.) Feeds Round J + the roadmap addendum.
