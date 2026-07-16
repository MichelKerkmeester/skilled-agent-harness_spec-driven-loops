# Iteration 4: Fallback Router Wiring Decision

## Focus

Validate whether `fallback-router.ts` should be wired for real GLM-5.2 to MiMo-v2.5-Pro fallback as part of this merge, and identify the safest integration seam if it is approved.

## Findings

1. `fallback-router.ts` is a complete pure-function router: it validates graph edges, rejects unknown/same-pool/unapproved targets, supports typed `failureKind`, and returns either `fallback` with a target or `fail-fast` with a reason. [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:299] [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:357] [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:411] [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:422]

2. The tests already cover typed timeout routing and cycle rejection. This confirms the module itself does not need redesign before becoming a caller dependency. [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts:109] [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts:143]

3. `fanout-pool.cjs` currently only requeues the same item while `result.error.retryable === true && retryCount < maxRetries`; after exhaustion it records the rejected result and marks `retry_exhausted`. There is no model substitution path. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:628] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:650]

4. The safest implementation seam is not a hardcoded registry inside `fanout-pool.cjs`. `runCappedPool()` is generic and only accepts items, worker, retry count, and ledger callbacks. Model policy lives in `fanout-run.cjs`, which parses fanout config, expands lineages, builds commands, and classifies lineage failures. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:418] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1426] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1534] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1725]

## Sources Consulted

- `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/plan.md`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts`
- `.opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`

## Assessment

- newInfoRatio: 0.34
- Novelty justification: Confirmed the zero-caller gap and identified a safer integration seam than putting model policy inside the generic pool primitive.
- Confidence: High for zero-substitution behavior; medium for exact implementation shape because the optional phase still needs design review before code.

## Reflection

- What worked: Reading pool and runner together separated generic retry mechanics from model-aware fanout policy.
- What failed: The optional phase wording says "wire into fanout-pool.cjs" too directly; it should probably say "wire through fanout-run into the pool's retry-exhausted seam".
- Ruled out: Making fallback-router wiring a blocker for the structural merge.

## Recommended Next Focus

Run a final convergence pass over verification sequencing and residual merge risks.
