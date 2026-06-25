# Iteration 10: Synthesized taxonomy — the recommended 4–7 children (KQ4)

## Focus
Prune and merge the candidate clusters into a recommended child set, with crisp scope, boundaries, and resolved overlaps, applying a consistent inclusion test.

## Findings

### F41 — Inclusion test: a cluster earns its own child when it is (a) deep, (b) independently invokable, (c) has its own reference corpus
Applying the test to the iter-9 clusters:
- interface/taste — deep ✓, invoked standalone ("design this", "redesign") ✓, own references (design_principles, variation_diversity, real_ui_loop) ✓ → **child**.
- audit/QA — deep ✓, invoked standalone ("audit my UI", "fix a11y") ✓, shared review contract ✓ → **child**.
- design-spec (DESIGN.md) — deep ✓ (Playwright backend), invoked standalone ("extract design tokens") ✓, own references ✓ → **child**.
- motion/interaction — deep ✓ (timing/easing/materials + framer-motion patterns + motion-perf), invoked standalone ("add animations", "fix jank") ✓ → **child**.
- color/tokens AND layout/structure — each deep with its own references; BUT they are the *static visual token layer* and are frequently invoked together as "the look's foundations." → merge into ONE **foundations** child, with an explicit split-to-two escape hatch if advisor data shows users ask for color and layout separately.
- presentation/static-graphics — design-adjacent artifact output, not interface → **optional/swing child**, defer to phase 002.

### F42 — RECOMMENDED PRIMARY TAXONOMY: 5 core children (+1 optional)
1. **sk-design-interface** *(flagship; keep existing name)* — Decide and build a distinctive, non-templated interface direction. Scope: grounding, token-system brainstorm, anti-AI-default critique, build, self-critique, N-direction exploration, in-place redesign, and interface writing. Sources: existing sk-design-interface + taste-skill, gpt-taste, bencium, emil, impeccable (identity/craft/shape), make-interfaces-feel-better, design-lab (explore mode), redesign-skill (apply), soft + named-aesthetic presets as references. Boundary: owns *direction & build*; delegates token math to foundations, motion to motion, review to audit, artifact capture to spec.
2. **sk-design-foundations** — The static visual system: color (OKLCH conversion, palettes, contrast, gamut, theming, dark mode), typography (scale, pairing, measure), layout/spacing/hierarchy/grid, responsive/adapt. Sources: oklch, colorize, layout, baseline (layout/type/color rules), adapt; designer-skills ui-design + design-systems token/theming. Boundary: owns *what the static system IS*; not motion, not direction-from-scratch.
3. **sk-design-motion** — The temporal layer: purposeful animation, micro-interactions, transitions, motion materials, reduced-motion. Sources: animate, interaction-design, delight, morphing-icons; designer-skills interaction-design + motion-system. Boundary: owns *motion build*; motion-performance *review* lives in audit (motion references it).
4. **sk-design-audit** — Cross-cutting QA & critique: a11y, performance, responsive, theming, anti-pattern/slop detection, design-quality scoring, production hardening. Sources: audit, critique, polish, harden, optimize, fixing-accessibility, fixing-motion-performance, 12-principles, mastering-animate-presence, pseudo-elements, baseline (constraint mode); designer-skills visual-critique + accessibility-audit. Boundary: owns *review/score/harden* (reports + targeted fixes); does not invent direction.
5. **sk-design-spec** *(folds sk-design-md-generator)* — The DESIGN.md / Style-Reference artifact layer: extract from a live site (md-generator backend) AND author from taste directives (stitch approach). Sources: existing sk-design-md-generator + stitch-skill; designer-skills design-token + documentation-template. Boundary: owns the *DESIGN.md contract* that interface/foundations/sk-code consume.
- **(optional 6th/7th) sk-design-output** — static/presentation graphics (posters, slides, bento). Sources: canvas-design, frontend-slides, slidev, apple-bento. Status: defer the keep/drop to phase 002.

### F43 — Documented count variants (all within 4–7), so phase 002 can tune grain
- **4 children (hub-leaning):** interface (absorbs foundations+motion as enhance modes) · audit · spec · (output optional). Lowest cognitive load; matches impeccable's "one skill, modes" grain.
- **5 children (RECOMMENDED):** interface · foundations · motion · audit · spec. Best balance of discoverability and budget.
- **6 children:** split foundations → {layout, color} OR add output. Use if advisor data shows color/layout (or output) are asked for independently.
- **7 children:** foundations split AND output added. Upper bound; risks overlap between layout and interface.

### F44 — Overlap-resolution rules (the seams between children)
- interface ↔ foundations: interface *chooses* the palette/type/layout strategy; foundations *implements/validates* the token system. The DESIGN.md (spec) is the handoff artifact between them.
- foundations ↔ audit: foundations owns palette-level contrast/token correctness; audit owns full-UI WCAG/perf sweeps and scoring.
- motion ↔ audit: motion builds; audit's `fixing-motion-performance` reviews. motion links to it as its "verify" step.
- spec ↔ interface: spec *captures/authors* the reference; interface *invents* new direction and consumes the reference as ground truth (the existing sibling boundary, preserved).
- interface ↔ output: interface = interactive product UI; output = static visual deliverables. If output is dropped, its sources become references under interface.

## Sources Consulted
- Synthesis over iters 1–9 findings (F1–F40) and their cited corpus sources; no new files read (analytical iteration).

## Assessment
- **newInfoRatio: 0.45** — The inclusion test, the recommended 5-child taxonomy with crisp boundaries, the count variants, and the overlap-resolution seams are new synthesis not present in prior iterations (which gathered evidence); some inputs are restated.
- **Novelty justification:** Converts nine iterations of evidence into a single decision-ready taxonomy with the merge/split rationale and the seams between children — the core KQ4 deliverable.
- **Confidence:** High on the 5-child core (each passes the inclusion test from cited evidence); medium on foundations-merge and the output swing (tunable design calls flagged for phase 002).

## Reflection
- **Worked:** A single inclusion test applied uniformly produced a defensible, non-arbitrary cut.
- **Insight:** The static-vs-temporal split (foundations vs motion) is cleaner than splitting every micro-domain, and keeps the count at 5.
- **Ruled out:** A 9-child taxonomy mirroring designer-skills' plugins — exceeds 4–7 and includes out-of-scope process plugins.
- **Ruled out:** Folding audit into interface — audit is a distinct mode with a shared review contract and standalone invocation.

## Recommended Next Focus
Iteration 11: Decide the parent structural model (hub vs umbrella) with an explicit coupling/shared-runtime signal matrix and a final recommendation (KQ6).
