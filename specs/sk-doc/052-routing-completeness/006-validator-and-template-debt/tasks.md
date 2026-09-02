---
title: "Tasks: Phase 6: validator-and-template-debt"
description: "The ordered work of the validator and template phase, each task carrying the commit or the run that closed it."
trigger_phrases:
  - "validator template debt tasks"
  - "payload scanning checklist"
  - "boilerplate rewrite evidence"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/052-routing-completeness/006-validator-and-template-debt"
    last_updated_at: "2026-09-02T18:47:58Z"
    last_updated_by: "claude-code"
    recent_action: "Marked the phase tasks done with evidence"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-006-validator-and-template-debt"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: validator-and-template-debt

<!-- SPECKIT_LEVEL: 3 -->

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

- [x] T001 Read the durable directive and carry its three decisions (`goal.md`) - evidence: D1 to D3 in `spec.md` section 4
- [x] T002 Re-derive the template blocker count with payload scanning on - evidence: 24 of 40 in this tree, against an unmeasured zero
- [x] T003 [P] Re-derive the boilerplate document count rather than trusting the finding - evidence: fifty-six, not forty-eight
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Remove the banned character from the verbatim binding line (`.../sk-create-repo-rule/assets/repo-rule-template.md`) - evidence: `c1b3b780c3`
- [x] T005 Re-derive the measured table in the rule anatomy contract (`.../sk-create-repo-rule/references/rule-anatomy.md`) - evidence: `c1b3b780c3`, five of nine rows had drifted
- [x] T006 State that a template is scanned with `--include-code` and a zero without it is unmeasured (`.../scope-and-exemptions.md`) - evidence: `c1b3b780c3`
- [x] T007 Strip the punctuation from the plan template scaffold line (`.opencode/skills/system-spec-kit/templates/core/plan.md.tmpl`) - evidence: `9ae247d772`
- [x] T008 Re-capture the golden snapshots against the corrected template - evidence: `9ae247d772`
- [x] T009 Add overview sections to fourteen documents, leaving two fixtures exempt - evidence: `d87e8dd162`
- [x] T010 Add the fixture-tree exemption to the document validator - evidence: `d229b0a24d`, releasing 485 tracked files
- [x] T011 Make a template detectable by name and location so its payload is read - evidence: `d229b0a24d`
- [x] T012 Rewrite the superseded scaffold line in fifty-six planning documents - evidence: `d229b0a24d`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run the seeded-blocker negative control on a template payload - evidence: re-run 2026-09-02, a blocker seeded inside a fence gives 1 hard blocker and exit 1, and removing it gives 0 and exit 0
- [x] T014 Run the document validator on both voice fixtures - evidence: re-run 2026-09-02, both exit 0 with reason `Fixture tree: holds the shapes it exercises`
- [x] T015 Search `specs/` for the superseded scaffold sentence - evidence: re-run 2026-09-02, one match, the criterion that describes this task
- [x] T016 Measure the blocker delta across the fifty-six rewritten documents - evidence: every file dropped by exactly one and none rose
- [x] T017 Re-score every template in the fleet with payload scanning on - evidence: 45 of 53 carry a real blocker, recorded rather than swept
- [x] T018 Confirm the packaging gate still exempts fixture trees after the validator change - evidence: `d229b0a24d`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Both gate scripts run clean on the tracked tree
- [x] CHK-011 [P0] No console errors or warnings from either gate
- [x] CHK-012 [P1] The template detector distinguishes a template from a document about templates
- [x] CHK-013 [P1] The exemption matches the packaging gate rather than restating it differently
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met - re-verified 2026-09-02
- [x] CHK-021 [P0] Manual testing complete
- [x] CHK-022 [P1] Edge cases tested: a document about templates, a template outside an assets tree
- [x] CHK-023 [P1] Error scenarios validated: a padded fixture breaks what it exists to test
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class recorded: a check that never looked is `class-of-bug`, applying three times
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: every template re-scored with payload on
- [x] CHK-FIX-003 [P0] Consumer inventory completed: the seeded sentence searched across `specs/`
- [x] CHK-FIX-004 [P0] Adversarial case covered by the seeded-blocker negative control
- [x] CHK-FIX-005 [P1] Matrix axes listed: gate by document class
- [x] CHK-FIX-006 [P1] The fixture exemption is decided by path rather than by content
- [x] CHK-FIX-007 [P1] Evidence pinned to `c1b3b780c3`, `9ae247d772`, `d87e8dd162` and `d229b0a24d`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Both gates read files and write nothing
- [x] CHK-032 [P1] No auth surface is touched by this phase
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] The scanning rule is stated in the mode's own exemptions reference
- [x] CHK-042 [P2] Thirteen readme and reference files gained an overview section
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-02
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Two decisions recorded as ADR-001 and ADR-002 in `plan.md`
- [x] CHK-101 [P1] Both ADRs carry status Accepted
- [x] CHK-102 [P1] Both name the alternative that was rejected, one of which was attempted and reverted
- [x] CHK-103 [P2] No migration path applies
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] Payload scanning applies only to template paths (NFR-P01)
- [x] CHK-111 [P1] No throughput target applies to a documentation gate
- [x] CHK-112 [P2] Load testing not applicable
- [x] CHK-113 [P2] Tree count and fleet count both recorded with what each describes
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback documented: narrow the path detector rather than revert the fixes
- [x] CHK-121 [P0] No feature flag applies
- [x] CHK-122 [P1] Both gates are the monitoring surface
- [x] CHK-123 [P1] The exemptions reference states the scanning rule for the next author
- [x] CHK-124 [P2] The backlog decision is recorded as ADR-001
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] No security review trigger in this phase
- [x] CHK-131 [P1] No dependency added
- [x] CHK-132 [P2] OWASP checklist not applicable
- [x] CHK-133 [P2] No user data handled
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] Spec, plan, tasks and acceptance criteria synchronized
- [x] CHK-141 [P1] No public API documentation applies
- [x] CHK-142 [P2] The corrected templates are what future authors read
- [x] CHK-143 [P2] The 45 of 53 backlog is written down for whoever picks it up
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Technical Lead | [x] Approved | 2026-09-02 |
| Operator | Product Owner | [x] Approved | 2026-09-02 |
| Operator | QA Lead | [x] Approved | 2026-09-02 |
<!-- /ANCHOR:sign-off -->
