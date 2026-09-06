---
title: "Implementation Summary: The catalog and contract corrections"
description: "Twenty rows were read against the colour document and none moved, twenty forms learned to say when they have nothing to draw, and the one picture that changed is the form whose declared system was not doing anything."
trigger_phrases:
  - "chart catalog summary"
  - "empty data notice results"
  - "chart type scale results"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/009-chart-visual-overhaul/006-catalog-and-contract"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Wrote the record of what the catalog and contract pass changed and what proved it"
    next_safe_action: "Run phase 007, the composed form and closeout"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/references/catalog.md"
      - ".opencode/skills/sk-doc/sk-create-chart/references/color-system.md"
      - ".opencode/skills/sk-doc/sk-create-chart/references/template-contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-006-catalog-and-contract"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "No catalog row changes system"
      - "The sweep is carried by progress-single alone"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Packet** | sk-design/018-sk-design-parent-v2/001-sk-create-chart/009-chart-visual-overhaul/006-catalog-and-contract |
| **Status** | Complete |
| **Delivery** | Twenty-three asset files and three references. The corpus check passes from the final state at 20 checks, 29 files and 0 errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every chart form now says so when the data block holds nothing readable, instead of drawing an
empty frame that a reader cannot tell apart from a chart whose values are all zero. The guard sits
above the drawing code in all twenty forms, with a predicate written for that form's own data
shape, and the drawing runs only when there is something to draw.

The corpus also stopped varying its shared geometry silently. One `GEOMETRY DEFAULTS` block,
byte-identical in all twenty forms and all three proof sheets, records the five measurements every
file already shares and says which numbers are per-form and why.

Three documents caught up with the corpus. The contract publishes the type scale as six named
roles with three named departures. The catalog names the three forms the reference has and this
corpus does not, each with the reason it is absent. And the colour document gained a procedure for
settling a catalog row against its own definitions, plus the sweep rule the operator approved.

One picture changed. `progress-single` sits on the `ordered` system, whose entire content is that
colour encodes magnitude, and its fill was a fixed value that did not move. It now sweeps along
the ramp with the value.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The baseline came first and took two runs. The first printed `RESULT: FAILED` on a single
`dark-render` assertion where the browser process died on `waterfall.html` and returned no
document at all. The second, from the same untouched tree, printed `RESULT: PASSED` at 20 checks,
29 files and 0 errors. That is the baseline, and a run that flakes once is worth recording rather
than quietly re-running until it agrees.

Then a working-tree copy of `assets/` and `references/`, because every negative control in this
phase restores from that copy. A checkout would restore the last commit rather than the state
under test.

### The twenty-row re-check, which found nothing to change

The phase was built around a research finding that `grouped-bars` sits on the wrong colour system,
and the spec wrote that outcome into a success criterion before anyone checked it. The reading
does not support it.

The case for moving the row is real. Two named series across categories is the shape
`stacked-bars` and `stacked-area` carry, both of which are `categorical`, and since phase 004 the
form prints a key, which is usually the sign that colour has become the link between a mark and a
name. It is the only key-bearing form on `neutral`.

Three things answer it. The two series are ordered in time, and `categorical` is defined for
categories that are unordered. `neutral` has a capacity of four series, so drawing two of them and
ranking them by lightness is the system working rather than a workaround. And `neutral` is the
documented default that wins a tie, which is a rule about who wins rather than a preference about
which looks better. The file agrees with all three: its classes are `past` and `current`, and the
array assigning them is called `RANK`.

What the reading did find is a different defect. `progress-single` declared `ordered` and painted
a fixed `series-2`, so the row was correct and hollow. The operator's sweep is what makes the
declaration true, which is a better outcome than the reassignment the phase went looking for.

All twenty verdicts are in the decision record, including the seventeen that were never in doubt,
because the reason the wrong claim survived this long is that nobody had read both documents
against each other.

### The empty-data notice, and the two things that nearly made it a lie

The guard is one predicate per form and a labelled block that stops the drawing. Every form was
rendered twice, once with an empty fixture written for its own data shape and once with its
shipped block.

The first proof run reported the notice present on all twenty shipped files, which would have been
a catastrophic result if it had been true. It was the proof script: a `--dump-dom` run echoes the
inline script back, and the notice text is a string literal inside it, so a search over the
document finds the notice in every file including the ones that never drew it. Scoped to the
rendered figure region, the answer is absent on all twenty.

The second failure was real. A fixture of two rows whose values are `null` and `NaN` did not fire
the notice, because the predicate coerced with `Number()` before testing finiteness and
`Number(null)` is zero. The corpus already had the right test, in the three time forms that break
a line at a gap, and the guard now uses it. That is exactly the failure the plan predicted, which
is a guard written against the wrong emptiness, and it took a fixture to find.

### The sweep

The operator answered the multi-hue question yes with a scope: permitted where the system already
encodes magnitude, forbidden on every `neutral` or `categorical` series. That permits it on
`calendar-grid`, `heat-matrix` and `progress-single`.

Two of the three have nothing to sweep. A calendar cell and a matrix cell each hold one reading,
so a gradient across one of them would paint variation inside a single value, which is the
dishonesty the clause exists to prevent. One form draws a mark whose length is the magnitude, and
that form carries it.

The ramp is anchored to the whole track rather than to the fill. Anchored to the fill, the deep
end lands at the bar's tip at every value and the colour says "the end of the bar". Anchored to
the track, the shade at the tip says how far along the goal the bar has reached. It runs from the
fourth ramp step to the first and leaves the fifth out, because the fifth reads 2.15:1 against the
track and a bar starting there appears to start after its own zero.

A gradient reference is not a colour and cannot be typed into a `fill`. The check blanks a `url()`
before it reads the declaration and then sees a fill with nothing to resolve, so the reference
reaches the mark through a custom property the way every other value in a template does.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

Six, each written in full in the decision record. No catalog row changes system, and the row the
research named keeps `neutral` on the colour document's own decision procedure. The sweep is
permitted on three forms and carried by one. The geometry block goes in every file while the
contract restates none of its numbers, because a written record in twenty-three places with one
check over it is the pattern the palette block already runs on. The two badly named ramp gate keys
are not renamed here, because the third file they reach is the one file this phase may not touch.
The contract's inherited voice blocker is fixed. And two criteria that presumed the reassignment
are replaced, one corrected to the question it presumed and one superseded by an obligation
covering twenty forms rather than one.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

The corpus check passes from the final state with `--render` at 20 checks, 29 files and zero
errors, read from a file rather than through a pipe. Two counts moved against the baseline and
both are accounted for: `colour-literals` from 906 assertions to 912, which is the six new
declarations in `progress-single`, and `unique-ids` from 140 to 141, which is the gradient's id.
`catalog` is unchanged at 41 assertions and 0 failures, because no row moved.

### What was proved, and how

| Claim | Evidence |
|---|---|
| The notice fires when there is nothing to draw | Twenty of twenty, each on a fixture written for its own data shape, read out of the rendered figure region |
| The notice stays silent on shipped data | Twenty of twenty absent, after the proof script was scoped to the figure region |
| Length alone is not readability | `bar-rows` given `null` and `NaN` fires. This fixture failed first and found a real defect |
| One row is not empty | `bar-rows` given a single row does not fire |
| Nothing else was redrawn | Nineteen of twenty forms render byte-identical to their pre-phase picture under a pinned light scheme. The twentieth is the sweep |
| The sweep rule can fail | Watched failing on a copy where `daily-line`'s fade was given a second series value, then run clean over the corpus |
| The geometry block is one block | Byte-identical across all 23 files, and the set is exactly the 20 forms plus the 3 proof sheets rather than at least 23 files |
| The published type scale is the corpus's | Nine distinct sizes before and after. Six roles and three named departures, with only the 12px count moving, by the fifteen files that gained a `.notice` rule |

### The negative control the phase relied on

The sweep predicate is a check written in the same phase that leans on it, so it was watched
failing before it was believed. `daily-line`'s area fade names one series value at two opacities,
which the rule calls a fade and leaves alone. On a copy, its second stop was given a different
series value, which turns the fade into a sweep on a `neutral` file. The check printed one failure
naming the file, the declared system and both values, and exited 1. The copy was discarded and the
real corpus printed `RESULT: PASSED`.

### What was read rather than computed

`progress-single` was opened in both themes and read by eye. On paper the fill starts at the
fourth ramp step and deepens to the first at the bar's tip. On ink the same relationship holds
with the ladder mirrored, so the tip is the brightest value in both themes, which is what keeps
"further from the ground carries most" true on both grounds.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

Three of the five things this phase added are stated and not yet asserted, and every one of the
three documents says so where it states them. The empty-data guard, the geometry block and the
sweep rule are all invariants the corpus check does not know about. The next phase owns them,
which is why the check was not edited here, and until that lands a file could break any of the
three and still pass.

The requirement that every template read its margins from the shared block is unbuildable as
written, and the record says why rather than claiming it. Neither place these numbers are used can
read a custom property, and making the pan floor resolve through a variable would fail the very
rule it satisfies.

The two ramp gate keys still carry names written for one ground. The rename now has its target
names and its file list written down, and it stays undone because one of those three files belongs
to the next phase.

The spec's changelog line points at a folder that does not exist under the parent packet and that
no sibling phase created. Nothing was refreshed there.

Nothing here is committed. The evidence in this document is pinned to the working tree.
<!-- /ANCHOR:limitations -->
