---
title: "Research: 005 Post-Benchmark Improvement Study [template:research]"
description: "A 10-angle deep-research study, seeded by the 029 model benchmark, on improving the 005 spec-data-quality program. Finds the benchmarked off-corpus false-positive is a score-calibration miss not an envelope-fidelity miss, that lexical grounding is the convergent root-cause fix four angles arrived at independently, and that the eval harness already holds the measurement machinery but lacks the off-corpus fixture. Produces 12 ranked proposals across two distinct soft spots, with a recommended build order."
trigger_phrases:
  - "005 improvement research"
  - "off-corpus false-relevance fix"
  - "lexical grounding citation floor"
  - "data quality calibration research"
  - "false-confirm eval driver"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/003-spec-data-quality/005-shared-engine-and-research/005-vague-query-improvement-research"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Synthesized and cross-model-verified the 10-angle improvement research"
    next_safe_action: "Fold gpt-5.5 verification verdicts and decide build phases"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/dist/lib/search/confidence-scoring.d.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/dist/lib/search/search-results.d.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Research: 005 Post-Benchmark Improvement Study

<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

The 029 model benchmark found that `/memory:search` confidently cited an off-corpus term, `kubernetes` scored good at 0.78 on a semantically unrelated doc, identical across all four models. Ten angle-diverse research seats, each reading the live scoring, citation, eval, and command code, converged on a clear diagnosis and a clear fix.

The diagnosis: this is a SCORE-CALIBRATION miss, not an envelope-fidelity miss. The envelope reported good faithfully because the upstream absolute-relevance score genuinely returned 0.78. There are two distinct soft spots in 005 that must not be conflated. Soft spot A is off-corpus false-relevance in the verdict and citation pipeline, the kubernetes case. Soft spot B is the cross-model envelope-fidelity variance the benchmark also saw, where weaker models drop a field the tool always ships. They share no code and need separate fixes.

The fix is convergent. Four independent angles arrived at the same root cause, the entire verdict and citation path uses only the absolute cosine score plus a top-margin, with zero query-term or lexical-grounding signal. Nomic embeddings hand fluent but unrelated text a high background cosine, so a lone spurious hit sails through. The fix is to require lexical grounding, a query-term or BM25 overlap floor, before awarding good or cite_results.

Two facts shape the build order. First, the verdict is provably independent of the isotonic calibration curve, banding is taken off the pre-calibration value at `confidence-scoring.ts:400`, so a curve re-fit can never move good versus weak and is a non-fix. Second, the eval harness already holds the measurement machinery, `computeCitabilityConfusionMetrics` with `falseGoodOnHardNegatives` exists, but it is dormant and unwired, and all six ground-truth hard-negatives are in-corpus decoys with real targets rather than off-corpus no-target terms. So the cheapest and highest-precedence work is adding an off-corpus query class, then wiring the dormant metric behind a CI threshold, which turns the one-off 144-cell manual benchmark into a permanent regression guard.
<!-- /ANCHOR:summary -->

---

## 2. METHOD

- **Ten angle-diverse research seats** run in parallel through a Workflow, each scoped to its files and read-only. Angles spanned the calibration false-relevance, the weak-versus-gap boundary, envelope-fidelity enforcement, citation grounding, a red-team eval set, absolute-relevance re-fit, un-built lever re-prioritization, the write-time quality-loop scorer, the adherence and logic-reading jobs, and model-driver defaulting.
- **Cross-model adversarial verification**, the load-bearing claims were independently checked by gpt-5.5-fast, a different model than the claude seats that surfaced them, scoped into three groups (eval-harness, scoring-logic, grounding-envelope) to stay within a single dispatch.
- **38 raw proposals** deduplicated and merged into 12 ranked entries. Every proposal cites a file the seat read, an unevidenced claim was dropped in synthesis.

---

## 3. THE TWO SOFT SPOTS

| Soft spot | What it is | Proposals | Shared code |
|-----------|-----------|-----------|-------------|
| A: off-corpus false-relevance | The verdict and citation path scores an off-corpus term as good on a spurious high-cosine hit, with no grounding signal | ranks 1-4, 7-8, 10-12 | confidence-scoring + search-results + eval harness |
| B: envelope fidelity | The tool always ships the verdict but weaker models drop it in render, so the field is model-dependently absent | ranks 5-6, 9 | the command render contract |

The two are independent. Soft spot A is the benchmarked defect and the higher priority, it cites wrong matches with confidence. Soft spot B is a robustness gap, the verdict is correct whenever rendered but not always rendered.

---

## 4. RANKED PROPOSALS

### P0, the unblockers and the root-cause fix
- **[1] P0/S Add off-corpus hard-negative queries to the eval ground-truth.** All six existing hard-negatives are in-corpus decoys with a real relevance-3 target, so no sample tests the absent-term case. Add an `off_corpus` class with terms structurally absent from the corpus (kubernetes, oauth, kafka, terraform), each with zero relevance rows, and pin kubernetes as a permanent regression anchor. The precondition for validating every fix below.
- **[2] P0/M Wire and gate a false-confirm-rate eval driver.** `falseGoodOnHardNegatives` already exists but no `scripts/evals` driver calls it. Add a driver over the off-corpus class plus a `SPECKIT_FALSE_CONFIRM_MAX_RATE` CI gate, recording the active embedder since the rate is embedder-scoped.
- **[3] P0/M Gate good and cite_results on a lexical-grounding floor.** The convergent root-cause fix. Require a query-term or BM25 overlap floor, not the absolute cosine alone, before awarding good, reusing the existing keyword and fts signals already on the result rows.
- **[5] P0/S Promote the verdict fields to conditionally-mandatory render slots.** The tool always ships requestQuality and citationPolicy on a non-empty result, the render contract lets models drop them. Reclassify both to required-when-present and extend the command self-check to re-emit if absent.

### P1, the corroboration and fidelity hardening
- **[4] P1/S Single-hit corroboration in assessRequestQuality.** A lone above-floor hit over a weak tail produces the largest top-margin, so the margin signal perversely rewards the spurious hit, require a second above-threshold hit before good. Verification refined this, the lone hit can reach good through qualityRatio with a zero margin on a single result, so the corroboration must gate the ratio path too.
- **[6] P1/M Deterministic post-render envelope-fidelity check** replaying the tool verdict against the rendered block.
- **[7] P1/S Surface a grounding or low-grounding signal in the envelope** so a downgrade or borderline cite is legible.
- **[8] P1/M Subtract a measured corpus noise-floor from absolute relevance before banding**, the background-cosine correction.

### P2, the refinements
- **[9] P2/M Tool emits a ready-to-paste rendered envelope fragment** to remove the model transcription step.
- **[10] P2/M A cite_with_caveat tier** so borderline grounding is hedged rather than dropped.
- **[11] P2/M Bridge stage4.evidenceGapDetected into the request-quality verdict.**
- **[12] P2/L Re-fit calibration with off-corpus negatives, and document that the curve CANNOT move the verdict.** Kept only as documentation, the re-fit is a non-fix for the false-positive.

---

## 5. CROSS-CUTTING THEMES

1. The kubernetes false-positive is a score-calibration miss, not an envelope-fidelity miss, the envelope was faithful.
2. Two distinct soft spots, off-corpus false-relevance and envelope fidelity, share no code and need separate fixes.
3. The verdict is provably independent of the isotonic calibration curve, so any fix lives in assessRequestQuality or the absolute-relevance score, never the curve.
4. Lexical grounding is the convergent root-cause fix four angles reached independently.
5. The eval harness has the measurement machinery but not the fixture, so the off-corpus class plus wiring the dormant metric is the cheapest high-value work.
6. Every behavioral fix should ship dark behind a default-off flag and graduate only after validating on the new off-corpus fixtures, so the aligned good queries and the correctly-weak authentication case provably do not regress.
7. Embedder-portability is a latent risk, thresholds and any noise-floor are calibrated against a specific embedder, so fixtures should assert qualitative verdicts over a cosine profile.

---

## 6. VERIFICATION

All six load-bearing claims were independently checked by gpt-5.5-fast reading the live code, a different model than the seats that surfaced them. Every one returned PARTIAL, the core is confirmed by direct file evidence with a precision caveat, and none was refuted. The verification sharpened the study rather than overturning it.

| Claim | Verdict | Confirmed, and the caveat |
|-------|---------|---------------------------|
| Off-corpus fixture gap (rank 1) | PARTIAL | Confirmed the six ground-truth hard-negatives are in-corpus decoys with a relevance-3 target and no off-corpus class exists (ground-truth.json:914-971, ground-truth-data.ts:18-30). Caveat: expectedCitable already excludes hard-negatives explicitly, so the gap is the absence of an off-corpus absent-term class, not an untested non-citable case. |
| Dormant false-confirm metric (rank 2) | PARTIAL | Confirmed computeCitabilityConfusionMetrics and falseGoodOnHardNegatives exist (eval-metrics.ts:885-902) and no eval driver calls them, ablation-framework wires only the weaker computeGateVerdictMetrics. Caveat: assessRequestQuality itself is live in the production formatter, so it is the metric that is dormant, not the verdict logic. |
| Lexical-grounding absence (rank 3) | PARTIAL, core verified | Confirmed the citation policy derives only from requestQuality.label, which uses topScore, qualityRatio and topMargin with no query or lexical input (confidence-scoring.ts:433-478), and the lexical signals fts_score and bm25 ARE available on the raw rows (search-results.ts:913-916). The convergent fix is verified and feasible. |
| Margin rewards lone hit (rank 4) | PARTIAL, rationale refined | Confirmed topMargin is a plain first-minus-second with no corroboration (confidence-scoring.ts:309-312). Caveat: a single-result kubernetes sample sets topMargin to 0, so the lone hit earned good through qualityRatio, not margin. The corroboration fix still holds but must gate the qualityRatio-on-a-lone-hit path as well as the margin path. |
| Verdict shipped, render-dropped (rank 5) | PARTIAL | Confirmed the verdict is computed and shipped, the benchmark scored fidelity from rendered prose, and the cross-model disagreements are null omissions not conflicts (search-results.ts:1167-1176, benchmark-results.md:79). Caveat: the field is presence-gated by isResultConfidenceEnabled, so the contract is mandatory-when-enabled, which the proposal already states. |
| Calibration-curve independence (theme 3) | PARTIAL, core verified | Confirmed the verdict band is taken off the pre-calibration value (confidence-scoring.ts:400, value=maybeCalibrate at :388), so the curve cannot move good, weak, or gap. The calibration re-fit is verified a non-fix. |

Net effect: the convergent lexical-grounding fix and the calibration-curve-independence guardrail are both verified by an independent model. The single material refinement is to rank 4, the corroboration requirement must gate the qualityRatio-on-a-lone-hit path as well as the margin path, because a single off-corpus result reaches good through the ratio with a zero margin.

---

## 7. RECOMMENDED BUILD ORDER

1. **Ship the fixture and the gate first** (ranks 1 then 2), they are read-only test additions and turn the benchmark into a permanent guard.
2. **Then the lexical-grounding floor** (rank 3) behind a default-off flag, validated against the new off-corpus fixtures and the aligned good queries.
3. **Then corroboration and the render mandate** (ranks 4 and 5), small and independent.
4. **Defer the P2 refinements** to a backlog, and keep the calibration re-fit (rank 12) as documentation only.

---

<!-- ANCHOR:references -->
## 8. REFERENCES

- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/005-shared-engine-and-research/029-vague-query-model-benchmark/` the benchmark that seeded this study.
- `.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/confidence-scoring` the verdict banding and the margin signal.
- `.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/search-results` where the verdict fields are populated and shipped.
- `.opencode/skills/system-spec-kit/mcp_server/dist/lib/eval/eval-metrics` the dormant `falseGoodOnHardNegatives` metric.
- `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/` the eval drivers and the ground-truth fixtures.
- `research/deltas/` the ten per-angle finding sets.
<!-- /ANCHOR:references -->
