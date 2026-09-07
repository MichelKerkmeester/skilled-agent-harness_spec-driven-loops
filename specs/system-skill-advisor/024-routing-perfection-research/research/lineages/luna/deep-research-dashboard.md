# Deep research dashboard

Status: complete  
Session: `fanout-luna-1788757934344-y5f8cr`  
Lineage: `luna` (detached)  
Executor: `cli-codex model=gpt-5.6-luna`  
Policy: `max-iterations`  
Progress: 5 / 5 iterations

## Evidence plan

1. Trace the live scorer and probe short/contextual phrases.
2. Read all six hub contracts and test collision ownership.
3. Join stage-1 graph metadata to stage-2 router declarations.
4. Compare compiled-route membership and legacy fallback.
5. Turn the evidence into a wrong-hub build gate with no-reach telemetry.

## Baseline supplied by the worker prompt

Daemon generation 679: 439 declarations, 19 wrong-hub observations, 136 no-reach observations across six hubs. These values are baseline inputs and are not re-derived in the loop.

## Latest iteration

Iteration 1 completed. The scorer trace identified two separable seams: stage-1 projection visibility and the minimum lexical-overlap denominator for short prompts. The built scorer reproduced `plot this` as no recommendation and `plot this data` as `sk-design` at confidence `0.82`. The daemon socket probe was unavailable with `EPERM`, so no live-daemon result is claimed.

Next: inspect cross-hub collision arbitration.

## Latest iteration

Iteration 2 completed. All six hub contracts claim precise stage-2 review/audit/branch phrases, while the generic explicit lane assigns `review` to `sk-code`, `audit` to `sk-code`, and `branch` to `sk-git`. The missing cross-hub ownership channel, not hub-local tie-break order, is the collision seam. The supplied daemon baseline and local built projection differ on two probe ranks; that drift is retained explicitly.

Next: establish the stage-1/stage-2 vocabulary invariant.

## Latest iteration

Iteration 3 completed. A checker-compatible six-hub join found substantial missing stage-1 counterparts (for example, `sk-doc` 46/169 and `system-deep-loop` 3/25 exact), while canonical normalization changed only one sample. The invariant is owner-local and two-tier: multi-word phrases require stage-1 authorization, then dynamic reach classifies wrong-hub versus no-reach; bare one-word local vocabulary is telemetry.

Next: isolate compiled-route membership from the vocabulary defect.

## Latest iteration

Iteration 4 completed. The compiled front door returned a legacy sentinel for `sk-design` and compiled/deferred decisions for the five registered hubs; the freshness guard reported all five as fresh. The engine selects modes within an already chosen hub, so compiled membership is orthogonal to stage-1 vocabulary reach.

Next: define the final measurement gate.

## Latest iteration

Iteration 5 completed. The gate must fail closed on probe errors and wrong-hub results, report no-reach telemetry, require the full multi-word inventory, and skip bare one-word vocabulary. The existing checker currently swallows probe errors and accepts `--limit`, both of which can create false green results.

Phase main loop reached the configured cap. Convergence was telemetry only; phase synthesis completed with `stopReason: maxIterationsReached`.

## Synthesis verdict

The defect is a contract seam: stage-2 router declarations select within-hub modes, while stage-1 advisor projection reads graph metadata intent signals. Short-query normalization and generic token boosts then magnify the missing ownership data into no-reach and wrong-hub results. Compiled routing is a separate, within-hub serving layer.

Priority repair: generated owner-local stage-1 phrase authorization plus a bounded scorer phrase anchor, paired with an exhaustive probe gate that fails closed on probe errors and wrong-hub results while reporting no-reach telemetry. Do not lower the confidence bar or union all router prose.

Lineage terminal state: 5 / 5 iterations, `maxIterationsReached`.
