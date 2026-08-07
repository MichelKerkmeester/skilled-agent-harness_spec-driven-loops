# Iteration 002: Verify memory correctness impact and calibrate P0 security labels under the local MCP threat model.

## Focus

Verify memory correctness impact and calibrate P0 security labels under the local MCP threat model.

## Findings

1. Entity-density cache staleness is real but bounded: update/title-trigger changes can leave routing density stale until TTL or explicit invalidation, affecting graph-channel activation rather than permanently corrupting rows. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/memory/entity-density.ts:105] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/memory/entity-density.ts:153]
2. Memory update paths refresh search/interference state but do not invalidate entity-density terms after title or trigger phrase mutation. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/memory/vector-index-mutations.ts:489] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/memory/vector-index-mutations.ts:619]
3. Atomic save has a durability window: the pending file is written, indexing is performed, and only then the pending file is promoted. A crash or promotion failure between indexing and promotion can leave DB/file state inconsistent. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/memory/atomic-index-memory.ts:360] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/memory/atomic-index-memory.ts:378]
4. Community fallback is a real governed-scope bypass when scoped search produces weak results: fallback runs without a scope parameter and then fetches memory_index rows by returned IDs without reapplying tenant/user/agent constraints. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/memory-search.ts:987] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/memory-search.ts:1006] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/community-search.ts:101]
5. Causal graph link writes accept bare source and target IDs and intentionally defer FK existence checks, which allows orphan or wrong-target edges if a local caller supplies bad IDs. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/causal-graph.ts:688] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/memory/causal-edges.ts:279]
6. P0 is justified only if tenants/users/agents are mutually untrusted principals sharing one MCP server. Under a local single-user trusted-client model, the same defects are important correctness/privacy boundary bugs, closer to P1 than remote-critical P0. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/stage1-candidate-gen.ts:1069]

## Sources Consulted

- .opencode/skills/system-spec-kit/mcp_server/src/memory-crud-update.ts:91
- .opencode/skills/system-spec-kit/mcp_server/src/memory/vector-index-mutations.ts:489
- .opencode/skills/system-spec-kit/mcp_server/src/memory/entity-density.ts:153
- .opencode/skills/system-spec-kit/mcp_server/src/memory/atomic-index-memory.ts:360
- .opencode/skills/system-spec-kit/mcp_server/src/memory-search.ts:987
- .opencode/skills/system-spec-kit/mcp_server/src/community-search.ts:101
- .opencode/skills/system-spec-kit/mcp_server/src/causal-graph.ts:688
- .opencode/skills/system-spec-kit/mcp_server/src/memory/causal-edges.ts:279

## Assessment

Question 3 answer: memory correctness impact is mixed. The routing cache issue is transient quality degradation; atomic save is rare durability risk; community and causal graph defects are real scoped-integrity risks.

## Reflection

The severity labels need to distinguish local trusted tool misuse from exploitable cross-principal disclosure.

## Recommended Next Focus

Prove or falsify systemic metadata drift using generator logic plus a broad read-only scan.

## Iteration Metrics

- Status: complete
- Findings count: 6
- New information ratio: 0.62
- Novelty justification: Added concrete impact distinctions between transient routing bugs, crash-window durability bugs, and cross-scope graph defects.
