# Iteration 002, Q4: Intent classifier inertia and the misleading weights telemetry

**Focus:** Why does intent classify as `understand` for 132 of 144 cells with `weightsApplied: off`? Bug or by-design?
**Executor:** gpt-5.5-fast xhigh, read-only.
**newInfoRatio:** 0.9, new finding that reframes the P3 "inert intent classifier" as by-design plus a telemetry-honesty bug.

## Finding: two separate mechanisms, and the envelope reports the wrong one

The "inert routing axis" reading conflates two distinct axes, and `weightsApplied: off` measures neither the one we care about.

**Intent classification (by-design fallback).** `/memory:search` runs `intentClassifier.classifyIntent`; a heuristic of keyword tables, regex, and centroid scoring. Low-confidence intent below `SPECKIT_INTENT_CONFIDENCE_FLOOR` (default 0.25) is overwritten to `understand`. Short vague queries collapse because weak or no-evidence matches fall back to `understand` (top score < 0.08 returns understand, centroid-only winners < 0.30 return understand, then the handler floor can override again). [SOURCE: `handlers/memory-search.ts:856-857`, `:1077-1097`; `lib/search/intent-classifier.ts:77-163`, `:591-635`]

**Retrieval class is a separate axis.** `classifyRetrievalClass` returns `Neutral | SingleHop | MultiHop | Temporal | Entity | Quote`, pattern-matched in precedence order, defaulting to `Neutral` on no match. `routeQuery` computes class and intent independently. [SOURCE: `lib/search/retrieval-class-classifier.ts:4-58`, `:101-122`; `lib/search/query-router.ts:365-375`]

**`weightsApplied: off` is misleading telemetry.** The handler maps `extraData.intent.weightsApplied` from `stage2.intentWeightsApplied`, which reports STAGE-2 INTENT weighting, not retrieval-class profile weighting. Stage 2 intent weights are intentionally never applied to hybrid searches (only `!isHybrid && config.intentWeights`), and `/memory:search` runs hybrid. So the field is always `off` for normal search regardless of routing. [SOURCE: `handlers/memory-search.ts:1388-1394`, `:1188-1192`; `lib/search/pipeline/stage2-fusion.ts:37-40`, `:1305-1323`]

**Retrieval-class profile weights** are a separate pre-fusion mechanism gated by `SPECKIT_RETRIEVAL_PROFILE_WEIGHTS` (default-off), applied in hybrid fusion, with NO envelope status field. [SOURCE: `lib/search/retrieval-profile.ts:13-14`, `:74-77`; `lib/search/hybrid-search.ts:1573-1632`]

## Bug or by-design
By-design on both substantive axes: `understand` is the safe low-evidence fallback, and the retrieval-class profile weights are dark-launched off pending a benchmark (`changelog-001-003-retrieval-class-routing.md:22-28`). The real defect is **telemetry honesty**: the envelope's `weightsApplied` measures Stage-2 intent weighting (always off for hybrid), not the retrieval-class profile weighting a reader would assume.

## Fix options
- **Telemetry-honesty (small, recommended first):** stop interpreting `intent.weightsApplied` as class-profile status. Add a separate retrieval-profile status field sourced near `hybrid-search.ts:1573-1575`. Misleading seam: `memory-search.ts:1388-1394`.
- **Route-differentiation (larger):** add a short-query fallback in `classifyRetrievalClass` before the `Neutral` return so one-token content queries route to a real class (e.g. `Entity`), then promote `SPECKIT_RETRIEVAL_PROFILE_WEIGHTS`. Blast radius: all bare-token and vague searches can change channel weights and ranking. [SOURCE: `retrieval-class-classifier.ts:111-122`; `retrieval-profile.ts:74-77`; `hybrid-search.ts:1573-1632`]

## Uncertainty
- INFERRED: that `graph` and `kubernetes` specifically hit the fallback/floor path (follows from the keyword tables, not runtime-executed). Confirm via read-only `classifyIntent("graph")` / `classifyRetrievalClass("graph")` calls with and without the profile-weights flag.

## Next focus
Q5, the dashboard presentation issues (bare-dash scores on graph/degree rows, the result-count-versus-rows mismatch under token-budget truncation, truncated long-path titles).
