# Iteration 014 — Angle 14

**Angle:** Graph/degree channel utilization: memory_health routing telemetry — are the graph channels earning their cost in real retrieval?

**Summary:** The graph/degree health surface is not yet sufficient to prove the channels earn their retrieval cost. A warm-only memory_health probe could not run because the daemon socket returned ECONNREFUSED exit 75, so findings are source-code grounded.

**Findings kept:** 4

## [P1][BUG] Routing telemetry counts planning/cache calls as retrieval utilization

- Evidence: .opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts:336-438 records inside routeQuery(); .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:971-983 calls routeQuery before cache lookup and 1095-1106 can return cachedPayload; .opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:1813-1832 calls routeQuery only to build an envelope
- Detail: memory_health.data.routing is sourced from routeQuery side effects, not from channel execution. A cached memory_search and a memory_context envelope-only call both increment the same rolling window, so the telemetry cannot be treated as real graph/degree retrieval cost.
- Fix sketch: Move telemetry recording out of routeQuery and record only after actual channel execution, with cache-hit and planning-only calls excluded or separately labeled.

## [P1][BUG] Recorded channels can diverge from channels actually executed

- Evidence: .opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts:438 records adjustedChannels; .opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1267-1279 replaces them with forceAllChannels or removes disallowed channels; .opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:920-925 removes graph/degree for useGraph=false; .opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1059-1064 forces all channels on tiered retry
- Detail: The telemetry records the query-router selection before execution-level overrides are applied. It can over-report graph/degree when useGraph=false suppresses them, and under-report graph/degree when fallback retry forces all channels.
- Fix sketch: Record the final activeChannels after forceAllChannels and allowed-channel filtering, and include the fallback stage name.

## [P2][REFINEMENT] memory_health lacks value metrics for whether graph earns its cost

- Evidence: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:1250-1255 exposes only invocation rates/totalRecorded/windowSize; .opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:334-357 already tracks graphHits, graphOnlyResults, multiSourceResults and graphHitRate; .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:316 exposes those metrics via memory_stats instead
- Detail: memory_health can show that graph was selected, but not whether it returned hits, contributed unique results, improved fusion, or added latency. The useful graph hit metrics already exist but are not on the routing health surface; degree has no comparable contribution metric.
- Fix sketch: Add graph hit/result counters, degree contribution counters, and optional per-channel timing to memory_health.data.routing.

## [P2][DOC-DRIFT] Handler README claims per-channel counts that memory_health does not return

- Evidence: .opencode/skills/system-spec-kit/mcp_server/handlers/README.md:115 says data.routing surfaces graphChannelInvocationRate and per-channel counts; .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:1250-1255 returns graphChannelInvocationRate, channelInvocationRates, totalRecorded, and windowSize but not channelInvocationCounts
- Detail: The source telemetry snapshot includes counts, but memory_health intentionally drops them. Operators following the README cannot inspect raw per-channel counts from memory_health.
- Fix sketch: Either expose channelInvocationCounts in memory_health.data.routing or update the README to say rates only.
