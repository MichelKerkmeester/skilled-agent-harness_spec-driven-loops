# Changelog — 002: Substrate Code-Graph scenario tool-contract fix

**Shipped**: 2026-05-30
**Commit**: 4b2c5de6a3

## What Changed
- Modified 403-code-intent-matching.md to rewrite 4 calls + prose ref from code_graph_query({query, num_results}) to code_graph_context({input, queryMode: "neighborhood"})
- Modified 404-disambiguation-under-context.md to rewrite 3 calls to code_graph_context
- Modified 407-adversarial-near-miss.md to rewrite 3 calls to code_graph_context
- Verified schema against authoritative source in system-code-graph/mcp_server/tool-schemas.ts
- Query text preserved verbatim; 410 (memory latency) left untouched

## Why
The substrate playbooks 403/404/407 called code_graph_query({query, num_results}) which is rejected because that tool is structural (required: operation+subject, additionalProperties:false). The scenarios are semantic-ranking and belong to code_graph_context, the semantic sibling tool.

## Verification
- Authoritative schema located + read: PASS — system-code-graph/mcp_server/tool-schemas.ts; query=structural, context=semantic
- 403/404/407 rewritten: PASS — 10 code_graph_context calls; 0 residual query:/num_results:/code_graph_query
- 410 untouched: PASS — still memory_search
- No regression: PASS — 403/404/407 SKIP before AND after
- Substrate vitest overall: RED — from pre-existing runner:mk-spec-memory connection FAIL + 410 SKIP (SQ1), not these edits
- Packet strict-validate: PASS
