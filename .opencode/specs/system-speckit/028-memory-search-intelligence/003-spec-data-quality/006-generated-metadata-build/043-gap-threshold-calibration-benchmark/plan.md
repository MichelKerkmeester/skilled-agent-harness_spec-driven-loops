---
title: "Implementation Plan: Evidence-Gap Detector Threshold Calibration Benchmark"
description: "A single in-process harness in the phase folder that runs the production executePipeline against a read-only backup of the live corpus over an 18-query labeled set, reads the production evidenceGapDetected per query, recomputes the continuous Z-score faithfully over the exact score array Stage 4 fed the detector, asserts the recomputed binary equals production for all 18 queries, then sweeps the threshold from 0.5 to 3.0 into results/metrics.json. Rejects hand-entering the Z-scores as the wrong fit for a faithfulness-gated sweep."
trigger_phrases:
  - "evidence gap detector calibration"
  - "Z-score peakedness not relevance"
  - "executePipeline detector recomputation harness"
  - "faithful Z-score sweep"
  - "labeled set gap threshold harness"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/006-generated-metadata-build/043-gap-threshold-calibration-benchmark"
    last_updated_at: "2026-07-04T17:11:54.651Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored harness, ran the 18-query labeled set"
    next_safe_action: "Sweep the threshold and write the verdict"
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
# Implementation Plan: Evidence-Gap Detector Threshold Calibration Benchmark

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM `.mjs` benchmark script |
| **Framework** | In-process `executePipeline` and production `detectEvidenceGap` against a read-only corpus backup, active embedder |
| **Storage** | A read-only DB backup and a single metrics.json rollup |
| **Testing** | A per-query faithfulness assertion across all 18 queries, host verification of the labeled-set run |

### Overview
This phase builds one in-process benchmark harness in the phase folder. The harness opens a read-only backup of the live corpus, names the eighteen labeled queries across the should-good, should-gap and boundary groups, and for each query runs the production `executePipeline` once. From each run it reads the real `evidenceGapDetected` (the 1.3 decision) from Stage-4 metadata, then recomputes the continuous Z-score via the production `detectEvidenceGap` over the exact score array Stage 4 fed it. A per-query assertion proves the recomputed binary equals production for all eighteen queries, so the swept statistic is faithful. From the captured Z-scores it derives the per-group distribution, the should-good false-positive rate and should-gap detection rate at 1.3, and a sweep of the threshold from 0.5 to 3.0 scoring separation as should-good-correct plus should-gap-correct over total, all written to `results/metrics.json`. Hand-entering the Z-scores was considered and rejected: a sweep is only meaningful if the swept statistic is the one that ships, so the harness recomputes from the production detector under a faithfulness assertion rather than transcribing values.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One small script over an unchanged detector surface. The harness owns all logic, opening a read-only corpus backup, running the production pipeline per query, recomputing the Z-score under a faithfulness assertion and sweeping the threshold. Nothing in the production pipeline, the detector statistic or the threshold default is touched, so the harness is additive and self-contained in the phase folder.

### Key Components
- **`gap-threshold-calibration-benchmark.mjs`**: the whole harness. It loads the read-only backup, defines the eighteen labeled queries across the three groups, runs the production `executePipeline` once per query, reads the production `evidenceGapDetected` from Stage-4 metadata and recomputes the continuous Z-score via the production `detectEvidenceGap` over the captured score array.
- **The metric block**: from the captured Z-scores and binaries it asserts the recomputed binary equals production for all eighteen queries, derives the per-group Z-score distribution, the should-good false-positive rate and should-gap detection rate at 1.3, and sweeps the threshold from 0.5 to 3.0 scoring separation, then writes the per-query rows and the rollup to `results/metrics.json`.

### Data Flow
The harness reads the corpus backup and runs the production `executePipeline` once per labeled query. For each query it captures the Stage-4 score array, the production `evidenceGapDetected` binary and the recomputed continuous Z-score, then asserts the two binaries agree. From the eighteen Z-scores it computes the per-group distribution, the calibration rates at 1.3 and the threshold sweep. It writes one `results/metrics.json`. The results and verdict docs are authored from that one file, so every reported number has a single source.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

This phase is an additive read-only benchmark, not a fix. It touches no shared surface, it adds one eval-only script and result data inside the phase folder and reads a corpus backup through `executePipeline` without writing it. The table is retained for template conformance and records that no production surface changes.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `executePipeline` Stage 4 | The pipeline whose detector metadata is read | no change, called as-is | grep shows no edit under the pipeline or the detector modules |
| `detectEvidenceGap` statistic | The detector whose calibration is measured | no change, recomputed over the captured score array | the detector file is untouched, the harness imports and calls it |
| evidence-gap threshold default (1.3) | The threshold whose calibration is decided | no change, read as-is and swept only in the harness | the threshold default file is untouched, the sweep is a local recomputation |
| memory corpus | The corpus the queries read | read-only backup, no write, no reindex | the harness opens a backup and issues no write |
| phase `scripts/` and `results/` | New benchmark harness and data | create, self-contained in the phase folder | the working-tree diff stays confined to the phase folder |

Required inventories:
- Same-class producers: `rg -n 'executePipeline' .opencode/specs/system-speckit/028-memory-search-intelligence/003-spec-data-quality/006-generated-metadata-build/043-gap-threshold-calibration-benchmark/scripts`.
- Consumers of changed symbols: none, the harness exports nothing and no shared code imports it.
- Matrix axes: eighteen queries across the should-good, should-gap and boundary groups, one pipeline run per query with the Z-score swept across 0.5 to 3.0.
- Algorithm invariant: the recomputed binary equals the production `evidenceGapDetected` for every one of the eighteen queries, the Z-score is recomputed from the production detector over the captured array, and every rate and separation is computed not hand-entered.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Take a read-only backup of the live corpus, no reindex
- [x] Define the eighteen labeled queries across the should-good, should-gap and boundary groups in the harness
- [x] Confirm the active embedder and the production `detectEvidenceGap` direction at `evidence-gap-detector.ts:206` before the run

### Phase 2: Core Implementation
- [x] Build the harness to run the production `executePipeline` once per query and capture the Stage-4 score array and `evidenceGapDetected` binary
- [x] Recompute the continuous Z-score via the production `detectEvidenceGap` and assert the recomputed binary equals production for all eighteen queries
- [x] Compute the per-group Z-score distribution, the should-good false-positive rate and should-gap detection rate at 1.3, and sweep the threshold from 0.5 to 3.0, writing `results/metrics.json`
- [x] Run the harness over all eighteen labeled queries

### Phase 3: Verification
- [x] Confirm the 18 of 18 faithfulness assertion holds and metrics.json carries a Z-score and binary per query
- [x] Confirm no threshold across 0.5 to 3.0 reaches good separation and record the optimal threshold and its separation
- [x] Author the results tables and the calibration verdict grounded strictly in metrics.json
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The metric block computes the per-group distribution, the calibration rates and the separation correctly from a known set of Z-scores | direct harness invocation on a single group |
| Integration | The harness runs the pipeline per query, recomputes the Z-score under the faithfulness assertion and writes metrics.json | a full harness run over the eighteen queries |
| Manual | Spot-check that the should-gap median Z sits above the should-good median, the inverted-distribution signal | reading the parsed metrics for those groups |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The production `executePipeline` Stage-4 surface | Internal | Green | The benchmark reads the detector metadata from this surface |
| The production `detectEvidenceGap` statistic | Internal | Green | The harness cannot recompute a faithful Z-score without it |
| The active embedder | Internal | Green | The pipeline cannot embed the labeled queries without it |
| The read-only corpus backup | Internal | Green | The labeled queries cannot exercise the detector without a real corpus to score against |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The harness or its outputs prove unsound, or the phase is abandoned.
- **Procedure**: Remove the phase folder. The benchmark adds only one eval-only script and result data and touches no shared code, detector or threshold default, so nothing else needs a revert.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Core Implementation | Med | 2-3 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **4-6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Read-only backup confirmed, no reindex and no write against the live corpus
- [x] Detector statistic and threshold default read as-is, neither file touched
- [x] The production `detectEvidenceGap` direction confirmed at `evidence-gap-detector.ts:206` before the run

### Rollback Procedure
1. Stop the harness if it is still running
2. Remove the phase folder including the script and results
3. Confirm no shared pipeline code, no detector statistic, no threshold default and no memory record was touched, since the run was read-only

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the change adds one eval-only script and result files and reads a corpus backup without writing it
<!-- /ANCHOR:enhanced-rollback -->

---
