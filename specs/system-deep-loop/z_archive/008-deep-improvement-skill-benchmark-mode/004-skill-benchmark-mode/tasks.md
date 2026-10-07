---
title: "Tasks: Phase 004 — Skill-benchmark mode (Lane C) design + build"
description: "Reconstructed task list for the 004 Lane C build phase, derived from spec.md and git history. Task state was not recorded in those sources."
trigger_phrases:
  - "skill-benchmark mode build tasks"
  - "lane c skill benchmark tasks"
importance_tier: "important"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Phase 004 — Skill-benchmark mode (Lane C): design + build

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [ ] T001 Confirm the Phase 001 design and the Phase 002 playbook shared-vs-Lane-C module split (`spec.md`)
- [ ] T002 Initialize the Lane C subdirs under assets/references/scripts (`.opencode/skills/deep-improvement/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Author the scenario-fixture schema + per-target scenario set, including negatives (`assets/skill-benchmark/`)
- [ ] T004 Build the hint-free dispatcher capturing the resource-load trace + tool trace (`scripts/skill-benchmark/`)
- [ ] T005 Build the scorer across the confirmed dimensions, reusing the Lane B deterministic-checks + pluggable-grader shape (`scripts/skill-benchmark/`)
- [ ] T006 Wire `scripts/shared/loop-host.cjs --mode=skill-benchmark` additively, keeping Lane A/B byte-identical when the flag is absent (`scripts/shared/loop-host.cjs`)
- [ ] T007 Build the report builder: per-dimension scores + ranked bottlenecks + remediations (`scripts/skill-benchmark/`)
- [ ] T008 Add the command + operator/scoring/scenario-authoring references (`.opencode/commands/deep/start-skill-benchmark-loop.md`, `references/skill-benchmark/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Run Lane C end-to-end on at least one real target skill; emit a ranked, actionable report
- [ ] T010 Run the Lane A/B non-regression check without the mode flag
- [ ] T011 Capture repeatability evidence (variance across runs)
- [ ] T012 Run `validate.sh --strict` for this folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Deliverable passes its structure checks
- [ ] CHK-011 [P0] No unresolved placeholders or scaffold markers
- [ ] CHK-012 [P1] Claims stay within the evidence the packet retained
- [ ] CHK-013 [P1] Documents follow the packet conventions
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual verification complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a recorded finding class
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed where a class exists
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed artifacts
- [ ] CHK-FIX-004 [P0] Boundary fixes include adversarial table cases
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed
- [ ] CHK-FIX-006 [P1] Hostile environment variant executed when process-wide state is read
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fixed revision, not a moving branch range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented where input exists
- [ ] CHK-032 [P1] Authority stays with the destination that owns it
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Document structure and anchors intact
- [ ] CHK-042 [P2] Related documents linked where they exist
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
| P0 Items | Not recorded | Not recorded |
| P1 Items | Not recorded | Not recorded |
| P2 Items | Not recorded | Not recorded |

**Verification Date**: Not recorded
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Migration path documented (if applicable)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] Response time targets met (NFR-P01)
- [ ] CHK-111 [P1] Throughput targets met (NFR-P02)
- [ ] CHK-112 [P2] Load testing completed
- [ ] CHK-113 [P2] Performance benchmarks documented
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and tested
- [ ] CHK-121 [P0] Feature flag configured (if applicable)
- [ ] CHK-122 [P1] Monitoring/alerting configured
- [ ] CHK-123 [P1] Runbook created
- [ ] CHK-124 [P2] Deployment runbook reviewed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Security review completed
- [ ] CHK-131 [P1] Dependency licenses compatible
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed
- [ ] CHK-133 [P2] Data handling compliant with requirements
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] API documentation complete (if applicable)
- [ ] CHK-142 [P2] User-facing documentation updated
- [ ] CHK-143 [P2] Knowledge transfer documented
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| [Name] | Technical Lead | [ ] Approved | |
| [Name] | Product Owner | [ ] Approved | |
| [Name] | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
