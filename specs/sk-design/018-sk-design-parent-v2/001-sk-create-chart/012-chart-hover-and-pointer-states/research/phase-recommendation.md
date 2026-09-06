---
title: "Phase Recommendation: chart hover and pointer states"
description: "Eight implementation phases, their files, the requirements and acceptance criteria each one closes, what may run in parallel and how a reviewer proves each phase without trusting the one before it."
trigger_phrases:
  - "chart hover phases"
  - "pointer contract implementation plan"
  - "data-chart-inert rollout"
  - "chart interaction phasing"
importance_tier: "important"
contextType: "planning"
---

# Phase Recommendation: chart hover and pointer states

> Companion to `research.md`, which carries the decided per-form contract, the mechanism and
> the four corrected claims. Read that first. This document only says in what order to build
> it and how to know each step worked.

All paths are relative to `.opencode/skills/sk-doc/sk-create-chart/` unless written in full.

**The green rule.** Every phase ends with `node scripts/check-corpus.cjs` printing
`RESULT: PASSED`. Read the marker, not the exit code, and read the per-check assertion counts
too: a check with zero assertions ran on nothing. That is the standing exit condition and it
is not repeated per phase below.

**Before phase 1, capture the baseline.** Iteration 3 reported `RESULT: PASSED` with zero
errors, and that run was not repeated during synthesis. Run it once against the untouched
tree and keep the output. Every phase here assumes the corpus is green today, and if it is
not, the ordering changes.

**Restore discipline, everywhere.** `cp` the file aside before a mutation and `cp` it back.
Never `git checkout --`, which reverts to the last commit rather than the working state and
silently throws uncommitted work away. This is `scripts/README.md`'s own rule and it exists
because someone lost work to it.

---

## PHASE OVERVIEW

| # | Phase | Depends on | Runs with | Size |
| --- | --- | --- | --- | --- |
| 1 | The register and the recorded contract | baseline | alone | large, unavoidably |
| 2 | Annotate the six inert forms | 1 | 3 | small |
| 3 | Extract the excerpt, transfer to `grouped-bars` | 1 | 2 | medium |
| 4 | Transfer to `stacked-bars`, `daily-line`, `bar-line-composed` | 3 | 5, 6 | medium |
| 5 | `stacked-area`, after settling its readout | 3 | 4, 6 | medium, plus a decision |
| 6 | `daily-range`, the form with no register today | 3 | 4, 5 | medium |
| 7 | The six deliveries under `assets/examples/` | 4, 5, 6 | alone | unknown until the decision |
| 8 | Closure | 7 | alone | medium |

---

## PHASE 1: The register and the recorded contract

**Objective.** Land `data-chart-inert` in the checker and record all 21 pointer contracts in
the corpus documents, with nothing yet annotated, so the corpus stays green on the day the
rule arrives.

**Files.**

- `scripts/check-corpus.cjs`: one constant plus two branches inside the existing interaction
  checks. Do not add the attribute to `INTERACTION_REGISTERS` at `:1130`.
- `references/template-contract.md`: a fourth row in the register table at `:413-417`, the
  21-row contract table, the touch decision, the corrected sentence at `:403` and section 7
  renamed from sixteen rules to seventeen with the new rule row.
- `scripts/README.md`: the two mutation recipes in section 5, and the new check named in
  section 4.

**Closes.** REQ-001 (documented half), REQ-005, REQ-006, REQ-007. AC-001, AC-006, AC-008,
AC-009.

**Verification.** Four observations, in this order.

1. `RESULT: PASSED` from the untouched corpus with the rule in place. Nothing is annotated,
   so nothing matches either error branch.
2. The contradiction mutation: add `data-chart-inert="every encoded value is printed beside
   its mark"` to the root `<figure>` of `assets/templates/heat-matrix.html`, which already
   carries `data-chart-tooltip`. Expect `RESULT: FAILED` naming that branch. Restore from the
   copy and expect `RESULT: PASSED`.
3. The empty-reason mutation: add `data-chart-inert=""` to a form carrying no register.
   Expect `RESULT: FAILED` naming that branch. Restore.
4. `ls assets/templates/*.html` counted against the contract table rows: 21 on both sides,
   with a stated reason on every `inert` row.

Step 3 is the one most likely to be skipped, and skipping it is why AC-006 exists. One
mutation that fails proves something fired. It does not prove which branch.

**Why it cannot be split.** The rule and its documentation and its failure proof are one
unit. The corpus's own standard, in `scripts/README.md` section 7, is that a rule the tooling
does not check is a wish, and the inverse holds too: a check nobody has watched fail is a
check nobody should quote.

---

## PHASE 2: Annotate the six inert forms

**Objective.** Give each correctly-inert form its declaration and its reason.

**Files.** `assets/templates/progress-single.html`, `unit-ring.html`, `unit-grid.html`,
`independent-percentages.html`, `bar-columns.html`, `bar-rows.html`. One attribute each, on
the root `<figure>`, with the reason from `research.md` section 2.

**Closes.** REQ-001 (markup half). Completes AC-001.

**Verification.** `grep -c data-chart-inert assets/templates/*.html` returns a non-zero count
for exactly those six files and zero for the other fifteen. Each value is a readable clause,
not a placeholder. The `interaction-hygiene` line in the run summary reports zero failures,
which confirms that the new attribute did not accidentally join the register array.

**Parallel.** Runs alongside phase 3. Disjoint files, and none of these six is a form that
gains a card.

---

## PHASE 3: Extract the excerpt and transfer it to `grouped-bars`

**Objective.** Turn the box-plot mechanism into a reusable excerpt, prove it transfers into a
form that did not have it, and measure what one copy costs.

**Files.** `assets/templates/grouped-bars.html`.

`grouped-bars` is the first transfer because it is the simplest readout in the set: one series
name, one value, `TIP_ROWS = 1`. It already carries `data-chart-legend`, `data-chart-dim` and
the hygiene line, so nothing about the surrounding file has to change. Whatever goes wrong
here is the mechanism and not the form.

**Closes.** Part of REQ-006. Produces the measurement AC-011 needs.

**Verification.**

1. `RESULT: PASSED`, with `interaction-hygiene`, `interaction-state` and `number-format` each
   reporting zero failures. The last one matters: `check-corpus.cjs:1214` starts requiring an
   own `fmt()` the moment `data-chart-tooltip` appears in the markup.
2. Open the file with no network. The card opens on hover over any column, on the correct
   column, and flips to the other side of a mark near the right edge rather than opening past
   the frame.
3. A tap pins. A tap on another column re-pins. A second tap on the pinned column clears it.
   A tap outside the drawing clears it. Hover does nothing while pinned.
4. Set the system to reduced motion and confirm the card appears with no fade, rather than a
   fast one.
5. Open it with scripting disabled and confirm the figure and table read exactly as before.
6. Record the byte delta: `wc -c` before and after. The excerpt measured 7,016 bytes in
   `box-plot.html`, so expect roughly that plus per-form registration.

**Why one form.** Everything after this is mechanical. Getting the excerpt wrong once and
copying it five times is the failure this phase exists to prevent.

---

## PHASE 4: `stacked-bars`, `daily-line`, `bar-line-composed`

**Objective.** Apply the proven excerpt to the three remaining forms whose readout fits it
unchanged.

**Files.** `assets/templates/stacked-bars.html`, `daily-line.html`,
`bar-line-composed.html`.

Readouts, from `research.md` section 6.6: `stacked-bars` names the segment and gives its
value, `TIP_ROWS = 1`. `daily-line` names the day and gives its value, `TIP_ROWS = 1`.
`bar-line-composed` names the period and gives the count and the rate, each tagged with the
ladder it reads against, `TIP_ROWS = 2`.

All three already carry a register and the hygiene line, so no stylesheet work is needed
beyond the card classes and the reduced-motion guard.

**Closes.** Most of REQ-006. Contributes to AC-008.

**Verification.** The phase 3 walk, per form. Two form-specific checks on top.

- `stacked-bars`: hover a segment shorter than 22 units and confirm the card supplies the
  number the figure does not print. Hover a tall one and confirm the card agrees with the
  label printed inside it rather than contradicting it.
- `bar-line-composed`: confirm each row of the card says which ladder it reads against. The
  form's whole reason for a card is that the two ladders share one gridline set, so an
  untagged pair of numbers reproduces the ambiguity instead of resolving it.

**Parallel.** Runs alongside phases 5 and 6. Disjoint files, and all three phases consume the
same excerpt without changing it.

---

## PHASE 5: `stacked-area`, after settling its readout

**Objective.** Give `stacked-area` a card, once someone has decided what it points at.

**Files.** `assets/templates/stacked-area.html`, and possibly the contract row phase 1 wrote
for it.

**The decision, which blocks the build and not the phase.** The decided readout is all four
band values plus the total at the pointed x. The mechanism registers marks and reads their
bounding box, and this form's bands are single paths spanning the full width
(`stacked-area.html:343-346`), so pointing at a band identifies a series and not an x. Two
ways out, and the research reached neither:

- Give the form per-x hit targets, which is machinery this corpus has never carried and which
  costs more than the excerpt.
- Reduce the readout to the pointed band alone, which contradicts the iteration 4 finding
  that a single value does not answer what a stack column shows, and which needs the contract
  row amended to match.

Settle it before opening the file. If the second option wins, amend the row phase 1 wrote
rather than leaving the document describing a card nobody built.

**Closes.** The rest of REQ-006. Completes AC-008.

**Verification.** The phase 3 walk, plus: every value the card prints appears in the table
below the chart, including the total. `stacked-area`'s Total exists in the table at `:421`
and nowhere in the drawing, so this is the form where the rule against a card printing a
figure the table does not carry is easiest to break.

**Parallel.** Runs alongside phases 4 and 6, once its decision is made.

---

## PHASE 6: `daily-range`, the form with no register today

**Objective.** Take the one form the spec filed as inert and give it the card it turned out
to need.

**Files.** `assets/templates/daily-range.html`.

Three things make this form different from the other five.

1. It carries no interaction register at all today, so it is the only one where adding
   `data-chart-tooltip` newly triggers the focus-ring requirement at `check-corpus.cjs:1146`.
   Verified: `daily-range.html` contains zero occurrences of `:focus:not(:focus-visible)`.
   That line ships in the same change or the corpus turns red.
2. Its readout is two rows, the day's low and its high, `TIP_ROWS = 2`. **Never a midpoint.**
   A midpoint is the average this form exists to refuse, and its own subtitle says so.
3. Its `desc` at `:143` already promises "the table below the chart carries both bounds for
   every day", so REQ-002 is satisfied before the card exists.

**Closes.** REQ-001 and REQ-006 for the last unbuilt form.

**Verification.** The phase 3 walk, plus: the `interaction-hygiene` check reports zero
failures, which is the specific thing this form could break. Then delete the hygiene line
alone and confirm the check fails on `daily-range`, which proves the line is doing work rather
than sitting there. Restore from the copy.

**Parallel.** Runs alongside phases 4 and 5.

---

## PHASE 7: The six deliveries under `assets/examples/`

**Objective.** Decide and then apply what a delivered chart owes a pointer.

**Files.** Zero to six of `assets/examples/*.html`, plus a paragraph in
`references/template-contract.md`.

**This phase starts with an operator decision, not with an edit.** Measured, none of the six
deliveries carries `data-chart-tooltip`, `data-chart-legend`, `data-chart-dim` or the hygiene
line. Three of them are deliveries of forms whose templates carry a working hover card:
`calls-by-day-and-hour` from heat-matrix, `pick-times-by-depot` from distribution-strip and
`van-age-against-repair-cost` from scatter. A fourth, `orders-after-the-price-change`, comes
from `daily-line`, which phase 4 gives a card. The remaining two come from inert forms.

So the interaction layer is template-only today, and the packet has to say whether that is a
gap or a position. Two answers, both defensible:

- **Bring the deliveries up to their parents' contracts.** Four files gain the mechanism, two
  gain the inert declaration. Expensive and consistent.
- **Record that a delivery is a separate artifact whose pointer state is its author's
  choice.** Cheap, and it needs a written reason rather than silence.

There is a warning against the cheap answer in the corpus's own history. `checkEmptyNotice`
exempted deliveries on the stated ground that each carried the notice of the form it came
from, the ground was checked, none of the six did, and the exemption was removed
(`check-corpus.cjs:1750-1756`). An exemption nobody verified is what that comment is about.

**Closes.** Nothing on its own. It removes the largest thing the research never looked at,
and it decides whether AC-003, AC-007 and AC-010 are being read across 21 files or across 30.

**Verification.** Whichever answer wins, the run is green and the contract document states
the answer in a sentence a reader can disagree with. Silence does not close this.

**Cannot run in parallel.** It depends on the daily-line card existing, and if the expensive
answer wins it re-uses the excerpt three more times.

---

## PHASE 8: Closure

**Objective.** Produce the evidence the acceptance criteria ask for and reconcile the packet.

**Files.** `acceptance-criteria.md`, and a decision record if AC-005 is waived.

**Closes.** REQ-002, REQ-003, REQ-008, NFR-P02. AC-002, AC-003, AC-004, AC-005, AC-007,
AC-010, AC-011.

**Work, in order.**

1. **The render run.** `node scripts/check-corpus.cjs --render`, which AC-007 names
   specifically. It needs a Chrome or Chromium binary on the usual paths or named by
   `CHROME_PATH`, and it errors rather than skipping when it finds none
   (`check-corpus.cjs:1626-1629`). Read `RESULT: PASSED` from the output, not the exit code.
2. **The no-script pass, AC-003.** Open each of the 13 forms whose contract is `tooltip` with
   scripting disabled and confirm the figure and the table read as they do today. The card
   ships empty and the drawing code fills it, so with no script there is nothing to hide.
3. **The first-paint check, AC-004.** On the heaviest form, confirm the figure is readable
   before any pointer logic has run. No listener is attached until the drawing is finished
   and `svg.appendChild(tipLayer)` is the last thing the script does.
4. **The keyboard walk, AC-002.** One form per contract class. Confirm every value a card
   reveals is present in that form's `data-chart-table`, and that the six existing `tabindex`
   controls still latch and still show a focus ring on a tab and not on a click.
5. **The external-resource grep, AC-010.** Count external `src`, `href` and `import` targets
   across the corpus and confirm the number has not moved. The `no-external` check already
   reads every static reference, so this is a second reading rather than the only one.
6. **The byte table, AC-011.** Before and after, per changed file. The measured excerpt is
   7,016 bytes. Report the real per-file numbers rather than the estimate, and report them as
   a table rather than a sentence saying the cost is small.
7. **AC-005.** It cannot be met as written, because the scope constraint forbids the shared
   runtime its verification step assumes. Restate it against the declaration surface, or waive
   it with a decision record that says so. Do not mark it Met.
8. **The completeness question.** Decide whether silence keeps passing now that all 21 forms
   are annotated. Phase 1's rule lets an unannotated form through, which was correct as a
   migration argument and expires the day the migration ends. There is a precedent for the
   strict reading in `checkCatalogResolves` at `check-corpus.cjs:1538-1542`, which errors when
   a template on disk has no catalog row. If the answer is to tighten it, that is a ninth
   phase and it needs its own mutation proof. If the answer is to leave it, write the reason
   down.

**Verification.** Every row in `acceptance-criteria.md` reads `Met`, `Waived` or `Superseded`,
every waiver names a decision record that exists, and the evidence column carries a command
or a file reference rather than an assertion.

---

## WHAT RUNS IN PARALLEL, AND WHAT CANNOT

**Parallel: phases 2 and 3.** Disjoint files. Phase 2 touches six templates that gain an
attribute and no code. Phase 3 touches one template that gains code and no attribute.

**Parallel: phases 4, 5 and 6.** Disjoint templates, and all three consume the phase 3
excerpt without modifying it. Phase 5 carries a decision that gates its own start and not the
others.

**Strictly serial: 1 before everything.** The register has to exist before anything declares
it, and the contract table has to exist before a reviewer can check a form against it. The
migration ordering is the point: with nothing annotated, no file matches an error branch, so
the rule lands on a green corpus.

**Strictly serial: 3 before 4, 5 and 6.** They copy what phase 3 produces. Starting them in
parallel with phase 3 means three copies of an excerpt that is still changing.

**Strictly serial: 7 after 4, 5 and 6.** One delivery comes from `daily-line`, and if the
expensive answer wins the others need the finished excerpt too.

**Strictly serial: 8 last.** It is the only phase that reads the final state.

---

## SIZING, HONESTLY

**Merged.** The checker rule, the contract document and the mutation recipes are one phase
rather than three. They fail as a unit: a rule with no documentation is undiscoverable, a
documented rule with no check is a wish, and a check nobody has watched fail is not evidence.

**Split.** The six card transfers are four phases rather than one. Six copies of a 7,016 byte
mechanism, each needing a hover walk, a pin walk, a reduced-motion check and a no-script check,
is more than one reviewer can hold in a single pass. The split lines are not arbitrary: phase
3 is the form that proves the excerpt, phase 4 is the three that fit it unchanged, phase 5 is
the one whose readout does not fit, and phase 6 is the one whose surrounding file has to
change too.

**Not sized, deliberately.** Phase 7 has no size until its decision is made. It is either a
paragraph or four more transfers, and guessing which would be the kind of estimate this packet
exists to stop making.
