# Iteration 9: Coverage sweep and the finalized source→child assignment (KQ5)

## Focus
Survey the remaining unread corpus to confirm coverage, settle in-scope vs adjacent, and complete the corpus-source→candidate-child map.

## Findings

### F36 — `design-lab` is an "explore/variations" workflow that maps to the interface child's existing diversity mode
design-lab runs interview → generate 5 distinct variations in a temp lab → feedback → refine → preview → finalize → implementation plan, with preflight detection (package manager, framework, styling system, design-memory) and project visual-style inference. This is the same territory as sk-design-interface's `variation_diversity.md` (seed-of-thought debias for N directions) and `real_ui_loop.md`. → It is a **mode of the interface child** ("explore N directions"), not a separate child. [SOURCE: external/design-lab.md:6-8], [SOURCE: external/design-lab.md:20-66], [SOURCE: .opencode/skills/sk-design-interface/SKILL.md:71-73]

### F37 — `redesign-skill` is an audit→diagnose→fix-in-place flow restating the shared anti-slop core
redesign = Scan codebase → Diagnose generic AI patterns → Fix in the existing stack without rewrite. Its audit list repeats the exact shared core (ban Inter/browser fonts, ≤65ch, no pure `#000`, saturation <80%, one accent, no warm/cool gray mix, no AI purple gradient, no 3-equal-card row, `min-h-dvh` not `100vh`, max-width container, vary radius). → It composes the **audit child** (diagnose) + **interface child** (apply standards); it is a *workflow across children*, like impeccable's `craft`/`redesign`, not a new domain. [SOURCE: external/redesign-skill.md:8-59]

### F38 — A distinct STATIC/PRESENTATION OUTPUT axis exists (canvas-design, frontend-slides, slidev, apple-bento)
These produce non-interface visual deliverables: `canvas-design` (posters/art as png/pdf), `frontend-slides` + `slidev` (HTML presentations / decks), `apple-bento` (bento stat cards for screenshot/social). They use design judgment but output *artifacts*, not product UI. → This is a **swing child**: an optional "presentation / static-graphics" child if the family wants it (4 sources support it), or classified ADJACENT/out-of-scope to keep the family focused on interfaces. Keeps the count within 4–7 either way. [SOURCE: external/canvas-design.md], [SOURCE: external/frontend-slides.md], [SOURCE: external/slidev.md], [SOURCE: external/apple-bento-grid-main/SKILL.md:200-204]

### F39 — Confirmed OUT-OF-SCOPE (meta/infra, not design judgment)
`output-skill` (full-output-enforcement — anti-truncation) and `ui-skills-root` (a CLI selector) are infrastructure/routing, not design-judgment children. `ui-skills-root` *informs* the parent's router design but is not a child. The five designer-skills process plugins (design-research, ux-strategy, prototyping-testing, design-ops, most of designer-toolkit) are a UX-strategy family, adjacent to but outside an interface-build family. [SOURCE: external/output-skill.md], [SOURCE: external/ui-skills-root.md], [SOURCE: external/designer-skills-main/README.md:69-77]

### F40 — Finalized corpus-source → candidate-child map (KQ5)
1. **interface/taste (flagship)** ← taste-skill, gpt-taste, bencium, emil-design-eng, impeccable (identity+craft/shape), make-interfaces-feel-better, design-lab (explore mode), redesign-skill (apply), soft + named-aesthetic presets (brutalist/minimalist/apple-bento) as references; existing `sk-design-interface`. designer-skills `ui-design` aesthetic-usability.
2. **layout/structure** ← layout, baseline (layout parts), adapt; designer-skills `ui-design` layout-grid/spacing-system/visual-hierarchy/responsive-design; gpt-taste (bento).
3. **color/tokens** ← oklch, colorize; designer-skills `design-systems` design-token/theming-system/dark-mode-design + `ui-design` color-system.
4. **motion/interaction** ← animate, interaction-design, delight, morphing-icons; designer-skills `interaction-design` (micro-interaction-spec/feedback/loading/state-machine/animation-principles) + `design-systems` motion-system.
5. **audit/QA/hardening** ← audit, critique, polish, harden, optimize, fixing-accessibility, fixing-motion-performance, 12-principles, mastering-animate-presence, pseudo-elements, baseline (constraint mode); designer-skills `visual-critique` (7) + `design-systems` accessibility-audit.
6. **design-spec / style-reference (DESIGN.md)** ← existing `sk-design-md-generator` (extract), stitch-skill (author); designer-skills `design-systems` design-token + documentation-template.
7. **(optional/swing) presentation / static-graphics** ← canvas-design, frontend-slides, slidev, apple-bento.
Modifiers folded across 1/5: bolder, quieter, overdrive, distill, clarify (clarify also → interface writing).

## Sources Consulted
- `external/design-lab.md` (workflow + preflight, first 70 lines), `external/redesign-skill.md` (audit lists, first 60 lines).
- Front-matter + impeccable command-table roles for canvas-design, frontend-slides, slidev, output-skill, ui-skills-root, morphing-icons, emil, bencium, gpt-taste, critique, optimize, polish, colorize, adapt, delight, distill, clarify, bolder, quieter, overdrive (iters 1 + 7).

## Assessment
- **newInfoRatio: 0.4** — design-lab-as-mode, redesign-as-cross-child-workflow, the static-output swing child (F38), and the finalized source→child map (F40) are new; much of the sweep confirmed prior clustering (declining novelty is expected as coverage saturates).
- **Novelty justification:** Completes KQ5 with a full, cited source→child assignment and resolves every remaining doc as core / modifier / swing / out-of-scope.
- **Confidence:** High on placement (front-matter + reads); medium on the swing-child call (a scope judgment for phase 002).

## Reflection
- **Worked:** A front-matter-first sweep with targeted reads of only the ambiguous docs (design-lab, redesign) saturated coverage cheaply.
- **Insight:** Workflows like redesign/craft are *cross-child compositions* — they argue for a parent that can sequence children (router/orchestration), reinforcing the umbrella-with-router read.
- **Ruled out:** A separate "redesign" or "explore" child — both are workflows/modes spanning existing children.
- **Ruled out:** output-skill / ui-skills-root as children.

## Recommended Next Focus
Iteration 10: Synthesize the candidate taxonomy — prune/merge to the recommended 4–7 children with scope, boundaries, and overlaps resolved (KQ4), and decide the swing child.
