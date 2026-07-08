# Iteration 7: Evaluate Fallback-Router Wiring

## Focus

Determine whether `fallback-router.ts` is currently usable by the fanout pool and whether GLM-to-MiMo fallback should be part of the mandatory merge.

## Findings

- `fallback-router.ts` already resolves a configured fallback target and returns an actionable route decision [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:357].
- The router fails closed when no separate-pool fallback is configured, which is the right safety behavior for model substitution [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:376].
- The router rejects same-pool fallback targets, so it is designed for deliberate cross-pool recovery rather than arbitrary retry [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:400].
- `fanout-pool.cjs` currently schedules retries and does not call the fallback resolver in the retry path [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:628].
- After max retries, the pool records `retry_exhausted`; child 004's non-test-caller success criterion is therefore the right observable integration target [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:650] [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md:104].

## Sources Consulted

- `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md`

## Assessment

- `newInfoRatio`: 0.52.
- Novelty justification: confirmed that fallback-router has safety guards but no fanout caller today.
- Confidence: high for current code behavior, medium for prioritization because it depends on operator scope.

## Reflection

Fallback wiring is real hardening, but it changes model-routing behavior. That makes it optional feature scope, not a hidden requirement of the folder merge.

## Recommended Next Focus

Check GLM and MiMo model registry facts to determine whether a specific GLM-to-MiMo fallback is already authorized.
