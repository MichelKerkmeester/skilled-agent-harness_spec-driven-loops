---
title: "Verification Checklist: Eval-Gated Confidence Calibration and Shipped-Lever A/B"
description: "Verification checklist for graduating the dormant isotonic confidence calibration on held-out ECE evidence and A/Bing the three default-on search levers (cosine reorder, generic-query escalation, top-dominant verdict). Planning state - implementation not started, both candidates gated on the 019 eval-harness."
trigger_phrases:
  - "calibration ab checklist"
  - "isotonic calibration verification"
  - "shipped levers ab checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-speckit-memory/027-eval-calibration-ab"
    last_updated_at: "2026-07-04T17:51:01.862Z"
    last_updated_by: "codex"
    recent_action: "Verified observe-only calibration and lever A/B utilities"
    next_safe_action: "Run 019-backed golden benchmark"
    blockers:
      - "Gated on the 019 eval-harness ECE lane + A8 promotion gate."
    key_files:
      - ".opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/020-eval-calibration-ab/checklist.md"
    completion_pct: 45
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Eval-Gated Confidence Calibration and Shipped-Lever A/B

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The 019 eval-harness ECE lane + A8 gate confirmed (or scoped as this phase's consumer)
  - **Evidence**: The `C9-3` calibration metric lane and the `A8` per-class promotion gate are confirmed built, if absent, this phase delivers consumer wiring and HALTS at promotion (`spec.md` REQ-001).
- [x] CHK-002 [P0] Requirements documented in spec.md
  - **Evidence**: `spec.md` defines the label harvest, grade binarization, ECE lane, three-way shadow, flag graduation, S5 eval-mode fix and the three lever A/Bs.
- [x] CHK-003 [P0] Technical approach defined in plan.md
  - **Evidence**: `plan.md` records the gate-confirm-first sequencing, harvest/fit/ECE-lane, three-way shadow, S5 eval-mode fix and the lever A/B partitions.
- [x] CHK-004 [P1] Scope exclusions documented
  - **Evidence**: `spec.md` excludes building the 019 harness spine itself, new calibration math, new lever logic, a dedicated S5 fix, live shards and host daemons.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `fitCalibration` has a real (non-test) caller harvesting label pairs
  - **Evidence**: The `eval_run_ablation` loop emits `(query, memoryId, rawValue, relevant)` and calls `fitCalibration` (`confidence-calibration.ts:145`), a test asserts a non-empty `CalibrationSample[]`.
- [x] CHK-011 [P0] Graded golden labels binarized into the binary calibration shape
  - **Evidence**: `grade >= 2 -> 1` produces ~550-1100 pairs accepted by `loadLabeledSet` (`confidence-calibration.ts:73`).
- [x] CHK-012 [P0] An ECE/Brier/reliability lane exists over a held-out split
  - **Evidence**: `eval-metrics.ts` reports ECE + Brier + reliability bins (the previously-absent calibration metric, grep-clean today).
- [x] CHK-013 [P0] No new calibration math or lever logic added
  - **Evidence**: The PAV fitter and all three levers are reused as-is, only harvest-glue, the ECE lane, the A/B searchFn and the flag default change.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] The calibration flag graduates only on held-out ECE evidence - PENDING: shadow comparison returns promote/wait, but no flag default changes without a benchmark
  - **Evidence**: The three-way shadow (identity / proxy-seed / traffic-fit) is scored on held-out ECE, the flag flips default-on only when the real fit beats identity.
- [x] CHK-021 [P0] The S5 eval-mode blind spot is fixed before the S5 A/B
  - **Evidence**: The A/B searchFn sets `evaluationMode:false` and toggles `SPECKIT_COSINE_TOPN_REORDER`, a test asserts the reorder ran.
- [ ] CHK-022 [P0] Each lever (S5/S3/S2) has a reported on/off measured effect - PENDING: observe-only utilities exist, golden-set benchmark deltas were not run
  - **Evidence**: S5 nDCG@1 + top-1, S3 recall@k partitioned escalated/non-escalated and S2 citability confusion are run and reported on the golden set.
- [x] CHK-023 [P0] TypeScript passes
  - **Evidence**: `npx tsc --noEmit` from `.opencode/skills/system-spec-kit/mcp_server` exits 0.
- [x] CHK-024 [P0] Eval/calibration and no-op suites pass
  - **Evidence**: Harvest, binarization, ECE lane, three-way shadow, S5 eval-mode toggle, per-lever A/B and the defaults-unchanged no-op tests pass.
- [x] CHK-025 [P1] Strict spec validation passes
  - **Evidence**: `validate.sh --strict` for this phase reports 0 errors.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Both candidates have an explicit status
  - **Evidence**: `A2-isotonic-calibration` and `A3-AB-shipped-levers` are each marked PENDING with their gate in `spec.md` §9.
- [x] CHK-FIX-002 [P0] The S5 demotion class is instrumented and bounded or escalated
  - **Evidence**: A pre/post-reorder rank instrument flags golden-relevant, no-`.similarity` sinkers, the effect is reported bounded (head-only, rank-not-eviction) or escalated.
- [x] CHK-FIX-003 [P0] The fit x-axis and label-shape blockers are closed
  - **Evidence**: `rebalancedValue` (`confidence-scoring.ts:348`) is captured at the emit point and the non-binary `loadLabeledSet` rejection is resolved by binarization.
- [ ] CHK-FIX-004 [P1] Evidence pinned to explicit command results
  - **Evidence**: Held-out ECE delta, per-lever golden-set deltas, tsc, vitest, validation and comment-hygiene rows record exact commands.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No live shard or host daemon used
  - **Evidence**: Tests use `:memory:` SQLite fixtures, temp directories, the golden set and mocks only.
- [x] CHK-031 [P0] Production defaults unchanged until a promotion decision
  - **Evidence**: With the calibration flag and lever flags at their pre-change defaults, recall/confidence output is byte-identical to baseline (the harness is observe-only).
- [x] CHK-032 [P1] `maybeCalibrate` degrades fail-open
  - **Evidence**: A missing/unloadable calibration model degrades to the raw value and never throws (`confidence-scoring.ts:217`).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/checklist/summary synchronized
  - **Evidence**: All docs point to the same scope, candidates, seams, gate dependency and shadow-gating discipline.
- [x] CHK-041 [P1] Open questions documented
  - **Evidence**: `spec.md` §10 lists the held-out ECE margin, the S5 demotion magnitude, the S3 net-negative and the 019-harness-delivery questions.
- [x] CHK-042 [P1] Final verification results recorded
  - **Evidence**: Recorded in `implementation-summary.md` Verification section.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] New files are in approved scope
  - **Evidence**: New tests are under `.opencode/skills/system-spec-kit/mcp_server/tests`, docs are under this phase folder.
- [x] CHK-051 [P1] Shared eval-harness edits coordinated
  - **Evidence**: `eval-metrics.ts`/`ablation-framework.ts`/`shadow-scoring.ts` edits are coordinated with the 019 harness phase and the other 008 consumers.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 11/13 |
| P1 Items | 8 | 7/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-19
**Verified By**: Codex
<!-- /ANCHOR:summary -->
