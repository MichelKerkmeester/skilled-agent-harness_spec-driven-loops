---
title: "Implementation Plan: Eval-Gated Confidence Calibration and Shipped-Lever A/B"
description: "Plan for graduating the dormant isotonic confidence calibration on real held-out ECE evidence (harvest labels, binarize the graded golden set, build the missing ECE lane, three-way shadow) and A/Bing the three default-on search levers (cosine reorder, generic-query escalation, top-dominant verdict) on the golden set, both gated on the 019 eval-harness."
trigger_phrases:
  - "isotonic calibration graduation plan"
  - "ece calibration lane sequencing"
  - "ab shipped levers plan"
  - "eval gated calibration promotion plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-speckit-memory/027-eval-calibration-ab"
    last_updated_at: "2026-07-04T17:51:01.862Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored plan for calibration graduation + lever A/B"
    next_safe_action: "Confirm the 019 eval-harness ECE lane before harvesting calibration labels."
    blockers:
      - "Gated on the 019 eval-harness ECE lane + A8 promotion gate (not yet a built sibling phase)."
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-calibration.ts"
    completion_pct: 0
    open_questions:
      - "Held-out ECE split + identity-baseline margin to graduate the flag."
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Eval-Gated Confidence Calibration and Shipped-Lever A/B

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js |
| **Framework** | Spec Kit Memory MCP server eval harness (`eval_run_ablation`) + search pipeline and Vitest |
| **Storage** | `better-sqlite3` interfaces with the 110-query graded golden set and temp/in-memory test fixtures only |
| **Testing** | Targeted vitest files, eval/calibration suite, `npx tsc --noEmit`, strict spec validation |

### Overview
Two measurement-gated retrieval-intelligence candidates that *consume* the 019 eval-harness. First, the dormant isotonic confidence calibration is graduated on evidence: the `eval_run_ablation` baseline loop is instrumented to harvest `(query, memoryId, rawValue, relevant)` pairs (giving `fitCalibration` its first non-test caller), the graded 0-3 golden labels are binarized (`grade >= 2 -> 1`) into the binary calibration shape `loadLabeledSet` requires, the missing ECE + Brier + reliability-bin lane is added at the eval-metrics aggregation layer (the validation crux) and a three-way shadow (identity vs proxy-seed vs traffic-fit) scored on held-out ECE graduates the flag default-on only when the real fit beats identity. Second, the three levers 017/015 shipped default-on but never measured are A/B'd on the golden set: the S5 eval-mode blind spot is fixed first (the A/B searchFn sets `evaluationMode:false`), then cosine head-reorder (S5), generic-query escalation (S3, partitioned escalated/non-escalated) and the top-dominant verdict (S2, citability confusion) are each toggled and their measured effect reported. The S5 fused-non-vector demotion is instrumented and confirmed bounded. No calibration math or lever logic is built, only harvest-glue, the ECE lane, the A/B searchFn and the flag default change. Until the held-out ECE / golden-set delta justifies a promotion, the harness is observe-only and production defaults are unchanged.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The 019 eval-harness ECE lane (`C9-3`) and the `A8` per-class promotion gate confirmed built (or scoped as this phase's consumer delivery).
- [ ] Gate-zero corpus reindex (`001-001`) confirmed run so golden-set embedding coverage is whole.
- [ ] The `eval_run_ablation` baseline loop and the `fitCalibration` / `loadLabeledSet` shapes located.
- [ ] The three lever seams (S5 reorder, S3 escalation, S2 verdict) and their flags enumerated.

### Definition of Done
- [ ] `fitCalibration` is called from the eval runner with harvested, binarized label pairs (first non-test caller).
- [ ] ECE + Brier + reliability bins reported over a held-out split.
- [ ] The three-way calibration shadow scored on held-out ECE. Flag graduates only when the real fit beats identity.
- [ ] The S5 eval-mode blind spot fixed. S5/S3/S2 each have a reported on/off measured effect.
- [ ] The S5 demotion instrument confirms the bounded/rare class (or escalates if large).
- [ ] Production defaults unchanged until a promotion decision. Tests, TypeScript, strict spec validation and comment hygiene ready.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Harvest-fit-validate-promote for calibration (consume the eval harness's ECE lane, flip the flag only on held-out evidence) + observe-only on/off A/B for the three default-on levers, both behind the 027 promote-on-evidence flag lifecycle.

### Key Components
- **Calibration label harvest**: the `eval_run_ablation` baseline loop emits `(query, memoryId, rawValue=rebalancedValue, relevant)`, `fitCalibration`'s first non-test caller.
- **Grade binarization**: `grade >= 2 -> relevant=1` so graded golden labels satisfy `loadLabeledSet`'s binary requirement.
- **ECE/calibration lane**: ECE + Brier + reliability bins over a held-out split at the eval-metrics aggregation layer, the missing validation metric.
- **Three-way calibration shadow**: identity (OFF) vs materialized proxy-seed fit vs real-traffic fit, scored on held-out ECE. The runtime model path is swappable.
- **Flag lifecycle**: `isConfidenceCalibrationEnabled` graduates opt-in → feature-on only when the real fit beats identity, with rollback.
- **S5 eval-mode fix**: the A/B searchFn sets `evaluationMode:false` so the reorder actually runs under measurement.
- **Lever A/B**: on/off toggles for S5 (`SPECKIT_COSINE_TOPN_REORDER`), S3 (`SPECKIT_COMPLEXITY_ROUTER`, partitioned), S2 (verdict citability confusion).
- **S5 demotion instrument**: pre/post-reorder rank delta flagging golden-relevant, no-`.similarity` rows that sink.

### Data Flow
For calibration, each golden query runs through the baseline `eval_run_ablation` pass, which now emits the per-result `(rawValue, relevant)` pair. The binarized labels feed `fitCalibration` to produce a model. The held-out split is scored by the new ECE/reliability lane. The three-way shadow compares identity vs proxy-seed vs traffic-fit, and the flag graduates only if the traffic-fit beats identity. The runtime `maybeCalibrate` apply seam is unchanged and inert unless the flag plus a model file are present. For the A/B, the harness runs each lever's searchFn variant on/off (S5 with `evaluationMode:false`), partitions S3 by escalation, derives S2 citability labels from graded relevance and reports each measured delta. Until a promotion decision flips a default, the harness is observe-only, production recall, confidence and the three lever defaults are byte-identical to baseline.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `ablation-framework.ts` (`eval_run_ablation` loop) | Baseline runner, captures `EvalResult[]` only | Emit `(query, memoryId, rawValue, relevant)` calibration pairs, run lever A/B variants with `evaluationMode:false` | Harvest test asserts non-empty `CalibrationSample[]`, A/B test asserts S5 reorder ran |
| `eval-metrics.ts` | 12 ranking metrics, no calibration metric | Add ECE + Brier + reliability bins (held-out), add S5 pre/post-reorder demotion + S2 citability confusion instruments | ECE-lane test, demotion + confusion instrument tests |
| `ground-truth-feedback.ts:362-373` | Graded relevance | Binarize `grade >= 2 -> 1` into `CalibrationSample.relevant` | Binarization test (~550-1100 pairs above floor) |
| `confidence-scoring.ts:348,:353` | `rebalancedValue` computed → `maybeCalibrate` | Capture `rebalancedValue` at the emit point, keep `:217` the single apply seam | Capture test, apply-seam unchanged test |
| `confidence-calibration.ts:73,:145` | `loadLabeledSet` (binary-only) + `fitCalibration` (zero callers) | Wire `fitCalibration` to harvested binarized labels (first non-test caller) | Fit-produces-model test |
| `lib/eval/shadow-scoring.ts` | Eval-side ablation shadow | Add three-way (identity/proxy-seed/traffic) ECE shadow | Three-way ECE shadow test |
| `lib/feedback/shadow-scoring.ts:43,:68,:93` | Promotion gate (`meanNdcgDelta` weld + flag lifecycle), un-welded by the 019 phase | Route the calibration flag through the per-class promote/wait/rollback lifecycle (coordinate with 019, do not fork) | Promote/wait/rollback test on the calibration class |
| `hybrid-search.ts:1989,:2014-2021` | S5 reorder skipped under `evaluationMode` | Read for the A/B + demotion instrument (reorder not changed) | Eval-mode-toggle test asserts reorder ran |
| `query-classifier.ts:62,:157,:245` | S3 escalation + `SPECKIT_COMPLEXITY_ROUTER` | Read for the partitioned A/B | Escalated/non-escalated partition test |
| `search-flags.ts:622` | `isConfidenceCalibrationEnabled` + lever flags | Read, flag graduation is a default change | No-op-at-default test |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Gate Confirmation and Setup
- [ ] Confirm the 019 eval-harness ECE lane + A8 gate are built (or scope this phase to deliver the calibration consumer + HALT at promotion).
- [ ] Confirm gate-zero corpus reindex (`001-001`) is run, golden-set coverage whole.
- [ ] Read the `eval_run_ablation` baseline loop, `fitCalibration`, `loadLabeledSet` and `maybeCalibrate`/`rebalancedValue`.
- [ ] Read the three lever seams (S5 reorder + eval-mode skip, S3 escalation, S2 verdict) and their flags.

### Phase 2: Calibration Harvest, Fit and ECE Lane (A2)
- [ ] Binarize the graded golden set (`grade >= 2 -> 1`) into the `CalibrationSample` shape.
- [ ] Instrument the `eval_run_ablation` loop to emit `(query, memoryId, rawValue, relevant)` pairs.
- [ ] Wire `fitCalibration` to the harvested labels (its first non-test caller).
- [ ] Add the ECE + Brier + reliability-bin lane (held-out split) at the eval-metrics aggregation.
- [ ] Add the three-way shadow (identity / proxy-seed / traffic-fit) scored on held-out ECE, materialize the proxy-seed baseline.
- [ ] Graduate the calibration flag default-on ONLY when the real fit beats identity, via the flag lifecycle.

### Phase 3: Shipped-Lever A/B (A3)
- [ ] Fix the S5 eval-mode blind spot: the A/B searchFn sets `evaluationMode:false` and toggles `SPECKIT_COSINE_TOPN_REORDER`.
- [ ] A/B S5 (cosine reorder) on nDCG@1 + top-1 precision.
- [ ] Add the S5 demotion instrument (pre/post-reorder rank, golden-relevant + no-`.similarity` sinkers). Confirm bounded or escalate.
- [ ] A/B S3 (generic-query escalation) on recall@k, partitioned {escalated, non-escalated}.
- [ ] A/B S2 (top-dominant verdict) via citability confusion incl. the false-good-on-hard-negatives cell.
- [ ] Report each lever's measured effect.

### Phase 4: Verification
- [ ] Add and run the harvest, binarization, ECE/reliability-bin, three-way shadow, S5 eval-mode toggle and per-lever A/B tests.
- [ ] Confirm production defaults are a no-op (the harness is observe-only until promotion).
- [ ] Report the held-out ECE delta and the per-lever golden-set deltas.
- [ ] Run `npx tsc --noEmit`, the requested suites, strict spec validation and comment-hygiene checks.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Label harvest | `eval_run_ablation` emits `(query, memoryId, rawValue, relevant)` | In-memory eval vitest |
| Binarization | Graded 0-3 → binary, ~550-1100 pairs above floor | In-memory calibration vitest |
| Calibration metric | ECE + Brier + reliability bins on a held-out split | In-memory eval-metrics vitest |
| Three-way shadow | identity / proxy-seed / traffic-fit ECE comparison + flag lifecycle | In-memory shadow-scoring vitest |
| S5 eval-mode | The A/B searchFn runs the reorder (`evaluationMode:false`) | In-memory hybrid-search vitest |
| Lever A/B | S5 nDCG@1 + top-1, S3 recall@k partitioned, S2 citability confusion | In-memory ablation vitest on the golden set |
| S5 demotion | Pre/post-reorder rank flags bounded golden-relevant sinkers | In-memory reorder vitest |
| No-op | Production defaults unchanged (harness observe-only) | Serialization/confidence parity vitest |
| Type safety | MCP server TypeScript project | `npx tsc --noEmit` |
| Documentation | Level 2 phase docs | `validate.sh --strict` |
| Comment hygiene | Changed code files | `check-comment-hygiene.sh` and grep |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 019 eval-harness ECE lane (`C9-3`) + `A8` promotion gate (sibling `019-eval-harness-extension`) | Cross-phase | **Blocking** | Calibration cannot be validated/promoted, A/B has no class-gate. |
| Gate-zero corpus reindex (`001-001`) | Cross-phase | Needed | Calibration/recall numbers untrustworthy against a cold index. |
| `fitCalibration` PAV fitter (`confidence-calibration.ts:145`) | Internal | Green (built, uncalled) | No fit, the math is the easy part. |
| `loadLabeledSet` (`confidence-calibration.ts:73`) | Internal | Green (binary-only) | Rejects graded labels without binarization. |
| `maybeCalibrate` apply seam (`confidence-scoring.ts:217`) | Internal | Green (inert at default) | Runtime apply path, unchanged. |
| The 110-query graded golden set | Internal | Green | No labels for the fit or the A/B. |
| The three levers (S5/S3/S2) | Internal | Green (all ship default-on) | A/B has nothing to toggle. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The held-out ECE does not beat identity (no promotion), the A/B is inconclusive or TypeScript/tests/validation/comment-hygiene fail.
- **Procedure**: Leave the calibration flag and the three lever flags at their pre-change defaults (the harness is observe-only, so no production change to undo), then revert the harvest-glue, the ECE lane, the three-way shadow and the A/B searchFn wiring.
- **Data Reversal**: None. Tests use temp/in-memory fixtures and the golden set, no live shard is mutated. The harvested labels and the materialized proxy-seed are reproducible artifacts.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Gate Confirmation -> Calibration Harvest + ECE Lane -> Three-Way Shadow + Flag Graduation
                  -> S5 Eval-Mode Fix -> Lever A/B (S5/S3/S2) -> Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Calibration Harvest + ECE Lane | Gate confirmation (019 harness) + gate-zero reindex | Three-way shadow |
| Three-Way Shadow + Flag Graduation | Calibration harvest + ECE lane | Verification |
| S5 Eval-Mode Fix | Gate confirmation | Lever A/B |
| Lever A/B (S5/S3/S2) | S5 eval-mode fix | Verification |
| Verification | All prior phases | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimate |
|-------|------------|----------|
| Gate confirmation and reads | Low | In-session |
| Calibration harvest + binarization + ECE lane | High | Multi-session (the validation crux + harness consumer wiring) |
| Three-way shadow + flag graduation | Medium | Benchmark-bound (held-out ECE) |
| S5 eval-mode fix + lever A/B | Medium | Benchmark-bound (golden-set A/B) |
| Verification | Medium | In-session |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-completion Checklist
- [ ] No live database shard modified.
- [ ] No host daemon touched.
- [ ] Production calibration + lever defaults verified unchanged (harness observe-only until promotion).

### Rollback Procedure
1. Leave the calibration flag and the three lever flags at their pre-change defaults (immediate neutralization).
2. Revert only the files listed in the affected-surfaces table.
3. Re-run the eval/calibration suite and strict spec validation.

### Data Reversal
- **Has data migrations?** No (the harvested labels and proxy-seed are reproducible additive artifacts).
- **Reversal procedure**: Not needed. Tests use temp/in-memory fixtures and the golden set only.
<!-- /ANCHOR:enhanced-rollback -->
