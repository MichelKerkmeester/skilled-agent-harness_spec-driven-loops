---
title: "Spec: Evidence-Gap Detector Threshold Calibration Benchmark"
description: "A calibration benchmark that tests whether the Stage-4 evidence-gap detector's Z-score threshold (default 1.3) is calibrated, so strong aligned matches stay good while genuine gaps cap. The benchmark runs 18 labeled queries through the production executePipeline against a read-only backup of the live corpus, recomputes the continuous Z-score faithfully (18 of 18 assertion holds), and sweeps the threshold from 0.5 to 3.0. Finding: the detector is mis-designed not mis-tuned, the Z-score measures peakedness not relevance, so no threshold separates good from gap and the detector needs a relevance-aware redesign."
trigger_phrases:
  - "evidence gap detector calibration"
  - "Z-score peakedness not relevance"
  - "gap threshold not tunable"
  - "over-capping strong queries"
  - "gap threshold calibration benchmark"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/006-generated-metadata-build/011-gap-threshold-calibration-benchmark"
    last_updated_at: "2026-07-04T17:11:54.651Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ran the 18-query threshold sweep, authored results and verdict"
    next_safe_action: "Phase complete, verdict lives in benchmark-results.md"
    blockers: []
    key_files:
      - "scripts/gap-threshold-calibration-benchmark.mjs"
      - "results/metrics.json"
      - "benchmark-results.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: Evidence-Gap Detector Threshold Calibration Benchmark

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-23 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../010-deterministic-ranking-benchmark/spec.md |
| **Successor** | ../012-relevance-aware-evidence-gap/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Stage-4 evidence-gap detector flags a query as a gap when its Z-score `(topScore - mean) / stdDev` falls below a default threshold of 1.3. The 041 keystone fix wired that detector to the verdict cap so the banner and the verdict agree, which made the cap live. The 041 rerun then showed the now-live cap demoting even aligned one-word queries like `graph`, which raised whether 1.3 is too aggressive. No benchmark had measured the detector against a labeled set on the real corpus, so the question of whether 1.3 is mis-tuned, or whether the statistic itself is the wrong signal, rested on a single anecdote rather than a measured sweep.

### Purpose
Decide, with a reproducible sweep against the live corpus, whether the evidence-gap detector's Z-score threshold can be calibrated to keep strong aligned matches good while capping genuine gaps. Produce a per-group Z-score distribution, a should-good false-positive rate and should-gap detection rate at the 1.3 default, an optimal-threshold search across 0.5 to 3.0, and a verdict grounded strictly in the measured separation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- An 18-query labeled set of 6 should-good (strong specific aligned terms, expect not-gap), 6 should-gap (off-corpus, expect gap) and 6 boundary (one-word aligned, the question) queries run through the production `executePipeline`
- A faithful recomputation of the continuous Z-score over the exact score array Stage 4 fed the detector, with a per-query assertion that the recomputed binary equals production for all 18 queries
- A threshold sweep from 0.5 to 3.0 scoring separation as should-good-correct plus should-gap-correct over total
- A read-only backup of the live corpus with the active embedder, no reindex
- A reproducible harness and the `results/metrics.json` it produces committed in the phase folder

### Out of Scope
- Any change to production ranking code, the detector statistic, the threshold default, or the `executePipeline` surface
- The detector redesign itself. This phase measures the problem and recommends the redesign, it does not build it
- A human ground-truth labeling pass. The labels are proxy labels by construction (strong-aligned, off-corpus, one-word), not human relevance judgments
- A reindex of the corpus. The harness reads a backup as-is

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| scripts/gap-threshold-calibration-benchmark.mjs | Create | The labeled-set harness, Z-score recomputation and threshold sweep |
| results/metrics.json | Create | The per-query Z-scores, per-group distributions and sweep rollup |
| benchmark-results.md | Create | The full data tables and the calibration verdict |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The harness runs all eighteen labeled queries through the production `executePipeline` against the real corpus | results/metrics.json reports a Z-score and the production `evidenceGapDetected` binary per query across the three label groups |
| REQ-002 | The recomputed Z-score is faithful to the production detector | a per-query assertion proves the recomputed binary equals production for all 18 of 18 queries, so the swept statistic matches the one that ships |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Every verdict claim traces to a measured number | benchmark-results.md and implementation-summary.md cite values present in metrics.json |
| REQ-004 | The benchmark mutates no production code and does not change the threshold default | the detector and threshold are read as-is, the corpus is a read-only backup with no reindex, and no shared code is edited |
| REQ-005 | The run is reproducible from the committed harness | `node scripts/gap-threshold-calibration-benchmark.mjs` rebuilds metrics.json from the live corpus with the 18-query faithfulness assertion holding |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A per-group Z-score distribution (min, median, max for should-good, should-gap and boundary) documented across all eighteen queries
- **SC-002**: A should-good false-positive rate and a should-gap detection rate at the 1.3 default, plus an optimal-threshold search across 0.5 to 3.0 reporting the best separation reached
- **SC-003**: A calibration verdict for the evidence-gap detector, grounded strictly in the measured separation, stating whether the threshold can be tuned or whether the statistic itself must be redesigned
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A recomputed Z-score that drifts from the production binary would invalidate the swept statistic | A sweep over a statistic that is not the one that ships | A per-query assertion proves the recomputed binary equals production for all 18 queries, so the swept Z-score is the production Z-score |
| Risk | Proxy labels rather than human ground-truth could mislabel a query and bias the rate | A false-positive or detection rate read off a wrong label | Each should-good query is checked for a real strong top match (min top 0.67), so a low Z reflects peakedness not a missing match |
| Dependency | The live corpus backup with the active embedder and the production `executePipeline` and `detectEvidenceGap` | The benchmark cannot recompute a faithful Z-score without the production detector over the real score arrays | The harness reads a backup and calls the production pipeline and detector as-is, with the direction confirmed at `evidence-gap-detector.ts:206` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each query runs the production `executePipeline` once and the Z-score is recomputed over the captured score array, so the harness pays the pipeline cost eighteen times rather than once per swept threshold
- **NFR-P02**: The threshold sweep is a pure recomputation over the captured Z-scores, so all 0.5 to 3.0 thresholds are scored without re-running the pipeline

### Security
- **NFR-S01**: The corpus is a read-only backup and the harness issues no write, so no benchmark query mutates the live memory database
- **NFR-S02**: The detector statistic and the 1.3 threshold default are read as-is and never written to any shared config, so no consumer outside the run sees a changed detector

### Reliability
- **NFR-R01**: A per-query assertion proves the recomputed binary equals the production `evidenceGapDetected` for all 18 queries, so the swept statistic is confirmed faithful rather than asserted
- **NFR-R02**: The harness rebuilds metrics.json from the same backup on every run, so a repeat run reproduces the per-query Z-scores and the sweep
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Off-corpus query with a flat weak cluster: a term with no strong corpus match produces a high Z-score because a marginal top barely leads a flat cluster, so it escapes the gap flag, the case that exposes the inverted statistic
- Strong aligned query with a tight strong cluster: a query whose top does not stand far above its strong neighbors produces a low Z-score, so it is flagged as a gap and over-capped, the false-positive case
- Boundary one-word query: a one-word aligned term sits between the groups and is the original question, only `graph` and `scores` cap among the six

### Error Scenarios
- A high Z-score on a genuine gap: an off-corpus query reaching Z 3.0 to 3.26 is the strongest single signal that the statistic rewards a lonely weak result rather than relevance
- A low Z-score on a strong match: a should-good query with a real strong top match flagged as a gap is the signal that the statistic punishes a rich strong cluster

### State Transitions
- Faithfulness across the set: the recomputed binary is checked against the production `evidenceGapDetected` for every one of the eighteen queries, not only a sample, so the swept statistic is confirmed end to end
- Separation across the sweep: separation that never passes 0.50 at any threshold from 0.5 to 3.0 is read as the statistic being unable to separate the groups, not as a threshold that needs more tuning
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | Eighteen queries, one in-process pipeline surface, one recomputed statistic and a sweep |
| Risk | 6/25 | Read-only backup, no production mutation, the only risk is an unfaithful recomputation, which the assertion guards |
| Research | 16/20 | A labeled three-group distribution analysis with a faithfulness assertion, a calibration rate and an optimal-threshold search |
| **Total** | **31/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Whether the relevance-aware redesign should key the gap signal off the `requestQuality` noise-floor-relative banding alone, or require both low absolute relevance and the peakedness signal
- Whether the boundary one-word queries warrant their own labeled group in the redesign validation, since they are the original question and split across the cap line
<!-- /ANCHOR:questions -->
