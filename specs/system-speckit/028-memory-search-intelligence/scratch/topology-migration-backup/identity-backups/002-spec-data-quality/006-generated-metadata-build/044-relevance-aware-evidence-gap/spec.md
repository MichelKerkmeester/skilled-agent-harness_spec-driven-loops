---
title: "Spec: Relevance-Aware Evidence Gap"
description: "Replaces the evidence-gap detector's Z-score peakedness check with the verdict banding's noise-floor-subtracted relevance, behind a default-off flag SPECKIT_RELEVANCE_AWARE_GAP. The 043 benchmark proved the Z-score measures peakedness not relevance and over-caps strong queries, so this fix gates a relevance-aware path that sets gapDetected from max(0, topRelevance - noiseFloor) < LOW_THRESHOLD, reusing resolveNoiseFloor and LOW_THRESHOLD, failing closed to the Z-score path when no floor resolves and staying byte-identical when off. A re-benchmark over the 18 labeled queries confirms the over-capping is gone and the gap signal aligns with the verdict."
trigger_phrases:
  - "relevance aware evidence gap"
  - "fix the gap detector over-capping"
  - "SPECKIT_RELEVANCE_AWARE_GAP flag"
  - "evidence gap aligns with verdict"
  - "noise floor subtracted relevance gap"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-spec-data-quality/006-generated-metadata-build/044-relevance-aware-evidence-gap"
    last_updated_at: "2026-07-04T17:11:57.195Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped the gated relevance-aware path and the re-benchmark, authored results and verdict"
    next_safe_action: "Phase complete, verdict lives in benchmark-results.md"
    blockers: []
    key_files:
      - "scripts/gap-relevance-rebenchmark.mjs"
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
# Spec: Relevance-Aware Evidence Gap

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-23 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 043 benchmark proved the Z-score evidence-gap detector measures peakedness, not relevance. A flat-but-strong distribution reads as a gap and a sharp-but-weak one slips through, so the detector over-caps strong queries and misses flat off-corpus ones. The detector and the verdict banding can disagree, which means the gap banner fires on queries the verdict rates `weak` or better. The over-capping is the symptom that started this thread, and its root cause is that the gap decision is wired to distributional peakedness rather than to the noise-floor-subtracted relevance the verdict banding already computes.

### Purpose
Replace the gap decision, behind a default-off flag, with the verdict banding's noise-floor-subtracted relevance, so the gap signal means what it says and fires exactly when the verdict reaches the `gap` band. Re-benchmark the change over the 18 labeled queries from 043 to confirm the over-capping is eliminated and the gap signal aligns with the verdict, and produce a graduation verdict for `SPECKIT_RELEVANCE_AWARE_GAP` grounded strictly in the measured agreement and false-positive numbers.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new default-off flag `SPECKIT_RELEVANCE_AWARE_GAP` and the gated relevance-aware path in the evidence-gap detector
- The relevance-aware decision `gapDetected = max(0, topRelevance - noiseFloor) < LOW_THRESHOLD`, reusing the banding's `resolveNoiseFloor` and `LOW_THRESHOLD` and failing closed to the Z-score path when no floor resolves
- An optional embedder seam threaded from the Stage-4 input through to the detector so the relevance-aware path can resolve a floor
- Five new focused tests and a re-benchmark over the 18 labeled queries with the results and verdict committed in the phase folder

### Out of Scope
- **CORRECTION (2026-07-01, drift audit remediation):** graduation to default-on was originally out of scope for this spec, but per `implementation-summary.md`'s verdict and `lib/search/search-flags.ts` (`isRelevanceAwareGapEnabled`, "Default: TRUE"), `SPECKIT_RELEVANCE_AWARE_GAP` was later graduated and now defaults to ON. That decision happened after this spec was authored and is no longer out of scope - it shipped.
- Any change to the verdict banding, the `resolveNoiseFloor` calculation or the `LOW_THRESHOLD` value, which are reused as-is
- The noise-floor calibration for off-corpus high-background queries, which is consistent with the verdict and is its own benchmark
- A reindex of the corpus. The re-benchmark reads a read-only backup as-is

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| lib/search/search-flags.ts | Modify | Add the default-off flag reader `isRelevanceAwareGapEnabled` |
| lib/search/confidence-scoring.ts | Modify | Export `LOW_THRESHOLD` for reuse by the detector |
| lib/search/evidence-gap-detector.ts | Modify | Add the gated relevance-aware path and the `options.embedder` seam |
| lib/search/pipeline/types.ts | Modify | Add the optional `Stage4Input.embedder` seam |
| lib/search/pipeline/stage4-filter.ts | Modify | Thread the embedder into the detector call |
| mcp_server/ENV_REFERENCE.md | Modify | Register `SPECKIT_RELEVANCE_AWARE_GAP` default false |
| tests/evidence-gap-relevance.vitest.ts | Create | Five focused tests for the gated path and byte-identity when off |
| scripts/gap-relevance-rebenchmark.mjs | Create | The re-benchmark harness over the 18 labeled queries |
| results/metrics.json | Create | The per-query and aggregate metric rollup |
| benchmark-results.md | Create | The full data tables and the graduation verdict |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The relevance-aware gap decision is gated behind `SPECKIT_RELEVANCE_AWARE_GAP`, default-off | with the flag off the detector is byte-identical to the Z-score path across the test distributions |
| REQ-002 | When the flag is on, the gap decision is `gapDetected = max(0, topRelevance - noiseFloor) < LOW_THRESHOLD` reusing `resolveNoiseFloor` and `LOW_THRESHOLD` | the gated path computes the subtracted relevance and compares it to `LOW_THRESHOLD`, failing closed to the Z-score path when no floor resolves |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The change is verified clean | tsc is clean and the five focused tests plus the 124 in the nearest suites pass |
| REQ-004 | The re-benchmark over the 18 labeled queries measures agreement with the verdict gap band and the should-good false-positive rate for both paths | metrics.json reports the OLD and NEW agreement and false-positive numbers and the per-query rows |
| REQ-005 | Every verdict claim traces to a measured number | benchmark-results.md and implementation-summary.md cite values present in metrics.json or proven by the test run |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A gated relevance-aware path that is byte-identical to the Z-score detector when the flag is off, proven empirically across the test distributions
- **SC-002**: A re-benchmark over the 18 labeled queries showing the should-good false-positive rate drops from 0.67 to 0.00 and the agreement with the verdict gap band rises from 0.61 to 1.00
- **SC-003**: A graduation verdict for `SPECKIT_RELEVANCE_AWARE_GAP`, grounded strictly in the measured agreement and false-positive numbers, stating whether the flag is ready to become the default
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The relevance-aware path changes behavior for an existing consumer | A surprise regression when the flag is on | The path is gated default-off and is byte-identical when off, so no consumer sees a change until the flag is flipped |
| Risk | No noise floor resolves at the detector, leaving the gap decision undefined | A relevance-aware path that cannot decide | The path fails closed to the Z-score path when no floor resolves, so the detector always returns a decision |
| Dependency | The banding's `resolveNoiseFloor` and the exported `LOW_THRESHOLD` | The relevance-aware decision cannot reuse the banding's relevance without them | `confidence-scoring.ts` exports `LOW_THRESHOLD` and the detector imports `resolveNoiseFloor`, so the gap decision and the banding share one relevance definition |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The relevance-aware path reuses the banding's already-computed `resolveNoiseFloor` and `LOW_THRESHOLD`, so the gated decision adds a subtraction and a comparison rather than a second scoring pass
- **NFR-P02**: The embedder seam is optional, so the orchestrator that leaves it undefined lands on the default floor exactly like the banding without paying a per-call embed cost

### Security
- **NFR-S01**: The flag is default-off and read through `isRelevanceAwareGapEnabled`, so no consumer sees the relevance-aware path until the flag is explicitly flipped
- **NFR-S02**: The re-benchmark reads a read-only corpus backup and issues no write, so no benchmark cell mutates the live memory database

### Reliability
- **NFR-R01**: The relevance-aware path fails closed to the Z-score path when no floor resolves, so the detector never returns an undefined decision
- **NFR-R02**: The off path is byte-identical to the Z-score detector, proven across the test distributions, so the default behavior is unchanged
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- No floor resolves: the embedder seam is undefined and no default floor applies, so the relevance-aware path falls back to the Z-score decision rather than guessing
- A strong aligned query: a high `rawTop` well above the floor subtracts to a relevance above `LOW_THRESHOLD`, so the relevance-aware path does not flag it as a gap, where the Z-score over-capped it
- The one true gap (`oauth`): a low `rawTop` near the floor subtracts below `LOW_THRESHOLD`, so the relevance-aware path fires exactly where the verdict rates `gap`

### Error Scenarios
- A flat-but-strong distribution: the Z-score reads peakedness and flags a gap, while the relevance-aware path reads the subtracted relevance and does not, the over-capping case the fix removes
- An off-corpus high-background query (`kafka`, `terraform`): the floor 0.15 does not fully counter the embedder background, so the subtracted relevance reads `weak` not `gap`, consistent with the verdict and left to a separate noise-floor calibration

### State Transitions
- Flag off to on: the same query returns the byte-identical Z-score decision with the flag off and the relevance-aware decision with it on, so the transition is the only behavior change
- Floor present to absent: when a floor resolves the relevance-aware path decides, when none resolves it fails closed to the Z-score path, so the detector degrades gracefully rather than erroring
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 11/25 | Seven production files plus a new test file and the re-benchmark, one gated decision path |
| Risk | 7/25 | Default-off flag, byte-identical when off, fail-closed fallback, the only risk is the flag flip itself |
| Research | 17/20 | A re-benchmark over 18 labeled queries with per-query agreement and false-positive analysis against the verdict |
| **Total** | **35/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Whether the noise-floor 0.15 should be recalibrated so off-corpus high-background queries (`kafka`, `terraform`) read as true gaps, a question that affects the verdict banding identically and is its own benchmark
- Whether the graduation of `SPECKIT_RELEVANCE_AWARE_GAP` to default-on should ride with the next banding change or land as its own flag flip, since the benchmark recommends graduation but does not enact it
<!-- /ANCHOR:questions -->
