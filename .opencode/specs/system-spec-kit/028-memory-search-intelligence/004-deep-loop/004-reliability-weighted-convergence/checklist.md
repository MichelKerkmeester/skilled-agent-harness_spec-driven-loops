---
title: "Verification Checklist: Reliability-Weighted Convergence"
description: "Level 3 checklist for the deep-loop reliability cluster. All executable candidates remain PENDING behind the benchmark gate, the shared f64 Beta primitive and the D2 keystone signal."
trigger_phrases:
  - "reliability convergence checklist"
  - "deep loop beta posterior checklist"
  - "contradiction quarantine verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/004-deep-loop/004-reliability-weighted-convergence"
    last_updated_at: "2026-06-19T10:00:00+02:00"
    last_updated_by: "codex"
    recent_action: "Added the Level 3 checklist for the reliability-weighted convergence cluster"
    next_safe_action: "Run the benchmark gate, then build D-orderhelper and the f64 Beta primitive before D2"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-004-004-replan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Reliability-Weighted Convergence

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim implementation done until complete |
| **[P1]** | Required | Must complete or stay explicitly deferred |
| **[P2]** | Optional | Can defer with a recorded reason |

Status: planning is complete. Implementation is PENDING because the benchmark gate, D1 f64 primitive, D2 reliability signal and D3 threshold recalibration have not landed.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: spec.md sections 2 through 5.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: plan.md sections 3 and 4.
- [x] CHK-003 [P1] Dependencies identified. Evidence: plan.md section 6 and decision-record.md ADR-001.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `node --check` and `tsc` pass on touched modules.
- [ ] CHK-011 [P0] Policy OFF path is byte-identical to baseline.
- [ ] CHK-012 [P1] Error handling rejects unreachable policy configs and fractional input stays out of the integer scorer.
- [ ] CHK-013 [P1] Code follows existing scorer, signal and convergence patterns.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Benefit micro-benchmark captured and used as the GO/HOLD gate.
- [ ] CHK-021 [P0] D1, D2, D3 and Q2 acceptance tests pass.
- [ ] CHK-022 [P1] Edge cases tested: all-0.5 reliability, missing reliability, equal-trust contradiction and unreachable policy.
- [ ] CHK-023 [P1] Error scenarios validated: integer scorer still throws on fractional input and Q2 never deletes a node.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each candidate has a class and status. Evidence: spec.md section 3 scope table.
- [x] CHK-FIX-002 [P0] Same-class producer inventory recorded. Evidence: plan.md FIX ADDENDUM.
- [x] CHK-FIX-003 [P0] Consumer inventory recorded. Evidence: plan.md affected surfaces and dependencies.
- [ ] CHK-FIX-004 [P0] Adversarial tests cover Beta monotonicity, Q2 deterministic victim choice and policy OFF parity.
- [ ] CHK-FIX-005 [P1] Matrix axes listed in tests: reliability regime, policy state, source count and contradiction trust.
- [ ] CHK-FIX-006 [P1] Hostile config variant executed for D4.
- [ ] CHK-FIX-007 [P1] Evidence pinned to scoped candidate commits when built.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced by planning docs.
- [ ] CHK-031 [P0] D2 remains read-only and introduces no writer to `metadata.reliability`.
- [ ] CHK-032 [P1] Q2 quarantine retains both contradiction nodes and excludes by read-path edge presence only.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree that all candidates are PENDING and none shipped in 030.
- [x] CHK-041 [P1] Architectural decisions recorded in decision-record.md.
- [x] CHK-042 [P2] README update not applicable for internal runtime planning.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files are not used outside scratch.
- [x] CHK-051 [P1] Level 3 spec-doc set is present.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [x] CHK-ARCH-001 [P0] Dependency graph documented. Evidence: plan.md dependency graph and critical path.
- [x] CHK-ARCH-002 [P0] Shared f64 Beta primitive decision recorded. Evidence: decision-record.md ADR-001.
- [ ] CHK-ARCH-003 [P1] D2 consumers verified against the final module signature.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Performance Verification

- [ ] CHK-PERF-001 [P0] Benefit micro-benchmark captured before GO.
- [ ] CHK-PERF-002 [P1] Policy OFF baseline remains byte-identical.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Deployment Readiness

- [x] CHK-DEPLOY-001 [P0] Default-off policy required before any consumer can affect STOP.
- [ ] CHK-DEPLOY-002 [P1] Rollback tested through policy OFF and scoped revert.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

- [x] CHK-COMP-001 [P0] D2 read-only invariant documented.
- [ ] CHK-COMP-002 [P1] No writer to `metadata.reliability` introduced.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

- [x] CHK-DOC-001 [P0] Spec, plan, tasks, checklist, ADR and summary present.
- [x] CHK-DOC-002 [P1] Packet 030 separation documented.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: Sign-Off

| Role | Status | Evidence |
|------|--------|----------|
| Planning author | Complete | This checklist and implementation-summary.md |
| Implementer | Pending | Candidate commits not landed |
| Reviewer | Pending | Benchmark and adversarial review not run |
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 4/10 |
| P1 Items | 10 | 5/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-19

Unchecked items are implementation and test gates. They remain open until the benchmark, D1, D2, D3, D4, Q2, Q2-seat and Q7 work lands.
<!-- /ANCHOR:summary -->
