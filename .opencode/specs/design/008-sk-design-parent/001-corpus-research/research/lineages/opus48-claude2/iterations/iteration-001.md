# Iteration 1: Corpus inventory and first-pass clustering

## Focus
Sweep the full external corpus — all 41 standalone design-skill docs plus the two subdirectories (`designer-skills-main`, `apple-bento-grid-main`) — and map every artifact to a capability domain to produce the first-pass clustering that the taxonomy will be built from.

## Findings

### F1 — The 41 standalone docs split into ~7 natural capability domains
From front-matter `name`/`description` across all standalone docs, the corpus clusters as:

1. **Generative interface build / "taste"** (distinctive, anti-generic UI from a brief): `taste-skill` (design-taste-frontend), `gpt-tasteskill` (gpt-taste), `bencium-innovative-ux-designer`, `emil-design-eng`, `make-interfaces-feel-better`, `impeccable`, `design-lab`, `redesign-skill`, `canvas-design`. [SOURCE: external/taste-skill.md], [SOURCE: external/bencium-innovative-ux-designer.md], [SOURCE: external/emil-design-eng.md], [SOURCE: external/impeccable.md]
2. **Named aesthetic directions / style systems**: `brutalist-skill` (industrial-brutalist-ui), `minimalist-skill` (minimalist-ui), `soft-skill` (high-end-visual-design), `stitch-skill` (stitch-design-taste). [SOURCE: external/brutalist-skill.md], [SOURCE: external/minimalist-skill.md], [SOURCE: external/soft-skill.md], [SOURCE: external/stitch-skill.md]
3. **Color & design tokens**: `oklch-skill`, `colorize`. [SOURCE: external/oklch-skill.md], [SOURCE: external/colorize.md]
4. **Layout / spacing / hierarchy**: `layout`, `baseline` (baseline-ui), `adapt` (responsive). [SOURCE: external/layout.md], [SOURCE: external/baseline.md], [SOURCE: external/adapt.md]
5. **Motion / animation / micro-interaction**: `animate`, `interaction-design`, `delight`, `12-principles-of-animation`, `mastering-animate-presence`, `morphing-icons`, `fixing-motion-performance`, `pseudo-elements`. [SOURCE: external/animate.md], [SOURCE: external/interaction-design.md], [SOURCE: external/12-principles-of-animation.md], [SOURCE: external/mastering-animate-presence.md]
6. **Audit / critique / QA / production-hardening / accessibility / performance**: `audit`, `critique`, `polish`, `harden`, `optimize`, `fixing-accessibility`, `fixing-motion-performance`. [SOURCE: external/audit.md], [SOURCE: external/critique.md], [SOURCE: external/harden.md], [SOURCE: external/fixing-accessibility.md]
7. **Tone / intensity transforms & copy** (modifier verbs): `bolder`, `quieter`, `overdrive`, `distill`, `clarify`, `colorize`, `delight`. [SOURCE: external/bolder.md], [SOURCE: external/quieter.md], [SOURCE: external/distill.md], [SOURCE: external/clarify.md]

Plus **output/presentation** (`frontend-slides`, `slidev`) and **meta/infra** (`output-skill` = full-output-enforcement; `ui-skills-root` = a CLI-backed selector), which look adjacent/out-of-scope for a *design-judgment* family. [SOURCE: external/frontend-slides.md], [SOURCE: external/slidev.md], [SOURCE: external/output-skill.md], [SOURCE: external/ui-skills-root.md]

### F2 — The corpus contains TWO router/umbrella precedents inside it
- `impeccable.md` is itself an umbrella: its description enumerates the operation set "design, redesign, shape, critique, audit, polish, clarify, distill, harden, optimize, adapt, animate, colorize, extract" — i.e. it is a single skill that fronts the same verbs that appear as standalone docs (`audit`, `polish`, `clarify`, `distill`, `harden`, `optimize`, `adapt`, `animate`, `colorize`, `critique`, plus `bolder`/`quieter`/`overdrive`/`delight`/`layout`/`baseline`). This is direct in-corpus evidence for an **umbrella-over-a-verb-family** model. [SOURCE: external/impeccable.md]
- `ui-skills-root.md` (name `ui-skills-root`) is a **root selector**: "Use before UI-related work to select the smallest useful UI Skills context through the ui-skills CLI." This is a router/dispatcher precedent. [SOURCE: external/ui-skills-root.md]

### F3 — designer-skills-main is a 3-level marketplace: marketplace → 9 plugin collections → ~96 narrow skills
The repo is a Claude plugin **marketplace** (`.claude-plugin/`) over 9 sibling plugin collections, each with its own `.claude-plugin/`, `commands/`, and `skills/` folder:
- `ux-strategy` (12 skills, commands: benchmark/frame-problem/strategize)
- `design-research` (12 skills: affinity-diagram, jobs-to-be-done, journey-map, user-persona, usability-test-plan…)
- `ui-design` (14 skills: color-system, typography-scale, spacing-system, layout-grid, visual-hierarchy, responsive-design, dark-mode-design, data-visualization + Gestalt laws)
- `interaction-design` (16 skills: form-design, loading-states, navigation-patterns, micro-interaction-spec, feedback-patterns, state-machine + UX laws fitts/hicks/miller/doherty)
- `design-systems` (11 skills: design-token, theming-system, component-spec, pattern-library, icon-system, motion-system, accessibility-audit, naming-convention…)
- `visual-critique` (7 skills: critique-color/typography/composition/visual-hierarchy/affordance/brand-consistency/information-density)
- `prototyping-testing` (8 skills: wireframe-spec, prototype-strategy, heuristic-evaluation, a-b-test-design, accessibility-test-plan…)
- `design-ops` (9 skills: design-critique, design-qa-checklist, design-review-process, handoff-spec, team-workflow…)
- `designer-toolkit` (7 skills: ux-writing, case-study, design-rationale, presentation-deck, design-token-audit, design-negotiation, design-system-adoption)

Total ≈ 96 skills across 9 collections (the "97" claim is within rounding of my count). Each collection bundles single-purpose SKILL.md files + slash commands, exposed both as Claude plugins and Gemini extensions (`.gemini/extensions/*/GEMINI.md`). [SOURCE: external/designer-skills-main/README.md], [SOURCE: external/designer-skills-main/ui-design/skills/], [SOURCE: external/designer-skills-main/interaction-design/skills/]

### F4 — apple-bento-grid-main is a single narrow "named-aesthetic" skill, not a family
It is one skill package (`SKILL.md` + `design-system.md` + `examples/` + `evals/` + `scripts/screenshot.mjs`) producing Apple-style bento-grid layouts. It is a *leaf* example of the "named aesthetic direction" domain (cluster 2), with its own eval harness — evidence that named-aesthetic skills can ship as self-contained packages. [SOURCE: external/apple-bento-grid-main/SKILL.md], [SOURCE: external/apple-bento-grid-main/design-system.md], [SOURCE: external/apple-bento-grid-main/evals/evals.json]

## Sources Consulted
- `external/*.md` front-matter (41 standalone docs) via grep of `name:`/`description:`.
- `find` tree of `external/designer-skills-main/` (9 collections, ~96 SKILL.md + commands).
- `find` tree of `external/apple-bento-grid-main/` (single skill package + examples/evals/scripts).

## Assessment
- **newInfoRatio: 1.0** — First pass; the entire corpus map, the 7-cluster split, and the two in-corpus router precedents are all new to this packet.
- **Novelty justification:** Establishes the full evidence inventory and surfaces the impeccable/ui-skills-root umbrella precedents plus the designer-skills-main 3-level marketplace, which directly seed KQ4/KQ6.
- **Confidence:** High on the inventory (direct from front-matter + tree); medium on cluster boundaries (front-matter only — bodies not yet read).

## Reflection
- **Worked:** Front-matter grep + directory tree gave a complete, cheap, cited inventory without reading 41 full bodies.
- **Worked:** Two structural precedents (impeccable umbrella, designer-skills-main marketplace) emerged for free and will anchor the hub-vs-umbrella question.
- **Ruled out (this iteration):** Treating `output-skill` (full-output-enforcement) and `ui-skills-root` as design-judgment sub-skills — they are meta/infra, not design taste; they inform *structure*, not the taxonomy's children.

## Recommended Next Focus
Iteration 2: Deep-read the designer-skills-main organizing model (READMEs + a sample of collection SKILL.md files) to extract the explicit collection→skill taxonomy and the criteria it uses to draw collection boundaries — the most mature taxonomy precedent available.
