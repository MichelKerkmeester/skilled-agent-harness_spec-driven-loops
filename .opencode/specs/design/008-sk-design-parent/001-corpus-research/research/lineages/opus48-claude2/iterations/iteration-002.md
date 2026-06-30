# Iteration 2: The designer-skills-main organizing model (most mature taxonomy precedent)

## Focus
Extract the explicit taxonomy and boundary criteria from designer-skills-main — the largest, most deliberately-organized design-skill collection in the corpus — to learn how a mature design-skill family draws its lines.

## Findings

### F5 — designer-skills is a marketplace over independently-installable sibling collections (loose coupling is explicit)
The repo is a Claude **plugin marketplace** spanning "239 skills and 88 commands across 33 plugins, in five collections." The design-practice collection (this repo) is "97 skills and 30 commands across 9 plugins." Each plugin "also has its own door" (its own marketplace add command) and "each plugin is also a Gemini CLI extension." The README states installation is à-la-carte: "Install as few or as many as you like" and "The plugins are lightweight — installing more doesn't slow things down." This is **explicit evidence for low runtime coupling between siblings** — a sibling-family/umbrella model, not a single shared-runtime hub. [SOURCE: external/designer-skills-main/README.md:5], [SOURCE: external/designer-skills-main/README.md:29-35], [SOURCE: external/designer-skills-main/README.md:200]

### F6 — The model separates Skills (knowledge nouns) from Commands (workflow verbs)
"**Skills** are domain knowledge units — nouns… **Commands** are workflows — verbs. They chain skills together to do a complete job… You'll mostly reach for commands. The skills run underneath them." Each of the 9 plugins ships ~7–16 narrow SKILL.md knowledge units plus 2–4 commands that orchestrate them (e.g. `/design-research:discover` runs personas + empathy map + journey map in one go). [SOURCE: external/designer-skills-main/README.md:113-119], [SOURCE: external/designer-skills-main/README.md:83-111]
→ Mapping to our framework: their "command" ≈ our skill-with-a-workflow; their "skill" ≈ a reference/knowledge fragment. Our sub-skills should be sized like their **commands** (a complete job), not their atomic skills, or we'd land at 97 children, not 4–7.

### F7 — The 9 plugins fall into "build/craft" vs "process/strategy" halves; only the build half is in scope for sk-design
- **Build/craft (interface-facing):** `ui-design` (14: layout-grid, color-system, typography-scale, spacing-system, visual-hierarchy, responsive-design, dark-mode-design, data-visualization, Gestalt laws), `interaction-design` (16: micro-interaction-spec, state-machine, feedback-patterns, loading-states, form-design, navigation-patterns, animation-principles + UX laws fitts/hicks/miller/doherty), `design-systems` (11: design-token, theming-system, component-spec, motion-system, icon-system, accessibility-audit, naming-convention), `visual-critique` (7: critique-hierarchy/typography/color/composition/affordance/brand/density).
- **Process/strategy (adjacent, likely out of scope for a *build* family):** `design-research` (12), `ux-strategy` (12), `prototyping-testing` (8), `design-ops` (9), `designer-toolkit` (7 — but `ux-writing` is interface-facing). [SOURCE: external/designer-skills-main/README.md:69-77]
→ sk-design's identity (from sk-design-interface) is *building distinctive interfaces*, so the four build/craft plugins are the in-scope precedent; the five process plugins map to a different (UX-strategy) family, not sk-design.

### F8 — There is a natural pipeline grain, but plugins are not a strict pipeline
"design-research → ux-strategy → ui-design / interaction-design → design-systems → design-ops… The plugins aren't a strict pipeline, but there's a natural grain." For the build half, the grain is: **define direction → lay out → color/type → motion/interaction → systematize → critique/QA.** This sequence is a candidate ordering for our children and matches our iteration-1 clusters 3–6. [SOURCE: external/designer-skills-main/README.md:202-208]

### F9 — Boundary criterion the corpus uses: organize by *design activity/deliverable*, not by aesthetic
designer-skills draws collection lines by **what you are doing** (researching, strategizing, laying out, interacting, systematizing, critiquing) and skill lines by **what you produce** (a persona, a token set, a component spec). It never organizes by named aesthetic (brutalist/minimalist) — those are absent from its taxonomy entirely. This contrasts with our standalone corpus, which *does* include named-aesthetic skills (cluster 2). Signal: aesthetic-direction skills are a **different axis** from activity skills and may belong in one "aesthetic directions" child rather than as peers of activity children. [SOURCE: external/designer-skills-main/README.md:113-119]

## Sources Consulted
- `external/designer-skills-main/README.md` (full: collections table, plugin table, commands table, skills-vs-commands definition, sequence grain).
- `SKILL.md` front-matter (name/description) across `ui-design`, `design-systems`, `interaction-design` (41 skill descriptions).

## Assessment
- **newInfoRatio: 0.7** — The marketplace/loose-coupling evidence, the skills-vs-commands sizing rule, the build-vs-process split, and the activity-not-aesthetic boundary criterion are all new; the raw collection list partially overlaps iteration 1.
- **Novelty justification:** Converts the iteration-1 inventory into an explicit, sourced taxonomy precedent with boundary criteria and a coupling signal that directly feeds KQ4 and KQ6.
- **Confidence:** High — claims are quoted from the README.

## Reflection
- **Worked:** Reading the front-door README plus a 3-collection front-matter grep gave the whole organizing logic without reading 97 bodies.
- **Worked:** The skills-vs-commands distinction resolves the granularity problem (why 97 atoms collapse to ~6 deliverable-sized children).
- **Ruled out:** Treating designer-skills' atomic skills as the unit for our children — wrong granularity; our children should map to its *commands*/plugins, not its skills.
- **Ruled out (scope):** The five process/strategy plugins (research, ux-strategy, prototyping-testing, design-ops, most of designer-toolkit) as sk-design children — they are a UX-strategy family, not an interface-build family.

## Recommended Next Focus
Iteration 3: Read apple-bento-grid-main and the named-aesthetic standalone docs (brutalist/minimalist/soft/stitch) to decide whether named aesthetics are one "aesthetic directions" child, separate sibling skills, or assets — and to test F9's "different axis" hypothesis.
