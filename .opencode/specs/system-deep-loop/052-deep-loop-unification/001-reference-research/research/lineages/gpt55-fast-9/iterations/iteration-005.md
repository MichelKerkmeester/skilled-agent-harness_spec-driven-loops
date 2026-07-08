# Iteration 5: Fallback-Router Wiring Decision

## Focus

This iteration tested whether the existing `fallback-router.ts` should be wired now for real GLM-5.2 to MiMo-v2.5-Pro fan-out fallback, or remain optional/manual during the merge research phase.

## Findings

1. `fallback-router.ts` is a real, reusable router, not a placeholder. Its `ModelProfile` schema includes `quota_pool`, `fallback_target`, typed success/failure targets, and optional route scope [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:46-55]. It validates missing targets, scope widening, cycles, and hop count before dispatch [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:299-324], then returns either `fallback` with a target or `fail-fast` with an explicit reason [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:357-431].
2. Existing tests cover the core safety rules. The unit suite routes cross-pool fallbacks, rejects same-pool fallback, rejects missing targets, attaches typed timeout metadata, and rejects cyclic graphs [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts:51-167]. A second provenance test enforces caller-approved substitution so unapproved model swaps fail fast [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/executor-provenance-mismatch.vitest.ts:237-265].
3. The fan-out pool currently retries the same item rather than swapping models. `fanout-pool.cjs` schedules another attempt when `result.error.retryable === true && retryCount < maxRetries`, then marks `retry_exhausted` and stores the rejected result when retries are exhausted [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:628-653]. There is no call-site for `resolveFallback()` in that retry-exhausted branch.
4. GLM-5.2 and MiMo are valid separate-pool candidates, but the current model registry does not already encode GLM -> MiMo fallback. GLM-5.2 is active under provider/quota pool `zai-coding-plan` and currently has `fallback_target: null` [SOURCE: .opencode/skills/sk-prompt-models/assets/model_profiles.json:255-269]. MiMo V2.5 Pro is active under `xiaomi-token-plan`, has `fallback_target: null`, and records manual direct-provider reroute availability rather than automatic gateway fallback [SOURCE: .opencode/skills/sk-prompt-models/assets/model_profiles.json:190-214]. The optional child 004 plan supplies the missing edge as `glm-5.2 -> mimo-v2.5-pro` across `zai-coding-plan` and `xiaomi-token-plan` pools [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/plan.md:68-77].
5. Wiring is useful but not required for the core `system-deep-loop` merge. The current research packet explicitly accepts GLM failure degradation through salvage/manual redispatch because automatic fallback is not wired [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/spec.md:101-124]. Child 004 scopes the feature as optional/P2, requires attribution for substituted replicas, and keeps `fallback-router.ts` itself unchanged [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md:69-96].
6. If implemented, fallback should be registry-driven and attributable, not hardcoded. Child 004's architecture says to reuse `fallback-router.ts` unchanged, add a `ModelRegistry`, and call `resolveFallback()` at the existing retry-exhaustion point [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/plan.md:55-94]. The acceptance test should prove a forced-failure `glm52` replica creates a MiMo replacement, not a fourth same-model retry [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md:92-105].

## Ruled Out

- Editing `fallback-router.ts` itself during the merge: ruled out because its pure-function behavior is already tested and child 004 says it should remain unchanged [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md:73-75].
- Treating GLM -> MiMo fallback as a blocker for the hub rename/runtime nesting: ruled out because the existing packet accepts salvage/manual reroute for this research phase and child 004 is explicitly optional.
- Silent automatic substitution without caller approval or attribution: ruled out by the approval-guard tests and child 004's substituted-label requirement.

## Dead Ends

- Searching for production `resolveFallback()` callers found no non-test call path; the actionable call site remains the retry-exhausted branch in `fanout-pool.cjs`.

## Edge Cases

- Ambiguous model IDs: CLI dispatch uses provider-qualified slugs such as `zai-coding-plan/glm-5.2`, while `fallback-router.ts` model profiles use short ids such as `glm-5.2`. Wiring needs a normalization layer or registry entries that match the pool's lineage model identifiers.
- Partial failure: A partially salvaged GLM lineage should not be silently replaced if it produced usable iterations; fallback should trigger only after the configured retry/salvage policy says the lineage is terminal.
- Attribution: A MiMo substitute must be labeled as substituting for `glm52-N`; otherwise fan-out synthesis could overstate original GLM coverage.

## Sources Consulted

- `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:46-55`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:299-431`
- `.opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts:51-167`
- `.opencode/skills/deep-loop-runtime/tests/unit/executor-provenance-mismatch.vitest.ts:237-265`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:628-653`
- `.opencode/skills/sk-prompt-models/assets/model_profiles.json:190-214`
- `.opencode/skills/sk-prompt-models/assets/model_profiles.json:255-299`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/spec.md:101-124`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md:69-105`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/plan.md:55-94`

## Assessment

- New information ratio: 0.40
- Novelty justification: The zero-caller gap and optional child were known, but this pass confirms the exact call site, registry requirements, model-pool validity, and non-blocking merge recommendation.
- Questions addressed: whether fallback-router wiring should be required now for GLM-5.2 to MiMo-v2.5-Pro fallback.
- Questions answered: Should `fallback-router.ts` be wired now for GLM-5.2 to MiMo-v2.5-Pro fallback, or remain deferred/manual for this research phase?
- Confidence: High that fallback wiring is useful optional hardening but not a merge blocker; medium on exact wiring file split until child 004 implementation chooses registry storage and model-id normalization.

## Reflection

- What worked and why: Reading the router, tests, pool retry branch, model profiles, and child 004 packet closed the design question without implementing anything.
- What did not work and why: A pure symbol search for `resolveFallback` only proves absence of current call sites; it does not design the attribution semantics by itself.
- What I would do differently: If child 004 proceeds, start with the forced-failure test before touching production code.

## Recommended Next Focus

Stop for synthesis. All five key questions now have evidence-backed answers, the minimum iteration floor is satisfied, and additional passes would likely classify residual references rather than change the merge recommendation.
