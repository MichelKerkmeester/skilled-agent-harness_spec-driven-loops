# Iteration 3: Whether the proof suite proves what it claims, and what the corpus's index and pictures leave unproven

## Focus

Dimensions: **coverage**, **test quality**.

Surfaces: `scripts/tests/corpus-mutations.test.cjs` in whole (harness, the four case tables, the three
self-completeness guards), `scripts/tests/apply-design-md.test.cjs`, `scripts/tests/fixtures/`, the
registration sites and `record()` call set of `scripts/check-corpus.cjs`, the two write-side gates in
`scripts/apply-design-md.cjs`, the 29 catalog rows against the 29 shipped forms and the 32 committed
PNGs, `README.md` §SCREENSHOTS at `:127-146`, `../shared/scripts/render-screenshots.cjs`, and
`.github/workflows/chart-corpus.yml`.

Test method: run the suite and the checker and read their real output; then break the checker's rules
by hand and ask whether the suite has a case that would notice; then resolve each count, name and
index a document asserts against the tree. Nothing was taken from a document's own summary of itself.

Two findings from earlier iterations are in scope for this iteration and are **not repeated**:
F001 (the design-md gate list in `color-system.md` names gates the code does not apply) appears here
only as an input — the gates it discusses have no coverage, which is a separate defect. F008 (the
suite is invisible to a reader) is not re-made; everything below assumes a reader has found the
suite, and asks what it proves once found.

## Scorecard

- Dimensions covered: coverage, test quality
- Files reviewed: 8 packet files read in whole or in part, the two earlier iteration reports, and
  32 rendered images compared byte for byte
- New findings: P0=0 P1=1 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.23 (3 new / 13 cumulative)

Baseline observed before any finding was recorded:

```
$ node --test scripts/tests/
  ℹ tests 84   ℹ pass 84   ℹ fail 0   ℹ skipped 0

$ node scripts/check-corpus.cjs
  files scanned: 32 (chart forms under assets/templates: 29)
  ... 42 families, 0 failure(s)
  Summary: errors: 0
```

`node --test scripts/tests/corpus-mutations.test.cjs` alone reports 74 pass, `apply-design-md.test.cjs`
reports 10 pass, both with 0 skips. The skip counter matters: the one browser case in
`apply-design-md.test.cjs:159-183` skips loudly (`t.skip(...)`, `:166`) rather than passing quietly,
and on this machine it ran.

## Findings

### P0, Blocker

None.

### P1, Required

- **F011**: **The mutation suite proves that each family can fire, while its own header says it proves
  that every assertion can fail, and one family's entire rule set is covered by a single case that
  touches the least important rule in it**, `scripts/tests/corpus-mutations.test.cjs:3` — *"Standing
  proof that every corpus assertion fails when the thing it describes is broken"* — and `:11-12` —
  *"Every case breaks one thing and expects one named family to say one specific thing about it"*.

  Measured on the shipped corpus: the checker makes **6,093 assertions across 42 families** (summed
  from the per-family counts its own run prints), and the suite holds **70 family-attributed cases**
  (74 tests in the file, minus the clean-baseline test at `:137-140` and the three guards at
  `:541-561`). **34 of the 43 families the guard requires a case for have exactly one case.** The
  file's own body is honest about this — *"One case each: enough that a family which stops firing is
  noticed"* (`:346-348`) — so the header and the body disagree, and the header is the sentence a
  reader takes away.

  The gap is not evenly spread. Counting `record()` call sites per family in `check-corpus.cjs`:
  `design-md` 11 sites / 1 case, `series-mapping` 19 / 1, `number-format` 11 / 1, `style-reference`
  9 / 1, `catalog` 8 / 1. `colour-literals` is 1,911 assertions with 1 case.

  Worked example, observed rather than inferred. The only `design-md` case (`:404-424`) builds a
  themed delivery with the applicator and mutates exactly one thing, the provenance line
  (`sha256=` → `sha=`), expecting `/provenance/`. I built a themed delivery the same way
  (`node scripts/apply-design-md.cjs --default --forms bar-columns --out /tmp/themed`,
  `RESULT: PASSED`) and mutated two things the case does not:

  ```
  # --chart-ink: #0A0A0A -> #EEEEEE in the light block
  FAIL [design-md] --extra/bar-columns.html: design-md light ink reads 1.16:1 on the light ground, below the 4.5:1 text gate

  # --chart-rule renamed, so the property set is short one member
  FAIL [design-md] --extra/bar-columns.html: design-md light palette properties are incomplete: missing --chart-rule; unexpected --chart-rule-x
  ```

  Both rules are live; neither has a case. Delete either one from `checkDesignMdBlock`
  (`check-corpus.cjs:526-641`) and the suite still reports 84/84, so the only standing proof that the
  theming feature's gates exist is that nobody has removed them yet. The same is true on the write
  side: `apply-design-md.test.cjs` asserts `failures.length === 0` for five references (four vendored
  fixtures at `:45`, the carried reference at `:132`) and observes exactly one gate ever refusing —
  the series-capacity filter, via `fixtures/refusal-design.md` (`:63-71`). `textOnSurface`,
  `markOnSurface` and `emphasisAgainstFirstSeries` (`apply-design-md.cjs:465-482`, applied at
  `:471-477`) are named nowhere in either test file (`grep -rn
  "textOnSurface\|markOnSurface\|emphasisAgainstFirstSeries" scripts/tests/` returns nothing), so the
  gates the write path applies are only ever seen passing.

  Why it matters: the packet's doctrine is that a green run is quotable (*"a check nobody has watched
  fail is a check nobody should quote"*, `scripts/README.md:338-339`) and that a mutation proves only
  that something fired, with a control proving which assertion was load-bearing
  (`scripts/README.md:426-428`). The suite's control is the per-case expectation regex. Where a
  family has one case, a family whose other rules are deleted is indistinguishable from a family that
  stays green — the header invites a maintainer to read the difference as proof.

  Change: bring the header down to what the body says (a case per family, so a family that stops
  firing is noticed), or bring the case set up to the header for the families the suite touches once —
  beginning with `design-md`, whose gates are the whole point of the theming path and whose rule set
  is the largest untested surface in the packet. F001's fix (moving the ramp-end gates into
  `validateTheme` and `checkDesignMdBlock`) will add rules to this same uncovered block.

### P2, Suggestion

- **F012**: **Seven cases expect nothing their harness can test, because their expectation regex is
  `/./`**, `scripts/tests/corpus-mutations.test.cjs:373` (`unique-ids`), `:382` (`no-external`),
  `:397` (`type-scale`), `:471` (`catalog-system`), `:491` (`palette-source-dark`), `:501`
  (`gradient-sweep`), `:508` (`interaction-hygiene`). The harness's own second assertion reads
  `assert.ok(after.some((line) => spec.expect.test(line)), '${spec.family} fired on something
  else')` (`:62-63`, `:95-96`, `:121-122`). With `expect: /./` on a list of non-empty `FAIL [family]`
  lines, `.some(...)` is true whenever `after.length > 0` — which the line directly above has already
  asserted (`:61`, `:94`, `:120`). The assertion **cannot fail independently**; the case carries the
  family-liveness check twice and the "fired on something else" check not at all. That is exactly the
  class the file says it exists to catch (`:11-14`).

  I ran each of the seven mutations through the real checker and read the output, so no case is
  passing for a wrong reason today: each fires exactly one rule and it is the intended one
  (`unique-ids` → *element id "chart" appears more than once*; `no-external` → *a remote src or href*;
  `type-scale` → *sets 15px, which is not one of the published rungs*; `catalog-system` → *names
  colour system "invented"*; `palette-source-dark` → *reads 1.01:1 on the dark ground, below the 3:1
  mark gate*; `gradient-sweep` → *a gradient runs between --chart-series-1 and --chart-series-2*;
  `interaction-hygiene` → *cannot both refuse the pointer and answer it*). The defect is that nothing
  would notice if that changed. Fix: paste the message fragment each mutation already produces in
  place of `/./`, e.g. `/element id "chart" appears more than once/` at `:373` and `/a remote src or
  href/` at `:382`. One more expectation matches too much for the same reason without being a
  wildcard: `:370` expects `/details/` where the message it is after is *no `<details class="data">`
  disclosure wraps the data-chart-table*; a fragment of that sentence is the whole word, too.

- **F013**: **The guard that keeps the suite complete reads the implementation as text, and the one
  family it cannot see is hand-patched, so a family registered any other way is covered by nothing
  and the guard stays silent**, `scripts/tests/corpus-mutations.test.cjs:527-534`. `registeredFamilies()`
  regexes `check-corpus.cjs` for `(?:tally|record)\(\s*'([a-z-]+)'` (`:529`) and then adds two names
  by hand (`:531-532`).

  Measured: the regex extracts **47** names; a clean run emits **42** families. The five extra are the
  `--render` families, which the guard exempts by name (`:519-525`). The one family the regex misses
  is **`palette-source-dark`**, hand-added at `:532`; it is registered through the theme table
  instead of a literal — `check: 'palette-source-dark'` (`check-corpus.cjs:236`) is used as
  `record(theme.check, …)` and `tally(theme.check, …)` (`check-corpus.cjs:251-414`). The other
  hand-add, `:531`, is already redundant: the regex finds `palette-source` on its own, at
  `check-corpus.cjs:217`.

  Why it matters: the guard's whole job is to fail when a family has no case. Anything registered
  through a variable is invisible to it, so the guard passes silently rather than complaining, and
  the hand-add cannot track a rename: change `palette-source-dark` to another name in the theme table
  and both set comparisons (`:544`, `:551`) still agree, because the stale literal sits on both sides,
  while the renamed family loses its only case with nothing to say so. A third theme
  (`check: 'palette-source-…'`) would land the same way. Change: derive the list from the checker
  rather than from its source text — expose the family names (`--families`, or an exported table) and
  keep `NEEDS_A_BROWSER` as the only hand-kept list, since a browser genuinely cannot be assumed.
  Parsing the run's own `+ <family>: <n> assertion(s)` lines is the cheaper variant, with the caveat
  that `design-md` only prints when a themed delivery is present.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `scripts/tests/corpus-mutations.test.cjs:3` vs the 6,093 assertions `check-corpus.cjs` makes over 42 families | F011 — the proof artifact's claim is stronger than its cases; F001 and F002 remain open |
| checklist_evidence | fail | hard | The review target still holds no `checklist.md` | Carried from iteration 2 (F010); not re-derived |
| feature_catalog_code | partial | overlay | 29 catalog rows ↔ 29 forms under `assets/templates/` ↔ 29 PNGs under `screenshots/templates/`, all resolving by name in both directions | `family` cell ungated — F002, carried |
| playbook_capability | pass | overlay | 9 scenario documents present; `corpus-integrity/colour-comes-from-one-source.md:51-59` routes a mutation the suite already encodes | Not re-examined beyond the screenshot question |

## Assessment

- New findings ratio: 0.23
- Dimensions addressed: coverage, test quality
- Novelty justification: 3 findings on a surface neither earlier iteration opened as a subject. The
  previous iterations judged the code and the documents against each other; this one judged the
  proof suite against the code it is supposed to prove, and found that the suite's strongest claim
  (every assertion can fail) is family-level in fact, that seven of its expectations are structurally
  incapable of failing, and that the guard meant to close the coverage hole is text-matched and
  already needs a hand-written exception. The demonstrations are commands I ran, not readings:
  a themed delivery mutated two ways to show `design-md` rules with no case, seven mutations run to
  read what each actually fires, and 32 screenshots re-rendered and compared byte for byte.

## Ruled Out

- **The committed screenshots are stale.** 29 template PNGs and 3 palette-sheet PNGs were re-rendered
  into `/tmp` with the packet's own renderer (`node ../shared/scripts/render-screenshots.cjs
  ./assets/templates /tmp/shot-sample` → `rendered 29, failed 0`) and compared by sha256: **32 of 32
  identical**. The templates' last commit (`21413a7f25`, 2026-09-10 12:17) removed only the invisible
  frame-height poster per form, which is consistent with a byte-identical re-render. Ruled out; the
  set is current today.
- **The screenshot check cannot detect a stale picture.** It cannot — `--check` is existence-only by
  its own comment (`../shared/scripts/render-screenshots.cjs:184-186`, *"A stale picture still opens;
  a missing one is what a reader notices"*), and a negative control proved it: a template paired with
  a different form's PNG returned `sources 1, missing 0 / RESULT: PASSED`, exit 0. Recorded here
  rather than as a finding, because nothing in the packet consumes the PNGs programmatically and
  `README.md:133` already tells a maintainer to regenerate after a template change.
- **A family with no case at all.** None: the guard requires a case for all 43 non-browser families
  and all 43 have one, with the five `--render` families named and reasoned at `:519-525`. The
  exemption list cannot rot unnoticed either (`:556-561`).
- **The mutation cases pass for a wrong reason.** None found, and two families were checked beyond
  their names: the loose `/details/` expectation at `:370` matches the correct message (*no `<details
  class="data">` disclosure wraps the data-chart-table*), and the `table-disclosure` pair fires two
  distinct messages for two distinct breaks. F012 is about the cases where nothing *would* notice a
  change, not about a live false pass.
- **`assert.ok(parsed.radius.every(…))` (`apply-design-md.test.cjs:49`) is vacuous.** It would be on an
  empty ladder, and `.every` on `[]` is `true`. Measured: all four bundled fixtures return five rungs
  (`mark 2px`, `track/swatch/pill 4px`, `card 8px`; supabase `mark 0px`), so the assertion has real
  content today. Noted, not reported.
- **`--render` has no automated coverage.** True, and deliberately documented: the workflow says the
  render gate is not in CI because it drives an installed browser, and the one browser case skips
  loudly (`chart-corpus.yml`, the comment above `jobs:`; `apply-design-md.test.cjs:163-167`). A
  documented manual gate, not a defect.

## Dead Ends

- **Whether the guard's text match could miss a *literal*-registered family.** It cannot: every
  `tally`/`record` call whose first argument is a string literal is matched, and the only
  non-literal registrations in the packet are the two theme-table ones. The hole in F013 is narrow
  and real rather than broad and hypothetical, which is why it stays at P2.
- **Whether the seven wildcard cases were once written with real expectations and lost them.** The
  file's history is one commit in the packet's changelog set (`v0.23.0.0`); the earlier state is not
  reconstructable from the packet, so F012 is stated as the mechanism rather than as a regression.
- **Whether the 6,091 assertions in `21413a7f25`'s message and the 6,093 observed here disagree.**
  They do, by two, and the run prints 6,093; a commit message is a record of its moment, so this is
  arithmetic about a moving corpus rather than a defect.

## Recommended Next Focus

The cap is reached; iteration 4 should synthesize. The three P1s from the earlier iterations
(F001, F005, F006) and F011 stand, with F011 the only one that changes what a maintainer would do
next: it says the suite cannot be used as the control for the fixes the other findings ask for.
Remediation order: F003 (the only write path), then the four P1s, then the inventory and statement
advisories (F002, F004, F007, F009, F010, F012, F013).

Review verdict: CONDITIONAL
