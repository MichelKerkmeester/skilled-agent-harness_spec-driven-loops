# Manual review — sk-design-diagram templates and examples

**Date:** 2026-09-11
**Model:** Opus 5 (`claude-opus-5`)
**Scope:** 4 templates + 34 examples = 38 files, each read in full and rendered fresh.

**How I rendered.** The shipped renderer ran clean:

```
node .opencode/skills/sk-design/shared/scripts/render-screenshots.cjs \
  .opencode/skills/sk-design/sk-design-diagram/assets <render-dir>
  rendered 39, failed 0
RESULT: PASSED
```

That renderer takes a fixed 1280×900 viewport shot (`--window-size=1280,900`, no full-page flag),
so any page taller than 900 px is cut off in its output — `template-full`, `sequence-oauth`,
`sequence-oauth-full`, `quadrant-consultant` and `loop-terminal` all lose their bottom sections.
I therefore took a second pass myself at 1400×1700 into `render/tall/` and judged tall files from
that. Both sets were viewed; verdicts below come from what I actually looked at, plus the source.
Every one of the 38 PNGs was viewed — no row below is a guess.

**Checker result line** (`cd .opencode/skills/sk-design/sk-design-diagram && node scripts/check-diagram-corpus.cjs | tail -5`):

```
  + unique-ids: 181 assertion(s), 0 failure(s)

Summary: errors: 0

RESULT: PASSED
```

The checker's ten rules are `accessible-svg`, `catalog-bidirectional`, `derivation-gates`,
`grid-4px`, `marker-vocabulary`, `metadata`, `no-external`, `node-budget`,
`orthogonal-connectors`, `unique-ids`. Nothing below duplicates those. Grid alignment, marker
vocabulary, id uniqueness, node budgets, the catalog round-trip and the recorded palette gates are
theirs and are not re-reported here.

---

## 1. Per-file verdicts

| file | skin | verdict | one-line summary |
|---|---|---|---|
| `templates/template-dark.html` | dark | P3 | Renders correctly; two palette comments still call a cool palette "warm", and `arrow-link` hard-codes a hex the sentinel block never declares. |
| `templates/template-full.html` | light | **P1** | The last legend row is drawn below the `viewBox` and vanishes; the legend also sits inside the region boundary its own comment says it must stay outside of. |
| `templates/template-terminal.html` | terminal | P2 | Clean chrome, but the `h1::before` "#" is `--color-soft` text at 2.76:1, contradicting the record's stated reason for exempting `terminal-soft`. |
| `templates/template.html` | light | P3 | Renders correctly; declares four palette roles, then paints markers and the paper rect from literals, including a `link` blue the block never declares. |
| `examples/example-architecture.html` | light | P2 | The Astro node overdraws the left edge of both `READ MDX` and `QUERY`; the `RESP` return arrow renders as two disconnected fragments. |
| `examples/example-bar.html` | light | PASS | Gridlines, scale, focal bar and legend all check out; only the zero baseline is unlabelled. |
| `examples/example-data-flow.html` | light | P2 | Four series-palette hues in a non-chart type, and white chip text on the mustard chip measures 2.70:1. |
| `examples/example-dp-integration.html` | light | P2 | The Centralized-logging connector is labelled `AUTH` and is severed by the identity bar's mask; two extra hues and accent on almost every edge erase the focal signal. |
| `examples/example-dp-security-matrix.html` | light | P2 | Admin and Read cells are the same grey to the eye, so the legend's colour key is unusable; `None` values sit in `soft` at 3.48:1. |
| `examples/example-er.html` | light | P2 | The Tag→ArticleTag relationship line is 32 px long and entirely covered by its own two cardinality masks — it renders as nothing. |
| `examples/example-flowchart.html` | light | P3 | Reads cleanly end to end; the whole figure sits in the right 60% of the canvas with the legend spanning full width under it. |
| `examples/example-gantt.html` | light | P2 | The focal `Design review` bar breaks 4 px through its own phase zone, and a chart titled "12-week plan" carries no week axis. |
| `examples/example-high-level.html` | light | P2 | All four source connectors run along the Kubernetes boundary's left border; the write-back arrowhead is opaque muted on a 30%-alpha shaft. |
| `examples/example-import-drawio.html` | light | P3 | Legible, but two dashed paths share one band with loosely-placed labels, and the legend switches to all-caps mono unlike the rest of the corpus. |
| `examples/example-import-mermaid.html` | light | P2 | The Postgres node straddles the `CORE SERVICES` boundary — 32 px inside, 24 px outside — so its containment is ambiguous. |
| `examples/example-it-state.html` | light | P2 | `On-prem RDBMS` is the only green thing on the page and has no legend key; every zone-label mask is ~30 px wider than its label. |
| `examples/example-layers.html` | light | P2 | Five layers render as four bands: L3's fill is the page paper, and L1/L2 share one fill with no divider. |
| `examples/example-line.html` | light | P3 | Reads well; the plot frame runs 48 px past the last data point, and the focal area fill washes over the two non-focal series. |
| `examples/example-loop-terminal.html` | terminal | P3 | Terminal skin is correct throughout; no legend, and the white hub outweighs the accent node as the visual focus. |
| `examples/example-loop.html` | light | P3 | Same two points as the terminal variant, plus four of six hub spokes carry no label while two do. |
| `examples/example-medallion.html` | light | P2 | The catalog row promises "under which access policies"; the cards carry Tool, Format, Writer and an example, and no policy. |
| `examples/example-nested.html` | light | P3 | The annotation leader terminates on the accent box's top border rather than on its content; all five label tabs run long. |
| `examples/example-org-chart.html` | light | P2 | The legend keys a "needs setup / gap" node treatment that no node in the chart uses — it matches only the prose note bar. |
| `examples/example-process.html` | light | P2 | Five series-palette hues in a non-chart type, the most colourful file in the corpus; white-on-mustard chip text at 2.70:1. |
| `examples/example-pyramid.html` | light | P2 | The three cadence figures — the quantitative payload — are `soft` on paper at 3.48:1 and read as the faintest text on the page. |
| `examples/example-quadrant-consultant.html` | light | P2 | The focal tint matches neither the quadrant nor the card it highlights, overrunning the horizontal axis by 100 px. |
| `examples/example-quadrant.html` | light | PASS | Axes centred, tint exactly matches its quadrant, one accent item, legend complete. |
| `examples/example-radar.html` | light | P2 | Four stacked 0.18 fills bury the 0.10 grid rings and reduce three of four series to a single brown blend. |
| `examples/example-scatter.html` | light | P2 | The `DEPLOYS PER WEEK` axis title is placed inside the legend row, where it reads as a fourth legend entry. |
| `examples/example-sequence-oauth-dark.html` | dark | P2 | No light-skin leakage — but it is listed as `untokenized` while carrying the recorded dark skin exactly, which exempts it from the only gate that would catch drift. |
| `examples/example-sequence-oauth-full.html` | light | P2 | The ALT fragment loses figure/ground inside two nested container frames; the fragment's own fill is indistinguishable from the panel behind it. |
| `examples/example-sequence-oauth.html` | light | P3 | Correct and readable; four of six message labels get a paper mask and two do not, inside the same grey fragment. |
| `examples/example-sequence.html` | light | P3 | Clean; `200 · EDGE-CACHED` reads as a hit on a diagram titled "cold cache", and the Analytics actor has no activation bar. |
| `examples/example-state.html` | light | P2 | The catalog row promises "what guards each transition"; the diagram labels events only, with no guard conditions anywhere. |
| `examples/example-swimlane.html` | light | P2 | The revision-loop connector is 32 px long with its label mask over the middle, so the dash pattern the legend keys is not visible. |
| `examples/example-timeline.html` | light | **P1** | The caption says spacing is proportional to elapsed time; it ranges 52–70 px/month, and January 2026 is marked at two different x positions. |
| `examples/example-tree.html` | light | P2 | `polish` and `critique` share an edge and read as one double-wide box; every other sibling pair has a 20 px gap. |
| `examples/example-venn.html` | light | P2 | The Feasible and Viable circles each cut through their own sublabel text; three peer sets are drawn in three different greys. |

---

## 2. Findings

### F1 — `templates/template-full.html:359` — P1 — legend row drawn outside the `viewBox`

The SVG is `viewBox="0 0 1000 700"` (`:181`). The final legend entry is a swatch at
`y="698" height="10"` (bottom edge 708) with its label baseline at `y="707"` (`:360`). Both are
below 700. In the render the "Security group" swatch shows as a 2 px sliver and its label is gone
entirely — a legend row silently disappears, and the security-group boundary drawn at `:289` has
no key.

**Fix:** move the whole legend block up by 20 (`y="678"`/`y="687"` on `:359`–`:360`), or raise the
`viewBox` to `0 0 1000 720`.

### F2 — `examples/example-timeline.html:90,96,102,109,116` — P1 — spacing is not proportional, and January 2026 is marked twice

The legend states *"Spacing is proportional to real elapsed time."* The five event `cx` values are
100 (Feb '25), 240 (Apr '25), 500 (Sep '25), 740 (Jan '26), 900 (Apr '26). Months elapsed: 0, 2, 7,
11, 14. That gives **70.0, 52.0, 60.0 and 53.3 px per month** — the first gap is 35% wider than the
second. A reader following the caption's instruction reads Feb→Apr as longer than it is.

Separately, `:82` puts a `JAN '26` year-boundary tick at `x=680` while the Jan 2026 event sits at
`x=740` (`:109`). The same month is drawn in two places 60 px apart.

**Fix:** put the events on one scale — at 800 px for 14 months (57.14 px/month from `x=100`):
`cx` = 100, 214, 500, 729, 900; and set the year tick to the same scale
(Jan '26 = month 11 → `x="729"` on `:82`, matching the event).

### F3 — `templates/template-full.html:332` — P2 — legend sits inside the boundary its own comment excludes it from

The comment at `:328`–`:331` reads *"LEGEND — OUTSIDE all boundary boxes. Region boundary ends at
y=662 → legend starts at y=682."* The boundary arithmetic is right (`:264` is
`y="38" height="624"` → 662), but the legend actually starts at `y="544"` (`:332`) and the rows run
to 708. Legend rows 1–7 are inside the dashed `AWS REGION` box, and rows 8–10 straddle its bottom
edge. In the render the legend visibly reads as part of the AWS region.

**Fix:** the same move as F1 fixes both — start the legend at `y="682"` as the comment specifies and
extend the `viewBox` to hold it.

### F4 — `examples/example-er.html:79` — P2 — a relationship line renders as nothing

`<line x1="880" y1="248" x2="880" y2="280">` is the Tag→ArticleTag relationship: 32 px tall. Its two
cardinality masks are `y="252" height="12"` (`:94`) and `y="268" height="12"` (`:97`), both opaque
`#f5f5f5`, covering y 252–280. Only y 248–252 of the line survives. In the render there is no visible
connector between Tag and ArticleTag at all — just a stacked "1" and "N" floating in the gap.

**Fix:** lengthen the gap and offset the labels — set the line to `y1="248" y2="288"`, move the
ArticleTag box down to `y="288"`, and shift both masks to `x="888"` so they sit beside the line
rather than on it.

### F5 — `examples/example-architecture.html:105,108` — P2 — a node overdraws two arrow labels

The `READ MDX` label mask is `x="564" width="60"` (564–624) and `QUERY` is `x="568" width="44"`
(568–612). The Astro Origin node is `x="416" width="160"` (416–576) and is drawn later, at `:129`.
Both label masks are therefore overpainted for their first 8–12 px. In the render the leading
glyph of each label is cut by the Astro box's right border.

**Fix:** move both labels clear of the node — `x="584" width="60"` / text `x="614"` on `:105`–`:106`,
and `x="584" width="44"` / text `x="606"` on `:108`–`:109`.

### F6 — `examples/example-architecture.html:93` — P2 — the return arrow renders as two disconnected pieces

The dashed return is `M 220,288 H 168` with the arrowhead at x=168. The `RESP` label mask at
`:99` is `x="172" width="32" y="278" height="12"` — its lower edge crosses y=288, erasing the shaft
from 172 to 204. What renders is a 4 px stub with an arrowhead, a white gap, then a short dash run.
It does not read as one arrow.

**Fix:** raise the mask off the line — `y="272"` on `:99` and text `y="281"` on `:100`, matching the
`HTTPS` label above which sits clear of its own line.

### F7 — `examples/example-gantt.html:43` — P2 — the focal bar breaks its own phase zone

Zone 2 is `y="172" height="120"` → 172–292. The `Design review` bar is `y="272" height="24"` →
272–296 (`:106`–`:107`). The accent bar's bottom 4 px is outside the zone, and in the render the bar
visibly crosses the zone's bottom border. The comment at `:42` states the arithmetic that produces
it. For contrast, zone 1 ends flush at 156 and zone 3 clears its last bar by 4 px — three different
bottom paddings across three zones.

**Fix:** `height="132"` on `:43` (zone 2 ends at 304), matching zone 3's 4 px clearance.

### F8 — `examples/example-gantt.html:31-41` — P2 — a twelve-week plan with no week axis

The source comments work in weeks (`Week x = 200 + i*63`, `W1-W3`, `W8-W9`), and the title is
"12-week plan". The rendered time axis carries only `April`, `May`, `June`. Nine unlabelled
hairlines mark the week boundaries. A reader cannot answer the catalog question — "Which tasks and
phases are active when" — beyond the month.

**Fix:** add a week-number row under the month headers, e.g. `<text>` at `y="66"` for each
`x = 200 + i*63 + 31`, `W1`…`W12`, at 7 px mono in `--color-soft`'s structural role.

### F9 — `examples/example-layers.html:98,105,112` — P2 — five layers render as four bands

L3's band is `fill="#f5f5f5"` (`:98`) — exactly the page paper, so it has no fill and no border and
reads as a gap in the stack. L2 (`:105`) and L1 (`:112`) are both `fill="#ececec"` with no stroke and
share an edge at y=336, so they merge into one 128 px grey block. In the render, "SDK / client" and
"Model weights" sit inside a single uninterrupted rectangle. The type's whole job is "which
abstraction levels stack and in what order".

**Fix:** give every band the same hairline — add
`stroke="rgba(45,49,66,0.12)" stroke-width="1"` to `:84`, `:98`, `:105` and `:112` — and step the
two bottom fills (`#ececec` on `:105`, `#e4e4e4` on `:112`).

### F10 — `examples/example-tree.html:127,133` — P2 — two sibling nodes share an edge

`polish` is `x="60" width="160"` (60–220) and `critique` is `x="220" width="160"` (220–380). They
touch. The next pair, `review` at `x="400"` and its sibling, has a 20 px gap; so does the gap
between `critique` and `review`. In the render `polish`/`critique` read as one double-wide box with
an internal rule rather than two leaves.

**Fix:** `x="40"` on `:127` and `:128` (and shift the `polish` text by −20), giving the pair the same
20 px gap every other pair has.

### F11 — `examples/example-venn.html:98,102` — P2 — circle outlines cut through their own sublabels

The Feasible circle is `cx="428" cy="320" r="140"` (`:80`). At the sublabel baseline y=402 its left
arc sits at x = 428 − √(140²−82²) = **314.5**. `WE CAN BUILD IT` is centred at x=340, 9 px mono with
0.14em tracking ≈ 100 px wide, spanning 290–390. The arc crosses it between "WE" and "CAN". The
mirror case holds for Viable: right arc at x=685.5 against `BUSINESS SUSTAINS` spanning 603–717
(`:82`, `:102`).

**Fix:** pull both sublabels inward — `x="360"` on `:97`–`:98` and `x="640"` on `:101`–`:102` — or add
a paper mask rect behind each, as every other file in the corpus does for text on a line.

### F12 — `examples/example-scatter.html:39` — P2 — the axis title is inside the legend row

`DEPLOYS PER WEEK` is at `y="492"`. `LEGEND` is at `y="478"` (`:128`) and the legend items sit
below it. The x-axis title therefore renders between the legend heading and the legend entries, at
the same size and colour as them. In the render it reads as a fourth legend item sitting beside
"Trend".

**Fix:** `y="452"` on `:39` — under the x tick labels and above the legend rule — and keep it
centred on the plot (`x="520"` is already the plot centre).

### F13 — `examples/example-import-mermaid.html:58` — P2 — a node straddles its containment boundary

The `CORE SERVICES` zone is `x="288" y="80" width="632" height="336"` → bottom edge y=416 (`:33`).
The Postgres node is `y="384" height="56"` → 384–440. It is 32 px inside the zone and 24 px outside.
Containment is the semantic claim a zone makes; a node cut in half by the boundary answers the
question neither way, and this is the most visible thing in the render.

**Fix:** `y="344"` on `:58` (and its two text baselines to 368/384), leaving 16 px clearance inside
the zone.

### F14 — `examples/example-swimlane.html:97` — P2 — the legend keys a dash pattern the drawing does not show

The revision connector is `y1="224" y2="256"` — 32 px — with `stroke-dasharray="5,4"`. Its `REVISE`
label mask covers the middle. What survives is roughly one dash at each end, so the connector does
not read as dashed. The legend at `:164` promises a "Revision loop" with a visible dash. That legend
swatch also uses `stroke-dasharray="4,3"`, a different pattern from the connector's `5,4`.

**Fix:** lengthen the connector (`y1="220" y2="268"`, moving `Polish copy` down 12) and set the
legend swatch to `stroke-dasharray="5,4"` on `:164`.

### F15 — `examples/example-org-chart.html:44` — P2 — a legend key with no instance in the drawing

The legend's third entry is `needs setup / gap`, keyed to `stroke="#7a8399" stroke-dasharray="4,4"`.
The only element in the SVG with that treatment is the prose note bar at `:42`. No node is marked.
The subtitle claims the map "makes the front door, owners, invocation paths, and **setup gaps**
visible"; the gaps are asserted in a sentence, not drawn.

**Fix:** apply the dashed treatment to the specialists the note names (the ones "without Slack
bots"), or drop the legend entry and the claim from the subtitle.

### F16 — `examples/example-dp-integration.html:47,50` — P2 — the logging connector is labelled `AUTH` and is severed

`:47` draws a dashed accent connector from `y=524` (the Centralized-logging bar's top) up to the
platform zone at `y=408`. Logging is not an auth path, yet the only two labels in that band are both
`AUTH` (`:50`), placed at x=564 and x=652 while the two connectors are at x=592 and x=624 — each
label sits between the two lines, so proximity does not resolve which belongs to which.

The same connector is then cut in two: the identity bar at `:70` draws an opaque
`class="node-mask"` paper rect over y 460–516, erasing the shaft. The comment at `:46` says
*"Dashed transit crosses the identity footer without treating it as an endpoint"* — the render shows
it stopping at the bar and resuming as an 8 px stub below it.

**Fix:** label the logging connector for what it carries (`AUDIT`, matching the bar's own
"audit trail" sublabel) and centre each label on its line (`x="592"` and `x="624"`); and draw the
transit line *after* the identity bar so it crosses on top.

### F17 — `examples/example-dp-security-matrix.html:19-20` — P2 — the colour key cannot be used, and `None` is below the text gate

The four cell fills are `.full rgba(45,49,66,.08)`, `.write #fff`, `.read rgba(79,93,117,.08)`,
`.none #f5f5f5` (`:19`). Admin and Read differ only in hue at 8% alpha and are the same grey to the
eye; None is the page paper. The legend offers a five-swatch colour key that a reader cannot apply —
only the words in the cells distinguish the states.

Separately `.value.none-text{fill:#7a8399}` (`:20`) puts the `None` permission value in `soft` at
10 px. `derivation-record.md` §5 records `soft` at **3.48:1 on paper** and states it "May not carry
sublabel or eyebrow text." Here it carries the matrix's data.

**Fix:** step the fills so the four states are separable —
`.full rgba(45,49,66,.16)`, `.read rgba(79,93,117,.09)`, `.none` with a `rgba(45,49,66,.05)`
diagonal or a dash — and set `.value.none-text{fill:#4f5d75}` to clear the 4.5:1 gate.

### F18 — `examples/example-high-level.html:110-113` — P2 — four connectors are drawn along the container border

All four source connectors turn vertical at `x=164` — `Q 164,92 164,100 V 112`, `V 144`, `V 160`,
`V 176`. The Kubernetes boundary rect at `:100` is `x="164"`. The connectors therefore run on top of
the container's left border for up to 152 px, in a darker stroke (`#4f5d75`) than the border
(`rgba(45,49,66,0.18)`). In the render this shows as a darkened segment of the boundary that the
four arrows feed into; the arrows are not separable from the container edge.

**Fix:** move the shared riser inboard — replace `164` with `172` in the four `Q`/`V` commands on
`:110`–`:113` — so it reads as a bus inside the cluster rather than as the cluster's own border.

### F19 — `examples/example-high-level.html:129` — P2 — an arrowhead darker than the line it terminates

`<line ... stroke="rgba(45,49,66,0.30)" stroke-dasharray="4,3" marker-end="url(#arrow)"/>` — the
`#arrow` marker's polygon is `fill="#4f5d75"` (`:63`), fully opaque. SVG markers do not inherit the
referencing element's stroke, so the write-back arrow renders as a solid dark triangle on a pale
dashed stem. Visible in the render as a mismatched head.

**Fix:** either match the shaft to the marker (`stroke="#4f5d75" opacity="0.45"` on the whole line)
or add a faded marker to `<defs>` and reference it.

### F20 — `examples/example-radar.html:74-78` vs `:103-110` — P2 — the grid is buried and three of four series are unreadable

The five concentric rings are drawn at `rgba(45,49,66,0.10)` (`:74`–`:77`). Four series polygons then
fill over them at 0.18 alpha each (`:103`, `:105`, `:107`, `:110`). Where three or four overlap the
union approaches 0.55 and the hues blend to a single brown. In the render the `2`, `4` and `6` tick
labels sit on that blend with no visible ring behind them, and only MinIO — accent stroke at 1.8,
with point markers — is traceable. Amazon S3, Ceph and Google Cloud Storage cannot be read off the
chart, which is the whole catalog question.

**Fix:** drop the three non-focal fills to `0.08` (keep strokes at full colour), raise the rings to
`rgba(45,49,66,0.18)`, and draw the rings *after* the fills so the scale stays readable.

### F21 — `examples/example-quadrant-consultant.html:77` — P2 — the focal tint matches nothing it is meant to highlight

The tint is `x="500" y="80" width="400" height="220"` → 500–900, 80–300. The axes are `x 200→800` at
`y=300` and `x=500, y 60→540` (`:113`, `:116`), so the upper-right quadrant is 500–800, 60–300. The
tint overruns the horizontal axis by **100 px** and starts 20 px below the quadrant top. Against the
card it highlights (`x="560" width="300" y="120" height="160"`, `:89`) its padding is 60 left, 40
right, 40 top, 20 bottom — four different values. In the render it reads as a misplaced block ending
in empty space past the `AI` axis label.

**Fix:** `x="500" y="60" width="300" height="240"` on `:77`, matching the quadrant exactly.

### F22 — `examples/example-pyramid.html:82,88,94` — P2 — the quantitative payload is below the text gate

`~240/yr`, `~48/yr` and `~4/yr` are `fill="#7a8399"` at 9 px mono. `soft` measures **3.48:1** on
paper — below the 4.5:1 text gate — and `derivation-record.md` §5 records the departure with
"structural use only; may not carry sublabel or eyebrow text." These three labels carry the cadence
data the whole diagram is about, and in the render they are the faintest text on the page.

**Fix:** `fill="#4f5d75"` on `:82`, `:88` and `:94`.

### F23 — `examples/example-data-flow.html:88-89` / `examples/example-process.html` — P2 — white chip text at 2.70:1

The data-type chips use the series palette as fills with `.chip-text{fill:#fff}`. Measured against
white: `#b8915a` (TB) **2.70:1**, `#7c8f6f` (LS) **3.49:1**, `#5e7a9b` (DB) **4.44:1**,
`#9c6b50` (FL) 4.53:1. TB fails even the 3.0:1 mark gate; three of four fail the 4.5:1 text gate.
The corpus check's `derivation-gates` only measures recorded roles against `paper`, so it never sees
white-on-series. In both renders the `TB` chips are visibly the mushiest labels on the page.

**Fix:** darken the two failing chips for text use — `#8a6a3c` for TB and `#5c6b51` for LS — or drop
the chip text to `--color-paper` on a darkened chip.

### F24 — `examples/example-it-state.html:34,97` — P2 — an unkeyed third hue

`.node-name.survivor{fill:#7c8f6f}` puts `On-prem RDBMS` in series-1 sage. It is the only green
element in the file and the legend (`:119`–`:123`) has four entries, none of which mention it. A
reader sees one node coloured differently from every other and has no way to learn why.

**Fix:** add a legend entry for the survivor state, or render it in `--color-ink` like every other
node name and carry the distinction in the existing `external`/`bottleneck` vocabulary.

### F25 — `examples/example-it-state.html:64,67,70` — P2 — zone-label masks run ~30 px long

`COLLECTION`'s mask is `width="92"` for a label that measures ≈59 px at 8 px mono with 0.14em
tracking; `PROCESSING` the same; `DISSEMINATION` is `width="116"` for ≈77 px. Each zone's top border
therefore has a visible white break extending ~30 px past the end of its label, which reads as a gap
in the border rather than as a label interrupting it. `example-nested.html` has the same pattern on
all five of its level tabs.

**Fix:** `width="68"` on `:64` and `:67`, `width="86"` on `:70` — label width plus 8 px.

### F26 — `examples/example-sequence-oauth-dark.html` — P2 — marked `untokenized` while carrying the standard dark skin

`diagram-palette.json` lists this file under `examples.untokenized`, and `derivation-record.md` §1
defines that kind as "a file that carries its own fixed skin and is exempt from this record." I
inventoried every colour literal in the file. All eight skin roles are the recorded dark values
exactly: paper `#2d3142`, ink `#f5f5f5`, muted `#bfc0c0`, soft `#8e98ac`, rule
`rgba(245,245,245,0.12)`, accent `#f08a59`, accent-tint `rgba(240,138,89,0.10)`, link `#6a95d8`.
There is no own skin and nothing to exempt — but the exemption removes the one file that exercises
the dark palette from `derivation-gates`, so a future drift in the dark skin would go uncaught here.

**Fix:** delete the `untokenized` entry from `assets/color/diagram-palette.json` and the sentence
naming it in `derivation-record.md` §1, and let the file gate as a dark-skin example.

### F27 — `examples/example-sequence-oauth-full.html` — P2 — the ALT fragment loses figure/ground

The page nests three backgrounds: an outer `paper-2` container, an inner dotted-paper panel 25 px
inside it, and then the ALT fragment's own grey fill. Against the panel the fragment's fill is
within a few percent, so its left and right edges are barely visible and the fragment reads as an
outline only. In the standalone `example-sequence-oauth.html` the same fragment separates from paper
cleanly — the full variant loses the distinction it is meant to demonstrate. The two concentric
container frames also read as a picture-frame border.

**Fix:** drop one container level (the outer frame, keeping the inner panel), and darken the
fragment fill one step against the panel it now sits on.

### F28 — `examples/example-medallion.html` — P2 — the diagram does not answer its catalog row

The catalog question is *"Which storage tiers exist, at which quality levels and under which access
policies"*. Each tier card carries Tool, Format, Writer and an e-commerce example. There is no
access-policy field anywhere — `Writer: Data Engineer` is the closest thing, and it names one role,
not a policy. The first two clauses are answered well; the third is not answered at all.

**Fix:** add a fourth card field (`Access` — e.g. "platform-read · eng-write") to each of the five
tiers, or narrow the catalog question to what the diagram shows.

### F29 — `examples/example-state.html` — P2 — the diagram does not answer its catalog row

The catalog question is *"Which states exist, what moves between them and **what guards each
transition**"*. The five transitions are labelled `SUBMIT`, `APPROVE`, `REJECT · REVISE`, `EXPIRE`,
`PURGE` — all event names. No guard condition appears anywhere; there is no `[…]` notation in the
file. Two of three clauses are answered.

**Fix:** add a guard beneath each event label in the established `[condition]` form — e.g.
`APPROVE [reviewer ≠ author]`, `EXPIRE [now > published_at + ttl]` — or narrow the catalog question.

### F30 — `templates/template-terminal.html:107-110` — P2 — `terminal-soft` carries text

`h1::before { content: "# "; color: var(--color-soft); }` renders a 33 px bold glyph in
`--color-soft` (`#5c5c5c`) on `--color-paper` (`#141414`). I measured it at **2.76:1**, matching the
figure `derivation-record.md` §5 records — and that record's stated reason for not applying the text
gate is "Decoration: inactive dots and spokes. **Never carries text**, so the text gate does not
apply." The template's own title contradicts the sentence that exempts the token. 2.76:1 is below
the 3.0:1 large-text bar as well.

**Fix:** `color: var(--color-muted)` on `:109` (`#9a9a9a`, 5.4:1), or amend the record's departure
note to say the token also carries the decorative title sigil at a stated ratio.

### F31 — `templates/template-dark.html:12-13` — P3 — stale "warm" palette comments

`--color-paper: #2d3142; /* deep warm charcoal */` and `--color-ink: #f5f5f5; /* warm off-white */`.
`#2d3142` is a cool blue-grey (hue ≈228°) and `#f5f5f5` is exactly neutral (R=G=B). `style-guide.md`
§1 calls the default "a cool editorial palette", the record names these "jet-black" and
"white-smoke", and `style-guide.md` §1 already notes that "the warm `rgba(28,25,23, X)` spelling this
section once described appears in none of the examples." These two comments are the last residue of
that removed description.

**Fix:** `/* jet-black */` and `/* white-smoke */` on `:12`–`:13`, matching `template.html:12-15`.

### F32 — `templates/template.html:70` and `templates/template-dark.html:70` — P3 — the `link` role is outside the sentinel block

Both templates declare four roles inside `DIAGRAM_PALETTE:BEGIN…END` (paper, ink, muted, accent) and
then hard-code a fifth in the marker defs: `arrow-link` is `fill="#2e5aa8"` light and `#6a95d8` dark.
`link` is a recorded primary in both skins. Repainting the sentinel block — the documented way to
re-skin — leaves every HTTP/API arrow the stock blue.

`template-full.html` does declare `--color-link` (`:23`) but then hard-codes `#2e5aa8` in the marker
(`:205`) and in six drawing elements, so the declared token is dead there too, along with
`--color-rule-solid` (`:20`) and `--color-accent-tint` (`:22`), which are referenced nowhere in the
file.

**Fix:** add `--color-link` to the light and dark sentinel blocks, and use `fill="var(--color-link)"`
in the markers — `example-dp-integration.html:22-24` already does exactly this and renders correctly.

### F33 — `examples/example-nested.html` — P3 — the annotation leader lands on a border

The dashed leader from *"no imports, no configuration"* terminates in a dot sitting on the `/project`
box's top stroke, left of centre. It points at a line, not at the CLAUDE.md node the note describes.
Every other annotation in the corpus either sits beside its subject or points into it.

**Fix:** move the leader's endpoint into the box, just above the `CLAUDE.md` label.

### F34 — `examples/example-line.html` / `examples/example-bar.html` — P3 — an unlabelled zero baseline, and trailing plot area

Both charts label the y axis from the first step up (20…120 on bar, 40…240 on line) and leave the
baseline itself unlabelled, so the axis starts at an unnamed value. `example-scatter.html` does
label its `0`. In `example-line.html` the gridlines and axis also run ~48 px past the last data point
(W8), leaving an empty ninth column and giving the focal area fill a hard right edge in open space.

**Fix:** add a `0` tick to bar and line; end the line chart's gridlines at the W8 x position.

---

## 3. Systemic

**S1 — the series palette is backfilled into four non-chart types.** `style-guide.md` §1 says the
series palette is for "chart types that genuinely need to distinguish multiple overlapping entities
(currently: **radar**)" and "**Don't backfill these tokens to non-chart types** — architecture,
swimlane, etc. continue to use muted-ink variants." Six files use series hexes:
`example-radar.html` and `example-line.html` (both charts — legitimate, the doc's "currently: radar"
list is what is stale), and `example-data-flow.html`, `example-process.html`,
`example-dp-integration.html` and `example-it-state.html` — none of which is a chart type.
`example-process.html` uses all five. `example-dp-integration.html` renames two of them
`--custom-red` / `--custom-blue` (`:10`), which also mis-describes them: `#9c6b50` is rust-brown and
`#5e7a9b` is dusty-blue. One fix: either extend the style guide's sanctioned list to "multi-series
charts plus typed-chip vocabularies", or convert the four non-chart files to muted-ink variants.

**S2 — `soft` carries text in ten files, against a recorded prohibition.** `#7a8399` measures
3.48:1 on paper. `diagram-palette.json` records the departure as "structural use only; may not carry
sublabel or eyebrow text" and `derivation-record.md` §5 repeats it. It is used as a `<text>` fill in
`example-architecture.html` (`:115`, `:123`), `example-import-drawio.html` (12 nodes),
`example-import-mermaid.html` (8 nodes), `example-pyramid.html` (`:82`, `:88`, `:94`),
`example-sequence.html` (`:164`, `:172`, `:188`), `example-sequence-oauth.html` (`:180`),
`example-sequence-oauth-full.html` (`:269`), `example-timeline.html` (`:82`),
`templates/template-full.html` (`:250`, `:273`, `:282`, `:296`), and via CSS class in
`example-dp-security-matrix.html` (`:20`). One fix: either repoint all of them to `#4f5d75` and keep
`soft` structural, or raise `soft` to a value that clears 4.5:1 and delete the departure.

**S3 — legend swatches do not match the thing they key.** Three separate shapes of this:
*dash pattern* — `template-full.html:353,359` uses `4,3`/`3,3` while the elements are `5,4`/`4,4`;
`example-swimlane.html:164` uses `4,3` against a `5,4` connector.
*missing arrowheads* — `example-high-level.html:293,296` draws two line swatches with no
`marker-end`, though both real connectors carry one.
*indistinguishable fills* — `template-full.html:340,343,346`,
`example-architecture.html:163,166,169` and `example-dp-security-matrix.html:83` each key three or
more states whose 14×10 px swatches are the same grey to the eye.
One fix: derive the swatches from the same attribute strings as the elements, and require a minimum
separation between keyed fills.

**S4 — three legend typographic conventions coexist.** Sentence-case Geist sans
(`example-architecture.html`, `example-tree.html`, most files), UPPERCASE mono
(`example-import-drawio.html`, `example-import-mermaid.html`), and lowercase mono
(`example-it-state.html`, `example-org-chart.html`). Pick one; the sentence-case sans form is the
majority and the most readable at 8.5 px.

**S5 — the legend rule is inset from the content it sits under.** `x1="40" x2="960"` appears in
`example-architecture.html:154`, `example-er.html:178`, `example-high-level.html:281`,
`example-timeline.html`, `example-quadrant.html:122` and others, while content in several of those
runs to x=980 (`example-er.html` entities) or is full-bleed to x=1000
(`example-high-level.html` chevron banner, identity bar to x=996). In
`example-quadrant-consultant.html` the legend rule stops at 960 while the footer rule below it runs
the full width — two rules on one page with different ends. One fix: set the legend rule to the
drawing's own bounding box per file.

**S6 — the dot pattern is on in 26 of 34 examples, against the documented default.**
`style-guide.md` §5 says "Dot pattern is optional, not default … The default background is a clean
`paper` fill, no pattern." 76% of the corpus opts in. The eight that do not are
`dp-security-matrix`, `import-drawio`, `import-mermaid`, `it-state`, `medallion`, `org-chart`,
`quadrant-consultant` and `venn`. Either the guide's sentence is wrong or two-thirds of the corpus
is; right now a reader following the guide would produce output unlike almost every shipped example.

**S7 — `rule-solid` disagrees between the record and the templates.** `derivation-record.md` §2 and
`style-guide.md`'s token table both give light `rule-solid` as `#bfc0c0` (silver), kind *primary*.
`template-full.html:20` — the pinned source of truth, per `diagram-palette.json`'s own note — carries
`rgba(79,93,117,0.25)`, which `diagram-palette.json` classifies as *derived: muted at 0.25*. Two
documents state a value no template holds. (`style-guide.md:33` also cites `#f7591f` as the accent
in prose, a hex that appears nowhere in the corpus.) The corpus check gates against the JSON, so
neither discrepancy fails.

**S8 — labels masked onto short connectors erase the connector.** The corpus-wide pattern of
painting a paper rect under an arrow label is sound on long runs and destructive on short ones.
It removes the line entirely in `example-er.html:79` (F4), fragments it in
`example-architecture.html:93` (F6) and hides the dash pattern in `example-swimlane.html:97` (F14).
One rule fixes all three: when the connector is under ~60 px, place the label beside it rather than
on it, with no mask.

**S9 — templates declare tokens and then paint from literals.** All four templates declare CSS
custom properties and then use none of them inside the `<svg>`. `template-full.html` is the extreme
case: ten declared roles, zero referenced in the drawing, so repainting the sentinel block changes
only the page chrome and leaves the entire figure in the stock light skin. Since the templates are
what a new diagram is copied from, this teaches the hard-coding that
`style-guide.md:50` already flags across the examples.
`example-dp-integration.html` is the one file that does it right (`var(--muted)` inside markers and
`var(--dot)` inside a pattern, both rendering correctly in the capture) and is the model to follow.

**S10 — the shipped renderer truncates tall pages.** `render-screenshots.cjs` captures a fixed
1280×900 viewport with no full-page flag, so the committed `screenshots/` for `template-full`,
`sequence-oauth`, `sequence-oauth-full`, `quadrant-consultant` and `loop-terminal` cut off their
legends, info cards and footers. This is outside the 38-file scope and is reported only because it
would have hidden F1 and F3 from anyone reviewing from the committed images.

---

## 4. Confirmed clean

Across all 38 files I checked the following and found nothing to report.

**Structure.** Every file has exactly one `<svg>` with a `viewBox`, `role="img"` and
`aria-labelledby` resolving to a `<title>`/`<desc>` pair whose ids are unique within the document,
and whose `<desc>` text accurately describes the drawing — I read all 38 descriptions against their
renders and none misstates what is drawn. The four templates' placeholder tokens
(`[diagram-slug]`, `[Diagram title]`, `[Type]`) are consistently spelled and consistently
substituted in the examples. No example carries leftover placeholder text.

**Skin fidelity.** Every file renders in the skin its palette block declares, and the two files most
at risk of leaking are clean. `example-sequence-oauth-dark.html` uses only dark-skin values — I
inventoried every literal and none of `#4f5d75`, `#eb6c36`, `#7a8399`, `#2e5aa8`, `#ececec` or
`#ffffff` appears in it; the `#f5f5f5` and `#2d3142` occurrences are the dark skin's own ink and
paper. `example-loop-terminal.html` and `templates/template-terminal.html` use only the nine
terminal roles (`#0a0a0a`, `#141414`, `#1b1b1b`, `#2b2b2b`, `#f5f5f5`, `#9a9a9a`, `#5c5c5c`,
`#ff5a36`, `rgba(255,90,54,0.12)`) with no light-skin values and no second hue.

**Typography.** No file uses JetBrains Mono or any font outside the three declared families. Every
inline `font-family` resolves to one of the documented fallback chains, so nothing falls back to a
browser default offline. Mono is used for technical content and sans for names throughout; the two
italic serif callouts I found (`example-layers.html:119`, `example-nested.html`) are annotation
callouts, which is the reserved use. `example-data-flow.html`'s apparently tiny sizes (5–9 px) are
correct once normalised to its 728-unit viewBox — they map to 7, 9 and 12 px on the documented scale.

**Focal discipline.** 32 of 34 examples carry exactly one accent focal, correctly placed on the node
or edge the title is about. The two that differ do so deliberately and legibly:
`example-venn.html` uses an ink-filled focal and no accent at all, and `example-loop.html` /
`example-loop-terminal.html` put the accent on `Decide` while the hub carries the greater visual
weight. `example-dp-integration.html` is the one file where accent is genuinely over-applied, and it
is reported in F16.

**Arrowheads and targets.** With the two exceptions reported (F18, F19), every marker in the corpus
terminates on a node edge rather than short of it or inside it, every `marker-end` reference
resolves to a marker that exists, and I found no arrow pointing at the wrong node. No connector
crosses another connector unnecessarily in any of the 38 files.

**Text fit.** I checked every label against its container and found no text overflowing its box or
clipped by a node boundary anywhere in the corpus. The only text-vs-geometry collisions are the two
circle arcs in F11 and the two overdrawn labels in F5; no node label exceeds its node, and no
sublabel wraps or truncates. The alignment work is genuinely careful — the step-column alignments in
`example-process.html` (eight steps) and `example-data-flow.html` (five) are exact to the pixel, as
are the tier and month grids in `example-gantt.html`, `example-medallion.html` and
`example-tree.html`.

**Node budgets and ceilings.** Every file is within the ceiling its catalog row states, with room to
spare: it-state 9 of 16, radar 5 of 5 axes, loop 6 stations of 5–8 plus one hub, process 8 steps of
12 and 4 lanes of 6, data-flow 5 of 6 and 3 of 4, dp-security-matrix 5 roles of 6 and 5 components
of 14, high-level at most 2 outgoing edges of 3.

**Catalog and README coverage.** All 27 canonical examples and 7 variants resolve to the catalog and
to `assets/examples/README.md`; the README's counts (27 + 7 = 34) and its per-file `Demonstrates`
column match what each file actually draws, including the three OAuth variants being the same
sequence in three registers. `assets/templates/README.md`'s four-row table matches the four template
files and their variants.
