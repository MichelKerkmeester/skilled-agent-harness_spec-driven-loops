---
title: "Verification Checklist: A7 EARS Patterns, Constraint Tier, and REQ_COVERAGE Gate [template:level_2/checklist.md]"
description: "Verification Date: PLANNED, not yet built"
trigger_phrases:
  - "ears requirements checklist"
  - "constraint tier checklist"
  - "req coverage checklist"
  - "ac coverage clone checklist"
  - "ears linter checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/003-spec-data-quality/001-on-write-quality/007-ears-constraints-req-coverage"
    last_updated_at: "2026-07-04T17:12:00.863Z"
    last_updated_by: "markdown-agent"
    recent_action: "Added benchmark and flags-off checklist rows"
    next_safe_action: "Build the REQ_COVERAGE clone"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh"
      - ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: A7 EARS Patterns, Constraint Tier, and REQ_COVERAGE Gate

<!-- SPECKIT_LEVEL: 2 -->
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
- [ ] CHK-024 [P0] REQ_COVERAGE catch-rate is 1.0 on the planted unlinked-REQ fixture with zero false positives on a fully-linked fixture
- [ ] CHK-025 [P0] Flags-off run is byte-identical to the pre-phase baseline on a 005 sibling, proven by check-req-coverage.test.sh (REQ_COVERAGE and EARS_LINT register in validator-registry.json, not flag-ceiling.vitest.ts)
- [ ] CHK-026 [P1] First-run real-defect floor on the live 005 corpus surfaces at least one real unlinked REQ
- [ ] CHK-027 [P1] EARS_LINT swap-precision is 1.0 on the fixture set, advisory only and never blocking
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

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 13 | 0/13 |
| P2 Items | 2 | 0/2 |

**Verification Date**: PLANNED, not yet built
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
