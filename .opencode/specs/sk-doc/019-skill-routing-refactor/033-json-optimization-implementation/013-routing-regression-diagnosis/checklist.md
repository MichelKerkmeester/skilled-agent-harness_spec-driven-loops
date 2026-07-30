---
title: "Verification Checklist: Routing Regression Diagnosis and Disposition"
description: "Verification checklist covering the reproduced two-point drop on holdout top-1, holdout top-3 and the delegation bucket."
trigger_phrases:
  - "013-routing-regression-diagnosis verification checklist"
importance_tier: "normal"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/013-routing-regression-diagnosis"
    last_updated_at: "2026-07-30T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored Level 3 phase spec"
    next_safe_action: "Begin execution per plan.md once upstream dependencies clear"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/013-routing-regression-diagnosis"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Verification Checklist: Routing Regression Diagnosis and Disposition

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Each item is marked complete only with evidence specific to that item. Evidence text is never reused across items — the defect this program is remediating was a checklist whose rows all shared one blob.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Upstream dependencies named in plan.md section 6 have cleared
- [ ] CHK-002 [P1] The phase's own citations were re-confirmed against the checked-out tree
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] Changes are surgical and confined to the scope declared in spec.md
- [ ] CHK-004 [P2] No ephemeral artifact label appears in any code comment
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] The relevant gate was run by exit code, not by reading its tail output
- [ ] CHK-006 [P1] A negative case was exercised where the phase adds or repairs a gate
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-007 [P0] Every requirement in spec.md section 4 has a matching evidence line
- [ ] CHK-008 [P1] Anything deliberately not done is recorded with a reason rather than omitted
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-009 [P2] No credential, token or absolute personal path enters a committed artifact
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-010 [P1] Status and completion fields agree with what the evidence supports
- [ ] CHK-011 [P2] Continuity frontmatter reflects the phase's real state at close
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P2] Artifacts live under the phase folder and follow the naming convention
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] CHK-013 [P0] `validate.sh <folder> --strict` reports Errors:0
- [ ] CHK-014 [P0] No completion claim in this phase outruns its evidence
- [ ] CHK-015 [P1] Each item above carries evidence unique to itself
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-016 [P0] The two changed routing surfaces were bisected independently rather than together
- [ ] CHK-017 [P1] The baseline sha was measured directly to settle caused-versus-inherited
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-018 [P1] The full metric set was re-measured after any fix, not only the metrics that had moved
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-019 [P0] Every baseline artifact is byte-identical to its pre-phase state
- [ ] CHK-020 [P0] An accepted regression carries written rationale and operator sign-off
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-022 [P1] The disposition and its rationale are written where a future reader will find them
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-021 [P1] Attribution states UNKNOWN where a movement could not be traced, rather than assigning blame by proximity
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:sign-off -->
## Sign-Off

- [ ] Operator has reviewed the disposition and its rationale
<!-- /ANCHOR:sign-off -->
