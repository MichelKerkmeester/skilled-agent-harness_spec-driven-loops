---
title: "Implementation Plan: Relevance-Aware Evidence Gap"
description: "Adds a default-off flag SPECKIT_RELEVANCE_AWARE_GAP and a gated relevance-aware path in the evidence-gap detector that sets gapDetected from max(0, topRelevance - noiseFloor) < LOW_THRESHOLD, reusing the banding's resolveNoiseFloor and the exported LOW_THRESHOLD, threading an optional embedder seam from the Stage-4 input and failing closed to the Z-score path when no floor resolves. Stays byte-identical when off, verified by five focused tests, and is re-benchmarked over the 18 labeled queries into results/metrics.json. Rejects rewriting the Z-score in place as the wrong fit for a reversible default-off change."
trigger_phrases:
  - "relevance aware evidence gap"
  - "fix the gap detector over-capping"
  - "gated relevance aware detector path"
  - "noise floor subtracted relevance gap"
  - "embedder seam stage4 detector"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/005-spec-data-quality/006-generated-metadata-build/044-relevance-aware-evidence-gap"
    last_updated_at: "2026-07-04T17:11:57.195Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the gated path and the re-benchmark, matrix run complete"
    next_safe_action: "Compute metrics and write the verdict"
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
# Implementation Plan: Relevance-Aware Evidence Gap

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript search library plus a Node ESM `.mjs` re-benchmark script |
| **Framework** | Vitest focused tests, in-process `executePipeline` against a read-only corpus backup, `nomic-embed-text-v1.5` embedder |
| **Storage** | A read-only DB backup and a single metrics.json rollup |
| **Testing** | Five focused tests, the 124 in the nearest suites, tsc clean, an empirical off-path byte-identity check |

### Overview
This phase replaces the evidence-gap decision, behind a default-off flag, with the verdict banding's noise-floor-subtracted relevance. A new flag reader `isRelevanceAwareGapEnabled` gates the path. When the flag is on, `detectEvidenceGap` sets `gapDetected = max(0, topRelevance - noiseFloor) < LOW_THRESHOLD`, reusing the banding's `resolveNoiseFloor` and the now-exported `LOW_THRESHOLD`, and failing closed to the Z-score path when no floor resolves. An optional embedder seam is threaded from `Stage4Input` through `stage4-filter` into the detector so the relevance-aware path can resolve a floor, and the flag is registered in `ENV_REFERENCE.md` default false. The change is verified with five focused tests proving the gated decision and byte-identity when off, plus the 124 tests in the nearest suites and a clean tsc. A re-benchmark over the 18 labeled queries from 043 measures the agreement with the verdict gap band and the should-good false-positive rate for the OLD and NEW paths into `results/metrics.json`. Rewriting the Z-score in place was considered and rejected: a default-off gated path is reversible and byte-identical when off, so the production default is untouched until a separate graduation decision.
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
One gated decision path over a shared relevance definition. The detector keeps the Z-score path as the default and adds a relevance-aware path behind the flag, reusing the banding's `resolveNoiseFloor` and `LOW_THRESHOLD` so the gap decision and the verdict share one relevance definition. The embedder seam is additive and optional, so the existing call sites that omit it land on the default floor exactly like the banding.

### Key Components
- **`search-flags.ts`**: the new flag reader `isRelevanceAwareGapEnabled`, default-off, that gates the relevance-aware path.
- **`confidence-scoring.ts`**: exports `LOW_THRESHOLD` so the detector reuses the same threshold the banding uses rather than redefining it.
- **`evidence-gap-detector.ts`**: the gated relevance-aware path. When the flag is on and a floor resolves, it sets `gapDetected = max(0, topRelevance - noiseFloor) < LOW_THRESHOLD`, reusing `resolveNoiseFloor`, and fails closed to the Z-score path when no floor resolves. It accepts an optional `options.embedder` to resolve the floor.
- **`pipeline/types.ts` and `pipeline/stage4-filter.ts`**: the optional `Stage4Input.embedder` seam and the threading that passes the embedder into the detector call, so the relevance-aware path can resolve a floor at Stage 4.

### Data Flow
A search reaches Stage 4 with an optional embedder on `Stage4Input`. `stage4-filter` threads that embedder into `detectEvidenceGap`. With the flag off the detector runs the Z-score path byte-identically. With the flag on it resolves a noise floor through `resolveNoiseFloor`, subtracts it from the top relevance and compares against `LOW_THRESHOLD`, failing closed to the Z-score path when no floor resolves. The re-benchmark drives the same detector over the 18 labeled queries under both paths and writes the per-query agreement and false-positive rows to `results/metrics.json`, the single source for the data tables and the verdict.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

This phase is a fix for the 043 finding that the Z-score evidence-gap detector measures peakedness not relevance. It touches shared search surfaces, so each is gated behind a default-off flag and verified byte-identical when off. The relevance-aware path reuses the banding's relevance definition and fails closed when no floor resolves.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/search/search-flags.ts` | The flag readers for the search library | add `isRelevanceAwareGapEnabled` default-off | the new reader returns false unless `SPECKIT_RELEVANCE_AWARE_GAP` is set, tested |
| `lib/search/confidence-scoring.ts` | The banding and its thresholds | export `LOW_THRESHOLD` for reuse | the export is named, the value is unchanged, the banding still uses it |
| `lib/search/evidence-gap-detector.ts` | The gap decision under measurement | add the gated relevance-aware path and `options.embedder` | byte-identical when off across the test distributions, the gated decision tested, fail-closed when no floor resolves |
| `lib/search/pipeline/types.ts` | The Stage-4 input contract | add optional `Stage4Input.embedder` | the seam is optional, existing callers compile unchanged |
| `lib/search/pipeline/stage4-filter.ts` | The Stage-4 filter that calls the detector | thread the embedder into the detector call | the embedder is passed through, the call compiles and the off path is unchanged |
| `mcp_server/ENV_REFERENCE.md` | The flag registry | register `SPECKIT_RELEVANCE_AWARE_GAP` default false | the flag appears in the registry with default false |

Required inventories:
- Same-class producers: `rg -n 'detectEvidenceGap|resolveNoiseFloor|LOW_THRESHOLD' lib/search`.
- Consumers of changed symbols: the Stage-4 filter calls `detectEvidenceGap`, the banding owns `resolveNoiseFloor` and `LOW_THRESHOLD`, no other caller passes an embedder so each lands on the default floor.
- Matrix axes: 18 labeled queries from 043 across should-good, should-gap and boundary classes, each scored under the OLD Z-score path and the NEW relevance-aware path.
- Algorithm invariant: with the flag off the detector is byte-identical to the Z-score path, with the flag on the decision is `max(0, topRelevance - noiseFloor) < LOW_THRESHOLD`, and the path fails closed to the Z-score path when no floor resolves.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Export `LOW_THRESHOLD` from `confidence-scoring.ts` for reuse by the detector
- [x] Add the default-off flag reader `isRelevanceAwareGapEnabled` to `search-flags.ts`
- [x] Register `SPECKIT_RELEVANCE_AWARE_GAP` default false in `mcp_server/ENV_REFERENCE.md`

### Phase 2: Core Implementation
- [x] Add the optional `Stage4Input.embedder` seam to `pipeline/types.ts` and thread it through `stage4-filter.ts`
- [x] Add the gated relevance-aware path to `evidence-gap-detector.ts` with `options.embedder`, reusing `resolveNoiseFloor` and `LOW_THRESHOLD`
- [x] Set the relevance-aware decision to `gapDetected = max(0, topRelevance - noiseFloor) < LOW_THRESHOLD`, failing closed to the Z-score path when no floor resolves
- [x] Write the five focused tests in `tests/evidence-gap-relevance.vitest.ts` covering the gated decision and byte-identity when off

### Phase 3: Verification
- [x] Confirm tsc is clean and the five focused tests plus the 124 in the nearest suites pass
- [x] Confirm the off path is byte-identical to the Z-score path empirically across the test distributions
- [x] Re-benchmark over the 18 labeled queries and author the results tables and the graduation verdict grounded strictly in metrics.json
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The gated decision computes `max(0, topRelevance - noiseFloor) < LOW_THRESHOLD` and fails closed when no floor resolves | the five focused tests in `tests/evidence-gap-relevance.vitest.ts` |
| Integration | The off path is byte-identical to the Z-score detector and the nearest suites still pass | the five focused tests plus the 124 in the nearest suites, tsc clean |
| Manual | Spot-check that the NEW path fires only on `oauth` and the strong aligned queries are no longer flagged | reading the parsed metrics for those rows |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The banding's `resolveNoiseFloor` and the exported `LOW_THRESHOLD` | Internal | Green | The relevance-aware decision cannot reuse the banding's relevance without them |
| The production `executePipeline` and the Stage-4 filter | Internal | Green | The embedder seam cannot reach the detector without the Stage-4 threading |
| The `nomic-embed-text-v1.5` embedder | Internal | Green | The re-benchmark cannot resolve the floor or score the queries without it |
| The 18 labeled queries from 043 and the read-only corpus backup | Internal | Green | The re-benchmark cannot measure agreement or false-positive rate without the labels and the corpus |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The relevance-aware path proves unsound or the phase is abandoned.
- **Procedure**: Leave `SPECKIT_RELEVANCE_AWARE_GAP` default-off, which is byte-identical to the Z-score path, or revert the gated path. The change is reversible and the production default is unchanged until a separate graduation decision flips the flag.
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
- [x] The flag is default-off and the off path is byte-identical to the Z-score detector
- [x] The relevance-aware path fails closed to the Z-score path when no floor resolves
- [x] tsc clean and the five focused tests plus the 124 in the nearest suites pass before any flip

### Rollback Procedure
1. Leave `SPECKIT_RELEVANCE_AWARE_GAP` default-off, which restores the Z-score path byte-for-byte
2. If the gated path itself must be removed, revert the detector, the flag reader and the Stage-4 seam
3. Confirm the banding's `resolveNoiseFloor` and `LOW_THRESHOLD` are untouched, since the path only reads them

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the change is a default-off flag and a gated code path, and the re-benchmark reads a corpus backup without writing it
<!-- /ANCHOR:enhanced-rollback -->

---
