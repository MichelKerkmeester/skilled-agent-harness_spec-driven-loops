# Iteration 3: Fallback-Router Wiring Scope

## Focus
Determine whether the existing `fallback-router.ts` should be wired now for GLM-5.2 to MiMo-v2.5-Pro fallback, or deferred as optional behavior outside the structural unification packet.

## Findings

1. The fallback router is a shipped pure decision primitive, but it is not wired into runtime dispatch. The module exports `validateFallbackGraph`, `createFallbackRouter`, and `resolveFallback` [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:299] [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:320] [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:357]. A current code search found production references only in the module itself; callers are test-only (`fallback-router.vitest.ts` and `executor-provenance-mismatch.vitest.ts`) [SOURCE: grep resolveFallback/createFallbackRouter 2026-07-08T05:08Z] [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/executor-provenance-mismatch.vitest.ts:237]. Child 004 correctly identifies the zero-production-caller gap.

2. Current fanout behavior is same-lineage retry, not model fallback. `runCappedPool()` normalizes `maxRetries` and per-label retry counts [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:433] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:434], then requeues the same item/index/label while `result.error.retryable === true && retryCount < maxRetries` [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:628] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:633]. On exhaustion it sets `retry_exhausted` and records terminal failure [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:650] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:651]. Tests assert exactly that a timeout runs three attempts for `maxRetries: 2` and ends rejected with `retry_exhausted: true` [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/fanout-pool.vitest.ts:557] [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/fanout-pool.vitest.ts:573].

3. Child 004's core implementation target is too narrow. The plan says to add one call in `fanout-pool.cjs`'s retry-exhausted branch [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/plan.md:43] [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/plan.md:90]. But `fanout-run.cjs` owns the model-bearing lineage object, lineage directory, session id, prompt, command construction, sandbox, dispatch env, and artifact validation [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1534] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1548] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1580] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1599]. A safe implementation needs `fanout-run.cjs` to participate, or `fanout-pool.cjs` needs a new typed callback contract that can create a replacement lineage while preserving pool accounting. This is more than a small local edit.

4. The GLM-to-MiMo edge is not currently configured in the model registry data. `sk-prompt-models/assets/model_profiles.json` lists MiMo under `xiaomi-token-plan` with `fallback_target: null` [SOURCE: .opencode/skills/sk-prompt-models/assets/model_profiles.json:190] [SOURCE: .opencode/skills/sk-prompt-models/assets/model_profiles.json:203] [SOURCE: .opencode/skills/sk-prompt-models/assets/model_profiles.json:204]. It lists GLM-5.2 under `zai-coding-plan`, also with `fallback_target: null` [SOURCE: .opencode/skills/sk-prompt-models/assets/model_profiles.json:255] [SOURCE: .opencode/skills/sk-prompt-models/assets/model_profiles.json:268] [SOURCE: .opencode/skills/sk-prompt-models/assets/model_profiles.json:269]. The proposed child 004 registry entry is therefore new policy/configuration, not merely consuming existing data.

5. Model-id normalization is a hidden requirement. The router uses profile ids such as `glm-5.2` and `mimo-v2.5-pro`, while fanout executor commands commonly carry provider slugs such as `zai-coding-plan/glm-5.2` and `xiaomi-token-plan-ams/mimo-v2.5-pro` from the model profile capability fields [SOURCE: .opencode/skills/sk-prompt-models/assets/model_profiles.json:207] [SOURCE: .opencode/skills/sk-prompt-models/assets/model_profiles.json:272]. `buildLineageCommand()` passes `lineage.model` directly to `opencode run --model` [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1343] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1349]. A fallback integration needs an explicit mapping between canonical fallback ids and executable provider slugs, or it risks failing `resolveFallback()` lookup or dispatching the wrong CLI model string.

6. The approval guard makes fallback opt-in by design. `resolveFallback()` can reject a configured target outside the caller-approved model set [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:411] [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:415], and tests cover both approved and unapproved substitution [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/executor-provenance-mismatch.vitest.ts:244] [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/executor-provenance-mismatch.vitest.ts:252]. If the fallback target is not already one of the fanout executors, a new config field or policy source must explicitly approve it. Auto-reading a global fallback edge would change behavior for callers that requested only GLM.

7. The fallback lineage must be separately attributable. Child 004's requirement says a fallback replica must not be silently indistinguishable from the failed GLM replica [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md:94] [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md:96]. Current retry accounting is keyed by label [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:631] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:783], and lineage directories are also keyed by label [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1553]. Reusing the failed label for MiMo would mix artifacts and retry counts; a safe implementation needs a replacement label and status event such as `fallback_scheduled`, plus parent/target metadata in summary output.

## Recommendation
Defer child 004 from the structural system-deep-loop merge unless the operator explicitly expands scope to behavior changes. It is valuable hardening, but it is not required to prove the rename/nesting/reference-migration design. If implemented later, revise child 004 first so the scope includes: fallback registry/schema or model-profile projection, canonical-id to CLI-slug normalization, explicit caller approval, a `fanout-run.cjs`/pool callback integration point, a separate fallback label/artifact directory, and a forced-failure integration test.

## Sources Consulted
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts`
- `.opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts`
- `.opencode/skills/deep-loop-runtime/tests/unit/executor-provenance-mismatch.vitest.ts`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts`
- `.opencode/skills/sk-prompt-models/assets/model_profiles.json`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/{spec.md,plan.md,tasks.md}`

## Assessment
- newInfoRatio: 0.44
- Novelty justification: The zero-caller gap was known, but the iteration added concrete implementation blockers: wrong narrow call-site assumption, missing current edge in registry data, canonical-id vs provider-slug mapping, approval-guard policy, and fallback-label attribution requirements.
- Confidence: High that defer is the safest recommendation for the structural merge; medium on exact implementation shape because no code change was performed.

## Reflection
- What worked: Reading both pure-router tests and fanout runtime call sites separated a simple library gap from the actual orchestration integration problem.
- What failed: Treating fallback wiring as a one-line retry-exhaustion hook underestimates label, artifact, approval, and model-id coupling.
- Ruled out: Wiring child 004 as mandatory merge work without a scope-expansion decision.

## Recommended Next Focus
Run one final synthesis-readiness/convergence pass across the three answered areas and produce the final research synthesis if no new contradictions appear.
