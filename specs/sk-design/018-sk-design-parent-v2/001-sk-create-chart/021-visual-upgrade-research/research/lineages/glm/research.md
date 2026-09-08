# 021-visual-upgrade-research — Research Synthesis (fanout lineage `glm`)

Topic: what the standalone chart corpus should visually upgrade, judged against the external reference library. Evidence, not preference.

- Session: `fanout-glm-1788882013467-0smwwf` · lineage label `glm` · executor cli-pi / glm-5.3-flash (inline, this process — no nested dispatch) · generation 1 · lifecycle `new`
- Brief: `research/dispatch-prompt.md` in the 021 packet. Five angles, one per iteration, in order; no early convergence.
- Stop policy: max-iterations (5). Convergence 0.05 is telemetry only. Terminal stopReason: `maxIterationsReached`.
- Method: the reference library is local and nothing is fetched. Captures are opened as images and described by what they show; our sources are read at their lines; numbers are computed, not recalled. Every claim cites a capture file or a local file and line. Where ours is already better, that is a finding.
- Status: RUNNING — 1/5 angles complete (iteration 1, card anatomy: furniture at parity, figure aspect is the divergence, metric+delta is the gap). Iterations follow under their own headings; synthesis follows the fifth. Nothing here is final until the synthesis section.

---

## Iteration 1 — Card anatomy, typography and spacing

### What was read

Reference: `details/vercel-docs-analytics-light-01.jpg`, `details/vercel-analytics-light-01.jpg`, `details/apple-hig-charts-light-07.jpg`, `-08.jpg`, `details/carbon-anatomy-light-01.jpg`, `details/shadcn-line-light-01.jpg` (attempted reads — see the tooling note); their intent carried by the library's own annotations, `library/index.md:38,23,44` and the vercel-docs-analytics / apple-hig rows of `details/index.md`; their code, read at its lines: `013-.../scratch/shadcn/charts/chart-line-linear.tsx` (whole), `scratch/shadcn/chart.tsx:55-339`, `scratch/shadcn/charts/chart-area-interactive.tsx:130-229`. Ours: `assets/templates/daily-line.html` (whole; `:59-75, :94-105, :137-138, :139, :201-203, :227-244, :230`), `assets/templates/bar-columns.html` (whole), a 26-file `viewBox` survey across `assets/templates/`, plus `references/template-contract.md` §2-3, `references/color-system.md` §2, `references/catalog.md` §3.

Tooling note (said once, here): this executor's `read` returns images as attachments this model cannot see (9 calls, zero pixels), and the sk-vision channel returned usable transcriptions exactly twice in 11 probes. Their side therefore rests on their own frozen source and the library's own annotations, as the brief's fallback prescribes.

### What was seen or measured

Measured (ours): card 760px, padding 28/28/22, headline 16px/600 +6px, subtitle 14px +20px, footer 18px+12px+1px rule+8px gap, finding 14px/500, source 14px muted, ticks/legend/tooltip 12px with tabular-nums on ticks and tooltip values (`daily-line.html:59-75,94-105,103-105,107,139,201-203`). Plot height to frame width, all 26 forms: 24.4% (calendar-grid, 720x176) to 55.6% (population-pyramid, 720x400), **median 43.4%**; 25 of 26 frames between 24% and 47%.

Seen (theirs, from their own code and the library's notes): the standard card's footer is a 14px/medium claim with a 16px TrendingUp icon plus a 14px muted second line, gap-2 (`chart-line-linear.tsx:56-63`); the title is a label, not a conclusion (`:34-36`); the product variant carries a border-b, a 20px-padded header and a 160px range Select (`chart-area-interactive.tsx:163-186`); chart margins are fixed 12px (`chart-line-linear.tsx:32-35`); labels thin themselves via `minTickGap: 32` and date parsing (`chart-area-interactive.tsx:203-208`); the figure container is **aspect-locked 16:9 = 56.25%** of width (`chart.tsx:60`) with the chart text register at 12px and ticks filled muted (`chart.tsx:60-62`); the adopted tooltip/legend geometry was confirmed at source — value `font-mono font-medium tabular-nums`, indicator 10px dot / 4px line / 1.5px dashed, card `rounded-lg border px-2.5 py-1.5 text-xs shadow-xl` (`chart.tsx:170-259`), legend icon 8px / 2px corners / 16px gap (`chart.tsx:290-322`) — our 8px/2px/16px chips and mono value match dimension-exactly (`daily-line.html:107,203`).

### Findings
1. **The furniture is at parity; the figure is the divergence.** 26/26 of our frames run 24.4–55.6% of their 720-unit width (median 43.4%) against the reference's locked 56.25% — ≈13pp shorter at the median — while the 1px rule, the 16/14/12 scale and the footer weights match dimension-for-dimension. Whether the shortfall is the “template” read needs the Vercel/Apple/Tremor crops this executor could not see. [SOURCE: 26-file viewBox survey; `daily-line.html:59-75`; `scratch/shadcn/chart.tsx:60`]
2. **The product gap: no prominent number.** Only `progress-single` (56px) and `unit-ring` (34px) carry their reading as a figure; the scalar/time-series reading exists only as 14px prose (`daily-line.html:104,227-228`), while Apple's steps cards, Vercel's panels and Tremor's blocks all lead with value+delta (notes at `details/index.md` apple-hig, vercel-docs-analytics; `library/index.md:23`). [SOURCE: our templates + three independent reference notes]
3. **Ours already better, recorded as findings:** the headline-as-conclusion rule (“The drop in the second week never came back”, `daily-line.html:227`) vs their label+date-range titles (`chart-line-linear.tsx:34-36`); and `tabular-nums` pinned on our ticks AND tooltip values (`:139,:203`) where theirs pin it on tooltip values only (`chart.tsx:248-251`) — their axis numbers jitter, ours cannot.
4. **Kept differences, not gaps:** their runtime mechanisms (header Select + border, 12px fixed margins, date-parsed label thinning — `chart-area-interactive.tsx:163-186,203-208`, `chart-line-linear.tsx:32-35`) vs our one-time measured insets, 8 deliberately inert forms and display-ready labels (`daily-line.html:59-75`; `catalog.md`). No change.
5. **Their signed trend cue is a 16px inline-SVG icon** (`chart-line-linear.tsx:56-63`); our no-dependency rule (contract §5) still admits a hand-drawn 2-path mark — the shape the metric+delta recommendation needs.
6. **The footer needs nothing:** their 14px/medium + muted second line, gap-2 (`chart-line-linear.tsx:56-63`) equals our `.finding`/`.source`/rule/8px-gap block (`daily-line.html:103-105`) dimension-for-dimension — the metric+delta work is additive in the header, not a rebuild.

### Recommendations
1. **[implementable today]** Add an optional **metric+delta register** to the header zone of scalar and time-series forms: value 24–28px/600 ink (a literal from the data block — the computed-value exception does not stretch), signed 12px delta (verdant/crimson), period label 12px muted; prose-only fallback where no single headline number exists. (Findings 2, 5, 6; three independent reference sources agree.)
2. **[implementable today]** Give the delta a **direction cue as shape** — 16px inline-SVG, per finding 5; the prose keeps the argument, the shape keeps the glance.
3. **[needs a gate or contract change]** The metric size must **join the published type scale** — the scale is enforced from the palette source's `typeScale`, so a 24–28px rung is one scale-table + palette-source edit, not a template-local hack (contract §3, “a size outside it fails”).
4. **[no change — record]** Header border/controls/fixed insets stay as finding 4 records.

### What this iteration could not settle
Their Card's true paddings and title size (`ui/card.tsx` is absent from the frozen scratch — the ours-side 66% mark-to-mark body share has no theirs-side twin); whether our sub-16:9 figures are the “template” read (needs the unreadable crops); whether the metric+delta register needs a catalogue data-shape note (forwarded to angle 5). The shipped-fade discrepancy (file 0.35/0.04 vs prose 0.8/0.1) was found here and forwarded — angle 2 settles it.
