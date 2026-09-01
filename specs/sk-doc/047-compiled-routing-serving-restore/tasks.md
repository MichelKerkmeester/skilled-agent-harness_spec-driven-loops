---
title: "Tasks: Restore compiled routing to serving authority and give the human voice vocabulary to its owning mode"
description: "The ordered work: capture a baseline, re-pin and rebuild, restore the verify gate, prove a replay harness against the live engine, then rehome the vocabulary and verify from the final state."
trigger_phrases:
  - "compiled routing restore tasks"
  - "routing replay harness control"
  - "re-pin rebuild finalize"
  - "vocabulary rehome verification"
importance_tier: "high"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Restore compiled routing to serving authority and give the human voice vocabulary to its owning mode

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

- [x] T001 Capture the baseline: serving authority, generation and pin for all five hubs (`compiled-route-status.cjs --all`)
- [x] T002 Locate the authored closure root and confirm the promoted manifests match it byte for byte
- [x] T003 Name the rollback before the first write
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Re-pin the authored manifest for each stale hub (`compiled-route-manifest.cjs refresh --runtime-root <authored>`)
- [x] T005 Rebuild the promoted mirror from the authored closure
- [x] T006 Restore the promoted-root verify gate to the manifest-sensitive route (`.opencode/bin/compiled-route-sync.cjs`)
- [x] T007 Build a counterfactual replay harness over the production compiler and router, and prove it with a no-op control
- [x] T008 Rehome the human voice vocabulary in both the router class and the registry aliases
- [x] T009 Narrow the quality-action verb class to verbs that are distinctly about document quality
- [x] T010 Repair the pre-existing failures in the deep-improvement benchmark suite
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Confirm all five hubs report `compiled-serving`, and the move simulation reads nothing under the spec tree
- [x] T012 Run the manifest suite with the writer lease free, after finalizing the publication
- [x] T013 Replay the frozen corpus against the shipped engine and confirm it matches the prediction
- [x] T014 Confirm the vocabulary edit adds no test failure, by comparing per-file counts with it stashed and restored
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

- [x] CHK-010 [P0] Code passes lint/format checks: both vitest suites and the node manifest suite run clean
- [x] CHK-011 [P0] No console errors or warnings from the build, verify or status commands
- [x] CHK-012 [P1] Error handling implemented: the restored gate names the hub it refuses
- [x] CHK-013 [P1] Code follows project patterns: the gate reuses the existing allow-stale branch rather than adding a second one
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met: 7 of 7 rows `Met` in acceptance-criteria.md
- [x] CHK-021 [P0] Manual testing complete: 207-probe replay against the shipped engine
- [x] CHK-022 [P1] Edge cases tested: missing, malformed and invalid manifests all refuse the build
- [x] CHK-023 [P1] Error scenarios validated: an open publication reports `publication-locked` instead of clobbering
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding classes assigned: the stale pin is `class-of-bug` across three hubs, the widened verify gate is `algorithmic`, the vocabulary collision is `cross-consumer` across the router and the registry.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: all five hubs were checked for serving authority, not only the one that surfaced the symptom.
- [x] CHK-FIX-003 [P0] Consumer inventory completed: a mode's compiled keywords come from two files, and an edit to one alone measured zero effect, which is how the second was found.
- [x] CHK-FIX-004 [P0] Adversarial cases run: the manifest suite exercises deleted, malformed and invalid manifests against the restored gate.
- [x] CHK-FIX-005 [P1] Matrix axes listed: 14 modes by their own alias keywords, 207 probes, each scored for action and target.
- [x] CHK-FIX-006 [P1] Global-state variant executed: the harness sets the compiled-routing flag exactly as the engine loader does, and the control proves the two agree.
- [x] CHK-FIX-007 [P1] Evidence pinned to observed command output captured in this packet, not to a moving range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets: the change touches routing vocabulary and a verify predicate
- [x] CHK-031 [P0] Input validation implemented: manifests are validated before they are trusted, and an invalid one refuses the build
- [x] CHK-032 [P1] Not applicable: this surface carries no auth or authz
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, acceptance criteria and implementation summary agree on scope and status
- [x] CHK-041 [P1] Code comments carry the durable why, with no artifact labels
- [x] CHK-042 [P2] No README claims changed: the vocabulary move is invisible above the router
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The replay harness and its corpus live in the session scratchpad, outside the repository
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



