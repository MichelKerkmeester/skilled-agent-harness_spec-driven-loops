---
title: "Tasks: Roll the settled chrome across the whole chart corpus"
description: "Ordered work for the twenty-nine file chrome pass, the radius token ladder and the assertion behind it, with the verification each one owes."
trigger_phrases:
  - "chart chrome rollout tasks"
  - "chart radius token tasks"
  - "corpus restyle tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Roll the settled chrome across the whole chart corpus

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

- [ ] T001 Confirm phase 001 closed with a disposition on both forks, and copy the settled values into this folder (scratch/settled-chrome.txt)
- [ ] T002 Capture the baseline corpus check with `--render` and read the `RESULT:` line (scratch/validator-before.txt)
- [ ] T003 Record the before-count of every value this phase replaces, including the twenty `border-radius: 10px` declarations (scratch/counts-before.txt)
- [ ] T004 Inventory every distinct corner value the corpus draws today, so a rung exists for a real consumer (scratch/rung-inventory.txt)
- [ ] T005 Test whether a length survives `customProperties` and `checkPaletteSource`, and pick Route A or Route B on that evidence (scripts/check-corpus.cjs)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Add the radius ladder to the palette source on the chosen route (assets/color/palettes.json)
- [ ] T007 Teach the corpus check to emit and assert the radius tokens, and give the new check its own name in the run summary (scripts/check-corpus.cjs)
- [ ] T008 Prove the new assertion can fail by mutating one template, reading the red run, then restoring the file (assets/templates/, scratch/radius-negative.txt)
- [ ] T009 Replace every hand-typed corner with a token reference across the corpus (assets/templates/, assets/examples/, assets/color/)
- [ ] T010 A1: dash every grid at `3 3` in a weakened rule colour, horizontal only (assets/templates/, assets/examples/, assets/color/)
- [ ] T011 A1b: drop every tick ink to muted rather than full strength (assets/templates/, assets/examples/, assets/color/)
- [ ] T012 A2: give every asset file a system mono face with tabular figures for numeric text, still routed through its own formatter (assets/)
- [ ] T013 A2: re-check every label width estimate against mono advances, which are wider than the sans advances they were tuned for (assets/)
- [ ] T014 A7: apply the two-weight dot language to the line family (assets/templates/daily-line.html, assets/templates/stacked-area.html)
- [ ] T015 A9: fade every area and band fill toward the baseline, painted from series tokens (assets/templates/daily-line.html, assets/templates/daily-range.html, assets/templates/stacked-area.html)
- [ ] T016 Apply phase 001's settled stroke weight to every `.line` rule in the corpus (assets/templates/)
- [ ] T017 Apply phase 001's glow verdict, which is a no-op when the verdict is to reject (assets/templates/daily-line.html)
- [ ] T018 [P] Give bar-family marks a two pixel radius on the outer visible edge only, top segment for a stack (assets/templates/bar-columns.html, bar-rows.html, grouped-bars.html, stacked-bars.html, waterfall.html, progress-single.html)
- [ ] T019 Update the skeleton last, so a new form inherits everything above (assets/color/palette-sheet-neutral.html)
- [ ] T020 Describe the chrome block and the radius tokens in the contract's skeleton section (references/template-contract.md)
- [ ] T021 Add the radius roles to the role vocabulary and say what each rung is for (references/color-system.md)
- [ ] T022 Record the route decision, the formatter binding and the rejected round tick dots in the decision record (decision-record.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T023 Re-run the corpus check with `--render` from the final state and read the `RESULT:` line (scratch/validator-after.txt)
- [ ] T024 Confirm the radius check reports a nonzero assertion count and zero failures
- [ ] T025 Confirm `grep -rc 'border-radius: 10px' assets/` returns zero across every file, against the recorded before-count of twenty
- [ ] T026 Confirm `grep -rn 'toLocaleString' assets/` returns nothing
- [ ] T027 Open every asset file and read its axis labels, because the check does not judge the picture
- [ ] T028 Run `hvr_scan.py` over every document authored in this phase and require zero hard blockers
- [ ] T029 Reconcile spec, plan, tasks, acceptance criteria and the decision record against what shipped
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
- [ ] CHK-003 [P0] Phase 001 closed with a disposition on both forks
- [ ] CHK-004 [P1] Headless Chrome resolves, so `--render` can run
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] No colour literal appears outside a palette block in any asset file
- [ ] CHK-011 [P0] No hand-typed corner value remains in any stylesheet
- [ ] CHK-012 [P1] Every chrome declaration refers to a `var(--chart-...)` property
- [ ] CHK-013 [P1] The new assertion is named in the run summary so a failure points at the rule it broke
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] `check-corpus.cjs --render` prints `RESULT: PASSED`
- [ ] CHK-022 [P0] The radius assertion failed on a mutated copy before the copy was restored
- [ ] CHK-023 [P1] Every asset file was opened and its labels read
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Every chrome row is classed `class-of-bug`, because it is one change repeated across a corpus rather than a fix at one site
- [ ] CHK-FIX-002 [P0] The producer inventory over `.grid`, `.tick`, `.area` and `border-radius` covers `assets/` whole, not `assets/templates/` alone
- [ ] CHK-FIX-003 [P0] The consumer inventory covers every file carrying a `CHART_PALETTE:BEGIN` sentinel, which is what a palette source change reaches
- [ ] CHK-FIX-005 [P1] The rung matrix lists each rung and the real consumer that earns it, with no rung added for symmetry
- [ ] CHK-FIX-006 [P1] The check is run from the repository root and from the packet root, because the script resolves paths from its own location
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the working-tree state that produced it, named in the acceptance criteria
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] No remote resource, no `@import` and no runtime fetch enters any file
- [ ] CHK-032 [P1] Nothing is copied from the vendored source, and every value is re-typed against corpus properties
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks, acceptance criteria and the decision record synchronized
- [ ] CHK-041 [P1] No sentence in either reference document still claims the old behaviour
- [ ] CHK-042 [P1] The scripts README names the new check alongside the existing ones
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Inventories and validator captures stay in `scratch/`
- [ ] CHK-051 [P1] `scratch/` is reviewed before the phase closes, and anything the acceptance criteria cite is kept
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] The route decision for the radius tokens is recorded in decision-record.md
- [ ] CHK-101 [P1] Every ADR carries a status of Proposed or Accepted
- [ ] CHK-102 [P1] The rejected route and the rejected round tick dots each carry their reason
- [ ] CHK-103 [P2] The migration path for a form authored before the ladder is documented
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] Every touched file still opens with no build step and no network
- [ ] CHK-111 [P1] No web font is fetched, and the mono face resolves from a system stack
- [ ] CHK-112 [P2] The corpus check runtime is recorded before and after the new assertion
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented, with the palette source reverted before the per-file failures
- [ ] CHK-121 [P1] The before-counts are recorded, so a partial rollout is visible rather than inferred
- [ ] CHK-122 [P2] The skeleton is confirmed last, so a new form inherits the final state
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Nothing entered the tree from an outside chart library, by copy or by paste
- [ ] CHK-131 [P1] No dependency was added, because a template depends on nothing
- [ ] CHK-133 [P2] Every value shipped is derivable from the palette source
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] The contract skeleton section shows the block a new form has to carry
- [ ] CHK-142 [P2] The colour system role table lists the radius roles beside the colour roles
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Visual owner | [ ] Approved | |
| Phase 003 | Downstream consumer | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 21 | 0/21 |
| P2 Items | 6 | 0/6 |

**Verification Date**: pending
<!-- /ANCHOR:summary -->

---
