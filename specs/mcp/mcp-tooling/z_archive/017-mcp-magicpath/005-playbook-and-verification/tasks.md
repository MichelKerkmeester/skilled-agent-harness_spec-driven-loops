---
title: "Tasks: Playbook and end-to-end verification"
description: "Ordered work for authoring, executing and recording the MagicPath operator scenarios and the assembled-chain proof."
trigger_phrases:
  - "magicpath playbook tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Playbook and end-to-end verification

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Enumerate a sibling playbook's category structure as the shape to match
- [ ] T002 Record the installed CLI version, so every later result is attributable to a build
- [ ] T003 [P] Decide the credential state each scenario category requires
- [ ] T004 [P] Confirm which scenarios remain runnable on a machine that has never authenticated
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Author and run the routing scenarios, including one using phrasing the mode's aliases do not anticipate
- [ ] T006 Author and run a scenario per registered tool
- [ ] T007 Author and run both credential-state scenarios, recording the refusal message verbatim
- [ ] T008 Author and run the mutation-boundary scenarios against a disposable target, cleaning up within the scenario
- [ ] T009 [P] Record each scenario's result beside it, so the playbook carries its own evidence
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Run the whole chain once from a naturally phrased request and record the request, the route taken, and the data returned
- [ ] T011 Confirm every authored scenario has a recorded result, and treat any unrun scenario as blocking
- [ ] T012 Fix any defect the verification exposed, with its evidence attached
- [ ] T013 [P] Scan every recorded result for credential values before close
- [ ] T014 Confirm no remote state created during the scenarios survives the phase
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The chain answers end to end and every scenario carries a recorded result
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:protocol -->
## Verification Checklist

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
- [ ] CHK-003 [P1] The installed CLI version is recorded before any scenario runs
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P1] The playbook matches the sibling category structure rather than a flat list
- [ ] CHK-011 [P1] Each scenario is written to be run by someone who did not build the bridge
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria in spec.md are met
- [ ] CHK-021 [P0] Every scenario was executed and carries a recorded result
- [ ] CHK-022 [P0] The end-to-end run is recorded with request, route and returned data
- [ ] CHK-023 [P0] The uncredentialed refusal is exercised and its message recorded
- [ ] CHK-024 [P1] At least one routing scenario uses unanticipated phrasing
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Any defect verification exposed is fixed here with evidence, not deferred silently
- [ ] CHK-FIX-002 [P1] Missing capabilities are recorded as follow-ups rather than added under this phase
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] No recorded result contains a credential value
- [ ] CHK-032 [P0] No remote state created during scenarios survives the phase
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks stay synchronized with what shipped
- [ ] CHK-041 [P1] The playbook records the CLI version it was verified against
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
| P0 Items | 10 | 0/10 |
| P1 Items | 9 | 0/9 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->

---
