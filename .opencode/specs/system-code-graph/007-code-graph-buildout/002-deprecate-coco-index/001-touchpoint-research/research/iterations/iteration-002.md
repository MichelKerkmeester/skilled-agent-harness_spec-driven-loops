# Iteration 002 - RQ2 Rerank-Sidecar Consumers + Memory Fallback

## Focus (RQ2 primary, RQ3 seed)

Primary: Trace every consumer of `system-rerank-sidecar` with file:line citations, confirm mk-spec-memory as the only non-coco consumer, define what mk-spec-memory loses when the sidecar is removed, and document the safe fallback path. Secondary: Seed RQ3 by listing `system-code-graph`→coco registration points.

## Rerank-sidecar consumers

| File (file:line) | Role | Mutation Class | Note |
|------------------|------|----------------|------|
| .opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:38 | Local provider endpoint definition | EDIT-decouple | Defines `http://localhost:8765/rerank` as the local sidecar endpoint in PROVIDER_CONFIG |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:209 | Provider resolution logic | EDIT-decouple | Resolves to 'local' provider when `RERANKER_LOCAL=true` |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:269-304 | Local rerank implementation | EDIT-decouple | `rerankLocal()` function calls the sidecar via HTTP POST to `/rerank` endpoint |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:319-330 | Fallback when provider unavailable | EDIT-decouple | Returns positional fallback scores (0-0.5 range) with `scoringMethod:'fallback'` when no provider available |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:334-343 | Circuit breaker fallback | EDIT-decouple | Returns positional fallback when circuit is open after consecutive failures |
| .opencode/bin/lib/ensure-rerank-sidecar.cjs:18-21 | Sidecar skill path and port constants | DELETE | Defines SIDECAR_SKILL_PATH and DEFAULT_PORT=8765 |
| .opencode/bin/lib/ensure-rerank-sidecar.cjs:1076-1080 | Reaper telemetry path resolution | DELETE | Resolves `RERANK_SIDECAR_REAPER_TELEMETRY_PATH` env var, defaults to `~/Library/Logs/spec-kit/sidecar-reaper.jsonl` |
| .opencode/bin/lib/ensure-rerank-sidecar.cjs:1092-1108 | Reaper telemetry writer | DELETE | `writeReaperTelemetry()` appends events to sidecar-reaper.jsonl |
| .opencode/bin/mk-spec-memory-launcher.cjs:12 | Ensure helper import | EDIT-decouple | Imports `ensureRerankSidecar` from ensure-rerank-sidecar.cjs |
| .opencode/bin/mk-spec-memory-launcher.cjs:449-451 | Sidecar ensure call | EDIT-decouple | Calls `ensureRerankSidecar()` with port from `RERANK_SIDECAR_PORT` env (default 8765) |
| .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:213 | SPECKIT_CROSS_ENCODER documentation | EDIT-remove-ref | Documents the opt-in flag for cross-encoder reranking via localhost:8765 |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:46-48 | Cross-encoder opt-in signals | EDIT-decouple | `hasAnyCrossEncoderOptInSignal()` checks SPECKIT_CROSS_ENCODER flag |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:66-70 | Reranker opt-in signals | EDIT-decouple | `hasAnyRerankerOptInSignal()` includes RERANKER_LOCAL check |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:440-444 | Local reranker gate | EDIT-decouple | `isLocalRerankerEnabled()` checks RERANKER_LOCAL flag with SPECKIT_CROSS_ENCODER precedence |

## What mk-spec-memory loses + safe fallback

**Decision:** mk-spec-memory loses cross-encoder neural reranking entirely when the sidecar is removed. The safe fallback is positional scoring with synthetic scores in the 0-0.5 range, marked with `scoringMethod:'fallback'` to distinguish from real neural scores.

**Evidence:**
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:319-330] When `resolveProvider()` returns null (no provider available), the function returns positional fallback scores: `0.5 - (i / (documents.length * 2))` with `scoringMethod:'fallback'` and `provider:'none'`.
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:334-343] Circuit breaker also returns the same positional fallback pattern when the provider has failed consecutively.
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:202-212] Provider resolution only returns 'local' when `RERANKER_LOCAL=true`; cloud rerankers were removed in 022/013.
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:76-83] The `scoringMethod` field discriminates between 'cross-encoder' (real neural scores), 'cross-encoder-tail' (un-reranked tail), and 'fallback' (synthetic positional scores).

**Fallback behavior:** Without the sidecar, mk-spec-memory continues to function using:
- Vector similarity search (embeddings)
- BM25 lexical search  
- RRF (Reciprocal Rank Fusion) for multi-channel result fusion
- All other Stage 1-2 pipeline features (MMR, adaptive fusion, etc.)
- Stage 3 reranking becomes positional-only instead of neural cross-encoder reranking

**Confirmed:** mk-spec-memory is the ONLY non-coco consumer of the system-rerank-sidecar. Grep for `localhost:8765` found only:
- cross-encoder.ts (the local provider implementation)
- Test fixtures (cross-encoder.vitest.ts, evidence-gap-detector.ts comments)
- One audit script (run-audit.mjs) which is a standalone diagnostic tool
No other production code calls the sidecar HTTP endpoint.

## RQ3 seed: code-graph→coco registration points

| File (file:line) | Registration Point |
|------------------|-------------------|
| .opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:196-201 | `ccc_status` tool definition |
| .opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:202-213 | `ccc_reindex` tool definition |
| .opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:215-227 | `ccc_feedback` tool definition |
| .opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:35-37 | CCC tools exported in tool list array |
| .opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:105-107 | `ccc_status` case in dispatcher |
| .opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:108-109 | `ccc_reindex` case in dispatcher |
| .opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:110-112 | `ccc_feedback` case in dispatcher |
| .opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:120-127 | `code_graph_classify_query_intent` tool definition |
| .opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:31 | `code_graph_classify_query_intent` in tool list |
| .opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:87-89 | `code_graph_classify_query_intent` case in dispatcher |
| .opencode/skills/system-code-graph/mcp_server/handlers/ccc-status.ts:11-12 | `handleCccStatus()` handler implementation |
| .opencode/skills/system-code-graph/mcp_server/handlers/ccc-reindex.ts:18-19 | `handleCccReindex()` handler implementation |
| .opencode/skills/system-code-graph/mcp_server/handlers/ccc-feedback.ts:24-25 | `handleCccFeedback()` handler implementation |
| .opencode/skills/system-code-graph/mcp_server/handlers/classify-query-intent.ts:4 | `code_graph_classify_query_intent` handler implementation |

## Gaps for next iteration

1. **RQ3 detailed mapping**: Need to examine the `code_graph_classify_query_intent` implementation in `handlers/classify-query-intent.ts` to understand the semantic/hybrid routing logic that sends queries to CocoIndex. Need to trace the query-intent-classifier.ts logic to understand when it routes to 'semantic' (coco) vs 'structural' (code-graph) vs 'hybrid'.

2. **CCC bridge integration doc**: Need to read `.opencode/skills/system-code-graph/references/integrations/ccc_bridge_integration.md` to catalog all documented integration points and coupling patterns.

3. **Runtime config gaps**: Iteration-1 noted .gemini/ and .claude/ directories as gaps for RQ1. Need to enumerate MCP registrations and semantic search routing in these runtime configs.

4. **RQ4 semantic-search routing**: Need to map CLAUDE.md SEARCH ROUTING section and AGENTS.md routes that send "find code by concept" to CocoIndex for the replacement policy analysis.

5. **Glossary and router refs**: Strategy.md mentions glossary + "when NOT to use" + router pseudocode in system-code-graph SKILL.md that reference CCC integration. Need to locate and catalog these references.
