# Iteration 7: Refinements & Edge Cases

## Focus
Address remaining edge cases: cross-cutting concerns, the "full design" workflow, and how a user who wants "design a landing page" flows through multiple sub-skills.

## Findings

### The "Full Design" Workflow

When a user says "design a landing page", the task touches ALL sub-skills:
1. **sk-design-visual**: Aesthetic direction, typography, brief inference
2. **sk-design-color**: Palette generation
3. **sk-design-layout**: Hero layout, section composition, responsive structure
4. **sk-design-motion**: Scroll animations, hover effects
5. **sk-design-interaction**: CTA states, form behavior
6. **sk-design-a11y**: Accessibility audit before shipping

**Routing strategy**: The parent routes to `sk-design-visual` as the **primary** (it's the gateway for full design tasks). `sk-design-visual` then references siblings as needed via its own conditional reference loading.

This mirrors how `sk-code` works: it detects the surface and loads surface-specific references, but the workflow (Phase 0-3) is shared.

### Cross-Cutting Concerns

**Accessibility** is cross-cutting — every sub-skill should honor a11y rules. But `sk-design-a11y` is the **audit/fix** capability, not the rules themselves. The rules (contrast ratios, semantic HTML, keyboard nav) should be in the parent's shared references as "quality floor" constraints that every sub-skill inherits.

**Responsive design** is cross-cutting — layout owns it, but visual (typography scaling), color (dark mode), and interaction (touch targets) all need responsive awareness. Solution: `sk-design-layout` owns responsive structure; other sub-skill reference it as a conditional dependency.

**Dark mode** touches color (token architecture) and visual (aesthetic consistency). Solution: `sk-design-color` owns dark mode token architecture; `sk-design-visual` references it for aesthetic consistency.

### Edge Case: "Just fix the spacing"

A user who says "just fix the spacing" expects ONE sub-skill to handle it. The parent routes to `sk-design-layout`. No cross-skill dispatch needed.

### Edge Case: "Make it more delightful"

"Delight" is ambiguous — it could mean visual (sk-design-visual), motion (sk-design-motion), or interaction (sk-design-interaction). The parent should route to `sk-design-interaction` (delight.md is an interaction concern), which then references motion for animation.

### Edge Case: "Extract the design system from this URL"

This routes to `sk-design-md-generator` directly (not through the sk-design parent). The parent is for design JUDGMENT, not extraction. sk-design-md-generator is a sibling under the family but has its own entry point.

### Progressive Synthesis Strategy

For the research.md synthesis, findings should be organized by:
1. **Taxonomy** (the 6 sub-skills with scope/boundaries/sources)
2. **Structural Model** (umbrella router evidence)
3. **Onboarding** (per-child effort and backward compat)
4. **Open Questions** (for the 002-architecture-decision phase)

## Questions Answered
- How does "design a landing page" flow? → Parent routes to visual, visual dispatches to siblings
- Who owns accessibility rules? → Parent shared references (quality floor)
- Who owns responsive? → sk-design-layout primary, others reference
- How does sk-design-md-generator relate? → Sibling, direct entry point, not through parent

## Questions Remaining
- Final convergence assessment

## Next Focus
Synthesis — produce the final research.md.
