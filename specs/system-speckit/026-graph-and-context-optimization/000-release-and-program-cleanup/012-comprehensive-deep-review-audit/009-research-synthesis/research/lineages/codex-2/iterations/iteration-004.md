# Iteration 004 - Security Severity Calibration

## Focus

Recalibrate P0 security findings under the local single-user MCP threat model.

## Findings

1. The main memory-search pipeline receives normalized governance scope (`tenantId`, `userId`, `agentId`), but the community fallback runs after weak results and calls `searchCommunities(effectiveQuery, requireDb(), 5)` without passing scope. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:946`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:955`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1000`]

2. Community search reads all community summaries and returns member IDs from matched communities. The fallback then fetches `memory_index` rows by those IDs only. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:124`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:160`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1006`]

3. The fallback is default-on when dual retrieval and community fallback feature flags are enabled. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:704`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:713`]

4. Causal link input accepts raw source and target IDs with relation, strength, and evidence only. No tenant/user/agent/session scope is part of the input schema. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:406`]

5. The causal link handler passes raw IDs directly into `insertEdge`, the storage layer defers FK checks for tests, and unlink deletes solely by edge id. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:689`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:757`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:279`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:743`]

## Sources Consulted

- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`

## Assessment

The underlying defects are real: community fallback can bypass governed search scope, and causal graph mutation accepts bare IDs without ownership checks. Severity depends on deployment. In a shared daemon, multi-user MCP server, untrusted plugin/tool-caller environment, or any setup where governance scopes represent isolation boundaries, these can justify P0. Under the stated local single-user MCP threat model, they calibrate better as P1 security/correctness defects because there is no separate tenant adversary crossing a live trust boundary.

## Reflection

The audit should preserve the security finding but make the severity conditional on deployment mode. That avoids both extremes: dismissing a genuine isolation bypass, or overstating local single-user risk.

## Recommended Next Focus

Validate deep-loop fan-out blast radius directly in runtime code, especially exit-code accounting and concurrency behavior.
