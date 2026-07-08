# Iteration 005 — Fallback-Router Wiring

**Focus:** Confirm `fallback-router.ts` zero-live-caller status (Q5) and decide wire-into-merge vs defer.
**Status:** insight · **newInfoRatio:** 0.2 · **Lineage:** glm52-2

## Approach
Grepped `runtime/scripts/` for any `fallback-router|resolveFallback` caller; confirmed `fanout-pool.cjs`'s actual retry behavior; checked `sk-prompt-models` quota-fallback recipe for the glm→mimo edge.

## Findings

### F5.1 — Zero live callers: CONFIRMED (decisive) [CONFIRM]
`grep fallback-router|resolveFallback` over `deep-loop-runtime/scripts/` → **no files found**. The only references are `tests/unit/fallback-router.vitest.ts`, `tests/unit/executor-provenance-mismatch.vitest.ts`, and docs (SKILL.md, README, feature_catalog, manual_testing_playbook). `fanout-run.cjs` imports `runCappedPool`/`readRetryCountsFromLedger` from `fanout-pool.cjs` (fanout-run.cjs:29-36) — that pool implements **same-model retry-with-backoff** keyed on `maxRetries`, never a model swap. Spec 004's premise ("zero callers outside its own test file") is verified exactly. Spec 001/plan.md's risk framing ("fallback-router.ts has zero callers today") is also verified.
[SOURCE: grep deep-loop-runtime/scripts → empty; fanout-run.cjs:29-36; 004/spec.md:58; 001/spec.md:124]

### F5.2 — The library is real, complete, and ready to wire [CONFIRM]
`fallback-router.ts` exports `resolveFallback`/`createFallbackRouter`/`validateFallbackGraph` + `ModelProfile`/`ModelRegistry` types, with regression coverage for model-registry lookup, fallback-target selection, disabled fallback, fail-fast reasons, and typed-reroute graph preflight. Wiring into `fanout-pool.cjs`'s retry-exhausted branch is mechanically feasible; 004's design (look up a ModelRegistry on `retryCount >= maxRetries`, re-dispatch a *new* lineage with the fallback model) is sound.
[SOURCE: deep-loop-runtime/tests/unit/fallback-router.vitest.ts:12,36; manual_testing_playbook/01--executor/fallback-router.md:41; 004/spec.md:61,70-72]

### F5.3 — RECOMMENDATION: defer wiring to post-merge (child 004 as independent hardening) [DECISION]
The merge (002/003) should land clean and verified first; fallback-router wiring is **genuine feature work** (new runtime behavior + a ModelRegistry config + forced-failure test), not rename/nesting. Bundling it into the irreversible move violates scope-lock discipline and adds test surface to an already-large change whose success criteria (002 SC-001..003, 003 SC-001..003) do not depend on it. Child 004 is already correctly scoped optional/operator-gated (P2). **Recommendation: ship 004 after 005-validation-and-closeout confirms the merge is green**, exactly as 004's own open question anticipates. This lineage's GLM-5.2 replicas already degrade acceptably to same-model retry-and-salvage (`fanout-salvage.cjs` recovers partial output), so there is no live blocker forcing in-merge wiring.
[SOURCE: 004/spec.md:42-48,90-96,123; 001/spec.md:124; 001/plan.md:107]

### F5.4 — Intra-runtime import is merge-stable (useful confirmation) [CONFIRM]
A future wiring imports `fallback-router.ts` from `fanout-pool.cjs` — both live under `runtime/{scripts,lib}`. That `require('../lib/deep-loop/fallback-router')` is **intra-runtime** and moves in lockstep under nesting, so its relative path does NOT change across the merge. 004 can therefore be implemented against pre- or post-merge paths identically — no extra re-path cost from deferral.
[SOURCE: deep-loop-runtime/scripts/fanout-run.cjs:29-36 (intra-runtime require pattern)]

### F5.5 — The glm→mimo edge is already documented as a recipe [CONFIRM]
`sk-prompt-models/references/quota_fallback.md:148` and `pattern_index.md:50,67` already document `deep-loop-runtime/lib/deep-loop/fallback-router.ts` as a "TS helper applied via recipe field" with system-spec-kit as owner, and the model_profiles registry already carries glm-5.2 + mimo-v2.5-pro with distinct quota pools. So the ModelRegistry *content* (the edge definition) exists; 004 needs only to instantiate it in the pool's retry-exhausted branch. Low marginal effort once prioritized.
[SOURCE: sk-prompt-models/references/quota_fallback.md:148,259; pattern_index.md:50,67; 001/plan.md:132]

## Key Questions
- Considered: Q5 (fallback-router)
- Answered: Q5 — zero callers confirmed; recommend DEFER to post-merge (004 independent). All five packet questions now answered.

## Ruled Out
- "Wire fallback-router into the 002/003 merge as a bonus" — rejected as scope creep (F5.3). The merge must be a clean, verifiable rename+nesting; new runtime behavior ships separately.

## Novelty Justification
Low novelty (0.2): mostly confirms what 004 already documents; the net-new content is the defer-recommendation rationale and the merge-stable import confirmation (F5.4). All key questions answered → coverage gate satisfied; declining novelty → convergence nominated.

## Next Focus
All five questions answered and novelty declining → enter synthesis (phase_synthesis). Produce `research.md`, convergence report, and `resource-map.md`.
