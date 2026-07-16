---
title: "Verification Checklist: Audit and harden graph-metadata.json child-drift, where a phase parent's children_ids silently lags the phase-child folders present on disk [template:level_3/checklist.md]"
description: "Verification Date: 2026-07-06"
trigger_phrases:
  - "graph-metadata drift checklist"
  - "children_ids verification"
  - "drift check sign off"
  - "phase parent audit checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-spec-data-quality/051-graph-metadata-child-drift-audit-and-harden"
    last_updated_at: "2026-07-06T12:51:15.752Z"
    last_updated_by: "michel-kerkmeester"
    recent_action: "Authored Level 3 verification checklist for graph-metadata child-drift audit + harden"
    next_safe_action: "Author decision-record.md and implementation-summary.md for this phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata.sh"
      - ".opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/051-graph-metadata-child-drift-audit-and-harden"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Audit and harden graph-metadata.json child-drift, where a phase parent's children_ids silently lags the phase-child folders present on disk

<!-- SPECKIT_LEVEL: 3 -->
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

- [ ] CHK-001 [P0] Requirements documented in spec.md (unsupported)
- [ ] CHK-002 [P0] Technical approach defined in plan.md (unsupported)
- [x] CHK-003 [P1] Dependencies identified and available — registry runtime path confirmed; no orchestrator or validate.sh rebuild needed. [EVIDENCE: implementation-summary.md How It Was Delivered]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks (unsupported)
- [x] CHK-011 [P0] No console errors or warnings — default-path advisory confirmed with 0 warnings. [EVIDENCE: implementation-summary.md Verification table]
- [ ] CHK-012 [P1] Error handling implemented (unsupported)
- [x] CHK-013 [P1] Code follows project patterns — distinct registry rule reuses the shared writer-mirroring scanner. [EVIDENCE: implementation-summary.md What Was Built and How It Was Delivered]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (deferred — see implementation-summary.md)
- [x] CHK-021 [P0] Manual testing complete — repo-wide audit ran and default-path firing was confirmed. [EVIDENCE: implementation-summary.md Verification table]
- [x] CHK-022 [P1] Edge cases tested — RED/GREEN, clean, underscore-writer-pattern, extra-not-drift, leaf, and integration cases passed. [EVIDENCE: implementation-summary.md Verification table]
- [x] CHK-023 [P1] Error scenarios validated — advisory and enforce modes both exercised. [EVIDENCE: implementation-summary.md Verification table]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. (unsupported)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. — repo-wide audit found and classified 21 drifted parents. [EVIDENCE: implementation-summary.md Verification table]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. — default validate path and registry wiring were confirmed. [EVIDENCE: implementation-summary.md Verification table]
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. (N/A)
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. — audit classified 21 drifted parents and no-false-positive cases. [EVIDENCE: implementation-summary.md Verification table]
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. (N/A)
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. (unsupported)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets (unsupported)
- [x] CHK-031 [P0] Input validation implemented — unreadable graph metadata is delegated to the presence/shape checks. [EVIDENCE: implementation-summary.md How It Was Delivered]
- [ ] CHK-032 [P1] Auth/authz working correctly (N/A)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized (unsupported)
- [ ] CHK-041 [P1] Code comments adequate (unsupported)
- [ ] CHK-042 [P2] README updated (if applicable) (N/A)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only (unsupported)
- [ ] CHK-051 [P1] scratch/ cleaned before completion (unsupported)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 6/15 |
| P1 Items | 23 | 5/23 |
| P2 Items | 9 | 1/9 |

**Verification Date**: 2026-07-06
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md (unsupported)
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted) (unsupported)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale (unsupported)
- [ ] CHK-103 [P2] Migration path documented (if applicable) (deferred — see implementation-summary.md)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Response time targets met (NFR-P01) (N/A)
- [ ] CHK-111 [P1] Throughput targets met (NFR-P02) (N/A)
- [ ] CHK-112 [P2] Load testing completed (N/A)
- [ ] CHK-113 [P2] Performance benchmarks documented (N/A)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented and tested (unsupported)
- [x] CHK-121 [P0] Feature flag configured (if applicable) — enforce flag documented as advisory by default and blocking only when enabled. [EVIDENCE: implementation-summary.md Key Decisions]
- [ ] CHK-122 [P1] Monitoring/alerting configured (N/A)
- [ ] CHK-123 [P1] Runbook created (N/A)
- [ ] CHK-124 [P2] Deployment runbook reviewed (N/A)
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Security review completed (unsupported)
- [ ] CHK-131 [P1] Dependency licenses compatible (N/A)
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed (N/A)
- [ ] CHK-133 [P2] Data handling compliant with requirements (N/A)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized (unsupported)
- [ ] CHK-141 [P1] API documentation complete (if applicable) (N/A)
- [ ] CHK-142 [P2] User-facing documentation updated (N/A)
- [x] CHK-143 [P2] Knowledge transfer documented — implementation summary records shipped behavior, verification, and limitations. [EVIDENCE: implementation-summary.md Verification and Known Limitations]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Unassigned | Technical Lead | [ ] Approved | |
| Unassigned | Product Owner | [ ] Approved | |
| Unassigned | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
