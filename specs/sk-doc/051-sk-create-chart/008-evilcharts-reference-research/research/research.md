---
title: "Cross-Lineage Synthesis: evilcharts reference research"
description: "The merged, adjudicated recommendation set from both research lineages, with the agreements, the four real disagreements and the operator decisions that gate the build."
trigger_phrases:
  - "evilcharts synthesis"
  - "chart visual overhaul recommendations"
  - "cross lineage merge"
  - "chart fidelity adjudication"
importance_tier: "important"
contextType: "research"
---
# Cross-Lineage Synthesis: evilcharts reference research

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Merges the two research lineages into one ranked set, names where they contradict each
> other, and settles each contradiction or hands it to the operator.

---

## 1. PROVENANCE

Two lineages read the same vendored subject, pinned at `500ecd44c1fdcf319ba83ea68f3771bc76125974`
under `context/evilcharts/`, MIT licensed.

| Lineage | Executor | Iterations | Synthesis |
| --- | --- | --- | --- |
| `deepseek-flash-max` | cli-devin, DeepSeek V4 Flash Max | 5 of 5 | 16 adoptions, 13 rejections |
| `glm-flash-xhigh` | cli-pi, `z-ai/glm-5.3-flash` at `xhigh` | 4 of 5 | 16 adoptions, 14 rejections |

The GLM lineage stopped one iteration short. Its missing iteration was the registry and install
question plus a final sweep. The DeepSeek lineage answered that same question in full, so the
gap is covered across the pair rather than left open. No sweep re-audited the merged list, which
is why every row below was re-read against both sources while writing this document.

The two lineages read different halves of the subject and that is why the merge is worth more
than either list. DeepSeek read the Recharts components and the registry. GLM discovered that
evilcharts ships an ECharts twin of every form and mined it for physical constants, which is
where the concrete numbers below come from.

---

## 2. THE CONSTRAINT THAT SHAPES EVERY ADOPTION

Both lineages arrived at the same blocker independently. The chart skill's own rule at
`SKILL.md:134` forbids copying a template, a fragment or a snippet from an outside chart
library, and it carves out nothing for licence. evilcharts is MIT, so the licence permits
reuse and the packet does not.

Every adoption below is therefore a re-implementation in the corpus idiom. That is the
default and it needs no decision. The one row where copying real code would have paid was the
decorative background patterns, and that row is rejected on other grounds in section 4, so the
licence question never becomes live. The rule can stay as written.

---

## 3. WHERE BOTH LINEAGES AGREE

These carry two independent readings and need no adjudication. They are the build.

Every path below resolves under `context/evilcharts/`, in `src/registry/charts/`,
`src/registry/ui/` or `src/app/`. Every row is an adopt-as-idea verdict, re-implemented in the
corpus idiom under the rule in section 2, and every row reaches one self-contained file with no
build step and no network. The route column names how.

| # | Change | Both cite | Route into one file |
| --- | --- | --- | --- |
| A1 | Grid dashed at `3 3` and drawn in a weakened rule colour, horizontal only | `recharts-bar-chart.tsx:484-489`, `echarts-line-chart.tsx:775` | One CSS line per template on the existing grid class |
| A2 | Every number in a system mono face with tabular figures, bound to the corpus formatter | `recharts-tooltip.tsx:152-156` | A system mono stack in the skeleton, no web font |
| A3 | Hover tooltip on mark-dense forms, 12px text, hairline border at half alpha, values in mono | `recharts-tooltip.tsx:86-92` | A positioned overlay toggled by pointer events over the inline drawing |
| A4 | A visual legend inside the figure for multi-series forms | `recharts-legend.tsx:42-49`, `:146-147` | Inline swatches and text inside the drawing |
| A5 | Hovering one series dims the others to 0.3 | `recharts-line-chart.tsx:542-548`, `echarts-bar-chart.tsx:107-108` | One handler per series group adjusting opacity |
| A6 | First-paint reveal, a one second left-to-right mask wipe, gated on the reduce-motion preference | `recharts-line-chart.tsx:59-76` | Keyframes on a mask rectangle, settled before the first second |
| A7 | A two-weight dot language, small dots with a background-coloured ring on the emphasized point | `recharts-dot.tsx:83-116` | Plain circles, the ring filled with the surface token |
| A8 | A dark theme derived under the palette rule, with hues re-chosen rather than lightened | `globals.css:102-147` | A second media-scoped block of custom properties in the same style element |
| A9 | Area fills fade toward the baseline rather than sitting at a flat opacity | `recharts-area-chart.tsx:766-768` | A gradient in the file's own defs, painted from the series tokens |

A2 carries a correction both lineages ended up making. evilcharts formats values with
`toLocaleString`, which is host-locale dependent. The corpus formatter shipped in the fidelity
pass is stricter and stays. Only the visual treatment is adopted.

---

## 4. WHERE THEY CONTRADICT EACH OTHER

Five real forks. Each is recorded with the losing argument intact so none is relitigated. The
fifth was missed when this document was first written and is marked as such.

**D1. Series stroke weight.** DeepSeek ranks thinning from 2px to 0.8px as the change that buys the most
visible payoff, and calls it the reason the corpus looks plain. GLM rejects it outright, citing
the corpus comment that declares the 2px round cap a deliberate print register, and notes that
no evidence ties the weight to the defect.

Neither can settle this from reading source, because it is a question of taste about a
deliberate choice. Resolution: render the same chart at three weights and let the operator
choose. This is the first thing the build does, and until it is answered nothing else about
line weight moves.

**D2. Glow behind the emphasis line.** DeepSeek rejects it as a dashboard effect that prints
badly. GLM adopts one layer at low opacity while rejecting the four-layer stack evilcharts
actually ships. They agree the stack is wrong and differ only on whether one layer earns its
place. Resolution: it rides the same render comparison as D1, and it defaults to off.

**D3. Decorative plot-background patterns.** DeepSeek treats the eleven pattern variants as an
operator choice, gated on the copy rule. GLM rejects them because decoration behind data biases
value reading in a static deliverable, and points at the corpus decision that already keeps
pattern fills out.

GLM's reason is substantive and consistent with a rule the corpus already holds. Resolution:
rejected. This also retires the only live question about the copy rule.

**D4. A draggable range window on dense series.** DeepSeek rejects it because a stateful figure
breaks the rule that two screenshots of one file agree. GLM adopts it for series past thirty
points and answers the objection with a direct mapping that carries no physics.

The determinism rule targets automatic variation such as randomness and clocks, not a reader
choosing to look closer. A window that opens at the full range paints identically every time.
Resolution: allowed, but last, and only where a form is genuinely dense.

**D5. Interaction hygiene.** Both lineages read the same block, which suppresses the focus ring
on drawing shapes and stops text being selected. GLM adopts both rules for any form that gains a
pointer. DeepSeek rejects both, on the ground that a delivered chart is a document, so keyboard
focus and copyable numbers are features rather than noise.

This one was missed on the first pass through the two lists and was caught while planning the
build. DeepSeek has the better argument on both halves, but only one half is all-or-nothing.
Resolution: the focus ring is suppressed for pointer interaction only, through the selector that
leaves keyboard focus visible, and the rule that stops text being selected is rejected outright
because the numbers in a delivered chart are meant to be copyable. The build phase that adds
interaction carries this narrowed form.

Two smaller splits resolve by merging rather than choosing. On corner radius, GLM measured that
the existing 10px is already uniform across all twenty forms and proposes formalizing it, while
DeepSeek proposes a contextual ladder. Both land: the ladder is the change, tokens are how it
becomes checkable. On the composed bar-and-line form, DeepSeek proposes building it and GLM
proposes recording it as a catalog gap. Building it answers more, so it is built, but late,
because a new form does not fix how the existing twenty look.

---

## 5. UNIQUE CONTRIBUTIONS WORTH KEEPING

From DeepSeek alone: a notice when the data block holds nothing readable, so an empty figure
says so rather than drawing a blank box. A catalog audit finding that `grouped-bars` sits on the
neutral system while the same kind of form elsewhere sits on categorical. A gradient stroke
allowed only on ordered-system forms, where a sweep along the ramp carries real meaning. One
block of shared geometry defaults in the skeleton so the corpus stops varying margins by hand.

From GLM alone: bars that grow from the baseline over half a second with a cubic ease. A two
pixel radius on bar ends. Round tick dots in place of tick marks. Naming each family example after a real scenario so
the headline-as-argument rule is demonstrated instead of asserted. Catalog prose that names the
three forms evilcharts has and the corpus does not, each with the reason.

---

## 6. THE OPERATOR DECISIONS

Four, and only the first blocks work.

1. **Line weight and glow.** Answered by looking at renders, not by argument. It gates the
   visual pass.
2. **Dark theme.** Both lineages recommend it. It is a contract amendment, because the contract
   says one palette block per file, and a media-scoped twin makes two.
3. **A multi-hue series.** Allowing one series to carry a colour range needs the colour system
   document to say when that is honest.
4. **The composed form.** Whether the catalog gains a bar-and-line form with a second scale.

---

## 7. WHAT THE BUILD LOOKS LIKE

Seven pieces of work, in dependency order. The first settles taste on two forms before anything
rolls out, which is the mistake worth avoiding.

1. Prove the chrome on two templates and settle the weight and glow forks with renders.
2. Roll the settled chrome across all twenty templates, the six examples and the skeleton.
3. Add motion, both the reveal and the bar growth, gated on the reduce-motion preference, with a
   determinism proof.
4. Add the interaction layer: tooltip, legend, dim and hygiene.
5. Add the dark theme, re-run the contrast gates per theme, extend the corpus checker.
6. Correct the catalog and contract: the system reassignment, the gap prose, the type scale, the
   empty-data notice, the shared defaults.
7. Add the composed form and the scenario naming, extend the checker for every new invariant,
   then version and close.
