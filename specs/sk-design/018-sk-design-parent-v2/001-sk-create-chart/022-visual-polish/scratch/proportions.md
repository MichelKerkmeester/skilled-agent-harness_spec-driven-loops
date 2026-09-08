# Plot proportions, cartesian forms raised toward the reference

One line per form: old viewBox height, new height, ratio (new/old). The extra height goes
into the plot: top-anchored constants (TOP and everything printed above the plot) stay,
bottom-anchored constants (baseline, the tick row and the notice below it, the legend and
footer offsets) move down by the same amount the height grows, so the margin under the
baseline keeps its old clearance. Row- and strip-anchored forms (bar-rows, distribution-strip)
spread the extra across the gaps between rows or bands instead, keeping their top and bottom
margins. The GEOMETRY DEFAULTS block is untouched: frame width, pan floor and card
measurements did not change.

```
bar-columns           320 -> 392   1.225
bar-line-composed     300 -> 392   1.307
bar-rows              292 -> 392   1.342   row pitch 46 -> 66 (+20 per inter-row gap x5)
box-plot              320 -> 392   1.225
candlestick           320 -> 392   1.225
daily-line            292 -> 392   1.342
daily-range           292 -> 392   1.342
distribution-strip    268 -> 380   1.418   band pitch 66 -> 122 (+56 per inter-band gap x2)
dumbbell              308 -> 392   1.273
grouped-bars          330 -> 392   1.188
histogram             320 -> 392   1.225
scatter               316 -> 392   1.241
stacked-area          330 -> 392   1.188
stacked-bars          330 -> 392   1.188
waterfall             320 -> 392   1.225
parallel-axes         300 -> 392   1.307   axis foot 254 -> 346, head stays 72
calendar-grid         176  kept    1.000   the seven-by-five week grid sets the height; a taller frame only adds empty ground
heat-matrix           290  kept    1.000   the row-and-column matrix sets the height; a taller frame only adds empty ground
unit-grid             230  kept    1.000   the unit-square matrix sets the height; a taller frame only adds empty ground
unit-ring             330  kept    1.000   the ring's diameter sets the height; a taller frame would not enlarge the ring
treemap               336  kept    1.000   the tiles fill the frame they are given; a taller frame only rescales the same tiles
progress-single       190  kept    1.000   one progress track and its label; a taller frame only adds empty ground
bullet                280  kept    1.000   one horizontal bullet; a taller frame only adds empty ground
funnel                338  kept    1.000   the stacked trapezoids set the height; a taller frame only stretches the same steps
independent-percentages 268  kept  1.000   a row of percent bars; a taller frame only adds empty ground
population-pyramid    400  kept    1.000   already the tallest frame in the corpus; a taller one only adds empty ground
```

Deliveries under assets/examples that derive from a changed form take the same height and
offsets: orders-after-the-price-change (daily-line 292 -> 392), staff-hours-by-service
(bar-rows 292 -> 392), grouped-bars-stripe-style (grouped-bars 330 -> 392),
van-age-against-repair-cost (scatter 316 -> 392), pick-times-by-depot
(distribution-strip 268 -> 380). calls-by-day-and-hour (heat-matrix) and
where-the-budget-went (unit-grid) derive from kept forms and stay.
