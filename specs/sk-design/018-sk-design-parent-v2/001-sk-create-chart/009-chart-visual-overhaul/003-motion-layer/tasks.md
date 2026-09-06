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

- [x] T001 Confirm phase 002 closed with the corpus check green over twenty-nine files (scratch/phase-002-gate.txt). 002's closure gate reads Status Complete and Closeable Yes, and the baseline run scanned 29 files with 0 errors
- [x] T002 Capture the baseline corpus check with `--render` and read the `RESULT:` line (scratch/validator-before.txt). `RESULT: PASSED`, `Summary: errors: 0`, `motion: 29 assertion(s), 0 failure(s)` on a corpus where nothing moved
- [x] T003 Capture a settled document dump for each of the nine files before any motion is added, so the after-dump has a control (scratch/dom-before/). A settled screenshot was captured beside each dump in `scratch/pixels-before/`, because a document dump cannot see a stylesheet animation and the picture is what the control is for
- [x] T004 Choose the settle time and write it into contract rule 13, before any file animates (references/template-contract.md). One second, chosen so it bounds both motions and stays a third of the render budget, and made true by capping the stagger rather than letting it accumulate
- [x] T005 Decide the bar growth route by rendering both a transform scaled about the anchor and a mask wipe, and reading what happens to a separator stroke (scratch/route-test/). The transform wins. `p-clip-mid.png` shows the clip route detaching a stack into floating pieces, `p-transform-mid.png` shows the stack growing as one with its seams intact
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 A6: add the one second left-to-right wipe to the line form, on the eased curve the research named (assets/templates/daily-line.html). A `clip-path: inset()` animation rather than a mask element: it needs no `defs`, no id and no change to the drawing code
- [x] T007 [P] A6: add the same wipe to the range form (assets/templates/daily-range.html)
- [x] T008 [P] A6: add the same wipe to the band form, revealing all bands together rather than in stack order (assets/templates/stacked-area.html). `scratch/mid-frames/stacked-area.png` shows the four bands arriving together behind one wipe front
- [x] T009 Bar growth: half a second cubic-out on the chosen route, staggered by mark index (assets/templates/bar-columns.html, assets/templates/bar-rows.html). Columns scale about their foot, rows about their left edge
- [x] T010 Bar growth on the two multi-series bar forms, with the stack growing as one shape (assets/templates/grouped-bars.html, assets/templates/stacked-bars.html). Every segment of a stack shares its column's index and scales about the axis, which the drawing code hands to the stylesheet as a custom property
- [x] T011 Bar growth on the two forms whose marks do not sit on a baseline, each growing from its own anchor and following the sign of its step (assets/templates/waterfall.html, assets/templates/progress-single.html). `scratch/mid-frames/waterfall.png` shows the two falling steps hanging from the total above them while the rises climb from the total below
- [x] T012 Give every animating file a `prefers-reduced-motion` fallback that removes the motion rather than shortening it (assets/templates/). Nine files, nine `animation: none` fallbacks, and the check now rejects a fallback that shortens
- [x] T013 Extend the motion rule so a script-driven animation with no fallback fails the same way a CSS one does (scripts/check-corpus.cjs). It reads three routes now, the stylesheet, the drawing code and the markup, and it also rejects a fallback that shortens and an animation that repeats
- [x] T014 Add the two-render comparison to the render path, reported per file (scripts/check-corpus.cjs). `settled-render`, 58 assertions across 29 files, comparing both the document and the picture
- [x] T015 State the settle-time requirement in the contract beside rule 13, and say why rule 12 needs it (references/template-contract.md). Rule 12 gained the `settled-render` check name, rule 13 gained the removal, the no-repeat and the one second settle
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Re-run the corpus check with `--render` from the final state and read the `RESULT:` line (scratch/validator-after.txt). `RESULT: PASSED`, `Summary: errors: 0`, exit 0
- [x] T017 Confirm the two-render comparison reports no difference for each of the nine animating files (scratch/determinism.txt). Zero failures across all 29, and each of the nine settles to a picture byte-identical to its pre-motion control
- [x] T018 Prove the extended motion rule can fail three ways: a script animation with no fallback, a fallback that shortens rather than removes, and an animation that repeats (scratch/motion-negative.txt). All three went red then green. A fourth shape was added for `settled-render`, which had never failed either
- [x] T019 Confirm `grep -rl 'prefers-reduced-motion' assets/templates/` lists exactly the nine animating files and no others. Nine listed, and none of the other eleven
- [x] T020 Watch each motion once at delivery size with the operating system preference off, then once with it on. Watched as paused frames in `scratch/mid-frames/` rather than in a live browser, and the preference-on state is the settled render, which matches the pre-motion control byte for byte
- [x] T021 Run `hvr_scan.py` over every document authored in this phase and require zero hard blockers. Zero on all of them
- [x] T022 Reconcile spec, plan, tasks and acceptance criteria against what shipped
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed. Each motion was watched as a paused frame rather than in a live browser, which is recorded against T020
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
- [x] CHK-003 [P0] Phase 002 closed and the corpus check green. `scratch/phase-002-gate.txt`
- [x] CHK-004 [P1] A settled dump exists for each of the nine files before any motion is added. `scratch/dom-before/` and `scratch/pixels-before/`, nine each
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every animation is authored in CSS, so the motion rule can see it. `@keyframes` in nine files, and no `requestAnimationFrame` anywhere in `assets/`
- [x] CHK-011 [P0] No animation repeats, and none carries an infinite iteration count. `grep -rn 'infinite\|iteration-count' assets/` returns nothing, and the check now rejects one
- [x] CHK-012 [P0] No rendering code reads the clock or a random source. `grep -rn 'Math\.random\|Date\.now\|new Date(\|performance\.now' assets/` returns nothing, and `determinism` reports 29 assertions with 0 failures
- [x] CHK-013 [P1] The stagger delay is computed from a mark index rather than from a value in the data block. Five files pass a `forEach` index and `grouped-bars` a running draw counter, after its first version read `d.values.length` and was rewritten
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Fifteen rows, all `Met`
- [x] CHK-021 [P0] `check-corpus.cjs --render` prints `RESULT: PASSED`. `scratch/validator-after.txt`, errors 0, exit 0
- [x] CHK-022 [P0] Two renders of each animating file produce identical settled documents, and identical settled pictures. `settled-render` reports 58 assertions with 0 failures
- [x] CHK-023 [P0] The extended motion rule was shown failing three ways before the copies were restored, and `settled-render` two more. `scratch/motion-negative.txt`
- [x] CHK-024 [P1] Each motion was watched with the operating system preference both off and on, through paused frames and settled renders rather than a live browser
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The script-driven motion gap is classed `class-of-bug`, because it is a hole in a rule rather than a fault in one file. The fix reads every route a file can move by, not only the one that prompted it
- [x] CHK-FIX-002 [P0] The producer inventory over `@keyframes`, `animation:` and `transition:` covers `assets/` whole, and returned nothing before this phase. It returns nine files now
- [x] CHK-FIX-003 [P0] The consumer inventory covers every file the render path walks, because the two-render comparison runs over the same set. 29 files, 58 assertions
- [x] CHK-FIX-004 [P0] The adversarial cases for the extended rule are the three named in the plan, and each was executed. Two more were added for the new rendered check
- [x] CHK-FIX-005 [P1] The route matrix lists both bar growth routes and the rendered evidence that chose one. `implementation-summary.md`, with the frames in `scratch/route-test/`
- [x] CHK-FIX-007 [P1] Evidence is pinned to the working-tree state that produced it, named in the acceptance criteria. Nothing is committed, so every capture is from the working tree at `28d3defea8` plus the twelve files this phase changed
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] No remote resource, no `@import` and no runtime fetch enters any file. `no-external` reports 145 assertions with 0 failures
- [x] CHK-032 [P1] Nothing is copied from the vendored source. The durations and the curve are re-typed constants, and the implementation is the corpus's own. The vendored source animates React components through a motion library, and none of it would run in a file that depends on nothing
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks and acceptance criteria synchronized
- [x] CHK-041 [P1] Contract rule 13 names the settle time and says why rule 12 needs it
- [x] CHK-042 [P1] The scripts README describes the two-render comparison alongside the existing checks, and carries the commands that break the motion rule three ways and the rendered rule one
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Document dumps, route tests and negative runs stay in `scratch/`. The scoped diff outside it is the twelve files the spec names
- [x] CHK-051 [P1] `scratch/` is reviewed before the phase closes, and anything the acceptance criteria cite is kept
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 11 | 11/11 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-09-03
<!-- /ANCHOR:summary -->

---
