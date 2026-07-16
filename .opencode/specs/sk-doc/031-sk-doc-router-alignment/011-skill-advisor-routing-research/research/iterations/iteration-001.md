# Iteration 1: advisor_recommend path and scorer calibration surface

## Focus

Map the live `advisor_recommend` MCP path from transport through ranking and thresholding. Record the actual source paths, five lane weights, RRF role, ambiguity rules, confidence and uncertainty provenance, and the first calibration implications for the routing gates.

## Actions Taken

1. Read the active deep-research state and strategy before investigating the advisor.
2. Located the live MCP descriptor, dispatcher, handler, scorer, ambiguity, lane-registry, calibration, and compatibility-contract sources under `.opencode/skills/system-skill-advisor/mcp_server/`.
3. Traced request handling from the MCP server to `handleAdvisorRecommend`, including threshold resolution, freshness checks, caching, semantic prompt embedding, scoring, public projection, and response serialization.
4. Traced the five-lane scorer through lane construction, weighted rank fusion, confidence/uncertainty assembly, threshold application, and ambiguity clustering.
5. Attempted the required memory trigger lookup. The MCP call was cancelled/unavailable, consistent with the initialization-time transport evidence, so this iteration used repository sources only.

## Findings

### F1 — The live path has four explicit layers, not the shorthand two

The actual call chain is:

`advisor-server.ts` MCP `CallToolRequestSchema` handler → `tools/index.ts::dispatchTool` → `handlers/advisor-recommend.ts::handleAdvisorRecommend` → `lib/scorer/fusion.ts::scoreAdvisorPrompt`.

The server publishes the descriptor list, rejects unknown tool names, wraps the call in caller context, and dispatches by name. `tools/index.ts` maps `advisor_recommend` to the handler. The separate descriptor in `tools/advisor-recommend.ts` exposes `prompt`, `topK`, attribution and abstention flags, plus per-call confidence and uncertainty overrides. The handler validates with Zod, resolves thresholds, checks freshness and artifact integrity, keys the prompt cache by trimmed prompt plus source signature and threshold options, obtains the semantic-shadow prompt embedding, calls the scorer, sanitizes the public result, and caches it. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts:233] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tools/index.ts:37] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tools/advisor-recommend.ts:12] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:369]

Freshness failure is fail-open: `absent` and `unavailable` return an empty recommendation set with warnings instead of attempting a degraded routing guess. Stale freshness specifically marks `graph_causal` runtime-degraded, removing its live contribution while preserving the remaining lanes. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:87] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:146]

### F2 — Five lanes are live and their default weights sum to 1.00

The canonical live weights are:

| Lane | Default weight | Shadow-learned comparison weight |
|---|---:|---:|
| `explicit_author` | 0.42 | 0.40 |
| `lexical` | 0.28 | 0.25 |
| `graph_causal` | 0.13 | 0.20 |
| `derived_generated` | 0.12 | 0.10 |
| `semantic_shadow` | 0.05 | 0.05 |

Despite its name, `semantic_shadow` is marked `live: true`. A separate BM25 lexical lane is the actual shadow-only lane and has zero live weight. Environment JSON may override individual live or shadow weights within `[0,1]`; the registry does not renormalize overrides. The default live sum is exactly 1.00, but an override can therefore change the denominator and confidence pressure. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts:8] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts:40] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts:48]

### F3 — RRF chooses rank order; public confidence is a separate policy function

Each enabled lane produces ranked `LaneMatch` results. `graph_causal` is derived from the union of explicit, lexical, and derived matches. With the RRF flag active, `fuseAdvisorLaneRanks` delegates multi-list reciprocal-rank fusion to the shared `fuseResultsMulti` helper using lane weights; the scorer uses the fused per-skill result for `score`. Disabled and runtime-degraded lanes are excluded. In the non-RRF fallback, `score` is the direct sum of `rawScore × laneWeight`. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:447] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:605] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:631] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:653]

The fusion math is weighted reciprocal-rank aggregation: for candidate `s`, each participating lane contributes according to its configured weight and reciprocal rank, and the shared helper combines those contributions into the per-skill fused score. The important implementation boundary is that downstream confidence uses `liveNormalized = fusedScore / liveWeightTotal`; RRF output is not exposed as confidence unchanged. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:5] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:637] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:670] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:687]

Exact helper-level normalization and its reciprocal-rank constant remain to be pinned to the shared `rrf-fusion.js` source in the next calibration pass; this iteration confirms the advisor-side inputs, weights, exclusions, and consumption point.

### F4 — `confidence` is threshold-oriented and quantized, not calibrated probability

Confidence starts at `0.52 + min(1, liveNormalized × 1.25) × 0.43`. It is then shaped by policy branches: read-only allowed and task-intent routes floor at `0.82`; derived-dominant weak-direct routes pin to `0.72`; high direct evidence floors at `0.82`; the hard ceiling is `0.95`. A dispersion guard prevents token-stuffed prompts with saturated normalized pressure but weak direct evidence from automatically receiving the task-intent floor. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:381] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts:169]

This means `confidence >= 0.8` is intentionally crossed by categorical floors, often at `0.82`; it must not be interpreted as an 80% correctness probability. Several different evidence patterns collapse onto the same value, so closeness in confidence can be produced by policy quantization rather than true posterior similarity.

### F5 — Uncertainty is evidence-count banding plus small adjustments

Uncertainty begins at `0.42`, drops to `0.30`, `0.22`, or `0.18` at evidence counts 1, 3, and 5, subtracts `0.06` for direct evidence at least `0.75`, adds `0.08` when confidence is below `0.8`, and adds `0.04` when the next ranked candidate lies within `0.05` confidence. It is clamped to `[0.08, 0.95]`. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:431] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:759] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts:187]

The default strict gate is therefore easy to read operationally: one evidence item normally yields `0.30`, while no evidence remains above the `0.35` limit. But the evidence count is the number of emitted evidence strings, not an independence-aware estimate; correlated matches can lower uncertainty as readily as diverse evidence.

### F6 — Ambiguity unions score-nearness and confidence-nearness, after thresholding

Both ambiguity margins are `0.05`. The cluster begins with recommendations that already pass confidence and uncertainty thresholds, then includes any passing candidate within `0.05` of the top candidate by either fused score or confidence. Every member receives `ambiguousWith`; the top-level `ambiguous` flag derives from cluster size. This is broader than a simple top-two confidence check and aligns ambiguity with score ranking while retaining a user-visible confidence window. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/ambiguity.ts:7] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/ambiguity.ts:22] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/ambiguity.ts:38]

Because confidence has repeated `0.82` floors, confidence-based clustering can flag candidates whose policy confidence ties even when their fused score difference is larger than `0.05`. That is conservative, but it also means the ambiguity flag measures a mixture of rank proximity and calibration-policy collision.

### F7 — The compatibility thresholds are a shared policy surface, with per-call overrides

The compatibility contract defaults are confidence `0.8` and uncertainty `0.35`; bounded environment overrides are accepted. The handler resolves these for its public `effectiveThresholds`, while the scorer applies the per-call option when supplied and otherwise its imported defaults. The MCP descriptor explicitly allows both options. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/compat/contract.ts:5] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/compat/contract.ts:25] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:75] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:759]

This establishes the path but not yet full hook/MCP parity. The next iteration should prove that `resolveAdvisorThresholdConfig`, scorer defaults, hook `shouldFireAdvisor`, and CLI fallback all consume the same resolved values under environment and per-call overrides.

## Questions Answered

- Q1 mechanism: answered. The request path, lane weights, rank-fusion boundary, ambiguity rule, compatibility defaults, and confidence/uncertainty provenance are mapped.
- Q1 calibration verdict: partially answered. Static evidence shows confidence is policy-shaped and uncertainty is heuristic rather than probabilistically calibrated; empirical saturation and error calibration still require the scorer benchmark and ambiguity corpus.

## Questions Remaining

- Q1: What exact normalization and reciprocal-rank constant does the shared RRF helper apply, and how do fused scores, confidence floors, ambiguity clusters, and correctness relate on the held-out scorer corpus?
- Q2: How does the Claude prompt-submit hook brief behave when MCP or daemon transport is unhealthy?
- Q3: Are hook gating and MCP threshold resolution provably synchronized across environment and call-specific overrides?
- Q4: Does the advisor vocabulary remain aligned with hub-router and mode-registry vocabulary?
- Q5: Which improvements have the highest correctness and resilience payoff?

## Dead Ends

- Spec Memory trigger lookup was cancelled/unavailable. It supplied no research evidence; repository sources remained sufficient for the iteration focus.
- Treating the public confidence as the RRF score was ruled out: the scorer computes it through a separate calibrated policy function.

## Assessment

- `newInfoRatio`: 0.92
- Novelty justification: This first evidence pass established the complete live request path, concrete lane weights, and the previously unstated distinction between rank fusion, policy confidence, and evidence-count uncertainty.
- Confidence: High for the mapped path and numeric constants; medium for the calibration implications until corpus-level evaluation is inspected.

## Next Focus

Complete Q1 calibration: inspect the shared RRF helper and scorer evaluation corpus/ratchets, then quantify how often the `0.82` floors, `0.05` ambiguity union, and `0.35` uncertainty threshold saturate, abstain correctly, or hide wrong top-1 routes.
