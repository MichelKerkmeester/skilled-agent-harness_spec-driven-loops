---
title: "Implementation Summary: The composed form and the packet closeout"
description: "A twenty-first form whose second scale is a condition rather than a setting, eight assertions each watched failing on a mutated copy, six delivery headlines read and none changed, and a version story that turned out not to be the one the phase was planning to write."
trigger_phrases:
  - "composed form summary"
  - "chart checker extension results"
  - "chart packet closeout results"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/053-chart-visual-overhaul/007-composed-form-and-closeout"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Shipped the composed form, the eight assertions and the packet closeout"
    next_safe_action: "Reconcile the parent packet, which this phase does not own"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/assets/templates/bar-line-composed.html"
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
      - ".opencode/skills/sk-doc/sk-create-chart/changelog/v1.2.0.0.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-007-composed-form-and-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The composed row joins relationship, on the family prose"
      - "Two of the eight planned invariants were already asserted, and two others took their place"
      - "The packet keeps per-document versions, so one string everywhere was never the target"
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
| **Packet** | sk-doc/053-chart-visual-overhaul/007-composed-form-and-closeout |
| **Status** | Complete |
| **Delivery** | One new chart form, eight new assertions, nine documents and one new changelog entry. The corpus check passes from the final state with `--render` at 28 checks, 30 files and 21 forms |
| **Gate** | `scratch/final-render-rerun.txt`. The run before it flaked on one browser open and is kept beside it |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The catalog gained the form it had a written gap for. `bar-line-composed` puts a count and a rate
over the same periods, columns against a left ladder and a line against a right one, and the second
ladder appears only when the two measures are an order of magnitude apart. That condition is
computed from the data block rather than chosen by whoever authored the file, which is the whole
reason the form is safe to ship: a dual axis is the easiest way to lie with a chart, and an author
who can place the second scale can place the crossing.

The corpus check grew by eight named checks and now runs twenty-five, or twenty-eight when it
opens a browser. Three earlier phases had introduced rules and left the enforcing to this one,
which is a reasonable trade only if the enforcing is real, so every one of the eight was broken
deliberately on a copy and watched failing before it was believed. Fourteen mutations, fourteen red runs, fourteen restores, and the recipes
are written into `scripts/README.md` so the next reader can repeat them rather than take this
document's word.

The packet took its version bump and a changelog entry covering all seven phases. The six family
deliveries were read against the headline rule and none of them needed a word changed.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The baseline came first and passed on the first run: 20 checks, 29 files, 20 forms, zero errors.
Then a working-tree copy of `assets/` and `references/`, because every negative control here
restores from that copy. A checkout restores the last commit rather than the state under test,
which on an uncommitted tree throws the work away and leaves the next run failing for a reason
unrelated to the mutation.

### The invariant inventory, which shortened the list before it lengthened it

The plan named eight invariants and the check was read against all eight before any of them was
coded. Two were already enforced by the phase that introduced them. `palette-block` already counts
the palette regions per theme and matches each against its own projection of the source in both
directions. `palette-source-dark` already runs every gate against the dark surface and reported
thirty-four assertions on the baseline, so it is neither missing nor vacuous. Writing a second
assertion for either would have been a second name for the same run.

A third row needed narrowing. "An interactive file paints identically without pointer input" is
what `settled-render` has compared since phase 003, on the document and on the painted picture.
What no render comparison can see is the state a file ships in, and that is the half worth
checking: a drawing that opens already dimmed paints the same picture on both of its pointer-free
opens and agrees with itself exactly as a correct file does.

So the eight that were written are not quite the eight that were planned, and the two substitutes
come from the same three phases. The full mapping is in the decision record.

### The eight assertions, each watched failing

Every mutation was applied to a passing corpus, run, read out of a file rather than through a pipe,
and restored from the copy. The check named the right rule and the right file every time.

| Check | The mutation | What the run said |
|---|---|---|
| `interaction-hygiene` | The hygiene line deleted from `grouped-bars` | Named the file, listed the registers it declares and said the stylesheet carries no `:focus:not(:focus-visible)` rule |
| `interaction-hygiene` | `scatter` given a bare `:focus { outline: none }` and a `user-select: none` | Three failures, one per branch, each naming the selector and the reader it protects |
| `interaction-state` | `stacked-bars` shipped with `data-chart-dim="1"` | Named the value and said the attribute is empty until a reader asks |
| `number-format` | `heat-matrix`'s formatter given a `toLocaleString()` call | Named the call and what a host locale decides |
| `number-format` | `fmt` renamed in `treemap`, which carries a hover card | Said the file prints figures with nothing formatting them |
| `empty-notice` | The guard block removed from `bar-rows` | Reported zero sentinels where one pair is required |
| `empty-notice` | The `break figure;` removed and the sentinels left in place | Said the guard cannot stop the drawing, which is the more interesting half: every sentinel is still there |
| `geometry-block` | `waterfall`'s shared record changed from 720 units to 760 | Named both files and said the corpus no longer agrees about a number it claims to hold in common |
| `catalog-system` | The `scatter` row's system cell changed to `categorical` | Named both sides and said which one decides |
| `type-scale` | `candlestick`'s tick raised from 11px to 16px | Listed the nine published rungs and said a size off the scale is one chosen out of the air |
| `gradient-sweep` | `daily-line`'s area fade given a second series value on one stop | Named both series values, the declared system, and the fade case it leaves alone |

Four of those were then re-run verbatim as the `scripts/README.md` recipes write them, against
`grouped-bars`, because a documented recipe naming a file nobody mutated is a recipe nobody has
tested. All four fired on that file and it restored byte-identical to both copies.

After every restore the corpus check printed `RESULT: PASSED` again, and a recursive diff against
the kept copy reports one difference across the whole of `assets/`, setting aside the file this
phase created: the `typeScale` object added to the palette source on purpose. That comparison is
written into `scratch/negative-controls.txt`, and the copy itself was then removed, because a
duplicate of the corpus sitting in a spec folder goes stale the moment the corpus moves.

### The composed form, and the two things the render caught

The form was authored through the documented workflow, from the skeleton, and it inherits
everything the corpus had grown by the time it arrived rather than being retrofitted with any of
it: the chrome, the corner ladder, both palette blocks, the shared geometry record, the empty-data
guard, the key inside the figure, the dim, the hygiene line and the reveal wipe.

Two decisions were made against a rendered picture rather than in prose.

The motion is the reveal wipe rather than the bar growth, and the reason is that the form draws two
mark types on one plot. A per-column growth would leave the line hanging above columns that have
not arrived, which reads as two charts drawn at different speeds. The wipe brings both marks in
together in the order the periods run.

The first draft printed the series names beside each ladder, and the render showed "Conversion
rate" running off the right edge of the frame and reaching a reader cut in half. The names now
carry the unit rather than the series, in the colour of the marks measured against them, and both
are anchored to the frame edges so a longer unit grows inward. That also removed a duplication:
the key was already printing those two words twenty units above.

### The fixture that found a defect

Four fixtures, one per boundary the spec names, each rendered and read.

A period with no rate breaks the line and prints how many readings were left out, and the notice
landed below the bottom edge of the drawing where a reader saw the top half of one sentence. The
frame now grows for the notice, which is what `scatter` and `heat-matrix` already do for their
ceiling notices, and for the same two reasons: a line printed inside the plot lands on a mark, and
a frame sized for a notice that is usually absent carries a permanent empty strip under every chart
with nothing to report.

The other three behaved. Two measures within an order of each other draw one ladder with no right
axis and an axis name reading "orders and percent". A period with no orders draws no column while
the line still crosses the slot. A rate above one hundred raises the right ceiling to 160 rather
than clipping at 100, because a rate over one hundred is a real reading in some domains and
silently clamping it is a lie.

### The version story, which was not the one the phase set out to write

D7 asked for one version string everywhere and phase 006 recorded a supporting finding, that
`references/README.md` at 1.0.0.0 was stale against a packet reading 1.1.0.0. The inventory does not
support either.

The packet keeps per-document versions. The four documents the previous release edited sit above
the packet version by however many times each has been edited since, and every document nothing has
touched since the first release still reads 1.0.0.0. `references/README.md` was not stale, it was
correct.

That inventory was right about the convention and wrong about one file. It was taken by reading
versions rather than by reading each phase against the files it touched, so a document that changed
without moving its version could not show up in it. One did.
`manual-testing-playbook/corpus-integrity/colour-comes-from-one-source.md` was rewritten in three
places by phase 005 and left at 1.0.0.0, and this phase counted it among the untouched. And the changelog files settle it beyond argument, because a changelog entry's version
names the release it describes: making `changelog/v1.0.0.0.md` read 1.2.0.0 to satisfy a grep would
put a false claim into a historical record.

So the criterion was replaced by a stricter one rather than softened, and the decision record
carries the reasoning. Every document this overhaul changed carries a version that moved, no
document it did not change carries a version that moved, and the packet version in `SKILL.md` and
`README.md` matches the name of the newest changelog file. Uniformity would have passed a packet
that bumped files it never opened and failed one that is telling the truth.

The stricter obligation is also what caught the miss. A criterion asking for one string everywhere
would have been satisfied by this file at any value. Asking instead that a changed document move its
version is what makes an unmoved one a failure, and the playbook scenario is now at 1.2.0.0, two
steps for the two rounds that edited it. ADR-005 carries the arithmetic and the reason the earlier
cross-reference repair does not count as a third.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:scenario-audit -->
## The Scenario Audit

Six deliveries, one per family, read one at a time against the rule the contract states: a headline
is a conclusion rather than a chart type, and a reader who takes nothing but the top line should
still have learned something. The verdict is the deliverable here. All six already carried scenario
filenames and conclusion-shaped headlines, and the honest outcome was an audit rather than a
rewrite in search of one.

| Delivery | Family | Headline | Verdict |
|---|---|---|---|
| `calls-by-day-and-hour` | matrix | "The quietest weekday mid-morning still carries three times the busiest weekend hour" | Passes. It compares the weakest case on one side against the strongest on the other and names the multiple, which is an argument for how the rota is shaped rather than a description of a grid |
| `orders-after-the-price-change` | time | "Orders fell the day the new price landed and settled almost a quarter lower" | Passes. A cause, a timing and a magnitude, and the filename names the event rather than the chart. A reader who stops here knows what happened and roughly how much of it |
| `pick-times-by-depot` | distribution | "Eastfield matches Riverside on the median and spreads almost twice as wide" | Passes, and it is the strongest of the six. It states the finding a median alone would have hidden, which is the reason the form exists |
| `staff-hours-by-service` | comparison | "Home visits and the day centre take more staff time than everything else together" | Passes. "More than everything else together" is a claim with a threshold in it, and a reader can check it against the bars |
| `van-age-against-repair-cost` | relationship | "Repair spend climbs steadily with age, and one three-year-old van costs more than the oldest" | Passes. A trend and the exception to it in one line, which is what a scatter with an emphasised point is for |
| `where-the-budget-went` | composition | "More than half the grant went straight to frontline staff" | Passes. A share against a threshold a reader cares about. "Where the budget went" would have been the label version, and it is the filename rather than the headline |

Nothing was changed. Every filename names a situation rather than a form, which is the second half
of what the recommendation asked for, and no delivery carries a title in the "measure by dimension"
shape the rule is written against.
<!-- /ANCHOR:scenario-audit -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

Seven, each written in full in the decision record. The composed row joins `relationship` on the
family's own prose rather than on its axis, and the catalog gained a reader-facing name row so the
form is findable under the three words a reader actually uses. The second scale is a condition with
its arithmetic beside it. Two of the eight planned invariants were already asserted and two others
from the same phases took their place. The type scale moved into the palette source rather than
being restated inside the check, which is a named deviation from a frozen file list. The version
premise was wrong and its criterion was replaced by a stricter one. The range window is refused on
two grounds, and the contract clause is the one that survives a raised ceiling. And the two ramp
gate keys stay unrenamed, now on scope rather than on reach.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

The corpus check passes from the final state with `--render`, read from a file rather than through
a pipe. Twenty-eight named checks, thirty files, twenty-one chart forms, zero errors, exit 0. The
baseline was twenty checks over twenty-nine files, so the eight this phase added are visible in the
difference rather than asserted in prose.

The final gate took two runs and both are kept. The first reported one `render` failure on
`waterfall.html`, where the browser process died and returned no document at all. That is the same
file and the same symptom the previous phase recorded on its own baseline, and the corpus's own
playbook writes down how to tell the two apart: a different file each run that opens by hand is the
browser, and the same file every run is a chart drawing nothing. `waterfall.html` was opened by hand
under the same flags and returned a document with forty-eight elements inside its figure region, and
the re-run passed clean over all thirty files. The failing run is kept beside the passing one rather
than deleted, because a run that flakes once is worth recording rather than quietly re-running until
it agrees.

| Claim | Evidence |
|---|---|
| The corpus holds twenty-one forms | `chart forms under assets/templates: 21` in the final run, with `catalog` and `catalog-system` both at zero failures |
| The new form satisfies every contract rule | No rule reports a failure against `bar-line-composed.html` in a run that includes the eight rules written in this phase |
| Every new assertion can fail | Fourteen mutations, each watched failing with the check and file named, each restored from a copy. `scratch/negative-controls.txt` |
| Every mutation is reverted | `diff -r` against the kept copy reports one difference across `assets/` and `references/`, which is the `typeScale` object added on purpose |
| The second scale appears at a spread of an order | The shipped block divides 2,040 by 4.0 and draws a right ladder. `scratch/fixtures/shipped-light.png` |
| One ladder below that spread | A fixture at a spread of 6.4 draws no right axis and names both units on the left. `scratch/fixtures/within-an-order.png` |
| A zero period keeps its slot and the line crosses it | `scratch/fixtures/zero-period-and-a-gap.png` |
| A rate above one hundred raises the ceiling | The right ladder runs to 160 rather than clipping. `scratch/fixtures/rate-above-one-hundred.png` |
| The empty guard fires on the new form | `scratch/fixtures/nothing-readable.png` |
| The dark block reaches the paint | `dark-render` passes over thirty files, and the new form was read by eye on both grounds. `scratch/fixtures/shipped-dark.png` |
| Every authored document is in voice | `hvr_scan.py` reports zero hard blockers on all nine edited package documents and on every document in this folder |

### What the counts say about the run

`type-scale` reports 296 assertions, which is one per size any file sets and is the count that
makes it a real check rather than a name. `geometry-block` reports 24, being the twenty-one forms
plus the three proof sheets, and it is an exact set derived from two directories rather than a
floor: a corpus where the block had been scattered over some of the files would fail rather than
pass a count of them. `catalog-system` reports 22, one per row plus the assertion that the column
exists at all. `gradient-sweep` reports 33, being one per file plus one per gradient found, so a
corpus that lost its gradients would show it in the count rather than in a silent pass.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

The two ramp gate keys still read wrong on a dark ground. The blocker phase 006 recorded is gone,
because this phase edits the check, and the rename is still undone on scope rather than on reach.
It is in the changelog with both target names and all three files.

The six family deliveries carry no `GEOMETRY DEFAULTS` block, and `geometry-block` therefore
asserts over the twenty-one forms and the three proof sheets rather than over every asset file.
The deliveries do share the geometry, since all six carry the same 480px pan floor, so this is a
record that was scoped to forms and sheets rather than a corpus that disagrees. Widening the block
to the deliveries is a six-file edit nothing in this phase's scope covers.

Section 10 of the contract is now part register and part rule, and the document says which is
which. What a handler may do, where a card flips, whether a figure inside a card also appears in
the table and whether a selection latches are all still read by a person.

`type-scale` reads a size and not its role. A file that set its axis tick at 21px would pass,
because 21 is a published rung. The check stops a size invented out of the air, which is the
failure the scale was published against, and it does not stop a rung used in the wrong place.

Nothing here is committed. The evidence in this document is pinned to the working tree.
<!-- /ANCHOR:limitations -->
