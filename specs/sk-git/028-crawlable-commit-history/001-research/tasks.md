---
title: "Tasks: Phase 1: research"
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
# Tasks: Phase 1: research

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

- [x] T001 Allocate the worktree through sk-git and build the spec-kit runtime inside it (worktrees/048-crawlable-commit-history)
- [x] T002 Write the ten-angle brief with the facts already measured (research/dispatch-prompt.md)
- [x] T003 [P] Probe pi through the llmgateway provider with a one-line dispatch (scratch)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Commit the scaffold so write containment has a clean baseline (specs/sk-git/028-crawlable-commit-history)
- [x] T005 Launch the detached lineage: cli-pi, deepseek-v4.1-flash, max, 10 iterations, stop policy max-iterations (research/lineages/deepseek)
- [x] T006 Read iterations as they land and open citations (research/lineages/deepseek/iterations)
- [x] T007 Write the top-level synthesis over all ten iterations (research/research.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Confirm ten iteration files and stopReason maxIterationsReached (research/lineages/deepseek/deep-research-state.jsonl)
- [x] T009 Confirm the lineage wrote nothing outside research/ (git status)
- [x] T010 Validate the phase under strict and record the evidence (implementation-summary.md)
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

- [x] CHK-010 [P0] No code written in this phase, gate passes vacuously
- [x] CHK-011 [P0] Runner log shows no error before the synthesis record
- [x] CHK-012 [P1] Provider refusal text absent from the lineage output
- [x] CHK-013 [P1] Iteration files follow the output shape in the brief
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Citations opened for iterations 1 to 3 and six claims re-measured
- [x] CHK-022 [P1] Refs and Spec extraction counts, the packet query, the hook tests, signed-commit count and prefix collisions re-run by the conductor
- [x] CHK-023 [P1] Findings marked implementable today or needs a contract decision
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Not applicable, no fix in this phase
- [x] CHK-FIX-002 [P0] Not applicable
- [x] CHK-FIX-003 [P0] Not applicable
- [x] CHK-FIX-004 [P0] Not applicable
- [x] CHK-FIX-005 [P1] Not applicable
- [x] CHK-FIX-006 [P1] Not applicable
- [x] CHK-FIX-007 [P1] Not applicable
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets, the gateway key stays in the shell environment
- [x] CHK-031 [P0] The lineage runs with write containment to its own directory
- [x] CHK-032 [P1] Not applicable
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Not applicable
- [x] CHK-042 [P2] Not applicable
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Runner log lives in the session scratchpad, not the packet
- [x] CHK-051 [P1] scratch/ holds only .gitkeep
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 11 | 11/11 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-09-11
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decision documented in plan.md ADR-001
- [x] CHK-101 [P1] ADR has status Accepted
- [x] CHK-102 [P1] Alternatives documented with rejection rationale
- [x] CHK-103 [P2] Not applicable
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] Ten iterations in 37 minutes, inside the four-hour ceiling
- [x] CHK-111 [P1] Run finished before the lineage timeout
- [x] CHK-112 [P2] Not applicable
- [x] CHK-113 [P2] Not applicable
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented in plan.md
- [x] CHK-121 [P0] Not applicable
- [x] CHK-122 [P1] Ledger monitor armed on orchestration-status.log
- [x] CHK-123 [P1] Not applicable
- [x] CHK-124 [P2] Not applicable
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Not applicable
- [x] CHK-131 [P1] Not applicable
- [x] CHK-132 [P2] Not applicable
- [x] CHK-133 [P2] Not applicable
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized
- [x] CHK-141 [P1] Not applicable
- [x] CHK-142 [P2] Not applicable
- [x] CHK-143 [P2] Synthesis names the ten decisions phase 002 must take
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Technical Lead | [ ] Approved | |
| Conductor session | Verification | [x] Approved | 2026-09-11 |
<!-- /ANCHOR:sign-off -->

