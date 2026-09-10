---
title: "Chart Colour Systems"
description: "Three stock colour systems, one local design-md delivery adapter, the shared role vocabulary, the corner ladder and the contrast gates the corpus check enforces."
trigger_phrases:
  - "chart color system"
  - "chart palette"
  - "which palette for a chart"
  - "chart contrast"
  - "chart color roles"
importance_tier: normal
contextType: reference
version: 1.7.0.0
---

# Chart Colour Systems

Every stock colour in this packet comes from `assets/color/palettes.json`. A template never invents
one, and the corpus check fails a template that carries a colour literal anywhere except a palette
block. A `design-md` delivery is the one request-time exception: its values come from a local v3
`DESIGN.md`, and the checker accepts them only by provenance plus the same inline gates.

Every role holds two values, one per ground. A file paints the light set by default and the dark set when the reader's operating system asks for one, and both sets come from the same file and clear the same gates.

---

## 1. OVERVIEW

Three built-in systems exist. A fourth identifier, `design-md`, is a request-time adapter for a
local v3 Style Reference rather than a fourth semantic encoding. Pick one built-in system per
stock delivery, or use the adapter with its provenance and gates.

---

## 2. THE QUESTION EACH SYSTEM ANSWERS

A colour system is an answer to "what does colour mean in this chart". That is the axis that
separates the three built-in systems. `design-md` answers a different question: which measured
local style reference should fill the same role vocabulary while the data encoding remains the
form's existing one.

| System | `encodes` | Colour encodes | Use it when | Capacity |
| --- | --- | --- | --- | --- |
| `neutral` | `importance` | Rank, by lightness alone. The series run from the value furthest from the ground: darkest first on paper, brightest first on ink | The default, and the fallback whenever hue would carry no stable meaning | 4 series |
| `ordered` | `magnitude` | Position on a scale | The data is ordered: a value, a rank, a time position, a progress figure | 5 steps |
| `categorical` | `category` | Category membership | The categories are unordered and there are four or fewer | 4 categories |
| `design-md` | `reference` | A measured local style mapped into the chart roles; the data still follows the form's declared encoding | The request names a v3 `DESIGN.md`, style reference or measured site's look | 4 series |

Start at `neutral`. Reach for another only when the data has the property that system encodes. A categorical palette on ordered data throws away the ordering, and an ordered ramp on unordered categories invents one. `design-md` is selected by the presence of the local reference, not by a new data meaning.

### What the shadcn comparison kept

The shadcn comparison measured a much tighter categorical light-theme set than the standalone
one: shadcn light has a 16.0° minimum adjacent hue gap and 1.72:1 minimum own/opposite-ground
contrast, while standalone categorical light has a 92.9° gap and 3.37:1 minimum own/opposite-ground
contrast. The dark measurements were 71.1° and 2.92:1/2.15:1 for shadcn, against 96.5° and
3.38:1/1.72:1 for standalone categorical. The numbers support keeping the standalone role split
and its existing gates rather than replacing it with a raw five-token ramp; they do not create a
new CVD or hue threshold here.
[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/research/lineages/luna/research.md:55-66]

The transferable part is semantic indirection: a named series owns a palette token through its
key, and a mark reaches that token through the class the key declares. That keeps the palette
roles here while making a per-key colour change one auditable edit in the chart's series block.
[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/research/lineages/luna/research.md:123-132]

### Two names for one system

The second column exists because two vocabularies name these three built-in systems and both are
load-bearing. The id is what a file declares in its meta tag and what a catalog row carries. The
`encodes` value is a separate field in the palette source, and the contrast gates in section 5 and
the enforced list in section 6 are written against it rather than against the id, because what a
gate holds depends on what the colour means and not on what the system is called. They map one to
one, in the order above. A failure message quotes whichever of the two the rule it came from reads,
so the mapping is written here rather than inferred from a message.

`neutral` used to be described in this table as encoding nothing, which contradicted both the
palette source and the rest of its own row. Lightness is colour, and ranking by it is what
`importance` names.

### How to settle a row against this table

The catalog carries a system per row, and that cell is a mirror of what the template declares
rather than a second opinion. So a row and a definition can disagree with nobody noticing, which
is what happened for as long as no one read the two documents against each other. The procedure
below is what a reader applies to settle one row, and it is written down so the answer is a
reading rather than a preference.

1. **Name what colour is doing in that file.** Not what the chart is about. What the colour
   varies with. If it varies with nothing, the answer is already `neutral`.
2. **Test the data for the property, not the chart for the vibe.** `categorical` needs
   categories that are unordered. `ordered` needs a position on a scale. A pair of periods and a
   before-and-after both have an order, and an order is what `categorical` does not have.

   A signed step looks like it belongs on that list and does not, and both sign-coloured forms in
   the corpus turn on the difference. `waterfall` and `candlestick` each draw a plainly ordered
   sequence, and in both the order is carried by position on the axis while colour varies with the
   sign alone: up or down, two classes with no rank between them. Step 1 settles it. The question
   is what colour varies with, not whether the data has an order somewhere in it, and on that
   reading both forms declare `categorical` correctly. Section 8 says the same thing from the
   other side, where it explains why the corpus has no diverging system.

   This step used to list a signed step among the ordered cases, which put it in direct
   disagreement with section 8 about the same two files.
3. **`neutral` is the default and the fallback, so it wins a tie.** Leave it only when the data
   plainly has the property another system encodes. `neutral` carrying four series is not a
   workaround. Its capacity is four precisely so a form can draw several series and rank them by
   lightness, and a key printed beside those series is the ranking made legible rather than
   evidence that colour has started encoding membership.
4. **Record an ambiguous row instead of resolving it.** Where the reading genuinely goes both
   ways, the row keeps the system it has and the ambiguity is written down. A row flipped on
   preference is how a corpus acquires a system nobody can defend.

---

## 3. THE ROLE VOCABULARY

A template reads a role, never a value. Every system defines the same roles, so the same markup renders under any of them.

### Chrome roles, identical in all four identifiers

| Role | Custom property | What it is |
| --- | --- | --- |
| surface | `--chart-surface` | The page and card ground. Every ratio below is measured against it |
| ink | `--chart-ink` | Primary text: the headline, and any label read exactly |
| muted | `--chart-muted` | Secondary text: the subtitle, the axis labels, the source line |
| rule | `--chart-rule` | Gridlines, axis lines, card borders. Structure, never data |

Each of these carries a second value under `chromeDark`, chosen against the dark ground rather than
copied from the light one. The dark surface is the light theme's near-black taken one step deeper,
the dark ink and muted values are set to hold the ratio their light counterparts hold against paper,
and the dark rule is ink at an alpha rather than a solid grey, so a card edge sits on the ground
instead of drawing a second line over the data.

### Corner roles, identical in all four identifiers

Not colours, and in the palette source they sit in their own object for that reason. They are
listed here because they are the other half of the role vocabulary a template reads: one 2px knob,
five steps, each earned by a surface the corpus actually draws.

| Role | Custom property | What it is |
| --- | --- | --- |
| mark | `--chart-radius-mark` | A data mark's corner: a bar end, a box body, a calendar cell, a legend swatch, a ring tick |
| track | `--chart-radius-track` | A percentage bar and the track it runs inside |
| swatch | `--chart-radius-swatch` | A colour block large enough to read as a panel rather than as a mark |
| pill | `--chart-radius-pill` | A progress track and its fill, which read as one capsule |
| card | `--chart-radius-card` | The card that holds the chart |

A corner computed from a mark's own geometry is not a rung. A range bar rounded to half its own
width is a lozenge, which is a shape rather than a shared value, and it stays in the drawing code.

### Data roles, which are what a system changes

| Role | Custom property | What it is |
| --- | --- | --- |
| series | `--chart-series-1` upward | The data values in order. What the order means comes from the system |
| emphasis | `--chart-emphasis` | One value, for the single mark the headline is about |

### What varies and what does not

In the three stock systems only the series values and the emphasis value change. A `design-md`
delivery also maps the chrome, typeface and corner ladder from its reference, but it keeps the same
role names and the same chart structure. That is what makes a themed chart still read as one
product rather than as a fourth rendering contract.

A palette built from a client's brand colours defines the same six roles or it is not a palette. It is a pile of hex. A `design-md` delivery earns those roles only after provenance and inline gates are present.

---

## 4. THE RULES

**One system per delivery.** A file, or a set of sibling charts shipped together, locks one system. When one chart in the set cannot be expressed in it, the whole set changes system or goes neutral. Recolouring the one exception is what makes a deck look assembled from parts. A `design-md` delivery is one such locked system: both palette blocks carry the same provenance and both clear the gates.

**Capacity is a ceiling, not a suggestion.** Four unordered categories is comfortable and five is not offered. A request for eleven categories is answered with the neutral system and labels, or by merging the tail before drawing. The ceiling lives in the palette file as the length of the series array, so an agent cannot reach a fifth slot without editing the source and failing the check.

**Derive light and dark, never introduce a hue.** A lighter value comes from mixing the chosen colour toward `surface`. A darker one comes from mixing it toward `ink`. Borrowing a value from another system to fill a gap breaks the encoding, because the borrowed value carries the other system's meaning. Every value shipped here was derived that way, inside one theme.

**A design-md delivery reads local values only.** `scripts/apply-design-md.cjs` parses the v3
`DESIGN.md` headings and columns, maps its background, text and chromatic rows into the shared
roles, and keeps the measured face before the substitute stack. It never fetches a site or copies a
remote resource. If the table cannot supply four chromatic values that clear the series gates, the
script names the shortfall and writes nothing.

## Where the values come from

Since v1.5.0.0 the stock values are the cursor Style Reference, chosen from a survey of the whole
style library for a warm parchment and ink that suit a printed chart, a full muted ladder, a
hairline rule, and accents that clear the mark gate on both grounds. Since v1.10.0.0 the packet
carries its own copy of that reference at `assets/style-reference/cursor/`, so the values here are
derived from a file this packet owns rather than from one a sibling library regenerates.
`assets/style-reference/cursor/origin.md` records where the copy came from and pins each file by
hash.

**Since v1.12.0.0 the derivation is held rather than described.** The palette source carries a
`derivation` block naming the reference, its hash, the four departures with the gate each was made
to clear, and the values that come from an arithmetic the reference cannot carry: the ordered ramp's
interior rungs, spaced by equal contrast, and the dark rule, which is ink at alpha. The
`palette-derivation` family checks all of it — that the reference is still the file the palette was
derived from, that every value is either published by it, a named departure or one of those
arithmetic ones, and that each departure is still necessary and still sufficient. The prose above
stays because it explains why; the block is what fails when the two drift. Parchment, ink, ash,
driftwood, mist, stone and linen carry the chrome and the `neutral` system; ember, verdant,
crimson and amber carry the `categorical` system; ember drawn toward each ground carries the
`ordered` ramp; and the ink itself is the dark ground, which the reference already uses behind
its light action fills. Four values were moved by the least amount that clears a gate and the
palette source names each: ash to `#72716C` for muted, amber to `#BE8332` on paper, mist to
`#908F8D` as the fourth neutral step, and the far end of the paper ramp to `#E64B02`. The corner
ladder follows the reference's 4px corner, with 8px for the card. Everything else is verbatim.

**A theme boundary is the one place a hue may be re-chosen.** That rule above was written when there was one ground, and mixing toward the surface is exactly what makes a mark disappear when the surface is near-black. So a system's dark values are chosen for the dark ground rather than derived from its light ones, under one stated rule: a dark value is re-chosen at a hue the dark ground can carry, and its lightness is set so it holds the same ratio against near-black that its light counterpart holds against paper.

The reason a hue may have to move is arithmetic rather than taste. A hue reaches its own ceiling of lightness: pure blue tops out near a tenth of the luminance pure yellow reaches, so a hue carrying the brightest slot on paper cannot always carry the brightest slot on ink without desaturating. Where that bites, the hue lands in the slot whose lightness it can reach with its chroma intact.

**The palette that ships needs none of it, and that is worth stating rather than leaving the rule to imply otherwise.** Since the corpus was rebased on the cursor reference, all four `categorical` hues clear the mark gate on both grounds unchanged: ember at 3.28:1 on paper and 4.37:1 on ink, verdant at 4.01 and 3.57, crimson at 4.70 and 3.05. Only the fourth value moves, and it moves back: amber is darkened to `#BE8332` to clear 3:1 on paper and returns to its measured `#C08532` on ink, where it reaches 4.86:1 unaided. The rotation rule stays because it is what a future reference with a narrower hue would need; this one does not exercise it.

Two systems would not rotate in any case. The `neutral` system has no hue to move, so its dark values are the same warm greys ordered from the other end. The `ordered` ramp stays in the ember family on both grounds, because a magnitude ramp needs one hue; what changes is direction, running toward the paper on light and toward the ink on dark.

**Index 0 is always the value furthest from that theme's ground.** On paper the first series value is the darkest and on ink it is the brightest, and in both cases it is the one that carries most. That is what keeps `neutral` ranking importance the same way on both grounds and keeps `ordered` reading as more in the same direction. A dark ramp that simply reversed the light array would satisfy the gates and still be wrong, because the light ramp's chroma was placed for a light ground.

**A figure never spends its data marks on the ink.** The first series of every system carries the
reading and takes a hue. Drawing the readings in the ink and reserving the one colour for the mark
the headline is about inverts what colour is for: it hands the accent to the exception and leaves
the subject in the same tone as the axis labels around it. The ranked system takes the ink as its
emphasis instead, so a plot reads as coloured marks with one that is not, rather than as plain
marks with one that is.

**A single-series Cartesian form starts on the first series token of its own system.** A line, bar
or area with one data stream uses `--chart-series-1` for its primary mark, whichever system the
form declares; a neutral form stays neutral rather than borrowing the categorical ramp, because the
categorical emphasis token is ink and the orange highlighted mark would be lost. The `--chart-emphasis` role remains for the one highlighted mark the headline is
about. This keeps a lone series inside the same series vocabulary that a multi-series form
will use later, while the emphasis still reads as a deliberate exception. Unit grids, rings,
ordered ramps and other non-Cartesian forms keep their existing colour logic; their colour is
encoding a part-to-whole, magnitude or structural question rather than a lone Cartesian stream.

The rule is the HTML corpus' projection of the frozen shadcn examples: line and area examples
paint through a named series token (`chart-line-default.tsx:68-73`, `chart-area-default.tsx:70-76`),
and custom dots reserve their separate treatment for an active or deliberately named point
(`chart-line-label-custom.tsx:87-97`).

**Shapes that touch are separated by a stroke in `surface`.** Stacked segments, pie slices and treemap cells all carry a surface-coloured separator, so no two data colours ever share an edge. This is what makes the contrast gate satisfiable: with the separator, every mark is read against the ground rather than against its neighbour. Without it, four categories on a light ground is arithmetically impossible, because all-pairs separation at 3:1 runs out of room after two values.

**Colour is never the only cue.** Categories keep labels, ordered data keeps position or length, emphasis keeps a headline. Remove the colour and the chart still has to be readable. That is an accessibility floor and it is also a hedge against a reader printing in greyscale.

**A single mark may sweep along its own ramp, and only where the system already encodes magnitude.** A sweep restates an ordering the data already has, which is why it is honest on an `ordered` system and dishonest anywhere else. On a `neutral` or a `categorical` series the same sweep invents an ordering the data does not have, so it is refused there. That permits it on `calendar-grid`, `heat-matrix` and `progress-single`, and forbids it on the other eighteen forms.

The rule is written to be testable rather than judged. A gradient whose stops name two different
series values is a sweep, and it may appear only in a file whose declared system is `ordered`. A
gradient whose stops name one series value at two opacities is a fade rather than a sweep, which
is what the area under the line in `daily-line` already is, and the rule leaves it alone.

Permission is not obligation, and two of the three permitted forms have nothing to sweep. A
calendar cell and a matrix cell each carry one value, so a gradient across one of them would
show a variation inside a single reading. Only `progress-single` draws a mark whose length is
the magnitude, so only `progress-single` carries the sweep. Its ramp is anchored to the whole
track rather than to the fill, which is what makes the shade at the bar's end mean how far along
the goal it is rather than simply the end of the bar. It runs from the fourth step to the first,
leaving out the step nearest the ground, because that step reads at 1.76:1 and a bar that starts
invisible against its own track is a bar that starts in the wrong place.

A gradient reference is not a colour and cannot be typed into a `fill`. It reaches the mark
through a custom property, the way every other value in a template does.

---

## 5. THE CONTRAST GATES

These are computed from the palette file on every run, never restated in a test. A test that copies the values goes stale the first time somebody edits a colour.

Every gate runs twice, once per theme, against that theme's own surface. A stock run prints the two
as separate lines, `palette-source` and `palette-source-dark`; a design-md run adds `design-md` lines
for each delivery block. Nobody reads one theme's pass as covering both. A value that clears on
paper has proved nothing about ink.

| Gate | Threshold | Applies to, on either ground |
| --- | --- | --- |
| `textOnSurface` | 4.5:1 | `ink` and `muted` against that theme's `surface` |
| `markOnSurface` | 3.0:1 | Every series value in an `importance` or `category` system, and every emphasis value |
| `rampDarkestOnSurface` | 3.0:1 | The step of a `magnitude` system furthest from the ground, which is the darkest on paper and the brightest on ink |
| `rampLightestOnSurface` | 1.15:1 | The step nearest the ground, so a low cell is distinguishable from an empty one |
| `rampStepSeparation` | 1.3:1 | Adjacent steps of a `magnitude` system |
| `emphasisAgainstFirstSeries` | 1.5:1 | Emphasis against `series-1` |

The design-md adapter applies `textOnSurface` to ink and muted, `markOnSurface` to all four series
and emphasis, `rampDarkestOnSurface` and `rampLightestOnSurface` to the two series ends,
`rampStepSeparation` to adjacent series values, and `emphasisAgainstFirstSeries` to emphasis. The
rule role remains deliberately ungated, but the dark rule still has to be the dark ink colour at a
non-full alpha.

Two of those names were written when there was one ground and now read wrong on the other: on ink
the step this table calls the darkest is the brightest one. The check tests the end by its distance
from the ground rather than by its position in the array, and it says which end it tested in the
failure it prints.

The rename stays a proposal, and the reason has changed since it was first written. It is now a
scoping fact rather than a judgement: `rampDarkestOnSurface` and `rampLightestOnSurface` reach
three files, being this document, the palette source and the check that reads the keys by name,
and the check is the one file the phase that would rename them is not allowed to touch. Renaming
here and not there would leave a gate reading a key nobody defines, which is a worse state than
two badly named keys that work. `rampFarEndOnSurface` and `rampNearEndOnSurface` are the names
the rename should land under, and it lands as one edit across all three files or not at all.

### Which end of a ramp the gates hold

A ramp's array runs from the value furthest from the ground to the value nearest it, and the check
asserts that ordering before it gates either end. That is what stops a reversed array from passing:
reversal keeps every step separation intact, so a check that gated whichever end happened to be
lighter would accept a ramp that now reads backwards.

### Why a ramp is gated differently

A ramp step is read as part of a group, against its legend and its neighbours. An individual mark is read alone. Requiring 3:1 of every ramp step would delete the light end of every sequential scale, which is the half that encodes "low", so the gate holds the dark end and the step separation instead.

### The one role deliberately not gated

`rule` is ungated, and this is a decision rather than an oversight. A gridline pushed to 3:1 competes with the data drawn over it, and it carries no information a reader has to recover. Structure that fails to read is a design defect reviewed by eye. The exemption is written into the palette file next to the gates so nobody has to guess whether it was intended.

---

## 6. WHAT IS ENFORCED AND WHAT IS NOT

Enforced by `scripts/check-corpus.cjs`, on every run:

- Every gate in the table above, computed from the palette file, once per theme against that theme's own surface.
- Every system defines as many series values as its declared capacity, on both grounds.
- A `magnitude` system runs from the step furthest from the ground to the step nearest it, without reversing.
- The dark `rule` value is that theme's ink at an alpha, rather than a solid grey that a card edge would have to sit over.
- Each of a template's palette blocks matches the palette file exactly, in both directions, and no file carries more than one block per theme.
- A `design-md` block carries a first-line provenance comment with a well-formed 64-hex hash, and its inline values clear the same gates on both grounds.
- No colour literal appears anywhere outside a palette block.
- No corner value appears anywhere outside a palette block: a stylesheet corner resolves through a rung, and the drawing code computes a corner rather than typing one.
- An indexed data class carries the palette token of its own index, the indices run from one without a gap, and they stop at the declared system's capacity. `series-mapping` is the only rule that reads the mapping itself rather than the values on either side of it, and it is the rule a reversed or shuffled encoding fails. Everything else on this list passes a file whose classes hand the tokens out in the wrong order, because every other rule asks where a value came from and none asks which mark received it.

The sweep rule was the last entry on this list and it has moved up onto it. `gradient-sweep`
resolves each gradient's stops through the classes that carry them, counts the distinct series
values it finds and fails a gradient naming two of them in a file whose declared system is not
`ordered`. A gradient naming one series value at two opacities is a fade and is left alone,
which is what keeps the area under a line untouched.

Advisory, and reviewed by a person:

- Whether the gridline weight looks right at the size the chart ships.
- Whether two categorical hues that both clear the gate are still easy to tell apart. Their luminances are spread so the set survives greyscale, and that is a design property rather than a measurable one.
- Whether a sweep reads as one mark deepening rather than as two marks. That is the judgement the rule cannot make, and the reason the rule is a ceiling on where a sweep may appear rather than an instruction to use one.

The split is deliberate. A rule the tooling does not check describes the author's intentions rather than the artifact, so anything stated as binding above is checked, and anything that cannot be checked is named here as advice.

---

## 7. WHY THREE BUILT-IN SYSTEMS AND ONE ADAPTER

A fourth semantic system of "neutral with one accent colour" was considered and cut. Emphasis is a
role that every built-in system already carries, so a system whose only difference is that the role
is filled adds a name without adding an answer. In `neutral` the emphasis value is the only
chromatic colour in the palette, which is exactly what that fourth semantic system would have
delivered, reached by filling a role instead of by switching system.

`design-md` is not that system. It is an adapter for a measured local style reference: it changes
the values that fill the shared roles, records the source hash, and passes the same gates. It does
not add a new meaning to colour, a new capacity or a new chart form. The cost of keeping that
adapter separate is one more checker branch; the benefit is that stock source equality remains
strict and a themed delivery can be traced without putting client colours into the stock palette.

The emphasis role is required in all three built-in systems and in the adapter. A system where
emphasis is undefined has no way to express the most common request in the corpus: this one bar is
the point.

---

## 8. WHAT IS DELIBERATELY ABSENT

Two things a reader coming from a charting library will look for and not find. Both were
considered and both are cut, for the same reason section 7 cuts a fourth system: a name
that adds no answer costs more than the gap it fills.

### A diverging system

A diverging ramp encodes distance from a meaningful midpoint, and it earns its place when a
form reads two directions away from zero on one continuous scale. No form in the corpus
does. `heat-matrix` and `calendar-grid` both run one direction from low to high, which is
what `ordered` already encodes, and `waterfall` separates rises from falls by category
rather than by magnitude, which is what `categorical` already encodes. Adding the system
now would mean shipping a scale with no consumer and letting an author reach for it because
it exists.

What would reopen it is a catalog form that genuinely needs a midpoint: a matrix of signed
change, a variance-against-plan grid, a correlation table. When such a form arrives, the
system arrives with it, and the two are added together so the scale has a consumer on the
day it ships.

### Pattern fills

Hatching or dotting a mark so that colour is not the only cue is a real technique, and this
corpus does not need it. The rule above already forbids colour carrying meaning alone, and
every form satisfies it another way: a stacked segment carries its value in the segment, a
ring group carries its count beside the label, a scatter point carries a hover title, a band
carries a legend swatch in the same order as the stack. The luminances in each system are
spread so the set survives greyscale, which is the printing case patterns are usually
reached for.

The cost of adding them is not small. A pattern changes the visual register of every chart
it appears in, so it is either corpus-wide, which redraws the whole product for a problem
none of these forms has, or per-form, which makes two charts in one deck look like they came
from different tools. If a future form does encode something in colour alone and cannot
label it, that form carries the pattern, and this paragraph is the reason nothing else does.

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
| --- | --- |
| [`template-contract.md`](./template-contract.md) | What a template file has to contain |
| [`catalog.md`](./catalog.md) | The index from a question to a chart form |
| [`../assets/color/palettes.json`](../assets/color/palettes.json) | The source of truth for every value |
| [`../scripts/README.md`](../scripts/README.md) | What the corpus check enforces |
