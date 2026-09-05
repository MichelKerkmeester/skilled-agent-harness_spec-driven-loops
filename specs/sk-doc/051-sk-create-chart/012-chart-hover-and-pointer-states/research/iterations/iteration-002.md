# Iteration 002 — Six tier-0 forms: needs-pointer or correctly-inert

## Focus

ONE DELIVERABLE: classify the six unread tier-0 templates (unit-ring, unit-grid, independent-percentages, bar-columns, bar-rows, daily-range) as needs-pointer or correctly-inert, one-line reason each. Nothing else.

## Actions Taken

1. Read each of the six template files once, no re-reads: `unit-ring.html`, `unit-grid.html`, `independent-percentages.html`, `bar-columns.html`, `bar-rows.html`, `daily-range.html` under `assets/templates/`.
2. Pinned exact line numbers for the printed text nodes in each file (one grep pass over all six) so every verdict cites file:line evidence.
3. Applied the rubric per form: does the figure print every encoded value inside itself, next to or on its mark?

No other files opened. No re-measurement of iteration 1 results. No scope violations: every write landed inside the run directory.

## Findings

| form | verdict | the value that decides it | evidence |
|---|---|---|---|
| unit-ring | correctly-inert | per-group incident count — printed in the key next to each swatch ("label + count"), and the total is printed in the ring centre; a tooltip on a tick would restate the key | unit-ring.html:253 (key prints `d.label + ' ' + fmt(d.value)`), :246 (centre total), :235 (ticks carry no value of their own beyond group membership) |
| unit-grid | correctly-inert | per-part share in percent — printed in the key with the `%` suffix and again in the table; each square's value is trivially 1% and its group share is already printed | unit-grid.html:245 (key prints `d.label + ' ' + fmt(d.value) + '%'`), :231 (squares) |
| independent-percentages | correctly-inert | each track's percentage — printed as a value label to the right of every track; category names printed to the left | independent-percentages.html:214 (val label `fmt(d.value) + '%'`), :209 (category label) |
| bar-columns | correctly-inert | each column's value — printed above every column; axis rungs printed at :272; nothing encoded only as bar height | bar-columns.html:286 (value label above column), :285 (category label) |
| bar-rows | correctly-inert | each bar's value — printed at the end of every bar (with unit suffix); category names printed at the axis | bar-rows.html:259 (value label at bar end), :254 (category label) |
| daily-range | needs-pointer | each day's minimum and maximum — the two endpoints of the bar exist only as geometry (`y(d.high)` / `y(d.low)`); the only printed numbers are the day number and the axis rungs, never the bounds | daily-range.html:263-264 (rect built from endpoint geometry), :261 (day number only), :251 (axis ticks only) |

At most three sentences on surprises: The deciding difference between the two verdicts is a corpus convention, not a chart-type property — every bar/track form prints its value beside each mark, which is exactly what makes a tooltip redundant there. The two unit forms are inert for a second reason: their key doubles as the printed value column, so the countable marks never carry an unprinted number. daily-range is the only one of the six whose marks encode two values (low and high) that the figure never prints, and its widest-day emphasis is likewise a derived, unprinted value.

## Questions Answered

- Are the six unread tier-0 forms needs-pointer or correctly-inert? ANSWERED: five correctly-inert (unit-ring, unit-grid, independent-percentages, bar-columns, bar-rows), one needs-pointer (daily-range). Combined with iteration 1's settled progress-single, the seven-form tier-0 tier is now fully classified: six correctly-inert, one needs-pointer.

## Questions Remaining

- Later, not now (deferred by design to later iterations): tooltip-vs-legend for the seven tier-2 forms; the inert register's shape in the checker; touch; keyboard focusability; technique beyond the corpus's own reference mechanism.

## Next Focus

Iteration 3: design the fourth inert register's shape in `check-corpus.cjs` (the checker currently carries only `data-chart-tooltip`, `data-chart-legend`, `data-chart-dim`), using this classification as its ground truth — six forms belong in the inert register, daily-range does not.

## SCOPE VIOLATIONS

None.
