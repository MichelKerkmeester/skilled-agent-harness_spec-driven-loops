---
title: "Verification Checklist: adoption-gate-and-rerun"
description: "Verification items for the final adoption gate and the measured 45-tile re-run, plus the adopt/iterate/reject decision rule. Verification Date: pending implementation."
trigger_phrases:
  - "adoption gate checklist"
  - "rerun verification"
  - "adopt iterate reject decision rule"
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
# Verification Checklist: adoption-gate-and-rerun

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

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

- [ ] CHK-001 [P0] Requirements documented in spec.md (adoption gate + measured re-run + lift report)
- [ ] CHK-002 [P0] Technical approach defined in plan.md (gate decision, re-run driver, metrics computer)
- [ ] CHK-003 [P0] Phases 001-005 shipped and pass `validate.sh --recursive` before any re-run
- [ ] CHK-004 [P1] Baseline fixture captured (27/45 = 60%, mean 81.1, ~41-pt delta, prior per-tile scores)
- [ ] CHK-005 [P1] 45-tile manifest carries primitive labels (linear-flow vs 2D-positioned)
- [ ] CHK-006 [P0] Human-labeled ground-truth set (25-30 stratified tiles) captured BEFORE the batch (REQ-008)
- [ ] CHK-007 [P0] Pre-registered ADOPT/ITERATE/REJECT decision rule frozen in spec.md §5 before any tile is re-run (REQ-007)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Re-run harness + gate pass lint/format checks
- [ ] CHK-011 [P0] No console errors or unhandled rejections during the batch
- [ ] CHK-012 [P1] Per-tile retry-once handling implemented for transient dispatch failures
- [ ] CHK-013 [P1] Harness reuses `gen-tile.mjs` + the phase-001 audit gate (no reimplemented generation logic)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Adoption gate ships a tile only if the four DETERMINISTIC gates (geometry, contrast, casing/glyph, palette) all pass; MiniMax runs as a shadow diagnostic and never blocks ship until calibrated (truth-table test) (REQ-001)
- [ ] CHK-021 [P0] All 45 tiles re-run through 001-005 + adoption gate; 45 per-tile records produced
- [ ] CHK-022 [P0] SHIP rate computed vs baseline WITH a confidence interval (~+/-10-12 pt); reaches conservative 80-84% (target up to 87-91%) from 60% (SC-001, REQ-011)
- [ ] CHK-023 [P0] Diagram-vs-linear delta computed; drops to conservative 14-20 pts (target 8-14) from ~41 pts (SC-002)
- [ ] CHK-024 [P1] Contrast exit-0 rate among accepted tiles is 95-100%, reported as a sub-metric not the headline (SC-003)
- [ ] CHK-025 [P1] Cost accounting (GLM calls, paid calls, wall-clock) within the REALISTIC ceiling (120-200 GLM + 5-15 GPT-5.5 + 20-40 MiniMax, dry-run calibrated) with an aborting breach flag; median per-tile < 90s (SC-004)
- [ ] CHK-026 [P1] Paired tile-level deltas used (not independent angle sums); newly-shipped tiles tagged recovered-2D / downgraded / improved-linear
- [ ] CHK-027 [P0] Linear no-regression = 100% (zero linear regressions) and zero copy/casing/glyph regressions on locked fields (SC-005, REQ-006)
- [ ] CHK-028 [P1] Human spot-check of accepted tiles for RC-7 slop the deterministic gates cannot catch
- [ ] CHK-029 [P0] Recovered-2D floor holds: `recovered-2D / (recovered-2D + downgraded-to-linear) >= 0.50` among recovered tiles (SC-007, REQ-005)
- [ ] CHK-029b [P0] keep-prior obeys the prior-best-quality floor; the 18 baseline failures cannot be silently shipped as non-regression (REQ-010)
- [ ] CHK-029c [P1] Gate-config ablation run (loose / deterministic-only / full); loose-vs-full "gate tax" reported (SC-006, REQ-009)

### Decision Rule: Adopt / Iterate / Reject

This is a verification MIRROR of the pre-registered typed `decision()` function frozen in **spec.md §5** (the authoritative source). The lift report MUST emit exactly the verdict that function returns from the measured ledger (evaluated in order):

- **ADOPT** when ALL hold: SHIP >= 80% (>= 36/45) AND `recovered2DShare >= 0.50` (>= 50% of previously-failing 2D genuinely recovered) AND linear no-regression = 100% (zero linear regressions) AND zero copy/casing/glyph regressions on locked fields.
- **ITERATE** when SHIP in 60-79%, OR `recovered2DShare < 0.50` (the 80% target was met largely via `downgraded-to-linear`), OR the MiniMax shadow diagnostic returned `unknown` on > 2 tiles.
- **REJECT** otherwise - SHIP did not improve over 60%, OR linear winners regressed, OR locked-field (copy/casing/glyph) regressions appeared.

> Supporting hard guard (REQ-005): independent of the verdict, `recovered-2D / (recovered-2D + downgraded-to-linear) >= 0.50` among recovered tiles must hold; failing it caps the verdict at ITERATE. Validator precision must clear < 15% human-disagreed blocks against the ground-truth set (REQ-008) before the verdict is trusted.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each newly-shipped tile is classified: `recovered-2D`, `downgraded-to-linear`, or `improved-linear`
- [ ] CHK-FIX-002 [P0] Same-class check completed: every prior linear winner re-verified for regression, not assumed stable
- [ ] CHK-FIX-003 [P0] Consumers of the lift numbers (parent spec handoff row, recommendation) reconciled against the measured ledger
- [ ] CHK-FIX-004 [P0] Validator precision/recall measured against the 25-30 tile human ground-truth set (< 15% human-disagreed blocks) BEFORE the batch is trusted (REQ-008)
- [ ] CHK-FIX-004b [P1] MiniMax shadow agreement measured against the same ground-truth labels; promote to hard sub-gate only if calibration passes, else keep shadow
- [ ] CHK-FIX-005 [P1] Re-run axes listed: 45 tiles x pipeline snapshot; paired against the single baseline snapshot
- [ ] CHK-FIX-006 [P1] Latency/transient-failure variant handled (slow tail up to 3-6 min; ~1/45 transient recorded separately)
- [ ] CHK-FIX-007 [P1] Evidence pinned to a specific pipeline snapshot/commit, not a moving branch range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded API keys; Z.AI / MiniMax / GPT-5.5 credentials read from environment only
- [ ] CHK-031 [P0] Keys and prompts never written to the JSONL ledger or the report
- [ ] CHK-032 [P1] Re-run writes only inside `004-bento-visuals/research/rerun/` (no site/production paths)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec / plan / tasks / checklist synchronized
- [ ] CHK-041 [P1] Lift report documents method, thresholds, and the adopt/iterate/reject rationale
- [ ] CHK-042 [P2] Parent spec Phase 6 handoff row updated with the measured result
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Intermediate artifacts kept under the `rerun/` workspace, not scattered in the packet root
- [ ] CHK-051 [P1] Workspace cleaned of throwaway scratch before completion; ledger + report retained
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 20 | 0/20 |
| P1 Items | 18 | 0/18 |
| P2 Items | 1 | 0/1 |

**Verification Date**: pending implementation (planning only)
<!-- /ANCHOR:summary -->
