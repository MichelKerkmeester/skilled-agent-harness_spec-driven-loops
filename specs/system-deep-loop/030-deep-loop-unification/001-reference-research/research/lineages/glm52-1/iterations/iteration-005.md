# Iteration 5: fallback-router.ts Wiring for GLM-5.2 → MiMo-v2.5-Pro

## Focus

Should `fallback-router.ts` be wired for real GLM-5.2 → MiMo-v2.5-Pro fallback given it has zero callers today? Assess the wiring cost, the failure modes this fanout exposes, and whether the merge changes the calculus.

## Findings

### F5.1 — Zero callers, confirmed at every layer

`fallback-router.ts` exports `resolveFallback`, `createFallbackRouter`, `validateFallbackGraph`. Grep across `deep-loop-runtime/scripts/` (all `.cjs`) returns ZERO references to `fallback-router`, `resolveFallback`, `createFallbackRouter`, `ModelRegistry`, or `quota_pool`. The fan-out scripts (`fanout-run.cjs`, `fanout-pool.cjs`, `fanout-salvage.cjs`) contain only unrelated `fallback` tokens (numeric default-arg names like `normalizePositiveDuration(value, fallback)`, `fallback_assignment_model`). The only consumers of the router are its own unit tests (`fallback-router.vitest.ts`, `executor-provenance-mismatch.vitest.ts`) and documentation.

**The router is dormant but valid infrastructure**: it validates fallback graphs (cycles, max-hops, cross-scope edges, known targets), resolves cross-quota-pool targets, and carries an approval-guard that rejects unapproved substitutions.

[SOURCE: grep fallback-router|resolveFallback|createFallbackRouter|ModelRegistry across scripts/ — empty; fallback-router.ts:299-431]

### F5.2 — The fan-out retry path does same-model retry-and-salvage, NOT model swap

`fanoutConfigSchema` (`executor-config.ts:272-282`) defines `maxRetries: 5`, `lagCeilingMs: 300000`, `progressHeartbeatSeconds: 60`. The retry logic in `fanout-pool.cjs` requeues a failed/stalled lineage within the concurrency ceiling and re-runs it with the SAME executor config. On exhaustion, `fanout-salvage.cjs` recovers partial output. At no point does the pool consult a fallback router or swap the model. The spec.md risk row (124) confirms: "A `glm52-N` replica that exhausts `maxRetries` degrades to a same-model retry-and-salvage, not an automatic model swap."

This is exactly the gap this fanout is stress-testing: if a GLM-5.2 replica fails hard, the operator must manually re-dispatch it as `mimo-v2.5-pro`.

[SOURCE: executor-config.ts:272-282; fanout-pool.cjs; spec.md:124]

### F5.3 — Wiring is a real feature, not a one-liner — and it is OUT OF SCOPE for this phase

Wiring the router requires four non-trivial pieces:

1. **ModelRegistry data source**: the router needs a `{ models: [{ id, quota_pool, fallback_target, ... }] }` registry. Today this would derive from `sk-prompt-models/assets/model_profiles.json`. No such bridge exists; the profiles use a different schema (`executors` array per model, `primary_quota_pool`) than the router's `ModelProfile`.
2. **Retry-exhaustion detection at the fan-out level**: `fanout-pool.cjs` would need a hook that fires when a lineage exhausts `maxRetries`, builds the registry, and calls `resolveFallback`.
3. **Re-dispatch with the swapped model**: a new lineage run with the fallback model's executor config, carrying `hopIndex`/`routeGroupId` trace.
4. **Approval-guard semantics**: `resolveFallback(failedModelId, registry, approvedModelIds, context)` rejects a target not in `approvedModelIds`. In fan-out, the approved set is the `--executors` payload. A GLM-5.2 → MiMo swap routes to a model NOT in the approved executors unless MiMo is explicitly declared — so the router would correctly **fail-fast** on an unapproved swap. The operator would need to pre-approve MiMo as a fallback target (a new executors-payload field) for the swap to fire.

This is a multi-file feature. The research phase is **strictly read-only** (spec.md:69-75): "Modifying `deep-loop-workflows`/`deep-loop-runtime` in any way — this phase is strictly read-only investigation." Wiring is explicitly out of scope.

[SOURCE: fallback-router.ts:357-430 (approval guard); executor-config.ts:272-282; spec.md:69-75]

### F5.4 — The merge does NOT change the calculus, only mildens the import path

Post-merge, `fallback-router.ts` lives at `system-deep-loop/lib/deep-loop/fallback-router.ts`. A future caller in `system-deep-loop/scripts/fanout-pool.cjs` would import it intra-skill (shorter, no cross-skill hop) — a marginal enabler. But the merge creates no caller. The router stays zero-caller post-merge unless someone explicitly wires it. **The merge is a mild enabler (intra-skill import) but not a trigger.**

### F5.5 — Verdict: do NOT wire during the merge; preserve the router and track as post-merge follow-up

- **Preserve**: keep `fallback-router.ts` and its tests intact through the merge. It is valid, tested, dormant infrastructure with a clear contract. Removing it would discard tested graph-validation logic.
- **Do NOT wire during the merge**: wiring creates merge-conflict surface on a moving target and is out of scope for the read-only research phase.
- **Track as follow-up**: a post-merge task (after child 002/003 stabilize) to: (a) build the `model_profiles.json` → `ModelRegistry` bridge, (b) add a fan-out retry-exhaustion hook, (c) extend the executors payload with an opt-in `fallback_targets` field so the approval-guard can authorize swaps. The spec's accepted-risk posture ("operator-mediated manual re-dispatch") is correct for now.

## Sources Consulted

- `fallback-router.ts:299-431` (resolveFallback, approval guard)
- `executor-config.ts:272-282` (fanoutConfigSchema)
- grep across `scripts/*.cjs` for router/registry/quota_pool (empty)
- `spec.md:69-75,124` (scope + risk)

## Assessment

- **newInfoRatio:** 0.45
- **Novelty justification:** Mostly confirmation (zero callers) plus a structured 4-piece wiring-cost breakdown and the approval-guard semantic analysis (the router would correctly reject an unapproved MiMo swap). The verdict (preserve, don't wire, track follow-up) is the net-new decision input.
- **Confidence:** high (code + schema evidence)

## Reflection

- **What worked:** Decomposing "should we wire it" into (cost) + (scope) + (merge-calculus) + (approval-guard semantics) produced a defensible verdict rather than a yes/no.
- **What failed:** Nothing.
- **Ruled out:** Wiring fallback-router as part of the merge. Out of scope (read-only phase) + creates moving-target conflict surface + the approval-guard would reject unapproved swaps anyway.

## Recommended Next Focus

All 5 key questions answered. Proceed to synthesis.
