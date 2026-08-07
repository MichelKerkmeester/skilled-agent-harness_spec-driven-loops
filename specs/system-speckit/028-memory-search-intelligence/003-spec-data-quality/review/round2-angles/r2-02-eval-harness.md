# r2-02 eval-harness (code-quality)

**Angle summary:** The exports are real and reusable and the prod-vs-eval lens divergence is genuinely sound, but the completeRecall@3 cutoff fights the gold-set target multiplicities at both ends, so the phase-015 gate is buildable only as a delta instrument and not as the fixed-floor "completeRecall@3" gate its docs imply.

## Verified sound (evidence checked)

- Exports are real and reusable: `run-eval-v2.mjs:361` exports `buildSearchLenses`, `meanCompleteRecallProfile`, `diffProfiles`, `MEASURABILITY_CLASSES`, `COMPLETE_RECALL_KS`. `meanCompleteRecallProfile` (`run-eval-v2.mjs:216`) is a pure helper over `computeCompleteRecallProfile` (`eval-metrics.ts:408`, dist present at `dist/lib/eval/eval-metrics.js:206`). All imported dist modules exist.
- Dual-mode divergence is real, not cosmetic: prod lens omits `forceAllChannels` so `activeChannels` falls to the `routeQuery` subset (`hybrid-search.ts:1328-1331`) with the router default-ON (`query-classifier.ts:61-64`, `raw !== 'false'`), and omits `evaluationMode` so confidence truncation runs (`hybrid-search.ts:2049`, `confidence-truncation.ts:35` `DEFAULT_MIN_RESULTS = 3`). Explicit `useX:true` only ever removes channels, never forces them on (`hybrid-search.ts:1334-1338`).
- The 015 reuse boundary is scoped correctly: `groupGroundTruth` (`run-eval-v2.mjs:200`) and copy-DB prep are NOT exported, and `plan.md:94,108` already marks ground-truth grouping and the retrieval loop as gate-owned.

## Findings

### F1 — P1 required — completeRecall@3 is structurally capped below 1.0 for the flagship multi-target class
- **Evidence (LIVE-CODE):** `computeCompleteRecall` = `hits / relevantIds.size` (`eval-metrics.ts:393-399`). The `thematic_multi_target` gold queries carry 3 to 10 positive targets each (`lib/eval/data/ground-truth.json`, ids 77-84, avg 7.13), so completeRecall@3 for the 10-target query is bounded at 3/10 = 0.30 even under perfect ranking. The 015 spec names `completeRecall@3` as THE gate metric (`015.../spec.md` §2 Purpose, `plan.md:60`) and raises "fixed floors" as a calibration option (`015.../spec.md` `open_questions`).
- **Why it matters:** A fixed-floor threshold (e.g. 0.8) is mathematically unreachable for `thematic_multi_target` at K=3, so the gate is valid only in delta mode (PROMOTION rise / REGRESSION non-fall over a stored baseline), which is what `plan.md:60` actually describes. The driver computes @5 and @8 too, so the per-class threshold logic must be ceiling-aware or move the thematic headline to @8. causal_chain (|gold| 2 to 4, @3 ceiling 0.75 to 1.0) is the only class @3 fits cleanly.
- **Type:** LIVE-CODE (cutoff vs gold multiplicity), bears directly on the SPEC-PREMISE that an @3 gate is buildable as claimed.

### F2 — P1 required — hard_negative is enumerated as a measurability class but is single-target, reintroducing the saturation eval-v2 exists to remove
- **Evidence (LIVE-CODE):** `MEASURABILITY_CLASSES` includes `hard_negative` (`run-eval-v2.mjs:51-55`), yet every `hard_negative` gold query carries exactly one positive relevance graded 3 (`ground-truth.json` ids 92-97, |gold| min and max both 1). completeRecall@K over a 1-target set is binary (0 or 1) and saturates, the exact failure the module docstring says the gate exists to fix ("the saturated single-target set does not" have something to be incomplete about, `run-eval-v2.mjs:10-14`).
- **Why it matters:** One of three pooled gate classes contributes a flat saturated signal, diluting the overall measurability profile and the per-class `hard_negative` row never moves. The 015 scope premise ("every query carries a relevance set ... so completeRecall@3 has multiple targets to be incomplete about", `015.../spec.md` §3) is already contradicted by the live golden for this class. Either give hard_negative multi-target distractor sets or drop it from the gated pool.
- **Type:** LIVE-CODE (driver constant plus golden data).

### F3 — P2 advisory — token-budget truncation, billed as a prod-vs-eval differentiator, is inert under includeContent:false
- **Evidence (LIVE-CODE):** The harness docstring lists "token-budget truncation is active" as a first-class prod-path fidelity differentiator (`run-eval-v2.mjs:18-24,45`), but both lenses pass `includeContent: false` (`run-eval-v2.mjs:175,190`). `estimateResultTokens` only sizes keys present on the row (`hybrid-search.ts:2825-2858`), so with no `content` key 20 metadata-only rows stay under the 2000/4000 budget (`hybrid-search.ts:2757`, default-4000 note at `:1354`) and `truncateToBudget` returns `truncated:false` (`hybrid-search.ts:2944`). The surviving real differentiators are the `routeQuery` subset and confidence truncation.
- **Why it matters:** Real production that returns content (includeContent:true) drops tail rows the harness prod lens keeps, so the prod completeRecall@3 column the 015 gate reads is an optimistic upper bound on true production recall, and the docstring overstates lens fidelity. Comparative delta mode partially cancels the bias, hence P2 not P1.
- **Type:** LIVE-CODE (doc-vs-behavior plus fidelity).

### F4 — P2 advisory — SPECKIT_ABLATION='true' is a dead assignment with no consumer in the retrieval path
- **Evidence (LIVE-CODE):** `run-eval-v2.mjs:257` sets `process.env.SPECKIT_ABLATION = 'true'` before importing the dist search modules, but no module under `lib/` reads it (the ablation framework gates on `process.env.n`, `ablation-framework.ts`), and a repo-wide read-site grep returns no consumer.
- **Why it matters:** Harmless to results but it misleads a reader into believing the lenses run under an ablation mode that changes routing or scoring. It does not, so the assignment should be removed or wired to a real gate before phase 015 imports the harness env contract.
- **Type:** LIVE-CODE (dead env assignment).
