# Iteration 6: Checker-Enforceable Findings and Judgement Boundaries

## What was read

- The static checker baseline and main check sequence: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:2015-2180]`.
- Current data, palette, accessibility, interaction, and series-mapping assertion branches: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:220-363]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:457-642]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:776-865]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:809-839]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:1129-1238]`, and `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:1412-1490]`.
- Catalog and pointer-contract coverage, including render-dependent card and pointer checks: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:1492-1592]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:1713-1912]`, and `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:2071-2157]`.

## What was measured

The authoritative static baseline was run before the loop with `node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs`: 35 files scanned, 26 chart forms, every listed assertion at 0 failures, `errors: 0`, and `RESULT: PASSED`. The render path was not run because the browser inventory was empty. The current checker already provides machine boundaries for structural, palette, catalog, accessibility, static interaction, and source-determinism claims; it does not provide semantic decisions for all five research angles.

| Finding class | Existing assertion | What it errors on now | Classification |
|---|---|---|---|
| Form identity and catalog coverage | `catalog` | Missing catalog sentinels; duplicate IDs; rows with no file; nonexistent targets; row/file identity mismatch; on-disk form with no row | Enforceable today |
| Declared color system | `catalog-system` | Missing system column or row system; unknown palette system; row/system mismatch | Enforceable today |
| Single adjustment receipt | `data-block` | Anything other than exactly one `CHART_DATA` begin/end pair, or an end marker before the begin marker | Enforceable today |
| Deterministic data/render | `determinism`, `script-parses` | `Math.random()`, current time reaching rendering code, or an inline script that does not compile | Enforceable today |
| Palette source and literals | `palette-source`, `palette-source-dark`, `palette-block`, `colour-literals` | Missing roles; below-gate contrast; wrong capacity/order/ramp step; bad dark alpha; palette block drift; raw hex/rgb/hsl/named/non-token paint | Enforceable today |
| Indexed series meaning | `series-mapping`, `gradient-sweep` | Class paints the wrong index; missing rung; over-capacity ladder; `CAPACITY` mismatch; non-ordered gradient between series values | Enforceable today |
| Static accessibility/readout | `accessibility`, `card-parts`, `empty-notice`, `number-format` | Missing SVG role/label/table; wrong fixed card parts; malformed or non-stopping empty guard; locale formatter or tooltip without local `fmt()` | Enforceable today |
| Static interaction contract | `interaction-hygiene`, `interaction-state`, `pointer-contract-coverage` | Inert plus active register; inert without reason; active register without focus rule; unconditional outline removal or `user-select:none`; pre-open dim/tooltip; missing or extra pointer-contract row | Enforceable today |
| Rendered pointer/readout behavior | `card-readout`, `pointer-reach` | Browser driver cannot open/read a card, card exposes values absent from the table, wrong mark, dead near-mark sample, or incomplete driver result | Enforceable when a browser exists; not proven in this run |
| Shared geometry record | `geometry-block`, `radius`, `type-scale` | Missing/drifting geometry defaults, radius outside the published ladder, or text size outside published rungs | Enforceable today, but not a domain-semantics choice |
| Gallery and delivery | `gallery`, `narrow-viewport`, `motion`, `no-external` | Missing gallery coverage, missing narrow-screen affordance, motion contract drift, or external resource dependency | Enforceable today, not a finding from the shadcn comparison |

## Findings

1. **OBSERVED, high confidence:** The catalog decision from iteration 1 is enforceable at the identity level. `catalog` catches duplicate, missing, nonexistent, mismatched, and unindexed forms; `catalog-system` catches a row whose color-system declaration disagrees with the file: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:1492-1592]`. The checker cannot decide whether radar should exist or whether `parallel-axes` is the better reader-question answer; that remains catalog judgement backed by `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:143-160]`.

2. **OBSERVED, high confidence:** The adjustability finding has partial enforcement. `data-block` can reject extra/missing sentinel pairs, `determinism` rejects clocks and randomness, `colour-literals` rejects paint outside token indirection, and `series-mapping` rejects index/capacity drift: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:776-865]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:457-642]`, and `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:1412-1490]`. No current assertion can prove that changed prose, units, or a reader question still matches the replacement data.

3. **OBSERVED, high confidence:** The tooltip and table contract is substantially enforceable today. `accessibility` errors on missing `role="img"`, missing/unresolved `aria-labelledby`, or missing `data-chart-table`; `number-format` errors on locale formatting or a tooltip with no local formatter; `interaction-hygiene` and `interaction-state` catch the static focus/inert/open-state failures; and `pointer-contract-coverage` catches missing or stale per-form rows: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:809-839]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:1129-1238]`, and `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:2071-2157]`.

4. **OBSERVED, high confidence:** Actual pointer/card behavior is a separate browser gate. `card-readout` errors when no card opens, when a card shows values absent from the table, or when its driver cannot complete; `pointer-reach` errors on wrong-mark or dead near-mark samples and incomplete drivers: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:1713-1757]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:1867-1912]`. Because no browser was available, these assertions were not run and no runtime parity claim is made.

5. **OBSERVED, high confidence:** Existing palette assertions enforce the current numeric contract, not the new CVD/hue measurements. `palette-source` and `palette-source-dark` report missing roles, below-gate text/mark/emphasis contrast, wrong capacity, ramp-step/order failures, and invalid dark rule alpha; `palette-block` reports source drift; `colour-literals` reports raw paint; `series-mapping` reports index/capacity mismatch: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:220-363]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:457-642]`, and `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:1412-1490]`. There is no CVD or adjacent-hue assertion.

6. **OBSERVED, high confidence:** Data-accuracy semantics are not currently asserted. `geometry-block` checks that a shared defaults comment agrees across files, and `empty-notice` checks that a notice can stop an empty drawing, but neither chooses a correct domain, zero baseline, stacking order, interpolation, null policy, or tick budget: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:1240-1268]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:1280-1340]`. Those decisions remain per-template judgement.

7. **DERIVED, high confidence:** Four new assertion families would require a corpus change rather than a wording change alone: `keyboard-contract` for focusable controls and Enter/Space paths; `palette-cvd`/`palette-hue` for agreed CVD and hue thresholds; `curve-contract`/`data-accuracy` for metadata-driven smoothing, null, domain, and tick rules; and `retargetability` for a machine-readable semantic manifest. None should be added without the metadata or threshold policy that makes its error meaningful.

## Recommendations

1. **[implementable today]** Use the current checker as the hard static gate for catalog identity, one-block determinism, palette/source/index consistency, accessible table floor, static interaction hygiene, number formatting, and pointer-contract coverage.
2. **[implementable today]** Keep per-template judgement for form choice, radar/pie substitutions, tooltip indicator flags, actual semantic formatters, domain/baseline/tick decisions, stacking order, and interpolation intent. Record those decisions in the catalog/template review rather than pretending the checker can infer them.
3. **[implementable today]** Treat render-dependent card and pointer results as unknown when no browser is present. Do not convert source handlers into runtime proof.
4. **[needs a corpus change]** Add a browser-backed `keyboard-contract`/runtime gate if keyboard parity becomes a release requirement.
5. **[needs a corpus change]** Add CVD/hue checks only after the palette policy chooses reproducible models and thresholds.
6. **[needs a corpus change]** Add data-accuracy and retargetability assertions only with explicit semantic metadata; otherwise they would encode guesses.

## What this iteration could not settle

No browser-backed keyboard or pointer result, no product decision for candidate missing forms, no universally agreed CVD/hue threshold, and no semantic manifest for proving prose/unit/data alignment were available. These are explicit evidence gaps, not inferred passes.

## Assessment

- New-information ratio: **0.88**.
- Novelty: high; the result names existing assertion/error boundaries and four concrete new-contract families.
- Confidence: high for checker behavior and baseline output; medium for future assertion designs because their metadata/policies do not yet exist.
- Convergence telemetry: six angles are complete. Any convergence signal is telemetry only; the configured terminal policy is max-iterations.

## Reflection

The corpus already has a strong mechanical floor. The best adoption decisions are selective: shadcn contributes token indirection, local tooltip knobs, and explicit interpolation variants; the standalone corpus retains question-first forms, role-specific palettes, direct paths, explicit gaps/scales, table fallback, and inert decisions. The remaining gaps are not solved by adding more shadcn variants; they need either runtime evidence or a new semantic contract.

## Recommended Next Focus

Phase synthesis: merge all six angle records, rank adopt/retain/change decisions, list eliminated alternatives, and record `stopReason: maxIterationsReached`.
