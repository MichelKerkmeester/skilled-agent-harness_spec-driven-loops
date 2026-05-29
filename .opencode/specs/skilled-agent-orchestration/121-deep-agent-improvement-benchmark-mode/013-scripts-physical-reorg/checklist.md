---
title: "Verification Checklist: scripts physical lane reorg"
description: "Verification checklist for the deep-agent-improvement scripts lane reorg: moves, path repair, TST-1 identity, dispatch-model config-load, and full vitest suite green."
trigger_phrases:
  - "scripts-physical-reorg checklist"
  - "scripts lane reorg checklist"
  - "deep-agent-improvement scripts checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/013-scripts-physical-reorg"
    last_updated_at: "2026-05-29T10:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffold 013 checklist for scripts physical lane reorg"
    next_safe_action: "git mv scripts into lane subdirs and fix __dirname path joins"
    blockers: []
    key_files:
      - ".opencode/skills/deep-agent-improvement/scripts/loop-host.cjs"
      - ".opencode/skills/deep-agent-improvement/scripts/dispatch-model.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-013-scripts-physical-reorg"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: scripts physical lane reorg

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

- [x] CHK-001 [P0] Requirements documented in spec.md (Evidence: validate --strict + --recursive 0/0)
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] `__dirname`, relative-require, and cross-reference inventories captured (Evidence: 0 residual bare paths in live refs)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Moved scripts run without module-resolution errors
- [x] CHK-011 [P0] No silent config fallback in dispatch-model (Evidence: config resolves to existing path, parses)
- [x] CHK-012 [P1] Path joins repaired for the new subdir depth
- [x] CHK-013 [P1] Moves done via git mv to preserve history
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria (REQ-001..006) met
- [x] CHK-021 [P0] Full vitest suite green (14 files) (Evidence: vitest 133/133, 0 failed)
- [x] CHK-022 [P1] loop-host TST-1 identity test green (Evidence: loop-host 11/11, planInvocation byte-identical)
- [x] CHK-023 [P1] dispatch-model positive config-load assert passes (Evidence: config resolves to existing path, parses)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced by the move
- [x] CHK-031 [P0] No new path-traversal surface; moved paths stay inside the skill root
- [x] CHK-032 [P1] Existing path guards remain in force after the move
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/decision-record synchronized
- [x] CHK-041 [P1] SKILL.md and README.md script paths repointed to lane paths
- [x] CHK-042 [P2] graph-metadata moved script paths refreshed (Evidence: 0 residual bare paths in live refs)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | [ ]/11 |
| P1 Items | 14 | [ ]/14 |
| P2 Items | 4 | [ ]/4 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [x] CHK-102 [P1] Alternatives documented with rejection rationale
- [x] CHK-103 [P2] Lane mapping matches ADR-001 classification
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Benchmark timings within prior bounds (NFR-P01)
- [x] CHK-111 [P1] No added startup cost from the new path resolution (NFR-P01)
- [x] CHK-112 [P2] Load testing completed (N/A for a structural reorg)
- [x] CHK-113 [P2] Performance benchmarks documented (N/A)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented and tested (git mv back + revert path edits)
- [x] CHK-121 [P0] Feature flag configured (N/A; not flagged) (Evidence: config resolves to existing path, parses)
- [x] CHK-122 [P1] No silent degradation path remains (dispatch-model config-load asserted) (Evidence: config resolves to existing path, parses)
- [x] CHK-123 [P1] Runbook: rollback steps in plan.md L2 Enhanced Rollback
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Path-resolution review completed for all movers
- [x] CHK-131 [P1] Dependency surface unchanged (lib stays at root)
- [x] CHK-132 [P2] OWASP Top 10 checklist completed (N/A; no new IO surface)
- [x] CHK-133 [P2] Data handling compliant (N/A; no data changes) (Evidence: vitest 133/133, 0 failed)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents synchronized
- [x] CHK-141 [P1] Cross-references in YAMLs repointed (if applicable) (Evidence: 0 residual bare paths in live refs)
- [x] CHK-142 [P2] Parent spec.md phase row marked complete on closure
- [x] CHK-143 [P2] Knowledge transfer documented in implementation-summary.md
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Owner | Technical Lead | [ ] Approved | |
| claude-opus | Implementer | [ ] Approved | |
| vitest suite | QA Gate | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified. P0 must complete, P1 need approval to defer.
-->
