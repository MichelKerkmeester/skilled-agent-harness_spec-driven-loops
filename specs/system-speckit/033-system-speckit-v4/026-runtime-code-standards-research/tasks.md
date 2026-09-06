---
title: "Tasks: Runtime code standards research"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "research lane tasks"
  - "lane launch and monitoring"
  - "finding reproduction tasks"
  - "runtime code standards research"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Runtime code standards research

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

- [ ] T001 Scaffold this child under the v4 parent and fill the planning documents (spec.md, plan.md, tasks.md, acceptance-criteria.md)
- [ ] T002 Improve the research charter through sk-prompt and store it beside the launch script (scratchpad lanes/v4r/topic-026.txt)
- [ ] T003 [P] Verify the pi CLI and the OpenRouter DeepSeek route respond to a one-line probe before launch
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Launch the lane detached through fanout-run.cjs with executor cli-pi, ten iterations, stop policy max-iterations (research/)
- [ ] T005 Monitor log growth and iteration files every three minutes; resume a lane silent for fifteen minutes (research/lineages/*/iterations)
- [ ] T006 Confirm ten iteration files and ten state events exist and that research.md was synthesized (research/lineages/*/research.md)
- [ ] T007 Reproduce every P0 and P1 finding in this session; split confirmed ones into mechanical and judgment tables (research/confirmed-findings.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Run strict validation on this child and the parent
- [ ] T009 Hand the confirmed tables to the remediation child and record the pointer in implementation-summary.md
- [ ] T010 Regenerate description and graph metadata, stamp completion, close the parent map row
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

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Ten iterations and ten events confirmed by listing
- [ ] CHK-022 [P1] Every P0 and P1 finding reproduced or dropped with a note
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Confirmed findings table handed to the remediation child
- [ ] CHK-042 [P2] Parent map row and timeline entry updated
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
| P0 Items | 4 | 0/4 |
| P1 Items | 6 | 0/6 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-09-06
<!-- /ANCHOR:summary -->

---
