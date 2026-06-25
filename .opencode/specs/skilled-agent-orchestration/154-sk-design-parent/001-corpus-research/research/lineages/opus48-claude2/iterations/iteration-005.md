# Iteration 5: Motion/interaction cluster — and the orthogonal build-vs-audit axis

## Focus
Deep-read the motion cluster (animate, interaction-design, fixing-motion-performance, with delight/12-principles/animate-presence/pseudo-elements context) to bound the motion child and decide where motion-performance belongs.

## Findings

### F19 — Motion splits cleanly into a BUILD skill and an AUDIT skill, by document *format*
- `animate.md` is a **build/judgment** skill: where to add motion, the 100/300/500 duration rule, recommended easing curves (avoid bounce/elastic), motion materials (transform/opacity + blur/clip-path/shadow), perceived performance (80ms threshold, optimistic UI), `prefers-reduced-motion`. It ends "hand off to `{{command_prefix}}impeccable polish`" (verb-family member). [SOURCE: external/animate.md:108-208]
- `interaction-design.md` is an **implementation-pattern** skill: concrete React/Framer Motion + CSS recipes for loading states, transitions, feedback, gestures, page transitions. [SOURCE: external/interaction-design.md:51-272]
- `fixing-motion-performance.md` is an **audit** skill: `/fixing-motion-performance <file>` → "violations (quote line) / why it matters / concrete fix," organized as composite/paint/layout rules, never-patterns, scroll, blur, layers, tool boundaries. [SOURCE: external/fixing-motion-performance.md:14-151]

### F20 — STRUCTURAL KEY: the corpus has TWO orthogonal axes — domain × mode
Every domain in the corpus has both a *build* skill and an *audit* skill, and the audit skills share one output contract ("violations / why / fix", "Outputs file:line findings"):
- **Motion:** build = `animate`/`interaction-design`/`delight`/`morphing-icons`; audit = `12-principles-of-animation`, `mastering-animate-presence`, `fixing-motion-performance`, `pseudo-elements`.
- **Color:** build = `oklch`/`colorize`; audit = oklch's APCA/WCAG contrast checks + `audit` theming.
- **Layout:** build = `layout`; audit = `audit` responsive/spacing + `baseline`.
- **Accessibility:** build = `baseline` a11y rules; audit = `fixing-accessibility`.
So the corpus is organized along **(A) a domain axis** (interface/taste, layout, color, motion, a11y, design-spec) and **(B) a mode axis** (create/build · audit/critique · refine/polish · transform-intensity). impeccable's verb set is the *mode* axis made explicit (audit, polish, harden, optimize, clarify, distill, adapt = cross-domain modes); designer-skills' plugins are mostly the *domain* axis (ui-design, interaction-design, design-systems) plus a cross-domain `visual-critique` mode plugin. [SOURCE: external/fixing-motion-performance.md:1-19], [SOURCE: external/12-principles-of-animation.md], [SOURCE: external/impeccable.md], [SOURCE: external/designer-skills-main/visual-critique/README.md]

### F21 — Resolution: a hybrid taxonomy (domain children + one cross-cutting audit/QA child)
Pure domain-slicing buries the shared audit format in every child; pure mode-slicing (build/audit/refine) buries deep domain knowledge (oklch color science, motion materials). The evidence favors a **hybrid**: domain children where deep knowledge concentrates (interface/taste, color/tokens, motion/interaction, layout/structure, design-spec), plus ONE cross-cutting **audit/QA/hardening** child that owns the shared review format across domains (a11y, perf, responsive, anti-pattern, motion-perf, contrast sweeps). This matches how designer-skills keeps `visual-critique` as its own plugin while domains build. [SOURCE: external/designer-skills-main/visual-critique/README.md], [SOURCE: external/impeccable.md]

### F22 — Motion-performance dual-homing is resolved toward the audit child, referenced by motion
`fixing-motion-performance` is an audit by format and intent, so its canonical home is the **audit/QA** child; the **motion/interaction** child references it as the "verify performance" step (animate.md already hands off to polish). This avoids duplicating the audit format in the motion child. [SOURCE: external/fixing-motion-performance.md:146-151], [SOURCE: external/animate.md:197-208]

## Sources Consulted
- `external/animate.md` (full), `external/interaction-design.md` (full), `external/fixing-motion-performance.md` (full).
- `external/12-principles-of-animation.md`, `external/mastering-animate-presence.md`, `external/pseudo-elements.md`, `external/delight.md`, `external/morphing-icons.md` (front-matter + "Outputs file:line findings" pattern from iter 1).

## Assessment
- **newInfoRatio: 0.6** — The build-vs-audit format split and the orthogonal domain×mode axes (F20) are a genuinely new structural model that reframes the whole taxonomy; the motion content itself partly overlapped baseline/stitch.
- **Novelty justification:** F20's two-axis model is the lens that decides between domain-children and mode-children and yields the hybrid in F21 — central to KQ4 and KQ6.
- **Confidence:** High on the format split (read directly); medium-high on the hybrid recommendation (a reasoned design call grounded in both precedents).

## Reflection
- **Worked:** Reading build vs audit docs side-by-side exposed the shared audit output contract that defines the mode axis.
- **Insight:** "Every domain has a build skill and an audit skill" is the single most useful organizing observation so far.
- **Ruled out:** A standalone "motion-performance" child — it's an audit lens, not a domain.
- **Ruled out:** Pure mode-slicing (build/audit/refine as the only children) — buries domain depth.

## Recommended Next Focus
Iteration 6: Deep-read the audit/QA/critique/harden cluster (audit, critique, harden, optimize, fixing-accessibility) to bound the cross-cutting audit/QA child and confirm the shared review contract.
