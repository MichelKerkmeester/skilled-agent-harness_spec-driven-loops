# Iteration 5: Fallback-Router Wiring Decision

## Focus
This iteration decided whether `fallback-router.ts` should be wired into real GLM-5.2 to MiMo-V2.5-Pro model fallback as part of the core `system-deep-loop` merge, or remain optional/deferred. The focus was the live runtime execution path, model-profile contracts, and child 004's optional plan.

## Actions Taken
- Read the full `fallback-router.ts` implementation and its unit tests.
- Read `fanout-pool.cjs` retry exhaustion and `fanout-run.cjs` lineage command construction.
- Read `executor-config.ts` fan-out schema to check whether a fallback registry is currently modeled.
- Read GLM-5.2 and MiMo-V2.5-Pro prompt/model profiles for quota-pool and fallback-target contracts.
- Read parent, 001, and 004 specs/plans for current scope and operator-gating decisions.

## Findings
1. `fallback-router.ts` is a real, mature pure-routing primitive, not a stub. It models `ModelRegistry`, validates fallback graph edges, and exposes `createFallbackRouter()` plus `resolveFallback()` [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:57-74] [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:299-324] [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:357-431]. It rejects unknown models, missing targets, same-pool fallbacks, unapproved substitutions, cross-scope routes, cycles, and max-hop violations [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:215-230] [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:235-309] [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:388-419].
2. Existing tests cover the pure router contract but not GLM/MiMo integration. The suite validates default fail-fast, separate-pool routing, same-pool rejection, missing/unknown model handling, typed timeout fallback with metadata, and cycle preflight rejection [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts:36-49] [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts:51-93] [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts:109-141] [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts:143-166]. No test instantiates `zai-coding-plan/glm-5.2`, `glm-5.2`, `xiaomi-token-plan-ams/mimo-v2.5-pro`, or `mimo-v2.5-pro`.
3. The active fan-out path does not call the router. `fanout-pool.cjs` retries the same queued item while `error.retryable` is true and `retryCount < maxRetries`, then records retry exhaustion and stores the rejected result [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:618-653]. `fanout-run.cjs` treats a failed/killed/timed-out lineage as a thrown failure and relies on the pool to retry the same lineage [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1720-1738]. This means current GLM failure handling is retry/salvage, not model substitution.
4. Model identity mapping is a real integration gap. The actual 001 payload dispatches GLM as `zai-coding-plan/glm-5.2` [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/plan.md:77-92], while the child 004 registry example uses canonical ids `glm-5.2` and `mimo-v2.5-pro` [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/plan.md:68-77]. `fanout-run.cjs` passes `lineage.model` directly to `opencode run --model` [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1343-1375], so a real fallback implementation needs an explicit canonical-id-to-executor-slug mapping, not just a router call.
5. The fan-out config schema currently has no fallback registry surface. It defines lineage executor entries, `assignment_model`, `concurrency`, `maxRetries`, `lagCeilingMs`, and heartbeat settings [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:241-282]. Adding model fallback is therefore new config and attribution behavior, not a hidden existing switch.
6. The model-profile contracts currently say no automatic fallback. GLM-5.2's profile lists `Fallback target | none`, `fallback_target | null`, and instructs operators to defer rather than retry against the same pool when `zai-coding-plan` is exhausted [SOURCE: .opencode/skills/sk-prompt-models/references/models/glm-5.2.md:45-53] [SOURCE: .opencode/skills/sk-prompt-models/references/models/glm-5.2.md:139-147] [SOURCE: .opencode/skills/sk-prompt-models/references/models/glm-5.2.md:153-158]. MiMo's profile similarly says `fallback_target | null` and describes the direct Xiaomi provider as a manual reroute path, not automatic gateway fallback [SOURCE: .opencode/skills/sk-prompt-models/references/models/mimo-v2.5-pro.md:41-49] [SOURCE: .opencode/skills/sk-prompt-models/references/models/mimo-v2.5-pro.md:154-169]. A GLM->MiMo automatic route would need to amend those contracts or be scoped specifically to fan-out resilience.
7. The parent and child specs already classify this as optional/operator-gated behavior work. The phase parent says changing fan-out mechanics is out of scope for the structural identity merge and tracks fallback-router wiring as optional child 004 [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/spec.md:80-88] [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/spec.md:141-145]. The 001 research plan accepts retry/salvage/manual re-dispatch for GLM failures [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/spec.md:99-125] [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/plan.md:101-107]. Child 004 is Level 1, P2, planned, optional, and requires operator scope confirmation before implementation [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md:35-62] [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/plan.md:48-58].
8. If child 004 proceeds, the current plan needs one design correction: model substitution policy should live in `fanout-run.cjs` or an explicit pool callback, not as a hardcoded GLM/MiMo decision inside generic `fanout-pool.cjs`. The pool only knows generic item retry state [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:618-653], while `fanout-run.cjs` knows the executor kind, model slug, lineage label, artifact directory, and command construction [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1534-1613] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1343-1375]. Keeping model policy at the orchestration layer avoids turning the generic pool into model-aware infrastructure.

## Questions Answered
- Answered: Do not make fallback-router wiring a blocker for the core `system-deep-loop` merge or for this read-only research phase. Keep it optional/operator-gated. If implemented, amend child 004 to add an explicit fallback registry/mapping surface, attach substitution policy in `fanout-run.cjs` or through a generic retry-exhausted hook, emit attribution events/labels, and test forced-failure GLM-to-MiMo re-dispatch.

## Questions Remaining
- None for this lineage's key-question set.

## Ruled Out
- Treating fallback-router wiring as required for the structural rename/path/reference merge.
- Hardcoding GLM-5.2 to MiMo-V2.5-Pro substitution inside the generic `fanout-pool.cjs` primitive.
- Assuming canonical model ids (`glm-5.2`, `mimo-v2.5-pro`) can be passed directly to `opencode run`; the live executor needs provider-prefixed slugs.

## Dead Ends
- Calling `resolveFallback()` at retry exhaustion without adding a model registry and executor-slug mapping is insufficient: the router would either see unknown models or produce a target that cannot dispatch correctly.
- Treating the existing fallback-router tests as integration coverage is insufficient because they do not run a replacement lineage.

## Edge Cases
- Ambiguous input: "wire now" could mean before the 001 fanout re-runs or before the core merge. Evidence supports deferral for both unless the operator explicitly prioritizes GLM resilience over merge blast-radius control.
- Contradictory evidence: Child 004 proposes editing `fanout-pool.cjs`, while runtime layering suggests `fanout-run.cjs` owns model-aware policy. This is not a blocker, but child 004 should be amended before implementation.
- Missing dependencies: No live forced-failure test was run; this is design research, not implementation.
- Partial success: The router primitive is ready, but operational wiring requires config, provenance, and integration-test work.

## Sources Consulted
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:57-74`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:299-324`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:357-431`
- `.opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts:36-166`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:618-653`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1343-1375`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1534-1613`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1720-1738`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:241-282`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/plan.md:77-107`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md:35-62`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/plan.md:48-94`
- `.opencode/skills/sk-prompt-models/references/models/glm-5.2.md:45-53`
- `.opencode/skills/sk-prompt-models/references/models/glm-5.2.md:139-158`
- `.opencode/skills/sk-prompt-models/references/models/mimo-v2.5-pro.md:41-49`
- `.opencode/skills/sk-prompt-models/references/models/mimo-v2.5-pro.md:154-169`

## Assessment
- New information ratio: 0.46
- Novelty justification: This pass added the canonical-vs-provider model-id gap and the model-profile conflict with automatic fallback, while confirming the existing optional child 004 scope.
- Questions addressed: fallback-router wiring; fan-out retry mechanics; model registry; operational scope.
- Questions answered: fallback-router should remain optional/deferred for the core merge.
- Confidence: High that fallback wiring is optional and non-blocking; medium-high on the recommended integration seam because implementation should still prototype the hook before final design.

## Reflection
- What worked and why: Reading both runtime execution paths and model profiles exposed that the main blocker is not router correctness but operational policy/config/provenance.
- What did not work and why: Grepping for GLM/MiMo produced many historical and sibling-lineage hits; the useful evidence was in model profiles and current specs.
- What I would do differently: If implementing child 004, start with a failing integration test that proves a provider-prefixed GLM lineage re-dispatches as a provider-prefixed MiMo lineage with clear attribution.

## Recommended Next Focus
Enter synthesis. All five key questions now have evidence-cited answers; further iterations would likely repeat confirmation rather than change the recommendation set.
