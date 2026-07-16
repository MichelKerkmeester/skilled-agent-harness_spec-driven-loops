# Iteration 4: Fallback-Router Wiring and Convergence

## Focus

Validate whether `fallback-router.ts` should be wired now for GLM-5.2 to MiMo-v2.5-Pro fallback, and decide whether research has legally converged.

## Findings

1. `fallback-router.ts` is real and robust at the pure-function layer. It validates target existence, scope, cycles, and hop count, and `resolveFallback()` returns either `action: 'fallback'` with a target or `action: 'fail-fast'` with a reason. [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:299] [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:357]
2. The live fan-out pool does not call it. Retry handling in `fanout-pool.cjs` only requeues the same index while retryable and below `maxRetries`; once exhausted, it records `retry_exhausted` and settles the same lineage as rejected. [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:628] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:650]
3. Wiring fallback is behavior work, not structural merge work. The parent spec declares workflow behavior changes out of scope and explicitly tracks fallback-router wiring as optional/operator-gated. [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/spec.md:80] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md:90]
4. Recommendation: keep phase 004 optional, but run it before any GLM-heavy rerun if the operator requires automatic substitution instead of manual salvage/re-dispatch. The current phase-001 plan's manual fallback remains viable because merge enumerates lineage directories after the fact. [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/plan.md:107]
5. Convergence is legal after 4 iterations. The 3-iteration floor is satisfied, all five key questions are answered, source diversity spans specs, YAML, runtime code, workflow code, advisor code, plugin code, and package/test config, and this final pass produced only one additive recommendation. [SOURCE: file:.opencode/skills/deep-loop-workflows/deep-research/references/convergence/convergence.md:113]

## Sources Consulted

- `.opencode/specs/system-deep-loop/052-deep-loop-unification/spec.md`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/plan.md`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs`

## Assessment

- `newInfoRatio`: 0.08
- Novelty justification: mostly confirmed the existing phase-004 plan; the additive insight is the conditional recommendation to wire fallback before a GLM-heavy rerun only if automatic remediation is required.
- Confidence: high that fallback wiring is optional for the merge and should not block phases 002/003.

## Reflection

- Worked: reading the actual retry-exhaustion branch resolved the zero-caller ambiguity.
- Failed: no forced-failure test was run; this is research only and phase 004 owns that implementation evidence.
- Ruled out: making fallback wiring a hard dependency of the structural rename.

## Recommended Next Focus

Synthesize results and feed one concrete revision into child 003: explicitly test/update `mk-deep-loop-guard` because its stale path fails open.
