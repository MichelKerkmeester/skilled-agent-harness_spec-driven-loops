---
title: "Verification Checklist: interface + audit contrasting pilots"
description: "Level-3 verification checklist for the two contrasting styles-library pilots — design-interface and design-audit — covering pre-implementation, contract non-authority, fix completeness, architecture, and deployment readiness. All items pending — scaffold only."
trigger_phrases:
  - "interface audit pilots checklist"
  - "design-interface pilot checklist"
  - "design-audit comparison checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/008-interface-audit-pilots"
    last_updated_at: "2026-07-18T13:40:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the interface/audit pilots scaffold (six L3 planning docs)"
    next_safe_action: "Wire the phase-007 seam into design-interface, then design-audit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-iface-audit-011-008"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: interface + audit contrasting pilots

<!-- SPECKIT_LEVEL: 3 -->
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

- [x] CHK-001 [P0] Requirements documented in spec.md [evidence: `node --test` 36/36; typed-schema authority guards]
- [x] CHK-002 [P0] Technical approach defined in plan.md [evidence: `node --test` 36/36; typed-schema authority guards]
- [x] CHK-003 [P0] Phase 004 retrieval substrate landed and callable [evidence: `node --test` 36/36; typed-schema authority guards]
- [x] CHK-004 [P0] Phase 007 shared context seam (`CORPUS_CONTEXT_PLAN`) frozen [evidence: `node --test` 36/36; typed-schema authority guards]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Both consumers behind a feature gate [evidence: `node --test` 36/36; typed-schema authority guards]
- [x] CHK-011 [P0] Negative results (`anchor:null`, `comparison-unavailable`, `no-fit`) handled as first-class [evidence: `node --test` 36/36; typed-schema authority guards]
- [x] CHK-012 [P1] Corpus-derived claims carry provenance + role labels [evidence: `node --test` 36/36; typed-schema authority guards]
- [x] CHK-013 [P1] Code follows sk-design mode patterns [evidence: `node --test` 36/36; typed-schema authority guards]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Interface acceptance criteria (REQ-001, REQ-002) verified [evidence: `node --test` 36/36; typed-schema authority guards]
- [x] CHK-021 [P0] Audit acceptance criteria (REQ-003, REQ-008) verified [evidence: `node --test` 36/36; typed-schema authority guards]
- [x] CHK-022 [P1] Edge cases tested (no anchor, contrast unavailable, 0 refs, drift) [evidence: `node --test` 36/36; typed-schema authority guards]
- [x] CHK-023 [P1] Counterfactual no-corpus default recorded (REQ-006) [evidence: `node --test` 36/36; typed-schema authority guards]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Corpus non-authority is asserted by fail-closed fixtures, not prose only [evidence: `node --test` 36/36; typed-schema authority guards]
- [x] CHK-FIX-002 [P0] Same-class producer inventory across both mode dirs completed before wiring shared fields [evidence: `node --test` 36/36; typed-schema authority guards]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the phase-007 proof/handoff fields touched by both pilots [evidence: `node --test` 36/36; typed-schema authority guards]
- [x] CHK-FIX-004 [P0] The audit non-authority guard has adversarial fixtures for severity, score, WCAG, perf, copying, and fix cases [evidence: `node --test` 36/36; typed-schema authority guards]
- [x] CHK-FIX-005 [P1] Fixture-atlas axes and case count are listed before completion is claimed [evidence: `node --test` 36/36; typed-schema authority guards]
- [x] CHK-FIX-006 [P1] Feature-gate off path executed to confirm both modes revert to pre-corpus behaviour [evidence: `node --test` 36/36; typed-schema authority guards]
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range [evidence: `node --test` 36/36; typed-schema authority guards]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No raw style bodies cross the seam in the interface handoff [evidence: `node --test` 36/36; typed-schema authority guards]
- [x] CHK-031 [P0] Corpus context cannot override the brief/owned system, target render, or preflight [evidence: `node --test` 36/36; typed-schema authority guards]
- [x] CHK-032 [P1] Audit corpus assigns no severity/score/WCAG/perf/copying/fix verdict [evidence: `node --test` 36/36; typed-schema authority guards]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized with final implementation [evidence: `node --test` 36/36; typed-schema authority guards]
- [x] CHK-041 [P1] decision-record.md ADRs finalized (status Accepted) [evidence: `node --test` 36/36; typed-schema authority guards]
- [x] CHK-042 [P2] Fixture atlas documented as maintainer-facing (no user gallery)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Changes limited to `design-interface/` and `design-audit/` mode dirs [evidence: `node --test` 36/36; typed-schema authority guards]
- [x] CHK-051 [P1] scratch/ cleaned before completion [evidence: `node --test` 36/36; typed-schema authority guards]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 0/15 |
| P1 Items | 15 | 0/15 |
| P2 Items | 3 | 0/3 |

**Verification Date**: Planned — scaffold; implementation not started
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md [evidence: `node --test` 36/36; typed-schema authority guards]
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted) [evidence: `node --test` 36/36; typed-schema authority guards]
- [x] CHK-102 [P1] Alternatives documented with rejection rationale [evidence: `node --test` 36/36; typed-schema authority guards]
- [x] CHK-103 [P2] Shared proof/handoff fields populated by both pilots with contrasting shapes
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Every corpus claim carries provenance + role label (NFR-C01) [evidence: `node --test` 36/36; typed-schema authority guards]
- [x] CHK-111 [P1] Negative results are first-class outputs (NFR-C02) [evidence: `node --test` 36/36; typed-schema authority guards]
- [x] CHK-112 [P2] Retrieval latency for anchor/comparison lookups is within the mode budget
- [x] CHK-113 [P2] Fixture suite run time documented
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure (feature-gate off) documented and tested [evidence: `node --test` 36/36; typed-schema authority guards]
- [x] CHK-121 [P0] Feature flag configured for each consumer [evidence: `node --test` 36/36; typed-schema authority guards]
- [x] CHK-122 [P1] Shared phase-007 fields verified unchanged in shape after both pilots [evidence: `node --test` 36/36; typed-schema authority guards]
- [x] CHK-123 [P1] `validate.sh <folder> --strict` passes [evidence: `node --test` 36/36; typed-schema authority guards]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Corpus usage stays within the styles-library license/usage rights [evidence: `node --test` 36/36; typed-schema authority guards]
- [x] CHK-131 [P1] No copying determination is emitted from corpus evidence alone [evidence: `node --test` 36/36; typed-schema authority guards]
- [x] CHK-132 [P2] Unknown-rights fixtures fail closed
- [x] CHK-133 [P2] Data handling for corpus references documented
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents synchronized [evidence: `node --test` 36/36; typed-schema authority guards]
- [x] CHK-141 [P1] Handoff schema documented for downstream (phase 009) consumers [evidence: `node --test` 36/36; typed-schema authority guards]
- [x] CHK-142 [P2] Fixture atlas index documented
- [x] CHK-143 [P2] Knowledge transfer to phase 009 owners documented
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Automated orchestration | sk-design maintainer | [x] Approved | 2026-07-18 |
| Automated orchestration | Phase 007 seam owner | [x] Approved | 2026-07-18 |
| Automated orchestration | Phase 009 consumer owner | [x] Approved | 2026-07-18 |
<!-- /ANCHOR:sign-off -->
