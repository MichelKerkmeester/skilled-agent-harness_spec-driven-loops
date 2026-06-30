# Iteration 6: Parent Router Logic & Shared Resources

## Focus
Define the exact routing logic for the `sk-design` parent and what shared resources it holds.

## Findings

### Parent Router Design

The `sk-design` parent follows the **deep-loop-workflows** pattern: a thin router that detects intent and dispatches to the appropriate sub-skill.

**Routing Logic (Pseudocode)**:
```python
def route_design_task(request):
    text = request.lower()
    
    # Priority-ordered intent detection
    if any(kw in text for kw in ["color", "palette", "oklch", "token", "theme", "dark mode", "contrast"]):
        return "sk-design-color"
    
    if any(kw in text for kw in ["motion", "animation", "animate", "spring", "gsap", "scroll", "transition"]):
        return "sk-design-motion"
    
    if any(kw in text for kw in ["layout", "spacing", "grid", "bento", "responsive", "hierarchy", "rhythm"]):
        return "sk-design-layout"
    
    if any(kw in text for kw in ["accessibility", "a11y", "wcag", "aria", "keyboard", "focus", "audit", "harden", "edge case"]):
        return "sk-design-a11y"
    
    if any(kw in text for kw in ["interaction", "state", "gesture", "feedback", "form", "navigation", "loading", "error state", "onboarding"]):
        return "sk-design-interaction"
    
    if any(kw in text for kw in ["design", "redesign", "visual", "typography", "font", "aesthetic", "look", "style", "brand", "critique", "variation"]):
        return "sk-design-visual"
    
    # Default: visual identity is the gateway
    return "sk-design-visual"
```

**Multi-skill dispatch**: When a task touches multiple domains (e.g., "design a landing page with custom colors and animations"), the parent routes to the **primary** sub-skill, which then references siblings as needed via `enhances` edges in the skill-graph.

### Shared Resources at Parent Level

```
opencode/skills/sk-design/
├── SKILL.md                    # Router + shared principles
├── references/
│   ├── design-principles/
│   │   ├── anti-default-discipline.md    # From taste-skill.md Section 0.D + 4
│   │   ├── brand-vs-product-register.md  # From corpus Register pattern
│   │   └── design-read-protocol.md       # From taste-skill.md Section 0
│   ├── cognitive-laws/
│   │   ├── hicks-law.md
│   │   ├── millers-law.md
│   │   ├── fitts-law.md
│   │   ├── doherty-threshold.md
│   │   ├── aesthetic-usability-effect.md
│   │   ├── von-restorff-effect.md
│   │   ├── law-of-proximity.md
│   │   └── law-of-common-region.md
│   └── conventions/
│       ├── skill-structure.md            # Family YAML frontmatter format
│       ├── verification-workflow.md      # Family verification pattern
│       └── naming-conventions.md         # Sub-skill naming rules
└── assets/
    └── family-brief-template.md          # Shared brief template
```

### What the Parent Does NOT Hold

- Domain-specific design judgment (lives in children)
- Implementation code (lives in sk-code)
- Design system extraction (lives in sk-design-md-generator)
- Transport logic (lives in mcp-figma, mcp-open-design)

### Parent SKILL.md Structure

```markdown
---
name: sk-design
description: "Design family router: detects design intent and dispatches to focused sub-skills (visual, color, motion, layout, a11y, interaction)."
---

# Design Family Router (sk-design)

## When to Use
Use when the task involves ANY design work. The router detects the specific domain and dispatches.

## Smart Routing
[Intent detection logic from above]

## Sub-Skills
| Sub-Skill | Domain | When |
|---|---|---|
| sk-design-visual | Visual identity, aesthetics, typography | Default for design tasks |
| sk-design-color | Color systems, tokens, palettes | Color-specific work |
| sk-design-motion | Animation, motion principles | Motion-specific work |
| sk-design-layout | Layout, grids, spacing | Layout-specific work |
| sk-design-a11y | Accessibility, quality, hardening | A11y/quality work |
| sk-design-interaction | Interaction, feedback, states | Interaction-specific work |

## Shared Resources
- design-principles/: Anti-default discipline, register pattern
- cognitive-laws/: Universal UX laws (Hick's, Miller's, Fitts's, etc.)
- conventions/: Family structure and naming rules

## Integration Points
- sk-design-md-generator: Design system extraction engine
- sk-code: Implementation (this family decides the look, sk-code builds it)
- mcp-figma, mcp-open-design: Design tool transports
```

## Questions Answered
- How does the parent route? → Priority-ordered keyword detection, default to visual
- What shared resources at parent? → Design principles, cognitive laws, conventions
- What does parent NOT do? → No domain judgment, no implementation, no extraction

## Questions Remaining
- Final convergence assessment
- Synthesis strategy

## Next Focus
Convergence analysis — assess whether the research has converged or needs more iterations.
