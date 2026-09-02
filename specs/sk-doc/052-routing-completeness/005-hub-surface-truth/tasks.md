---
title: "Tasks: Phase 5: hub-surface-truth"
description: "The ordered work of the hub surface phase, each task carrying the commit or the run that closed it."
trigger_phrases:
  - "hub surface truth tasks"
  - "inventory completion checklist"
  - "command column test cases"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/052-routing-completeness/005-hub-surface-truth"
    last_updated_at: "2026-09-02T18:54:23Z"
    last_updated_by: "claude-code"
    recent_action: "Marked the phase tasks done with evidence"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-005-hub-surface-truth"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: hub-surface-truth

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
- [x] T002 Read the hub leaf manifest for the authoritative leaf count - evidence: 252 leaves
- [x] T003 [P] Read the mode registry for the current mode set - evidence: six domains missing from the readme surfaces
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Complete `FULL_INVENTORY` from 128 leaves to 252 (`.opencode/skills/sk-doc/ROUTER.md`) - evidence: `98a327edf9`, 128 lines added
- [x] T005 Rewrite the readme description inside its budget rather than appending to it (`.opencode/skills/sk-doc/README.md`) - evidence: `98a327edf9`
- [x] T006 Bring trigger phrases and the at-a-glance table onto the current mode set (`.opencode/skills/sk-doc/README.md`) - evidence: `98a327edf9`
- [x] T007 Add invariant 6c, the command column check (`.opencode/commands/doctor/scripts/parent-skill-check.cjs`) - evidence: `98a327edf9`, 22 lines
- [x] T008 Write the five-case test file for the invariant (`.../parent-skill-check-command-column.test.cjs`) - evidence: `98a327edf9`, 285 lines
- [x] T009 Restore the hidden command to the hub mode table (`.opencode/skills/sk-doc/SKILL.md`) - evidence: `08eb67a0de`, line 35
- [x] T010 [P] Give two packets the keyword-triggers line the hub contract requires - evidence: `08eb67a0de`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Resolve every one of the 252 inventory paths on disk - evidence: count matches the leaf manifest, each path resolves
- [x] T012 Prove invariant 6c fails on the dash form, a wrong command string and a deleted row - evidence: `parent-skill-check-command-column.test.cjs`
- [x] T013 Prove invariant 6c passes on restore - evidence: the fifth case in the same test file
- [x] T014 Run invariant 6c on the live tree at ship time - evidence: exited non-zero on the one real instance, by design
- [x] T015 Re-check the manifest line after the routing commit - evidence: `grep -n 'sk-create-diff' .opencode/skills/sk-doc/SKILL.md` shows `/create:diff` at line 35, re-run 2026-09-02
- [x] T016 Record the five closed findings and the new check in the register (`research/findings-register.md`) - evidence: `8bb9011584`
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

- [x] CHK-010 [P0] The check passes lint and runs inside the existing parent-hub check
- [x] CHK-011 [P0] No console errors or warnings from the check
- [x] CHK-012 [P1] A commandless mode is handled, since the dash is correct there
- [x] CHK-013 [P1] The invariant follows the numbering and shape of 6a and 6b
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met - re-verified 2026-09-02
- [x] CHK-021 [P0] Manual testing complete
- [x] CHK-022 [P1] Edge cases tested: dash form, wrong command string, deleted row
- [x] CHK-023 [P1] Error scenarios validated: the check exited non-zero on the live tree
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class recorded: document-versus-registry drift is `class-of-bug`
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed across every enumerating hub surface
- [x] CHK-FIX-003 [P0] Consumer inventory completed: 252 inventory paths resolved on disk
- [x] CHK-FIX-004 [P0] Adversarial cases covered: three defect shapes plus a restore
- [x] CHK-FIX-005 [P1] Matrix axes listed: surface by defect shape
- [x] CHK-FIX-006 [P1] The check reads committed files and writes nothing
- [x] CHK-FIX-007 [P1] Evidence pinned to `98a327edf9`, `08eb67a0de` and `8bb9011584`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] The check validates its inputs and fails closed on a missing registry
- [x] CHK-032 [P1] No auth surface is touched by this phase
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] The invariant carries its reasoning at the site
- [x] CHK-042 [P2] The hub readme is itself one of the deliverables
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

- [x] CHK-100 [P0] The red-ship decision is recorded as ADR-001 in `plan.md`
- [x] CHK-101 [P1] ADR-001 carries status Accepted
- [x] CHK-102 [P1] Two alternatives documented with their rejection reasons
- [x] CHK-103 [P2] No migration path applies
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] The invariant adds no separate pass over the tree (NFR-P01)
- [x] CHK-111 [P1] No throughput target applies to a documentation check
- [x] CHK-112 [P2] Load testing not applicable
- [x] CHK-113 [P2] The 252 count recorded against the leaf manifest
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback documented: narrow the check rather than remove it
- [x] CHK-121 [P0] No feature flag applies
- [x] CHK-122 [P1] The parent-hub check is the monitoring surface
- [x] CHK-123 [P1] The invariant states what it requires at the site
- [x] CHK-124 [P2] The split between check and fix is recorded in the ADR
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
- [x] CHK-142 [P2] The hub readme and router are the user-facing documents, and both moved
- [x] CHK-143 [P2] The one-column limit of the invariant is written down
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
