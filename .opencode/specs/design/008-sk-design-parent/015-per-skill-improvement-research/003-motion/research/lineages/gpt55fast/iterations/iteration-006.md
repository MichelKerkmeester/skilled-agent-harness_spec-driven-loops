# Iteration 006: Prioritized recommendations and do-not list

## Focus

Rank the evidence-backed improvements and finalize the do-not list.

## Prioritized Improvements

1. **P1 - Fix the resource-loading contract for register + restraint gate.** The SKILL says every motion task loads `../shared/register.md` and `animation_decision_framework.md` first [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:95-99], but pseudocode only defaults to `corpus_map.md` and guards paths under the motion packet [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:114-117] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:151-156] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:201-209]. This is the clearest efficiency and correctness improvement.
2. **P1 - Add a small advanced motion craft reference or top-up.** Focus on origin-aware popovers, instant follow-up tooltips, interruptible transitions, `@starting-style`, slow-motion debugging, and Framer Motion shorthand caveats [SOURCE: .opencode/specs/design/008-sk-design-parent/external/emil-design-eng.md:234-276] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/emil-design-eng.md:324-341] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/emil-design-eng.md:500-517] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/emil-design-eng.md:642-661]. Keep it compact and practical.
3. **P1 - Repair manual playbook expected-resource drift and add hub routing coverage.** The playbook is good but some expected resource lists omit ALWAYS resources or disagree with their own process [SOURCE: .opencode/skills/sk-design/design-motion/manual_testing_playbook/01--strategy/001-purposeful-motion-plan.md:11-15] [SOURCE: .opencode/skills/sk-design/design-motion/manual_testing_playbook/03--reduced-motion/001-performance-and-reduced-motion.md:11-16] [SOURCE: .opencode/skills/sk-design/design-motion/manual_testing_playbook/03--reduced-motion/001-performance-and-reduced-motion.md:30-34]. Add one hub-level mode-routing scenario.
4. **P2 - Add or persist a motion-specific benchmark artifact/fixture.** The local 014 artifact present is `design-interface`, not motion [SOURCE: .opencode/specs/design/008-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.md:1-6]. If motion really scores 100/100, preserve that in a motion-labeled report or fixture so future work does not infer from interface.
5. **P2 - Update corpus traceability and stale release notes.** `corpus_map.md` should include `emil-design-eng` for the advanced-craft additions and `overdrive` only as an on-demand boundary if MO-R3 is added [SOURCE: .opencode/skills/sk-design/design-motion/references/corpus_map.md:33-44]. The changelog should stop claiming `feature_catalog/` and per-packet `graph-metadata.json` in the nested packet [SOURCE: .opencode/skills/sk-design/design-motion/changelog/v1.0.0.0.md:14-17] [SOURCE: .opencode/skills/sk-design/SKILL.md:74-77].
6. **P2 - Add a handoff mechanism field to motion cards.** Motion already hands to `sk-code` with timing, easing, states, reduced motion, and risk [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:256-259]. Add a field for implementation mechanism and stack boundary, using existing library unless explicitly asked to migrate [SOURCE: .opencode/specs/design/008-sk-design-parent/external/fixing-motion-performance.md:116-120].
7. **P3 - Add an on-demand advanced rendering card, not a default reference.** If MO-R3 is implemented, it should be propose-first, progressive-enhancement-first, and explicitly not loaded for routine motion [SOURCE: .opencode/specs/design/008-sk-design-parent/external/overdrive.md:19-27] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/overdrive.md:93-116].

## Explicit Do-Not List

- Do not reimplement `animation_decision_framework.md`, `motion_pattern_cards.md`, `animate_presence_checklist.md`, or `motion_performance_failure_card.md`; they are already delivered [SOURCE: .opencode/specs/design/008-sk-design-parent/012-foundations-motion-audit/implementation-summary.md:64-69].
- Do not bulk-import the external corpus; prior synthesis says leverage is operational references and cards, not volume [SOURCE: .opencode/specs/design/008-sk-design-parent/009-reference-asset-expansion/research/research.md:158-176].
- Do not make motion-performance release scoring a motion-mode responsibility; the failure card says scoring and findings belong to audit [SOURCE: .opencode/skills/sk-design/design-motion/assets/motion_performance_failure_card.md:14-18].
- Do not split out a separate `design-interaction` child; the parent hub is the single design identity with five modes [SOURCE: .opencode/skills/sk-design/SKILL.md:21-29].
- Do not broaden motion routing to steal generic interface/design prompts; the hub routes generic design to interface unless motion dominates [SOURCE: .opencode/skills/sk-design/SKILL.md:56-58].
- Do not turn advanced rendering, GSAP, scroll effects, particles, or View Transitions into default motion behavior. Use propose-first and context checks [SOURCE: .opencode/specs/design/008-sk-design-parent/external/overdrive.md:19-27].
- Do not run memory save or spec anchoring in this lineage; the user restricted writes to the lineage artifact directory.

## Convergence Check

All key questions are answered. Recommendations are bounded, source-diverse, and do not require implementation changes during this research run.

## Assessment

newInfoRatio: 0.04. Synthesis added ranking and negative knowledge but no large new evidence, so the loop converged.
