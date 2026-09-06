---
title: "Implementation Plan: Annotate the six inert forms"
description: "Add data-chart-inert, with its reason, to the figure wrapper of the six templates whose static figure already carries every value they encode. No code changes, no CSS changes, no script changes."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Annotate the six inert forms

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Static HTML. No script or CSS is touched |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node scripts/check-corpus.cjs`, `grep -c data-chart-inert assets/templates/*.html` |

### Overview
Add one attribute, `data-chart-inert="<reason>"`, to the `<div class="figure" data-chart-part="figure">` element of each of six templates: `progress-single.html`, `unit-ring.html`, `unit-grid.html`, `independent-percentages.html`, `bar-columns.html` and `bar-rows.html`. Each reason is copied verbatim from phase 1's contract table. No script, no CSS and no other markup changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 1 has landed: `check-corpus.cjs` recognizes `data-chart-inert`, and `references/template-contract.md`'s contract table names all six reasons
- [ ] `node scripts/check-corpus.cjs` prints `RESULT: PASSED` before this phase starts

### Definition of Done
- [ ] All six files carry `data-chart-inert` with a non-empty reason
- [ ] `node scripts/check-corpus.cjs` prints `RESULT: PASSED`
- [ ] `grep -c data-chart-inert assets/templates/*.html` returns exactly six non-zero files
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
None. Six independent, static, self-contained files each gain one attribute on one existing element.

### Key Components

- **`progress-single.html:161`**: `<div class="figure" data-chart-part="figure">`. Add:
  `data-chart-inert="the datum, its goal, its share and its pace comparison are each printed in the figure"`
- **`unit-ring.html:130`**: `<div class="figure" data-chart-part="figure">`. Add:
  `data-chart-inert="each group's count is printed in the key beside its swatch, and the total is printed at the ring's centre"`
- **`unit-grid.html:130`**: `<div class="figure" data-chart-part="figure">`. Add:
  `data-chart-inert="each part's share is printed in the key with its percent sign, and a square is one percent by construction"`
- **`independent-percentages.html:124`**: `<div class="figure" data-chart-part="figure">`. Add:
  `data-chart-inert="each track's percentage is printed to its right and its name to its left"`
- **`bar-columns.html:149`**: `<div class="figure" data-chart-part="figure">`. Add:
  `data-chart-inert="each column's value is printed above it"`
- **`bar-rows.html:142`**: `<div class="figure" data-chart-part="figure">`. Add:
  `data-chart-inert="each bar's value is printed at its end, with its unit suffix"`

Each of these lines is worded to match the corresponding row phase 1 wrote in `references/template-contract.md`'s pointer contract table. If phase 1's final wording differs from the text above (for example because an implementer chose different phrasing during that phase), copy phase 1's actual recorded wording instead of the text above: the contract document is the source of truth, this plan's text is a working draft of it written at the same time.

### Data Flow
Not applicable. These are static attributes on non-interactive markup, read by `check-corpus.cjs`'s `checkInteractionHygiene` at run time and by nothing else.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. This phase adds a documentation-only attribute to six already-correct, non-interactive forms. It is not a bug fix and touches no security boundary, path handling, schema, persistence or shared policy.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static check | All 21 templates, 6 deliveries, 3 palette sheets | `node scripts/check-corpus.cjs` |
| Structural count | The six annotated files versus the other fifteen | `grep -c data-chart-inert assets/templates/*.html` |
| Manual read | Each attribute value against phase 1's contract table row for that form | Direct comparison, not automated |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-register-and-contract` | Internal | Must be landed first | Without the checker rule, `RESULT: PASSED` on an annotated file proves nothing about the new register. Without the contract table, the reason text has no source of truth to match |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `check-corpus.cjs` fails on any of the six files after annotation, or a reason text is found not to match phase 1's contract table.
- **Procedure**: `cp` each of the six files aside before editing. If a file fails, restore it from its copy (never `git checkout --`) and reapply the correct attribute value before rerunning the checker.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (confirm phase 1 landed) ──► Core (six attribute edits) ──► Verify (grep count,
                                                                          RESULT: PASSED,
                                                                          manual read)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | `001-register-and-contract` | Core |
| Core | Setup | Verify |
| Verify | Core | None. This phase does not block phases 4, 5 or 6, which depend on phase 3 instead |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Under 5 minutes |
| Core Implementation | Low | Six one-line edits |
| Verification | Low | One checker run, one grep, one manual read |
| **Total** | | Small, per `phase-recommendation.md`'s own sizing |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] `cp` made of each of the six files before editing
- [ ] Not applicable: no feature flag exists for a static attribute
- [ ] Not applicable: no deployed runtime or monitoring surface exists for this skill's assets

### Rollback Procedure
1. Stop editing the file where the failure surfaced.
2. Restore that file from its pre-edit copy with `cp`, never `git checkout --`.
3. Rerun `node scripts/check-corpus.cjs` and confirm `RESULT: PASSED` before resuming.
4. Not applicable: no external stakeholders consume this skill's internal checker output.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---
