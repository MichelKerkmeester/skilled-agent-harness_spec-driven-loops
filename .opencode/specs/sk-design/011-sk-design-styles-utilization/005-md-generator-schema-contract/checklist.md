---
title: "Verification Checklist: design-md-generator v3 schema contract"
description: "Verification checklist for the versioned v3 schema authority: single-source manifest, capability-driven Quick Start, hard-vs-advisory validation, de-literalized corpus fixtures, and schema-drift sentinel. Planned scaffold; implementation not started, all items pending."
trigger_phrases:
  - "md generator schema checklist"
  - "v3 schema verification"
  - "schema contract checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/005-md-generator-schema-contract"
    last_updated_at: "2026-07-18T13:40:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the v3 schema-contract L3 scaffold docs"
    next_safe_action: "Implement the v3 schema manifest as the single section authority"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-mdgen-schema-011-005"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: design-md-generator v3 schema contract

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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Phase 004 retrieval substrate available and interface pinned
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Backend passes lint/type checks
- [ ] CHK-011 [P0] One versioned v3 manifest is the sole schema authority
- [ ] CHK-012 [P1] No schema fact redefined outside the manifest
- [ ] CHK-013 [P1] `emitQuickStart` derives Quick Start groups from manifest capabilities
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Counterfactual schema/emitter tests pass (schema mutation propagates)
- [ ] CHK-021 [P0] Schema-drift sentinel fails on consumer divergence
- [ ] CHK-022 [P1] Advisory-never-rejects: corpus-divergent target-valid doc passes with warnings
- [ ] CHK-023 [P1] Fixture leak assertion: no source literals/assets in fixtures
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

- [ ] CHK-030 [P0] Provenance violations remain HARD failures
- [ ] CHK-031 [P0] Corpus never alters target-measured values (iron rule enforced in code)
- [ ] CHK-032 [P1] De-literalized fixtures carry no source-specific literals/assets
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Integration points named (emitQuickStart, validateDesignMd, checkSectionCompleteness, report-gen)
- [ ] CHK-042 [P2] Manifest versioning documented
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 0/15 |
| P1 Items | 23 | 0/23 |
| P2 Items | 9 | 0/9 |

**Verification Date**: Pending — scaffold; implementation not started
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Data-flow diagram matches final implementation
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Schema resolution adds negligible per-generation overhead (NFR-P01)
- [ ] CHK-111 [P1] Corpus baseline loads in-process without per-generation retrieval (NFR-P02)
- [ ] CHK-112 [P2] Advisory strata computation stays bounded
- [ ] CHK-113 [P2] Performance benchmarks documented
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented and tested
- [ ] CHK-121 [P0] Golden DESIGN.md outputs captured for regression comparison
- [ ] CHK-122 [P1] Successor phase (006 STUDY exemplars) handoff notes recorded
- [ ] CHK-123 [P1] Backend baseline behavior snapshot captured
- [ ] CHK-124 [P2] Migration notes reviewed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Iron-rule review completed (no target-value corpus bleed)
- [ ] CHK-131 [P1] Fixture provenance review completed
- [ ] CHK-132 [P2] No source-specific assets embedded in artifacts
- [ ] CHK-133 [P2] Advisory strata cannot cause majority-rejection
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] Manifest schema documented
- [ ] CHK-142 [P2] Consumer migration notes updated
- [ ] CHK-143 [P2] Knowledge transfer to phase 006 documented
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Pending | Technical Lead | [ ] Approved | |
| Pending | sk-design Owner | [ ] Approved | |
| Pending | QA Reviewer | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
