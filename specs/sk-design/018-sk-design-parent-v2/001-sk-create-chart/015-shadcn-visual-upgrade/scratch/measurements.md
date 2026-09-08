# Shadcn visual measurements

The values below are the measurements used by the upgrade. The source is the frozen copy under
`013-shadcn-reference-research/scratch/shadcn/`; no network resource or current upstream file was
used. The HTML projection keeps the same visual relationships while replacing Tailwind utilities
with the chart corpus' local tokens.

| Element | Applied value | Frozen evidence and translation |
| --- | --- | --- |
| Card title | 16px, semibold (`600`), ink role | The frozen card anatomy puts `CardTitle` above `CardDescription` in the header (`chart-area-interactive.tsx:157-164`). The compact standalone projection is `text-base`/`font-semibold`, expressed as `16px`/`600`. |
| Description | 14px, muted role | The frozen header keeps the description as the second header line (`chart-area-interactive.tsx:158-164`); the corpus maps its muted-foreground role to `--chart-muted` (`assets/templates/bar-columns.html:105`). |
| Footer | Two stacked rows, 8px gap; first medium ink, second muted | The frozen footer uses `text-sm`, `gap-2`, `font-medium` and `text-muted-foreground` (`chart-line-linear.tsx:78-84`; `chart-area-default.tsx:80-88`). The corpus writes the same structure as `.finding` then `.source`, separated from content by a rule (`assets/templates/bar-columns.html:103-105`). |
| Tick margin | 8px between tick text and the plot edge; the label anchor constants in the templates sit at 10px and 20px because they include the text height, which the frozen `tickMargin` does not | `tickMargin={8}` is the repeated Cartesian default (`chart-line-default.tsx:57-63`; `chart-area-legend.tsx:65-70`). |
| Tick text | 12px, muted, tabular numerals | The chart container establishes the small chart text treatment and muted axis tick role (`chart.tsx:63-69`); the corpus maps it to the 12px note/tick projection and `--chart-muted` (`assets/templates/daily-line.html:141-145`). |
| Axis and tick lines | absent | `tickLine={false}` and `axisLine={false}` are explicit in the frozen Cartesian examples (`chart-line-default.tsx:57-63`). |
| Grid orientation | horizontal only | `CartesianGrid vertical={false}` is explicit (`chart-line-default.tsx:56`; `chart-area-default.tsx:58`). |
| Grid dash | 3px on / 3px off | The frozen component leaves the dash at the renderer default; the corpus keeps its measured low-contrast dashed rule as `stroke-dasharray: 3 3` and changes only orientation/weight (`assets/templates/daily-line.html:137-140`). |
| Single bar radius | 8px when one bar fills the band | The default frozen bar uses `radius={8}` (`chart-bar-default.tsx:61`). The corpus maps this to `--chart-radius-pill` for a full-band column (`assets/templates/bar-columns.html:265-273`). |
| Free/stacked bar radius | 4px on free corners; stacked outer ends only | The multiple-bar example uses `radius={4}` (`chart-bar-multiple.tsx:53-66`), while the stacked tooltip example uses `[4,4,0,0]` and `[0,0,4,4]` to round only outer ends (`chart-tooltip-advanced.tsx:64-75`). |
| Line width | 2px | Frozen line examples set `strokeWidth={2}` (`chart-line-default.tsx:68-73`; `chart-line-multiple.tsx:69-81`). |
| Dot policy | no per-point dots; keep the contract's highlighted point | The default line explicitly sets `dot={false}` (`chart-line-default.tsx:68-74`); custom-dot examples reserve a marker for a deliberate point (`chart-line-label-custom.tsx:87-97`). |
| Area gradient | series colour at 0.8 at the top, 0.1 at the baseline | The frozen gradient uses 0.8 and 0.1 stops (`chart-area-gradient.tsx:72-95`). |
| Stacked area opacity | flat 0.4 per series | The stacked area examples use `fillOpacity={0.4}` for the plotted areas (`chart-area-stacked.tsx:74-88`; `chart-area-stacked-expand.tsx:80-102`). |
| Tooltip card padding | 6px vertical / 10px horizontal | The frozen tooltip card uses `py-1.5 px-2.5` (`chart.tsx:190-195`), translated to `padding: 6px 10px`. |
| Tooltip card radius | 8px | The frozen card uses `rounded-lg` (`chart.tsx:191-195`), translated to `--chart-radius-pill`. |
| Tooltip border | 1px, muted rule at half strength | The frozen card carries `border border-border/50` (`chart.tsx:191-195`); the corpus uses a one-pixel `--chart-rule` mix. |
| Tooltip shadow | soft `shadow-xl` role | The frozen card carries `shadow-xl` (`chart.tsx:191-195`); the corpus keeps a local soft shadow so the card lifts without introducing a colour literal (`assets/templates/daily-line.html:176-193`). |
| Tooltip text | 12px; labels muted, values mono/tabular | The frozen tooltip wrapper is `text-xs` and its label/value roles are split into muted and mono/tabular spans (`chart.tsx:191-195`, `chart.tsx:242-259`). |
| Tooltip indicator | 8px square, 2px radius, series colour | The frozen indicator is a compact rounded square (`chart.tsx:221-237`); the packet's explicit visual criterion fixes the projection at 8px, using `--chart-radius-mark` and the series token. |
| Legend chip | Centered below the plot; 8px square, 2px radius, 16px row gap, muted 12px label | The frozen legend uses `gap-4`, `gap-1.5`, `h-2 w-2` and `rounded-[2px]` (`chart.tsx:290-322`); the corpus maps these to a centered row, `gap: 16px`, a 6px chip-label gap, 8px swatches and the muted label role (`assets/templates/grouped-bars.html:106-110`). |

## Colour projection

Only single-series Cartesian forms receive `--chart-series-1` for their primary mark. The
emphasis token remains reserved for the highlighted mark. Unit grids, rings, ordered ramps and
other non-Cartesian forms retain the colour logic that gives them their meaning.
