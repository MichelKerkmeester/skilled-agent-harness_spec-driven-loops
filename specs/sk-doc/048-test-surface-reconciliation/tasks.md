---
title: "Tasks: Reconcile the test and fixture surfaces that had frozen against a tree that moved"
description: "Enumerate every failing suite, work the groups in parallel under one shared rule, then re-measure every claim from the final state instead of accepting the reports."
trigger_phrases:
  - "enumerate failing suites"
  - "parallel suite triage tasks"
  - "re-measure agent claims"
  - "negative control on fixtures"
importance_tier: "high"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Reconcile the test and fixture surfaces that had frozen against a tree that moved

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

- [x] T001 Enumerate every test entry point in the workspace and run each to get a starting count
- [x] T002 Group the failures by suite so the groups are disjoint by file
- [x] T003 Record the shared rule every group works under, including the controls that must keep failing
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Benchmark and model-benchmark suites: stale packet names, retired subjects, one real loader defect
- [x] T005 [P] Spec-kit validation suite and every fixture under its tree
- [x] T006 [P] Advisor regression: three phrase anchors below the routing floor
- [x] T007 [P] Five per-hub canary validators: digests, literals, falsifiers, fixture cases
- [x] T008 [P] Deep-loop runtime and ai-council suites
- [x] T009 [P] Communication projection and plugin suites
- [x] T010 [P] Python suites, including one that could not be collected at all
- [x] T011 Add a coverage guard so a registered mode without a fixture case fails instead of passing silently
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Re-run every suite from the final state rather than accepting a group's report
- [x] T013 Re-verify the negative fixtures and falsifiers still fail on their original rules
- [x] T014 Run the comment-hygiene gate over every changed code file
- [x] T015 Write spec, plan, tasks, acceptance criteria and implementation summary
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

- [x] CHK-010 [P0] Every changed code file passes the comment-hygiene gate
- [x] CHK-011 [P0] Every changed script parses, checked with a syntax pass over the diff
- [x] CHK-012 [P1] A falsifier whose subject was withdrawn now fails cleanly instead of crashing
- [x] CHK-013 [P1] Re-pins follow the existing convention and carry a comment naming what refreshes them
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Every suite re-run from the final state by the orchestrator
- [x] CHK-022 [P1] A playbook with one scenario and one with thirty both read correctly
- [x] CHK-023 [P1] Every negative fixture still fails, each on its original rule set
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding classes assigned: renamed packets and renumbered layouts are `class-of-bug`, the playbook parse defect is `algorithmic`, the missing stage-two wiring is `cross-consumer`, the phrase anchors are `class-of-bug` across three siblings.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: the stale scorer digest was chased to six pin sites, not only the one that surfaced it.
- [x] CHK-FIX-003 [P0] Consumer inventory completed: each changed fixture was checked for who reads it before being edited.
- [x] CHK-FIX-004 [P0] Adversarial cases run: the restored on-disk resolution is exercised against missing, malformed and escaping paths.
- [x] CHK-FIX-005 [P1] Matrix axes listed: 42 playbooks, 70 validation fixtures, 5 canary packets, 207 routing probes.
- [x] CHK-FIX-006 [P1] Global-state variant executed: suites re-run under parallel load, and one timeout confirmed as contention rather than regression by a clean re-run.
- [x] CHK-FIX-007 [P1] Evidence pinned to observed command output captured in this packet.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] No fix widened a path, sandbox or permission boundary to reach green
- [x] CHK-032 [P1] Not applicable: this surface carries no auth or authz
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, acceptance criteria and implementation summary agree
- [x] CHK-041 [P1] Every added comment carries the durable why, with no artifact labels
- [x] CHK-042 [P2] No README claims changed by this work
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Working files stayed in the session scratchpad, outside the repository
- [x] CHK-051 [P1] The packet scratch directory holds nothing but its keep file
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-01
<!-- /ANCHOR:summary -->

---



