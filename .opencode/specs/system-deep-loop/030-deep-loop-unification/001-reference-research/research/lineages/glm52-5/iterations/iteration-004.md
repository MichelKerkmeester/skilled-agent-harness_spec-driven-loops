# Iteration 004 - Fallback-Router GLM-5.2 To MiMo-v2.5-Pro Wiring Feasibility

## Focus

Confirm fallback-router.ts's zero-caller state, the failure-classification gap that blocks a reliable GLM→MiMo path, and the model-id normalization the registry-vs-provider-slug mismatch requires.

## Findings

1. **Confirmed zero production callers.** A grep for `resolveFallback|createFallbackRouter|fallback-router` across all `.cjs`/`.ts` in `.opencode/skills` returns exactly one file: `fallback-router.ts` itself (its own definition). `fanout-pool.cjs` — the only consumer of retry logic — imports `classifyLineageFailure` from `./lib/cli-guards.cjs` (line 24) and implements same-model retry via `maxRetries` (lines 433, 619-651), never invoking `resolveFallback`. The module is shipped, tested, and dead in production. [SOURCE: grep across .opencode/skills/*.{cjs,ts}] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:24] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:628-651]

2. **The retry-exhaustion point exists but has no fallback branch.** `fanout-pool.cjs:651` sets `result.retry_exhausted = result.error.retryable === true && retryCount >= maxRetries` and then the replica is marked failed. There is no `resolveFallback()` call on the exhausted path, so the plan's "add one call site" is mechanically accurate — but it is the LARGER of two gaps. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:628-651] [SOURCE: 004-fallback-router-wiring/plan.md:42-43]

3. **NEW P1 — `classifyLineageFailure` would route quota/auth failures to FATAL, never reaching the retry-exhaustion fallback branch.** `cli-guards.cjs:169-200` classifies ONLY `timeout`, `salvage_miss`, and `artifact_miss` as `retryable:true`; everything else is `EXIT` → `FATAL` → `retryable:false`. A GLM quota exhaustion (HTTP 429) or auth failure exits with a non-zero code but `timedOut:false` and no salvage, so it lands in `EXIT`/`FATAL` and is NEVER retried, let alone fallback-routed. Child 004's plan says "on retry exhaustion, resolve a fallback target" — but quota/auth failures never reach retry exhaustion because they are not retryable in the first place. The wiring therefore requires a `classifyLineageFailure` extension that recognizes quota/auth/429 classes as fallback-ELIGIBLE (distinct from retryable), or the fallback path is unreachable for the exact failure mode (GLM quota out) it is meant to heal. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs:169-200] [SOURCE: 004-fallback-router-wiring/plan.md:42-43,90-94]

4. **Model-id normalization is required because the registry id and the fan-out provider slug differ.** `model_profiles.json` keys the registry by bare id (`"id":"glm-5.2"`, `"id":"mimo-v2.5-pro"`), while fan-out dispatches provider slugs like `zai-coding-plan/glm-5.2` (the executor config in this lineage). `resolveFallback(failedModelId, registry, ...)` takes a `failedModelId` that must match a registry id, so the slug must be canonicalized to the bare id before lookup. Without this adapter, the GLM slug does not match the registry and fallback resolves to `fail-fast`. [SOURCE: .opencode/skills/sk-prompt-models/assets/model_profiles.json:190,204] [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:337-431]

5. **The GLM→MiMo edge is the correct fallback pair (distinct quota pools) but both profiles currently declare `fallback_target: null`.** `model_profiles.json` confirms `glm-5.2` → `primary_quota_pool:"zai-coding-plan"`, `fallback_target:null` and `mimo-v2.5-pro` → `primary_quota_pool:"xiaomi-token-plan"`, `fallback_target:null`. Distinct pools is exactly the precondition `fallback-router.ts`'s graph validation requires (no same-pool fallback). Wiring therefore needs (a) a `ModelRegistry` with the `glm-5.2 → mimo-v2.5-pro` edge + `fallback_target` populated, AND (b) explicit `approvedModelIds` since `resolveFallback` rejects unapproved substitutions. Child 004's plan covers (a) but under-specifies (b) and the classification gap in finding 3. [SOURCE: .opencode/skills/sk-prompt-models/assets/model_profiles.json:190-214,198-204] [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:337-431] [SOURCE: 004-fallback-router-wiring/plan.md:69-77]

## Recommendation

Wire the fallback, but as a three-part change, not the single-call-site change child 004 currently describes:
1. Extend `classifyLineageFailure` with a fallback-eligible class for quota/auth (or route the exhausted-and-fatal path to fallback), else the GLM-quota failure mode never reaches fallback.
2. Add the `resolveFallback()` call at `fanout-pool.cjs:651`, with a model-id slug→bare-id normalizer so the failed slug matches the registry.
3. Author the `ModelRegistry` with `glm-5.2 → mimo-v2.5-pro`, populate `fallback_target`, and add `mimo-v2.5-pro` to `approvedModelIds` explicitly.

Keep it behind child 004's forced-failure integration test, but extend that test to cover the quota-exhaustion class, not only timeout/artifact-miss.

## Ruled Out

- Wiring fallback naively as a single `resolveFallback()` call site — unreachable for the quota/auth failure class it is meant to heal, because `classifyLineageFailure` marks those FATAL before retry exhaustion.
- Cross-pool fallback within the same provider — `fallback-router.ts` already rejects same-pool fallback by graph validation; the GLM/MiMo distinct-pool pairing is the only correct shape.

## Next Focus

Consolidation: residual risks, execution ordering across children 002/003/004, and the convergence floor.
