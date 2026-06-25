# sk-design Parent Taxonomy Research - gpt55fast Lineage

## 1. Executive Verdict

Create `sk-design` as a thin umbrella router over a sibling family of six child skills, backed by shared core design references. Do not build a single monolithic hub with all modes nested inside one `SKILL.md`.

Recommended children:

| Child | Primary Job | Fold-in |
|---|---|---|
| `sk-design-strategy` | Brief framing, design read, UX strategy, audience, IA, goals, constraints | UX strategy corpus |
| `sk-design-interface` | New visual/interface direction, UI craft, variation generation, anti-slop taste | Existing `sk-design-interface` |
| `sk-design-interaction` | Interaction flows, state machines, motion, feedback, delight, onboarding | Animate, delight, interaction corpus |
| `sk-design-system` | Tokens, theming, component specs, DESIGN.md, measured extraction | Existing `sk-design-md-generator` as child or alias |
| `sk-design-quality` | Critique, audit, hardening, polish, accessibility, responsiveness, edge cases | Audit, critique, polish, harden corpus |
| `sk-design-delivery` | Handoff, rationale, output completeness, presentations, bento/social/report artifacts | Output, design-ops, apple-bento |

## 2. Method

This lineage ran five converged evidence iterations instead of forcing all 20 possible iterations. The final iteration produced compatibility details but no taxonomy-changing evidence, and all key questions were answered.

## 3. Optimal Sub-Skill Taxonomy

### 3.1 `sk-design-strategy`

Scope: Frame the design problem before visual production. Own design briefs, design reads, target audience, product goals, competitive/benchmark context, IA, content strategy, north-star/product direction, and constraints.

Boundaries: It does not generate final UI, extract tokens, run browser critique, or implement code. It hands a design brief and decision frame to `sk-design-interface`, `sk-design-interaction`, or `sk-design-system`.

Corpus sources:

- `designer-skills-main/ux-strategy/README.md` lists competitive analysis, design principles, experience maps, north-star vision, opportunity framing, briefs, stakeholder alignment, metrics, IA, content strategy, and service blueprint [SOURCE: external/designer-skills-main/ux-strategy/README.md:1-18].
- `taste-skill` requires reading page kind, vibe, references, audience, brand assets, and quiet constraints before design work [SOURCE: external/taste-skill.md:13-24].
- `designer-skills-main/README.md` says research informs strategy and strategy shapes UI decisions [SOURCE: external/designer-skills-main/README.md:202-208].

Onboarding implications:

- Teach users to start here when the brief is ambiguous or strategic.
- Parent router should choose this child when prompts contain "frame", "strategy", "audience", "IA", "benchmark", "principles", or unclear design direction.

### 3.2 `sk-design-interface`

Scope: Own visual/interface creation: palette, typography, layout, composition, information hierarchy, visual identity, anti-template critique, UI variants, and real UI self-critique.

Boundaries: It does not own measured extraction, token validation, systematic audit, or developer handoff. It can consume outputs from `sk-design-strategy` and `sk-design-system`.

Corpus sources:

- Existing `sk-design-interface` already defines the two-pass process: ground subject, brainstorm token system, critique defaults, build, self-critique [SOURCE: .opencode/skills/sk-design-interface/SKILL.md:53-63].
- `ui-design` groups layout grids, color systems, typography, responsive design, visual hierarchy, spacing, dark mode, data visualization, and Gestalt principles [SOURCE: external/designer-skills-main/ui-design/README.md:1-18].
- `layout` treats space as a design material and focuses on spacing, hierarchy, grid, rhythm, and density [SOURCE: external/layout.md:20-48].
- `colorize` covers strategic palette, semantic meaning, hierarchy, accessibility, and OKLCH color systems [SOURCE: external/colorize.md:22-53].
- `design-lab` supports exploration through five distinct variants and feedback/refinement [SOURCE: external/design-lab.md:6-9].

Backward compatibility:

- Keep the existing name `sk-design-interface` as the canonical child name or as a long-lived alias to `sk-design-craft`.
- Preserve current trigger phrases like "design", "redesign", "visual identity", "looks templated", and "multiple directions" [SOURCE: .opencode/skills/sk-design-interface/SKILL.md:24-31].
- Keep its current requirement that design judgment is loaded before Open Design or Figma transport work; parent `sk-design` can own the route, but the child remains the design-judgment surface.

### 3.3 `sk-design-interaction`

Scope: Own how the interface behaves over time: state machines, navigation patterns, forms, feedback, loading states, error flows, onboarding, micro-interactions, motion, gesture design, and delight moments.

Boundaries: It does not pick the whole visual identity or produce measured design-system docs. It collaborates with `sk-design-interface` for look and with `sk-design-quality` for verification.

Corpus sources:

- `interaction-design` covers micro-animations, state machines, gestures, error handling, loading states, feedback, cognitive laws, forms, onboarding, navigation, and search [SOURCE: external/designer-skills-main/interaction-design/README.md:1-22].
- `animate` frames motion as state feedback, hierarchy clarification, and purposeful UX, not decoration [SOURCE: external/animate.md:6-18].
- `delight` locates personality in success states, empty states, loading, achievements, interactions, errors, and hidden discoveries [SOURCE: external/delight.md:22-49].

Onboarding implications:

- Route here when the prompt names "flow", "state", "motion", "animation", "onboarding", "feedback", "loading", "forms", "navigation", "gesture", or "delight".
- Require reduced-motion, performance, and accessibility checks as part of the child contract, then hand off to `sk-design-quality` when the user asks for audit or polish.

### 3.4 `sk-design-system`

Scope: Own reusable design-system artifacts: tokens, component specs, theming, icon systems, motion tokens, localization, pattern library entries, documentation templates, governance, and measured DESIGN.md extraction.

Boundaries: It captures and structures reusable systems. It does not invent a fresh visual direction unless paired with `sk-design-interface`, and it does not run broad critique unless paired with `sk-design-quality`.

Corpus sources:

- `design-systems` covers tokens, components, pattern libraries, naming, accessibility audits, theming, icon systems, documentation, motion systems, governance, and localization [SOURCE: external/designer-skills-main/design-systems/README.md:1-18].
- Existing `sk-design-md-generator` captures live website CSS into DESIGN.md with measured tokens and validation [SOURCE: .opencode/skills/sk-design-md-generator/SKILL.md:10-14].
- `sk-design-md-generator` has a non-negotiable cardinal fidelity rule that every hex, pixel, font weight, shadow, radius, and spacing value in DESIGN.md comes from `tokens.json` [SOURCE: .opencode/skills/sk-design-md-generator/SKILL.md:248-255].
- `polish` requires design-system discovery before any polish work [SOURCE: external/polish.md:14-23].

Backward compatibility:

- Keep `sk-design-md-generator` as a compatibility alias or child entrypoint for URL-to-DESIGN.md workflows.
- Prefer naming the broader child `sk-design-system` while exposing `sk-design-md-generator` for the exact extract/write/validate pipeline.
- Parent router should choose this child for "DESIGN.md", "tokens", "extract design system", "theme", "component spec", "pattern library", "design system", and "capture website CSS".

### 3.5 `sk-design-quality`

Scope: Own evaluation, audit, hardening, and final polish: visual critique, technical audit, WCAG/accessibility, performance, theming, responsive behavior, anti-pattern detection, edge cases, errors, empty/loading states, i18n, and final quality gates.

Boundaries: It reports and fixes/refines quality; it does not own initial creative direction. If direction is missing, route to `sk-design-strategy` or `sk-design-interface` first.

Corpus sources:

- `audit` runs technical quality checks across accessibility, performance, theming, responsive behavior, and anti-patterns [SOURCE: external/audit.md:6-15].
- `critique` requires design review plus detector/browser evidence and structured synthesis [SOURCE: external/critique.md:12-21].
- `visual-critique` covers hierarchy, brand consistency, composition, typography, colour, affordance, and information density [SOURCE: external/designer-skills-main/visual-critique/README.md:1-22].
- `harden` covers real-world data, errors, i18n, permission, accessibility, performance, and resilience edge cases [SOURCE: external/harden.md:10-39].
- `polish` covers final alignment, interaction states, transitions, copy, responsiveness, performance, and code cleanup [SOURCE: external/polish.md:56-248].

Onboarding implications:

- Route here for "audit", "critique", "review design", "polish", "harden", "accessibility", "responsive", "performance", "edge cases", "production-ready", or "does this look AI-generated?".
- Keep findings-first reporting for review-like prompts and avoid building new UI unless the user asks for fixes.

### 3.6 `sk-design-delivery`

Scope: Own delivery artifacts and communication: developer handoff, design rationale, QA checklists, design review process, sprint/design ops, case studies, presentation decks, full-output guarantees, bento/presentation graphics, and social/report artifacts.

Boundaries: It packages decisions and outputs. It does not decide the visual direction alone and does not replace `sk-design-system` for reusable token/component contracts.

Corpus sources:

- `design-ops` covers critique frameworks, handoff specs, sprint planning, review process, QA checklists, team workflow, design debt, and impact reporting [SOURCE: external/designer-skills-main/design-ops/README.md:1-16].
- `output-skill` enforces complete deliverables and bans placeholder output patterns [SOURCE: external/output-skill.md:22-49].
- `apple-bento-grid` creates self-contained HTML bento grids for presentation cards, screenshots, reports, and social artifacts [SOURCE: external/apple-bento-grid-main/SKILL.md:20-45].

Onboarding implications:

- Route here for "handoff", "rationale", "presentation", "deck", "case study", "QA checklist", "bento", "social graphic", "report graphic", or "complete output".
- Keep Apple bento as a specialized reference or sub-mode under delivery rather than a general interface-design child.

## 4. Parent Structural Model Evidence

### Option A: Single hub with nested mode packets

Pros:

- One user-facing skill can feel simple.
- `impeccable` demonstrates a broad command table and intent router inside one surface [SOURCE: external/impeccable.md:119-166].
- Shared anti-slop rules, design-system context, and register selection can be centralized.

Cons:

- High coupling: `impeccable` setup loads context, command references, project design system, and register references before proceeding [SOURCE: external/impeccable.md:13-21]. That is heavy for every design request.
- Tool contracts diverge sharply. `sk-design-md-generator` requires Playwright extraction, deterministic token rendering, and validation [SOURCE: .opencode/skills/sk-design-md-generator/SKILL.md:256-281], while `sk-design-interface` requires creative two-pass judgment and self-critique [SOURCE: .opencode/skills/sk-design-interface/SKILL.md:94-115].
- Nested mode packets would make isolated maintenance harder because audit, extraction, variant labs, motion, and delivery artifacts all evolve at different rates.

### Option B: Umbrella router over sibling family

Pros:

- Directly matches `ui-skills-root`: choose category, inspect, load the smallest useful skill context, prefer specific skills, and never use more than three [SOURCE: external/ui-skills-root.md:22-59].
- Matches `designer-skills-main`: 9 plugins and 97 design-practice skills are organized by domain collection [SOURCE: external/designer-skills-main/README.md:61-77].
- Preserves different verification contracts and tool dependencies.
- Allows existing `sk-design-interface` and `sk-design-md-generator` to migrate without breaking names.

Cons:

- Requires a good parent router to prevent user confusion.
- Shared principles can drift unless the parent owns a compact `design-core` reference and children link to it.
- Multi-child tasks need clear co-loading rules.

Recommendation: choose Option B.

## 5. Shared Runtime and Coupling Boundary

Parent `sk-design` should own:

- Intent classification and child routing.
- Shared anti-slop baseline and quality floor.
- Shared accessibility/reduced-motion/responsive minimums.
- Shared guidance for when to co-load up to two or three children.
- Compatibility redirects for old names.

Children should own:

- Their tool contracts.
- Their detailed references.
- Their verification steps.
- Their output formats.

Suggested co-loading rules:

| Prompt Pattern | Parent Route |
|---|---|
| Ambiguous new design | `sk-design-strategy` -> `sk-design-interface` |
| Build or restyle page/component | `sk-design-interface` plus `sk-code` handoff |
| Animate flow or improve states | `sk-design-interaction` plus `sk-design-quality` if verification requested |
| Extract website design system | `sk-design-system` via `sk-design-md-generator` alias |
| Review or audit existing UI | `sk-design-quality` |
| Prepare handoff/deck/report | `sk-design-delivery` |

## 6. Per-Child Onboarding and Compatibility Plan

### Parent `sk-design`

Onboarding:

- Introduce the family as "route first, load smallest useful context".
- Show a decision table with one-line child descriptions.
- Include examples for direct child invocation and parent-routed invocation.

Compatibility:

- Keep old names routable.
- Add metadata that lists children and redirects.
- Update design transport instructions so Open Design and Figma design judgment routes through parent `sk-design`, which then selects `sk-design-interface` by default.

### Existing `sk-design-interface`

Migration:

- Keep the name as the visual craft child, unless a later decision renames it to `sk-design-craft`.
- Move generic family routing out of its SKILL.md into parent `sk-design`.
- Retain design-process references, variation diversity, real UI loop, and quality floor as child-owned references.

Compatibility:

- Existing prompts and skills that name `sk-design-interface` continue to work.
- Parent `sk-design` routes "make this look good", "redesign", "visual identity", "hero", "landing page", "variations", and "looks AI-generated" to this child.

### Existing `sk-design-md-generator`

Migration:

- Fold into `sk-design-system` as the extraction pipeline, or keep as sibling `sk-design-md-generator` with parent route metadata.
- Do not merge its full pipeline into `sk-design-interface`; its cardinal fidelity and validation rules are distinct.

Compatibility:

- Existing direct invocations still work.
- Parent `sk-design` routes "generate DESIGN.md", "extract design tokens", "capture CSS", and "validate DESIGN.md" to this child path.

### New Children

Onboarding:

- Start each child with "When to use", "When not to use", and "Pairs well with".
- Include a one-screen quick route table in parent.
- Keep child SKILL.md files narrow and put detailed material in references.

## 7. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Flat 41-child taxonomy | Over-fragments and conflicts with smallest useful context routing. | `ui-skills-root` says prefer 1 skill, use 2 only for two angles, use 3 only for broad work [SOURCE: external/ui-skills-root.md:41-49]. | 1 |
| Single monolithic hub | Couples different tool contracts and verification gates. | `sk-design-md-generator` extraction pipeline differs from `sk-design-interface` creative process [SOURCE: .opencode/skills/sk-design-md-generator/SKILL.md:14]. | 4 |
| Separate child for color/layout/type | These axes are interdependent during visual direction and variants. | `sk-design-interface` already plans color, type, layout, and signature together [SOURCE: .opencode/skills/sk-design-interface/SKILL.md:101-105]. | 2 |
| Put audit/harden/polish inside craft | Quality flows have distinct evidence and verification contracts. | `audit` is technical measurement, not design critique [SOURCE: external/audit.md:8-10]. | 3 |
| Delete existing names immediately | Breaks current references and user muscle memory. | Existing related-skill references name `sk-design-interface` and `sk-design-md-generator` [SOURCE: .opencode/skills/sk-design-md-generator/SKILL.md:398-402]. | 5 |

## 8. Open Questions

- Whether the final child name should be `sk-design-interface` or `sk-design-craft`. Compatibility favors keeping `sk-design-interface`.
- Whether `sk-design-md-generator` should remain a top-level child name or become an alias under `sk-design-system`. Operational clarity favors keeping the alias visible.
- Whether parent `sk-design` should expose commands or remain purely skill-router style. Corpus evidence supports router first; command wrappers can come later.

## 9. References

- `.opencode/skills/sk-design-interface/SKILL.md`
- `.opencode/skills/sk-design-md-generator/SKILL.md`
- `external/ui-skills-root.md`
- `external/impeccable.md`
- `external/designer-skills-main/README.md`
- `external/designer-skills-main/ux-strategy/README.md`
- `external/designer-skills-main/ui-design/README.md`
- `external/designer-skills-main/interaction-design/README.md`
- `external/designer-skills-main/design-systems/README.md`
- `external/designer-skills-main/visual-critique/README.md`
- `external/designer-skills-main/design-ops/README.md`
- `external/design-lab.md`
- `external/taste-skill.md`
- `external/layout.md`
- `external/colorize.md`
- `external/animate.md`
- `external/delight.md`
- `external/audit.md`
- `external/critique.md`
- `external/harden.md`
- `external/polish.md`
- `external/output-skill.md`
- `external/apple-bento-grid-main/SKILL.md`
