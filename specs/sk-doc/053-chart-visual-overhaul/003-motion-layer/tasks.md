---
title: "Tasks: Add the reveal wipe and the bar growth, both gated and both deterministic"
description: "Ordered work for the reveal on three time-series forms, the growth on six bar forms, the closed gap in the motion rule and the two-render determinism proof."
trigger_phrases:
  - "chart motion tasks"
  - "reveal wipe tasks"
  - "determinism proof tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Add the reveal wipe and the bar growth, both gated and both deterministic

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

- [ ] T001 Confirm phase 002 closed with the corpus check green over twenty-nine files (scratch/phase-002-gate.txt)
- [ ] T002 Capture the baseline corpus check with `--render` and read the `RESULT:` line (scratch/validator-before.txt)
- [ ] T003 Capture a settled document dump for each of the nine files before any motion is added, so the after-dump has a control (scratch/dom-before/)
- [ ] T004 Choose the settle time and write it into contract rule 13, before any file animates (references/template-contract.md)
- [ ] T005 Decide the bar growth route by rendering both a transform scaled about the anchor and a mask wipe, and reading what happens to a separator stroke (scratch/route-test/)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 A6: add the one second left-to-right mask wipe to the line form, on the eased curve the research named (assets/templates/daily-line.html)
- [ ] T007 [P] A6: add the same wipe to the range form (assets/templates/daily-range.html)
- [ ] T008 [P] A6: add the same wipe to the band form, revealing all bands together rather than in stack order (assets/templates/stacked-area.html)
- [ ] T009 Bar growth: half a second cubic-out on the chosen route, staggered by mark index (assets/templates/bar-columns.html, assets/templates/bar-rows.html)
- [ ] T010 Bar growth on the two multi-series bar forms, with the stack growing as one shape (assets/templates/grouped-bars.html, assets/templates/stacked-bars.html)
- [ ] T011 Bar growth on the two forms whose marks do not sit on a baseline, each growing from its own anchor and following the sign of its step (assets/templates/waterfall.html, assets/templates/progress-single.html)
- [ ] T012 Give every animating file a `prefers-reduced-motion` fallback that removes the motion rather than shortening it (assets/templates/)
- [ ] T013 Extend the motion rule so a script-driven animation with no fallback fails the same way a CSS one does (scripts/check-corpus.cjs)
- [ ] T014 Add the two-render comparison to the render path, reported per file (scripts/check-corpus.cjs)
- [ ] T015 State the settle-time requirement in the contract beside rule 13, and say why rule 12 needs it (references/template-contract.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 Re-run the corpus check with `--render` from the final state and read the `RESULT:` line (scratch/validator-after.txt)
- [ ] T017 Confirm the two-render comparison reports no difference for each of the nine animating files (scratch/determinism.txt)
- [ ] T018 Prove the extended motion rule can fail three ways: a script animation with no fallback, a fallback that shortens rather than removes, and an animation that repeats (scratch/motion-negative.txt)
- [ ] T019 Confirm `grep -rl 'prefers-reduced-motion' assets/templates/` lists exactly the nine animating files and no others
- [ ] T020 Watch each motion once at delivery size with the operating system preference off, then once with it on
- [ ] T021 Run `hvr_scan.py` over every document authored in this phase and require zero hard blockers
- [ ] T022 Reconcile spec, plan, tasks and acceptance criteria against what shipped
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
- [ ] CHK-003 [P0] Phase 002 closed and the corpus check green
- [ ] CHK-004 [P1] A settled dump exists for each of the nine files before any motion is added
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Every animation is authored in CSS, so the motion rule can see it
- [ ] CHK-011 [P0] No animation repeats, and none carries an infinite iteration count
- [ ] CHK-012 [P0] No rendering code reads the clock or a random source
- [ ] CHK-013 [P1] The stagger delay is computed from a mark index rather than from a value in the data block
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] `check-corpus.cjs --render` prints `RESULT: PASSED`
- [ ] CHK-022 [P0] Two renders of each animating file produce identical settled documents
- [ ] CHK-023 [P0] The extended motion rule was shown failing three ways before the scratch copies were restored
- [ ] CHK-024 [P1] Each motion was watched with the operating system preference both off and on
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] The script-driven motion gap is classed `class-of-bug`, because it is a hole in a rule rather than a fault in one file
- [ ] CHK-FIX-002 [P0] The producer inventory over `@keyframes`, `animation:` and `transition:` covers `assets/` whole, and returned nothing before this phase
- [ ] CHK-FIX-003 [P0] The consumer inventory covers every file the render path walks, because the two-render comparison runs over the same set
- [ ] CHK-FIX-004 [P0] The adversarial cases for the extended rule are the three named in the plan, and each was executed
- [ ] CHK-FIX-005 [P1] The route matrix lists both bar growth routes and the rendered evidence that chose one
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the working-tree state that produced it, named in the acceptance criteria
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] No remote resource, no `@import` and no runtime fetch enters any file
- [ ] CHK-032 [P1] Nothing is copied from the vendored source. The durations and the curve are re-typed constants, and the implementation is the corpus's own
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks and acceptance criteria synchronized
- [ ] CHK-041 [P1] Contract rule 13 names the settle time and says why rule 12 needs it
- [ ] CHK-042 [P1] The scripts README describes the two-render comparison alongside the existing checks
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Document dumps, route tests and negative runs stay in `scratch/`
- [ ] CHK-051 [P1] `scratch/` is reviewed before the phase closes, and anything the acceptance criteria cite is kept
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 11 | 0/11 |
| P2 Items | 0 | 0/0 |

**Verification Date**: pending
<!-- /ANCHOR:summary -->

---
