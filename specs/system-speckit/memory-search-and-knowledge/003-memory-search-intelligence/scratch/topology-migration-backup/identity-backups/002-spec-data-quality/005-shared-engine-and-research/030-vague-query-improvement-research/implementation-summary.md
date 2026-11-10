---
title: "Implementation Summary: 005 Post-Benchmark Improvement Research [template:level_2/implementation-summary.md]"
description: "Status COMPLETE for a research-only deliverable. The 10-angle study diagnosed the benchmarked off-corpus false-positive as a score-calibration miss not an envelope-fidelity miss, converged on a lexical-grounding floor as the root-cause fix, cross-model verified the load-bearing claims, and produced 12 ranked proposals with a build order. Findings live in research/research.md. No calibration or scorer or command or lever code was modified."
trigger_phrases:
  - "005 improvement research summary"
  - "post-benchmark research complete"
  - "lexical grounding floor recommendation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-spec-data-quality/005-shared-engine-and-research/030-vague-query-improvement-research"
    last_updated_at: "2026-07-06T19:16:37.943Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Completed 10-angle research, lexical-grounding fix verified"
    next_safe_action: "Operator decides which verified proposals warrant a build phase"
    blockers: []
    key_files:
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-22-summary-030-vague-query-improvement-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The off-corpus false-positive is a score-calibration miss, not an envelope-fidelity miss."
      - "A lexical-grounding floor is the convergent root-cause fix four angles reached."
      - "The isotonic calibration curve cannot move the verdict, so a re-fit is a non-fix."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 030-vague-query-improvement-research |
| **Completed** | 2026-06-22 |
| **Level** | 2 |
| **Type** | Research-only study, no code or doc mutation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet delivered a diagnosis and a ranked plan, not a code change. Ten angle-diverse read-only seats, each reading the live scoring, citation, eval, command, and lever code, converged on a clear diagnosis of the benchmarked off-corpus false-positive and a clear root-cause fix. The full method, the 12 ranked proposals, the verification verdicts and the recommended build order live in `research/research.md`, backed by the ten per-angle finding sets under `research/deltas/`.

### The diagnosis: a calibration miss, not an envelope miss

The 029 benchmark found `/memory:search` scored `kubernetes` good at 0.78 on a semantically unrelated doc, identical across all four models. The study traced this to a SCORE-CALIBRATION miss, not an envelope-fidelity miss. The envelope reported good faithfully because the upstream absolute-relevance score genuinely returned 0.78. There are two distinct soft spots in 005 that must not be conflated. Soft spot A is off-corpus false-relevance in the verdict and citation pipeline, the kubernetes case, the higher priority because it cites wrong matches with confidence. Soft spot B is the cross-model envelope-fidelity variance, where weaker models drop a field the tool always ships. They share no code and need separate fixes.

### The convergent fix: a lexical-grounding floor

Four independent angles arrived at the same root cause. The entire verdict and citation path uses only the absolute cosine score plus a top-margin, with zero query-term or lexical-grounding signal. Nomic embeddings hand fluent but unrelated text a high background cosine, so a lone spurious hit sails through. The fix is to require lexical grounding, a query-term or BM25 overlap floor, before awarding good or cite_results, reusing the keyword and fts signals already on the result rows.

### The build order

Two facts shape the order. First, the verdict is provably independent of the isotonic calibration curve, banding is taken off the pre-calibration value, so a curve re-fit can never move good versus weak and is a non-fix. Second, the eval harness already holds the measurement machinery, `falseGoodOnHardNegatives` exists but is dormant and unwired, and all six ground-truth hard-negatives are in-corpus decoys rather than off-corpus no-target terms. So the cheapest and highest-precedence work is adding an off-corpus query class then wiring the dormant metric behind a CI threshold, which turns the one-off 144-cell manual benchmark into a permanent regression guard. The lexical-grounding floor follows behind a default-off flag, then corroboration and the render mandate, with the P2 refinements deferred to a backlog.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Created | The synthesized 10-angle ranked proposals, verification and build order |
| `research/deltas/` | Created | The ten per-angle finding sets |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md` | Created | Level 2 spec-folder documentation for the completed study |

No calibration, scorer, command, or lever code was modified.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The study ran ten read-only angle seats through a Workflow, each scoped to its slice of the live source so it stayed within context. Seats were read-only by design, since an opencode-dispatched edit cannot pass Gate 3, and the orchestrator wrote all state. The angles spanned the calibration false-relevance, the weak-versus-gap boundary, envelope-fidelity enforcement, citation grounding, a red-team eval set, absolute-relevance re-fit, un-built lever re-prioritization, the write-time quality-loop scorer, the adherence and logic-reading jobs, and model-driver defaulting. The load-bearing step was a cross-model verification pass, the load-bearing claims were independently re-checked by gpt-5.5-fast reading the live code, scoped into three groups to stay within a single dispatch. Confidence comes from that verification pass and from each proposal citing a file the seat actually read.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep every seat read-only and write state from the orchestrator | An opencode-dispatched edit cannot pass Gate 3, so read-only is the only safe seat shape |
| Separate the two soft spots rather than conflate them | Off-corpus false-relevance and envelope fidelity share no code and need separate fixes |
| Treat the lexical-grounding floor as the root-cause fix | Four independent angles reached it, and the lexical signals already exist on the result rows |
| Rank the fixture and CI gate ahead of the behavioral fix | They are read-only test additions that turn the benchmark into a permanent regression guard |
| Keep the calibration re-fit as documentation only | The verdict is provably independent of the curve, so a re-fit is a non-fix for the false-positive |
| Stop at research only, modify no calibration or scorer or command or lever code | Shipping a fix is an operator decision, not part of this study scope |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Ranked proposal set written | PASS, research/research.md section 4 lists 12 ranked proposals across two soft spots |
| Per-angle evidence retained | PASS, research/deltas/ holds the ten finding sets |
| Load-bearing claims cross-model verified | PASS, all six returned PARTIAL core-confirmed by gpt-5.5-fast, none refuted |
| Rank 4 rationale refined | PASS, corroboration must gate the qualityRatio-on-a-lone-hit path as well as margin |
| Calibration-curve independence confirmed | PASS, the band is taken off the pre-calibration value, the re-fit is a non-fix |
| No calibration or scorer or command or lever code modified | PASS, only research artifacts written |
| Spec-folder strict validation | PASS, validate.sh --strict exits 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **This study closes nothing.** The proposals are documented, not built. The next step is the operator decision recorded in research/research.md section 7.
2. **The thresholds are embedder-scoped.** Any noise-floor or grounding threshold is calibrated against the active embedder, so fixtures should assert qualitative verdicts over a cosine profile rather than pin a number.
3. **Soft spot B is a separate track.** Envelope fidelity is a robustness gap on a correct verdict, distinct from the off-corpus false-relevance defect, and its proposals are ranked lower.
4. **The off-corpus fixture is a precondition.** Every behavioral fix below rank 2 can only be validated once the off-corpus query class exists, so the fixture is the gating first build.
<!-- /ANCHOR:limitations -->
