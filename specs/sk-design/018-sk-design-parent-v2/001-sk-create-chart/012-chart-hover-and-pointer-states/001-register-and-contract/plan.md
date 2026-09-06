---
title: "Implementation Plan: The register and the recorded contract"
description: "Add a fourth interaction register, data-chart-inert, to check-corpus.cjs as two branches folded into the existing interaction checks, and record all 21 forms' pointer contracts, the touch decision and the corrected claims in the two reference documents. Nothing is annotated in this phase."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: The register and the recorded contract

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Static HTML chart templates (inline CSS and ES5-compatible inline JavaScript, no build step) plus a CommonJS Node.js script, `check-corpus.cjs`, with no external dependencies |
| **Framework** | None. `REQ-008` forbids a shared runtime, a framework, a CDN reference or a build step for any chart form |
| **Storage** | None |
| **Testing** | `node scripts/check-corpus.cjs`, reading `RESULT: PASSED` or `RESULT: FAILED` from the printed output, never the exit code alone, plus the two deliberate mutation recipes this phase adds to `scripts/README.md` section 5 |

### Overview
This phase adds a fourth interaction register, `data-chart-inert`, to `check-corpus.cjs`, as two new branches folded into the existing `checkInteractionHygiene` function, and records all 21 forms' decided pointer contracts, the touch decision and four corrected claims in `references/template-contract.md` and `scripts/README.md`. Nothing is annotated. The corpus must print `RESULT: PASSED` both before this phase starts and immediately after the rule lands, and two deliberate mutations must each print `RESULT: FAILED` naming the branch they broke before being restored.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `node scripts/check-corpus.cjs` prints `RESULT: PASSED` against the untouched corpus, captured and kept as the baseline
- [ ] The exact line ranges below (`check-corpus.cjs:1130` and `:1138-1160`, plus `template-contract.md:403`, `:411-417` and its section 7 header) are confirmed against the working tree, since a prior edit could have shifted them

### Definition of Done
- [ ] `node scripts/check-corpus.cjs` prints `RESULT: PASSED` from the final state, with nothing annotated
- [ ] Both mutation recipes in section 5 of this plan have been run, watched to fail naming the right branch, and restored
- [ ] `references/template-contract.md` contains 21 rows in the per-form contract table, a fourth register row, the corrected sentence, the renamed section 7, the touch decision and the deliveries-scope sentence
- [ ] `scripts/README.md` names the new assertions in section 4 and carries both new recipes in section 5
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
None, in the application-framework sense. This is a declarative attribute contract enforced by a static Node script. Each of the 21 chart forms is an independent, self-contained HTML file. `check-corpus.cjs`'s `main()` (`check-corpus.cjs:1718`) walks every file under `assets/templates/`, `assets/examples/` and the palette proof sheets, and `regionsOf()` (`check-corpus.cjs:369`) splits each file into `markup`, `styles` and `scripts` string regions before any check reads it.

### Key Components

- **`INERT_ATTR`** (proposed name: an implementer may choose another, but must record the choice), a new constant placed beside `INTERACTION_REGISTERS` at `check-corpus.cjs:1130`. It names the `data-chart-inert` attribute the same way `HYGIENE_RULE` names the focus-ring pattern, so the enforcement code reads from one source rather than a repeated string literal.
- **Two new branches inside `checkInteractionHygiene`** (`check-corpus.cjs:1138-1160`), placed immediately after the existing `carried` computation at `check-corpus.cjs:1143`. They reuse `carried` rather than recomputing which of the three registers the file declares, so the new contradiction branch and the existing hygiene-line branch agree on what "carries a register" means. See section 3's code block below for the exact logic.
- **`tally('interaction-hygiene', 2)` at `check-corpus.cjs:1140`**. Raise the second argument from `2` to `4`, one more for each of the two new assertions this phase adds, so a run summary that reports `interaction-hygiene` with a stale count is visibly wrong rather than silently reused. Confirm this against how `tally()` is used elsewhere before finalizing the number: `tally()` accumulates the count of assertions a check performs per file, not the count of errors it raises (see `checkNumberFormat` at `check-corpus.cjs:1201`, which ties its count to `LOCALE_FORMATTERS.length + 1`, one assertion per formatter plus one for the hover-card `fmt()` check).
- **The register table** at `references/template-contract.md:413-417` (currently three rows: `data-chart-tooltip`, `data-chart-legend`, `data-chart-dim`). Gains a fourth row for `data-chart-inert`.
- **A new "The pointer contract, per form" table**, placed in `references/template-contract.md` section 10, after the register table. Carries the full 21-row contract. Exact content is in section 4 below.
- **A new "The readout the six newly-tooltip forms owe" table**, placed immediately after the 21-row table. Carries the shape of the hover card for the six forms gaining a tooltip in phases 3 through 6. Exact content, including the corrected `stacked-area` row, is in section 4 below.
- **Section 7's rule table** (currently "## 7. THE SIXTEEN RULES", `references/template-contract.md:279`). Renamed to "## 7. THE SEVENTEEN RULES", with one new numbered row.
- **The sentence at `references/template-contract.md:403`**. Corrected, since it currently claims something false about `daily-range`.
- **`scripts/README.md` section 5** (mutation recipes, starting at line 99). Gains the two new recipes for the inert register.
- **`scripts/README.md` section 4** (starting at line 59). The `interaction-hygiene` bullet gains a clause naming the two new assertions, so the check's description in the README stays a complete account of what the check name covers.

### Data Flow
`main()` (`check-corpus.cjs:1718`) reads every file under `htmlFilesUnder(ASSET_ROOT)`, which already includes all 21 templates, all 6 deliveries under `assets/examples/`, and the 3 palette proof sheets. For each file it calls `checkInteractionHygiene(name, src)` among the other per-file checks. The new branches read the same `markup` string `checkInteractionHygiene` already extracts, look for `data-chart-inert="..."` with a regex the same shape as the one `checkInteractionState` already uses for `data-chart-dim` at `check-corpus.cjs:1173`, and compare its presence and value against `carried`, the array of already-declared registers computed two lines above. Because `main()` already includes `assets/examples/` in the files it scans, the new rule applies to deliveries automatically, with no second code path, which is what lets the contract document state that its scope covers both templates and deliveries without waiting for phase 7 to write new enforcement.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. This phase adds a new declarative register and its documentation. It is not a bug fix, and it touches no security boundary, path handling, environment precedence, schema boundary, persistence layer, public response shape or shared policy outside this skill's own corpus checker.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### The exact checker change

Add the constant beside `INTERACTION_REGISTERS` at `check-corpus.cjs:1130`:

```js
const INTERACTION_REGISTERS = ['data-chart-tooltip', 'data-chart-legend', 'data-chart-dim'];
const HYGIENE_RULE = /:focus\s*:not\(\s*:focus-visible\s*\)/;
// A form that answers no pointer says so, and says why, in one attribute. It never joins
// INTERACTION_REGISTERS: that array drives the focus-ring requirement below, and a form
// that refuses the pointer owes no focus rule.
const INERT_ATTR = 'data-chart-inert';
const INERT_RULE = /\bdata-chart-inert\s*=\s*"([^"]*)"/;
```

Inside `checkInteractionHygiene`, immediately after the existing `carried` computation (`check-corpus.cjs:1143-1145`) and before the existing hygiene-line check at `check-corpus.cjs:1146`, add:

```js
const inertMatch = INERT_RULE.exec(markup);
if (inertMatch) {
  const reason = inertMatch[1].trim();
  if (carried.length) {
    record('interaction-hygiene', 'error', file,
      `the markup declares data-chart-inert and ${carried.join(', ')}. A form cannot both refuse the pointer and answer it. Remove the inert declaration or the carried register`);
  } else if (!reason) {
    record('interaction-hygiene', 'error', file,
      'the markup declares data-chart-inert with no reason. The value is the why, and an inert form that cannot say why the static figure suffices has not made the declaration');
  }
}
```

Bump the tally call at the top of the function from `tally('interaction-hygiene', 2);` to `tally('interaction-hygiene', 4);`.

Do not add `INERT_ATTR`'s value to `INTERACTION_REGISTERS`. Verified in `research.md`: none of the six forms that will carry `data-chart-inert` (phase 2) has the hygiene line today, so joining the array would turn the corpus red the moment they are annotated.

### The register table's new row

Add to `references/template-contract.md`'s three-row register table (`:415-417`):

```
| `data-chart-inert` | the chart's figure wrapper (the `<div class="figure" data-chart-part="figure">` element, not a literal `<figure>` tag) | The form correctly answers a pointer with nothing. The attribute's value is the reason, and an empty or whitespace-only value fails the check |
```

Note for the builder: every template's on-screen figure region is a `<div class="figure" data-chart-part="figure">`, verified at, among others, `progress-single.html:161`, `unit-ring.html:130`, `bar-columns.html:149`. There is no literal `<figure>` HTML element anywhere in this corpus. Where this plan and `phase-recommendation.md` say "the root `<figure>`," they mean this div.

### The corrected sentence at `references/template-contract.md:403`

Current text: "A chart answers a pointer. Thirteen forms do, counting all three registers rather than the hover card alone, and the eight that do not are the ones whose marks already print their own value, where a card would repeat what the reader is looking at."

Replace with: "A chart answers a pointer. Thirteen forms do today, counting all three registers rather than the hover card alone. Of the eight that do not, seven are forms whose marks already print their own value, where a card would repeat what the reader is looking at. The eighth, `daily-range`, prints neither of the two values it encodes and is the reason this packet exists. See the per-form table below for the decided contract of all 21 forms."

### Section 7: sixteen rules become seventeen

Rename the header at `references/template-contract.md:279` from `## 7. THE SIXTEEN RULES` to `## 7. THE SEVENTEEN RULES`, and update its introductory sentence ("Every rule below is enforced, and three are enforced in part.") if the count of partially-enforced rules changes as a result of this row. It does not, so the sentence stays. Add one new row to the rule table, currently 16 numbered rows ending at rule 16 in the file, numbering the new one 17:

```
| 17 | A form that refuses the pointer says why, and cannot also carry a register that answers one | `interaction-hygiene` | A form claiming both that it needs no pointer and that it answers one, or an inert claim nobody can act on because it names no reason |
```

### The touch decision

Add to `references/template-contract.md` section 10, after the "What a handler may not do" list and before "## 11. RELATED DOCUMENTS":

```
### Touch

A tap on a mark opens and pins its readout. A tap on a different mark re-pins to it. A second
tap on the same mark, or a tap anywhere outside the drawing, dismisses it. Hover yields while a
mark is pinned, so the two input modes do not fight each other.

Not guaranteed, and stated so rather than left silent: drag to scrub across marks (a pointer
move is ignored while pinned, by design), long press or any other native touch affordance, and
dismissal from inside the drawing except through the pinned mark itself. None of it applies to a
form that has not received the hover mechanism.

Nothing in `check-corpus.cjs` asserts any of this. The gesture is runtime behaviour a static
check cannot see.
```

### The deliveries-scope sentence

Add one sentence to the top of section 10's introduction (immediately after "## 10. WHAT A FILE MAY DO WITH A POINTER"), so the contract's scope reads correctly ahead of phase 7:

```
This contract binds every rendered chart artifact this skill ships, the 21 forms under
`assets/templates/` and the deliveries under `assets/examples/` alike. A delivery inherits its
parent template's contract, and it does not get to answer the pointer differently just because it is
a rendered example rather than a template.
```

### The 21-row pointer contract table

Add this table to `references/template-contract.md` section 10, immediately after the register table and the deliveries-scope sentence:

```
### The pointer contract, per form

| Form | Contract | Reason |
| --- | --- | --- |
| `box-plot` | `tooltip` | Reference implementation. Five-number summary per box, none of it printed in the drawing |
| `calendar-grid` | `tooltip` | Shipped and working. No defect found |
| `candlestick` | `tooltip` | Shipped and working. No defect found |
| `distribution-strip` | `tooltip` | Shipped and working. No defect found |
| `heat-matrix` | `tooltip` | Shipped and working. No defect found |
| `scatter` | `tooltip` | Shipped and working. No defect found |
| `treemap` | `tooltip` | Shipped and working. No defect found |
| `stacked-bars` | `tooltip` | A segment under 22 units prints no value, and the form draws no tick ladder a reader could interpolate against |
| `stacked-area` | `tooltip` | Band values and the stack total exist only as thickness in the drawing. The Total column exists in the table and nowhere in the figure. See the readout table below: the card's scope is the pointed band's identity, not every band's value |
| `grouped-bars` | `tooltip` | Column values are geometry with nothing printed on the mark. The axis ticks bracket a reading rather than giving one |
| `bar-line-composed` | `tooltip` | Two ladders share one gridline set, so an off-scale bar height cannot be converted with confidence even by a willing reader |
| `daily-line` | `tooltip` | The emphasised low is the only printed reading. Every other point on the line is position only |
| `daily-range` | `tooltip` | Each day's minimum and maximum exist only as the two endpoints of a bar and are never printed |
| `parallel-axes` | `terminal` | Every dot carries a native `<title>` naming its label, axis, value and unit, and both axis bounds are printed in the figure. The title is a pointer-only affordance: every svg in this corpus carries `role="img"`, so a mark-level title is announced to nobody by a screen reader. Keyboard and screen-reader users reach the same values through the data table |
| `waterfall` | `terminal`, native title | Every step's delta is printed above its bar, and each bar carries a native `<title>` naming the value and the running total. This form declares none of the three interaction registers today: it is not a legend-or-dim form, it carries no register of any kind. As with `parallel-axes`, the title reaches a pointer and the data table, not a screen reader |
| `progress-single` | `inert` | The datum, its goal, its share and its pace comparison are each printed in the figure |
| `unit-ring` | `inert` | Each group's count is printed in the key beside its swatch, and the total is printed at the ring's centre |
| `unit-grid` | `inert` | Each part's share is printed in the key with its percent sign, and a square is one percent by construction |
| `independent-percentages` | `inert` | Each track's percentage is printed to its right and its name to its left |
| `bar-columns` | `inert` | Each column's value is printed above it |
| `bar-rows` | `inert` | Each bar's value is printed at its end, with its unit suffix |
```

That is 21 rows. Verify with `ls assets/templates/*.html | wc -l`, which returns 21, and confirm every `inert` row states a reason rather than an omission.

### The readout table for the six newly-tooltip forms

Add immediately after the table above. This table exists so phases 3 through 6 do not have to re-derive each form's card shape:

```
### The readout the six newly-tooltip forms owe

| Form | Card name | Rows | `TIP_ROWS` |
| --- | --- | --- | --- |
| `stacked-bars` | the segment | its value | 1 |
| `grouped-bars` | the series (`Last year` or `This year`) | its value | 1 |
| `daily-line` | the day | its value | 1 |
| `daily-range` | the day | low, high. Never a midpoint: a midpoint is the average this form exists to refuse | 2 |
| `bar-line-composed` | the period | count, rate, each row tagged with the ladder it reads against | 2 |
| `stacked-area` | the pointed band's series name | its total across the period, summed the way the table's own `Total` column is summed (`stacked-area.html:421`). A band's path spans the whole width, so the card cannot place a period on it, and the value is therefore a band-level aggregate rather than a reading at the pointer | 1 |
```

Note for the builder of phase 5: this `stacked-area` row overrides an earlier figure from the research (`all four band values plus the total`), which assumed per-x hit targets that were never built. Do not build a five-row card for `stacked-area`. Build a one-row card: the band's series name plus its period total. The operator settled this as name plus value, so a name-only card does not satisfy it, and a per-x reading is not buildable without machinery this packet excludes.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static check | Every file `check-corpus.cjs` reads (21 templates, 6 deliveries, 3 palette sheets) | `node scripts/check-corpus.cjs`, read the printed `RESULT:` line, not the exit code alone |
| Negative control (mutation) | `heat-matrix.html` (contradiction branch), a register-free form such as `progress-single.html` (empty-reason branch) | `cp` the file aside, mutate, run the checker and confirm `RESULT: FAILED` names the right branch, `cp` the file back, run the checker again and confirm `RESULT: PASSED` |
| Structural count | `references/template-contract.md`'s new 21-row table | `ls assets/templates/*.html \| wc -l` against the table's row count |
| Manual read | `references/template-contract.md` section 10 and `scripts/README.md` sections 4 and 5 | Read for the corrected sentence, the renamed section 7, the touch decision and the two new recipes |

**The negative control is the step most likely to be skipped.** A checker that has only ever printed `RESULT: PASSED` is not evidence the new rule does anything. Both mutations must be watched failing, by name, before this phase can claim `RESULT: PASSED` means what it says.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Untouched corpus baseline (`RESULT: PASSED`) | Internal | Green as of 2026-09-05, per `research.md` section 3's note on Iteration 3's run. Re-verify before editing | If red, escalate rather than build on top of a failing baseline |
| `check-corpus.cjs`'s existing `checkInteractionHygiene`, `carried` computation, `record()` and `tally()` | Internal | Stable, unmodified by this phase except for the additions above | If the function's shape has changed since `research.md` was written, re-read `check-corpus.cjs:1126-1160` before applying the snippet above |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The corpus fails to reach `RESULT: PASSED` after the checker change lands, or either mutation recipe fails to reproduce the expected `RESULT: FAILED`.
- **Procedure**: `cp` `check-corpus.cjs`, `references/template-contract.md` and `scripts/README.md` aside before editing any of them. If a step fails, restore the affected file from its copy (never `git checkout --`, which reverts to the last commit and can discard uncommitted work elsewhere in the tree) and rerun `node scripts/check-corpus.cjs` until it prints `RESULT: PASSED` again.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (confirm baseline) ──► Core (land the constant, the two branches, the tally bump,
                                    the four documentation edits) ──► Verify (both mutations,
                                                                             the row count,
                                                                             final RESULT: PASSED)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | Packet phases 2 through 6, which all depend on this phase's checker rule and contract table |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Baseline run, under 15 minutes |
| Core Implementation | High | The checker change is small, but the 21-row table, the readout table, the corrected sentence, the renamed section and two recipes are a large, unavoidable documentation surface |
| Verification | Medium | Two mutation recipes, each requiring a watched failure and a restore, plus a manual read of both reference documents |
| **Total** | | Large for a Level 2 phase, consistent with `phase-recommendation.md`'s own sizing note that this phase "cannot be split" |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] `cp` made of `check-corpus.cjs`, `references/template-contract.md` and `scripts/README.md` before any edit
- [ ] Not applicable: no feature flag exists for a static corpus checker
- [ ] Not applicable: no deployed runtime or monitoring surface exists for this skill's assets

### Rollback Procedure
1. Stop editing the file where the failure surfaced.
2. Restore that file from its pre-edit copy with `cp`, never `git checkout --`.
3. Rerun `node scripts/check-corpus.cjs` and confirm `RESULT: PASSED` before resuming.
4. Not applicable: no external stakeholders consume this skill's internal checker output.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A. No data store is involved.
<!-- /ANCHOR:enhanced-rollback -->

---
