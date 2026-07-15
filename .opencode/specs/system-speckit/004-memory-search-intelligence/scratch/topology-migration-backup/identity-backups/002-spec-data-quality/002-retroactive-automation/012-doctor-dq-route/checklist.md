---
title: "Verification Checklist: B2 Guarded data-quality Route on /doctor [template:level_2/checklist.md]"
description: "Verification Date: 2026-06-21"
trigger_phrases:
  - "doctor dq route checklist"
  - "data-quality route verification"
  - "dq route qa items"
  - "doctor route validate checklist"
  - "guarded dq route checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-spec-data-quality/002-retroactive-automation/012-doctor-dq-route"
    last_updated_at: "2026-07-04T17:12:09.850Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored checklist.md for the B2 doctor dq route scaffold"
    next_safe_action: "Verify items once the route asset is built"
    blockers: []
    key_files:
      - ".opencode/commands/doctor/_routes.yaml"
      - ".opencode/commands/doctor/assets/doctor_data-quality.yaml"
      - ".opencode/commands/doctor/scripts/route-validate.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-phase-author"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: B2 Guarded data-quality Route on /doctor

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
- [ ] CHK-003 [P1] B1 dq-engine seam available and exposing runDetectors
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Route asset passes the YAML and route schema checks
- [ ] CHK-011 [P0] No console errors or warnings on a default run
- [ ] CHK-012 [P1] The DB-path apply halts with the mutation-violation error
- [ ] CHK-013 [P1] The route mirrors the doctor_code-graph and doctor_memory patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Default run and confirm run verified on a scratch packet
- [ ] CHK-022 [P1] Dry-run-with-confirm applies nothing and prints the would-apply set
- [ ] CHK-023 [P1] Approval-gate abort honored with STATUS=CANCELLED
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
- [ ] CHK-031 [P0] validate_targets allows only the docs and the two JSONs, forbids the databases
- [ ] CHK-032 [P1] allowFixClass pinned to ['safe'], no body fix can pass the gate
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
| P0 Items | 11 | 0/11 |
| P1 Items | 12 | 0/12 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-06-21
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
