# Assertion mutations

The new assertions were exercised against passing corpus files with a mutated copy held under
`scratch/mutations/`. Each mutation was run with the exact static command below, its first
failure was recorded, and the real template was restored before continuing. The large mutated
copies are intentionally removed after this record so scratch does not carry duplicate corpus
files.

Command: `node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs`

| Family | Mutated copy and change | Exact failure line observed |
| --- | --- | --- |
| `legend` | `scratch/mutations/legend-missing.html`: removed the keyed `data-chart-legend` element from `grouped-bars` while leaving `CHART_SERIES` and legend code intact | `FAIL [legend] assets/templates/grouped-bars.html: expected one HTML data-chart-legend element and found 0. Every named series needs one keyed legend row below the plot` |
| `tooltip-card` | `scratch/mutations/tooltip-svg-text.html`: retained the HTML tooltip register but changed the card name node from `tipNode('tip-name')` to the old SVG-text shape `tipNode('text')` | `FAIL [tooltip-card] assets/templates/daily-line.html: tooltip text is still created in SVG. The card readout belongs to the HTML tooltip element and its per-series rows` |

Both mutated target files were restored immediately after their red run. The final corpus run is
green with `legend: 42 assertion(s)` and `tooltip-card: 189 assertion(s)`.
