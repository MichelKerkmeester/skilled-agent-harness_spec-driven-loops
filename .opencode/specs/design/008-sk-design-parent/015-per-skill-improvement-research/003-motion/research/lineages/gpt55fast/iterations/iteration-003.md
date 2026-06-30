# Iteration 003: Manual playbook and UX coverage

## Focus

Evaluate whether the manual testing playbook validates the right motion behavior and routes the right resources.

## Findings

1. The playbook covers eight useful scenarios across strategy, cards, presence, reduced motion, micro-interactions, and the restraint gate [SOURCE: .opencode/skills/sk-design/design-motion/manual_testing_playbook/manual_testing_playbook.md:13-22]. This is a good breadth baseline and should be preserved.
2. The playbook asks for exact prompt, resources loaded, motion purpose, timing, easing, reduced-motion path, implementation handoff, and final verdict [SOURCE: .opencode/skills/sk-design/design-motion/manual_testing_playbook/manual_testing_playbook.md:30-35]. That is the right evidence shape for a human validation surface.
3. Several scenario frontmatters drift from the skill's ALWAYS-load contract. The SKILL says motion tasks always load the shared register and animation decision framework, then corpus map plus the matching temporal concern [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:93-104]. But `MOTION-STRATEGY-001` expects only `corpus_map.md` and `motion_strategy.md` [SOURCE: .opencode/skills/sk-design/design-motion/manual_testing_playbook/01--strategy/001-purposeful-motion-plan.md:11-15].
4. The same drift appears in the reduced-motion scenario: frontmatter expects `corpus_map.md`, `performance_reduced_motion.md`, and the failure card [SOURCE: .opencode/skills/sk-design/design-motion/manual_testing_playbook/03--reduced-motion/001-performance-and-reduced-motion.md:11-16], while the expected process also says to load `motion_strategy.md` [SOURCE: .opencode/skills/sk-design/design-motion/manual_testing_playbook/03--reduced-motion/001-performance-and-reduced-motion.md:30-34]. This can make benchmark or manual verdicts fail for the wrong reason.
5. The restraint-gate scenario is the strongest adversarial case: it asks to animate a dashboard, command palette, and every hover, then expects refusal for keyboard and high-frequency motion [SOURCE: .opencode/skills/sk-design/design-motion/manual_testing_playbook/05--decision/001-restraint-gate.md:17-21] [SOURCE: .opencode/skills/sk-design/design-motion/manual_testing_playbook/05--decision/001-restraint-gate.md:36-41]. What is missing is a hub-level mode-routing assertion that `sk-design` chooses `motion` before the child playbook checks resource loads.

## Recommended Playbook Top-Ups

- Normalize `expected_resources` to include `../shared/register.md` and `references/animation_decision_framework.md` where the SKILL says they are mandatory.
- Add one hub-level scenario: prompt `motion: animate the menu and route transition, but keep keyboard actions instant`; expected hub mode `motion`, packet `design-motion`, and no separate advisor identity.
- Add a benchmark/evidence note for the local routing score once the motion benchmark artifact is available. Do not infer it from the `design-interface` report.

## Dead Ends

| Approach | Reason Eliminated | Evidence |
|---|---|---|
| Add a large scenario matrix | Current eight scenarios are already broad | `.opencode/skills/sk-design/design-motion/manual_testing_playbook/manual_testing_playbook.md:13-22` |
| Replace manual playbook with automated implementation tests | The skill is a guidance packet; implementation belongs to `sk-code` | `.opencode/skills/sk-design/design-motion/SKILL.md:37-39` |

## Assessment

newInfoRatio: 0.55. The playbook's best improvement is fixture consistency and one hub-level routing test, not more volume.
