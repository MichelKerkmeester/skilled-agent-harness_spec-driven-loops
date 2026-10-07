---
title: "Tasks: Spec auto-healing research"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "spec auto healing research tasks"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Spec auto-healing research

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

- [x] T001 Keep a byte copy of the fresh Level 2 phase scaffold as evidence before editing it (`research/scaffold-sample/`)
- [x] T002 Read the `/deep:research` command, its auto YAML and the cli-pi, cli-devin and cli-codex skill contracts
- [x] T003 Write the parent research config and one steer file per lineage with the five Key Questions, the write scope and the citation format (`research/deep-research-config.json`, `research/lineages/*/steer.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the fan-out: three concurrent lineages of 15 iterations each, with the child-dispatch environment and closed stdin (`research/lineages/`)
- [x] T005 [P] Review each iteration as it lands and check its load-bearing citations against the source (47 verification notes)
- [x] T006 Append one steer of five questions to the two running lineages at 21:35 UTC (`research/lineages/devin-swe-2-max/steer.md`, `research/lineages/codex-luna-6-max-fast/steer.md`)
- [x] T007 Merge the lineage registries and emit the resource map (`research/findings-registry.json`, `research/resource-map.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Write the merged synthesis with ranked recommendations, eliminated alternatives, the divergence map and the verification appendix (`research/research.md`)
- [x] T009 Run the synthesis close-out, write the findings block into `spec.md` and record both events through the gateway
- [x] T010 Delete the task-created containment copies, fill the packet docs and refresh this packet's own metadata
- [x] T011 Run strict validation of this packet and confirm no change outside it came from this phase
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
- **Research**: See `research/research.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 to REQ-006)
- [x] CHK-002 [P0] Technical approach defined in plan.md (fan-out with a reviewing lead)
- [x] CHK-003 [P1] Dependencies identified and available (all three executors ran, plan.md section 6)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks: not applicable, this phase changes no code
- [x] CHK-011 [P0] No console errors or warnings: the fan-out exited 0, and `orchestration-summary.json` reports 0 failures
- [x] CHK-012 [P1] Error handling implemented: the fan-out's retry budget (3) stayed unused because no lineage failed
- [x] CHK-013 [P1] Code follows project patterns: the run used the frozen `/deep:research` workflow, and its deviations are listed in `implementation-summary.md`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (`acceptance-criteria.md`)
- [x] CHK-021 [P0] Manual testing complete: every load-bearing claim re-read at its cited line (`research/research.md` Sections 10 and 17)
- [x] CHK-022 [P1] Edge cases tested: claims about concurrent lane writes checked against the lane folder lists
- [x] CHK-023 [P1] Error scenarios validated: three refuted and four downgraded executor claims recorded with the line that refuted them
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: each recommendation names its source producer or its consumer surface in `research/research.md` Section 11
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: the archive policy table covers all five tools that touch `z_archive`, and the phrase lists cover all four copies
- [x] CHK-FIX-003 [P0] Consumer inventory completed: the Gate 3 wording count covers presentation assets and compiled contracts
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests: not applicable, this phase ships no fix, and SH-04 lists its cases for the follow-up
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed: the failure-class taxonomy in `research/research.md` Section 4
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed: not applicable, no code or test ran
- [x] CHK-FIX-007 [P1] Evidence is pinned: committed claims cite `HEAD` paths and lines, and working-tree counts are dated in the synthesis
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets: no prompt, steer file or packet file carries a secret
- [x] CHK-031 [P0] Input validation implemented: executor output was treated as data and checked before use
- [x] CHK-032 [P1] Auth/authz working correctly: the executors ran with the child-dispatch environment and closed stdin
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate: not applicable, no code changed
- [x] CHK-042 [P2] README updated (if applicable): not applicable
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only: run scratch stayed in the session scratchpad, and the containment copies were deleted
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

**Verification Date**: 2026-10-07
<!-- /ANCHOR:summary -->

---
