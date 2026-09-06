---
title: "Tasks: Phase 6: playbook-and-closeout"
description: "The ordered work for the playbook and the closeout, with the verification checklist the packet closes against."
trigger_phrases:
  - "chart playbook tasks"
  - "chart closeout checklist"
  - "playbook package verification"
  - "fleet gate tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: playbook-and-closeout

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

- [x] T001 Capture a baseline for every gate before the first edit (corpus check, hub check, routing freshness, recursive validate, playbook fleet run)
- [x] T002 Read the operator-scenario contract from `validate-playbook-package.cjs` rather than from a summary of it
- [x] T003 [P] Read a sibling playbook package for the shape (`sk-create-with-human-voice`, `sk-create-diagram`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the root index with the policy, the wave plan, the family coverage map and the recorded render flake (`manual-testing-playbook/manual-testing-playbook.md`)
- [x] T005 Write the three reading-the-chart scenarios: the headline against its data, the axis ladder, the drawing edge
- [x] T006 Write the three corpus-integrity scenarios: the empty box, the colour source, the two-way index
- [x] T007 Write the two delivery-and-routing scenarios: the no-build-step property and the form choice with the diagram boundary
- [x] T008 Reconcile the parent phase map, the child statuses and this phase's own documents
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Reproduce the routing-gold trap on the finished package, then restore and verify the restore by checksum
- [x] T010 Run the five gates from the final state, reading each output and exit status separately
- [x] T011 Scan every authored document with `hvr_scan.py` to zero hard blockers
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

- [x] CHK-010 [P0] The playbook package passes its contract check with zero violations
- [x] CHK-011 [P0] No forbidden verdict vocabulary and no developer-absolute path in any scenario file
- [x] CHK-012 [P1] Every `SKIP` in the package names its blocker
- [x] CHK-013 [P1] Scenario filenames and category directories are letter-led kebab slugs
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] The operator scenario count is above zero and the status is not a skip
- [x] CHK-022 [P1] The routing-gold trap was reproduced on the finished package and reversed
- [x] CHK-023 [P1] Every cited local link in a scenario resolves on disk
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Not a fix packet. No finding class applies, and the surfaces this phase writes to are listed in the plan's addendum
- [x] CHK-FIX-002 [P0] The playbook tree is the only new surface, confirmed by `git status --porcelain` on the packet path
- [x] CHK-FIX-003 [P0] Consumer inventory: the leaf manifest indexes `assets/` and `references/` only, so the playbook tree is not a routing input
- [x] CHK-FIX-004 [P0] No security, path, parser or redaction change. Nothing here executes
- [x] CHK-FIX-005 [P1] The one axis that matters is the routing-gold classification, exercised in both states
- [x] CHK-FIX-006 [P1] No process-wide state is read by anything this phase wrote
- [x] CHK-FIX-007 [P1] Evidence is pinned to the final working-tree state, which is uncommitted and staged
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] No input handling. The package is documents
- [x] CHK-032 [P1] No auth surface touched
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized
- [x] CHK-041 [P1] No spec path, packet number or phase number appears in any shipped packet document
- [x] CHK-042 [P2] The packet README already lists the playbook directory, so no README edit was needed
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in the session scratchpad only, never under the packet
- [x] CHK-051 [P1] The phase `scratch/` directory is empty at completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 14 | 14/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-02
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Two decisions recorded as ADRs in `plan.md`
- [x] CHK-101 [P1] Both ADRs carry an Accepted status
- [x] CHK-102 [P1] Both ADRs name the alternative and why it was rejected
- [x] CHK-103 [P2] No migration path applies
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] Not applicable. NFR-P01 states so
- [x] CHK-111 [P1] Not applicable
- [x] CHK-112 [P2] Not applicable
- [x] CHK-113 [P2] Not applicable
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented in `plan.md` and exercised by the negative-control restore
- [x] CHK-121 [P0] No feature flag applies
- [x] CHK-122 [P1] No monitoring applies
- [x] CHK-123 [P1] The root index is the runbook
- [x] CHK-124 [P2] No deployment step exists
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] No security review applies. Nothing here executes
- [x] CHK-131 [P1] No dependency added
- [x] CHK-132 [P2] Not applicable
- [x] CHK-133 [P2] Not applicable
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] Parent and child status fields reconciled against what shipped
- [x] CHK-141 [P1] No API surface
- [x] CHK-142 [P2] The packet's own documents describe the playbook directory correctly
- [x] CHK-143 [P2] The open items are recorded rather than dropped
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Technical Lead | [ ] Approved | |
| Operator | Product Owner | [ ] Approved | |
| Operator | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
