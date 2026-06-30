# Iteration 4: Motion Expansion Leverage

## Focus

Identify the highest-leverage reference and asset additions for `design-motion`.

## Findings

- Add a Brand/Product motion register bridge. `animate` states Brand motion is voice and Product motion conveys state, with Product transitions mostly 150-250ms and no page-load choreography [SOURCE: .opencode/specs/design/008-sk-design-parent/external/animate.md:14].
- Add motion pattern cards as assets. `interaction-design` enumerates loading, state transitions, page transitions, feedback, gesture, notification, drag/drop, hover, and focus patterns [SOURCE: .opencode/specs/design/008-sk-design-parent/external/interaction-design.md:10].
- Add an AnimatePresence audit checklist asset. `mastering-animate-presence` supplies prioritized rule categories for exit animations, presence hooks, mode selection, and nested exits [SOURCE: .opencode/specs/design/008-sk-design-parent/external/mastering-animate-presence.md:21].
- Add a motion-performance failure card. `fixing-motion-performance` defines critical never-patterns around layout reads/writes, scroll polling, endless rAF loops, mixed animation systems, layer promotion, and blur/filter constraints [SOURCE: .opencode/specs/design/008-sk-design-parent/external/fixing-motion-performance.md:52].
- Do not add GSAP-heavy landing-page choreography as default guidance. `gpt-tasteskill` is strong evidence for optional high-variance landing pages, but its static-forbidden and GSAP-first posture conflicts with current motion success criteria that motion must not exhaust the user [SOURCE: .opencode/specs/design/008-sk-design-parent/external/gpt-tasteskill.md:46], [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:306].

## Sources Consulted

- `.opencode/skills/sk-design/design-motion/SKILL.md:289`
- `.opencode/specs/design/008-sk-design-parent/external/animate.md:14`
- `.opencode/specs/design/008-sk-design-parent/external/interaction-design.md:10`
- `.opencode/specs/design/008-sk-design-parent/external/mastering-animate-presence.md:21`
- `.opencode/specs/design/008-sk-design-parent/external/fixing-motion-performance.md:52`

## Assessment

- newInfoRatio: 0.51
- Novelty: Medium-high. Current motion docs cover much of the principle layer; the main delta is operational assets.
- Confidence: High.

## Reflection

What worked: using failure rules to define assets, not just examples.
What failed: treating advanced rendering/overdrive as core would exceed this phase's leverage bar.
Ruled out: making motion a GSAP command library.

## Recommended Next Focus

Investigate audit, where scoring exists but evidence capture and remediation lenses may be thin.
