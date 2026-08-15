---
title: "Verification Checklist: Phase 011 Meaning-Judge Wiring"
description: "Planned verification gates for production composition, local judgment, exact-original failure behavior, and egress privacy."
trigger_phrases:
  - "meaning-judge-wiring"
  - "verification checklist"
  - "quality gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/011-meaning-judge-wiring"
    last_updated_at: "2026-08-13T00:00:00.000Z"
    last_updated_by: "codex"
    recent_action: "Authored the planned meaning-judge verification gates."
    next_safe_action: "Collect evidence while executing tasks.md."
    blockers: []
    key_files:
      - "checklist.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-011-scaffold-20260813"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
---
# Verification Checklist: Phase 011 Meaning-Judge Wiring

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | Hard blocker | Cannot close Phase 011 until complete |
| **P1** | Required | Complete or obtain explicit user-approved deferral |
| **P2** | Optional | May defer with a documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Eight requirements and six acceptance scenarios are documented.
- [ ] CHK-002 [P0] Stage order, local boundary, and exact-original terminal states are frozen.
- [ ] CHK-003 [P1] Production and evaluation-only module graphs are inventoried.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] One typed production composition owns the full gate order.
- [ ] CHK-011 [P0] The judge interface remains reject-only.
- [ ] CHK-012 [P1] Every unavailable state maps explicitly to exact-original.
- [ ] CHK-013 [P1] Evaluation-only proxy code remains outside production imports.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] The local judge runs after deterministic restoration and before render selection.
- [ ] CHK-021 [P0] Rejection and deterministic validation failure return exact-original.
- [ ] CHK-022 [P0] Timeout, cancellation, exception, absence, and invalid output return exact-original.
- [ ] CHK-023 [P1] Hosted-egress canaries prove source and restored candidate text stay local.
- [ ] CHK-024 [P1] The package gate passes from final state.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] Candidate producers, gate consumers, and evaluation-only modules are inventoried.
- [ ] CHK-031 [P0] Validation, judge terminal-state, transport, and render axes are recorded.
- [ ] CHK-032 [P0] Failure, timeout, cancellation, missing, malformed, no-op, and fallback cases are covered.
- [ ] CHK-033 [P1] Evidence is pinned to the final scoped diff.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] No decoded source or restored candidate text reaches hosted transport.
- [ ] CHK-041 [P0] Judge input is limited to the local or separately approved boundary.
- [ ] CHK-042 [P1] Every ambiguous judge outcome fails closed.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] Spec, plan, tasks, decision, checklist, and module graph agree.
- [ ] CHK-051 [P1] Parent map and adjacent-phase navigation match final status.
- [ ] CHK-052 [P2] Runtime judge configuration is documented where public.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P1] Temporary judge and egress evidence stays in `scratch/` or an isolated temporary directory.
- [ ] CHK-061 [P1] Task-created temporary output is removed before completion.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 items | 15 | 0/15 |
| P1 items | 13 | 0/13 |
| P2 items | 1 | 0/1 |

**Verification status**: Planned; no implementation evidence has been collected.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## Architecture Verification

- [ ] CHK-100 [P0] The local post-restoration reject-only decision is documented.
- [ ] CHK-101 [P1] Decision status and boundary owner are recorded.
- [ ] CHK-102 [P1] Disabled, hosted, proxy-reviewer, and local-judge alternatives are compared.
- [ ] CHK-103 [P1] Implementation matches the accepted composition decision.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## Performance Verification

- [ ] CHK-110 [P1] Judge deadline and fallback latency are measured under stated conditions.
- [ ] CHK-111 [P2] Baseline/final projection latency delta is documented if material.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## Deployment Readiness

- [ ] CHK-120 [P0] Disabling or losing the judge yields exact-original without hosted fallback.
- [ ] CHK-121 [P1] Judge reason codes contain no source or candidate content.
- [ ] CHK-122 [P1] Successor handoff records the production composition boundary.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## Compliance Verification

- [ ] CHK-130 [P0] Privacy review confirms no second hosted plaintext egress.
- [ ] CHK-131 [P1] Added local runtime dependencies and licenses are reviewed if applicable.
- [ ] CHK-132 [P1] Judge data handling matches the declared local boundary.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## Documentation Verification

- [ ] CHK-140 [P1] All required Level 3 documents pass strict validation.
- [ ] CHK-141 [P1] Public composition and fallback contracts are documented.
- [ ] CHK-142 [P1] Completion evidence reports observed terminal-state and egress checks.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Privacy owner | Judge boundary | Pending | Not yet reviewed |
| Implementer | Technical | Pending | Not started |
| Reviewer | Fidelity and quality | Pending | Not started |
<!-- /ANCHOR:sign-off -->
