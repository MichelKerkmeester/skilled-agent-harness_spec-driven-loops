# Deep Research Strategy — 021-visual-upgrade-research (fanout lineage `glm`)

## 2. TOPIC
What should the standalone chart corpus visually upgrade, judged against the external reference library. Five angles, one per iteration, in order: (1) card anatomy, typography and spacing; (2) marks — lines, areas, bars, fills; (3) tooltip, legend, interaction states; (4) colour and the dark ground; (5) missing forms and what the checker learns. The brief is `research/dispatch-prompt.md` in the 021 packet; the loop reads it, not a summary of it.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [ ] K2: Which mark treatments — line weight, dot policy, area gradient and opacity, bar radius and gap, stack separators, the highlighted mark — are missing or weak in the 26 forms after the shipped phases 15–19? (plus: resolve the shipped fade discrepancy — the file's 0.35/0.04, `daily-line.html:137-138`, against the contract prose's 0.8/0.1)
- [ ] K3: Which tooltip, legend and interaction patterns in the reference library improve reading without adding decoration our pointer contract cannot afford?
- [ ] K4: Which colour and dark-ground changes are defensible by number under the cursor register and its six contrast gates?
- [ ] K5: Which missing micro-visualisations earn a row in the question-first catalogue, and which findings from angles 1–4 become enforceable corpus-check assertions rather than per-template judgement?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- No dependency, no build step, no framework: the corpus stays 26 self-contained HTML files that open on a double click.
- No template rewriting: this loop produces findings; a later phase implements. Where ours is already better, that is recorded as a finding, not "improved".
- Nothing is fetched. The reference library is local; evidence is capture files, our sources, and computed numbers.
- No gate or contract is changed by this loop. A recommendation that needs a gate change says so; it does not make the change.
- The five angles are fixed and ordered. Convergence telemetry does not reorder or skip them.

---

## 5. STOP CONDITIONS
- Five iterations complete (config.maxIterations = 5) → synthesize with stopReason `maxIterationsReached`. This is the only expected stop.
- Convergence before iteration 5 is telemetry only: broaden the next angle's evidence rather than stopping early (the brief requires five).
- Unrecoverable evidence failure (images unreadable in this executor) is documented once in the affected iteration and the angle continues from the index notes plus local sources — it does not stop the loop.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- **K1 (iteration 1)**: Our furniture (type scale, footer weights, 1px rule, 8px gaps) is dimension-identical to the reference; the only true divergence is figure aspect — 26/26 frames run 24.4–55.6% of their 720-unit width (median 43.4%) against the reference's locked 56.25% (`scratch/shadcn/chart.tsx:60`). The product gap is the missing prominent number (metric+delta) in the header zone; the footer needs nothing. Evidence: `iterations/iteration-001.md`.
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Reading the reference from its own frozen source (`013-.../scratch/shadcn/*.tsx`): turned an unreadable-crops angle into a line-cited comparison, and confirmed the adopted tooltip/legend/tooltip-value geometry at source, not from prose (iteration 1).
- Surveying all 26 forms with one targeted `rg` (the `viewBox` sweep): produced the angle's only measured divergence for one tool call, and caught the contract-prose vs shipped-fade discrepancy (iteration 1).
- Treating the library's one-idea notes (`library/index.md`) as their side of the bargain when crops cannot be read: honest, cited, and enough to name each reference's intent (iteration 1).
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- The `read` tool's image support under this model: 9 capture reads returned “model does not support images”; zero pixels reached the loop (iteration 1).
- The sk-vision channel under this backend: 11 probes (inspect + ocr), 2 usable transcriptions, the rest 1–4-word fragments — its questions were answered, not its readings (iteration 1). Both failures are documented once in `iterations/iteration-001.md` (Assessment) and drive the method fallback the brief prescribes; later iterations skip the dead paths and go to local sources directly.
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[Populated when an approach has been tried from multiple angles without success]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Header controls, a header border and fixed 12px insets in every card: theirs need a runtime and component library; our eight inert forms and per-form, widest-label insets are recorded decisions (iteration 1, evidence: `chart-area-interactive.tsx:163-186`, `chart-line-linear.tsx:32-35`, `daily-line.html:59-75`).
- Changes to card padding, card width or footer weights: dimension-for-dimension parity was confirmed at both sources (iteration 1, evidence: `chart-line-linear.tsx:56-63` vs `daily-line.html:103-105`).
- Trusting the contract prose over the shipped file for the area fade: the file's 0.35/0.04 (`daily-line.html:137-138`) differs from the prose's 0.8/0.1; the discrepancy moved to angle 2's evidence, not settled here.
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
- Their Card's true paddings and title size: `ui/card.tsx` is absent from the frozen scratch, so the ours-side 66% mark-to-mark body share has no theirs-side twin (iteration 1, finding 1).
- Whether our sub-16:9 figures are the “template” read: needs the Vercel/Apple/Tremor crops this executor could not see; the crops stay theReferences of record (iteration 1, finding 1).
- Whether the metric+delta register needs a catalogue data-shape note — which forms qualify and where the value must come from — feeds angle 5 (iteration 1, finding 2).
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Iteration 2 — Marks: lines, areas, bars and their fills. Line weight, dot policy, area gradient and opacity, bar radius and gap, stacked separators, the highlighted mark — what ours does per form (read the template, not the prose), what the library does (`details/shadcn-line-*`, `shadcn-area-*`, `shadcn-bar-*`, `tremor-area-*`, `mantine-area-*`, `plot-area-docs-*`, `layerchart-*`, `unovis-gallery-*`, `carbon-storybook-*`), then what to change. Settled here first: the shipped fade discrepancy — `daily-line.html:137-138` says 0.35/0.04 where `template-contract.md` (“The shadcn visual register”) and `scratch/shadcn/charts/chart-area-gradient.tsx:72-112` say 0.8/0.1; also read `chart-line-dots*.tsx` for the dot policy and `chart-label-custom`/`chart-line-label-custom.tsx` for the highlighted mark.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

resource-map.md not present at the 021 packet; coverage gate skipped (resource_map_present: false).

### Bounded Context Snapshot

Pointer-based, seeded at init from the 021 brief and a directory read of both corpora:

- The reference library (read-only): `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/` — `index.md` (52 page captures, each with the one idea worth borrowing) and `details/index.md` (210 element crops at 2x, 24 sources: vercel×3, carbon×5, apple×3, shadcn×4, tremor-area, mantine-area, layerchart, plot-area-docs, unovis-gallery, owid-life-expectancy). The tremor micro-form pages (spark, tracker, bar-list, blocks) are ROOT captures (`library/tremor-*.jpg`), not details crops — verified by directory listing at init.
- Our corpus (read-only for this loop): `.opencode/skills/sk-design/sk-design-chart/` — `assets/templates/*.html` (26 forms), `assets/examples/*.html` (7 deliveries), `assets/color/palettes.json` (the palette source), `screenshots/templates/*.png` (26) plus `screenshots/gallery.png` and `screenshots/color/palette-sheet-*.png`, `scripts/check-corpus.cjs` (2682 lines), `references/` (template-contract, color-system, catalog, design-md-theming).
- Shipped register (phases 15–19, recorded in the references; read the files, do not trust this list): five-part card in fixed order (`data-chart-part` markers); bare axes — no axis or tick lines, 8px tick margin; horizontal dashed grid; 2px series lines with dots off; area under line as a 0.8→0.1 vertical fade, 0.8→0.1 opacity stops; rounded marks via the corner ladder (2px mark, 4px track/swatch/pill, 8px card); the HTML tooltip card (bordered, shadowed, padded, muted label, mono value, per-series indicator, reads the form's `READOUT` block); legend as 8px/2px chips on a 16px row gap, one centered row below the plot, each chip a button that drives the dim; the cursor register (parchment/ink, ember, verdant, crimson, amber, the ember ordered ramp) with six contrast gates.
- Constraints that are not trade-offs: `checkNoExternalResources` — zero remote references, marks drawn by the file's own script; palette blocks matched against the source in both directions, no colour literal outside the block; series capacities neutral 4 / ordered 5 / categorical 4; no diverging system and no pattern fills (kept decisions, `color-system.md` §8); 18 of 26 forms carry the hover-card register, the other 8 print their readings or declare `data-chart-inert` with a reason.
- Integration points this research will touch read-only: the 26 templates' `CHART_DATA`/`CHART_SERIES`/`READOUT`/`CURVE`/`GEOMETRY DEFAULTS` blocks; the catalog's machine-read rows; the checker's rule list (25 enforced rules, 3 partial, 7+ reviewers-only surfaces).
- Known prior measurement (013 packet, cited from `color-system.md` §2): standalone categorical light 92.9° minimum adjacent hue gap, 3.37:1 minimum own/opposite-ground contrast, vs shadcn light 16.0°/1.72:1; dark 96.5°/3.38:1·1.72:1 vs shadcn dark 71.1°/2.92:1·2.15:1. The numbers supported keeping our role split and gates. Angle 4 recomputes what it needs from `palettes.json` rather than trusting these.
- Known non-goals: radar, pie/donut-arc, sankey stay absent (kept decisions, `catalog.md` §5–6); the pattern-fill and diverging-system reopeners are named there and are out of scope unless a new form needs them.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05 (telemetry only; stopPolicy = max-iterations)
- Per-iteration budget: 12 tool calls, 30 minutes — this loop fuses orchestrator, leaf and reducer in one process, so overshoot is disclosed in each iteration's assessment rather than treated as a failure
- Progressive synthesis: true
- `research.md` ownership: workflow-owned canonical synthesis at the lineage root (`research/lineages/glm/research.md`); iterations are appended under their own headings, never overwritten
- Lifecycle: `new`, generation 1; resume/restart live but unused; fork/completed-continue deferred
- Machine-owned sections: the reducer (this loop) controls strategy sections 3, 6, 7–11A
- Question injection: `inbox.jsonl` not used — the five angles are frozen by the brief
- Canonical pause sentinel: `.deep-research-pause` at the lineage root (not used; no human available mid-flight)
- State-note: the fanout runner owns `invocation-metadata.json`, the audit/effect ledgers and `locks-and-fencing-v1/`; this loop writes only its own artifact set beside them
- Spec-anchoring: the full workflow's `spec.md` fence write-back is OUTSIDE this lineage's write surface, so it is skipped by instruction; the synthesis lives here in `research.md`
- Continuity: `generate-context.js` would write outside the lineage, so it is NOT run (executor instruction); continuity recovery is from these packet docs by the parent
- Capability matrix: `.opencode/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Started: 2026-09-08T16:14Z (session fanout-glm-1788882013467-0smwwf)
