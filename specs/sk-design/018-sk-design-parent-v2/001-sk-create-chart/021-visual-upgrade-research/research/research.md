# Visual upgrade research: cross-lane synthesis

Two lineages read the same five-angle brief against the phase 20 library. The `luna` lane
(GPT-5.6 Luna via codex, max reasoning, fast tier) completed all five angles. The `glm` lane
(GLM-5.3-Flash via pi over the DevPass gateway, max thinking) completed angle one in fifty-six
minutes and was stopped by the conductor before its second iteration, because the fan-out runner's
write-containment sweep reverts any tracked file changed elsewhere in the checkout while a lane
runs, and another session was editing 932 files in the same checkout at the time. The lane's
own work is intact under `lineages/glm/`; the remaining four angles are open for a rerun in an
isolated worktree.

Sources: `lineages/luna/research.md` (five iterations and a final synthesis),
`lineages/glm/research.md` (iteration one).

## Where the lanes agree

1. **Keep the shipped card shell.** Both lanes measured the 760px card, the 16/14/12 scale, the
   footer rule and the finding-and-source pair against Vercel, Apple, Carbon and shadcn and found
   them at parity dimension for dimension. Neither found a case for dashboard chrome or a larger
   shell. [luna it.1] [glm it.1 finding 1, 6]
2. **The one anatomy gap is a prominent number.** Scalar and time-series forms carry their
   reading only as 14px prose, while Apple's step cards, Vercel's panels and Tremor's blocks lead
   with a value and a signed delta. Both lanes recommend an optional metric-and-delta block in
   the header zone, only where the data supplies a meaningful baseline, with the values still in
   the chart table. [luna it.1, rec.4] [glm rec.1, rec.2]
3. **Ours is already better in two places.** The headline-as-conclusion rule against shadcn's
   label-plus-date-range titles, and tabular numerals pinned on ticks as well as tooltip values
   where shadcn pins them on tooltip values only. [glm finding 3] [luna it.3]

## What each lane adds

**Luna, angles two to five.**

- Marks: keep the 2px line, the restrained single-area fade, flat separated stacks and
  baseline-anchored columns. Add two per-form policies: a sparse-point policy (visible dots
  only on sparse or short series) and a meaningful-zero signed-area policy (positive and
  negative fills split at a meaningful zero, as Mantine and Plot show). Rule out smooth
  interpolation, gradient stacks, universal dots and baseline rounding. [luna it.2]
- Tooltip and legend: keep the card geometry, table-backed readout, below-plot legend and
  reversible dimming. Add per-series indicator kinds (`swatch`, `rule`, `none`) so a composed
  form's line is not represented by a bar-shaped indicator, and allow data-backed contextual
  totals. A cursor guide is earned only by a dense multi-series form. [luna it.3]
- Colour: the cursor palette clears both grounds with narrow margins (light neutral and
  categorical minima 3.01:1 and 3.02:1, light ordered step 1.30:1, dark minima 5.94:1, 3.05:1
  and 1.32:1). No external source in the library exposes hex values, so no external contrast
  claim was made. Keep the palette. [luna it.4]
- Missing forms: add `spark` (line, area, bar variants) for the compact trend question, `tracker`
  for discrete status over time, and `bar-list` as a compact ranked list with in-bar labels.
  Do not add progress circles or radial rings: `progress-single`, `unit-ring` and `unit-grid`
  already answer those questions honestly. [luna it.5]
- Checker: two proposed assertions once their declarations exist in the contract,
  `mark-policy` (point, curve, fill, meaningful-zero declared; a signed area needs a zero
  baseline) and `tooltip-indicator` (indicator kind matches the declared mark kind). Headline
  quality, metric eligibility and guide density stay review judgements. [luna it.5]

**GLM, angle one.**

- **Figure aspect is the divergence.** A survey of all 26 viewBoxes puts plot height between
  24.4% and 55.6% of frame width, median 43.4%, against the reference register's locked 56.25%
  (16:9), about thirteen points shorter at the median. Whether that is what reads as
  "template" needs the crops this lane could not see; Luna, which could, did not flag it, so
  the point is open rather than agreed. [glm finding 1]
- **A contract discrepancy.** `template-contract.md` still states the single-area fade as
  0.8 to 0.1 while `daily-line.html` ships 0.35 to 0.04 since phase 17. One of them is wrong
  on paper; the file is the intended behaviour. [glm "could not settle"]
- **The metric size must join the published type scale.** A 24 to 28px value rung is a
  `palettes.json` `typeScale` edit, not a template-local size, or the type-scale family
  refuses it. [glm rec.3]

## Ranked backlog

| # | Item | Lanes | Tag |
|---|------|-------|-----|
| 1 | Optional metric-and-delta header block on scalar and time-series forms, values in the table, direction cue as an inline shape | both | needs a contract change: a new type-scale rung and a header declaration |
| 2 | `spark` family (line, area, bar) as one question family | luna | needs a catalogue entry and templates |
| 3 | `tracker` for discrete status over time, categorical role only | luna | needs a catalogue entry and a template |
| 4 | `bar-list` as a compact ranked variant sharing `bar-rows` semantics | luna | needs a catalogue entry and a template |
| 5 | Per-form sparse-point and meaningful-zero signed-area policies, declared in the geometry block | luna | needs a contract change, then `mark-policy` |
| 6 | Per-series tooltip indicator kinds and the `tooltip-indicator` assertion | luna | needs a contract change |
| 7 | Fix the fade figures in `template-contract.md` to match the shipped templates | glm | implementable today |
| 8 | Decide the figure-aspect question with the crops in view | glm, open | research, one sitting |

## Not to do

Dashboard chrome, a larger card shell, global dots, smooth stacks, gradient stacks, baseline
rounding, global tooltip restyling, a permanent cursor guide, legend relocation, a raw shadcn blue
family, reversed dark arrays, categorical sweeps, progress circles and radial rings. Both lanes
that reached the question agree on every item in this list.

## Run record

- luna: 5 iterations, `stopReason: maxIterationsReached`, ratios 0.86, 0.78, 0.72, 0.68, 0.74;
  the runner then marked the lane failed for write containment after reverting 1,858 paths
  outside the lineage directory, none of them lineage output; the research artefacts are complete.
- glm: 1 iteration in 56 minutes, text-only (the executor's image reads returned no pixels);
  stopped by the conductor to prevent a second containment sweep over another session's live edits.
