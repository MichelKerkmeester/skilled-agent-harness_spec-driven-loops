---
title: "Implementation Summary: Eval-Gated Confidence Calibration and Shipped-Lever A/B"
description: "Safe-core summary for graduating the dormant isotonic confidence calibration on held-out ECE evidence and A/Bing the three default-on search levers. Observe-only utilities are implemented; promotion and golden-set deltas remain gated on the 019 eval-harness."
trigger_phrases:
  - "calibration ab implementation summary"
  - "isotonic calibration status"
  - "shipped levers ab status"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/020-eval-calibration-ab"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented observe-only calibration and lever A/B utilities"
    next_safe_action: "Run 019-backed golden benchmark"
    blockers:
      - "Gated on the 019 eval-harness ECE lane + A8 promotion gate."
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-calibration.ts"
    completion_pct: 45
    open_questions:
      - "Held-out ECE split + identity-baseline margin to graduate the flag."
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/028-memory-search-intelligence/001-speckit-memory/020-eval-calibration-ab` |
| **Completed** | Partial safe core |
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Observe-only utilities implemented; promotion and measured deltas pending |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The observe-only calibration and lever A/B utilities are implemented. Both candidates remain PENDING for promotion because neither has 019-backed benchmark evidence: no held-out ECE improvement has justified flipping `SPECKIT_CONFIDENCE_CALIBRATION`, and no golden-set S5/S3/S2 deltas have been run.

### Isotonic confidence calibration consumer

`confidence-calibration.ts` now accepts graded labels via a pure `grade >= 2` binarizer. `ablation-framework.ts` can harvest calibration samples from diagnostic snapshots and fit an observe-only model with `fitCalibration`, giving the fitter a non-test eval caller. `confidence-scoring.ts` exposes `preCalibrationValue` for diagnostics while keeping `maybeCalibrate` the single apply seam. `eval/shadow-scoring.ts` compares identity, proxy seed, and traffic fit on a deterministic held-out split and returns a promote/wait decision without flipping flags.

### Shipped-lever A/B utilities

`ablation-framework.ts` emits observe-only S5 and S3 variant descriptors; S5 is explicitly measured with `evaluationMode:false`. `eval-metrics.ts` now computes generic lever deltas, S5 fused-non-vector demotion metrics, and S2 citability confusion including the false-good hard-negative cell.

Both remain intelligence-class and benchmark-gated. The implementation is observe-only until evidence exists; production calibration and lever defaults were not changed.

### Files Changed
Implemented: `lib/eval/ablation-framework.ts`, `lib/eval/eval-metrics.ts`, `lib/eval/shadow-scoring.ts`, `lib/search/confidence-calibration.ts`, `lib/search/confidence-scoring.ts`, `tests/eval-calibration-ab.vitest.ts`, and a focused update in `tests/confidence-calibration.vitest.ts`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered as pure/observe-only evaluation utilities with deterministic unit tests. The runtime calibration apply seam remains unchanged, and no flag default was flipped. Benchmark-bound work stops at the promote/wait decision and the A/B measurement descriptors.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Consume the harness, do not build it.** The 019 eval-harness spine (`C9-1/C9-2/C9-3 → A8`) is a separate sibling phase; this phase adds only the calibration-specific label-harvest + ECE-validation wiring and the A/B searchFn.
- **Promote only on held-out ECE evidence.** The dormant calibration is frozen at opt-in precisely because no calibration-error gate exists to make its promote evidence; the three-way shadow on held-out ECE supplies it.
- **Reuse, don't rebuild.** The PAV fitter and all three levers are reused as-is; no forked calibration math or duplicated lever logic.
- **Fix the eval-mode blind spot before the S5 A/B.** S5 is invisible under `evaluationMode`; the A/B searchFn sets `evaluationMode:false` so the reorder is actually measured.
- **S5 demotion is bounded.** The fused-non-vector demotion is head-only, rank-not-eviction, and rare (verify iter-010), so it folds into the A/B as a small-effect lever rather than a dedicated fix.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Eval/calibration targeted tests | PASS (`eval-calibration-ab`, `confidence-calibration`, `eval-metrics`, `ablation-framework`) |
| `npx tsc --noEmit` | PASS |
| `validate.sh --strict` | PASS |
| Held-out ECE promotion benchmark | PENDING |
| Golden-set S5/S3/S2 deltas | PENDING |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

Implemented checks: label harvest rides the diagnostic baseline output; the ECE/reliability computation stays at the aggregation layer; production calibration + lever defaults remain no-op until promotion; `maybeCalibrate` remains fail-open on missing/unloadable models.
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- No measured benefit number exists for either candidate; the held-out ECE and golden-set A/B deltas remain the promotion gates.
- Both candidates remain blocked on the 019-backed benchmark path for promotion, even though observe-only utilities are implemented.
- The S3 escalation A/B may confirm a net-negative on precise short content-bearing queries; fixing the escalation heuristic remains out of scope for this phase.
- The 008 synthesis seat flagged that the A2/A3 *framings* were inferred from headlines under a read-cap; the iter-004/005 deltas (re-read here) carry the load-bearing file:line evidence.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations

The research notation for these candidates is mangled in two synthesis surfaces — `synthesis/01-go-candidates.md` and the roadmap render "isotonic"/"ECE" as the literal token "n" (e.g. "the n machinery", "n/Brier"). The authoritative, un-mangled source is `synthesis/08-retrieval-evaluation-findings.md` (#6/#7) plus the `../research/from-008-retrieval-evaluation/deltas/iter-004.jsonl` (A2) and `iter-005.jsonl` (A3); this phase is grounded in those. Research line numbers drift slightly from the live code (e.g. `TOP_DOMINANT_THRESHOLD` at `:78` not `:67`, `assessRequestQuality` at `:385` not `:355`); the verified live lines are cited. The brief's "checklist for level 3" note is superseded by the Level-2 validator, which requires `checklist.md` and `implementation-summary.md` for Level 2; both are included.
<!-- /ANCHOR:deviations -->
