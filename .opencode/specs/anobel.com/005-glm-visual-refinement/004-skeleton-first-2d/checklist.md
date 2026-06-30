---
title: "Verification Checklist: skeleton-first-2d (geometry kernel)"
description: "Verification Date: [pending — planning only]"
trigger_phrases:
  - "skeleton-first 2d checklist"
  - "geometry kernel checklist"
  - "verification"
  - "checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/005-glm-visual-refinement/004-skeleton-first-2d"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Revised to A7 renderer-first after the 5-model panel"
    next_safe_action: "Run the GLM plan-obedience pilot + verifier re-baseline before any build"
    blockers:
      - "Depends on 001 gate + failure-JSON and 002 primitive routing"
    key_files:
      - ".opencode/specs/anobel.com/004-bento-visuals/scratch/faithful-import/_audit.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: skeleton-first-2d (geometry kernel)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

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

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-012)
- [ ] CHK-002 [P0] Technical approach defined in plan.md (A7 renderer-first: semantic-plan contract + deterministic renderer + best-of-3 + downgrade)
- [ ] CHK-003 [P1] Dependencies available: 001 failure-JSON + 002 `primitive_class`
- [ ] CHK-004 [P0] Phase-0 plan-obedience pilot run on 2-3 sentinel tiles (`accountbeheer-4 matrix`, `oci-4 node`); ≥85% compliance recorded BEFORE any module code, else re-scope (REQ-009)
- [ ] CHK-005 [P0] Phase-0 re-baseline: old 2D outputs re-scored through the new geometry verifier; downgraded tiles excluded from the 2D denominator (REQ-012)
- [ ] CHK-006 [P0] Constants frozen before schema freeze: `canvas`=560×480 and title band=104px on measured production Dutch copy (REQ-010)
- [ ] CHK-007 [P1] Schema branched by `layout_mode` (matrix/hub-spoke/routing/funnel/popover each have their own geometry contract) (REQ-011)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Skeleton output validates against `skeleton-schema.json`
- [ ] CHK-011 [P0] No console errors during gen-tile + audit run
- [ ] CHK-012 [P1] Preflight + downgrade error handling implemented (total downgrade path, no crash)
- [ ] CHK-013 [P1] Code follows the harness ESM `.mjs` patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All P0 acceptance criteria met (REQ-001..REQ-005, REQ-009..REQ-011)
- [ ] CHK-021 [P0] 2D holdout run complete; SC-001 (+8-12 pts vs the re-baselined scores, downgraded tiles excluded from the denominator) and SC-002 (gap ≥35% closed) verified
- [ ] CHK-022 [P1] Edge cases tested: 6th matrix row, 6 absolute nodes, title-claims-canvas, connector off-anchor
- [ ] CHK-023 [P1] Failure transitions validated: FAIL#1→best-of-3 (varying the named axis), FAIL#2→downgrade
- [ ] CHK-024 [P1] No templated-feel penalty: blind audit shows no new mass-produced anti-slop deduction across same-type tiles (SC-006)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each RC finding classed: RC-1/RC-2/RC-3 are `algorithmic` (geometry) defects, not instance-only
- [ ] CHK-FIX-002 [P0] Same-class producer inventory done: every place the harness authors geometry (`position:absolute`, x/y/w/h, transform) routed through the skeleton or proven out of scope
- [ ] CHK-FIX-003 [P0] Consumer inventory done for `buildA7Plan`, `auditA5Geometry`, ship-gate fields, JSONL rows, and docs
- [ ] CHK-FIX-004 [P0] Geometry invariant has adversarial table tests (diagram∩title, node collision, off-canvas, off-anchor, no-op linear bypass, downgrade fallback)
- [ ] CHK-FIX-005 [P1] Matrix axes + row count listed before completion (treatment × failure-state × legend)
- [ ] CHK-FIX-006 [P1] Arm-switch / env-state variant (`A5_ARM`) exercised for rollback
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA / explicit diff range, not a moving branch range
- [ ] CHK-FIX-008 [P1] best-of-3 varies a named axis (row-height/layout-mode/node-order); identical-candidate no-op guard tested so the three candidates are genuinely different geometries (REQ-004)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets (Z.AI API key from env)
- [ ] CHK-031 [P0] Skeleton input validated before render (schema + preflight)
- [ ] CHK-032 [P1] GLM output treated as untrusted; coordinate text rejected (`forbid_glm_coordinate_text`)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec/plan/tasks/decision-record synchronized
- [ ] CHK-041 [P1] Skeleton schema + glm_rules documented inline
- [ ] CHK-042 [P2] Parent `../spec.md` Phase 4 row + handoff updated if status changes
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp/experiment files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | [ ]/17 |
| P1 Items | 25 | [ ]/25 |
| P2 Items | 9 | [ ]/9 |

**Verification Date**: [pending — planning only]
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001 geometry ownership, ADR-002 best-of-3 variation axis, ADR-003 A7 renderer-first contract)
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale (prose contract, A5 GLM-coordinate-input, 3× GLM calls, identical-candidate best-of-3)
- [ ] CHK-103 [P2] Downgrade/linearization migration path documented
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback via `A5_ARM=control` documented and tested
- [ ] CHK-121 [P1] Downgrade-rate monitoring wired (`fallback_triggered` in JSONL)
- [ ] CHK-122 [P2] Handoff to 005 (GPT-5.5 escalation) criteria confirmed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Net prompt cost on affected 2D tiles within -100 to +400 tokens (NFR-P01)
- [ ] CHK-111 [P1] Browser geometry verification adds ≤ ~1.0s per tile; best-of-3 adds no GLM call (NFR-P02)
- [ ] CHK-112 [P2] Wall-clock median rise ≤ 20% vs control (cost guard)
- [ ] CHK-113 [P2] Token + latency deltas recorded in audit JSONL
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] House style, Product register V4/M2/D6, and palette unchanged (out-of-scope respected)
- [ ] CHK-131 [P1] No new third-party dependency added without review
- [ ] CHK-132 [P2] Generated tiles meet contrast gate (text ≥ 4.5:1, object/line ≥ 3:1)
- [ ] CHK-133 [P2] No banned tokens (e.g. `#4e4e4e`, `text-transform: uppercase`)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] spec/plan/tasks/checklist/decision-record/implementation-summary synchronized
- [ ] CHK-141 [P1] Skeleton schema + glm_rules documented at the source
- [ ] CHK-142 [P2] Parent `../spec.md` Phase 4 status + handoff reconciled
- [ ] CHK-143 [P2] Frozen schema constants recorded: title band 104px (A7) + canvas 560×480 on measured Dutch copy (Phase-0, REQ-010)
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| [Name] | Technical Lead | [ ] Approved | |
| [Name] | Bento Program Owner | [ ] Approved | |
| [Name] | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
