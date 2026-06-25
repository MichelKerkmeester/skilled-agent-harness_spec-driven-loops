# Iteration 12: Per-child onboarding — triggers, advisor metadata, references, skill-graph (KQ8)

## Focus
Define onboarding for each recommended child: trigger phrases, advisor keywords, the reference corpus to seed it with, and its skill-graph edges — so each child is discoverable and routable from day one.

## Findings

### F49 — Onboarding spec per child
**sk-design-interface** (keep name; augment)
- Triggers: "design", "redesign", "make it look good", "variations", "hero section", "landing page", "looks templated/AI-generated", "visual identity", "art direction".
- Advisor keywords: interface-design, frontend-design, visual-identity, anti-slop, art-direction, design-direction.
- Seed references: existing design_principles/variation_diversity/real_ui_loop + new packets distilled from taste-skill, gpt-taste, bencium, emil, impeccable (craft/shape/redesign/explore), make-interfaces-feel-better; named-aesthetic presets (brutalist/minimalist/soft/apple-bento) as a `references/aesthetics/` preset library.
- Skill-graph: ENHANCES sk-code; RELATED sk-design-foundations, sk-design-motion, sk-design-spec, sk-design-audit, mcp-figma, mcp-open-design.

**sk-design-foundations** (new)
- Triggers: "color palette", "oklch", "contrast", "design tokens", "typography scale", "font pairing", "spacing system", "layout grid", "visual hierarchy", "dark mode", "responsive".
- Advisor keywords: color-system, oklch, design-tokens, typography, spacing, layout, responsive, theming, dark-mode.
- Seed references: oklch (+ its 4 sub-refs), colorize, layout, baseline (token/type/color rules), adapt; designer-skills ui-design + design-systems token/theming docs.
- Skill-graph: ENHANCES sk-design-interface, sk-code; RELATED sk-design-spec (tokens ↔ DESIGN.md), sk-design-audit (contrast/theming review).

**sk-design-motion** (new)
- Triggers: "animation", "micro-interaction", "transition", "framer motion", "motion design", "hover state", "loading state", "scroll animation", "icon morph".
- Advisor keywords: animation, motion-design, micro-interaction, transitions, framer-motion, gsap, reduced-motion.
- Seed references: animate, interaction-design, delight, morphing-icons; designer-skills interaction-design + motion-system.
- Skill-graph: ENHANCES sk-design-interface, sk-code; RELATED sk-design-audit (fixing-motion-performance), sk-design-foundations (motion tokens).

**sk-design-audit** (new)
- Triggers: "audit", "design review", "critique", "accessibility", "a11y", "WCAG", "performance", "harden", "production-ready", "anti-pattern", "does this look AI-generated", "polish".
- Advisor keywords: design-audit, accessibility-audit, ux-critique, performance, hardening, anti-slop-detection, design-qa.
- Seed references: audit, critique, polish, harden, optimize, fixing-accessibility, fixing-motion-performance, 12-principles, mastering-animate-presence, pseudo-elements, baseline; designer-skills visual-critique + accessibility-audit.
- Skill-graph: ENHANCES sk-design-interface, sk-code-review; RELATED all design children (it reviews their output); shares the P0–P3 severity contract with sk-code-review.

**sk-design-spec** (folds sk-design-md-generator)
- Triggers: "extract design system", "generate DESIGN.md", "capture website css", "design tokens from url", "style reference", "author design system", "design.md from brief".
- Advisor keywords: design-md, design-tokens, css-extraction, style-reference, design-system-generator, design-to-markdown.
- Seed references: existing md-generator references + a new "author" path distilled from stitch-skill.
- Skill-graph: ENHANCES sk-design-interface, sk-code; RELATED mcp-figma, mcp-open-design (alternative extraction sources), sk-design-foundations (tokens).

### F50 — Parent-level routing onboarding
The `sk-design` parent registers one umbrella entry plus a router that maps intent → child via a `skill-registry.json` (the deep-loop-workflows pattern). Disambiguation defaults: a free-form "design X" → interface; "fix/review/audit X" → audit; "extract/DESIGN.md" → spec; "color/type/layout/tokens" → foundations; "animate/motion" → motion. The parent also surfaces the shared design-base (anti-slop rules, register, slop test) that all children reference. [SOURCE: external/impeccable.md:149-168], [SOURCE: external/ui-skills-root.md], [SOURCE: skill registry: deep-loop-workflows]

### F51 — Discovery requires advisor + skill-graph rebuild (a hard onboarding step)
Per the framework, new/renamed skills are invisible to memory search and graph traversal until metadata is regenerated. Onboarding MUST: (a) author each child's frontmatter (name, description, trigger_phrases, version), (b) run the skill-advisor rebuild and skill-graph scan, and (c) validate routing so the advisor surfaces the right child at ≥0.8 confidence. Without this the children exist but never route. [SOURCE: .opencode/skills/sk-design-interface/SKILL.md:1-12], [SOURCE: .opencode/skills/sk-design-md-generator/SKILL.md:1-6]

## Sources Consulted
- Existing SKILL.md frontmatter/trigger patterns (sk-design-interface, sk-design-md-generator) as the metadata template.
- impeccable routing rules + ui-skills-root selector + deep-loop-workflows registry pattern (prior iters).

## Assessment
- **newInfoRatio: 0.4** — The per-child trigger/advisor/reference/skill-graph specs, the parent routing defaults, and the advisor/skill-graph-rebuild onboarding requirement are new and actionable.
- **Novelty justification:** Delivers the onboarding half of deliverable 3 (KQ8) at a granularity phase 002/004 can execute directly.
- **Confidence:** High on trigger/reference assignment (derived from corpus + existing metadata); medium on exact advisor keyword tuning (validate empirically during build).

## Reflection
- **Worked:** Reusing the existing skills' frontmatter as a metadata template makes onboarding concrete and consistent.
- **Insight:** Discovery is a first-class onboarding deliverable, not an afterthought — the advisor/skill-graph rebuild is the gate that makes the family real.
- **Ruled out:** Relying on the parent alone for discovery — each child needs its own trigger metadata for advisor precision.

## Recommended Next Focus
Iteration 13: Backward-compatibility plan for folding in sk-design-interface and sk-design-md-generator (KQ7 final) — naming, aliases, reference rewiring, and migration sequence.
