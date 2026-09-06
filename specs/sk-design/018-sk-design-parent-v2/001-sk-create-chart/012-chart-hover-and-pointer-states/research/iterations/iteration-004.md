# Iteration 4 — tier-2 tooltip verdicts (eight forms)

## Focus

For eight forms, decide whether the missing tooltip earns its place, applying the proven
rule — inert when every encoded value is printed beside its mark, needs a pointer when at
least one encoded value exists only as geometry — to forms that already carry a legend or
a dim. For daily-range the verdict was fixed at iteration 2; this iteration supplies only
its last column. Read exactly the eight tier-2 templates, nothing else.

## Actions Taken

- Read the eight templates once each (parallel-axes, stacked-bars, stacked-area,
  grouped-bars, bar-line-composed, daily-line, waterfall, daily-range).
- Two grep passes to pin file:line evidence: one to locate the decisive print/geometry
  lines, one to verify the absence claims (no tick/grid in stacked-bars; Total column
  only in stacked-area's table; which tier-2 files carry `function tip` and which carry
  `pointermove` wiring).
- No mutations of any researched file. No scope violations occurred.

## Findings

| form | verdict | the value that decides it | what a tooltip must reveal, or "n/a" | evidence |
|---|---|---|---|---|
| parallel-axes | `legend/dim terminal` | No value exists only as geometry: every dot already carries a native title naming label, axis and value with unit, each line is named where it ends, and both axis bounds are printed | n/a | parallel-axes.html:299 (native title on every dot), :151 ("Each line is named where it ends"), :284-285 (max/min printed) |
| stacked-bars | `needs tooltip` | The value of any segment shorter than 22 units: it exists only as height (`v * scale`) because the in-bar print is gated on `h >= 22`, and the form draws no tick ladder to interpolate against | The pointed segment's name and value; the printed label for tall segments is restated, which keeps hover information unconditional per segment | stacked-bars.html:333 (print gate `h >= 22`); no `.tick`/`.grid` class anywhere in the file; :288-291 define only plot constants |
| stacked-area | `needs tooltip` | Each band's value and the stack total at a pointed x: band thickness between stacked paths is pure geometry and the figure prints no numbers at all; the Total exists only in the table (:421) | All four band values plus the total at the x the pointer is over — a single value would not answer what a stack column shows | stacked-area.html:344 (band paths built from coordinates), :421 (Total column exists only in the table) |
| grouped-bars | `needs tooltip` | Each column's exact value: height is `y(v)` geometry with nothing printed on the mark, and the tick rungs only bracket the reading | The pointed column's series name (last/this year) and exact value | grouped-bars.html:340 (column height from `y(v)`; no value printed anywhere in the drawing) |
| bar-line-composed | `needs tooltip` | Both measures: columns and dots print nothing, and because the two ladders share one gridline set, an off-scale reading cannot be converted with confidence even in principle — the only form where the tooltip fixes genuine ambiguity, not just a lookup | The pointed period's count and rate, each tagged with the scale it reads against | bar-line-composed.html:384 (columns via `yCount`), :416 (dots via `yRate`) |
| daily-line | `needs tooltip` | Every reading except the emphasized low: 27 of 28 dots are position-only geometry; the low's value is the only one printed | The pointed day and its value | daily-line.html:380 (the low is the only printed value; the other dots carry none) |
| waterfall | `legend/dim terminal` | Nothing is geometry-only: the step delta is printed above every bar and each bar already carries a native title naming the value and its running total | n/a | waterfall.html:315-318 (native title per bar), :320 (delta printed above every bar) |
| daily-range | `needs tooltip` | (verdict fixed at iteration 2) The low and the high: both exist only as the `y(d.high)`/`y(d.low)` endpoints of the bar and are never printed | That day's low and high — both endpoints, and never a midpoint, because a midpoint is the average this form exists to refuse | daily-range.html:264 (bar spans `y(d.high)` to `y(d.low)`; both endpoints unprinted) |

Two of the eight already ship the reference mechanism in miniature — parallel-axes and
waterfall attach native SVG `<title>` tooltips to their marks — so tier-2 splits into
"already answers the pointer" (parallel-axes, waterfall) and "silent" (the other six).
bar-line-composed is the only case where a tooltip repairs genuine ambiguity rather than
saving a lookup: its two ladders share one gridline set, so a height cannot be reliably
converted off-scale even by a willing reader. stacked-bars already prints values above a
22-unit height threshold, so its tooltip would restate printed labels for tall segments
while supplying the missing number for short ones — per-segment conditional information,
which is new in this corpus.

## Questions Answered

- Does the missing tooltip earn its place on the seven tier-2 forms, and what must
  daily-range's tooltip reveal? — Yes on five (stacked-bars, stacked-area, grouped-bars,
  bar-line-composed, daily-line), no on two (parallel-axes, waterfall, both already
  terminal via printed values plus native titles); daily-range's tooltip must reveal the
  day's low and high, never a midpoint. Evidence in the table above.

With this iteration every one of the 21 forms has a decided contract: 7 tier-1 real-hover
(leave alone), 6 tier-0 correctly-inert, daily-range needs-pointer, and the seven tier-2
forms now split 5 needs-tooltip / 2 terminal.

## Questions Remaining

- Iteration 5 (the last): touch behaviour, and whether marks should become focusable.

## Next Focus

Touch and focusability across the corpus — what pointer affordances mean on a touch
surface, whether marks should join the key entries (which are already `tabindex="0"`
buttons) as focusable targets, and how the five needs-tooltip verdicts above interact
with a pointer that does not hover.

## SCOPE VIOLATIONS

None.
