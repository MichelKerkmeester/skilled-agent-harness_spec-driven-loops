# Iteration 005: Routing efficiency and resource-loading contract

## Focus

Analyze motion router efficiency and determine how to improve routing without overfitting the reported 100/100 benchmark score.

## Findings

1. The SKILL resource table says the first step of any motion task always loads `../shared/register.md` and `references/animation_decision_framework.md` [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:93-99]. That is correct for usefulness because the register sets the motion budget and the decision framework runs before timing.
2. The pseudocode does not implement that ALWAYS contract. It sets `DEFAULT_RESOURCE = "references/corpus_map.md"` [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:114-117], then `load_if_available(DEFAULT_RESOURCE)` is the baseline load [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:201-209]. The shared register is outside the packet root and `_guard_in_skill` rejects paths that do not resolve under `SKILL_ROOT` [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:151-156].
3. This mismatch is the best efficiency improvement because it affects every motion task. A deterministic router replay could report resources from the pseudocode, while human instructions say to read the register and gate first. The fix is to make shared-register loading explicit in the executable/router helper or to document it as a pre-router parent load that the pseudocode does not sandbox.
4. Current intent scoring is broad enough for motion modes: decision, strategy, micro-interactions, presence, and performance all have weighted keyword sets [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:118-124]. Without a confirmed motion benchmark failure, broadening keywords is lower value than fixing mandatory-resource loading and fixture evidence.
5. The parent hub already says generic design prompts should default to interface unless the prompt is explicitly motion, and pair modes only when axes are clearly separate [SOURCE: .opencode/skills/sk-design/SKILL.md:56-58]. Motion should not steal generic "make it beautiful" prompts just because they mention polish.

## Recommended Router Work

- Treat `../shared/register.md` as a parent-shared pre-load with its own guarded path rule, separate from packet-local `references/` and `assets/` discovery.
- Keep `references/animation_decision_framework.md` in the first baseline resource list for all motion tasks, not only the `DECISION` intent.
- Add a router fixture proving that `motion:` hint and explicit animation prompts route to `design-motion`, while generic visual-design prompts stay in `interface`.
- Do not change trigger breadth until a real misroute is observed.

## Dead Ends

| Approach | Reason Eliminated | Evidence |
|---|---|---|
| Expand aliases aggressively | No local motion routing failure was found, and user claims Mode A is already 100/100 | `.opencode/skills/sk-design/mode-registry.json:40-49` |
| Let motion own generic polish prompts | Hub says generic design defaults to interface unless a motion axis dominates | `.opencode/skills/sk-design/SKILL.md:56-58` |

## Assessment

newInfoRatio: 0.18. The key new insight is contract drift between router prose and pseudocode, not a need for more mode keywords.
