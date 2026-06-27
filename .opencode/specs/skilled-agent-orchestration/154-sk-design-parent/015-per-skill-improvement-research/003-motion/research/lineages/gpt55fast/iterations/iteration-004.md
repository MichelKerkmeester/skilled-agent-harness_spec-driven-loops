# Iteration 004: External corpus residuals

## Focus

Identify external corpus ideas that still improve motion without bulk-importing or over-expanding the packet.

## Findings

1. `emil-design-eng` contains a compact advanced-craft cluster not fully captured by the current packet: origin-aware popovers [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/emil-design-eng.md:234-248], instant follow-up tooltips [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/emil-design-eng.md:252-271], interruptible transitions over keyframes for dynamic UI [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/emil-design-eng.md:274-293], and `@starting-style` for CSS entry states [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/emil-design-eng.md:324-341]. This is the best candidate for a small `advanced_motion_craft.md` top-up.
2. The same file adds concrete tooling and verification guidance: slow-motion testing, frame-by-frame inspection, and real-device gesture testing [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/emil-design-eng.md:642-661]. The current motion verification asks for low target device checks but lacks slow-motion/frame-by-frame tactics [SOURCE: .opencode/skills/sk-design/design-motion/references/performance_reduced_motion.md:94-100].
3. `emil-design-eng` includes a Framer Motion caveat: shorthand `x`, `y`, and `scale` run on requestAnimationFrame and can drop frames under load, while full `transform` strings can stay smoother [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/emil-design-eng.md:500-517]. Current motion performance guidance warns about rAF and transform/opacity but does not call out this Motion-specific shorthand caveat [SOURCE: .opencode/skills/sk-design/design-motion/references/performance_reduced_motion.md:43-51].
4. `overdrive` is useful only as an on-demand advanced rendering boundary. It requires proposing two or three directions and getting user choice before code [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/overdrive.md:19-27], and it requires progressive enhancement, fallbacks, reduced motion, off-screen pause, and real-device testing [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/overdrive.md:93-116]. This should not become a default-loaded motion reference.
5. `fixing-motion-performance` has a priority matrix that could improve the failure card's UX. It ranks never patterns, mechanism choice, measurement, scroll, paint, layers, blur, view transitions, and tool boundaries [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/fixing-motion-performance.md:38-50]. Current failure card has strong rows but no priority labels [SOURCE: .opencode/skills/sk-design/design-motion/assets/motion_performance_failure_card.md:32-43].
6. The current corpus map omits `emil-design-eng` and `overdrive`, even though the prior 009 research named both as motion sources [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/009-reference-asset-expansion/research/research.md:94-97]. Current `corpus_map.md` maps animate, interaction-design, delight, morphing-icons, 12-principles, mastering-animate-presence, fixing-motion-performance, and make-interfaces-feel-better only [SOURCE: .opencode/skills/sk-design/design-motion/references/corpus_map.md:33-44].

## Dead Ends

| Approach | Reason Eliminated | Evidence |
|---|---|---|
| Make advanced rendering default guidance | Overdrive says propose before building and warn on context | `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/overdrive.md:19-27` |
| Import all `emil-design-eng` sections | Much of the core decision framework is already captured | `.opencode/skills/sk-design/design-motion/references/animation_decision_framework.md:35-101` |
| Move motion performance review into motion | The failure card says release audit scoring belongs to audit | `.opencode/skills/sk-design/design-motion/assets/motion_performance_failure_card.md:14-18` |

## Assessment

newInfoRatio: 0.35. The highest-value external addition is a bounded advanced-craft top-up and corpus map update, not a large new corpus mirror.
