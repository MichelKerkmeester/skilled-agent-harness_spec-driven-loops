---
title: "Feature Specification: Eval-Harness Extension - Three Corpus Metric Lanes + Per-Class Promotion Gate (028/001 impl phase)"
description: "Extend the ~80%-built retrieval eval harness with three corpus-level accuracy lanes (gate-verdict P/R/F1, ECE+Brier+reliability bins, cold-appearance-rate/precision) and un-weld the single promotion gate from the hardcoded meanNdcgDelta to a per-class metric panel. C9-1/C9-2/C9-3 are implemented as code + deterministic tests. A8 remains pending because the ledger/gate pieces require schema/live operational validation."
trigger_phrases:
  - "eval harness extension"
  - "three corpus metric lanes"
  - "gate verdict confusion ECE Brier"
  - "per class promotion gate"
  - "un-weld meanNdcgDelta promotion gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/001-speckit-memory/019-eval-harness-extension"
    last_updated_at: "2026-07-04T17:51:00.031Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented C9 eval-harness metric lanes as code + deterministic tests"
    next_safe_action: "Plan the A8 ledger/gate schema and live gate-validation step separately"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "../research/retrieval-evaluation/research.md"
      - "../../research/synthesis/08-retrieval-evaluation-findings.md"
      - "../../research/roadmap.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-019-replan"
      parent_session_id: null
    completion_pct: 43
    open_questions:
      - "Exact ECE bin count / Brier formulation for the CLASS-G panel?"
      - "Does the generalized ledger add candidate_class+metric-JSON columns, or a sibling table?"
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: Eval-Harness Extension, Three Corpus Metric Lanes + Per-Class Promotion Gate (028/001 impl phase)

## EXECUTIVE SUMMARY

This implementation phase extends the Spec-Kit Memory MCP's **already ~80%-built retrieval eval harness** with the three accuracy lanes it has never had, and scopes the promotion-gate generalization that must follow. It covers the keystone build spine the 028 retrieval-evaluation campaign converged on (`synthesis/08`): **C9-1** (capture the verdict/confidence/tier the ablation runner already computes but throws away), **C9-2** (tag the golden labels three ways in one DB-join), **C9-3** (the three new corpus-level metric lanes: gate-verdict P/R/F1, ECE+Brier+reliability bins, cold-appearance-rate/precision) and **A8-1(+A8-2/A8-5/A8-4)** (swap a per-class metric panel for the hardcoded `meanNdcgDelta`, add the CLASS-G panel, route held-out labels through the golden set, encode promote-on-evidence as the flag lifecycle). C9-1/C9-2/C9-3 are now implemented as code plus deterministic unit tests. A8 remains **PENDING** because the ledger/gate acceptance criteria require a schema change and live operational validation. The corpus reindex (gate-zero, owned by sibling phase `001-corpus-reindex-gate-zero`) remains the hard precondition for every trusted recall/calibration/cold number this harness produces.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | complete (partial scope, C9 implemented, A8 pending, see §14) |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/028-xce-research-based-refinement` |
| **Parent Packet** | system-speckit/029-memory-search-intelligence/001-speckit-memory |
| **Candidate** | `eval-harness-spine` (C9-1 / C9-2 / C9-3 + A8-1/A8-2/A8-5/A8-4) |
| **Source research** | `../research/retrieval-evaluation/research.md` (+ `iterations/iteration-{001,008,009,011,012}.md`) |
| **Source synthesis** | `../../research/synthesis/08-retrieval-evaluation-findings.md` (Wave-1 spine) |
| **Source roadmap** | `../../research/roadmap.md` (BROADENING + 027-REVISIT + MEMORY-SYSTEMS addenda, authoritative) |
| **Gate-zero precondition** | `../001-corpus-reindex-gate-zero/` (sibling, reindex + C9-4 coverage guard) |
| **Wave-0 shipped record** | Wave-0 record (none of these, its "C9" is the embedder-degrade candidate) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The Memory MCP ships a live retrieval eval harness that is **already ~75-85% built** [CONFIRMED: iter-011 "extend-not-greenfield … honest figure ≈ 75-85%"]: a **110-query graded golden set** (290 relevance judgments, grades 1-3, 93 real production memory IDs, 0 placeholders), a **12-metric library** (`computeAllMetrics`, `eval-metrics.ts:586`, MRR/nDCG/recall/precision/F1/MAP/hitRate + 5 diagnostics), a **live end-to-end runner** `eval_run_ablation` driving real `hybridSearchEnhanced` against the golden set with per-channel recall deltas + paired sign-test p-values, a baseline runner, a dashboard, an alignment guard, a 5-table eval DB and traffic-feedback scaffolding [CONFIRMED: iter-001, iter-011. Live: `runAblation` `ablation-framework.ts:554`, `assertGroundTruthAlignment` `:314`].

But **every existing metric measures *ranking***, there is **no verdict-accuracy metric and no calibration metric anywhere** (`ECE`/`Brier` grep-clean) [CONFIRMED: iter-009, iter-011 verdict 5: "Verdict-accuracy + calibration are genuinely greenfield"]. The harness cannot answer "did 015's gate fix hold?", "is candidate X better on the gate verdict?" or "is the confidence score reliable?". Two structural causes:

1. **The runner throws away what it already computes.** `runAblation`'s per-query baseline loop captures only `EvalResult[]` (`{memoryId,score,rank}`, `ablation-framework.ts:594-606` region, type at `:112`), never the `requestQuality` gate verdict, the per-result resolved confidence or each row's tier, even though the pipeline already computed all of them via `assessRequestQuality` (`confidence-scoring.ts:385`), `resolveAbsoluteRelevance` (`pipeline/types.ts:90`) and `captureScoreSnapshot` (`pipeline/types.ts:411`) [CONFIRMED: iter-009 C9-1].

2. **There is exactly ONE promotion gate, welded to ONE candidate-class.** The shadow-scoring gate's `is_improvement` hardcodes `meanNdcgDelta >= MIN_NDCG_IMPROVEMENT` (`lib/feedback/shadow-scoring.ts:43,68,93`). Its held-out labels come from `adaptive_signal_events`, which returns an empty map when signals cancel → silently skips cycles (`lib/feedback/shadow-evaluation-runtime.ts:137,160`) [CONFIRMED: iter-008 A8]. The isotonic confidence-calibration flag is therefore **frozen at opt-in precisely because no CLASS-G (ECE/Brier) gate exists to manufacture its promote evidence**, the missing piece is the gate, not a new flag [CONFIRMED: iter-008 key finding. Iter-009 "C9-3's ECE *is* the gate that graduates isotonic"].

### Purpose

Build the **one harness extension** the campaign converged on: a single-pass diagnostic emit (C9-1) that feeds a one-join three-way label tagging (C9-2) that feeds three corpus-level metric lanes (C9-3), then un-weld the existing promotion gate so it scores any candidate-class on its own metric panel (A8). The deliverable is an *extension* of the live runner, not a greenfield build, the three lanes are genuinely net-new *metrics* hosted by the existing runner [CONFIRMED: iter-011 net effect]. The payoff is that the entire intelligence-class roadmap (A2 isotonic, A3 lever A/B, A5 cold-tier) becomes measurable and promotable-on-evidence. This phase is their precondition, not their delivery.

### Critical context (from the 028 retrieval-evaluation campaign + roadmap, authoritative)

- **Reindex is gate-zero.** The entire recall/calibration/cold column is un-measurable until the deferred corpus reindex runs. The sibling phase `001-corpus-reindex-gate-zero` runs it and wires the C9-4 embedding-coverage guard that makes the precondition machine-enforced [CONFIRMED: synthesis/08 "Honest caveats". Sibling 001 spec].
- **No candidate has a measured before/after benefit number**, every leverage/effort tag is structural inference, never benchmarked. The *point* of this harness is to make the rest measurable. Nothing here is itself measured yet [CONFIRMED: synthesis/08 "Honest caveats". Roadmap §BROADENING-6].
- **The three lanes are ONE extension with a forced linear build order**, not three independent metrics: `C9-4 (gate-zero, sibling) → C9-1 emit → C9-2 tag → C9-3 metrics` [CONFIRMED: iter-009 key finding].
- **C9-2 is a data backfill, not new plumbing**, `GroundTruthEntry` already *types* `tier?`/`createdAt?` (`eval-metrics.ts:29-45`), but the golden *data* (`GroundTruthRelevance`) carries only queryId/memoryId/relevance, and relevances are grades 1-3 positive-only (no grade-0/hard-negative rows). The citability label must derive "expect non-citable" from the `hard_negative` *category*, not a grade-0 row [CONFIRMED: iter-011 verdicts 2,3].
- **The three corpus metrics attach at the aggregation layer** (`buildAggregatedMetrics`, `ablation-framework.ts:486`), not per-query, a confusion matrix / reliability diagram is corpus-level [CONFIRMED: iter-009 C9-3].
- **A8's "structural blindness to recall additions" was REFUTED/RESCOPED**, `ndcgDelta` *is* sensitive to judged-recall additions. The gate is blind only for per-result deltas and for *unlabeled* added items (a qrels-coverage problem). The A8-3 recall panel survives as a low-priority coverage instrument, not a load-bearing claim [CONFIRMED: synthesis/08 DROP/RESCOPED. Iter-010].
- **Promote-on-evidence = the flag-symbol lifecycle** (`isOptInEnabled` default-OFF → `isFeatureEnabled` on ≥2 clean cycles → rollback on regression), encode it, do not invent a new flag mechanism [CONFIRMED: iter-008 A8-4].
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope, the eval-harness spine (all PENDING, status detailed in §14)

| # | Candidate | One-line change | Seam (file:line) | Lev | Eff | Class |
|---|-----------|-----------------|------------------|-----|-----|-------|
| 1 | **C9-1** single-pass diagnostic emit | Add a parallel per-query capture (gate verdict + per-result resolved confidence + each row's `importance_tier`/`created_at`) inside the existing `runAblation` baseline pass, where today it captures only `EvalResult[]` | `ablation-framework.ts:554` (`runAblation`), capture region `:590-606`, reuse `captureScoreSnapshot` `pipeline/types.ts:411`, `resolveAbsoluteRelevance` `:90`, `assessRequestQuality` `confidence-scoring.ts:385` | H | M | EXTENDS (root unblock) |
| 2 | **C9-2** three-way label tagging | One DB-join deriving 3 label views from graded relevance(0-3): citability (`max(rel)≥2 ⇒ expect cite`, `hard_negative` ⇒ expect non-citable), binary `relevance≥threshold ⇒ CalibrationSample.relevant`, tier-tag (JOIN `memory_index` for `importance_tier`+`created_at`) | `eval-metrics.ts:29-45` (`GroundTruthEntry.tier?/createdAt?`), reuse the `SELECT FROM memory_index` join already in `assertGroundTruthAlignment` (`ablation-framework.ts:247`) | H | S | EXTENDS (data backfill) |
| 3 | **C9-3** three corpus metric lanes | At the aggregation layer: (a) gate-verdict confusion (TP/FP/TN/FN + P/R/F1), (b) ECE + Brier + reliability bins over `{rawValue, binary label}`, (c) cold-appearance-rate + cold-precision over tier-tagged relevances | `buildAggregatedMetrics` `ablation-framework.ts:486`, new fns in `eval-metrics.ts`, cold EXTENDS `computeColdStartDetectionRate` (`eval-metrics.ts` cold fn) | H | M | NET-NEW metrics (the deliverable) |
| 4 | **A8-1** class-parameterized promotion gate | Keep the gate's spine (20% deterministic holdout, ≥2 non-regressing cycles, promote/wait/rollback, audit ledger), then swap a per-class metric panel for the hardcoded `meanNdcgDelta` | `lib/feedback/shadow-scoring.ts:43` (`MIN_NDCG_IMPROVEMENT`), `:68` (`meanNdcgDelta`), `:93` (`is_improvement`), `:243` (`selectHoldoutQueries`), `:32` (`PROMOTION_THRESHOLD_WEEKS`) | H | M | EXTENDS |
| 5 | **A8-2** CLASS-G (ECE/Brier) panel | Add the gate/calibration metric panel (ECE + Brier + precision/recall/FP-rate), the missing precondition keeping isotonic calibration frozen at opt-in | houses C9-3's CLASS-G metrics inside the gate, `lib/feedback/` gate consuming `eval-metrics.ts` outputs | H | M | NET-NEW (panel) |
| 6 | **A8-5** golden-set label-source swap | Route the gate's held-out labels through the 110-query graded golden set instead of `adaptive_signal_events` (which returns an empty map when signals cancel → silently skips cycles) | `lib/feedback/shadow-evaluation-runtime.ts:137,160` (`adaptive_signal_events` empty-map) | M | M | EXTENDS (bridge gate↔harness) |
| 7 | **A8-4** promote-on-evidence = flag lifecycle | Encode promote-on-evidence as the flag-symbol lifecycle: `isOptInEnabled` (default-OFF) → `isFeatureEnabled` on ≥2 clean cycles → rollback on regression, the one loop unifying the 3 bespoke shadow mechanisms | flag-symbol lifecycle consumers, `search-flags.ts` (stranded shadow combiner at `:517` per research) | M | S | EXTENDS (027 doctrine) |

### Sequencing dependency (in scope to reference, owned elsewhere)

- **C9-4 / corpus reindex (gate-zero)**, owned by sibling `001-corpus-reindex-gate-zero`. The harness MUST NOT trust any recall/calibration/cold number until the reindex has run and `assertEmbeddingCoverage` passes (`ablation-framework.ts:580-586`). This phase consumes that precondition, it does not re-run the reindex.

### Out of Scope (documented, NOT built this phase)

- **The corpus reindex + C9-4 coverage guard**, owned by sibling `001-corpus-reindex-gate-zero` (gate-zero), consumed here, not delivered.
- **A2 isotonic calibration graduation**, Wave-2 *consumer* of this harness's ECE lane + the CLASS-G gate, its own phase (it flips on evidence the C9-3 ECE metric produces).
- **A3 default-on lever A/B** (cosine-reorder S5, generic-query escalation S3, top-dominant verdict S2), Wave-2 consumer, needs the Wave-0 S5-evalMode harness fix first.
- **A5 cold-tier re-measurement**, Wave-2 consumer, runs once reindex clears and the cold lane (C9-3c) exists.
- **A8-3 recall-delta@k UNION panel**, RESCOPED to a low-priority coverage instrument (the "structural blindness" headline was refuted), not load-bearing for this phase.
- **Wave-0 correctness items** (A7-4 maintenance-grace TTL, A4 015-residual `resolveSearchScore`, divergence-magnitude telemetry, S5-evalMode fix, cosine-math dedup), ship in parallel with no harness dependency, their own phases.
- **The traffic-selection cite-path wiring** (`recordUserSelection` on `/memory:search`), adjacent label-bootstrap, not required to ship the three lanes against the static golden set.
- Modifying any external reference system under `external/`, or the Wave-0 record under the Wave-0 implementation record.

### Files to Change

Per-candidate seams above. Production code under `.opencode/skills/system-spec-kit/mcp_server/lib/eval/` (`ablation-framework.ts`, `eval-metrics.ts`) and `lib/feedback/` (`shadow-scoring.ts`, `shadow-evaluation-runtime.ts`, `rank-metrics.ts`), plus golden-set data tagging in `lib/eval/data/`. Tests alongside each change. No edits to the Wave-0 implementation record (Wave-0 record, read-only evidence) and no edits to the sibling gate-zero phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **R1 (C9-1):** `runAblation`'s baseline pass MUST capture, per query, the gate verdict, the per-result resolved confidence and each row's tier/created_at, in parallel with the existing `EvalResult[]`, reusing the existing `captureScoreSnapshot` / `resolveAbsoluteRelevance` / `assessRequestQuality` mechanisms, without changing the ranking metrics it already emits.
- **R2 (C9-2):** A single DB-join MUST derive the citability, binary-calibration and tier-tag label views from graded relevance. Citability MUST derive "expect non-citable" from the `hard_negative` *category* (no grade-0 rows exist). This is a data/label backfill, not new plumbing.
- **R3 (C9-3):** The aggregation layer MUST compute (a) a gate-verdict confusion matrix + P/R/F1, (b) ECE + Brier + reliability bins over `{rawValue, binary label}` and (c) cold-appearance-rate + cold-precision, all corpus-level, all reading C9-1's snapshot, none altering the existing 12 ranking metrics.
- **R4 (A8-1):** The promotion gate MUST keep its spine (20% deterministic holdout, ≥2 non-regressing cycles, promote/wait/rollback, audit ledger) and swap a per-class metric panel for the hardcoded `meanNdcgDelta`. The ledger MUST record `candidate_id` + `candidate_class` + a metric-JSON so it generalizes beyond ranking.
- **R5 (A8-2):** A CLASS-G panel (ECE + Brier + precision/recall/FP-rate) MUST exist so a calibration/gate candidate can produce a promote signal. This panel is what unfreezes isotonic calibration from opt-in.
- **R6 (A8-5):** The gate's held-out labels MUST route through the 110-query graded golden set, not `adaptive_signal_events` (which silently skips cycles when signals cancel).
- **R7 (A8-4):** Promote-on-evidence MUST be encoded as the existing flag-symbol lifecycle (`isOptInEnabled` → `isFeatureEnabled` on ≥2 clean cycles → rollback), reusing the 027 doctrine, not a new flag mechanism.
- **R8 (cross-cutting):** No recall/calibration/cold number is trusted until gate-zero (sibling reindex + coverage guard) is met. Every change is additive and independently reversible. The existing ranking ablation path stays byte-identical when the new lanes are not requested.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `runAblation` emits, per query, a diagnostic snapshot (verdict + per-result confidence + tier/created_at) alongside the unchanged `EvalResult[]`. The existing 12 ranking metrics are byte-identical to baseline when the new lanes are off.
- The golden set carries citability / binary / tier label views derived in one DB-join. Citability "expect non-citable" is sourced from the `hard_negative` category.
- The harness reports a gate-verdict confusion + P/R/F1, an ECE + Brier + reliability-bin set and cold-appearance-rate + cold-precision, none of which existed before (ECE/Brier were grep-clean).
- The promotion gate scores at least two candidate-classes (R ranking, G gate/calibration) on their own metric panels off one spine. The audit ledger records class + metric-JSON.
- The CLASS-G panel produces a promote signal sufficient to graduate isotonic calibration on evidence (the gate that was previously missing now exists).
- The gate's held-out labels come from the golden set, not the silently-empty `adaptive_signal_events`.
- Gate-zero (sibling reindex + `assertEmbeddingCoverage`) is confirmed green before any recall/calibration/cold number is reported.
- Memory MCP typecheck, build, focused tests and `validate.sh --strict` on this phase all pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk or Dependency | Impact | Handling |
|--------------------|--------|----------|
| Gate-zero reindex (sibling 001) not yet run | Every recall/calibration/cold number is untrustworthy (measures a cold index) | Hard-block: confirm sibling reindex green + `assertEmbeddingCoverage` passes before reporting any new-lane number |
| C9-2 golden data lacks tier/grade-0 rows | Tier-tag + citability labels cannot be read off existing relevance rows | Data backfill: JOIN `memory_index` for tier/created_at, derive non-citable from the `hard_negative` *category*, not a grade-0 row |
| ECE/Brier formulation choices (bin count, weighting) | Wrong bins skew the calibration verdict | Pin a documented bin scheme, cross-check ECE against a reliability diagram, open question recorded |
| Promotion-gate symbol drift since research | `evaluatePromotionGate`/`:547` did not grep at the cited line | Re-confirm the live gate entrypoint by symbol before editing. The surrounding constants (`MIN_NDCG_IMPROVEMENT:43`, `meanNdcgDelta:68`, `is_improvement:93`, `selectHoldoutQueries:243`) ARE confirmed at the cited file |
| A8-3 "structural blindness" was refuted | Building a load-bearing recall-union panel would chase a refuted claim | Keep A8-3 OUT of scope (low-priority coverage instrument only), build CLASS-R/CLASS-G panels |
| New lanes accidentally change the ranking ablation path | Existing 12 metrics regress | Additive capture only, byte-check the ranking metrics unchanged when new lanes are off |
| No measured benefit number for any candidate | Cannot promise a delta from the harness itself | Ship for measurability/correctness. The first benefit micro-benchmark is a separate follow-up that *uses* this harness |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- The existing ranking ablation path is byte-identical when the new diagnostic lanes are not requested (additive-only).
- No recall/calibration/cold number is emitted or trusted before gate-zero (reindex + coverage guard) is met.
- Every candidate hunk is independently reversible. The C9-1 emit and the C9-3 metrics are separable.
- The promotion gate keeps exactly one spine. Only the metric panel is per-class (no second gate).
- The new metrics are deterministic given a fixed corpus + golden set (corpus-level aggregation, no clock dependence).

## 8. EDGE CASES

- A golden query with no `hard_negative` companion still produces a citability label (citable expectation only).
- A query whose results are entirely un-embedded (pre-reindex) MUST be blocked by the gate-zero coverage guard, not silently scored.
- ECE over an empty bin contributes zero, not NaN. Reliability bins are stable when a bin is empty.
- The gate ledger for a CLASS-G candidate stores the ECE/Brier metric-JSON, not a coerced nDCG number.
- `adaptive_signal_events` returning an empty map MUST no longer silently skip a cycle once labels route through the golden set.
- A candidate that is neither ranking nor gate/calibration (unknown class) is refused by the gate with a typed error, not scored on the wrong panel.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Assessment |
|-----------|------------|
| Code surface | Medium, a per-query capture extension, a label-tagging join, three aggregation-layer metrics and a gate generalization across two files |
| Data migration | None (label backfill is a derived view/tagging step, not a schema migration), the gate ledger may add columns |
| Runtime risk | Low-Medium, additive metrics on an experiment-flag-gated runner, the gate change touches the live promote path |
| Reversibility | High per-candidate, the C9-1 emit and the gate panel are separable hunks |

## 10. RISK MATRIX

| Candidate | Severity if wrong | Likelihood | Mitigation |
|-----------|-------------------|------------|------------|
| C9-1 | Medium | Low | Additive capture, byte-check ranking metrics unchanged |
| C9-2 | Medium | Medium | Category-derived citability, tier from `memory_index` join, label-view unit test |
| C9-3 | Medium | Medium | Corpus-level aggregation test, ECE vs reliability-diagram cross-check |
| A8-1 | High | Medium | Keep the spine, per-class panel behind the ledger, ranking class regression test |
| A8-2 | Medium | Medium | CLASS-G panel unit-tested against known ECE/Brier fixtures |
| A8-5 | Medium | Low | Golden-set label routing test, verify no silent cycle-skip |
| A8-4 | Low | Low | Reuse the existing flag lifecycle, no new flag mechanism |

## 11. USER STORIES

- As a retrieval maintainer, I can ask "did 015's gate fix hold?" and get a gate-verdict P/R/F1, not just a ranking number.
- As a calibration owner, I can measure ECE/Brier on real labels and graduate isotonic calibration on evidence instead of leaving it frozen at opt-in.
- As a cold-tier owner, I can measure cold-appearance-rate and cold-precision once the corpus is reindexed.
- As a promotion-gate operator, I can promote a calibration candidate on its own metric class off the same spine that promotes ranking candidates.
- As an auditor, the promotion ledger records the candidate class and the metric-JSON, so a promote decision is legible per class.

## 12. OPEN QUESTIONS

1. Exact ECE bin count and Brier formulation for the CLASS-G panel, pin a documented scheme and cross-check against a reliability diagram. **TENTATIVE: 10 equal-width confidence bins, standard Brier over binary labels.**
2. Does the generalized gate ledger add `candidate_class` + metric-JSON columns to the existing `shadow_cycle_results` table, or a sibling table keyed on `candidate_id`? **RESOLVE AT IMPL: prefer additive columns if the existing schema tolerates a metric-JSON blob.**
3. Re-confirm the live promotion-gate entrypoint symbol (the research-cited `evaluatePromotionGate`/`:547` drifted) before editing, the surrounding constants are confirmed in `lib/feedback/shadow-scoring.ts`.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:approach -->
## 13. EXECUTION APPROACH

- **Sequence on the forced linear build order.** Gate-zero (sibling reindex + coverage guard, confirmed green) → C9-1 single-pass emit → C9-2 three-way tagging → C9-3 three corpus metrics → A8-1 class-parameterized gate (+ A8-2 CLASS-G panel + A8-5 golden-set label routing + A8-4 flag lifecycle). The C9 chain is the substrate, A8 consumes its metrics.
- **One candidate at a time**, each a self-contained additive reversible change with its own focused test and scoped commit. The existing ranking ablation stays byte-identical when the new lanes are off.
- **Per-candidate gate:** confirm the seam by symbol (re-verify any drifted line) → implement → unit/aggregation test → `tsc`/build + existing suite green → `validate.sh --strict` on this phase → adversarial review (independent seat trying to refute) → fix findings → scoped commit.
- **Executor:** `cli-codex` `gpt-5.5` `xhigh` `fast` for substantial metric/gate code, native `opus` fallback, mechanical edits direct.
- **Reversibility:** branch-only, nothing pushed or deployed without explicit user go.
- **Honesty:** ship for measurability/correctness, not a promised delta. Every leverage claim is structural inference until this harness produces the first benchmarked number.
<!-- /ANCHOR:approach -->

---

<!-- ANCHOR:status -->
## 14. CANDIDATE STATUS

> Cross-checked against the Wave-0 shipped record and the Wave-0 commit range (`git log --oneline 1ecc531431..ab5459fb6d`): **none of these candidates shipped in Wave-0.** The Wave-0 ships a candidate it labels "C9", that is the *embedder-degrade* candidate (recall degrades to lexical + `embedder_available:false`), a different C9 namespace from these C9-1/C9-2/C9-3 metric lanes. This phase now implements C9-1/C9-2/C9-3 as code + deterministic tests. A8 remains pending under the no-schema/no-live-benchmark constraint.

| # | Candidate | Status | Gate | 030 evidence | Notes |
|---|-----------|--------|------|--------------|-------|
| 1 | **C9-1** single-pass diagnostic emit | DONE | code+unit, trusted numbers still need gate-zero live run | Not in 030 §14 | `runAblation` now accepts optional diagnostic rows, emits baseline `diagnosticSnapshots` and reuses `captureScoreSnapshot`/`resolveAbsoluteRelevance`/`assessRequestQuality`, default direct callers remain array-compatible. Evidence: `npm run typecheck`, focused Vitest `252 passed / 13 skipped`. |
| 2 | **C9-2** three-way label tagging | DONE | code+unit, live metadata join runs only when diagnostics requested | Not in 030 §14 | Added pure label-view derivation plus a single `memory_index` metadata lookup helper for tier/created_at, citability uses `hard_negative` category for non-citable labels. Evidence: label-view fixture + in-memory metadata lookup test. |
| 3 | **C9-3** three corpus metric lanes | DONE | code+unit, no live benchmark numbers reported | Not in 030 §14 | Added gate-verdict confusion P/R/F1, ECE+Brier+reliability bins and cold-appearance-rate/cold-precision, wired into optional ablation `corpusMetrics`. Evidence: deterministic metric fixtures + ablation report wiring test. |
| 4 | **A8-1** class-parameterized gate | PENDING | schema-migration-required | Not in 030 §14 | Left pending: acceptance requires ledger recording `candidate_id` + `candidate_class` + metric JSON, which needs a shadow-cycle schema migration and live gate validation. |
| 5 | **A8-2** CLASS-G (ECE/Brier) panel | PENDING | depends-on-A8-ledger | Not in 030 §14 | Left pending: C9 now exposes ECE/Brier metrics, but housing them inside the unified promotion gate depends on A8-1's generalized ledger/panel. |
| 6 | **A8-5** golden-set label-source swap | PENDING | live-operational-gate-required | Not in 030 §14 | Left pending: replacing `adaptive_signal_events` in the scheduled promotion gate changes live evaluation behavior and needs an operational validation run. |
| 7 | **A8-4** promote-on-evidence flag lifecycle | PENDING | depends-on-A8-gate | Not in 030 §14 | Left pending: the flag lifecycle can only be completed once the generalized A8 gate records class-specific evidence. |

**Pending count: 4. Done count: 3.**

> **Refuted/rescoped (not built this phase):** A8-3 recall-delta@k UNION panel, the "gate is structurally blind to recall additions" headline was REFUTED (`ndcgDelta` *is* sensitive to judged-recall additions), survives only as a low-priority coverage instrument [synthesis/08 DROP/RESCOPED. Iter-010].
<!-- /ANCHOR:status -->

---

## RELATED DOCUMENTS

- **Phase research (PRIMARY):** `../research/retrieval-evaluation/research.md` (+ `iterations/iteration-{001,008,009,011,012}.md`, `deltas/`).
- **Synthesis (the spine):** `../../research/synthesis/08-retrieval-evaluation-findings.md`.
- **Cross-cutting roadmap (authoritative):** `../../research/roadmap.md` (BROADENING + 027-REVISIT + MEMORY-SYSTEMS addenda).
- **Gate-zero precondition (sibling):** `../001-corpus-reindex-gate-zero/spec.md` (reindex + C9-4 `assertEmbeddingCoverage`).
