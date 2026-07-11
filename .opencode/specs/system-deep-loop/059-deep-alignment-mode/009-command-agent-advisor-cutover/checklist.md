---
title: "Verification Checklist: Phase 9: command-agent-advisor-cutover"
description: "Verification Date: not yet run - phase is planned, not implemented"
trigger_phrases:
  - "verification"
  - "checklist"
  - "phase 009"
  - "cutover gates"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/009-command-agent-advisor-cutover"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Draft phase 009 verification checklist"
    next_safe_action: "Leave unchecked until T004-T011 execute"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-009"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 9: command-agent-advisor-cutover

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
- [ ] CHK-003 [P1] Phase 003 skeleton and phases 006-008 real-code dependencies identified and tracked
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Command/agent files pass lint/format checks (not yet written)
- [ ] CHK-011 [P0] No console errors or warnings (not yet written)
- [ ] CHK-012 [P1] Error handling implemented for the "mode not yet available" pre-cutover edge case
- [ ] CHK-013 [P1] Agent contract follows the deep-review LEAF-agent pattern with lane-aware translation
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria in spec.md REQ-001..005 met
- [ ] CHK-021 [P0] Manual end-to-end dry-run (command -> loop -> agent -> reducer -> report) complete
- [ ] CHK-022 [P1] Behavior benchmark's three minimum scenarios pass
- [ ] CHK-023 [P1] Advisor drift-guard test passes after registry + map updates
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Not applicable in this phase - no security/path/parser/redaction fix ships here (all five artifacts are net-new, modeled on read-only precedent).
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed (see plan.md Affected Surfaces).
- [ ] CHK-FIX-006 [P1] Not applicable - no process-wide state is read or mutated by command/agent/registry planning itself.
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range once code lands, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets in command/agent/registry code
- [ ] CHK-031 [P0] Input validation implemented for lane-args and command dispatch
- [ ] CHK-032 [P1] Not applicable - no new auth/authz surface in this phase
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Changelog entry added once this phase closes
- [ ] CHK-042 [P2] README updated for the new `/deep:alignment` command and `@deep-alignment` agent
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
| P0 Items | 9 | 0/9 |
| P1 Items | 9 | 0/9 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not yet run - phase is planned, not implemented.
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
