---
title: "Implementation Plan: adoption-gate-and-rerun"
description: "Build a thin orchestration layer over the phase 001-005 pipeline that applies the final adoption gate to each tile, re-runs all 45 tiles, records per-tile telemetry, and computes the measured lift vs the 60% / ~41-pt baseline. No new generation logic - adoption gate plus measurement only."
trigger_phrases:
  - "adoption gate plan"
  - "rerun harness"
  - "compute lift"
  - "measured re-run pipeline"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/005-glm-visual-refinement/006-adoption-gate-and-rerun"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Folded panel: pre-registered ADOPT rule, de-circular gate, recovered-2D floor"
    next_safe_action: "Implement adoption-gate + ground-truth calibration before the re-run"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: adoption-gate-and-rerun

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM (`.mjs`), reusing the existing `gen-tile.mjs` harness |
| **Framework** | Headless Chromium (Playwright/Puppeteer, as used by phase 001's gate) for DOM/CSS geometry + contrast extraction |
| **Storage** | JSONL per-tile ledger + a markdown lift report; no database |
| **Testing** | Node assertions for the gate truth-table + metrics math; manual human spot-check for slop |

### Overview
This phase adds a thin orchestration layer on top of the phase 001-005 pipeline. It (1) runs each of the 45 tiles through the full hardened pipeline, (2) applies the final adoption gate to decide ship / keep-prior / downgrade, (3) records per-tile telemetry to a JSONL ledger, and (4) computes and reports the lift vs the fixed baseline. There is no new generation logic - the adoption gate is a decision function over existing sub-gate verdicts, and the rest is measurement and reporting.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 001-005 shipped and pass `validate.sh --recursive`
- [ ] `gen-tile.mjs` and the phase-001 audit gate (`audit-concept.sh`) are available and runnable
- [ ] The 45-tile input set + prior per-tile audit scores are captured as a baseline fixture
- [ ] A human-labeled ground-truth set (25-30 stratified tiles) is captured BEFORE the batch for gate precision/recall + MiniMax calibration (REQ-008)
- [ ] The pre-registered ADOPT/ITERATE/REJECT decision rule (spec.md §5) is frozen before any tile is re-run

### Definition of Done
- [ ] All 45 tiles re-run through 001-005 + the adoption gate (four deterministic sub-gates; MiniMax shadow)
- [ ] Per-tile JSONL ledger written; lift report produced (SHIP rate + CIs, diagram-vs-linear delta, contrast exit-0, recovered-2D split, cost vs realistic ceiling)
- [ ] Gate precision/recall measured against the ground-truth set; gate-config ablation ("gate tax") reported
- [ ] Report carries the pre-registered adopt / iterate / reject verdict computed from the §5 rule
- [ ] spec / plan / tasks / checklist synchronized
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pipeline orchestration + measurement/report. The adoption gate is a pure decision function; the driver is a sequential per-tile loop; the metrics computer is a stateless reducer over the JSONL ledger.

### Key Components
- **Adoption gate** (`adoption-gate.mjs`): pure function `(subGateVerdicts, priorBest) -> { decision, failingGates }` where `decision` is `ship | keep-prior | downgrade`. Ships only when the four DETERMINISTIC sub-gates (geometry AND contrast AND casing/glyph AND palette) pass; MiniMax-status is recorded as a shadow diagnostic and does not block ship. `keep-prior` is gated by the prior-best-quality floor (forbidden for sub-floor baseline failures -> `fail`).
- **Re-run driver** (`rerun-45.mjs`): iterates the 45-tile manifest, invokes each 001-005 stage in order, calls the adoption gate, appends one record per tile to the JSONL ledger; resumable + idempotent per tile; tracks cost against the realistic ceiling with an aborting breach flag.
- **Ground-truth calibration** (`ground-truth.json` + a calibration step): a human-labeled stratified 25-30 tile set scored before the batch; the gate's precision/recall/accuracy and MiniMax's agreement are measured against it, breaking the gate's self-validation.
- **Metrics computer** (`compute-lift.mjs`): reads the ledger, computes SHIP rate WITH confidence intervals, diagram-vs-linear delta, contrast exit-0 rate, cost totals vs the ceiling, paired per-tile deltas, `recovered-2D` vs `downgraded-to-linear` tags + the recovered-2D floor, linear-regression detection, and the loose/deterministic/full gate-config ablation ("gate tax").
- **Report** (`rerun-report.md`): renders new-vs-baseline tables (with CIs), the gate-tax ablation, ground-truth precision/recall, and the pre-registered §5 adopt / iterate / reject verdict.

### Data Flow
1. Tile input + primitive label enter the driver.
2. Phase 001 contract + deterministic gate runs; failure JSON captured.
3. Phase 002 routes the tile linear-flow vs 2D-positioned.
4. Phase 003 feeds MiniMax findings back to GLM for a failure-only repair.
5. Phase 004 computes a coordinate skeleton for 2D-positioned tiles; GLM renders from it.
6. Phase 005 escalates the hardest 2D skeletons to a GPT-5.5 author (cost-capped).
7. Adoption gate consumes the four deterministic sub-gate verdicts -> ship / keep-prior / downgrade; the MiniMax shadow verdict is recorded alongside, not used to block ship.
8. One record per tile is appended to the ledger; the metrics computer aggregates (with CIs + recovered-2D floor + gate-config ablation), the ground-truth calibration is reconciled, and the report renders the lift + pre-registered verdict.

> Precedes the batch: the human ground-truth set (25-30 tiles) is labeled and the gate is calibrated against it, so the SHIP rate is measured against an independent reference rather than the gate validating itself.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phases 001-005 ship + validate (`validate.sh --recursive` on the parent)
- [ ] Snapshot the baseline: 27/45 = 60% SHIP, mean 81.1, ~41-pt delta, and prior per-tile audit scores, into a fixture
- [ ] Assemble the 45-tile manifest with primitive labels (linear-flow vs 2D-positioned) needed for the delta computation
- [ ] Capture the human-labeled ground-truth set (25-30 stratified tiles) BEFORE the batch (REQ-008)
- [ ] Confirm the pre-registered §5 decision rule is frozen; run a 3-5 tile cost dry run to calibrate the realistic ceiling + breach flag (REQ-004)

### Phase 2: Core Implementation
- [ ] Adoption-gate decision function (four-deterministic-sub-gate AND -> ship / keep-prior / downgrade; MiniMax shadow; keep-prior quality floor)
- [ ] Re-run driver wiring 001-005 stages + the adoption gate + the per-tile JSONL ledger + the cost breach flag
- [ ] Metrics computer (SHIP rate + CIs, diagram-vs-linear delta, contrast exit-0, cost vs ceiling)
- [ ] Paired tile-level deltas + `recovered-2D` vs `downgraded-to-linear` tagging + recovered-2D floor + linear-regression detection + gate-config ablation
- [ ] Run the full 45-tile batch (3 repeated runs where feasible for the sign test); capture the ledger and dispatch-failure log

### Phase 3: Verification
- [ ] Measure gate precision/recall against the ground-truth set; calibrate (and decide MiniMax shadow-vs-promote) before trusting the batch
- [ ] Reconcile new-vs-baseline; confirm SHIP / delta / contrast / cost / recovered-2D floor against the SC thresholds with CIs
- [ ] Compute the pre-registered §5 verdict from the measured ledger; write `rerun-report.md` with the gate-tax ablation + verdict
- [ ] Run `validate.sh --strict` on this phase folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Adoption-gate truth table (four deterministic gates all-pass -> ship; any-fail -> keep-prior/downgrade; MiniMax shadow never blocks); keep-prior floor; decision-rule function (§5) on fixture inputs; metrics math + CI on a fixture ledger | Node assertions |
| Calibration | Score the 25-30 tile human ground-truth set; measure gate precision/recall/accuracy + MiniMax agreement BEFORE the batch (REQ-008) | Ground-truth fixture + gate |
| Ablation | Re-score the batch under loose / deterministic-only / full gate configs; report the loose-vs-full "gate tax" (REQ-009) | `compute-lift.mjs` |
| Integration | Dry-run 3-5 stratified tiles (a linear winner, a known 2D failure, a borderline contrast/title case) end-to-end through 001-005 + gate before the full batch; also calibrates the realistic cost ceiling | `rerun-45.mjs` on a subset |
| Statistical | 3 repeated batches + a sign test to separate pipeline lift from model sampling noise where feasible (REQ-011) | `compute-lift.mjs` |
| Manual | Human spot-check of accepted tiles for RC-7 slop the deterministic gates cannot catch; linear no-regression eyeball | Browser (contact sheet) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001-005 | Internal | Red until shipped | Re-run cannot run at all |
| `gen-tile.mjs` | Internal | Green (confirmed at `004-bento-visuals/research/inputs/`) | Re-run blocked |
| Audit gate (`audit-concept.sh`, from 001) | Internal | Yellow (produced by phase 001) | Adoption gate blocked |
| Headless Chromium | External | Green | Geometry + contrast extraction blocked |
| Z.AI / MiniMax / GPT-5.5 APIs | External | Yellow | Run blocked or biased; record dispatch failures |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Re-run shows linear regressions, copy/casing/glyph regressions on locked fields, or a SHIP gain that is pure downgrade inflation.
- **Procedure**: Report REJECT or ITERATE; keep the prior best renders. This phase ships nothing to the site, so rollback is simply not adopting the new pipeline output.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
001-005 (pipeline) ──► Setup (baseline + manifest) ──► Core (gate + driver + metrics) ──► Verify (calibrate + report)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 001-005 shipped | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (baseline + manifest) | Low | 1-2 hours |
| Ground-truth labeling (25-30 tiles, human) + cost dry run | Medium | 2-3 hours |
| Adoption gate + driver (four gates + shadow + keep-prior floor + breach flag) | Medium | 3-5 hours |
| Metrics + tagging + regression detection + CIs + gate-config ablation | Medium | 3-5 hours |
| Batch run (x3 for sign test) + report + calibration + verification | Medium | 2-4 hours (plus batch wall-clock) |
| **Total** | | **11-19 hours + batch wall-clock** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Prior best renders preserved before the re-run overwrites any working output
- [ ] Re-run writes only inside `004-bento-visuals/research/rerun/` (no site/production paths)
- [ ] Baseline fixture snapshotted so paired deltas remain reproducible

### Rollback Procedure
1. Stop the batch; the JSONL ledger preserves completed tiles.
2. Report REJECT/ITERATE rather than adopting the new pipeline.
3. Retain prior best renders as the shipped set; no site change is required.

### Data Reversal
- **Has data migrations?** No - measurement-only, no persisted production state.
- **Reversal procedure**: Discard the `rerun/` workspace outputs; baseline fixture is unaffected.
<!-- /ANCHOR:enhanced-rollback -->
