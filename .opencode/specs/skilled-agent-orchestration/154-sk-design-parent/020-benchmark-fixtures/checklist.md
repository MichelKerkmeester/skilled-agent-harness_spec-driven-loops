---
title: "Verification Checklist: sk-design checked-in routing-benchmark fixtures"
description: "Verification Date: not started"
trigger_phrases:
  - "sk-design benchmark fixtures checklist"
  - "motion benchmark report checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/020-benchmark-fixtures"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the Level-2 checklist, all items pending"
    next_safe_action: "Mark items with evidence as the fixtures and reports land"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-020-benchmark-fixtures"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: sk-design checked-in routing-benchmark fixtures

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
- [ ] CHK-003 [P1] The 014 report-pair shape and the five playbooks read before deriving fixtures
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Each fixture is derived from a manual_testing_playbook scenario and cites its scenario id
- [ ] CHK-011 [P0] The motion report is labelled by mode and stored under the motion benchmark path
- [ ] CHK-012 [P1] The fixtures match the existing 014 report-pair shape so the harness consumes them
- [ ] CHK-013 [P1] Adversarial scenarios seed fixtures whose expected outcome is the abstention, not a positive route
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] The skill-benchmark runs against the seeded fixtures for all five modes and produces reports
- [ ] CHK-021 [P0] Motion has its own checked-in benchmark report artifact
- [ ] CHK-022 [P1] Each claimed score is reproducible from the checked-in fixtures
- [ ] CHK-023 [P1] A mode with a different scenario count still produces a complete fixture set
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] The fixtures gap is classed `matrix/evidence`: it spans five modes, so the fixture set covers all five
- [ ] CHK-FIX-002 [P0] The full set of modes lacking checked-in fixtures is inventoried, confirming all five are seeded
- [ ] CHK-FIX-003 [P0] Consumers of the fixtures (the skill-benchmark harness and the per-mode reports) are exercised together
- [ ] CHK-FIX-004 [P0] The adversarial and differing-count cases are covered, not just the simple positive routes
- [ ] CHK-FIX-005 [P1] The fixture axes (five modes by scenario) and counts are listed before completion is claimed
- [ ] CHK-FIX-006 [P1] The motion-report-placement variant is verified, not assumed
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets introduced by the fixtures or the captured reports
- [ ] CHK-031 [P0] Fixture prompts carry no credentials or private URLs
- [ ] CHK-032 [P1] The captured reports contain no environment-specific secret paths
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md, plan.md, and tasks.md stay synchronized with the seeded fixtures and reports
- [ ] CHK-041 [P1] The 014 benchmark index or README notes the per-mode fixture sets if one exists
- [ ] CHK-042 [P2] The baseline is labelled pre-fix so later phases measure improvement against it
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Fixtures and reports confined to the `014-routing-benchmark/<mode>/` tree
- [ ] CHK-051 [P1] No stray temp files left in the packet
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 12 | 0/12 |
| P2 Items | 2 | 0/2 |

**Verification Date**: not started
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
