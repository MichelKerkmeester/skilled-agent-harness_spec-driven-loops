# Iteration 2: Visual Craft and Interface Creation Taxonomy

## Focus

Determine what child should own initial visual direction, UI craft, and variants.

## Findings

1. Existing `sk-design-interface` already owns the core creation behavior: ground the subject, brainstorm color/type/layout/signature, critique against AI defaults, build, and self-critique [SOURCE: .opencode/skills/sk-design-interface/SKILL.md:53-63]. This is the seed for a child such as `sk-design-interface` or `sk-design-craft`.
2. `taste-skill` adds strong brief inference and anti-default calibration. It requires reading page kind, vibe words, references, audience, brand assets, and constraints before code [SOURCE: external/taste-skill.md:13-24], then setting design variance, motion, and density dials [SOURCE: external/taste-skill.md:43-63]. These belong with visual direction, not as isolated children.
3. `layout` treats space, rhythm, grouping, and hierarchy as core design material [SOURCE: external/layout.md:6-18]. Its live-mode density and structure params indicate layout is a reusable axis within creation and variation workflows [SOURCE: external/layout.md:150-168].
4. `colorize` treats palette as a strategic system with semantic meaning, hierarchy, brand fit, and accessibility constraints [SOURCE: external/colorize.md:22-53]. It should feed the creation child and the system-reference child, but not stand alone unless the parent later exposes fine-grained commands.
5. `design-lab` is a workflow for generating five distinct UI variations, gathering feedback, refining, previewing, and finalizing [SOURCE: external/design-lab.md:6-9]. Its requirement that variants explore different design axes [SOURCE: external/design-lab.md:338-389] fits a creation child sub-mode for exploration.
6. The `ui-design` collection in `designer-skills-main` groups layout grids, color systems, typography, responsive design, visual hierarchy, spacing, dark mode, data visualization, and Gestalt/perceptual principles [SOURCE: external/designer-skills-main/ui-design/README.md:1-18]. This is the cleanest corpus-level support for a single UI craft child rather than separate color/layout/type children.

## Sources Consulted

- `.opencode/skills/sk-design-interface/SKILL.md`
- `external/taste-skill.md`
- `external/layout.md`
- `external/colorize.md`
- `external/design-lab.md`
- `external/designer-skills-main/ui-design/README.md`

## Assessment

- newInfoRatio: 0.78
- Novelty: mapped multiple standalone mode docs into one creation child.
- Confidence: high.

## Reflection

What worked: grouping by decision phase, not by artifact type.

What failed: separate children for color, type, layout, and taste would create constant co-loading.

Ruled out: one child per visual axis.

## Recommended Next Focus

Map interaction, motion, resilience, critique, and production quality sources.
