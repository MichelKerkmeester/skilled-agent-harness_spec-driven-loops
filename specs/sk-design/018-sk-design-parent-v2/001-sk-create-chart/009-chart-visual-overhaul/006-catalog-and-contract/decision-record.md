---
title: "Decision Record: The catalog and contract corrections"
description: "The twenty-row system re-check written out row by row, the scope the gradient clause was applied under, and the five calls this phase had to make on its own."
trigger_phrases:
  - "chart catalog decisions"
  - "twenty row system re-check"
  - "chart gradient clause scope"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/009-chart-visual-overhaul/006-catalog-and-contract"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Recorded the twenty-row re-check and the six calls the phase made"
    next_safe_action: "Read acceptance-criteria.md, which cites this record"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/references/catalog.md"
      - ".opencode/skills/sk-doc/sk-create-chart/references/color-system.md"
      - ".opencode/skills/sk-doc/sk-create-chart/assets/templates/progress-single.html"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-006-catalog-and-contract"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "No catalog row changes system, and the reading that settles each one is written down"
      - "The shared geometry block lives in every file and the contract points at it"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: The catalog and contract corrections

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

One of these was the operator's and the phase would not have applied it without an answer. The
other five were the phase's own, and two of them overturn something an earlier document treated
as settled.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The twenty-row system re-check finds no row to change

**Status:** Accepted
**Date:** 2026-09-03

### The question

The research read the catalog's system column against the colour document's definitions and
reported one mismatch. The phase's own first decision says copying that finding is not the audit,
so all twenty rows were read against the definitions and every reading is written below,
including the seventeen that were never in doubt.

### The procedure the reading used

The colour document defines the three systems by what colour encodes, and its `encodes` keys in
the palette source say it in one word each: `importance` for `neutral`, `magnitude` for `ordered`,
`category` for `categorical`. So the question per row is not what the chart is about. It is what
the colour in that file varies with, and whether the data has the property the declared system
encodes. The procedure is now written into the colour document itself, because a reading nobody
can repeat is not an audit either.

### The twenty rows

| Row | Declared | What colour does in the file | Verdict |
| --- | --- | --- | --- |
| bar-rows | neutral | Every bar takes series-1. One bar takes emphasis, which is the headline's subject | Correct. Colour varies with nothing |
| bar-columns | neutral | Same shape as bar-rows, with the names as codes | Correct. Colour varies with nothing |
| grouped-bars | neutral | The current period takes series-1 and the prior takes series-3, so lightness ranks the two | Correct, and argued at length below |
| unit-grid | categorical | Four parts of a hundred, one hue each, unordered | Correct |
| unit-ring | categorical | Four incident groups, one hue each, unordered | Correct |
| stacked-bars | categorical | Three segments of a whole, one hue each, unordered | Correct |
| independent-percentages | neutral | Every bar takes series-1, one takes emphasis | Correct. Colour varies with nothing |
| treemap | categorical | Four top-level branches, one hue each, unordered | Correct |
| daily-line | neutral | One line in series-1, one emphasis mark on the day the headline is about | Correct. Colour varies with nothing |
| daily-range | neutral | Every range bar takes series-1, the widest day takes emphasis | Correct. Colour varies with nothing |
| calendar-grid | ordered | Each day's cell takes the ramp step its quantity falls in | Correct. Colour varies with magnitude |
| waterfall | categorical | Rises, falls and totals take three hues. The colour document already blesses this reading in its own section on the diverging system it refused | Correct |
| progress-single | ordered | Before this phase the fill was a fixed series-2, so nothing varied. The sweep applied here runs the fill along the ramp with the value | Correct, and it is now true rather than merely declared |
| candlestick | categorical | Up periods and down periods take two hues. Two kinds of event rather than two points on a scale | Correct |
| stacked-area | categorical | Four revenue lines, one hue each, unordered | Correct |
| distribution-strip | neutral | Every dot in all three groups takes series-1, and the groups are separated by position. The median rule takes emphasis | Correct. Colour varies with nothing |
| box-plot | neutral | The box takes series-2 and its whisker series-1, which separates two parts of one mark rather than two series | Correct. Colour varies with nothing in the data |
| scatter | neutral | Every point takes series-1, one takes emphasis | Correct. Colour varies with nothing |
| parallel-axes | categorical | Four suppliers, one hue each, unordered | Correct |
| heat-matrix | ordered | Each cell takes the ramp step its value falls in | Correct. Colour varies with magnitude |

**Rows changed: none. Paired edits made: none.**

### Why grouped-bars keeps neutral

This is the row the research named, and it is the only one where the reading took real work. The
case for moving it is strong enough to write out rather than wave at. Two named series drawn
across categories is the same data shape `stacked-bars` and `stacked-area` carry, both of which
sit on `categorical`. Since phase 004 the form also prints a key, and a key is usually the sign
that colour has become the link between a mark and a name. It is the only key-bearing form in the
corpus on `neutral`, and that asymmetry is what the research saw.

Three things answer it, and the third is decisive.

Its two series are ordered. `categorical` is defined for categories that are unordered, and last
year against this year is a time order. `stacked-bars` carries platform, services and support,
which have no order at all. The data shape matches and the property does not, and the property is
what the definition turns on.

`neutral` has a capacity of four series for a reason. A system that could not draw more than one
series would not need four slots, so drawing two series on `neutral` is the system working rather
than a workaround, and a key printed beside them makes the lightness ranking legible instead of
turning it into membership. The file says as much in its own vocabulary: the classes are `past`
and `current`, and the array that assigns them is called `RANK`.

And `neutral` is the documented default and fallback. The colour document says to start there and
leave only when the data plainly has the property another system encodes. On a tie the default
holds, which is a rule about who wins rather than a preference about which looks better.

The research's own recommendation flagged this collision before anyone acted on it, calling itself
contract-level and naming the neutral-first stance as a documented product decision it would
overturn. It also cited a charting library that gives two series two hues by default, which is a
library default rather than an argument about this corpus.

What moving the row would have cost is concrete. On `categorical` the two years become two hues
and a reader has to consult the key to learn which is which. On `neutral` this year is the darkest
value and last year is lighter, which states the order without a key and leaves the gap inside
each pair as the thing the eye lands on. The chart is better where it is, and the definition
agrees with the chart.

### What the re-check did find

One row was declared correctly and behaving as though it were not. `progress-single` sits on
`ordered`, whose whole content is that colour encodes magnitude, and its fill was a fixed
series-2 that did not move with the value. The row was defensible and hollow. The sweep in
ADR-002 is what makes the declaration true, which is a better outcome than the reassignment the
phase went looking for.

### What this costs

The phase's headline correction did not happen, so the spec's SC-001 asserted an outcome the
audit does not support. ADR-006 records what replaced it. Against that, the corpus now carries a
written reading of every row and a procedure for settling the next one, which is what the
criterion asked for and what a single two-character edit would not have produced.
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: The sweep is permitted on three forms and carried by one

**Status:** Accepted, by the operator on 2026-09-03
**Date:** 2026-09-03

### The question

The adjudication left the multi-hue series to the operator, and every task that would apply it was
blocked on the answer. The clause as drafted read: a single series may carry a gradient along its
own system ramp only when the system encodes magnitude.

### Decision

The operator answered yes on 2026-09-03, scoped to systems that already encode magnitude. That
permits it on `calendar-grid`, `heat-matrix` and `progress-single`, and forbids it on every
`neutral` or `categorical` series.

Permission is not obligation, and two of the three permitted forms have nothing to sweep. A
calendar cell and a matrix cell each hold one reading, so a gradient across one of them would
paint a variation inside a single value, which is the dishonesty the clause exists to prevent
rather than an instance of what it allows. Their keys are stepped because their scales are
stepped, and a continuous key over five bands would misstate the scale.

So the clause covers three forms and one form carries it. `progress-single` draws the only mark
in the corpus whose length is the magnitude, which is exactly what a sweep along the ramp can
restate.

### How it was built

The ramp is anchored to the whole track rather than to the fill, using the same `LEFT` and `RIGHT`
constants the track is drawn from. That distinction is the difference between a sweep that means
something and one that does not. Anchored to the fill, the deep end lands at the bar's tip at
every value, so the colour says "the end of the bar". Anchored to the track, the shade at the tip
says how far along the goal the bar has reached.

It runs from the fourth step to the first and leaves the fifth out. The fifth reads at 1.76:1
against paper and 2.15:1 against the track the fill sits in, so a bar starting there would appear
to start somewhere after its own zero. The fourth step reads 2.70:1 against paper and holds the
start of the bar visible while still leaving four fifths of the ramp to sweep through.

A gradient reference is not a colour and cannot be typed into a `fill`. The check blanks a `url()`
before it reads the declaration and then sees a fill with nothing to resolve, so the reference
reaches the mark through a custom property the way every other value in a template does.

### How it is checked

The rule is written to be mechanical rather than judged. A gradient whose stops name two different
series values is a sweep and may appear only in a file declaring `ordered`. A gradient whose stops
name one series value at two opacities is a fade, which is what the area under the line in
`daily-line` already is, and the rule leaves it alone. The predicate was run over the corpus and
watched failing first, on a copy where `daily-line`'s fade was given a second series value.

The corpus check is not edited here, so the predicate lives in the phase record and the colour
document says plainly that the rule is stated and not yet asserted. Folding it into the check is
the next phase's work.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: The geometry block goes in every file, and the contract points at it

**Status:** Accepted
**Date:** 2026-09-03

### The question

The spec left it open. The skeleton is what an author copies, which argues for the skeleton. The
contract is what an author reads, which argues for both, and the cost of both is two places that
can drift.

### Decision

The numbers go in a `GEOMETRY DEFAULTS` block in all twenty forms and all three proof sheets, and
the contract carries prose that names the block and restates none of its numbers.

Putting the block only in the skeleton would leave twenty files silent about which of their
numbers are corpus-wide, which is the condition this correction exists to end. Copying it into
every file is the pattern the corpus already runs on: the palette block is copied into twenty-nine
files and held together by a check that compares each copy against one source. The block is
byte-identical in all twenty-three, which is what makes that check writable.

The contract restating the numbers is what would create the drift the open question worried about,
so it does not. It says what the block is for and where it lives, and the values appear once.

### What the block cannot be

Not an indirection, and that is forced rather than chosen. Neither place these numbers are used
can read a custom property. A `viewBox` attribute takes a number, and rule 14's floor is read out
of the stylesheet as a literal by the check that enforces it, so a `min-width` resolving through a
variable would fail the rule it was written to satisfy. The requirement that every template read
its margins from the block is therefore unbuildable as written, and a written record that every
file carries is what it becomes.

### What the block deliberately leaves out

The frame height and the four plot insets. Those vary per form and should: a left inset is sized
to the widest label a form actually carries, so `bar-rows` holds 156 units for stage names and
`stacked-area` holds 46 for a numeric axis. Copying one into the other buys uniformity by cutting
a label off.

The five values in the block are already identical in every file, so there is no departure to
comment on. That is a finding rather than a convenience: the corpus was not varying its shared
geometry by hand, it was varying its per-form insets by hand, which is the correct thing to vary.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: The two ramp gate keys are not renamed here

**Status:** Accepted, with the rename handed on rather than dropped
**Date:** 2026-09-03

### The question

The previous phase proposed renaming `rampDarkestOnSurface` and `rampLightestOnSurface`, whose
names read wrong on a dark ground, and left the call to this phase because the colour document is
this phase's file.

### Decision

Not renamed here. The reason has changed from a judgement into a scoping fact.

The keys reach three files: the colour document, the palette source, and the check that reads them
by name at two call sites. The check is the one file this phase is forbidden to touch, because the
next phase owns every assertion these two phases introduce. Renaming the two files this phase can
reach would leave a gate reading a key nobody defines, which fails the corpus on a rename rather
than on a colour, and is a worse state than two badly named keys that work.

`rampFarEndOnSurface` and `rampNearEndOnSurface` are the names it should land under. The colour
document now says so, says why it did not happen here, and says the rename lands across all three
files at once or not at all. That is a handoff rather than a deferral: the next reader has the
names, the file list and the constraint.
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: The contract's inherited voice blocker is fixed

**Status:** Accepted
**Date:** 2026-09-03

### The question

The previous phase left one hard voice blocker in `template-contract.md` because that file belongs
to this phase. It was a semicolon in section 10, in the line about what a hover card may not do.

### Decision

Fixed, by collapsing the two clauses into one rather than by swapping the punctuation for a
comma. The line paired "the card floats above the drawing" with "it does not rearrange it" across
a semicolon, and it now reads "The card floats above the drawing rather than rearranging it",
which says the same thing in one clause and reads better than either of the two-clause versions.

The file now scans at zero hard blockers, and it was the last document in the reference set
carrying one.
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Two criteria that presumed the reassignment are replaced by stricter ones

**Status:** Accepted
**Date:** 2026-09-03

### The question

The spec's SC-001 asserted that `grouped-bars` would read `categorical` after the re-check, and
AC-003 asked for the before and after pictures of the form whose system changed. The audit changed
no row, so one criterion asserts a false outcome and the other names a subject that does not
exist. Neither may simply be softened.

### Decision

SC-001 is corrected to the direction-neutral form its own acceptance criterion already used. The
binding criterion, AC-002, always read "its system matches what the colour document says colour
encodes there", which the audit satisfies. SC-001 was the presumption, and replacing a presumed
answer with the question it presumed is a correction rather than a relaxation.

AC-003 is superseded by a strictly wider obligation. The original asked for two pictures of one
form. The replacement is that every one of the twenty forms is rendered before and after this
phase under a pinned light scheme, and every picture that is not the sweep must match byte for
byte. That covers twenty forms rather than one and proves the thing D3 actually wanted, which is
that a documentation phase did not quietly redraw a chart. It also has a subject: nineteen
identical and one changed, with the changed one captured both ways.

The evidence came back at nineteen identical and one changed, and the one is `progress-single`.
<!-- /ANCHOR:adr-006 -->
