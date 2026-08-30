---
title: "Checklist: Acceptance Criteria Template as Packet Closure Gate"
description: "Verification checklist for the acceptance-criteria template, the closure rule and its negative controls."
trigger_phrases:
  - "acceptance criteria checklist"
  - "ac closure verification"
  - "closure gate qa"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-spec-kit-template-optimization/002-acceptance-criteria-template"
    last_updated_at: "2026-08-29T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Built the acceptance-criteria template, contract entry and closure gate"
    next_safe_action: "Execute the reference sweep and close the remaining criteria"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-ac-closure.sh"
    session_dedup:
      fingerprint: "sha256:8eeb64bbcde58f67578649e27a9594e48326a43e39100968dc7a4bc99f8f3f1d"
      session_id: "2026-08-29-033-002-acceptance-criteria-template"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---

# Verification Checklist: Acceptance Criteria Template as Packet Closure Gate

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

- [x] CHK-001 [P0] Requirements documented in spec.md - REQ-001..REQ-008 (`spec.md:124`)
- [x] CHK-002 [P0] Technical approach defined in plan.md - contract-driven validation (`plan.md:55`)
- [x] CHK-003 [P1] Dependencies identified and available - `AC_COVERAGE` present (`scripts/lib/validator-registry.json:89`)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks - `bash -n check-ac-closure.sh` and `bash -n check-ac-coverage.sh` both clean
- [x] CHK-011 [P0] No console errors or warnings - registry bridge returns parseable output (`validate.sh --json`)
- [x] CHK-012 [P1] Error handling implemented - unreadable Created date degrades to pre-cutoff (`scripts/rules/check-ac-closure.sh:44`)
- [x] CHK-013 [P1] Code follows project patterns - mirrors `check-ac-coverage.sh` rule shape and the `CANONICAL_SAVE_CUTOFF` constant pattern
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete - eight-case fixture, all behaving as specified (`scripts/rules/check-ac-closure.sh:108`)
- [x] CHK-022 [P1] Edge cases tested - waiver with no ADR, waiver citing a missing ADR, unreadable date, empty criteria table (`scripts/rules/check-ac-closure.sh:44`, `scripts/rules/check-ac-closure.sh:186`)
- [x] CHK-023 [P1] Error scenarios validated - both negative controls fail as required (`scripts/rules/check-ac-closure.sh:194`, `scripts/rules/check-ac-closure.sh:212`)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

---

<!-- ANCHOR:ac-traceability -->
## Acceptance Criteria Traceability

| AC-ID | Class | Evidence |
|-------|-------|----------|
| AC-001 | tested | `templates/addons/acceptance-criteria.md.tmpl:1` |
| AC-002 | tested | `templates/spec-kit-docs.json:1` |
| AC-003 | tested | `scripts/rules/check-ac-closure.sh:108` |
| AC-004 | tested | `scripts/rules/check-ac-closure.sh:97` |
| AC-005 | tested | `scripts/rules/check-ac-coverage.sh:96` |
| AC-006 | tested | `scripts/rules/check-ac-closure.sh:36` |
| AC-007 | tested | `README.md:169` |
| AC-008 | tested | `templates/core/spec.md.tmpl:134` |
<!-- /ANCHOR:ac-traceability -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 5/11 |
| P1 Items | 12 | 6/12 |
| P2 Items | 6 | 0/6 |

**Verification Date**: 2026-08-29
<!-- /ANCHOR:summary -->

---

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted) - ADR-001 and ADR-002 both Accepted (`decision-record.md`)
- [x] CHK-102 [P1] Alternatives documented with rejection rationale - three options scored per ADR (`decision-record.md`)
- [ ] CHK-103 [P2] Migration path documented (if applicable)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Response time targets met (NFR-P01)
- [ ] CHK-111 [P1] Throughput targets met (NFR-P02)
- [ ] CHK-112 [P2] Load testing completed
- [ ] CHK-113 [P2] Performance benchmarks documented
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented and tested - `SPECKIT_AC_CLOSURE=false` disables the gate without file edits (`plan.md:121`)
- [ ] CHK-121 [P0] Feature flag configured (if applicable)
- [ ] CHK-122 [P1] Monitoring/alerting configured
- [ ] CHK-123 [P1] Runbook created
- [ ] CHK-124 [P2] Deployment runbook reviewed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Security review completed
- [ ] CHK-131 [P1] Dependency licenses compatible
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed
- [ ] CHK-133 [P2] Data handling compliant with requirements
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] API documentation complete (if applicable)
- [ ] CHK-142 [P2] User-facing documentation updated
- [ ] CHK-143 [P2] Knowledge transfer documented
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Technical Lead | [ ] Approved | |
| Operator | Product Owner | [ ] Approved | |
| Operator | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---


