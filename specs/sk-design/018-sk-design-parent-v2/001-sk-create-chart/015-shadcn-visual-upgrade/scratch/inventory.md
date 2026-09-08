# Chart corpus visual inventory

The inventory covers all 26 templates after the upgrade. `Axis/scale` includes a visible numeric
or categorical scaffold even when the form intentionally has no axis line. `Bars` means a bar mark,
not a progress track. `Path` means a data path; connector and axis lines do not count. `Area` means
a filled data area. `Tooltip` means the HTML `data-chart-tooltip` card. `Multi-series` means the
form declares more than one named stream in `CHART_SERIES`.

| Form | Axis/scale | Bars | Path | Area | Tooltip | Multi-series |
| --- | --- | --- | --- | --- | --- | --- |
| `bar-columns` | yes | yes | no | no | no | no |
| `bar-line-composed` | yes | yes | yes | no | yes | yes |
| `bar-rows` | yes | yes | no | no | no | no |
| `box-plot` | yes | no | no | no | yes | no |
| `bullet` | no | no | no | no | yes | no |
| `calendar-grid` | yes | no | no | no | yes | no |
| `candlestick` | yes | no | no | no | yes | no |
| `daily-line` | yes | no | yes | yes | yes | no |
| `daily-range` | yes | yes | no | no | yes | no |
| `distribution-strip` | yes | no | no | no | yes | no |
| `dumbbell` | yes | no | no | no | yes | no |
| `funnel` | no | yes | no | no | yes | no |
| `grouped-bars` | yes | yes | no | no | yes | yes |
| `heat-matrix` | yes | no | no | no | yes | no |
| `histogram` | yes | yes | no | no | yes | no |
| `independent-percentages` | no | no | no | no | no | no |
| `parallel-axes` | yes | no | yes | no | no | yes |
| `population-pyramid` | yes | yes | no | no | yes | yes |
| `progress-single` | yes | no | no | no | no | no |
| `scatter` | yes | no | no | no | yes | no |
| `stacked-area` | yes | no | yes | yes | yes | yes |
| `stacked-bars` | yes | yes | no | no | yes | yes |
| `treemap` | no | no | no | no | yes | no |
| `unit-grid` | no | no | no | no | no | no |
| `unit-ring` | no | no | no | no | no | no |
| `waterfall` | yes | yes | no | no | no | no |

The six keyed multi-series forms are `bar-line-composed`, `grouped-bars`, `parallel-axes`,
`population-pyramid`, `stacked-area` and `stacked-bars`; each now owns one HTML legend row. The
18 tooltip-bearing templates now own the positioned card, and the four tooltip-bearing deliveries
follow the same card structure.
