# Iteration 4: Fallback-Router Wiring, GLM-To-MiMo Risk, And Stop Decision

## Focus

Validate whether automatic GLM-5.2 to MiMo-v2.5-Pro fallback is currently wired and decide whether the research can stop.

## Findings

1. The fallback router module itself is implemented and has safeguards for missing targets, cycles, scope widening, hop count, approval, and same-pool rejection. [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:299] [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:320] [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:357] [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:400]
2. Fanout retry exhaustion currently settles the failure and does not call `resolveFallback()`. [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:628] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:650] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:653] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/plan.md:43]
3. GLM and MiMo are active separate-pool models, but both have `fallback_target: null` in the live profile registry. [SOURCE: file:.opencode/skills/sk-prompt-models/assets/model_profiles.json:190] [SOURCE: file:.opencode/skills/sk-prompt-models/assets/model_profiles.json:203] [SOURCE: file:.opencode/skills/sk-prompt-models/assets/model_profiles.json:204] [SOURCE: file:.opencode/skills/sk-prompt-models/assets/model_profiles.json:255] [SOURCE: file:.opencode/skills/sk-prompt-models/assets/model_profiles.json:268] [SOURCE: file:.opencode/skills/sk-prompt-models/assets/model_profiles.json:269]
4. Fallback wiring remains optional and operator-gated; it should be reported as a warning, not as a blocker for child 002/003 under current scope. [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/plan.md:51] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/plan.md:85] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/plan.md:90] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/spec.md:124]

## Sources Consulted

- `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs`
- `.opencode/skills/sk-prompt-models/assets/model_profiles.json`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/plan.md`

## Assessment

- `newInfoRatio`: 0.18
- Novelty justification: mostly confirmed existing design and added the concrete current-state fallback gap.
- Confidence: high for static current-state claims. No live fallback run was performed.

## Reflection

What worked: checking both registry data and pool code avoided overstating fallback behavior. What failed: no runtime fallback exercise exists because the call site is not wired. Ruled out: treating fallback wiring as already active or as a merge blocker.

## Recommended Next Focus

Stop. All key questions are answered with cited evidence and the legal stop gates pass.
