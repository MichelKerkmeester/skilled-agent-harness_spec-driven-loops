# Research Synthesis — kimi27 lineage

## 1. Executive Summary

This lineage investigated how to restructure the existing `sk-design-interface` skill into a parent skill named `sk-design` with multiple focused children. The investigation covered the external design-skills corpus (`designer-skills-main` 9 plugins / 97 skills, 41 standalone design-skill docs, and `apple-bento-grid-main`) plus the existing internal skills `sk-design-interface` and `sk-design-md-generator`.

**Primary recommendation**: Adopt a **hub-with-nested-packets** parent model, mirroring `deep-loop-workflows`, with six child packets:

1. `sk-design-direction` — taste, archetype selection, anti-default discipline, brief grounding, interface writing.
2. `sk-design-foundations` — color, typography, spacing, layout/grid, tokens, OKLCH, dark mode.
3. `sk-design-motion` — purposeful animation, micro-interactions, feedback/loading states, motion performance.
4. `sk-design-critique` — structured critique, heuristic evaluation, accessibility audit, polish, copy clarity.
5. `sk-design-system` — live-site CSS extraction into v3 Style Reference `DESIGN.md`.
6. `sk-design-presentation` — bento grids, HTML slides, Slidev decks.

`sk-design-interface` folds into `sk-design-direction`. `sk-design-md-generator` folds into `sk-design-system`.

## 2. Research Questions Answered

1. **Which 4-7 child skills best cover the corpus while keeping each child sharply bounded?** → Six children: direction, foundations, motion, critique, system, presentation.
2. **Which corpus sources feed each child, and where do boundaries prevent overlap?** → See Section 5 and Section 10.
3. **Does the parent use a hub-with-nested-packets model or an umbrella-router-over-siblings model, and what evidence supports the choice?** → Hub model, supported by `deep-loop-workflows` precedent and existing `sk-design-*` family metadata.
4. **How do the existing `sk-design-interface` and `sk-design-md-generator` skills map into children without losing their current trigger coverage?** → `sk-design-interface` → `sk-design-direction`; `sk-design-md-generator` → `sk-design-system`; legacy triggers preserved via registry aliases.
5. **What is the minimal onboarding/back-compat path for each child?** → See Section 8.

## 3. Methodology

The lineage ran 7 iterations, each with a single focus, reading relevant corpus files and updating state. Iteration files are in `iterations/`. Key evidence came from:

- `designer-skills-main/CHANGELOG.md` for the 9-plugin/97-skill taxonomy. [SOURCE: file:external/designer-skills-main/CHANGELOG.md:12]
- `deep-loop-workflows/SKILL.md`, `mode-registry.json`, and `graph-metadata.json` for the hub model precedent. [SOURCE: file:.opencode/skills/deep-loop-workflows/SKILL.md:57-68]
- `sk-design-interface` and `sk-design-md-generator` `SKILL.md` and `graph-metadata.json` for existing skill boundaries and family metadata. [SOURCE: file:.opencode/skills/sk-design-interface/SKILL.md:1] [SOURCE: file:.opencode/skills/sk-design-md-generator/SKILL.md:1] [SOURCE: file:.opencode/skills/sk-design-md-generator/graph-metadata.json:144]
- Standalone external design docs grouped by discipline per iteration.

## 4. Corpus Overview

The external corpus contains three groups:

- **41 standalone markdown design-skill docs** covering taste/style, layout, color, motion, critique, accessibility, presentation, and utility output.
- **`designer-skills-main`** with 9 plugins and 97 skills organized into `design-research`, `design-systems`, `ux-strategy`, `ui-design`, `interaction-design`, `prototyping-testing`, `design-ops`, `designer-toolkit`, and `visual-critique`. [SOURCE: file:external/designer-skills-main/CHANGELOG.md:12]
- **`apple-bento-grid-main`**, a narrow output-format skill for Apple-style bento grids. [SOURCE: file:external/apple-bento-grid-main/SKILL.md:1]

## 5. Proposed Sub-Skill Taxonomy

| Child | Scope | Boundaries | Primary Corpus Sources |
| ----- | ----- | ---------- | ---------------------- |
| `sk-design-direction` | Brief inference, taste/archetype selection, anti-default discipline, real-system mapping, interface writing, variation diversity. | Does not implement tokens, grids, or animations; sets the aesthetic lane and hands off to foundations/motion/critique. | `sk-design-interface` [SOURCE]; `taste-skill.md` [SOURCE]; `soft-skill.md` [SOURCE]; `bolder.md` [SOURCE]; `brutalist-skill.md` [SOURCE]; `minimalist-skill.md` [SOURCE]; `delight.md` [SOURCE]; `redesign-skill.md` [SOURCE]; `designer-skills-main/ux-strategy/design-brief` [SOURCE]; `designer-skills-main/designer-toolkit/ux-writing` [SOURCE]. |
| `sk-design-foundations` | Color systems, typography scales, layout/grid, spacing systems, design tokens, OKLCH, dark mode. | Does not choose aesthetic lane or implement motion; supplies the token/system layer. | `designer-skills-main/ui-design` cluster (`color-system`, `typography-scale`, `layout-grid`, `spacing-system`, `responsive-design`, `dark-mode-design`, `visual-hierarchy`) [SOURCE]; `designer-skills-main/design-systems` cluster (`design-token`, `naming-convention`, `theming-system`, `icon-system`, `component-spec`, `pattern-library`) [SOURCE]; `colorize.md` [SOURCE]; `oklch-skill.md` [SOURCE]; `layout.md` [SOURCE]. |
| `sk-design-motion` | Purposeful animation, micro-interactions, feedback/loading states, motion performance, reduced motion. | Does not set aesthetic lane; executes motion within the direction's intensity dial and quality floor. | `designer-skills-main/interaction-design` cluster (`animation-principles`, `micro-interaction-spec`, `feedback-patterns`, `loading-states`, `navigation-patterns`, `gesture-patterns`, `state-machine`, `error-handling-ux`, `form-design`) [SOURCE]; `animate.md` [SOURCE]; `12-principles-of-animation.md` [SOURCE]; `fixing-motion-performance.md` [SOURCE]; `mastering-animate-presence.md` [SOURCE]; `morphing-icons.md` [SOURCE]; `make-interfaces-feel-better.md` [SOURCE]; `overdrive.md` (advanced, user-confirmed) [SOURCE]. |
| `sk-design-critique` | Structured design critique, heuristic evaluation, accessibility audit, polish pass, copy clarity. | Does not invent new direction; evaluates existing UI against standards and the direction set by `sk-design-direction`. | `designer-skills-main/visual-critique` cluster (`critique-composition`, `critique-color`, `critique-typography`, `critique-brand-consistency`, `critique-affordance`, `critique-information-density`, `critique-visual-hierarchy`) [SOURCE]; `designer-skills-main/prototyping-testing/heuristic-evaluation` [SOURCE]; `designer-skills-main/design-systems/accessibility-audit` [SOURCE]; `critique.md` [SOURCE]; `audit.md` [SOURCE]; `fixing-accessibility.md` [SOURCE]; `polish.md` [SOURCE]; `clarify.md` [SOURCE]. |
| `sk-design-system` | Live-website CSS extraction into v3 Style Reference `DESIGN.md`, token fidelity, validation. | Does not invent new design; captures existing systems. Folds `sk-design-md-generator`. | `sk-design-md-generator` [SOURCE]; `designer-skills-main/design-systems` cluster (`design-token-audit`, `design-system-adoption`, `documentation-template`, `design-system-governance`) [SOURCE]. |
| `sk-design-presentation` | Visual-summary output formats: Apple-style bento grids, HTML slides, Slidev decks. | Narrow, output-format child; does not replace direction or foundations for general UI. | `apple-bento-grid-main/SKILL.md` [SOURCE]; `apple-bento-grid-main/design-system.md` [SOURCE]; `frontend-slides.md` [SOURCE]; `slidev.md` [SOURCE]. |

## 6. Structural-Model Evidence

### 6.1 Hub-with-nested-packets precedent: `deep-loop-workflows`

`deep-loop-workflows` is the closest internal precedent. It exposes one advisor-discoverable skill with one `graph-metadata.json` and a `mode-registry.json` that routes to nested mode packets (`deep-context`, `deep-research`, `deep-review`, `ai-council`, `deep-improvement`). [SOURCE: file:.opencode/skills/deep-loop-workflows/SKILL.md:57-68] Each packet keeps its own `SKILL.md`, `references/`, `scripts/`, and `feature_catalog/`, but no per-packet `graph-metadata.json`. [SOURCE: file:.opencode/skills/deep-loop-workflows/SKILL.md:67] The hub's causal summary explicitly states it "merges the five former deep-loop persona skills into one advisor identity." [SOURCE: file:.opencode/skills/deep-loop-workflows/graph-metadata.json:152]

### 6.2 Family identity already exists

`sk-design-md-generator`'s graph-metadata calls it "the extraction-and-format-fidelity engine of the sk-design-* family - sibling to sk-design-interface." [SOURCE: file:.opencode/skills/sk-design-md-generator/graph-metadata.json:144] `sk-design-interface`'s graph-metadata lists `sk-design-md-generator` as a sibling with weight 0.55. [SOURCE: file:.opencode/skills/sk-design-interface/graph-metadata.json:22-25] This family semantic supports formalizing a parent rather than leaving the skills as independent siblings.

### 6.3 Coupling and shared-runtime signals

`deep-loop-workflows` has high backend coupling: every mode consumes `deep-loop-runtime` (executor, coverage-graph, convergence). [SOURCE: file:.opencode/skills/deep-loop-workflows/graph-metadata.json:10-12] `sk-design` children are guidance/reference skills, not runtime loops, so backend coupling is low. The shared "runtime" is the design process framework (ground → token system → critique → build → self-critique) and the quality floor. These can be referenced from the hub without executable coupling.

### 6.4 Why not umbrella-router-over-siblings?

An umbrella model would make each child a top-level skill with its own `graph-metadata.json`, fragmenting the advisor surface. Users asking generically "make this look good" could be routed to the wrong child. The pre-existing family metadata and the `deep-loop-workflows` precedent both favor a single advisor identity.

## 7. Parent Hub Design

Recommended hub structure:

```text
.opencode/skills/sk-design/
  SKILL.md               # logic-free router; family description; trigger phrases
  graph-metadata.json    # single advisor identity
  family-registry.json   # maps public triggers/modes to child packets
  direction/             # sk-design-direction packet
  foundations/           # sk-design-foundations packet
  motion/                # sk-design-motion packet
  critique/              # sk-design-critique packet
  system/                # sk-design-system packet
  presentation/          # sk-design-presentation packet
```

The parent `SKILL.md` should stay logic-free, like `deep-loop-workflows`, and route via `family-registry.json`. Each child packet retains its own `SKILL.md`, `references/`, `feature_catalog/`, and `manual_testing_playbook/`.

## 8. Backward Compatibility and Onboarding

### 8.1 Existing skill mapping

- **`sk-design-interface` → `sk-design-direction`**: Move the SKILL.md, references (`design_principles.md`, `variation_diversity.md`, `real_ui_loop.md`, Mobbin/Refero tooling), feature catalog, and manual tests into `direction/`. The objective quality floor references can move to `critique/` or stay referenced by both.
- **`sk-design-md-generator` → `sk-design-system`**: Move the entire skill verbatim into `system/`, including the embedded `backend/` TypeScript pipeline, references, examples, and install guide. [SOURCE: file:.opencode/skills/sk-design-md-generator/SKILL.md:204-247]

### 8.2 Trigger preservation

- Preserve all `sk-design-interface` triggers (`make it look good`, `redesign`, `looks templated`, `typography`, `palette`, etc.) [SOURCE: file:.opencode/skills/sk-design-interface/graph-metadata.json:71-85] as legacy aliases routing to `direction`.
- Preserve all `sk-design-md-generator` triggers (`extract design system`, `generate DESIGN.md`, `capture website css`, etc.) [SOURCE: file:.opencode/skills/sk-design-md-generator/graph-metadata.json:63-71] as legacy aliases routing to `system`.

### 8.3 Onboarding checklist per child

Each child needs:

1. `SKILL.md` with scope, when to use, smart routing, rules, success criteria.
2. `references/` directory with discipline-specific guidance.
3. `feature_catalog/` and `manual_testing_playbook/` aligned with `sk-doc` standards.
4. Any embedded tools/scripts (notably `sk-design-system/backend/`).
5. Graph edges in the parent's `graph-metadata.json`; no child `graph-metadata.json`.

## 9. Boundary Rules

- **Direction vs. foundations**: Direction decides *what* aesthetic lane; foundations supply the *token system*.
- **Direction vs. motion**: Direction sets motion *intent* (intensity dial); motion owns *implementation*.
- **Foundations vs. critique**: Foundations defines the system; critique audits whether the system is applied.
- **Critique vs. direction**: Critique does not invent direction; it evaluates against the chosen direction and objective standards.
- **System vs. all others**: `sk-design-system` is the only child that touches live URLs/Playwright; it captures rather than designs.
- **Presentation vs. direction/foundations**: Presentation applies direction and foundations to output-format artifacts (slides, grids), not general UI.

## 10. Open Questions and Gaps

- Some standalone docs (`adapt.md`, `distill.md`, `quieter.md`, `canvas-design.md`, `harden.md`, `stitch-skill.md`, `baseline.md`, `emil-design-eng.md`, `bencium-innovative-ux-designer.md`, `gpt-tasteskill.md`) were not deep-read in this lineage. Their final placement under direction, foundations, or critique should be verified in a second pass.
- Whether `sk-design-presentation` should be a child or a sub-mode of `sk-design-direction` depends on usage frequency; the corpus supports a child, but the boundary is narrow.
- The exact `family-registry.json` schema should align with `deep-loop-workflows/mode-registry.json` and be validated by `system-skill-advisor` drift-guard tests.

## 11. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence |
| -------- | ----------------- | -------- |
| Include `output-skill.md` as a `sk-design` child | It is a generic full-output enforcement utility, not a design discipline. | [SOURCE: file:external/output-skill.md:1] |
| Split motion into multiple top-level children | Motion sources (guidance, spec, performance, advanced) are interleaved; a single child with references is cleaner. | [SOURCE: file:external/animate.md:1-120] [SOURCE: file:external/fixing-motion-performance.md:1-120] |
| Create a separate `sk-design-writing` child | `clarify` and `ux-writing` are evaluation/polish tasks and fit under `sk-design-critique`. | [SOURCE: file:external/clarify.md:1-120] [SOURCE: file:external/designer-skills-main/designer-toolkit/skills/ux-writing/SKILL.md:1] |
| Umbrella-router-over-siblings model | Would fragment advisor identity; `sk-design-*` family metadata and `deep-loop-workflows` precedent favor hub. | [SOURCE: file:.opencode/skills/sk-design-md-generator/graph-metadata.json:144] [SOURCE: file:.opencode/skills/deep-loop-workflows/graph-metadata.json:152] |
| Fold `sk-design-md-generator` into `sk-design-foundations` | Extraction is a distinct pipeline and user intent; it deserves its own child. | [SOURCE: file:.opencode/skills/sk-design-md-generator/SKILL.md:204-247] |
| 5-child taxonomy without a presentation child | Presentation output formats (bento, slides, Slidev) are distinct enough to warrant their own packet. | [SOURCE: file:external/apple-bento-grid-main/SKILL.md:1-203] [SOURCE: file:external/frontend-slides.md:1-120] [SOURCE: file:external/slidev.md:1-120] |

## 12. References

- `external/designer-skills-main/CHANGELOG.md`
- `external/designer-skills-main/ui-design/skills/color-system/SKILL.md`
- `external/designer-skills-main/ui-design/skills/typography-scale/SKILL.md`
- `external/designer-skills-main/ui-design/skills/layout-grid/SKILL.md`
- `external/designer-skills-main/interaction-design/skills/animation-principles/SKILL.md`
- `external/designer-skills-main/interaction-design/skills/micro-interaction-spec/SKILL.md`
- `external/designer-skills-main/interaction-design/skills/feedback-patterns/SKILL.md`
- `external/designer-skills-main/interaction-design/skills/loading-states/SKILL.md`
- `external/designer-skills-main/visual-critique/skills/critique-composition/SKILL.md`
- `external/designer-skills-main/visual-critique/skills/critique-color/SKILL.md`
- `external/designer-skills-main/visual-critique/skills/critique-typography/SKILL.md`
- `external/designer-skills-main/prototyping-testing/skills/heuristic-evaluation/SKILL.md`
- `external/designer-skills-main/design-systems/skills/design-token/SKILL.md`
- `external/designer-skills-main/design-systems/skills/accessibility-audit/SKILL.md`
- `external/designer-skills-main/ux-strategy/skills/design-brief/SKILL.md`
- `external/designer-skills-main/designer-toolkit/skills/ux-writing/SKILL.md`
- `external/taste-skill.md`
- `external/soft-skill.md`
- `external/bolder.md`
- `external/brutalist-skill.md`
- `external/minimalist-skill.md`
- `external/delight.md`
- `external/polish.md`
- `external/colorize.md`
- `external/oklch-skill.md`
- `external/layout.md`
- `external/animate.md`
- `external/12-principles-of-animation.md`
- `external/fixing-motion-performance.md`
- `external/mastering-animate-presence.md`
- `external/morphing-icons.md`
- `external/overdrive.md`
- `external/make-interfaces-feel-better.md`
- `external/pseudo-elements.md`
- `external/critique.md`
- `external/audit.md`
- `external/fixing-accessibility.md`
- `external/clarify.md`
- `external/redesign-skill.md`
- `external/frontend-slides.md`
- `external/slidev.md`
- `external/apple-bento-grid-main/SKILL.md`
- `external/apple-bento-grid-main/design-system.md`
- `.opencode/skills/sk-design-interface/SKILL.md`
- `.opencode/skills/sk-design-interface/graph-metadata.json`
- `.opencode/skills/sk-design-md-generator/SKILL.md`
- `.opencode/skills/sk-design-md-generator/graph-metadata.json`
- `.opencode/skills/deep-loop-workflows/SKILL.md`
- `.opencode/skills/deep-loop-workflows/mode-registry.json`
- `.opencode/skills/deep-loop-workflows/graph-metadata.json`
- `.opencode/skills/sk-code/SKILL.md`
- `.opencode/skills/sk-code/graph-metadata.json`

---

*Stop reason: maxIterationsReached (7 iterations). All five key questions answered.*
