---
title: "Implementation Plan: C5 LLM-as-judge quality scorer [template:level_2/plan.md]"
description: "Compute a real LLM-as-judge semantic quality score on the write path, persist it into the existing quality_score column, route it into the already-shipped qualityScore multiplier behind a default-off flag, and prove its marginal value over the form-only scorer before any promotion."
trigger_phrases:
  - "llm judge quality scorer"
  - "c5 quality score multiplier"
  - "semantic quality score fusion"
  - "qualityscore better input"
  - "llm as judge memory quality"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/003-retrieval-gated-tuning/018-llm-judge-scorer"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase plan for C5 llm-judge scorer scaffold"
    next_safe_action: "Hold for implementation, no code change has landed yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: C5 LLM-as-judge quality scorer

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript write path and fusion stage, Node eval harness |
| **Framework** | spec-kit search pipeline (`stage2-fusion.ts`), the index schema (`vector-index-schema.ts`), and the v2 eval runner |
| **Storage** | The existing `quality_score` column on the vector row, no new column and no second quality DB |
| **Testing** | A scorer unit test, a flag-off byte-identity check on the fusion path, and a form-only-versus-judge comparison run on a corpus sample |

### Overview
This phase feeds a real LLM-as-judge semantic quality score into the already-shipped `qualityScore` multiplier so a better input improves an existing band rather than opening a new lane. A judge scorer computes a normalized `[0,1]` score on the write path, persists it into the existing `quality_score` column at `vector-index-schema.ts:643`, and the fusion consumer reads it only behind a default-off flag while the form-only score stays the default input. A form-only-versus-judge comparison harness measures the judge's marginal value over the form-only scorer before any promotion, and the governance half ships on cost with zero retrieval risk.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A write-path judge scorer that persists into an existing column plus a flag-gated input swap folded into the existing fusion seam plus a comparison mode in the existing eval harness. No new column, no parallel scorer, no widened band, and no new abstraction.

### Key Components
- **The judge scorer module**: computes a normalized `[0,1]` semantic quality score for a document on the write path and writes the existing `quality_score` column. The exact host module is resolved in setup against the live save and indexing path that populates the column.
- **`vector-index-schema.ts:643`**: the shipped `quality_score` column the judge writes, reused verbatim with no new column.
- **`stage2-fusion.ts:272-288`**: the `applyValidationSignalScoring` consumer that reads `metadata.qualityScore`, clamps it, and maps it to `qualityFactor = 0.9 + (quality * 0.2)`, host of the flag-gated input swap that leaves the band and the `0.5` form-only default unchanged when the flag is off.
- **The form-versus-judge comparison harness**: scores a corpus sample with both the form-only scorer and the judge and reports agreement and divergence. The host directory is resolved in setup against the existing eval harness layout.
- **The consumer flag**: the default-off rail so the fusion path keeps reading the form-only score until the judge input is proven and explicitly enabled.

### Data Flow
On the write path the judge scorer reads a document, computes a normalized `[0,1]` score, clamps it, and persists it into the existing `quality_score` column, falling back to the form-only score when the judge call fails or times out and skipping a re-score when the `content_hash` is unchanged. On the read path the fusion consumer reads `metadata.qualityScore` and applies the existing `0.9 + (quality * 0.2)` band, reading the judge value only when the consumer flag is on and the form-only value by default. The comparison harness scores the same corpus sample both ways and emits per-document scores plus an agreement and divergence readout.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| The write or index path that populates `quality_score` | Sets the form-only quality score on the row today | add a judge scorer that computes a normalized `[0,1]` score and writes the same column, never the body | a write-path read confirms the judge value lands in the existing column, a diff of an authored doc before and after scoring shows zero body change |
| `stage2-fusion.ts:272-288` `applyValidationSignalScoring` | Reads `metadata.qualityScore`, clamps it, maps it to `0.9 + (quality * 0.2)`, defaults to `0.5` when absent | route the input behind a default-off flag, read the judge value only when on, leave the band and the `0.5` default unchanged when off | grep shows the flag default off, a flag-off fusion run is byte-identical to baseline including the `0.5` fallback and the `[0.9, 1.1]` band |
| `vector-index-schema.ts:643` `quality_score` column | The shipped quality column and multiplier input | reuse verbatim, no new column and no second quality DB | a schema read confirms no migration and no parallel column |
| The form-versus-judge comparison | Not present today | add a harness that scores a corpus sample both ways and reports agreement and divergence | the harness emits per-document form-only and judge scores plus an agreement and divergence readout |
| The sweep and doctor quality reports | Surface quality signals today | surface the semantic judge score as a first-class signal even with the consumer flag off | the reports show the judge score while the prod retrieval path stays form-only |
| 015-prodmode-recall-gate | The prod-mode completeRecall@3 read | not a code change here, the promotion precondition | no task promotes the judge to the default fusion input ahead of a C2 prod@3 rise |

Required inventories:
- Same-class producers: `rg -n 'quality_score|qualityScore|qualityFactor|clampMultiplier' .opencode/skills/system-spec-kit/mcp_server/lib/search`.
- Consumers of changed symbols: `rg -n 'qualityScore|quality_score|applyValidationSignalScoring' .opencode/skills/system-spec-kit/mcp_server`.
- Matrix axes: flag off, flag on with a judge score present, flag on with no judge score, judge value out of range, judge call failure, unchanged `content_hash`.
- Algorithm invariant: with the flag off the fusion path is byte-identical, the judge value is clamped to `[0,1]` before persistence, the multiplier range stays fixed at `[0.9, 1.1]`, and the authored body is never mutated.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Resolve the live write or index module that populates `quality_score` so the judge hooks the existing column at `vector-index-schema.ts:643` with no new column
- [ ] Decide the consumer flag name and its default-off wiring next to the existing fusion config in `stage2-fusion.ts`
- [ ] Pick the judge model, prompt, and the rubric-to-`[0,1]` mapping so the score is comparable to the form-only metric in the same band
- [ ] Resolve whether the comparison harness reuses the existing eval corpus sample or stands a smaller scoring-only sample

### Phase 2: Core Implementation
- [ ] Add the judge scorer on the write path, computing a normalized `[0,1]` score, clamping it before persistence, and writing the existing `quality_score` column
- [ ] Make the scorer read and score only, never mutating the authored body, with a `content_hash` cache that skips an unchanged document and a form-only fallback when the judge call fails or times out
- [ ] Add the flag-gated input swap in `applyValidationSignalScoring` so `qualityScore` reads the judge value when on, leaving the `0.9 + (quality * 0.2)` band and the `0.5` form-only default unchanged when off
- [ ] Surface the judge score as a first-class quality signal in the sweep and doctor reports, independent of the consumer flag
- [ ] Add the form-only-versus-judge comparison harness that scores a corpus sample both ways and reports agreement and divergence

### Phase 3: Verification
- [ ] With the consumer flag off, prod-mode retrieval is byte-identical to baseline including the `0.5` form-only fallback
- [ ] A scorer unit test shows the judge value is clamped to `[0,1]`, the authored body is unchanged, and an unchanged `content_hash` is not re-scored
- [ ] The comparison harness emits per-document form-only and judge scores plus an agreement and divergence readout, the evidence a reviewer reads before any promotion
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The judge value is clamped to `[0,1]`, the body is never mutated, an unchanged `content_hash` is not re-scored, a judge failure falls back to the form-only score | direct scorer unit test |
| Integration | Flag-off prod path byte-identical to baseline, flag-on path reads the judge value through the existing band | the search pipeline through the eval runner |
| Manual | The form-only-versus-judge agreement and divergence readout on a corpus sample | the comparison harness |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 015-prodmode-recall-gate prod@3 read | Internal | Yellow | The judge cannot be promoted past default-off without a prod-mode completeRecall@3 rise through C2 |
| Shipped `quality_score` column at `vector-index-schema.ts:643` | Internal | Green | None, the column ships today and the judge writes it with no migration |
| The `stage2-fusion.ts:272-288` multiplier consumer | Internal | Green | None, the band and the `0.5` default are reused verbatim with only the input routed |
| A judge model and a rubric-to-`[0,1]` mapping | Internal | Yellow | An un-comparable judge score could not be read by the existing band, so the rubric mapping is resolved before any flip |
| On-corpus marginal-value evidence | Internal | Yellow | A judge that barely differs from the form-only scorer buys little inside the narrow band, so the comparison gates promotion |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The flag-on judge input regresses the prod-mode completeRecall@3 number, or the judge fails to beat the form-only scorer in the comparison, or the judge call cost or nondeterminism harms the write path.
- **Procedure**: Leave the consumer flag off, which restores the byte-identical baseline fusion path and the `0.5` form-only default, and keep computing and surfacing the judge score as a governance signal while the comparison is re-run.
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
| Setup | Low | 1-2 hours |
| Core Implementation | Med | 4-7 hours |
| Verification | Med | 2-4 hours |
| **Total** | | **7-13 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Consumer flag default verified off
- [ ] Form-only-versus-judge comparison readout staged
- [ ] The judge writes only the existing `quality_score` column with no migration

### Rollback Procedure
1. Set the consumer flag off to restore the byte-identical baseline fusion path and the `0.5` form-only default
2. Keep the judge score computed, persisted, and surfaced as a governance signal while the comparison is re-run
3. Re-measure the form-only-versus-judge agreement and divergence on the corpus sample
4. Re-attempt promotion only on a prod-mode completeRecall@3 rise through C2 backed by the comparison readout

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the judge writes the existing `quality_score` column and the fusion change routes an input only, no new column and no schema change
<!-- /ANCHOR:enhanced-rollback -->

---
