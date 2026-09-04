---
title: "Chart Template Contract"
description: "What a chart template file contains, how it receives data, what it may depend on and the sixteen rules the corpus check enforces on every one."
trigger_phrases:
  - "chart template contract"
  - "how to author a chart template"
  - "chart template rules"
  - "chart data block"
  - "chart skeleton"
importance_tier: important
contextType: reference
version: 1.8.0.0
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
    :root { every colour role and every corner rung, pasted from the palette source }
    /* CHART_PALETTE:END */

    /* CHART_PALETTE_DARK:BEGIN system=<system> */
    @media (prefers-color-scheme: dark) {
      :root { every colour role again, pasted from the same source's dark values }
    }
    /* CHART_PALETTE_DARK:END */

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

The sentinels are how the corpus check finds the three regions it has an opinion about. Do not rename them, and use each pair once. The dark pair carries its own name for that reason: a second block under the light block's name would be the same sentinel twice, and then nothing can say which region a drifted value came from.

### The type scale, as six named roles

Five sizes were in use across the corpus before any document named them, which made the size of
a twenty-first template's axis tick a guess. The roles below record what the corpus already
does. They are a reading of the files rather than a proposal, so adopting them moved nothing.

The twenty-first template has since landed and took every size from this table, which is the
scale doing the one job it was published for. `type-scale` now holds it: the nine values live in
the palette source beside the corner ladder, for the same reason the ladder sits there, and a
size a file sets that is on neither list fails. Both routes are read, a `font-size` declared in
the stylesheet and one set as an attribute from the drawing code, because they are the same
decision wearing two syntaxes.

| Role | Size | What is set in it |
| --- | --- | --- |
| headline | 21px | The card headline, and nothing else |
| body | 15px | The page default every file sets on `body`. In the drawing it appears once, as the unit caption beside the one hero number a form prints |
| subtitle | 14px | The subtitle under the headline |
| label | 13px | The source line, the table, the table caption, and a category name inside the drawing where there is room for it |
| note | 12px | A notice, a hover card line, a value label, an axis name, and a key entry |
| tick | 11px | An axis tick, and a category name or key entry in a form too dense to carry the label size |

In-figure text steps down a rung as a form gets denser, which is why a category name appears at
13px in `bar-rows` and at 11px in `waterfall`. That is the scale working rather than a drift: the
rung is chosen for the space the text has, out of six rungs rather than out of the air.

Three sizes sit outside the scale, each on one form, and each is a departure with a reason
written beside it in the file. `progress-single` prints its hero figure at 56px and
`unit-ring` prints its ring total at 34px, because both are a single number that is the point
of the chart rather than a label on it. `calendar-grid` prints a month name at 10px, because a
year of days leaves a strip narrower than the tick size can sit in.

### The geometry defaults ride beside the palette block

Every file carries one `GEOMETRY DEFAULTS` block, immediately after its dark palette block. It
records the five measurements every file in the corpus shares: the 720-unit drawing frame, the
pan floor, the card width, the card padding and the page padding.

The block is a written record rather than an indirection, and that is forced rather than chosen.
Neither place these numbers are used can read a custom property. A `viewBox` attribute takes a
number, and rule 14's floor is read out of the stylesheet as a literal by the check that
enforces it, so a `min-width` resolving through a variable would fail the rule it satisfies.

What the block deliberately does not carry is the frame height or the four plot insets. Those
are per-form, because a left inset is sized to the widest label a form actually carries, and
copying one form's inset into another buys uniformity by cutting a label off. A form that
departs from a shared value says why beside the value it uses instead.

`geometry-block` asserts it. Every chart form and every proof sheet has to carry the block and
every copy has to match the others byte for byte. The set is derived from the two directories
rather than listed, so a new form joins it by existing rather than by being remembered, and a
corpus where the block had been scattered over some files would fail rather than pass a count.

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

A form is honest inside a documented shape, and two different things set that shape. The catalog
states how much data a form can carry: `scatter` past twenty points and `heat-matrix` past a
hundred cells each grow the frame and print one line naming the count and the ceiling. The palette
states how many colours a form has to give out, which is a harder ceiling because the file cannot
paint past it at all: `unit-ring`, `unit-grid`, `stacked-bars`, `treemap` and `stacked-area` each
draw the marks past that ceiling outside the encoding, in the rule colour, and print the same kind
of line. Seven forms in total.

The colour ceiling is worth stating separately, because reaching past it used to fail silently and
loudly at the same time. A class the stylesheet defines no fill for is not an unstyled mark; it is
a black one, because black is what an SVG paints when nothing says otherwise. So the group the
encoding could not carry came out as the strongest mark on the page, under a key that never named
it. Nothing in a green run said so.

A missing reading gets the same treatment: `bar-line-composed`, `daily-line`, `daily-range` and
`stacked-area` break the mark at the gap rather than drawing through it, and print how many
readings were left out.

A notice belongs in the figure when a reader looking at the picture would otherwise draw a
wrong conclusion from it, and it is not spread across every form for its own sake. A console
warning was the alternative and was rejected: the person the ceiling protects is reading a
chart, not a developer console.

### An empty data block says so, on every form and every delivery

All twenty-one forms and all six deliveries carry the same guard, marked `CHART_EMPTY_NOTICE`,
above their drawing code. When the data block holds nothing readable, the file prints one line in
the middle of the frame and draws nothing else.

The deliveries carried no guard at all until the ground for exempting them was read rather than
repeated. The exemption said a delivery carries the notice of the form it was built from, and none
of the six did. A delivery is also the copy somebody edits, which makes it the copy most likely to
be handed an empty block. The only file this does not reach is a proof sheet, whose data block is
the palette it draws rather than a reading it displays.

This is the clearest case the rule above describes rather than a new rule. An empty frame and a
chart whose values are all zero look identical, so a reader shown an empty box has no way to
tell which one they are holding. The notice tells them.

Readability is what the guard tests, not length. A block whose entries all carry values that are
not finite numbers has length and still has nothing to draw, so it fires. One row does not fire
it. That distinction matters more than it looks: a guard written against `length` alone passes an
array of nulls straight through to a drawing that has nothing to draw, and a guard that coerces
before it tests reads `null` as zero and calls it a reading. The corpus already had the right
test, in the three time forms that break a line at a gap, and this guard uses the same one.

The notice is a text element inside the drawing, so a screen reader reaches it exactly as it
reaches the ceiling notices. Its wording is fixed rather than assembled from the data block, so
nothing a reader pastes into the file can reach the picture as text.

`empty-notice` asserts it on every run, and it asserts more than the sentinel. The guard has to
sit below the data block it reads, because a guard above it tests a name that is not defined yet,
and it has to carry the labelled block and the break that let it stop the drawing. A guard that
prints the notice and then draws anyway prints it over an empty frame, which is the picture the
notice exists to prevent.

---

## 5. WHAT IT MAY DEPEND ON

Nothing.

No charting library, no web font, no icon set, no boundary data, no CDN of any kind. Marks are drawn as inline vector output by the file's own script.

This is stricter than it needs to be for the no-build-step property alone, and it is deliberate. A remote dependency keeps the file working only while the network is up and the host still exists, which turns "it opens on a double click" into "it opened on a double click in the office". The cost is real: each form is hand-drawn, and forms that genuinely need a layout engine, such as dense node-link networks, are out of the corpus rather than in it with a library attached.

The check enforces this by failing any remote `src` or `href`, any `@import` and any `fetch`, `XMLHttpRequest` or dynamic `import` in the file.

---

## 6. WHERE COLOUR COMES FROM

A palette block is the only place in the file where a colour value appears. Everything else refers to `var(--chart-…)`.

Take the block from the corpus check: when a template's block is missing or has drifted, the failure message prints the exact block to paste. That is the whole workflow, and it is why there is no generation step. The dark block works the same way and prints the same way.

### The second block answers a dark system

A file carries one palette block per theme and no more than two, each matched against its own projection of the palette source in both directions.

The second block sits inside the same style element, immediately after the light one, wrapped in a `prefers-color-scheme: dark` media query and its own sentinel pair. It redeclares the six colour roles and nothing else. The corner rungs stay in the light block alone, because a corner cannot differ between two grounds and a value copied into a second place is a value that can disagree with the first.

Nothing in the file switches themes. A delivered chart has no state to keep a preference in and no place to put a control, so the reader's operating system is the only signal, and a browser that never resolves the query paints the light block. That is also what makes the print path work: the query does not apply to print, so a chart printed from a dark browser goes onto paper the way it always did.

Two blocks double the surface a drift can hide in, which is the cost of the amendment and the reason the ceiling is two rather than open. The check counts the sentinels and fails a third block, a repeated pair and a value that disagrees with the source in either direction.

To show a colour value as text, read it at runtime with `getComputedStyle(document.documentElement).getPropertyValue('--chart-series-1')`. A hex typed into the markup is a second copy that drifts, and the check fails it.

Which system to pick, what the roles mean and where the ceilings are: `color-system.md`.

### The corner ladder rides in the same block

The light block carries one more kind of shared value: the five corner rungs, `--chart-radius-mark`
through `--chart-radius-card`. They are not colours and they live in their own object in the
palette source, but they are emitted into the same block because every file already carries that
block and the check already compares it against the source in both directions. They appear once
and only in that block, since a corner is the same corner on either ground.

A corner is never typed into a file. A stylesheet reaches a rung the way it reaches a colour, and
SVG marks take theirs from CSS too: `rx` is a geometry property, so `.box { rx: var(--chart-radius-mark); }`
rounds a mark without a number appearing in the drawing code. Where a mark rounds only one end,
the drawing builds a path and reads the rung once through `getComputedStyle`, because an `rx`
rounds all four corners and a bar that meets a baseline should not round the end that meets it.

A corner computed from a mark's own geometry is not a rung and stays in the drawing code. The
range bars in `daily-range.html` are rounded to half their own width, which is a lozenge rather
than a shared value.

---

## 7. THE SIXTEEN RULES

Every rule below is enforced, and three are enforced in part. The check name is what appears in the
corpus check output, so a failure points at the rule it broke.

The three partial ones are named here rather than left for a reader to discover, because "every
rule is enforced" is the sentence that makes a green run mean something and it was doing work it
had not earned. Rule 10's table half is a substring test that a commented-out attribute satisfies.
Rule 13's settle time is not asserted at all: reading a duration out of a stylesheet says what the
author wrote, not when the picture stopped moving, and only the two-render comparison observes
that. Rule 14 asserts that the affordances are declared and never measures a rendered page.
Section 9 carries the full account of what a run does not observe.

| # | Rule | Check | The failure it prevents |
| --- | --- | --- | --- |
| 1 | Complete document: doctype, `lang`, charset, viewport, a non-empty title | `document-shape` | Shipping a fragment as a deliverable |
| 2 | Identity tag present, lower-case kebab, equal to the filename stem | `identity` | A file nothing can index |
| 3 | Declared colour system exists in the palette source | `identity` | A template pointing at a system nobody defined |
| 4 | One palette block per theme, two at most, each matching its own projection of the source in both directions | `palette-block` | Silent theme drift, invisible in a diff |
| 5 | No colour literal outside the palette block | `colour-literals` | A palette edit that reaches half the file |
| 6 | No remote resource and no runtime fetch | `no-external` | A chart that stops working away from the network |
| 7 | Every inline script compiles | `script-parses` | A file that throws on open, which no reading catches |
| 8 | Exactly one data block, before the drawing code | `data-block` | An editor hunting for the numbers through the rendering |
| 9 | Element ids unique in the file | `unique-ids` | Two charts silently rendering into one container |
| 10 | Every `svg` carries `role="img"` and an `aria-labelledby` that resolves, and the file carries a `data-chart-table` | `accessibility` | A screen reader getting nothing at all from the chart |
| 11 | The four card parts, present and in order | `card-parts` | A chart that needs a caption to be understood |
| 12 | No randomness and no clock in rendering code, and two renders of one file settle to the same document | `determinism`, `settled-render` | Two renders of one file that disagree |
| 13 | A file that animates carries a `prefers-reduced-motion` fallback that removes the motion, the motion never repeats, and it settles within one second of first paint | `motion` | Motion shipped to a reader who asked their system for none, and a review that screenshots a chart still moving |
| 14 | The figure region can scroll sideways, and its drawing declares a `min-width` no wider than its own `viewBox`. The table region can scroll sideways too | `narrow-viewport` | A phone-width screen shrinking a chart until its labels sit on top of each other, or a wide table dragging the whole page sideways with it |
| 15 | No corner value outside the palette block: a stylesheet corner resolves through a rung, and the drawing code computes a corner rather than typing one | `radius` | Twenty files agreeing on one corner by coincidence, and the twenty-first quietly disagreeing |
| 16 | An indexed data class carries the palette token of its own index, the indices run from one without a gap, and they stop at the declared system's capacity | `series-mapping` | An encoding quietly reversed or shuffled, agreeing with its own legend and with nothing else |

Rule 4 used to say exactly one block, and it said so for a good reason: one block per file is one
place a colour can drift, and a diff shows it. A theme is the one thing that argument does not
survive, because a file that answers a dark system needs a second set of values and there is
nowhere else in a self-contained document to put them. So the ceiling moved from one to two and
stayed a ceiling. Two is every theme this corpus has, the check counts the regions rather than
trusting the count, and each region is matched against its own projection of the source in both
directions, which is the property the old rule was protecting.

Rule 13 carries a number, and the number is what makes rule 12 checkable. One second is the
settle time: every animation in the corpus finishes inside it, and the render check opens each
file with a three second budget, which is three times over. Without a stated settle time the two
rules argue with each other. Rule 12 wants a picture that does not change, rule 13 permits one
that changes for a while, and nobody can say when the second stopped being true. A named ceiling
turns that into arithmetic.

The three parts of rule 13 are one requirement, not three preferences. A fallback that shortens
the motion is not a fallback, because the reader who asked their system for no motion still gets
motion. An animation that repeats has no settled state at all, which breaks rule 12 by
construction rather than by accident. And a motion that outruns the render budget is caught
mid-move, which is the same failure as randomness: two renders disagree and nobody can tell which
one is the bug.

The settle time is a ceiling the file has to hold on its own, not a promise about the data it
shipped with. A stagger that adds a delay per mark would walk past one second the moment a reader
pastes thirty rows into the data block, so the delay is capped rather than accumulated. Nothing
about the ceiling depends on how many rows the file happens to carry.

Rule 14 is the one a desktop author never notices is missing. `width: 100%` on the drawing
looks correct at every size the author tries, and squashes the chart into illegibility at the
width most readers will open it on. A floor plus a pannable region is the whole fix, and it is
two declarations.

The rule reached half the card for a while, and the half it missed was the half that moved the
page. A card holds a drawing and a table, the drawing had somewhere to pan and the table did not,
so a table wider than the screen took the headline and the source line sideways with it. Measured
at 500 units, two files did that: the matrix form by 133 units and its delivery by 71. The table
region now pans the way the figure does. It declares no floor of its own, because a table already
has one: its cells cannot shrink below the text in them, which is the intrinsic minimum an SVG at
`width: 100%` does not have, and that is the whole reason the drawing needs a number and the table
does not.

Rule 15 is the one that only pays later. The corner was already identical in every form before
it was enforced, so the check found nothing wrong on the day it shipped. That is the point: the
uniformity held because twenty authors happened to agree, and a convention nothing asserts breaks
on the file nobody diffs closely.

Rule 10 is the one worth doing first rather than last. A title inside the vector output, an accessible role and a hidden data table cost almost nothing while a template is being written, and are close to unaffordable to retrofit across a whole corpus.

Rule 16 is the one that decides what the picture means, and it was the last one anything looked at.
Every other colour rule asks where a value came from. The palette block is matched against the
source in both directions, no literal may appear outside it, and the source itself is gated for
contrast and for the direction its ramp runs. A file that hands those tokens out in the wrong order
satisfies all of them. Reverse the five mappings in a matrix form and the darkest step now paints
the lowest reading; the legend reverses with it, because the legend is drawn from the same classes,
so the picture agrees with itself and disagrees with the data. What survives the permutation is
arithmetic rather than appearance, which is why the rule is stated as one: the number in the class
name and the number in the token it resolves to are the same number.

---

## 8. AUTHORING A NEW TEMPLATE

1. Find the question in `catalog.md`. If no row answers it, that is a gap to report rather than a chart to improvise.
2. Copy `assets/color/palette-sheet-neutral.html` to `assets/templates/<id>.html`.
3. Set the identity tag and the title. The id, the filename stem and the catalog row all carry the same string.
4. Choose the colour system, and paste both of its palette blocks from the corpus check output. The check prints the light block and the dark one, each against the block it expected to find.
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
- **It does not watch the motion.** With `--render` it opens each file twice after the settle time and confirms the two documents are identical, which catches a picture that is still changing when the review screenshots it. It does not see the animation itself, so whether the wipe reads as an entrance is a review question.
- **It does not measure a narrow screen.** Rule 14 is asserted from the stylesheet, not from a rendered page, because a headless browser hands back the DOM and the DOM does not say whether the page overflowed. The check proves both pan affordances are declared and that the drawing's floor is not above its natural width. Whether the chart is legible at that floor is a review question, and the floor itself is a judgement nobody has measured per form. A page that overflows sideways is measurable, but only by injecting a script into a copy of the file and reading `scrollWidth` back, which is a review step rather than a corpus check.
- **It does not judge either theme by eye.** With `--render` it opens each file with the colour scheme pinned light, twice, and again with the scheme pinned dark, and it asserts that the dark open paints a different picture from the light one. That proves the second block reaches the paint rather than merely sitting in the file, which no reading of the text can prove. It says nothing about whether the dark values are the right ones, and it forces the preference with a browser flag rather than reading an operating system, so what a particular reader's machine resolves is still a question for a real browser.
- **It does not point at anything.** Both opens are made with no pointer input, which is exactly what makes them a fair test of the settled picture and exactly what leaves most of section 10 to be walked by hand. Whether a card opens on the right mark, whether it flips at an edge and whether a key entry latches are all read by a person. What a pointer-free run can see is the state a file ships in, and that half is now asserted: `interaction-state` fails a drawing that opens already dimmed or with a card already filled, neither of which a settled comparison would catch, because both opens agree with each other exactly as a correct file's do.

---

## 10. WHAT A FILE MAY DO WITH A POINTER

A chart answers a pointer. Thirteen forms do, counting all three registers rather than the hover card alone, and the eight that do not are the ones whose marks already print their own value, where a card would repeat what the reader is looking at.

Three of the rules below are now checked and the rest are still a register, which is a rule written down before anything asserts it. The split is marked here so nobody reads a green run as agreement with the whole section.

`interaction-hygiene` requires the hygiene line in any file whose markup declares one of the three registers, and separately fails an unconditional `outline: none` on a focus and any `user-select: none`, which are the two ways the line could be widened into taking something away from a reader. `interaction-state` requires the dim attribute to ship empty and the tooltip group to ship without content. `number-format` fails any host-locale formatter anywhere in the corpus, and requires a file carrying a hover card to define a formatter of its own.

Everything else here is unasserted. What a handler may do, where a card flips, whether a figure inside a card is also in the table, and whether a selection latches are all read by a person.

### The three registers

| Attribute | Where it goes | What it means |
| --- | --- | --- |
| `data-chart-tooltip` | a group inside the drawing | The form carries a hover card. The group is declared in the markup, empty, and the drawing code fills it and raises it above the marks |
| `data-chart-legend` | a group inside the drawing | The form carries its key inside the figure. Each entry is a button, because the key is also the control for the dim |
| `data-chart-dim` | the `svg` element | The form can hold one series against the rest. The attribute is empty until a reader asks, and the series index fills it |

A form that gains any of the three also carries one line of interaction hygiene: `:focus:not(:focus-visible) { outline: none; }`. That drops the focus ring for a reader who clicked and keeps it for a reader who tabbed. Text stays selectable. A delivered chart is a document, and the numbers in it are meant to be copied out.

### What a handler may do

- Show something that is already in the document, and hide it again.
- Change opacity, so one series can be held against the rest.
- Hold a selection until the reader clears it.
- Measure the text it has just written, so a card is sized to fit rather than to a guess.

### What a handler may not do

- Read the clock or a random source. Rule 12 bans both, and interaction is not an exemption from it: a reader choosing to look closer is not the picture changing on its own.
- Change what the file paints before anyone touches it. Two opens with no pointer input have to agree, and a file that gained a pointer has to paint what it painted before it gained one.
- Move a mark, a label or a printed value. The card floats above the drawing rather than rearranging it.
- Print a figure the table below the chart does not also carry. The table is the complete reading and stays the accessibility floor, so nothing may exist only inside a card.
- Format a number any way but through the file's own formatter. A locale-dependent one makes a delivered file read differently on the machine that opens it, which is the failure the fixed-comma formatter exists to prevent.
- Take a focus ring away from anything a reader can reach with a keyboard, and never add a control a pointer can use that a keyboard cannot.

---

## 11. RELATED DOCUMENTS

| Document | Purpose |
| --- | --- |
| [`color-system.md`](./color-system.md) | The three systems, their roles and their gates |
| [`catalog.md`](./catalog.md) | The index from a question to a chart form |
| [`../scripts/README.md`](../scripts/README.md) | How to run the corpus check and how to prove it can fail |
| [`../assets/color/palette-sheet-neutral.html`](../assets/color/palette-sheet-neutral.html) | The working skeleton to copy |
