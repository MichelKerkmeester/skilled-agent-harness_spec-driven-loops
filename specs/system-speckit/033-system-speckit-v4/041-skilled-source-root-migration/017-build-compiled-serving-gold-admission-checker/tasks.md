---
title: "Tasks: Phase 17: build-compiled-serving-gold-admission-checker"
description: "Ordered tasks for building the compiled-serving admission checker against playbook routing gold."
trigger_phrases:
  - "gold admission checker tasks"
  - "phase 17 tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 17: build-compiled-serving-gold-admission-checker

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

- [x] T001 Get the operator's answers to `spec.md` section 10
- [x] T002 Pin the gold corpus: 73 typed-gold scenarios across the five hubs
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write the gold loader with loud parse failures (`.skilled/bin/lib/compiled-route-admission.cjs`)
- [x] T004 Write fixtures for every status and sub-reason, and the scorer against them (`.skilled/bin/tests/compiled-route-admission.test.cjs`)
- [x] T005 Write the floor check from each hub's `mode-registry.json`
- [x] T006 Write the reporter and the command line (`.skilled/bin/compiled-route-admission.cjs`)
- [x] T007 Repair the flip step: the scorer path is repaired, the pins rekeyed, and the dead canary gate in activation and flip replaced by the admission check (`shared/admission-gate.cjs`). Re-freezing moved to phase 18
- [x] T008 Add the checker to CI, warn-only (`.github/workflows/routing-registry-drift.yml`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run `--all`, commit the baseline report, and class each failure as engine drift or stale gold (`baseline/`)
- [x] T010 Flip a sandbox copy of a hub end to end: mcp-tooling flips and rolls back byte-identically; sk-doc is refused for drift
- [x] T011 Write the admission runbook (`compiled-routing-architecture.md`)
- [ ] T012 Make the CI step blocking once the four baseline failures are fixed (moved to phase 20)
- [x] T013 Run the node gate and the bin vitest suite
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
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

- [x] CHK-010 [P0] Code passes lint/format checks. Every commit passes the pre-commit gates
- [x] CHK-011 [P0] No console errors or warnings
- [x] CHK-012 [P1] Error handling implemented. An engine error scores `broken`; a parse failure scores `invalid`
- [x] CHK-013 [P1] Code follows project patterns. Matches the sibling `compiled-route-*` tools
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete. `--all` in the worktree and in a clean clone under Node 22
- [x] CHK-022 [P1] Edge cases tested. Multi-mode, sequenced, pointer prompts, orphan targets
- [x] CHK-023 [P1] Error scenarios validated. Three mutants of the scorer each fail the suite
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each finding has a class. Dead scorer path: `instance-only`. Dead canary imports: `class-of-bug`, all five hubs.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n "skill-benchmark|load-playbook-scenarios"` over the rollout harnesses finds all five canaries.
- [x] CHK-FIX-003 [P0] Consumer inventory: the freeze contract's two callers, `flip-serving.cjs` and `activate-hub.cjs`.
- [x] CHK-FIX-004 [P0] Parser cases tested: joined and sequenced modes, junk labels, malformed leaf lists, pointer prompts.
- [x] CHK-FIX-005 [P1] Matrix: fifteen scenario statuses by two cohort states, in the test file.
- [x] CHK-FIX-006 [P1] The live test hashes the activation tree before and after.
- [x] CHK-FIX-007 [P1] Evidence pinned to `b6a52d315a..HEAD` on the phase branch.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Gold parse failures fail the run
- [x] CHK-032 [P1] No gate bypass variable used
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] No ephemeral ids in code comments
- [x] CHK-042 [P2] Reference updated with the admission runbook
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in the session scratchpad only
- [x] CHK-051 [P1] scratch/ holds nothing but its placeholder
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-19
<!-- /ANCHOR:summary -->

---



