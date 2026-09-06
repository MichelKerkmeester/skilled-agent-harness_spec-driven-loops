# Rendered pointer-target baseline

## How this was measured, and the first measurement that was wrong

Headless Chrome at a 900px window, reading `getBoundingClientRect()` on every `[data-mark]`
element, in CSS pixels rather than SVG units.

**The first pass of this measurement was wrong and its numbers should not be quoted.** Every bar
and segment in this corpus enters with `animation: chart-grow 0.5s ... backwards` and a per-column
`animation-delay`. Under `fill-mode: backwards` the element is held at the `from` keyframe,
`transform: scaleY(0)`, until its delay elapses. Under headless virtual time those animations never
reach `finished`: a probe on `stacked-bars` read `transform: matrix(1, 0, 0, 0, 0, 0)` with twelve
animations still running, while `getBBox()` reported the true geometry at 159.6, 54.1 and 28.3 user
units. The probe was measuring the animation, not the chart.

Waiting on `getAnimations().finished` does not fix it, because those promises never resolve here
either. The fix is to force them: `document.getAnimations().forEach(a => a.finish())` before
measuring. Every row below was taken that way, with zero animations left running.

**A claim about the corpus checker that was made here and is WRONG, corrected in place.** This file
previously said `settled-render` passes on a chart frozen mid-animation and therefore cannot tell
"settled" from "stuck at the same frame". That was wrong, and it was wrong because the same
`getBoundingClientRect()` artefact was read twice.

Measured: a checker-identical capture of `stacked-bars`, `grouped-bars` and `daily-line` is
**byte-identical** to a capture of the same file with every animation forced to its end state.
The painted picture is settled. Viewing the capture confirms it: the bars are full height and
correctly proportioned.

What is actually happening is narrower and only affects measurement. These transforms are
compositor-driven, so the paint reaches its end state while the main thread still reports the
pre-animation value: `getBoundingClientRect()` returns a zero height and `getAnimations()` reports
the animation unfinished, at every timer point through the end of the virtual-time budget. The
screenshot is right and the geometry API is wrong.

The rule that follows is about probes, not about the checker: **force animations before reading any
box**, `document.getAnimations().forEach(a => a.finish())`. `settled-render` needs no change.

## The corrected numbers

| Form | Marks | Smallest (w x h) | Under 24px | Min gap | Work needed |
|------|-------|------------------|-----------|---------|-------------|
| calendar-grid | 364 | 11.1 x 11.1 | 364 | 12.9 | nearest-mark region |
| distribution-strip | 144 | 5.8 x 5.8 | 144 | 0.3 | nearest-mark region |
| daily-line | 29 | 4.9 x 4.9 | 29 | 0.0 | nearest-mark region |
| scatter | 18 | 10.7 x 10.7 | 18 | 12.0 | nearest-mark region |
| candlestick | 14 | 23.8 x 3.5 | 14 | 46.0 | grow in place |
| daily-range | 14 | 19.1 x 67.4 | 14 | 45.6 | grow in place |
| bar-line-composed | 16 | 5.8 x 5.9 | 8 | 47.4 | grow in place |
| stacked-bars | 12 | 83.7 x 10.0 | 4 | 25.1 | grow in place |
| box-plot | 5 | 52.7 x 20.5 | 1 | 125.6 | grow in place |
| grouped-bars | 10 | 37.8 x 36.5 | 0 | 44.9 | none |
| heat-matrix | 56 | 73.6 x 31.2 | 0 | 31.2 | none |
| stacked-area | 4 | 643.5 x 43.7 | 0 | 26.4 | none |
| treemap | 9 | 314.1 x 49.4 | 0 | 69.2 | none |

**596 of 695 marks (86%) are below the 24 x 24 CSS px floor.** Four forms already clear it and need
no work: `grouped-bars`, `heat-matrix`, `stacked-area`, `treemap`.

## What the correction changed

- `grouped-bars` read as 37.8 x **0** with ten marks under the floor. It is 37.8 x 36.5 and needs
  **nothing**. It had been assigned work it does not need.
- `stacked-bars` read as 83.7 x **0**, minimum gap 0.0, and was assigned a delegated region. It is
  83.7 x 10.0 with a 25.1px gap, so it **grows in place** and only four of its marks are short.
- `daily-range` height read 48.9; it is 67.4. Still short on width at 19.1.
- The headline moved from 614 marks (88%) to 596 (86%). The scale of the problem stands; two
  per-form assignments were wrong.

## The rule that decides technique

A form whose closest pair of marks sits at least 24px apart can grow its target in place, because a
24px target cannot reach a neighbour. A denser form cannot, and needs one delegated region that
resolves the pointer to the nearest mark.

## Two forms with a resolution wrinkle

`daily-line` has one coincident pair: the r=2.5 dot for the lowest reading and the r=5 emphasised
"crown" drawn at the same centre, both carrying `data-mark`. A nearest-mark resolver must break that
tie deterministically, preferring the crown, which is the mark the figure actually prints.

`stacked-bars` segments sit edge to edge within a column. Its 25.1px minimum gap is between columns,
so growing in place is safe horizontally, but a vertical enlargement must not cross into the segment
above or below.

## The technique split was dropped: one mechanism, not two

The plan above assigned eight forms "grow in place" and five a delegated region, on the reasoning
that growing a target is cheaper where spacing allows. Building it changed the answer.

A nearest-mark resolver hands every mark the whole region that is closer to it than to any other.
That region is **larger** than a 24px stroke wherever marks are further apart than 24px, and it is
the largest possible target wherever they are closer. It adds no node, and it does not depend on
whether a browser hit-tests a transparent stroke, which `pointer-events: visiblePainted` leaves
genuinely uncertain. Two mechanisms bought nothing over one.

Applied to the nine forms that had marks under the floor. The four already clearing it are left
alone: `grouped-bars`, `heat-matrix`, `stacked-area`, `treemap`.

**Resolution order, and why it is ordered.**
1. A direct DOM hit wins. It is exact and cheapest.
2. Otherwise, a mark whose own box contains the pointer, smallest such box first.
3. Otherwise, the nearest mark centre within a bounded reach, so pointing at empty space away from
   the drawing still means nothing.

Step 2 exists because nearest-centre alone is wrong for stacked rectangles, and this was confirmed
rather than assumed. On `stacked-bars` at client point (178, 330), exactly one mark contains the
point, `series-1` with box x 177-261 and y 328-484, while `series-2`'s centre is nearer at 49px.
Nearest-centre would name a segment the pointer is not inside. The containing rule names the one
it is.

Boxes come from `getBBox()` and are cached once. `getBBox()` reports drawn geometry independent of
layout and of the entry animation's transform, which is what makes the region stable while a bar
grows in.

**Measured after the change**

| Form | Probe points | Opened a card | Named the right mark |
|------|-------------|---------------|----------------------|
| scatter | 82 | 82 | 82 |
| calendar-grid | 179 | 179 | 179 |
| distribution-strip | 135 | 135 | 135 |
| daily-line | 110 | 110 | 110 |
| candlestick | 79 | 79 | 79 |
| daily-range | 82 | 82 | 82 |
| bar-line-composed | 139 | 139 | 139 |
| box-plot | 39 | 39 | 39 |
| stacked-bars | 117 | 117 | 117 |

A separate sweep of `scatter` at a finer step found 225 of 225 points opened a card with zero dead
zones within reach, against a prior state where only a pointer landing exactly on one of eighteen
10.7px circles did anything. On `calendar-grid`, 364 marks, a 410-point sweep cost 0ms in total,
below timer resolution, so the per-event cost of scanning every mark is not a concern.

`stacked-bars` first reported four disagreements. The oracle was wrong, not the resolver: the probe
compared against nearest-centre, which is the rule step 2 exists to override. Corrected above.

## A consequence for the success criterion

"Zero marks under 24 x 24" cannot be satisfied by a resolver, because a resolver does not enlarge
marks, it enlarges the region that resolves to them. The honest criterion is that every pointer
position within the drawing resolves to exactly one mark and to the mark nearest the reader's aim.

## Writing the rule was harder than writing the fix, and the reason is worth keeping

The resolver was right on its first build and has not changed since: 962 probe points across nine
forms, every one naming the correct mark. The rule that checks it was wrong three times, and every
time in the same way: **the oracle approximated what the browser does instead of asking it.**

1. First oracle: nearest mark centre. Failed `heat-matrix` at 10 of 90, because a pointer near a
   cell boundary sits inside one cell while another's centre is nearer. This exact failure had
   already been diagnosed on `stacked-bars` an hour earlier, and reasoned about in writing, and was
   then written into the rule anyway.
2. Second oracle: smallest bounding box containing the pointer, else nearest centre. Fixed the
   stacked column and still failed `heat-matrix`, `stacked-area` and `treemap`. Those forms tile a
   region with paths whose bounding boxes overlap heavily, so the smallest containing box is
   routinely a different shape than the painted one under the pointer.
3. Third oracle, the one that holds: when `elementFromPoint` lands on a mark, that mark is the
   answer and nothing second-guesses it. Nearest centre decides only where the pointer is over no
   mark at all, which is precisely the case the resolver exists to serve.

The rule's dead-space measure was wrong once for a related reason: it counted every unanswered
position across the whole svg box, which includes title, legend, axis labels and margin. That
failed `box-plot` at 107 of 121 and `treemap` at 13 of 110, forms whose marks are large and already
comfortable. Counting only positions within aiming distance of a mark is the property that was
actually wanted: a form may have all the empty margin it likes, and may not have a hole where a
mark is.

**The transferable lesson.** A checker that re-implements the behaviour it checks will disagree with
it at every boundary case, and boundary cases are the whole point. Where the platform can answer
authoritatively, ask the platform; reserve the independent computation for the cases the platform
cannot answer. The one genuine corpus defect this rule found on its first honest run was mine: four
deliveries had never received the resolver, and two of them answered nothing at 121 of 121 sampled
positions.
