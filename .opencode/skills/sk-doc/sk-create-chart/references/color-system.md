---
title: "Chart Colour Systems"
description: "Three colour systems, one shared role vocabulary and the contrast gates the corpus check enforces, so a set of charts reads as one product rather than four."
trigger_phrases:
  - "chart color system"
  - "chart palette"
  - "which palette for a chart"
  - "chart contrast"
  - "chart color roles"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Chart Colour Systems

Every colour in this packet comes from `assets/color/palettes.json`. A template never invents one, and the corpus check fails a template that carries a colour literal anywhere except its palette block.

---

## 0. OVERVIEW

Three systems exist. Pick one per delivery and apply it whole.

---

## 1. THE QUESTION EACH SYSTEM ANSWERS

A colour system is an answer to "what does colour mean in this chart". That is the only axis that separates the three. If two systems answered the same question, the second would be a skin rather than a system.

| System | Colour encodes | Use it when | Capacity |
| --- | --- | --- | --- |
| `neutral` | Nothing. Lightness ranks the series, darkest first | The default, and the fallback whenever hue would carry no stable meaning | 4 series |
| `ordered` | Position on a scale | The data is ordered: a value, a rank, a time position, a progress figure | 5 steps |
| `categorical` | Category membership | The categories are unordered and there are four or fewer | 4 categories |

Start at `neutral`. Reach for another only when the data has the property that system encodes. A categorical palette on ordered data throws away the ordering, and an ordered ramp on unordered categories invents one.

---

## 2. THE ROLE VOCABULARY

A template reads a role, never a value. Every system defines the same roles, so the same markup renders under any of them.

### Chrome roles, identical in all three systems

| Role | Custom property | What it is |
| --- | --- | --- |
| surface | `--chart-surface` | The page and card ground. Every ratio below is measured against it |
| ink | `--chart-ink` | Primary text: the headline, and any label read exactly |
| muted | `--chart-muted` | Secondary text: the subtitle, the axis labels, the source line |
| rule | `--chart-rule` | Gridlines, axis lines, card borders. Structure, never data |

### Data roles, which are what a system changes

| Role | Custom property | What it is |
| --- | --- | --- |
| series | `--chart-series-1` upward | The data values in order. What the order means comes from the system |
| emphasis | `--chart-emphasis` | One value, for the single mark the headline is about |

### What varies and what does not

Only the series values and the emphasis value change between systems. The chrome roles, the typeface, the spacing, the corner radius and the card layout are identical everywhere. That is what makes three charts in three systems still read as one product, and it is the reason a system swap is a single line in the palette block rather than a redesign.

A palette built from a client's brand colours defines the same six roles or it is not a palette. It is a pile of hex.

---

## 3. THE RULES

**One system per delivery.** A file, or a set of sibling charts shipped together, locks one system. When one chart in the set cannot be expressed in it, the whole set changes system or goes neutral. Recolouring the one exception is what makes a deck look assembled from parts.

**Capacity is a ceiling, not a suggestion.** Four unordered categories is comfortable and five is not offered. A request for eleven categories is answered with the neutral system and labels, or by merging the tail before drawing. The ceiling lives in the palette file as the length of the series array, so an agent cannot reach a fifth slot without editing the source and failing the check.

**Derive light and dark, never introduce a hue.** A lighter value comes from mixing the chosen colour toward `surface`. A darker one comes from mixing it toward `ink`. Borrowing a value from another system to fill a gap breaks the encoding, because the borrowed value carries the other system's meaning. Every value shipped here was derived that way.

**Shapes that touch are separated by a stroke in `surface`.** Stacked segments, pie slices and treemap cells all carry a surface-coloured separator, so no two data colours ever share an edge. This is what makes the contrast gate satisfiable: with the separator, every mark is read against the ground rather than against its neighbour. Without it, four categories on a light ground is arithmetically impossible, because all-pairs separation at 3:1 runs out of room after two values.

**Colour is never the only cue.** Categories keep labels, ordered data keeps position or length, emphasis keeps a headline. Remove the colour and the chart still has to be readable. That is an accessibility floor and it is also a hedge against a reader printing in greyscale.

---

## 4. THE CONTRAST GATES

These are computed from the palette file on every run, never restated in a test. A test that copies the values goes stale the first time somebody edits a colour.

| Gate | Threshold | Applies to |
| --- | --- | --- |
| `textOnSurface` | 4.5:1 | `ink` and `muted` against `surface` |
| `markOnSurface` | 3.0:1 | Every series value in an `importance` or `category` system, and every emphasis value |
| `rampDarkestOnSurface` | 3.0:1 | The darkest step of a `magnitude` system |
| `rampLightestOnSurface` | 1.15:1 | The lightest step, so a low cell is distinguishable from an empty one |
| `rampStepSeparation` | 1.3:1 | Adjacent steps of a `magnitude` system |
| `emphasisAgainstFirstSeries` | 1.5:1 | Emphasis against `series-1` |

### Why a ramp is gated differently

A ramp step is read as part of a group, against its legend and its neighbours. An individual mark is read alone. Requiring 3:1 of every ramp step would delete the light end of every sequential scale, which is the half that encodes "low", so the gate holds the dark end and the step separation instead.

### The one role deliberately not gated

`rule` is ungated, and this is a decision rather than an oversight. A gridline pushed to 3:1 competes with the data drawn over it, and it carries no information a reader has to recover. Structure that fails to read is a design defect reviewed by eye. The exemption is written into the palette file next to the gates so nobody has to guess whether it was intended.

---

## 5. WHAT IS ENFORCED AND WHAT IS NOT

Enforced by `scripts/check-corpus.cjs`, on every run:

- Every gate in the table above, computed from the palette file.
- Every system defines as many series values as its declared capacity.
- A `magnitude` system is strictly monotonic in lightness.
- A template's palette block matches the palette file exactly, in both directions.
- No colour literal appears anywhere outside a palette block.

Advisory, and reviewed by a person:

- Whether the gridline weight looks right at the size the chart ships.
- Whether two categorical hues that both clear the gate are still easy to tell apart. Their luminances are spread so the set survives greyscale, and that is a design property rather than a measurable one.

The split is deliberate. A rule the tooling does not check describes the author's intentions rather than the artifact, so anything stated as binding above is checked, and anything that cannot be checked is named here as advice.

---

## 6. WHY THREE SYSTEMS AND NOT FOUR

A fourth system of "neutral with one accent colour" was considered and cut. Emphasis is a role that every system already carries, so a system whose only difference is that the role is filled adds a name without adding an answer. In `neutral` the emphasis value is the only chromatic colour in the palette, which is exactly what that fourth system would have delivered, reached by filling a role instead of by switching system.

The cost of the cut is that emphasis is now required in all three systems rather than optional in some. That is the right trade, because a system where emphasis is undefined has no way to express the most common request in the corpus: this one bar is the point.

---

## 7. RELATED DOCUMENTS

| Document | Purpose |
| --- | --- |
| [`template-contract.md`](./template-contract.md) | What a template file has to contain |
| [`catalog.md`](./catalog.md) | The index from a question to a chart form |
| [`../assets/color/palettes.json`](../assets/color/palettes.json) | The source of truth for every value |
| [`../scripts/README.md`](../scripts/README.md) | What the corpus check enforces |
