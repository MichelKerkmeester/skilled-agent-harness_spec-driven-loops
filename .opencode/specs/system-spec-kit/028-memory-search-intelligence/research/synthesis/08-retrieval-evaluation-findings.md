# 08 — Retrieval Evaluation: Before → After (Plain-Language)

> **What this is.** The findings from the **008 retrieval-evaluation campaign** (12 Opus-4.8-via-claude2 iterations), as **feature changes with a concrete before vs. after** — same style as `05`/`06`. Where `06` mined external memory *systems*, `08` researches the **internal measurement + post-027/002 angle space** the shipped 015-019 search-intelligence work opened up. Born from the `07` reconciliation (015 fixed the broken request-quality gate → retrieval became measurable for the first time).
>
> **The campaign in one line.** Eight angles (A1-A8) on whether/how to *measure* the levers 027/002 shipped — and the answer converged on **one buildable spine**: a small eval-harness extension that produces three new accuracy metrics, feeding a class-parameterized promotion gate that the existing one-class gate already half-implements.
>
> **Status: research only, CONVERGED at 12 of a planned 20.** Both the orchestrator and an independent synthesis seat read saturation ("stop research, open the build") — the keystone is mined out, no un-mined frontier remained, so the campaign stopped rather than pad. Every effort/value tag is structural inference; nothing is built or benchmarked.

## How to read each entry
```
N. Plain name  (id)  · [NEW] or [EXISTING: …]  · Wave
   Do / Before / After / Catch
```
- **Wave 0** = correctness, always-on, ships independent of the harness. **Wave 1** = the eval-harness spine (build first; gates everything). **Wave 2** = new results-affecting intelligence — shadow-gated default-off, promote on live evidence (027 doctrine). **Reindex is gate-zero** for any recall measurement.

## The keystone (what the campaign actually found)
The eval harness is **already ~80% built** — a live `eval_run_ablation` runner drives real `hybridSearchEnhanced` against a **110-query graded golden set** (290 judgments, real prod IDs), with a 12-metric library, baseline runner, dashboard, alignment guard, and traffic-feedback scaffolding. But every existing metric measures *ranking* — **none measures answer-correctness (the gate verdict) or score-reliability (calibration)**. The deliverable is therefore an *extension*, not a build: three new corpus-level metric lanes + a per-class promotion gate.

---

## Wave 1 — the eval-harness spine (build FIRST; forced linear order)

**1. Guard recall claims behind embedding coverage**  `(C9-4-assertEmbeddingCoverage)` · **[EXISTING: partial]** · Wave 1 · **gate-zero**
- **Do:** extend the alignment guard to throw-with-remediation when the golden set's embedding coverage is below threshold (i.e. the deferred reindex hasn't run).
- **Before:** `assertGroundTruthAlignment` checks ID parenthood/presence only — a recall number can be measured against a quarter-dark, partly-un-embedded index and silently believed.
- **After:** no recall/calibration/cold number is trusted until coverage is whole. Makes "reindex is gate-zero" executable. (Drop-in at `ablation-framework.ts:580-586`.)

**2. Capture the verdict/confidence/tier the runner already computes**  `(C9-1-shared-single-pass-emit)` · **[EXISTING: buggy]** · Wave 1 · **root unblock**
- **Do:** add a parallel per-query capture (gate verdict + per-result resolved confidence + each row's tier) in the existing baseline pass.
- **Before:** `runAblation`'s loop captures only `EvalResult[]` (id/score/rank) — which is *why* all three new lanes are missing. The pipeline already computes verdict/confidence/tier; the harness throws them away.
- **After:** one snapshot per query feeds all three lanes. (Mechanism already exists: `captureScoreSnapshot` + `resolveAbsoluteRelevance`.)

**3. Tag the golden labels three ways in one DB-join**  `(C9-2-enrichGroundTruth-tagging)` · **[EXISTING: partial]** · Wave 1
- **Do:** derive citability / binary-calibration / tier-tag label views from graded relevance in one join.
- **Before:** `GroundTruthEntry` *types* `tier?/createdAt?` but the golden *data* doesn't populate them; relevances are grades 1-3 positive-only (hard-negatives carry no rows).
- **After:** all three lanes get labels at once; cold-tier gap closes automatically. **Catch:** this is a *data backfill*, not new plumbing — and the citability label derives "expect non-citable" from the `hard_negative` *category*, not a grade-0 row (none exist).

**4. The three new metric lanes**  `(C9-3-three-corpus-metrics)` · **[NEW]** · Wave 1 · **the actual deliverable**
- **Do:** add, at the aggregation layer, (a) gate-verdict confusion + P/R/F1, (b) **ECE + Brier + reliability bins**, (c) cold-appearance-rate + cold-precision.
- **Before:** the 12 metrics are all ranking; there is **no** verdict-accuracy and **no** calibration metric anywhere (`ECE`/`Brier` grep-clean).
- **After:** the harness can finally answer "did 015's gate fix hold / is candidate X better" for gate + calibration + cold candidates, not just ranking. **Catch:** these are genuinely greenfield metrics *hosted by* the existing runner.

**5. Un-weld the promotion gate from one candidate-class**  `(A8-1 + A8-2/A8-5/A8-4)` · **[EXISTING: partial]** · Wave 1
- **Do:** keep the existing shadow-scoring gate's spine (20% deterministic holdout, ≥2 non-regressing cycles, promote/wait/rollback, audit ledger); swap a **per-class metric panel** for the hardcoded `meanNdcgDelta`. Add the CLASS-G (ECE/Brier) panel, route held-out labels through the golden set, and encode promote-on-evidence as the flag lifecycle (`isOptInEnabled`→`isFeatureEnabled`→rollback).
- **Before:** exactly one promotion gate exists, welded to ranking-levers; the held-out labels come from `adaptive_signal_events` (returns empty when signals cancel → silently skips cycles).
- **After:** one reusable gate promotes any intelligence-class candidate on its own metric class. **The isotonic calibration flag is frozen at opt-in *precisely because* no CLASS-G gate exists to make its promote evidence — this supplies the missing gate, not a new flag.**

---

## Wave 2 — intelligence-class (shadow-gated, promote on live evidence; needs the gate + reindex)

**6. Graduate the isotonic confidence calibration**  `(A2-isotonic-calibration)` · **[EXISTING: off]** · Wave 2 · **flagship**
- **Do:** harvest real labels (Wave-1 lanes) → fit → measure ECE vs identity → flip the flag on evidence.
- **Before:** the isotonic machinery is fully built but `fitCalibration` has **zero non-test callers**, the "proxy seed" the docs say shipped is a **phantom** (no artifact), and no ECE metric exists — so promote-on-evidence is literally *unexecutable*.
- **After:** the doctrine's flagship — a flag that graduates default-on only when a real-fit beats identity on held-out ECE.

**7. A/B the levers 017 shipped default-on but unmeasured**  `(A3-AB-shipped-levers)` · **[EXISTING: on, unmeasured]** · Wave 2
- **Do:** on/off A/B of cosine-reorder (S5), generic-query escalation (S3), top-dominant verdict (S2) on the golden set.
- **Before:** all three ship default-on with zero recall evidence; the harness can't even *see* S5 (it's skipped under `evaluationMode`).
- **After:** each lever's effect is measured. **Catch:** requires the Wave-0 S5-evalMode harness fix first; S5's demotion of fused-non-vector hits is real but **bounded** (head-only, rank-not-eviction, rare) — a small-effect lever, not a dedicated fix.

**8. Re-measure cold-tier surfacing + host reindex-as-consolidation**  `(A5-cold-tier-remeasure · A7-1/A7-2)` · **[NEW / EXISTING: partial]** · Wave 2
- **Do:** once reindex clears, measure post-015 cold surfacing; and host the LLM-free `reconsolidate()` (merge/supersede) as a shadow-gated 4th `runIndexScan` phase.
- **Before:** 016's "cold tier inert" was measured *pre*-admission and can't be re-checked (reindex deferred + no tier label); cadence-reorg "is a shape we don't have" (it is — 018's responsive scan).
- **After:** cold surfacing is measurable; reorg rides the scan's existing cadence/cancellation/marker. **Catch:** reorg *mutates* (breaks scan idempotency) → strictly shadow-gated; the LLM-transcript half stays a separate governed packet (no loop/cost governor).

---

## Wave 0 — correctness, always-on (ship in parallel, no harness dependency)

**9. Fix the maintenance-grace TTL as a relationship**  `(A7-4 + A7-5)` · **[EXISTING: buggy]** · Wave 0 · **the 019 open gap, answered**
- **Do:** replace the hardcoded `MAINTENANCE_MARKER_TTL_MS=180000` with `ownerLease.ttlMs × K (K>2)`; codify "every synchronous phase > TTL/2 must call `maintenance.refresh()`."
- **Before:** the 180s constant is justified only against an observed ~79s phase; the load-bearing invariant (`180s > 120s` 2×-lease-reclaim window) is *implicit* — both the lease heartbeat and the marker can lapse together during a long phase, letting a competing launcher reap a live mid-scan daemon.
- **After:** the TTL auto-tracks the lease window; the phase-yield invariant caps zombie reap-latency at exactly one TTL.

**10. Other Wave-0 correctness:** the A4 **015-residual** (`resolveSearchScore` still reads the RRF scale the 015 fix corrected elsewhere — `memory-search.ts:493-498`); **divergence-magnitude telemetry** (the cosine-vs-RRF head permutation `reorderTopNByCosine` already computes then discards — a free observe-only signal); the **S5-evalMode harness fix** (prerequisite for #7); and **cosine-math dedup** (3× duplicated `cosineSimilarity`) if verified results-neutral.

---

## DROP / RESCOPED (verify-corrected — the campaign pruning its own overstatement)
- **A8 "the gate is structurally blind to recall additions" → RESCOPED.** Refuted: `ndcgDelta` *is* sensitive to judged recall additions (`condenseJudgedRanking` keeps all judged items). The gate is blind only for the per-result deltas/counts and for **unlabeled** added items — a qrels-coverage problem, not gate-blindness. Survives as a low-priority coverage instrument. *The campaign's most-overstated claim.*
- **S5 "demotes correctly-fused non-vector hits" → BOUNDED.** Real but head-only, rank-not-eviction, rare → no dedicated fix; fold into #7's A/B as a small-effect lever.
- **`CG-content-hash-reprocessing-trigger` (reconciliation #12) → half-covered** (the scan re-derives embeddings but not the merge/supersede reorg). Informational.

## Honest caveats
- **No benefit numbers** — every tag is structural inference; the *point* of the Wave-1 harness is to make the rest measurable, but nothing here is measured yet.
- **Reindex is gate-zero** — the entire recall/calibration/cold column is un-measurable until the deferred corpus reindex runs (C9-4 makes that a hard precondition).
- **Sourcing honesty:** the synthesis seat confirmed the spine (C9/A8/A7) tiers from the deltas it read; the A1/A4/A6/A2/A3/A5 *framings* were inferred from headlines under its read-cap — re-open those iters before treating their exact lev/eff as load-bearing.
- **Scope:** research-only (028 §3). The C9→A8 spine IS the implementation packet's plan; building it is a separate, later decision.

## How this relates to the rest of the campaign
- `05` = the 200-iter aionforge/galadriel plain-language view; `06` = the external-memory-systems sequel; `07` = the reconciliation that *created* these angles; **`08` = the internal measurement/evaluation roadmap those angles converged on.**
- Unlike `06` (which proposed candidates), `08`'s deliverable is a **build spine with a forced order** — because 027/002 shipping 015-019 turned "what should we change" into "what can we now *measure*, and in what order."

> **Scope reminder.** Research-only. Converged at 12/20 (saturation). Nothing built or benchmarked; the spine is the plan for a later implementation packet.
