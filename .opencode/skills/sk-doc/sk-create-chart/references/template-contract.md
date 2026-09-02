---
title: "Chart Template Contract"
description: "What a chart template file contains, how it receives data, what it may depend on and the fourteen rules the corpus check enforces on every one."
trigger_phrases:
  - "chart template contract"
  - "how to author a chart template"
  - "chart template rules"
  - "chart data block"
  - "chart skeleton"
importance_tier: important
contextType: reference
version: 1.1.0.0
---

# Chart Template Contract

A template is one HTML file. It opens on a double click, with no install, no package manager and no build step, and it keeps working when the person who received it edits the numbers by hand.

---

## 1. OVERVIEW

Both of those properties are load-bearing. The reader is a writer or an operations analyst rather than a developer, and the file has to survive being emailed to somebody who will open it on a laptop with no network.

---

## 2. THE DELIVERY UNIT

One file holds one chart. Inside it, the visible unit is a card with four parts in a fixed order.

| Part | Marker | What goes in it |
| --- | --- | --- |
| Headline | `data-chart-part="headline"` | A conclusion, not a chart type. "Revenue by plan" is a label. "Where we gained and where we bled" is an argument |
| Subtitle | `data-chart-part="subtitle"` | The legend and the time range, in a sentence |
| Figure | `data-chart-part="figure"` | The drawing itself |
| Source | `data-chart-part="source"` | Where the numbers came from |

The fixed four are what make a chart legible with no caption around it. The headline rule is the highest-value writing rule in this packet: a reader who takes nothing but the top line should still have learned something.

### Gallery and delivery are different things

A delivery is one card in one file, and it is what reaches a user. A gallery is many cards on one page, used as a workbench for finding a form. Never hand over a gallery. It carries every other chart's demo data with the user's one real chart somewhere inside it.

---

## 3. THE FILE SKELETON

Copy the skeleton from `assets/color/palette-sheet-neutral.html`, which is a working file that passes every check. The structure is:

```
<!doctype html>
<html lang="en">
<head>
  <meta charset>, <meta name="viewport">, <title>
  <meta name="chart-template"     content="<id>">
  <meta name="chart-color-system" content="<system>">
  <style>
    /* CHART_PALETTE:BEGIN system=<system> */
    :root { every role, values pasted from the palette source }
    /* CHART_PALETTE:END */

    everything else, referring only to var(--chart-…)
  </style>
</head>
<body>
  the card: headline, subtitle, figure, source
  a table carrying data-chart-table
  <script>
    /* CHART_DATA:BEGIN */
    the numbers, and nothing else
    /* CHART_DATA:END */

    the drawing code
  </script>
</body>
</html>
```

The sentinels are how the corpus check finds the two regions it has an opinion about. Do not rename them and do not use them twice in one file.

---

## 4. HOW IT RECEIVES DATA

One named array at the top of the inline script, between the `CHART_DATA` sentinels, and everything below it renders. That is the whole contract, and it is the right one, because the person editing a delivered file is looking for the numbers and nothing else.

The data block holds literal values. It never fetches, never computes the numbers it is displaying and never reads the clock. A chart that changes on its own cannot be reviewed, because two screenshots of one file disagree and nobody can tell which is the bug.

### The one exception, named

Two forms compute a value they display, and both are deliberate: the waterfall's closing
total and the stacked area's per-period total. Neither invents a number. Each is the sum
of values the reader can already see, computed beside them and auditable against them, and
in both cases typing the total by hand would create a second copy that drifts the first
time a step is edited.

That is the whole exception and it does not generalise. A computed value is allowed when it
is a total of the typed values, sits next to them, and would otherwise be a hand-kept
duplicate. Everything else belongs upstream, in the workbook or query the numbers came
from. That covers a rate, a share of an untyped denominator, a smoothed series, and any
value derived from another source. The test is whether a reader holding only the data block can check the figure. If
they cannot, the file is computing rather than displaying.

Everything else the drawing code derives is geometry or presentation, not data: an axis
ceiling, a tick ladder, a bar height, a formatted label. Those are how the numbers are
drawn, and they are not what this clause is about.

### When a form cannot honour the data it was given

A form is honest inside a documented shape, and the catalog states that shape per row. Two
forms now say so in the picture when the shape is exceeded: `scatter` past twenty points and
`heat-matrix` past a hundred cells both grow the frame and print one line naming the count
and the ceiling. A missing reading gets the same treatment: `daily-line`, `daily-range` and
`stacked-area` break the mark at the gap rather than drawing through it, and print how many
readings were left out.

A notice belongs in the figure when a reader looking at the picture would otherwise draw a
wrong conclusion from it, and it is not spread across every form for its own sake. A console
warning was the alternative and was rejected: the person the ceiling protects is reading a
chart, not a developer console.

---

## 5. WHAT IT MAY DEPEND ON

Nothing.

No charting library, no web font, no icon set, no boundary data, no CDN of any kind. Marks are drawn as inline vector output by the file's own script.

This is stricter than it needs to be for the no-build-step property alone, and it is deliberate. A remote dependency keeps the file working only while the network is up and the host still exists, which turns "it opens on a double click" into "it opened on a double click in the office". The cost is real: each form is hand-drawn, and forms that genuinely need a layout engine, such as dense node-link networks, are out of the corpus rather than in it with a library attached.

The check enforces this by failing any remote `src` or `href`, any `@import` and any `fetch`, `XMLHttpRequest` or dynamic `import` in the file.

---

## 6. WHERE COLOUR COMES FROM

The palette block is the only place in the file where a colour value appears. Everything else refers to `var(--chart-…)`.

Take the block from the corpus check: when a template's block is missing or has drifted, the failure message prints the exact block to paste. That is the whole workflow, and it is why there is no generation step.

To show a colour value as text, read it at runtime with `getComputedStyle(document.documentElement).getPropertyValue('--chart-series-1')`. A hex typed into the markup is a second copy that drifts, and the check fails it.

Which system to pick, what the roles mean and where the ceilings are: `color-system.md`.

---

## 7. THE FOURTEEN RULES

Every rule is enforced. The check name is what appears in the corpus check output, so a failure points at the rule it broke.

| # | Rule | Check | The failure it prevents |
| --- | --- | --- | --- |
| 1 | Complete document: doctype, `lang`, charset, viewport, a non-empty title | `document-shape` | Shipping a fragment as a deliverable |
| 2 | Identity tag present, lower-case kebab, equal to the filename stem | `identity` | A file nothing can index |
| 3 | Declared colour system exists in the palette source | `identity` | A template pointing at a system nobody defined |
| 4 | Exactly one palette block, matching the source in both directions | `palette-block` | Silent theme drift, invisible in a diff |
| 5 | No colour literal outside the palette block | `colour-literals` | A palette edit that reaches half the file |
| 6 | No remote resource and no runtime fetch | `no-external` | A chart that stops working away from the network |
| 7 | Every inline script compiles | `script-parses` | A file that throws on open, which no reading catches |
| 8 | Exactly one data block, before the drawing code | `data-block` | An editor hunting for the numbers through the rendering |
| 9 | Element ids unique in the file | `unique-ids` | Two charts silently rendering into one container |
| 10 | Every `svg` carries `role="img"` and an `aria-labelledby` that resolves, and the file carries a `data-chart-table` | `accessibility` | A screen reader getting nothing at all from the chart |
| 11 | The four card parts, present and in order | `card-parts` | A chart that needs a caption to be understood |
| 12 | No randomness and no clock in rendering code | `determinism` | Two renders of one file that disagree |
| 13 | A file that animates carries a `prefers-reduced-motion` fallback | `motion` | Motion shipped to a reader who asked their system for none |
| 14 | The figure region can scroll sideways, and its drawing declares a `min-width` no wider than its own `viewBox` | `narrow-viewport` | A phone-width screen shrinking a chart until its labels sit on top of each other |

Rule 14 is the one a desktop author never notices is missing. `width: 100%` on the drawing
looks correct at every size the author tries, and squashes the chart into illegibility at the
width most readers will open it on. A floor plus a pannable region is the whole fix, and it is
two declarations.

Rule 10 is the one worth doing first rather than last. A title inside the vector output, an accessible role and a hidden data table cost almost nothing while a template is being written, and are close to unaffordable to retrofit across a whole corpus.

---

## 8. AUTHORING A NEW TEMPLATE

1. Find the question in `catalog.md`. If no row answers it, that is a gap to report rather than a chart to improvise.
2. Copy `assets/color/palette-sheet-neutral.html` to `assets/templates/<id>.html`.
3. Set the identity tag and the title. The id, the filename stem and the catalog row all carry the same string.
4. Choose the colour system, and paste its palette block from the corpus check output.
5. Replace the data block with the real shape, and write the drawing code below it.
6. Write the headline as a conclusion.
7. Add the catalog row.
8. Run `node scripts/check-corpus.cjs --render` and read the `RESULT:` line.

When the check fails on a template, fix the template. A validator edited to accept a file it was right to reject is worth less than no validator, because the next reader believes it.

---

## 9. WHAT THE CHECK DOES NOT OBSERVE

Stated plainly, so nobody reads a green run as more than it is.

- **It does not look at the picture.** With `--render` it opens the file in a headless browser and confirms the figure region holds real elements after the script ran, which catches an empty box. It does not know whether the bars are the right height.
- **It does not read console warnings.** A script that throws is caught, because the marks never appear. A script that warns is not.
- **It does not judge the headline.** Whether the top line states a conclusion is a review question.
- **Without `--render` it has not opened anything.** The summary line says so on every run. A structural pass is not a rendering pass.
- **It does not measure a narrow screen.** Rule 14 is asserted from the stylesheet, not from a rendered page, because a headless browser hands back the DOM and the DOM does not say whether the page overflowed. The check proves the pan affordance is declared and that its floor is not above the drawing's natural width. Whether the chart is legible at that floor is a review question, and the floor itself is a judgement nobody has measured per form.

---

## 10. RELATED DOCUMENTS

| Document | Purpose |
| --- | --- |
| [`color-system.md`](./color-system.md) | The three systems, their roles and their gates |
| [`catalog.md`](./catalog.md) | The index from a question to a chart form |
| [`../scripts/README.md`](../scripts/README.md) | How to run the corpus check and how to prove it can fail |
| [`../assets/color/palette-sheet-neutral.html`](../assets/color/palette-sheet-neutral.html) | The working skeleton to copy |
