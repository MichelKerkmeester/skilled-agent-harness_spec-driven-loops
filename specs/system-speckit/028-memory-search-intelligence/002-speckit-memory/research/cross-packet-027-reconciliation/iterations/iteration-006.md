# Iteration 6 (Round K): Q6 Semantic Triggers × query-class routing

## Focus
Reconcile 027's semantic trigger matcher against 028's 5-class retrieval-class router (C2-A/B/C). Read-only.

## Findings (newInfoRatio 0.3)
**VERDICT: NO-TRANSFER** — different paths, no shared surface.
- 027's semantic trigger matcher is a shadow-only cosine lookup against stored trigger-phrase embeddings; its only knobs are threshold/margin/max (`semantic-trigger-matcher.d.ts SemanticTriggerMatcherOptions`), no RRF channels and no graph-expansion. C2-B (per-class RRF weights) and C2-C (graph gating) have **zero surface** there.
- 028 C2-A adds `retrievalClass` as a third axis on the multi-channel `memory_search` router `RouteResult` (`query-router.ts:46-52`) — a different path. The only live trigger↔router coupling runs the OTHER direction (trigger phrases feed complexity-tier classification, `query-router.ts:333-341`). LEVERAGE L, EFFORT M.

## Most-likely-wrong (open → thin "extends")
C2-A's *classifier output* (independent of C2-B/C2-C) could be a cheap upstream gate for the trigger stage (Quote/Entity-class → favor exact lexical trigger; MultiHop → skip semantic trigger). Unbuilt/unproposed in both packets — flag for Round L as a thin-extends candidate.

## Next Focus
Round L: assess the classifier-as-upstream-trigger-gate idea (the lone path to value on Q6).
