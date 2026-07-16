# Iteration 004 - GLM To MiMo Fallback Wiring

## Focus

Assess whether `fallback-router.ts` should be connected to fan-out for real GLM-5.2 to MiMo-v2.5-Pro fallback.

## Findings

1. `fallback-router.ts` is mature enough to reuse: it validates fallback graphs, rejects same-pool targets, rejects unapproved substitutions, and returns a typed `fallback` or `fail-fast` decision. [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:337-431] [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts:36-167]

2. It is not wired into production fan-out today. A non-test search found only the router module exports; `fanout-pool.cjs` currently retries the same lineage label until `maxRetries` and then records terminal failure. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:618-654]

3. GLM-5.2 and MiMo-V2.5-Pro are separate-pool candidates, but current profiles do not enable the route. MiMo's `fallback_target` is null, GLM's `fallback_target` is null, and GLM's weakness explicitly says it has a single executor path with no fallback. [SOURCE: .opencode/skills/sk-prompt-models/assets/model_profiles.json:190-214] [SOURCE: .opencode/skills/sk-prompt-models/assets/model_profiles.json:255-299]

4. Wiring must solve model-id normalization. Fan-out passes provider slugs like `zai-coding-plan/glm-5.2` to `opencode run`, while the model profile id and fallback-router registry id are `glm-5.2`. A raw call using `lineage.model` will not match unless normalized. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1343-1375] [SOURCE: .opencode/skills/sk-prompt-models/assets/model_profiles.json:272-278]

5. Wiring only the retry-exhausted branch is probably insufficient. The classifier retries timeouts and artifact misses, but non-timeout CLI exits are fatal. Since `runLineageProcess` drains stderr without capturing it, quota/auth failures may never become structured `quota-exceeded` or `auth-failure` failure kinds for the router. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs:169-199] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1206-1286] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1720-1738]

## Recommendation

Wire GLM to MiMo fallback, but treat it as child 004 or a pre-fanout hardening step, not as an incidental part of the structural move. The minimum safe design is:

- Add or derive a `ModelRegistry` where `glm-5.2` has `fallback_target: "mimo-v2.5-pro"` and both pools differ.
- Add canonical model id and provider slug mapping in fanout-run or a shared model-profile adapter.
- Require explicit operator approval of fallback targets, either in fanout config or a separate approved fallback list.
- Capture enough failure detail to route quota/auth/timeout separately; do not rely only on same-model retry exhaustion.
- Label substituted runs distinctly so attribution shows `glm52-N` was replaced by MiMo.

## Ruled Out

- Do not silently change a GLM lineage's model to MiMo without an approved target list.
- Do not use same-pool fallback; the router correctly rejects that pattern.

## Next Focus

Consolidate findings and define execution-order changes for child 002/003/004.
