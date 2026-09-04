# Iteration 10: Reconciliation and ranking — the actionable recommendation list

## Focus

Q9: consolidate nine iterations of evidence into a ranked, contract-reconciled recommendation list (template-level vs contract-level), verify question coverage, and hand off to synthesis.

## Findings

### F10.1 — Ranked template-level recommendations (applyable now, all reconcile with template-contract.md sections 3-6)

| # | Change | Evidence | Contract reconciliation |
| --- | --- | --- | --- |
| T1 | Per-mark SVG `<title>` on the 8 under-labelled forms (scatter, heat-matrix, calendar-grid, candlestick, box-plot, treemap, waterfall, parallel-axes) | F9.1-F9.3 | Pure markup from the existing `node()` helper; native browser tooltip (no library, no remote resource — rule 6); deterministic content (rule 12); trips none of the 13 checks; rule-10 table stays the keyboard path |
| T2 | `fmt` number helper (thousands separators, float-dust trim, fixed en-US grouping) applied to ticks, value labels and table cells; candlestick tick loop rewritten as `floor + step * t` | F8.1-F8.2, F2.1 | A few lines of inline JS copied with the template, exactly like the rest of the render code (SKILL.md:96-97); no dependency, no fetch (rule 6); deterministic (rule 12); locale-fixed so a delivered file renders identically everywhere |
| T3 | Null/NaN filtering in the line, range and stacked-area path builders (skip missing points; em-dash in table) | F7.2, F2.4 | Inline filter, deterministic; matches Plot's documented line-break semantics without importing Plot; data block stays literal (rule 8: one data block, no computing of displayed numbers — filtering is rendering, not data derivation) |
| T4 | Replace `label.length * 6.6` / `* 6.8` / `* 34` width estimates with `getComputedTextLength()` at render time | F3.2 | DOM measurement is built-in, no library; deterministic given fixed fonts (system-ui stack, bar-rows.html:31); kills the whole label-overlap class |
| T5 | Figure `<desc>`: add a series-mapping sentence per template, and make the factual clause data-derived (e.g. "largest is X at Y") | F5.2, F5.4 | Pure markup + a few render lines; satisfies rule 10 as written (presence + resolvability, check-corpus.cjs:424-448); deterministic computed text (rule 12) |
| T6 | Min-size guard on the figure: `svg { min-width: …px }` with `.figure { overflow-x: auto }` | F6.2 | Pure CSS; no dependency (rule 6), deterministic (rule 12), cannot trip a check; only visible on narrow screens — the emailed-file case (template-contract.md:22-23) |
| T7 | Per-form budget comments: gutter label-length budget, thinning rule (day % 7, i % 4, [1,3,5]), parallel-axes unit width | F6.3, F8.4, F3.4 | Comments only — no behaviour change, zero check risk; makes the fixed-layout constraints durable for the next editor |
| T8 | Gradient ramp legend swatch (SVG `<linearGradient>`) in calendar-grid and heat-matrix, keeping the text legend | F4.5 | Pure vector markup; deterministic (rule 12); no remote resource (rule 6) |
| T9 | Data-shape `console.warn` guard at the top of each render script when a ceiling is exceeded | F7.5 | Inline, deterministic; invisible to non-developers (delivery unchanged), visible in the one channel a developer editing the file sees; no rule touched |
| T10 | (Per-form decision) SVG `<pattern>` decals for stacked-bars, stacked-area, unit-ring | F5.3 | Pure markup, deterministic; must respect the surface-separator stroke (color-system.md:77); changes the shared visual register, so per-form, not corpus-wide |

### F10.2 — Ranked contract-level recommendations (needs a decision)

| # | Change | Evidence | Why contract-level |
| --- | --- | --- | --- |
| C1 | Narrow-viewport render assertion in check-corpus.cjs (`--window-size` phone viewport, assert no page overflow) | F6.5 | Changes what the validator enforces — template-contract.md:155-161 states what the check does not observe, so the contract text must move with the check |
| C2 | Catalog `data shape` wording: time labels arrive display-ready (daily-line, stacked-area, candlestick, calendar-grid) | F8.3 | The catalog is a contract surface (machine-read between sentinels, catalog.md:36); a new shape rule is a contract change |
| C3 | Contract wording naming the computed-value exception (waterfall end, stacked-area total) as the allowed scope of "never computes" | F7.3 | Amends template-contract.md:87's "never computes" sentence |
| C4 | (Alternative to T9) Visible data-shape notice in the figure when a ceiling is exceeded | F7.5 | Changes the delivery unit's rendering behaviour — needs a decision on what a delivered file may say when its data is out of shape |
| C5 | (Deferred) Diverging colour system + catalog form that consumes it | F4.2 | Palette capacity is contract-gated (color-system.md:73); only worth it when a midpoint form exists |

### F10.3 — Palette-level, applyable now: CVD rationale note + optional Okabe-Ito alignment of the categorical hues in color-system.md / palettes.json
The categorical set is gate-safe but never names a reference palette (F4.3); adding a "CVD rationale" paragraph is a doc edit, and aligning hues with Okabe-Ito's first four is a palettes.json edit whose gates the check recomputes automatically (check-corpus.cjs:617-618). Both are within the packet's own authoring rules (SKILL.md:130) and change no contract. Marked separately from T1-T10 because it touches the colour source rather than a template.

### F10.4 — Where the corpus is already ahead (no change): the findings that the synthesis must state as strengths, not gaps
Ramp contrast gates (F4.1); emphasis role (F4.4); WCAG-mapped gates incl. the documented `rule` exemption (F5.5); the data-table fallback unique among the six libraries (F5.1); direct labelling doctrine (F3.3); zero-baseline discipline incl. the one range-niced form (F2.5); capacity ceilings that make Vega-Lite's step sizing unnecessary (F6.4); parity thinning (F8.4); auditable computed values (F7.3); zero-transform auditability (F7.1); ECharts-dataset-aligned data block (F1.2); static viewBox as the honest subset of every upstream responsive mechanism (F6.1).

### F10.5 — Question coverage check (quality guard)
Q1 partial (ladder vs D3 doctrine, precision half, float dust — the remaining "partial" is the decision on a shared ladder, which is a C-class decision, not a research gap); Q2-Q8 answered with named sources; Q9 answered by F10.1-F10.3. All nine key questions have citable evidence; no single-weak-source: claims rest on d3-scale, d3-format, d3-array, d3-scale-chromatic, Vega, Vega-Lite, Plot, Chart.js, ECharts, Plotly, WCAG, MDN/W3C, CSS-Tricks, colorarchive.org, figviz — 15+ distinct sources plus corpus file:line citations. Source diversity and focus alignment pass; the lineage is ready for synthesis.

## Sources Consulted

- All sources from iterations 1-9 (consolidated in the findings registry)
- Corpus: full packet as read per the dispatch mandate

## Assessment

- **newInfoRatio**: 0.55 — no new external evidence; the ranking, reconciliation table, and coverage check are the new structure.
- **Novelty justification**: F10.1-F10.5 reorganize nine iterations of evidence into decision-ready form; the contract reconciliation column is the deliverable.
- **Confidence**: High.

## Reflection

- **What worked**: Two-tier ranking (template/contract) with a reconciliation column forced by the dispatch constraints; every T-row was checked against the 13 rules before inclusion.
- **What failed / ruled out**: None new; the exhausted-approaches list is unchanged (16 ruled-out directions across the loop).
- **Ruled-out directions**: (none added this iteration)

## Recommended Next Focus

Synthesis: compile research.md from all ten iterations (findings by convention, ranked recommendations, eliminated alternatives, open questions, references), finalize the convergence report, and emit the synthesis_complete event.
