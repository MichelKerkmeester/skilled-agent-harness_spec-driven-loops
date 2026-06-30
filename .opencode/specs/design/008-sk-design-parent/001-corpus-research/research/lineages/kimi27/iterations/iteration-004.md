# Iteration 4: Critique, accessibility, and quality-corpus clustering

## Focus

Decide whether critique, audit, accessibility, polish, and copy-clarity sources form one `sk-design-critique` child (or split into writing/qa).

## Findings

1. **`impeccable.md` is a broad frontend-improvement umbrella**, not a narrow skill. Its description explicitly lists the commands it covers: craft, shape, audit, polish, clarify, distill, harden, optimize, adapt, animate, colorize, extract, etc. [SOURCE: file:external/impeccable.md:1-120] This shows the market treats design *critique/audit/polish* as a family of improvement commands, analogous to how `sk-design` could expose sub-skills for each.

2. **Standalone critique/quality docs are complementary layers:**
   - `critique.md` runs two independent assessments (design director review + detector/browser evidence) and outputs a Nielsen-heuristic health score. [SOURCE: file:external/critique.md:1-120]
   - `audit.md` is a technical implementation audit across accessibility, performance, theming, responsive design, and anti-patterns, scored 0-4 per dimension. [SOURCE: file:external/audit.md:1-120]
   - `fixing-accessibility.md` is a code-level accessibility fix guide with critical rules for names, keyboard access, focus/dialogs, semantics, forms, announcements, contrast, motion. [SOURCE: file:external/fixing-accessibility.md:1-120]
   - `clarify.md` improves labels, microcopy, error messages, empty states, CTAs, loading copy. [SOURCE: file:external/clarify.md:1-120]
   - `polish.md` (read in Iteration 2) is the final quality pass covering design-system alignment, spacing, typography, color/contrast, interaction states, and micro-interactions.

3. **Designer-skills critique/test disciplines reinforce a single `sk-design-critique` child.**
   - `visual-critique` skills (critique-color, critique-typography, critique-composition, etc.) audit dimensional design quality. [SOURCE: file:external/designer-skills-main/visual-critique/skills/critique-color/SKILL.md:1] [SOURCE: file:external/designer-skills-main/visual-critique/skills/critique-typography/SKILL.md:1]
   - `heuristic-evaluation` applies Nielsen's 10 heuristics with severity ratings. [SOURCE: file:external/designer-skills-main/prototyping-testing/skills/heuristic-evaluation/SKILL.md:1]
   - `accessibility-audit` is a WCAG 2.2 POUR audit with severity ratings and remediation. [SOURCE: file:external/designer-skills-main/design-systems/skills/accessibility-audit/SKILL.md:1]

4. **Boundary with `sk-design-direction`**: `sk-design-interface` already includes a *self-critique* step during design (critique the plan against AI defaults before building). [SOURCE: file:.opencode/skills/sk-design-interface/SKILL.md:94-117] The new `sk-design-critique` child handles *post-hoc* critique/audit/polish of existing UI, plus accessibility remediation and copy clarity. This keeps direction focused on invention and critique focused on evaluation.

5. **UX-writing/clarify placement**: `clarify.md` and designer-skills `ux-writing` [SOURCE: file:external/designer-skills-main/designer-toolkit/skills/ux-writing/SKILL.md:1] are tightly coupled to interface quality. Rather than a separate writing child, they fit inside `sk-design-critique` as a "copy clarity" sub-module, because the work is usually done during audit/polish passes.

## Sources Consulted

- `external/impeccable.md` (first 120 lines)
- `external/critique.md` (first 120 lines)
- `external/audit.md` (first 120 lines)
- `external/fixing-accessibility.md` (first 120 lines)
- `external/clarify.md` (first 120 lines)
- `external/designer-skills-main/visual-critique/skills/critique-color/SKILL.md`
- `external/designer-skills-main/visual-critique/skills/critique-typography/SKILL.md`
- `external/designer-skills-main/prototyping-testing/skills/heuristic-evaluation/SKILL.md`
- `external/designer-skills-main/design-systems/skills/accessibility-audit/SKILL.md`

## Assessment

- **newInfoRatio**: 0.70
- **noveltyJustification**: Solidifies a single critique/qa child and resolves the copy-clarity placement.
- **status**: complete

## Reflection

- **What worked**: Comparing `impeccable`'s command surface against the internal `sk-design-interface` self-critique step clarified the invention-vs-evaluation boundary.
- **What failed**: None.
- **Ruled out**: Creating a separate `sk-design-writing` child — `clarify`/`ux-writing` are evaluation/polish tasks and fit under critique.

## Recommended Next Focus

Iteration 5: Analyze the parent structural model by comparing `deep-loop-workflows` (hub + nested packets) against an umbrella router, using existing internal skills as evidence.
