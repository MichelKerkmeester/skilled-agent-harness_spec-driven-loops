# Iteration 002: Prior research versus current packet

## Focus

Compare the prior 009 motion recommendations with the current motion packet so the improvement list does not duplicate completed work.

## Findings

1. The prior 009 synthesis identified the motion gaps as a missing restraint gate, reusable pattern cards, an AnimatePresence checklist, a performance failure card, an advanced-craft top-up, and a nice-to-have advanced rendering reference [SOURCE: .opencode/specs/design/008-sk-design-parent/009-reference-asset-expansion/research/research.md:84-97].
2. Phase 012 implemented the highest-priority motion pieces: `animation_decision_framework.md`, `motion_pattern_cards.md`, `animate_presence_checklist.md`, and `motion_performance_failure_card.md` [SOURCE: .opencode/specs/design/008-sk-design-parent/012-foundations-motion-audit/implementation-summary.md:64-69]. The tasks confirm those four were authored and completed [SOURCE: .opencode/specs/design/008-sk-design-parent/012-foundations-motion-audit/tasks.md:68-71].
3. The current restraint gate is strong and should not be rewritten. It covers the 100-plus-per-day frequency no, the keyboard no, purpose test, register coupling, and ordered application [SOURCE: .opencode/skills/sk-design/design-motion/references/animation_decision_framework.md:35-45] [SOURCE: .opencode/skills/sk-design/design-motion/references/animation_decision_framework.md:50-63] [SOURCE: .opencode/skills/sk-design/design-motion/references/animation_decision_framework.md:81-101].
4. The current cards are usable fill-in assets. `motion_pattern_cards.md` forces owner, purpose, states, timing/easing, properties, and reduced motion [SOURCE: .opencode/skills/sk-design/design-motion/assets/motion_pattern_cards.md:22-32]. The checklist covers exit wiring, keys, first render, mode, presence hooks, and nested exits [SOURCE: .opencode/skills/sk-design/design-motion/assets/animate_presence_checklist.md:22-30] [SOURCE: .opencode/skills/sk-design/design-motion/assets/animate_presence_checklist.md:35-87]. The failure card covers layout thrash, scroll polling, endless rAF, mixed systems, layer promotion, paint-heavy effects, and blur [SOURCE: .opencode/skills/sk-design/design-motion/assets/motion_performance_failure_card.md:32-43].
5. The residual prior-research gap is explicitly deferred, not forgotten: phase 012 known limitations say MO-R2 advanced motion craft top-up and MO-R3 advanced rendering were out of scope and remain nice-to-haves [SOURCE: .opencode/specs/design/008-sk-design-parent/012-foundations-motion-audit/implementation-summary.md:119-125].

## Dead Ends

| Approach | Reason Eliminated | Evidence |
|---|---|---|
| Re-propose `animation_decision_framework.md` | Already implemented and wired | `.opencode/specs/design/008-sk-design-parent/012-foundations-motion-audit/implementation-summary.md:64-69` |
| Re-propose the three motion cards | Already implemented as current assets | `.opencode/skills/sk-design/design-motion/assets/motion_pattern_cards.md:14-18`; `.opencode/skills/sk-design/design-motion/assets/animate_presence_checklist.md:14-18`; `.opencode/skills/sk-design/design-motion/assets/motion_performance_failure_card.md:14-18` |

## Assessment

newInfoRatio: 0.72. The main result is scope narrowing: recommend residual top-ups, not the already-delivered 009 core.
