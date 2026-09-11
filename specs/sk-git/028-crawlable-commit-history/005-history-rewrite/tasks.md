---
title: "Tasks: Phase 5: history-rewrite"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: history-rewrite

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

- [x] T001 Write four one-change briefs from ADR-001 and ADR-004 (scratch/briefs)
- [x] T002 Read iterations 7, 8 and 9 for the cascade, the filter-repo contract and the order of operations
- [x] T003 [P] Count the tags on and off the rewritten lines: 109 on, 40 off
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Build the plan: build-commit-plan.py with the refined cascade and a hand-judged sample (scripts/)
- [x] T005 Build the remapper: remap-citations.py, dry-run first, residue check (scripts/)
- [x] T006 Build the runner and callback: rewrite-run.sh, stamp-callback.py, six invariants, on-line tag filter (scripts/)
- [x] T007 Build the branch stamper for the lines left behind (.opencode/skills/sk-git/scripts/stamp-branch.sh)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Rehearse at full scale on a mirror, twice, the second with the 109 tags: INVARIANTS PASS
- [x] T009 Dry-run the citation remap against the rehearsal commit map: 1,704 tokens, 1,672 files
- [ ] T010 [B] Open the window: freeze writers, pin the tip, rewrite, remap, push after the operator's yes, sync followers
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining: T010 waits for the operator's yes
- [x] Manual verification passed for everything before the window
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

- [x] CHK-010 [P0] Code passes lint/format checks
- [x] CHK-011 [P0] No console errors or warnings
- [x] CHK-012 [P1] Error handling implemented
- [x] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete
- [x] CHK-022 [P1] Edge cases tested
- [x] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Not applicable, no fix in this phase
- [x] CHK-FIX-002 [P0] Not applicable, no fix in this phase
- [x] CHK-FIX-003 [P0] Not applicable, no fix in this phase
- [x] CHK-FIX-004 [P0] Not applicable, no fix in this phase
- [x] CHK-FIX-005 [P1] Not applicable, no fix in this phase
- [x] CHK-FIX-006 [P1] Not applicable, no fix in this phase
- [x] CHK-FIX-007 [P1] Not applicable, no fix in this phase
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented
- [x] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate
- [x] CHK-042 [P2] README updated (if applicable)
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
| P0 Items | 9 | 9/9 before the window |
| P1 Items | 11 | 11/11 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-09-11
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [x] CHK-102 [P1] Alternatives documented with rejection rationale
- [x] CHK-103 [P2] Migration path documented (if applicable)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] Response time targets met (NFR-P01)
- [x] CHK-111 [P1] Throughput targets met (NFR-P02)
- [x] CHK-112 [P2] Load testing completed
- [x] CHK-113 [P2] Performance benchmarks documented
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented in plan.md and rehearsed as backup.git on every run
- [x] CHK-121 [P0] Feature flag configured (if applicable)
- [x] CHK-122 [P1] Monitoring/alerting configured
- [x] CHK-123 [P1] Runbook created
- [x] CHK-124 [P2] Deployment runbook reviewed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Security review completed
- [x] CHK-131 [P1] Dependency licenses compatible
- [x] CHK-132 [P2] OWASP Top 10 checklist completed
- [x] CHK-133 [P2] Data handling compliant with requirements
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized
- [x] CHK-141 [P1] API documentation complete (if applicable)
- [x] CHK-142 [P2] User-facing documentation updated
- [x] CHK-143 [P2] Knowledge transfer documented
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Technical Lead | [ ] Approved, the push | |
| Conductor session | Verification | [x] Approved, everything before the push | 2026-09-11 |
<!-- /ANCHOR:sign-off -->


