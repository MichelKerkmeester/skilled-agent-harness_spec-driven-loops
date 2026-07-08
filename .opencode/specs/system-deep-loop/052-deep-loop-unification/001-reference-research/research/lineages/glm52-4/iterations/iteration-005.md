# Iteration 005 - Fallback-Router Wiring Feasibility And Consolidation

## Focus

Assess whether `fallback-router.ts` should be wired for real GLM-5.2 → MiMo-v2.5-Pro fallback, validate the 004 plan against the router/pool/model-registry reality, then consolidate.

## Findings

1. `fallback-router.ts` is genuinely ready to reuse. It is fully tested (`fallback-router.vitest.ts`, `executor-provenance-mismatch.vitest.ts`), and `validateFallbackGraph` + `resolveFallback` enforce the right invariants: missing-target rejection, cross-scope-route rejection, cycle detection, max-hop limits, same-pool rejection, and unapproved-substitution rejection (lines 218, 230, 246, 272, 404, 415). It has zero production callers today — `fanout-pool.cjs` does not import it. The 004 "reuse the module as-is, add one call site" pattern is correct. [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:290-415] [SOURCE: 004/plan.md §3 Pattern]

2. NEW P1 — the 004 plan misses the model-id adapter. `fanout-run.cjs` dispatches the full provider slug (`--model zai-coding-plan/glm-5.2`, line 1349-1350), but the proposed `ModelRegistry` entry keys on bare id `glm-5.2` / `mimo-v2.5-pro`. `resolveFallback(sourceId)` takes a registry id, so a failed executor's slug must be normalized to its registry id before lookup. The 004 Phase-2 step "add resolveFallback() call" must be preceded by an explicit slug→id normalizer, or the router will reject every real-world failed model as unknown. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1349-1350] [SOURCE: 004/plan.md registry entry id fields] [SOURCE: model_profiles.json:190-299 — id vs model_slug]

3. NEW P1 — the 004 plan's single call site may miss the failure classes that most motivate a model swap. `classifyLineageFailure` marks only TIMEOUT/SALVAGE_MISS/ARTIFACT_MISS retryable; a plain CLI `EXIT` is FATAL and terminal (cli-guards.cjs:188-196). Quota-exhaustion / auth failures that surface as non-timeout exits never reach a retry-exhausted branch, so a `resolveFallback` wired only at retry-exhaustion would not catch them. The 004 plan should either widen the failure classes eligible for fallback (independent of retryability) or explicitly capture quota/auth classes at the fatal-exit point. The same-pool guard is satisfied for the glm (zai-coding-plan) → mimo (xiaomi-token-plan) pair, so the swap itself is policy-clean. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs:188-196] [SOURCE: 004/plan.md Phase 2]

4. Consolidation — verdict on the merge design. Across Q1-Q5 the direction is SOUND; the structural layout, directional path rules, graph-metadata fresh-author, and public-surface stability are all correct. Four corrections are needed before child 002 starts: (a) fan-out-guard the `spec.md` mutation steps (F-P0-001), (b) add `artifact-root.cjs` + its two tests to Stage 3b (F-P0-002), (c) widen Class B to the full 11-file inventory + the absolute-path `replay-graph` form (F-P1-002/003), and (d) preserve 003's projection-regen + divergence-ratchet discipline (F-P1-004/005/006). Fallback wiring (004) is desirable operator insurance — notably for GLM fan-outs like this very research phase — but is correctly optional and independent of the structural merge. As a GLM-5.2 lineage my own pool held without needing the swap, which is mild empirical evidence that fallback is insurance rather than a daily necessity.

## Ruled Out

- Wiring fallback without a slug→id normalizer — the router would reject real failed models as unknown.
- Treating the retry-exhausted branch as the only fallback trigger — it misses quota/auth failures that exit fatally without retrying.
- Treating fallback as a blocker for the structural merge — it is independent and correctly P2/optional.

## Next Focus

Convergence reached: all 5 key questions answered with diverse cited evidence; maxIterations (5) reached; final iteration primarily consolidation. Proceed to synthesis.
