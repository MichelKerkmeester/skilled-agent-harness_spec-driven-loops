---
title: "Verification Checklist: numbered-H2 divider and TOC/anchor standard"
description: "Verification Date: 2026-08-13"
trigger_phrases:
  - "divider anchor checklist"
  - "029 verification checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/029-doc-divider-and-anchor-standard"
    last_updated_at: "2026-08-13T06:20:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored checklist; planning items verified, execution items pending"
    next_safe_action: "Execute Phase 2 after approval"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-029-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: numbered-H2 divider and TOC/anchor standard

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

**Status**: Draft / planning. Execution items are intentionally pending; this packet is not claiming completion.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..006 authored)
- [x] CHK-002 [P0] Technical approach defined in plan.md (3-phase: standard, enforce, normalize)
- [x] CHK-003 [P1] Dependencies identified (validator, template-rules, HVR, fleet) and census captured
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Validator change passes the sk-doc test suite
- [ ] CHK-011 [P0] No new false positives on the fleet dry-run
- [ ] CHK-012 [P1] Divider check is fence-aware and HTML-comment-transparent
- [ ] CHK-013 [P1] Change follows the existing code-folder-path patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All P0 acceptance criteria met (REQ-001..003)
- [ ] CHK-021 [P0] Negative control fails before the fix, passes after
- [ ] CHK-022 [P1] `007-valid-anchors` fixtures pass unchanged
- [ ] CHK-023 [P1] Census reports 0 gaps and 0 vestigial TOC/nav-anchors
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the validator, its callers, and every doc gate that runs it.
- [ ] CHK-FIX-004 [P0] Divider-insertion and anchor-strip logic include adversarial cases: fenced code, anchor-between-divider, H3 subsections, continuity anchors.
- [ ] CHK-FIX-005 [P1] Doc-type axes and file counts listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Fleet dry-run executed and its count read before enforcement is turned on.
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets involved (docs/validator packet)
- [ ] CHK-031 [P0] Validator input handling unchanged for untrusted paths
- [x] CHK-032 [P1] N/A: no auth/authz surface in this packet
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/research synchronized
- [ ] CHK-041 [P1] Validator inline comments explain the durable WHY (no ephemeral ids)
- [ ] CHK-042 [P2] Authority docs (core-standards, HVR) updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files (census script) live in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 3/12 |
| P1 Items | 13 | 4/13 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-08-13
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decision documented in decision-record.md (ADR-001)
- [x] CHK-101 [P1] ADR-001 has status (Accepted)
- [x] CHK-102 [P1] Alternative (TOC + double-dash) documented with rejection rationale
- [ ] CHK-103 [P2] Migration path for the fleet documented in tasks.md Phase 3
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Validator overhead within target (NFR-P01, under 5% per doc)
- [x] CHK-111 [P1] N/A: no throughput target for a validator rule
- [x] CHK-112 [P2] N/A: no load testing needed
- [x] CHK-113 [P2] N/A: no runtime benchmark needed
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback documented and tested (validator commit vs fleet commit, independent)
- [x] CHK-121 [P0] N/A: no feature flag (git-reversible docs/validator change)
- [ ] CHK-122 [P1] CI doc gate monitored on first run post-enforcement
- [x] CHK-123 [P1] N/A: no service runbook
- [x] CHK-124 [P2] N/A: no deployment runbook
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] N/A: no external security review needed
- [x] CHK-131 [P1] N/A: no new dependency licenses
- [x] CHK-132 [P2] N/A: no OWASP surface
- [x] CHK-133 [P2] N/A: no data-handling change
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents synchronized
- [x] CHK-141 [P1] N/A: no API surface
- [ ] CHK-142 [P2] sk-create-readme references confirmed consistent post-change
- [ ] CHK-143 [P2] Knowledge captured (consider a constitutional memory on the two-anchor-systems distinction)
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Owner | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
