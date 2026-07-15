---
title: "Implementation Plan: Eval-Harness Extension - Three Corpus Metric Lanes + Per-Class Promotion Gate (028/001 impl phase)"
description: "Sequenced plan for the eval-harness spine (C9-1 single-pass emit, C9-2 three-way label tagging, C9-3 three corpus metrics, A8-1/A8-2/A8-5/A8-4 per-class promotion gate). Forced linear build order on the gate-zero reindex precondition, additive, reversible, no-benchmark-to-ship. Shared-infra deps and per-candidate gates documented."
trigger_phrases:
  - "eval harness extension plan"
  - "three corpus metric lanes plan"
  - "per class promotion gate plan"
  - "C9 single pass emit plan"
  - "A8 class parameterized gate plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-speckit-memory/026-eval-harness-extension"
    last_updated_at: "2026-07-04T17:51:00.031Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored sequenced plan for the eval-harness spine"
    next_safe_action: "Confirm gate-zero reindex (sibling 001) green, then start C9-1 emit"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-019-replan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Eval-Harness Extension, Three Corpus Metric Lanes + Per-Class Promotion Gate (028/001 impl phase)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js, CommonJS |
| **Framework** | Spec Kit Memory MCP (`.opencode/skills/system-spec-kit/mcp_server/`) |
| **Storage** | SQLite-backed memory index + 5-table eval DB (`eval-db.ts`) + shadow-cycle ledger (`lib/feedback/`) |
| **Testing** | `tsc`, package build, Vitest, `validate.sh --strict` |

### Overview

This phase extends the live retrieval eval harness (already ~75-85% built) with the three accuracy lanes it has never had, then generalizes the single promotion gate so it scores any candidate-class. The work is an *extension* of `eval_run_ablation`, not a greenfield build: the runner, the 110-query golden set, the 12-metric library, the baseline runner, the dashboard and the shadow-scoring gate all already exist. Every new lane is additive, the existing ranking ablation stays byte-identical when the new lanes are off.

The candidates follow a **forced linear build order** on a single precondition (the corpus reindex, gate-zero, owned by sibling `001-corpus-reindex-gate-zero`): C9-1 emits the diagnostic snapshot the runner already computes but throws away → C9-2 tags the golden labels three ways in one DB-join → C9-3 adds the three corpus-level metrics → A8 un-welds the promotion gate from `meanNdcgDelta` to a per-class panel and routes its labels through the golden set.

All seven candidates are **PENDING**, none shipped in Wave-0 (030 §14 ships an unrelated "C9" embedder-degrade candidate, not these C9-N metric lanes). Nothing here is benchmarked, the whole point of the harness is to make the rest measurable.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Gate-zero confirmed: sibling `001-corpus-reindex-gate-zero` reindex run + `assertEmbeddingCoverage` passes. Evidence: sibling phase status + `memory_health` coverage.
- [ ] Promotion-gate entrypoint symbol re-confirmed live (research-cited `evaluatePromotionGate`/`:547` drifted). Evidence: grep of `lib/feedback/shadow-scoring.ts`.
- [ ] Per-candidate seam read before edits. Evidence: candidate rows in `spec.md` §3/§14.
- [ ] Ranking-ablation baseline captured for the additivity byte-checks. Evidence: baseline run recorded in `implementation-summary.md`.

### Definition of Done
- [ ] Each candidate has a final status row in `spec.md` §14 (DONE with commit, or PENDING with its gate).
- [ ] Shipped candidates have focused tests + scoped commits. Existing 12 ranking metrics verified byte-identical when new lanes are off.
- [ ] The three corpus lanes (gate-verdict P/R/F1, ECE/Brier/bins, cold-rate/precision) compute and are unit-tested against fixtures.
- [ ] The promotion gate scores ≥2 candidate-classes off one spine. Ledger records class + metric-JSON.
- [ ] `validate.sh --strict` passes on this phase.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

An additive diagnostic-capture + corpus-metric layer hosted by the existing `eval_run_ablation` runner, plus a class-parameterization of the single promotion gate. No new runner, no second gate, one capture pass feeds three aggregation-layer metrics, and the existing gate spine gains a swappable per-class metric panel.

### Key Components
- **Ablation runner (host)**: `lib/eval/ablation-framework.ts`, `runAblation` (`:554`), per-query baseline loop (capture region `:590-606`), aggregation `buildAggregatedMetrics` (`:486`), alignment guard call site (`:580-586`). Today captures only `EvalResult[]` (`:112`).
- **Diagnostic-emit (C9-1)**: a parallel per-query capture of the gate verdict + per-result resolved confidence + tier/created_at, reusing `captureScoreSnapshot` (`pipeline/types.ts:411`), `resolveAbsoluteRelevance` (`:90`), `assessRequestQuality` (`confidence-scoring.ts:385`).
- **Label tagging (C9-2)**: a one-join derivation of citability / binary / tier label views. `GroundTruthEntry.tier?/createdAt?` already typed (`eval-metrics.ts:29-45`), reuses the `SELECT FROM memory_index` join already in the alignment path (`ablation-framework.ts:247`).
- **Corpus metrics (C9-3)**: three new fns in `eval-metrics.ts` attached at the aggregation layer, gate-verdict confusion + P/R/F1, ECE + Brier + reliability bins, cold-appearance-rate + cold-precision (cold EXTENDS the existing cold-start detection metric).
- **Promotion gate (A8)**: `lib/feedback/shadow-scoring.ts` (spine: `selectHoldoutQueries:243`, `PROMOTION_THRESHOLD_WEEKS:32`, `MIN_NDCG_IMPROVEMENT:43`, `meanNdcgDelta:68`, `is_improvement:93`), `rank-metrics.ts` (`compareRanks:223`, `ndcgDelta:274`), `shadow-evaluation-runtime.ts` (label source `adaptive_signal_events` empty-map at `:137,:160`). Generalize to a per-class panel + golden-set labels + flag lifecycle.

### Data Flow

`runAblation` runs each golden query against real `hybridSearchEnhanced` (today). C9-1 adds a parallel capture of the verdict/confidence/tier snapshot per query. C9-2's tagging step derives the three label views from graded relevance + a `memory_index` join. C9-3's three corpus metrics consume the snapshot + labels at `buildAggregatedMetrics` (corpus-level, not per-query). The promotion gate (A8) selects its 20% holdout, runs ≥2 cycles and scores the candidate on the panel matching its class (R ranking → nDCG, G gate/calibration → ECE/Brier/P/R/FP), reading held-out labels from the golden set, and a promote authorizes the flag-symbol graduation. Gate-zero (reindex + coverage guard) bounds the whole flow: no recall/calibration/cold number is trusted until coverage is whole.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/eval/ablation-framework.ts` (`runAblation:554`, capture `:590-606`) | Per-query baseline loop capturing only `EvalResult[]` | Add a parallel diagnostic snapshot capture (C9-1) | snapshot-emit test, ranking metrics byte-identical when off |
| `lib/eval/ablation-framework.ts` (`buildAggregatedMetrics:486`) | Aggregates ranking metrics corpus-level | Attach the three new corpus metrics (C9-3) here | corpus-metric aggregation test |
| `lib/eval/eval-metrics.ts` (`GroundTruthEntry:29-45`, cold-start fn) | 12 ranking metrics + half-built tier/createdAt typing | Add C9-2 label tagging + C9-3 metric fns, extend cold-start | label-view unit test, ECE/Brier fixture test |
| `lib/eval/data/` golden set + `ground-truth-data.ts` | Grades 1-3 positive-only, no tier rows | C9-2 derives tier/citability/binary views (data backfill, category-derived non-citable) | backfill-view test |
| `lib/feedback/shadow-scoring.ts` (`:32,43,68,93,243`) | One gate welded to `meanNdcgDelta` | Swap a per-class metric panel, generalize the ledger (class + metric-JSON) | ranking-class regression test, CLASS-G panel test |
| `lib/feedback/shadow-evaluation-runtime.ts` (`:137,160`) | Held-out labels from `adaptive_signal_events` (empty-map silent skip) | Route labels through the 110-query golden set (A8-5) | no-silent-cycle-skip test |
| `lib/feedback/rank-metrics.ts` (`compareRanks:223`) | Intersection rank-delta | Unchanged (A8-3 recall-union panel rescoped out) | n/a, refuted headline, not built |

Inventories are scoped to the harness + gate seams above. The gate-zero reindex (`memory_index_scan` / `memory_embedding_reconcile`) is owned by the sibling phase and consumed, not modified here.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm gate-zero green: sibling `001-corpus-reindex-gate-zero` reindex run + `assertEmbeddingCoverage` passes.
- [ ] Re-confirm the live promotion-gate entrypoint symbol (research-cited `:547` drifted), pin the surrounding confirmed constants.
- [ ] Capture the ranking-ablation baseline for additivity byte-checks.

### Phase 2: Core Implementation (forced linear order)
- [ ] C9-1: add the parallel per-query diagnostic snapshot (verdict + per-result confidence + tier/created_at) in `runAblation`.
- [ ] C9-2: derive citability / binary / tier label views in one DB-join (`memory_index` join), category-derived non-citable.
- [ ] C9-3: add the three corpus metrics at `buildAggregatedMetrics` (gate-verdict confusion + P/R/F1, ECE + Brier + bins, cold-rate + cold-precision).
- [ ] A8-1: keep the gate spine, swap a per-class metric panel for the hardcoded `meanNdcgDelta`, generalize the ledger (class + metric-JSON).
- [ ] A8-2: add the CLASS-G (ECE/Brier/P/R/FP) panel that unfreezes isotonic calibration.
- [ ] A8-5: route held-out labels through the golden set instead of `adaptive_signal_events`.
- [ ] A8-4: encode promote-on-evidence as the flag-symbol lifecycle (`isOptInEnabled`→`isFeatureEnabled`→rollback).

### Phase 3: Verification
- [ ] Run Memory MCP typecheck, build and touched-area Vitest suite.
- [ ] Verify the existing 12 ranking metrics byte-identical when the new lanes are off.
- [ ] Unit-test the three corpus metrics against fixtures (confusion, ECE/Brier reliability diagram, cold-rate).
- [ ] Test the gate scoring ≥2 classes off one spine, verify no silent cycle-skip after the label-source swap.
- [ ] Run `validate.sh --strict` on this phase.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Memory MCP TypeScript contracts | `npm run typecheck` |
| Build | Memory MCP package build | `npm run build` |
| Diagnostic emit | C9-1 per-query snapshot present, ranking metrics byte-identical when off | focused Vitest |
| Label views | C9-2 citability/binary/tier derivation, category-derived non-citable | focused Vitest |
| Corpus metrics | C9-3 confusion+P/R/F1, ECE+Brier+bins, cold-rate+precision | fixture Vitest |
| Promotion gate | A8-1 per-class panel, A8-2 CLASS-G, A8-5 golden-set labels, A8-4 lifecycle | focused Vitest |
| Packet docs | Level-3 structure, anchors, frontmatter | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Gate-zero corpus reindex + coverage guard | Internal (sibling 001) | Pending | Blocks every trustworthy recall/calibration/cold number |
| `eval_run_ablation` live runner + 110-query golden set | Internal | Built (~75-85%), flag-gated `SPECKIT_ABLATION=true` | Required host for all three lanes |
| `GroundTruthEntry.tier?/createdAt?` typing | Internal | Typed, golden data lacks values | C9-2 is a backfill against this |
| `captureScoreSnapshot`/`resolveAbsoluteRelevance`/`assessRequestQuality` | Internal | Live | Required for C9-1 capture |
| Shadow-scoring gate (`lib/feedback/`) | Internal | Live, welded to `meanNdcgDelta`, entrypoint symbol drifted | Required for A8, re-confirm symbol |
| Benefit micro-benchmark (the first measured delta) | Evidence | Not run | This harness IS what enables it, not a precondition to ship the harness |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A new lane regresses the existing ranking ablation, the gate generalization breaks ranking-class promotion or the label-source swap skips cycles.
- **Procedure**: Revert the candidate commit (each is independent + additive). The C9-1 emit and the C9-3 metrics are separable, the A8 gate panel is separable from the C9 lanes.
- **Data reversal**: No schema migration is introduced by the lanes (label tagging is a derived view). The gate ledger column addition (if taken) is additive and droppable, no data deletion.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Gate-zero confirm | Sibling reindex phase | Every trustworthy recall/calibration/cold number |
| C9-1 emit | Gate-zero + runner | C9-2, C9-3 |
| C9-2 tagging | C9-1 snapshot + golden data | C9-3 |
| C9-3 metrics | C9-1 + C9-2 | A8-2 CLASS-G panel |
| A8-1 gate | C9-3 metrics | A8-2, A8-4 |
| A8-2/A8-5/A8-4 | A8-1 spine | isotonic calibration graduation (Wave-2 consumer) |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Candidate | Complexity | Gate | Expected Outcome |
|-----------|------------|------|------------------|
| C9-1 | Medium | gate-zero | Build (additive capture) |
| C9-2 | Small | gate-zero + data-backfill | Build (label views) |
| C9-3 | Medium | gate-zero | Build (3 net-new metrics) |
| A8-1 | Medium | depends on C9-3 | Build (gate generalization) |
| A8-2 | Medium | depends on C9-3 ECE | Build (CLASS-G panel) |
| A8-5 | Medium | golden set | Build (label-source swap) |
| A8-4 | Small | A8-1 gate | Build (flag lifecycle) |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

| Candidate | Rollback |
|-----------|----------|
| C9-1 | Remove the parallel snapshot capture, runner reverts to `EvalResult[]`-only. |
| C9-2 | Remove the label-view derivation, golden set reverts to grades-only. |
| C9-3 | Remove the three corpus-metric fns, the 12 ranking metrics stand alone. |
| A8-1 | Revert the per-class panel, gate falls back to the `meanNdcgDelta` weld. |
| A8-2 | Remove the CLASS-G panel, isotonic stays frozen at opt-in (status quo). |
| A8-5 | Revert label routing to `adaptive_signal_events`. |
| A8-4 | Remove the flag-lifecycle encoding, promote stays a manual decision. |
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
gate-zero reindex + coverage guard (sibling 001-001)
  -> C9-1 single-pass diagnostic emit
     -> C9-2 three-way label tagging
        -> C9-3 three corpus metrics (confusion/P-R-F1, ECE/Brier/bins, cold-rate/precision)
           -> A8-1 class-parameterized promotion gate
              -> A8-2 CLASS-G (ECE/Brier) panel
              -> A8-5 golden-set label-source swap
              -> A8-4 promote-on-evidence flag lifecycle
                 -> (Wave-2 consumers: A2 isotonic, A3 lever A/B, A5 cold-tier)
  -> strict validation
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

The critical path is the forced linear C9 chain, not volume: C9-1 must emit the snapshot before C9-2 can tag against it, C9-2 before C9-3 can compute and C9-3 before A8 has a CLASS-G panel to gate on. Gate-zero (sibling reindex) bounds the whole path, every recall/calibration/cold number is untrustworthy until coverage is whole. A8-1 is the riskiest item (it touches the live promote path), the C9 lanes are additive and lower-risk. The Wave-2 consumers (A2/A3/A5) are explicitly out of this phase, this harness is their precondition, not their delivery.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Evidence |
|-----------|----------|
| M1 Gate-zero confirmed | Sibling reindex green + `assertEmbeddingCoverage` passes |
| M2 Snapshot emitted | C9-1 per-query diagnostic capture shipped + ranking metrics byte-identical |
| M3 Labels tagged | C9-2 citability/binary/tier views derived in one join |
| M4 Lanes live | C9-3 three corpus metrics compute + fixture-tested |
| M5 Gate generalized | A8-1/A8-2/A8-5/A8-4 promote ≥2 classes off one spine, `validate.sh --strict` passes |
<!-- /ANCHOR:milestones -->
