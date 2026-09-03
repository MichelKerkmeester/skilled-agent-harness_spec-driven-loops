---
title: "Chart Colour Systems"
description: "Three colour systems, one shared role vocabulary, the corner ladder that rides beside it and the contrast gates the corpus check enforces, so a set of charts reads as one product rather than four."
trigger_phrases:
  - "chart color system"
  - "chart palette"
  - "which palette for a chart"
  - "chart contrast"
  - "chart color roles"
importance_tier: normal
contextType: reference
version: 1.4.0.0
---

# Chart Colour Systems

Every colour in this packet comes from `assets/color/palettes.json`. A template never invents one, and the corpus check fails a template that carries a colour literal anywhere except a palette block.

Every role holds two values, one per ground. A file paints the light set by default and the dark set when the reader's operating system asks for one, and both sets come from the same file and clear the same gates.

---

## 1. OVERVIEW

Three systems exist. Pick one per delivery and apply it whole.

---

## 2. THE QUESTION EACH SYSTEM ANSWERS

A colour system is an answer to "what does colour mean in this chart". That is the only axis that separates the three. If two systems answered the same question, the second would be a skin rather than a system.

| System | Colour encodes | Use it when | Capacity |
| --- | --- | --- | --- |
| `neutral` | Nothing. Lightness ranks the series, starting furthest from the ground: darkest first on paper, brightest first on ink | The default, and the fallback whenever hue would carry no stable meaning | 4 series |
| `ordered` | Position on a scale | The data is ordered: a value, a rank, a time position, a progress figure | 5 steps |
| `categorical` | Category membership | The categories are unordered and there are four or fewer | 4 categories |

Start at `neutral`. Reach for another only when the data has the property that system encodes. A categorical palette on ordered data throws away the ordering, and an ordered ramp on unordered categories invents one.

### How to settle a row against this table

The catalog carries a system per row, and that cell is a mirror of what the template declares
rather than a second opinion. So a row and a definition can disagree with nobody noticing, which
is what happened for as long as no one read the two documents against each other. The procedure
below is what a reader applies to settle one row, and it is written down so the answer is a
reading rather than a preference.

1. **Name what colour is doing in that file.** Not what the chart is about. What the colour
   varies with. If it varies with nothing, the answer is already `neutral`.
2. **Test the data for the property, not the chart for the vibe.** `categorical` needs
   categories that are unordered. `ordered` needs a position on a scale. A pair of periods, a
   before and an after, a signed step: each of those has an order, and an order is what
   `categorical` does not have.
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

### Chrome roles, identical in all three systems

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

### Corner roles, identical in all three systems

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

Only the series values and the emphasis value change between systems. The chrome roles, the corner ladder, the typeface, the spacing and the card layout are identical everywhere. That is what makes three charts in three systems still read as one product, and it is the reason a system swap is a single line in the palette block rather than a redesign.

A palette built from a client's brand colours defines the same six roles or it is not a palette. It is a pile of hex.

---

## 4. THE RULES

**One system per delivery.** A file, or a set of sibling charts shipped together, locks one system. When one chart in the set cannot be expressed in it, the whole set changes system or goes neutral. Recolouring the one exception is what makes a deck look assembled from parts.

**Capacity is a ceiling, not a suggestion.** Four unordered categories is comfortable and five is not offered. A request for eleven categories is answered with the neutral system and labels, or by merging the tail before drawing. The ceiling lives in the palette file as the length of the series array, so an agent cannot reach a fifth slot without editing the source and failing the check.

**Derive light and dark, never introduce a hue.** A lighter value comes from mixing the chosen colour toward `surface`. A darker one comes from mixing it toward `ink`. Borrowing a value from another system to fill a gap breaks the encoding, because the borrowed value carries the other system's meaning. Every value shipped here was derived that way, inside one theme.

**A theme boundary is the one place a hue may be re-chosen.** That rule above was written when there was one ground, and mixing toward the surface is exactly what makes a mark disappear when the surface is near-black. So a system's dark values are chosen for the dark ground rather than derived from its light ones, under one stated rule: a dark value is re-chosen at a hue the dark ground can carry, and its lightness is set so it holds the same ratio against near-black that its light counterpart holds against paper.

The reason a hue has to move is arithmetic rather than taste. A hue reaches its own ceiling of lightness: pure blue tops out near a tenth of the luminance pure yellow reaches, so the categorical system's navy, which carries the brightest slot on paper, cannot carry the brightest slot on ink without desaturating into a pale grey-blue. Each hue therefore lands in the slot whose lightness it can reach with its chroma intact, and the set rotates: navy, rust, green and violet on paper become gold, cyan, rose and violet-blue on ink.

Two things do not rotate, and both refusals are as deliberate as the rotation. The `neutral` system has no hue to move, so its dark values stay warm greys. The `ordered` ramp stays in the teal family, because a magnitude ramp needs one hue and teal is a family that reaches the lightness the dark carrying end needs without washing out. What changes there is direction and chroma, not hue.

**Index 0 is always the value furthest from that theme's ground.** On paper the first series value is the darkest and on ink it is the brightest, and in both cases it is the one that carries most. That is what keeps `neutral` ranking importance the same way on both grounds and keeps `ordered` reading as more in the same direction. A dark ramp that simply reversed the light array would satisfy the gates and still be wrong, because the light ramp's chroma was placed for a light ground.

**Shapes that touch are separated by a stroke in `surface`.** Stacked segments, pie slices and treemap cells all carry a surface-coloured separator, so no two data colours ever share an edge. This is what makes the contrast gate satisfiable: with the separator, every mark is read against the ground rather than against its neighbour. Without it, four categories on a light ground is arithmetically impossible, because all-pairs separation at 3:1 runs out of room after two values.

**Colour is never the only cue.** Categories keep labels, ordered data keeps position or length, emphasis keeps a headline. Remove the colour and the chart still has to be readable. That is an accessibility floor and it is also a hedge against a reader printing in greyscale.

**A single mark may sweep along its own ramp, and only where the system already encodes magnitude.** A sweep restates an ordering the data already has, which is why it is honest on an `ordered` system and dishonest anywhere else. On a `neutral` or a `categorical` series the same sweep invents an ordering the data does not have, so it is refused there. That permits it on `calendar-grid`, `heat-matrix` and `progress-single`, and forbids it on the other seventeen forms.

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

Every gate runs twice, once per theme, against that theme's own surface. A run prints the two as separate lines, `palette-source` and `palette-source-dark`, each with its own assertion count, so nobody reads one theme's pass as covering both. A value that clears on paper has proved nothing about ink.

| Gate | Threshold | Applies to, on either ground |
| --- | --- | --- |
| `textOnSurface` | 4.5:1 | `ink` and `muted` against that theme's `surface` |
| `markOnSurface` | 3.0:1 | Every series value in an `importance` or `category` system, and every emphasis value |
| `rampDarkestOnSurface` | 3.0:1 | The step of a `magnitude` system furthest from the ground, which is the darkest on paper and the brightest on ink |
| `rampLightestOnSurface` | 1.15:1 | The step nearest the ground, so a low cell is distinguishable from an empty one |
| `rampStepSeparation` | 1.3:1 | Adjacent steps of a `magnitude` system |
| `emphasisAgainstFirstSeries` | 1.5:1 | Emphasis against `series-1` |

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
- No colour literal appears anywhere outside a palette block.
- No corner value appears anywhere outside a palette block: a stylesheet corner resolves through a rung, and the drawing code computes a corner rather than typing one.

Stated as a rule and not yet asserted:

- The sweep rule above. The predicate is mechanical, being a gradient with two different series
  values in a file whose declared system is not `ordered`, and the corpus was scanned against it
  by hand rather than on every run. Folding it into the check is the next phase's work, and until
  that lands a file could break the rule and pass.

Advisory, and reviewed by a person:

- Whether the gridline weight looks right at the size the chart ships.
- Whether two categorical hues that both clear the gate are still easy to tell apart. Their luminances are spread so the set survives greyscale, and that is a design property rather than a measurable one.
- Whether a sweep reads as one mark deepening rather than as two marks. That is the judgement the rule cannot make, and the reason the rule is a ceiling on where a sweep may appear rather than an instruction to use one.

The split is deliberate. A rule the tooling does not check describes the author's intentions rather than the artifact, so anything stated as binding above is checked, and anything that cannot be checked is named here as advice.

---

## 7. WHY THREE SYSTEMS AND NOT FOUR

A fourth system of "neutral with one accent colour" was considered and cut. Emphasis is a role that every system already carries, so a system whose only difference is that the role is filled adds a name without adding an answer. In `neutral` the emphasis value is the only chromatic colour in the palette, which is exactly what that fourth system would have delivered, reached by filling a role instead of by switching system.

The cost of the cut is that emphasis is now required in all three systems rather than optional in some. That is the right trade, because a system where emphasis is undefined has no way to express the most common request in the corpus: this one bar is the point.

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
