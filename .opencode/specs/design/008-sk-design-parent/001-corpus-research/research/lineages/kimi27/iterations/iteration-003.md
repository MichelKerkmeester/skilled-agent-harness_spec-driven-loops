# Iteration 3: Motion/animation corpus and the scope of `sk-design-motion`

## Focus

Determine whether motion/animation sources form a single `sk-design-motion` child or should be split across direction and critique.

## Findings

1. **Motion sources cluster into four layers.**
   - *Guidance/ideation*: `animate.md` (purposeful motion, one hero moment, timing/easing rules, reduced-motion), `12-principles-of-animation.md` (Disney principles adapted for web, file:line audit), `animation-principles` (designer-skills) (easing, duration, types, stagger). [SOURCE: file:external/animate.md:1-120] [SOURCE: file:external/12-principles-of-animation.md:1-120] [SOURCE: file:external/designer-skills-main/interaction-design/skills/animation-principles/SKILL.md:1]
   - *Specification*: `micro-interaction-spec` (trigger/rules/feedback/loops), `feedback-patterns` (visual/text/audio/haptic feedback hierarchy), `loading-states` (skeleton, progress, optimistic UI). [SOURCE: file:external/designer-skills-main/interaction-design/skills/micro-interaction-spec/SKILL.md:1] [SOURCE: file:external/designer-skills-main/interaction-design/skills/feedback-patterns/SKILL.md:1] [SOURCE: file:external/designer-skills-main/interaction-design/skills/loading-states/SKILL.md:1]
   - *Performance/audit*: `fixing-motion-performance.md` (rendering steps, never patterns, measurement, scroll, paint, layers, blur), `mastering-animate-presence.md` (Motion/Framer Motion exit-animation audit). [SOURCE: file:external/fixing-motion-performance.md:1-120] [SOURCE: file:external/mastering-animate-presence.md:1-120]
   - *Specialized/advanced*: `morphing-icons.md` (SVG line-morph icon components), `overdrive.md` (extraordinary effects: View Transitions, WebGL, scroll-driven, spring). [SOURCE: file:external/morphing-icons.md:1-120] [SOURCE: file:external/overdrive.md:1-120]

2. **`sk-design-interface` already claims motion at the direction layer** — it chooses palette, type, layout, *and motion* as part of the token system, and warns against motion piling up. [SOURCE: file:.opencode/skills/sk-design-interface/SKILL.md:94-117] However, it does not provide animation implementation rules, timing/easing tables, performance audits, or reduced-motion mechanics. That gap is exactly the scope for a separate `sk-design-motion` child.

3. **`sk-design-motion` boundary**: owns *how* to animate (timing, easing, orchestration, performance, accessibility) but not *what style* to animate. The *what* (aesthetic lane, dial settings) stays in `sk-design-direction`. This avoids duplicating the anti-default critique while giving motion its own implementation depth.

4. **`overdrive.md` and `morphing-icons.md` are optional advanced sub-modules** rather than core children. `overdrive` requires user confirmation before building and targets "extraordinary" effects; `morphing-icons` is a narrow component pattern. Both can live as references under `sk-design-motion`.

## Sources Consulted

- `external/animate.md` (first 120 lines)
- `external/morphing-icons.md` (first 120 lines)
- `external/mastering-animate-presence.md` (first 120 lines)
- `external/fixing-motion-performance.md` (first 120 lines)
- `external/12-principles-of-animation.md` (first 120 lines)
- `external/overdrive.md` (first 120 lines)
- `external/designer-skills-main/interaction-design/skills/animation-principles/SKILL.md`
- `external/designer-skills-main/interaction-design/skills/feedback-patterns/SKILL.md`
- `external/designer-skills-main/interaction-design/skills/loading-states/SKILL.md`

## Assessment

- **newInfoRatio**: 0.75
- **noveltyJustification**: Confirms motion is a distinct implementation child; identifies advanced sub-modules that should not be separate children.
- **status**: complete

## Reflection

- **What worked**: Comparing standalone motion docs against `sk-design-interface` showed a clean boundary: direction sets motion intent, motion child owns execution.
- **What failed**: None.
- **Ruled out**: Splitting motion into multiple top-level children (e.g., animation, micro-interactions, performance) — the sources are too interleaved; a single `sk-design-motion` child with sub-references is cleaner.

## Recommended Next Focus

Iteration 4: Read critique/accessibility/quality standalone docs and designer-skills visual-critique/prototyping-testing skills to scope `sk-design-critique`.
