# Iteration 5: Fallback-Router Wiring Decision

## Focus

Decide whether `fallback-router.ts` should be wired now for GLM-5.2 to MiMo-v2.5-Pro fallback, or remain optional/deferred, by inspecting the shipped router, unit tests, fan-out retry path, and fan-out config model.

## Findings

1. **`fallback-router.ts` is a real, shipped routing library, not a speculative stub.** It defines the model registry shape, validates fallback graphs, exposes `createFallbackRouter()`, and resolves a failed model to either `fallback` or `fail-fast`. The implementation rejects unknown models, missing targets, same-pool targets, unapproved substitutions, cross-scope graph widening, cycles, and max-hop violations. [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:57] [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:299] [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:320] [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:357]
2. **Existing unit tests cover the pure router contract, but not GLM/MiMo integration.** The tests prove default fail-fast, separate-pool routing, same-pool rejection, missing target rejection, unknown model rejection, typed timeout routing with metadata, and cycle preflight rejection. They do not instantiate `glm-5.2` or `mimo-v2.5-pro`, and they do not prove a fan-out lineage actually re-dispatches on fallback. [SOURCE: file:.opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts:36] [SOURCE: file:.opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts:51] [SOURCE: file:.opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts:109] [SOURCE: file:.opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts:143]
3. **The current fan-out retry path only requeues the same lineage label and model.** `fanout-pool.cjs` receives generic items and worker callbacks, normalizes `maxRetries`, increments `retryCounts` by label, pushes the same item index back onto the queue, and marks `retry_exhausted` when retries are used. There is no model-target substitution at the pool layer. [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:418] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:433] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:628] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:650]
4. **The optional phase should not wire directly into the generic pool without a clearer hook, because model context lives in `fanout-run.cjs`.** `fanout-run.cjs` expands lineage executors, builds per-lineage prompts and commands, computes failure state, and passes each `lineage` object into the worker. That is where `lineage.model`, `lineage.kind`, artifact directory, session id, and command construction are available. A pool-only edit would either leak model semantics into a generic primitive or require a new explicit fallback hook/options contract. [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1432] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1534] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1548] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1580] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1599]
5. **Adding GLM-5.2 to MiMo-v2.5-Pro fallback is real feature work, not a rename/unification prerequisite.** The fan-out config schema currently includes `executors`, `assignment_model`, `concurrency`, `maxRetries`, `lagCeilingMs`, and heartbeat settings, with no `ModelRegistry` or fallback config. The child 004 spec itself marks the phase optional/P2, requires an operator scope decision, and lists scope-creep risk. [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:272] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/plan.md:51] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md:90] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md:113]

## Decision

`fallback-router.ts` should remain optional/deferred for the core `system-deep-loop` merge. It is valuable and feasible, but it is not required for the structural rename, path repair, external reference migration, or closeout validation. If the operator chooses to land it, amend child 004 before implementation: wire the model substitution at `fanout-run.cjs` or via an explicit `runCappedPool` fallback hook, add a parsed fallback registry surface to `executor-config.ts`, emit attribution events, and test a forced-failure GLM-to-MiMo re-dispatch.

## Sources Consulted

- `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts`
- `.opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/plan.md`

## Assessment

- `newInfoRatio`: 0.75
- Novelty justification: The router's existence was expected, but this pass found a plan-level design correction: model substitution context lives in `fanout-run.cjs` or a pool hook, not naturally inside the generic pool primitive.
- Confidence: High that fallback routing is optional for the merge; high that a real implementation needs config/schema and integration-test work; medium on exact event names until the implementation design is amended.

## Reflection

- Worked: Reading the pool and runner separately clarified the architectural boundary between generic retry mechanics and model-aware dispatch.
- Failed: The child 004 plan's single-file `fanout-pool.cjs` edit is underspecified; it omits the config surface and model-aware runner context.
- Ruled out: Treating fallback-router wiring as required for the rename/unification closeout.

## Recommended Next Focus

Run a convergence validation pass: confirm all key questions are answered, identify any residual synthesis risks, then produce the final research report if no new investigation remains.
