# Iteration 4: Parent Structural Model

## Focus

Compare a single hub with nested mode packets against an umbrella router over a sibling family.

## Findings

1. The strongest argument for a single hub is `impeccable`: one skill exposes a broad command table and routes by first word or intent [SOURCE: external/impeccable.md:119-166]. This gives a coherent user entry point.
2. The strongest argument against a single hub is setup coupling. `impeccable` requires session context, sub-command reference, existing design-system files, and register reference before proceeding [SOURCE: external/impeccable.md:13-21]. That is appropriate for its packaged command surface but too heavy as the only design entry point in this framework.
3. The corpus's cleanest parent model is `ui-skills-root`: a thin router that selects category, inspects available skills, loads the smallest useful set, and prefers specificity [SOURCE: external/ui-skills-root.md:22-59].
4. `designer-skills-main` proves that a sibling family scales: 9 design-practice plugins cover research, systems, UX strategy, UI, interaction, prototyping/testing, ops, toolkit, and visual critique [SOURCE: external/designer-skills-main/README.md:61-77]. It also recommends installing only what is needed [SOURCE: external/designer-skills-main/README.md:189-200].
5. The existing internal split is a high-coupling warning. `sk-design-md-generator` is an extraction and format-fidelity engine, while `sk-design-interface` invents distinctive direction [SOURCE: .opencode/skills/sk-design-md-generator/SKILL.md:14]. Combining both as nested modes would put Playwright extraction verification in the same operational surface as creative visual direction.
6. Shared runtime signals are real but should be small: common anti-slop principles, quality floor, design-system grounding, reduced-motion/accessibility expectations, and parent routing. Tool-heavy pipelines, detector workflows, extraction validators, and temporary design labs should stay child-owned.
7. `apple-bento-grid` demonstrates why specialized output/presentation work should not dominate the parent. It has self-contained HTML output, screenshot export, zero-gap grid rules, and card-specific templates [SOURCE: external/apple-bento-grid-main/SKILL.md:20-45]. It is a child/specialized mode source, not a parent architecture.
8. The parent should be named `sk-design` and own routing, shared design core, and compatibility redirects. Children should remain independently loadable sibling skills with narrow contracts.

## Sources Consulted

- `external/impeccable.md`
- `external/ui-skills-root.md`
- `external/designer-skills-main/README.md`
- `.opencode/skills/sk-design-md-generator/SKILL.md`
- `.opencode/skills/sk-design-interface/SKILL.md`
- `external/apple-bento-grid-main/SKILL.md`

## Assessment

- newInfoRatio: 0.41
- Novelty: established parent structure and coupling boundary.
- Confidence: high.

## Reflection

What worked: using corpus structures as architecture evidence instead of subjective preference.

What failed: single hub looked attractive until tool and verification coupling were compared.

Ruled out: a single giant `sk-design/SKILL.md` with all child modes embedded.

## Recommended Next Focus

Write onboarding and backward-compatibility implications for each child.
