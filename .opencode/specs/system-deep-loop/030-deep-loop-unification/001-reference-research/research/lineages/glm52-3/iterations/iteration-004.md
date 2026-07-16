# Iteration 004 — fallback-router.ts Wiring Decision (Q5)

**Lineage:** glm52-3 | **Iteration:** 4 of 5 | **Focus:** Q5 — should fallback-router.ts be wired for real GLM-5.2→MiMo-v2.5-Pro fallback?
**Date:** 2026-07-08

## Focus

Definitively confirm zero production callers, characterize today's failure-handling path (what a model-swap would replace), assess cost/benefit for the GLM-5.2→MiMo case, and reconcile with the operator-gated scope (optional child 004). Final open question.

## Findings

### F4.1 — Zero production callers confirmed repo-wide

`rg fallback-router|createFallbackRouter|resolveFallback` across `.opencode` excluding node_modules, *.vitest.ts, changelog, *.md → **EMPTY**. The only imports are the two test files (`fallback-router.vitest.ts`, `executor-provenance-mismatch.vitest.ts`) and doc references (README, SKILL.md, changelog). [SOURCE: repo-wide rg, iter-001 + iter-004 re-confirmation] `createFallbackRouter` and `resolveFallback` are exported, fully tested (431-line module with graph validation: no cycles, scopes-don't-widen, max-hops), but NEVER invoked by any `.cjs` runtime script or production `.ts` path.

### F4.2 — Today's failure path is SAME-MODEL retry-and-salvage, NOT model-swap

`fanout-pool.cjs` owns lineage failure handling today:
- `:433` `maxRetries = normalizeMaxRetries(options.maxRetries)` — retries the SAME model while `result.error.retryable === true && retryCount < maxRetries` (`:628`).
- `:651` `result.retry_exhausted = result.error.retryable === true && retryCount >= maxRetries` — on exhaustion the lineage is marked failed/rejected.
- `fanout-salvage.cjs` (`:61-73`) recovers partial output from saved STDOUT (the write-failure salvage path) via `mergeJsonlUnderLock` — it salvages TEXT, never swaps the MODEL.
- `failure_class` (`:138-139`) is tracked for observability but does not trigger rerouting. [SOURCE: fanout-pool.cjs:433,628,642-643,651; fanout-salvage.cjs:17,61-73]

**So a `glm52-N` replica that exhausts maxRetries today degrades to: same-model retry → stdout salvage → if no recoverable text, the lineage finishes with fewer completed replicas.** This is exactly the 001/spec.md:124 risk ("degrades to a same-model retry-and-salvage, not an automatic model swap"). CONFIRMED.

### F4.3 — What wiring would add + cost/benefit

Wiring `createFallbackRouter` into fanout-pool's `retry_exhausted` branch would: (1) build a `ModelRegistry` with the `glm-5.2 → mimo-v2.5-pro` fallback edge, (2) on exhaustion call `resolveFallback(failedModelId, registry, approvedModelIds)` → (3) re-dispatch the lineage with the resolved target model. The router's approval-set guard (`:343-348`) is already additive and safe — a future wiring needs no router-contract rework. [SOURCE: fallback-router.ts:320-369]

**Cost:** real integration work — ModelRegistry construction, a re-dispatch state machine, a new state-log event type, new tests, and a vetted approval set. This is a whole phase (child 004), not a tactical edit.

**Benefit:** raises the probability that a `glm52-N` replica completing 5/5 instead of degrading. Narrow benefit, scoped to fan-out runs that hit a retryable GLM-5.2 failure.

### F4.4 — DECISION: DEFER (keep optional child 004; do NOT block the merge on it)

Five-point rationale:
1. **Zero merge-blocking dependency.** fallback-router.ts relocates as-is inside `runtime/`; its zero-caller status and its self-contained test suite (431-line module, green) are UNCHANGED by the merge. The structural/identity merge has no correctness dependency on wiring.
2. **The merge changes nothing about fallback-router's correctness.** It is pure relocation; no path/hop repair touches it (it has no cross-skill require — it's a leaf library consumed only by tests).
3. **Wiring is orthogonal hardening with its own validation surface.** Coupling it to the structural merge inflates blast radius (ModelRegistry + re-dispatch state machine + new event types) for zero structural benefit.
4. **The manual escape hatch covers the research use case.** Per 001/spec.md:124, operator-mediated manual re-dispatch as `mimo-v2.5-pro` is possible post-hoc since `fanout-merge.cjs` just enumerates `lineages/` subdirectories — a salvaged/partial glm52 lineage and a fresh mimo lineage merge identically.
5. **Deferral creates no router debt.** The approval-set guard is additive (`:343-348`); a future child-004 wiring authored against the post-merge path reuses the current contract unchanged.

**One nuance for child 004's spec:** if 004 is deferred past the merge, it will be authored against the NEW path (`system-deep-loop/runtime/lib/deep-loop/fallback-router.ts`), not the current one. Child 004's spec.md/plan.md should reference the post-merge location to avoid a stale-path edit instruction. [SOURCE: spec.md:83,157; 001/spec.md:124]

## Answer

**Q5: No — do NOT wire fallback-router.ts as part of the merge.** Keep it optional/operator-gated (child 004), deferred. The merge is purely structural/identity; fallback-router relocates with zero callers and zero correctness change. Wiring is orthogonal hardening best tracked separately. The router's additive approval-set guard means deferral incurs no contract debt.

## Ruled Out

- **Ruled out:** "wire fallback-router as part of the merge for GLM-5.2 resilience." Orthogonal to the structural merge; zero merge-blocking dependency; manual escape hatch exists.
- **Ruled out:** "the merge forces fallback-router changes." None — it relocates as-is; no cross-skill require touches it.

## Novelty Assessment

newInfoRatio: 0.45 — Partially-new, decisive. The recommendation (defer) ALIGNS with the existing operator-gated scope, so the decision itself is confirmatory (lower novelty). The net-new value is the cost/benefit analysis grounded in the actual failure-handling code (same-model retry-and-salvage, not model-swap) and the "zero merge-blocking dependency + no router-contract debt" reasoning chain that gives the deferral a durable justification rather than just restating the existing scope.

## Sources

- [SOURCE: rg fallback-router/createFallbackRouter/resolveFallback repo-wide excluding tests/docs = empty]
- [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:433,628,642-643,651,138-139]
- [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs:17,61-73]
- [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:320-369]
- [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/spec.md:83,157]
- [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/spec.md:124]
