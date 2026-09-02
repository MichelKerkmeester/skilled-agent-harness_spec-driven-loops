# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

### Purpose

Persistent brain for the fan-out lineage `deepseek-flash-max` (session `fanout-deepseek-flash-max-1788375447497-ut4oqk`): fidelity-and-library-research for the `sk-create-chart` packet. Compares the corpus of 20 standalone HTML chart templates against the conventions of Chart.js, D3, Vega-Lite, Plotly, Observable Plot and ECharts, and delivers ranked recommendations marked template-level or contract-level.

### Usage

- **Init:** Populated from the fan-out dispatch parameters (spec folder, artifact dir, executor cli-devin / deepseek-v4-flash-max, stopPolicy max-iterations, maxIterations 10).
- **Per iteration:** Read Next Focus, execute one evidence-gathering pass, write `iterations/iteration-NNN.md` + `deltas/iter-NNN.jsonl`, append the JSONL record, refresh the machine-owned sections below.
- **Mutability:** Mutable; machine-owned sections refreshed by the reducer pass after each iteration.

---

## 2. TOPIC

How should the sk-create-chart mode chart templates and delivered output improve, measured against what the best open-source charting libraries produce?

Mandated reading: `.opencode/skills/sk-doc/sk-create-chart/SKILL.md`, `references/template-contract.md`, `references/catalog.md`, `references/color-system.md`, `scripts/check-corpus.cjs`, every file under `assets/templates/` (20 templates) plus `assets/color/palettes.json` and the palette sheets.

Mandated upstream study: Chart.js, D3, Vega-Lite, Plotly, Observable Plot, ECharts — what a delivered chart from each looks like, and shared conventions on: axis ladders and tick selection; label and legend placement; colour ramps; accessibility (contrast, non-colour encoding, screen-reader affordances); responsive sizing; the relationship between data and mark.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

Generated from the reducer registry. Add external or late questions through `{spec_folder}/research/inbox.jsonl`; direct edits are imported as compatibility input and may be replaced on the next reduce step.

- [ ] Q1 Axis ladders and tick selection: what do D3/Vega-Lite/Plot/Chart.js/ECharts/Plotly do for tick step selection, "nice" extents, and tick formatting, and how does the corpus `niceStep` ladder compare? (candidate answer sources: d3-scale `ticks`/`nice`, Vega-Lite `tickCount`, Plot `ticks` option, Chart.js `ticks`, ECharts `axisLabel`, Plotly `dtick`)
- [ ] Q2 Label and legend placement: what are the shared conventions (direct labelling, legend position, collision handling, label formatting), and where does the corpus deviate (fixed-coordinate legends, width-estimate positioning)?
- [ ] Q3 Colour ramps: how do d3-scale-chromatic / Vega-Lite schemes / Plot colour scales / ColorBrewer handle sequential ramps, interpolation and colour-blind safety, versus the corpus's fixed 5-step gated ramp?
- [ ] Q4 Accessibility: what screen-reader and contrast affordances do the libraries ship (aria, alt, keyboard, non-colour encoding), versus the corpus rule-10 approach (role="img", aria-labelledby, data-chart-table)?
- [ ] Q5 Responsive sizing: how do Chart.js/ECharts/Plot handle resize, and what is achievable in a static double-click file with a fixed viewBox?
- [ ] Q6 Data-mark relationship: what do the grammars (Vega-Lite mark encodings, Plot marks) say about data shape and mark choice, versus the corpus's one-array-plus-hand-drawn-render contract?
- [ ] Q7 Number and date formatting: d3-format / Intl.NumberFormat conventions for axis labels and values, versus corpus `String(value)` rendering everywhere.
- [ ] Q8 Interaction and tooltips: minimum upstream interaction conventions (Chart.js tooltips, Plot pointer, ECharts tooltip) and which are reachable dependency-free (SVG `<title>`, CSS-only affordances).
- [ ] Q9 Reconciliation: which upstream techniques survive the no-dependency contract (template-contract.md sections 3-6) and which cannot, with an explicit statement per recommendation.
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- **No implementation.** This research run reports findings and recommendations only; template/code changes are a separate follow-up step (deep-research SKILL.md NEVER rule 8).
- **No wholesale library adoption.** The mode contract forbids libraries/CDNs (template-contract.md section 5); recommendations must reconcile with the single-file double-click contract or be marked contract-level.
- **No reference-implementation clone.** Do NOT open, read, search or reference any clone under scratch/tmp/vendor directories; it is PolyForm Noncommercial and nothing from it may be copied or paraphrased. (The spec folder's own `scratch/` directory is excluded from reading.)
- **No neighbouring packets.** sk-create-diagram, sk-design and other sk-doc packets are out of scope.
- **No license expansion.** Only MIT-class open-source projects may be sources of ideas or code; this repository is MIT and public.
- **No corpus modification.** Nothing outside the lineage artifact dir may be written, and no repo tooling (generate-context.js, validate.sh, git writes) may run.

---

## 5. STOP CONDITIONS

- `config.maxIterations` (10) reached — the configured stopPolicy is `max-iterations`; convergence signals before that are telemetry only and should broaden review angles rather than synthesizing early.
- All key questions answered with citable sources (quality-guard stop).
- Unrecoverable state corruption or 3+ consecutive iteration failures (escalate path).

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- Q1 (partial): D3 tick doctrine (count-hint, human-readable steps, within-domain, auto-precision) vs corpus ladder — ladder sound and finer, precision half missing (iteration 2, F2.1)
- Q2: Legend placement has no upstream consensus (Chart.js top, Vega-Lite right, ECharts top-right), but all reserve space outside the plot; corpus's in-figure swatch row consumes plot budget and its width-estimate math (`label.length * 6.6`) can overlap; direct labelling doctrine already adopted (iteration 3, F3.1-F3.4)
- Q3: Corpus ramp gates are ahead of every surveyed library (no upstream enforces contrast); single-hue teal ramp matches CVD guidance; emphasis role is corpus-unique; missing pieces are a diverging system (no form consumes one — deliberately absent) and a gradient ramp legend (SVG linearGradient, applyable now) (iteration 4, F4.1-F4.5)
- Q4: Rule-10 trio ahead of Chart.js (canvas inaccessible by default) and validated by Vega's own ARIA-bloat concern; WCAG 2.1 AA thresholds (4.5:1 text, 3:1 non-text) map exactly onto the corpus gates; gaps are desc series-mapping, data-derived desc text (staleness), and optional SVG decals for stacked forms (iteration 5, F5.1-F5.5)
- Q5: Every upstream responsive mechanism needs a runtime; corpus viewBox scaling is the static subset — parity on mechanism, behind on verification (no narrow-width check), tied on text (Plot has no static answer either). Applyable-now: min-size guard (overflow-x scroll floor); contract-level candidate: narrow-viewport render assertion (iteration 6, F6.1-F6.5)
- Q6: Zero-transform contract is the deliberate inverse of Vega-Lite/Plot transform machinery; catalog data-shape column is the corpus's transform language. Gaps: null handling (Plot breaks lines; corpus draws NaN silently), shape enforcement (no guard on ceilings), and the two computed values (waterfall end, stacked-area total) should be named as the allowed exception (iteration 7, F7.1-F7.5)
- Q7: Per-template `fmt` helper (thousands separators + float-dust trim, locale-fixed) is the applyable-now answer to String(value); float dust is real today in the candlestick tick loop; time labels arrive display-ready by design (needs catalog wording); corpus already hand-rolls Vega-Lite parity thinning (iteration 8, F8.1-F8.5)
- Q8: Per-mark SVG `<title>` is the applyable-now interaction fix (native tooltip since 2015, doubles as accessible name, trips no corpus check); forms that need it most are scatter/heat-matrix/calendar-grid/candlestick/box-plot/treemap/waterfall/parallel-axes; JS floating tooltips stay a per-form decision (iteration 9, F9.1-F9.5)
- Q9: 10 template-level + 5 contract-level + 1 palette-level recommendations, each contract-reconciled; 15 ruled-out directions; coverage check passed (iteration 10, F10.1-F10.5)
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- Surveying libraries per docs page (4 parallel searches) then writing findings: produced 6 citable findings in one pass (iteration 1)
- Anchoring corpus structure to upstream analogues (ECharts `dataset` ≈ data block; Vega-Lite encoding ≈ data-mark mapping) (iteration 1)
- Reading d3-scale and Plot docs for exact API semantics before comparing with the corpus ladder (iteration 2)
- Comparing placement *mechanisms* (layout-reserved vs in-figure coordinates) rather than just positions (iteration 3)
- Splitting colour into ramp shape / ramp safety / ramp legend — each resolved separately (iteration 4)
- Splitting accessibility into screen-reader name / series mapping / non-colour cue / contrast (iteration 5)
- Framing responsiveness as mechanism vs verification vs text (iteration 6)
- Reading the corpus's computed-value exceptions as deliberate and audit-friendly (iteration 7)
- Designing the fmt helper against the actual contract clauses rather than an idealized shared module (iteration 8)
- Checking the title-change proposal against all 13 corpus checks before recommending it (iteration 9)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- Trying to cover all six libraries in iteration 1: exceeded the per-iteration budget, so D3 and Observable Plot moved to iteration 2 (iteration 1)
- Searching for an upstream legend-overlap solver: none exists; libraries avoid overlap by layout (iteration 3)
- Searching for an upstream contrast-gate equivalent for colour schemes: none exists; corpus gates are unique (iteration 4)
- Searching for a library that ships a data-table fallback: none does; the corpus table is unique among the six (iteration 5)
- Seeking a dependency-free re-layout technique for responsiveness: none exists (iteration 6)
- Looking for an upstream data-shape validation feature: none exists; upstream bends formats to users (iteration 7)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

[None yet]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

- Survey all six libraries in one iteration: ruled out for budget reasons, split instead (iteration 1)
- Adopting D3 tick machinery as a dependency: contract forbids libraries (iteration 2, F2.5)
- Two-sided d3-style nicing across corpus forms: would break zero-baseline discipline (iteration 2, F2.5)
- Adopting a library legend component: contract forbids; upstream avoids overlap by layout (iteration 3, F3.1)
- Wholesale Plot-style dx/textAnchor per-label offsets: corpus already partially applies anchor flips (iteration 3, F3.3)
- Adding a diverging colour system now: no catalog form consumes a midpoint ramp (iteration 4, F4.2)
- Per-mark ARIA attributes: bloat concern (Vega release notes) validates corpus granularity (iteration 5, F5.1)
- Corpus-wide decal adoption: changes the shared visual register; per-form decision instead (iteration 5, F5.3)
- Container-driven re-layout / per-viewport re-render: all upstream re-layouts need a runtime (iteration 6, F6.1)
- ECharts-style generic 2D-array datasets: would weaken per-form shapes (iteration 7, F7.5)
- Adding Vega-Lite/Plot transform pipelines: contract forbids computing in the data path (iteration 7, F7.1)
- Locale-sensitive Intl.NumberFormat: delivered file must not change shape across locales (iteration 8, F8.1)
- Vega-Lite-style rotation/truncation defaults: rotation needs runtime layout; truncation fights direct labelling (iteration 8, F8.5)
- JS floating tooltip as corpus-wide default: runtime surface without screenshot value (iteration 9, F9.5)
- Replacing visible labels with tooltips: fights direct-labelling doctrine (iteration 9, F9.5)
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS

- Q3 carry: CVD rationale note for color-system.md + possible Okabe-Ito alignment of categorical hues (from iteration 4 F4.3)
- Q4 carries: desc series-mapping line per template; data-derived desc factual clause; decal candidate for stacked forms (from iteration 5 F5.2-F5.4)
- Q5 carries: min-size guard constant per template; gutter-budget comment per form; narrow-viewport render assertion candidate (from iteration 6 F6.2-F6.5)
- Q6 carries: null-filter in path builders; data-shape console.warn guard; contract wording naming the computed-value exception (from iteration 7 F7.2-F7.5)
- Q7 carries: fmt helper per template; floor + step*t tick loop; catalog display-ready-label wording; thinning-rule comments (from iteration 8 F8.1-F8.4)
- Q8 carries: per-mark title text per form (8 forms); per-form JS tooltip decision for scatter/candlestick (from iteration 9 F9.3-F9.5)
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Synthesis: research.md compiled from all ten iterations; convergence report finalized; synthesis_complete event emitted. Loop complete (stopPolicy max-iterations, 10/10).
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Bounded Context Snapshot (corpus, pointer-based)

- **Source pointers**: `.opencode/skills/sk-doc/sk-create-chart/` — SKILL.md (workflow contract), references/template-contract.md (13 rules; section 3 skeleton, section 4 data block, section 5 no-dependency, section 6 palette block), references/catalog.md (20 rows, sentinel-parsed both directions), references/color-system.md (3 systems, 6 contrast gates), scripts/check-corpus.cjs (13 checks + palette gates + render pass), assets/color/palettes.json (source of truth), assets/templates/*.html (20 forms).
- **Reuse candidates**: `niceStep` ladder `[1,1.25,1.5,2,2.5,3,4,5,6,8,10]` (bar-columns.html:109-117 and 8 more templates); `labelClass` luminance-adaptive label picker (stacked-bars.html:125-127, treemap.html:137-139, heat-matrix.html:132-134); deterministic integer-mixer jitter (distribution-strip.html:121-126); computed-end waterfall (waterfall.html:121-133); `level()`/`band()` ramp bucketing (calendar-grid.html:168-172, heat-matrix.html:146-148).
- **Integration points**: palette-sheet-neutral.html is the copy-from skeleton (template-contract.md:48); corpus validator is check-corpus.cjs; catalog is the both-directions index.
- **Constraints and risks**: any template-level recommendation must keep all 13 checks green (check-corpus.cjs:615-665 runs every check on every html under assets/); contract-level changes need a decision; the `scratch/` directory in the spec folder must never be read (PolyForm clone prohibition).

### Resource map

resource-map.md not present in the spec folder; skipping coverage gate. `resource_map_present: false`.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 10 (from config)
- Convergence threshold: 0.05 (telemetry only; stopPolicy = max-iterations)
- Per-iteration budget: 12 tool calls, 12 minutes (from config)
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Write surface: ONLY `specs/sk-doc/051-sk-create-chart/007-fidelity-and-library-research/research/lineages/deepseek-flash-max/`
- Current generation: 1
- Started: 2026-09-02T19:00:00Z
