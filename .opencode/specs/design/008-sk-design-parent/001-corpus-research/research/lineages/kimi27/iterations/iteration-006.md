# Iteration 6: Mapping existing skills and backward-compatibility/onboarding implications

## Focus

Determine how `sk-design-interface` and `sk-design-md-generator` fold into the proposed children and what migration/onboarding is required.

## Findings

1. **`sk-design-interface` is primarily the `sk-design-direction` child.**
   - It owns distinctive UI direction: grounding the subject, brainstorming a token system, critiquing AI-default looks, building from the plan, self-critique. [SOURCE: file:.opencode/skills/sk-design-interface/SKILL.md:94-117]
   - Its trigger phrases ("make it look good", "redesign", "looks templated", "hero section", "typography", "palette") align with the direction/taste packet. [SOURCE: file:.opencode/skills/sk-design-interface/graph-metadata.json:71-85]
   - Its references (`design_principles.md`, `variation_diversity.md`, `real_ui_loop.md`, `ux_quality_reference.md`, Mobbin/Refero tooling) can move into `sk-design-direction/references/`.
   - Boundary split: the *anti-default critique* and *process* stay in direction; the *objective quality floor* (accessibility, responsive, forms, charts) moves to `sk-design-critique` as audit criteria; detailed *motion implementation* moves to `sk-design-motion`.

2. **`sk-design-md-generator` maps cleanly to a `sk-design-system` child.**
   - It is already described as "the extraction-and-format-fidelity engine of the sk-design-* family." [SOURCE: file:.opencode/skills/sk-design-md-generator/graph-metadata.json:144]
   - Its three-phase pipeline (extract/write/validate), v3 Style Reference format, gold-standard examples, and embedded `backend/` TypeScript tool can move verbatim into `sk-design-system/`. [SOURCE: file:.opencode/skills/sk-design-md-generator/SKILL.md:204-247]
   - Its trigger phrases ("extract design system", "generate DESIGN.md", "capture website css", "design tokens from url") become the `sk-design-system` entry points. [SOURCE: file:.opencode/skills/sk-design-md-generator/graph-metadata.json:63-71]

3. **Backward-compatibility strategy.**
   - Preserve all existing `sk-design-interface` and `sk-design-md-generator` trigger phrases by listing them as legacy aliases in the parent's `family-registry.json` (e.g., `sk-design-interface` → `direction`, `sk-design-md-generator` → `system`).
   - The parent `SKILL.md` can carry a short migration note: "Previous skills `sk-design-interface` and `sk-design-md-generator` are now packets under `sk-design`."
   - During a transition window, the old skill folders can remain as thin forwarding wrappers (read the parent registry and route) or can be removed once references are updated.
   - Graph-metadata edges: `sk-design-interface` currently enhances `sk-code` and is sibling to `sk-design-md-generator`; under the parent, `sk-design` enhances `sk-code`, and `direction`/`system` are internal siblings.

4. **Onboarding requirements per child.**
   - Each child needs: `SKILL.md`, `references/`, `feature_catalog/`, `manual_testing_playbook/`, and any embedded tools/scripts.
   - `sk-design-direction` onboarding = repoint existing `sk-design-interface` content, split out quality/motion implementation references.
   - `sk-design-foundations` onboarding = collect color/type/layout/spacing sources from `designer-skills-main/ui-design` + `design-systems` + standalone docs (`colorize`, `oklch-skill`, `layout.md`).
   - `sk-design-motion` onboarding = collect sources from `designer-skills-main/interaction-design` + standalone motion docs.
   - `sk-design-critique` onboarding = collect sources from `designer-skills-main/visual-critique` + `prototyping-testing` + standalone critique/audit/accessibility docs.
   - `sk-design-system` onboarding = move `sk-design-md-generator` verbatim.
   - `sk-design-presentation` onboarding = collect `apple-bento-grid-main`, `frontend-slides.md`, `slidev.md`.

5. **Presentation child decision.**
   - `frontend-slides.md` is an HTML-deck builder with fixed 16:9 stage, zero dependencies, anti-AI-slop aesthetics. [SOURCE: file:external/frontend-slides.md:1-120]
   - `slidev.md` is a Slidev/Vue/Markdown developer-deck builder. [SOURCE: file:external/slidev.md:1-120]
   - `apple-bento-grid-main` is a narrow bento-grid card generator with design-system tokens. [SOURCE: file:external/apple-bento-grid-main/SKILL.md:1-203] [SOURCE: file:external/apple-bento-grid-main/design-system.md:1-120]
   - These are all *output-format* skills rather than general design disciplines. They justify a sixth child, `sk-design-presentation`, whose scope is "visual summary and slide output formats."

## Sources Consulted

- `.opencode/skills/sk-design-interface/SKILL.md`
- `.opencode/skills/sk-design-interface/graph-metadata.json`
- `.opencode/skills/sk-design-md-generator/SKILL.md`
- `.opencode/skills/sk-design-md-generator/graph-metadata.json`
- `external/frontend-slides.md` (first 120 lines)
- `external/slidev.md` (first 120 lines)
- `external/apple-bento-grid-main/SKILL.md`
- `external/apple-bento-grid-main/design-system.md` (first 120 lines)

## Assessment

- **newInfoRatio**: 0.60
- **noveltyJustification**: Resolves the placement of both existing skills and adds a concrete onboarding/back-compat plan plus the presentation child.
- **status**: complete

## Reflection

- **What worked**: Reading the existing skills' graph-metadata files exposed their trigger phrases and sibling relationships, making migration mapping straightforward.
- **What failed**: None.
- **Ruled out**: Folding `sk-design-md-generator` into `sk-design-foundations` — extraction is a distinct pipeline and user intent; it deserves its own child.

## Recommended Next Focus

Iteration 7: Final taxonomy refinement, corpus-source assignment per child, and convergence check before synthesis.
