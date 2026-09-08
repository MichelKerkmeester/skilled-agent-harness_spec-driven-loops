GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. Nobody is at a prompt; no answer can reach you.
Your write authority is your lineage directory under:
  specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/021-visual-upgrade-research/research/lineages/
Write nothing outside it. Proceed directly to the work.

---

# TASK

Decide what our standalone chart corpus should visually upgrade, judged against a curated
library of well-designed charts from outside. Evidence, not preference. Five angles, one per
iteration, in order. Do not converge early: five iterations are required.

# THE LIBRARY IS LOCAL. DO NOT FETCH ANYTHING.

  specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/
    index.md                 52 page captures: source, kind, and the one idea worth borrowing
    index.json               the same as data
    *.jpg                    the page captures, 1200 wide
    details/index.md         210 zoomed chart crops at 2x, grouped by source page, one note each
    details/index.json       the same as data
    details/*.jpg            the crops: Vercel, Carbon, Apple, shadcn, Tremor, Mantine, LayerChart, Observable Plot, Unovis, Our World in Data

If your tooling can open an image, open the crops named in each angle and describe what you
actually see, not what the note says. If it cannot, say so once in the first iteration and
work from the index notes plus the sources' own HTML and CSS where those are local
(the frozen shadcn copy is at
`specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/scratch/shadcn/`).

Ours is at `.opencode/skills/sk-design/sk-design-chart/`:
  assets/templates/*.html     the 26 forms; each carries CHART_DATA, palette, geometry, READOUT and CURVE blocks
  assets/examples/*.html      seven deliveries
  assets/color/palettes.json  the palette source: cursor Style Reference values, three systems, gates
  screenshots/templates/*.png what ours look like today, both schemes in the gallery capture
  scripts/check-corpus.cjs    the checker: every family that binds a template
  references/template-contract.md, color-system.md, catalog.md, design-md-theming.md

# THREE FACTS THAT ARE NOT UP FOR DEBATE

1. **Nothing ports.** `checkNoExternalResources` errors on any external reference. React,
   Recharts, Tailwind, D3 and fonts by URL are constraints, not trade-offs. Decisions transfer;
   code never.
2. **The palette source and its gates are the register.** A recommendation that needs a
   colour the gates refuse, or a contrast below the mark gate, is a recommendation to change
   the gate and must say so.
3. **Phases 15 to 19 already happened.** Card footer, bare axes, horizontal dashed grid,
   rounded marks, gradient areas, the HTML tooltip card, legend chips, the cursor register and
   the typeface are shipped. Read the current templates before claiming a gap.

# THE FIVE ANGLES, ONE PER ITERATION, IN ORDER

**1 — Card anatomy, typography and spacing.** Compare our card (header, plot, legend, footer
finding, source) against the Vercel panels (`details/vercel-*`), Apple's step and heart-rate
cards (`details/apple-hig-charts-*-07`, `-08`, `apple-health-*`), Carbon's anatomy diagram
(`details/carbon-anatomy-*`), Tremor's KPI blocks (`tremor-blocks-*`) and shadcn's cards
(`details/shadcn-line-*`). Measure what you can: header hierarchy, number prominence, margins,
plot height to card width, footer weight. Where does ours read as a template rather than a
product?

**2 — Marks: lines, areas, bars and their fills.** Line weight, dot policy, area gradient and
opacity, bar radius and gap, stacked separators, the highlighted mark. Sources:
`details/shadcn-line-*`, `shadcn-area-*`, `shadcn-bar-*`, `tremor-area-*`, `mantine-area-*`,
`plot-area-docs-*`, `layerchart-*`, `unovis-gallery-*`, `carbon-storybook-*`. Say what ours
does per form today by reading the template, then what the library does, then what to change.

**3 — Tooltip, legend and interaction states.** Our card reads `READOUT`; compare with every
shadcn tooltip variant (`details/shadcn-tooltip-dark-01` to `-09`), the Vercel tooltip
(`details/vercel-analytics-*-03`), Carbon's tooltip and legend rules (`carbon-anatomy-*`,
`carbon-legends-*`), Mantine's legends. Hover dimming, indicator shapes, header content,
number alignment, legend placement and interactivity.

**4 — Colour and the dark ground.** Ours is the cursor register: parchment and ink, ember,
verdant, crimson, amber, an ember ramp. Compare against Carbon's palettes on light and dark
(`details/carbon-palettes-*`), Apple's system colours, shadcn's blues, Vercel's monochrome with
one accent, Observable Plot's monochrome. Measure contrast where you can from the known hex
values in `palettes.json`; judge hue harmony and the dark ground by eye where you can see the
crops. **This angle fails if it returns adjectives.** Numbers or nothing.

**5 — Missing forms and what the checker learns.** Micro-visualisations the library has and we
lack: spark line, spark area, spark bar, tracker, bar list, KPI card with delta, progress
circle, radial ring (`tremor-*`, `layerchart-*-01` to `-04`, `vercel-analytics-*-01`, Apple's
rings). Decide which earn a place under our question-first catalogue and which are
decoration. Then sort every finding from angles 1 to 4 into enforceable in
`check-corpus.cjs` versus per-template judgement, naming the assertion and what it errors on.

# DO

- Cite every claim to a capture file name or a local file and line.
- Append each iteration to `research/lineages/<your label>/research.md` under its own heading.
- Rank recommendations; mark each [implementable today] or [needs a gate or contract change].
- Say plainly when ours is already better. That is a finding too.

# DO NOT

- Do not fetch anything. Everything is local.
- Do not propose a dependency, a build step or a framework.
- Do not rebuild a template. This phase produces findings; a later one implements.
- Do not write outside your lineage directory.

# OUTPUT SHAPE

```
## Iteration <n> — <angle name>

### What was read
<capture file names and local files, with line references>

### What was seen or measured
<what the images show, or the numbers computed, and how>

### Findings
<numbered, each with its evidence>

### Recommendations
<ranked; each [implementable today] or [needs a gate or contract change]>

### What this iteration could not settle
<explicit, or "nothing">
```
