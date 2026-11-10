---
title: "Implementation Plan: C2 Prod-Mode Recall Gate [template:level_2/plan.md]"
description: "Build a prod-window recall instrument from a multi-target gold set, a PROMOTION and REGRESSION wrapper that reads only the prod-lens completeRecall@3/@5/@8 columns plus an order-sensitive NDCG@K companion with a top1 guard, a stored baseline, reusing the export already present on the unchanged dual-mode harness and the shared eval-metrics functions."
trigger_phrases:
  - "prod mode recall gate"
  - "complete recall at 3"
  - "spec corpus golden"
  - "run spec recall gate"
  - "retrieval regression gate"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-spec-data-quality/003-retrieval-gated-tuning/015-prodmode-recall-gate"
    last_updated_at: "2026-07-04T17:11:50.789Z"
    last_updated_by: "markdown-agent"
    recent_action: "Round-2 remediation: replanned gate for @3/@5/@8 plus order-sensitive metric"
    next_safe_action: "Hold for implementation, no code change has landed yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/spec-corpus-golden.json"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-spec-recall-gate.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/spec-recall-baseline.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: C2 Prod-Mode Recall Gate

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
| **Language/Stack** | Node ESM `.mjs` eval scripts |
| **Framework** | spec-kit eval harness (`run-eval-v2.mjs` dual-mode lenses) |
| **Storage** | The existing copy-DB the harness already builds, plus a stored JSON baseline file |
| **Testing** | Scratch profile runs through the gate plus a degraded-profile regression proof |

### Overview
This phase builds a prod-window recall instrument around the dual-mode harness that already ships. It adds a multi-target `spec-corpus-golden.json`, a `run-spec-recall-gate.mjs` wrapper with a PROMOTION mode and a REGRESSION mode that read only the prod-lens completeRecall@3/@5/@8 columns plus an order-sensitive NDCG@K companion with a top1 guard, and a stored baseline file the gate compares against. The harness lenses stay unchanged and the gate consumes them through the export already present at `run-eval-v2.mjs:361`, plus the pure `computeNDCG` and `computeMRR` from the shared `dist/lib/eval/eval-metrics.js`, so a downstream Tier-C retrieval change can be promoted only on a measured prod-column rise that also holds ranking quality, and regressed when any of those reads falls. The @3/@5/@8 window lets the gate read the rank 4-8 band the 027 floor sweep and C1/C4 exist to move.
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
Gate wrapper over an unchanged measurement harness: two net-new data and script files reusing the export already present at `run-eval-v2.mjs:361` plus the shared eval-metrics functions. The gate reuses the prod lens, `meanCompleteRecallProfile` and the measurability classes, computes its order-sensitive companion from the pure `computeNDCG` and `computeMRR`, but owns copy-DB prep, ground-truth grouping and the retrieval loop itself (all unexported), so it is more than a thin wrapper. No ranking change and no new lens logic.

### Key Components
- **`spec-corpus-golden.json`**: multi-target gold set where every citable-class query carries a relevance set, so completeRecall has multiple targets to be incomplete about across @3/@5/@8. The `hard_negative` class is expected-NOT-citable and is excluded from the completeRecall gated pool.
- **`run-spec-recall-gate.mjs`**: the gate wrapper with a PROMOTION mode and a REGRESSION mode, reading only the prod-lens completeRecall@3/@5/@8 columns plus the order-sensitive NDCG@K with a top1 guard, run ceiling-aware, and emitting a real recall-verdict exit code.
- **`spec-recall-baseline.json`**: the stored prod-column baseline carrying completeRecall@3/@5/@8, NDCG@K and top1 per class and overall, with a per-class headline-K, a generated-at stamp and source DB path.
- **`run-eval-v2.mjs`**: the unchanged dual-mode harness. The gate reuses the prod lens and measurability classes through the export already present at line 361, with no harness change.
- **`dist/lib/eval/eval-metrics.js`**: the shared metric module the harness already imports. The gate reuses its pure `computeNDCG` and `computeMRR` to compute the order-sensitive companion over the prod-lens per-query results, with no edit.

### Data Flow
The harness exports the prod lens, `meanCompleteRecallProfile` and the measurability classes at line 361 but not its copy-DB prep, ground-truth grouping or retrieval loop. The gate imports the three exported symbols and the order-sensitive metrics from the shared eval-metrics module, then owns copy-DB prep, gold-set ingestion into a `relevancesByQuery` map and the retrieval loop, reads only the prod completeRecall@3/@5/@8 columns and computes NDCG@K and top1 over the same prod-lens per-query results, compares each to the stored baseline ceiling-aware, and returns a recall-verdict exit code distinct from the existing crash handler.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `run-eval-v2.mjs` lenses | Run the eval lens and the prod lens on one copy DB and report `evalVsProdDelta` at K of 3, 5, and 8 | no change, reuse the lenses verbatim through the existing export | grep shows the line-361 export unchanged and no edit to the lens bodies |
| `run-eval-v2.mjs` export surface | Already exports `buildSearchLenses`, `meanCompleteRecallProfile`, `diffProfiles`, `MEASURABILITY_CLASSES`, `COMPLETE_RECALL_KS` at line 361 | verify the existing export covers `buildSearchLenses`, `meanCompleteRecallProfile`, and `MEASURABILITY_CLASSES`, add no second export | the gate imports those three names and the harness gains no second `export {}` |
| `dist/lib/eval/eval-metrics.js` order-sensitive metrics | The harness imports this module as `evalMetrics`. It exports pure `computeNDCG` and `computeMRR` but `meanCompleteRecallProfile`/`formatProfile` surface only `completeRecallAt{k}` | reuse `computeNDCG` and `computeMRR` to compute the order-sensitive companion over the prod-lens per-query results, no edit | the gate imports the two pure functions and emits an NDCG@K and top1 profile alongside completeRecall |
| Gold-set ingestion path | Harness sources ground truth from `GROUND_TRUTH_QUERIES`/`GROUND_TRUTH_RELEVANCES` via `dist/lib/eval/ground-truth-data.js` and groups it with `groupGroundTruth`, with no external golden loader | define how `spec-corpus-golden.json` reaches the retrieval loop, either extend the harness ground-truth source or build a gate-side loader producing `relevancesByQuery` | the gate scores the multi-target gold set and no citable-class query is silently dropped |
| `spec-corpus-golden.json` | Single-target goldens that saturate | create a multi-target gold set, every citable-class query a relevance set of length 2 or more with a class tag, the `hard_negative` class excluded from the completeRecall pool | every `thematic_multi_target` and `causal_chain` query has a relevance set length of 2 or more, no `hard_negative` query carries fabricated targets |
| `run-spec-recall-gate.mjs` | Does not exist | create the PROMOTION and REGRESSION gate reading only the prod completeRecall@3/@5/@8 columns plus NDCG@K and top1, ceiling-aware | a flipped lens input fails the unit assertion, a degraded prod profile exits non-zero, a top1-degrading window-membership rise fails PROMOTION |
| `spec-recall-baseline.json` | Does not exist | create the stored prod-column baseline with provenance | the baseline JSON parses and carries `prodMode` completeRecall@3/@5/@8, NDCG@K and top1 fields, a per-class headline-K, a generated-at stamp and source DB path |
| `process.exitCode = 1` (line 357) | Crash handler in the harness | leave unchanged, the gate emits a separate recall-verdict code | the gate exit code is distinct from the line 357 crash code |

Required inventories:
- Same-class producers: `rg -n 'completeRecall|evalVsProdDelta|MEASURABILITY_CLASSES|computeNDCG|computeMRR' .opencode/skills/system-spec-kit/mcp_server`.
- Consumers of changed symbols: `rg -n 'buildSearchLenses|meanCompleteRecallProfile|MEASURABILITY_CLASSES' .opencode/skills/system-spec-kit`.
- Matrix axes: PROMOTION mode, REGRESSION mode, missing baseline, empty relevance set, eval-lens input refused, degraded prod profile, top1-degrading window-membership rise, a multi-target class at its K/N ceiling.
- Algorithm invariant: the verdict reads only the prod lens across @3/@5/@8 plus NDCG@K and top1, an empty citable-class relevance set is rejected at load while `hard_negative` is excluded from the pool, the gate runs ceiling-aware so a sub-1.0 K/N ceiling is not a regression, and the recall-verdict exit code is distinct from the crash code.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Verify the existing export at `run-eval-v2.mjs:361` covers `buildSearchLenses`, `meanCompleteRecallProfile`, and `MEASURABILITY_CLASSES`, with no harness change and no second `export {}`
- [ ] Verify the shared `dist/lib/eval/eval-metrics.js` exports the pure `computeNDCG` and `computeMRR` the gate will reuse for the order-sensitive companion
- [ ] Define the gold-set ingestion path, either extend the harness ground-truth source (`GROUND_TRUTH_QUERIES`/`GROUND_TRUTH_RELEVANCES`) or build a gate-side loader producing `relevancesByQuery`
- [ ] Enumerate the citable measurability classes the gold set must cover and confirm `hard_negative` is excluded from the completeRecall pool

### Phase 2: Core Implementation
- [ ] Author `spec-corpus-golden.json` with one relevance set per citable-class query and no single-target citable query, the `hard_negative` class excluded from the completeRecall pool
- [ ] Build `run-spec-recall-gate.mjs` reading only the prod completeRecall@3/@5/@8 columns plus the order-sensitive NDCG@K and a top1 guard, run ceiling-aware, with PROMOTION mode and REGRESSION mode and a recall-verdict exit code
- [ ] Write the first `spec-recall-baseline.json` from a non-saturating prod run, with per-class and overall completeRecall@3/@5/@8, NDCG@K and top1, a per-class headline-K plus a generated-at stamp and source DB path
- [ ] Refuse an eval-lens input and reject a gold set carrying an empty citable-class relevance set at load

### Phase 3: Verification
- [ ] A degraded scratch prod profile fails REGRESSION mode with the recall-verdict exit code, not the crash code
- [ ] A measured prod completeRecall@3/@5/@8 rise that holds NDCG@K and top1 passes PROMOTION mode, while an unchanged profile and a top1-degrading window-membership rise both fail
- [ ] A multi-target class at its K/N ceiling does not trip REGRESSION, proving ceiling-awareness
- [ ] The gold set has no single-target citable query and every citable query carries a class tag
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Verdict input is the prod profile across @3/@5/@8 plus NDCG@K and top1, a flipped lens input fails, an empty citable-class relevance set is rejected at load, a sub-1.0 K/N ceiling is not read as a regression | direct gate invocation |
| Integration | PROMOTION and REGRESSION modes over a scratch profile, a degraded profile and a top1-degrading window-membership rise on the copy DB | `run-spec-recall-gate.mjs` over the harness copy DB |
| Manual | Confirm the gold set is non-saturating for the citable classes and the first baseline reads from a non-saturating prod run | gold-set inspection plus the first baseline write |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `run-eval-v2.mjs` dual-mode harness and its lens contract | Internal | Green | The gate breaks if the lens contract changes |
| The exported `buildSearchLenses`, `meanCompleteRecallProfile`, and `MEASURABILITY_CLASSES` symbols (present at `run-eval-v2.mjs:361`) | Internal | Green | The export already ships, so the gate can reuse the lenses with no harness change |
| The pure `computeNDCG` and `computeMRR` in `dist/lib/eval/eval-metrics.js` | Internal | Green | Already exported and imported by the harness, so the gate computes the order-sensitive companion with no harness change |
| A non-saturating first prod run for the frozen baseline | Internal | Yellow | The baseline cannot freeze until a multi-target prod run measures clean |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The gate false-fires on a valid prod profile, or the lens export breaks the harness.
- **Procedure**: Remove the gate wrapper and the gold and baseline files. The harness needs no revert because the export was already present and reused, not added.
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
| Core Implementation | Med | 4-6 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **6-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] First non-saturating prod run captured before the baseline freezes
- [ ] Eval-lens input refusal proven by a unit assertion
- [ ] Degraded-profile regression proof staged

### Rollback Procedure
1. Remove the `run-spec-recall-gate.mjs` wrapper
2. Remove `spec-corpus-golden.json` and `spec-recall-baseline.json`
3. Confirm `run-eval-v2.mjs` is untouched because the line-361 export was reused, not added
4. Re-run the harness to confirm it returns to its shipped state

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the change adds eval-only data and script files and reuses the existing harness export
<!-- /ANCHOR:enhanced-rollback -->

---
