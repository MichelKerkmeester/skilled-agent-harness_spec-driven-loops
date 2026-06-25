---
title: Deep Research Strategy - mimo25pro lineage
description: Research strategy for the sk-design parent skill restructuring analysis
trigger_phrases:
  - "sk-design restructuring research"
  - "design skill taxonomy"
  - "design parent skill architecture"
importance_tier: important
contextType: planning
version: 1.0.0
---

# Deep Research Strategy - mimo25pro Lineage

## 2. TOPIC

Determine how to restructure the existing sk-design-interface skill into a parent skill named sk-design that contains multiple focused design sub-skills, grounded in the external design-skills corpus (41 standalone design-skill docs, the designer-skills-main 9-collection/97-skill model, and apple-bento-grid-main).

---

## 3. KEY QUESTIONS (remaining)

- [ ] What is the optimal sub-skill taxonomy of 4-7 children for sk-design, each with scope, boundaries, and specific corpus sources?
- [ ] What structural model is best: single hub with nested mode packets vs. umbrella router over a sibling family?
- [ ] What coupling and shared-runtime signals exist between the candidate sub-skills?
- [ ] How should the existing sk-design-interface and sk-design-md-generator skills be folded into the family?
- [ ] What are the per-child onboarding and backward-compatibility implications?
- [ ] How does the designer-skills-main 9-collection model map to the opencode skill architecture?
- [ ] What shared resources (references, assets, scripts) should live at the parent level vs. in sub-skills?

---

## 4. NON-GOALS

- This research does NOT make the final architecture decision (owned by 002-architecture-decision)
- This research does NOT scaffold or build any skills (owned by phases 003-005)
- This research does NOT evaluate transport integrations (mcp-figma, mcp-open-design remain separate)
- This research does NOT author the design-judgment content inside each sub-skill

---

## 5. STOP CONDITIONS

- All 8 iterations completed (maxIterations reached)
- OR: composite convergence score > 0.60 with quality guards passing
- OR: all key questions answered with evidence from corpus

---

## 6. ANSWERED QUESTIONS

[None yet -- populated as iterations answer questions]

---

## 7. WHAT WORKED

[First iteration -- populated after iteration 1 completes]

---

## 8. WHAT FAILED

[First iteration -- populated after iteration 1 completes]

---

## 9. EXHAUSTED APPROACHES (do not retry)

[Populated when an approach has been tried from multiple angles without success]

---

## 10. RULED OUT DIRECTIONS

[Approaches that were investigated and definitively eliminated]

---

## 11A. CARRIED-FORWARD OPEN QUESTIONS

[Self-owned open questions from iteration write-back]

---

## 11. NEXT FOCUS

Initial scan of the full external corpus to categorize all 43 documents by design domain and identify natural clustering patterns that could inform sub-skill boundaries.

---

## 12. KNOWN CONTEXT

### External Corpus Inventory (43 items)

**41 Standalone Design-Skill Docs:**
- UI/Visual: taste-skill.md, colorize.md, layout.md, oklch-skill.md, bolder.md, quieter.md, soft-skill.md, polish.md, impeccable.md, delight.md, overdrive.md
- Motion/Animation: 12-principles-of-animation.md, animate.md, mastering-animate-presence.md, morphing-icons.md, fixing-motion-performance.md
- Accessibility: fixing-accessibility.md
- Interaction: interaction-design.md, pseudo-elements.md
- Process/Audit: audit.md, baseline.md, critique.md, clarify.md, distill.md, fix, harden.md, optimize.md, redesign-skill.md, output-skill.md
- Design Systems: canvas-design.md, design-lab.md, stitch-skill.md
- Meta/Router: ui-skills-root.md, adapt.md
- Style references: minimalist-skill.md, brutalist-skill.md, emil-design-eng.md, bencium-innovative-ux-designer.md, gpt-tasteskill.md, make-interfaces-feel-better.md
- Content: frontend-slides.md, slidev.md

**designer-skills-main (9-collection/97-skill model):**
- 9 plugins: design-research (12 skills), design-systems (11), ux-strategy (12), ui-design (14), interaction-design (16), prototyping-testing (8), design-ops (9), designer-toolkit (7), visual-critique (7)
- 30 commands across 9 plugins

**apple-bento-grid-main:**
- Bento grid design system, layout patterns, evaluation framework

### Existing Skills to Fold In
- `sk-design-interface`: Visual identity, palette, typography, layout, anti-default critique (Anthropic-sourced, Apache-2.0)
- `sk-design-md-generator`: CSS extraction pipeline, DESIGN.md v3 Style Reference format, Playwright crawler

### Predecessor/Parent Context
- Parent packet: `skilled-agent-orchestration`
- Predecessor: `143-sk-design-interface` (matured the interface skill)
- Phase-parent spec establishes sk-design as the family umbrella

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 8
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 15 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Current generation: 1
- Started: 2026-06-25T12:00:00Z
