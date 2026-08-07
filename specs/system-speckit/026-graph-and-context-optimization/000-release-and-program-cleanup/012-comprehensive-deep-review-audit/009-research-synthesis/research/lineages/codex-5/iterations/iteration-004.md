# Iteration 4: P0 Security Severity Calibration Under Local MCP Threat Model

## Focus
Calibrate whether the two P0 findings are genuine vulnerabilities or by-design local MCP behavior.

## Findings

1. `memory_search` builds a normalized scope from tenant, user, agent, and session fields [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:687]. It passes spec folder and normalized tenant/user/agent scope into the main pipeline [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:946].

2. On weak results, the same handler runs community fallback with `searchCommunities(effectiveQuery, requireDb(), 5)` and no scope arguments [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:987]. The helper reads all `community_summaries` without scope filtering [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:124], returns member IDs [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:168], and the handler fetches `memory_index` rows by `id IN (...)` only [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1006].

3. Community fallback and dual retrieval are default-on graduated features unless disabled by environment flags [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:704] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:713]. That makes the bypass a normal runtime path, not an opt-in edge case.

4. Causal mutation schemas accept raw `sourceId`, `targetId`, and `edgeId` but no scope fields [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:406] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:433]. The handler inserts an edge from stringified source/target IDs [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:756] and deletes by edge ID [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:996]. Storage deletes only by `id = ?` [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:743].

5. Calibration: community fallback remains P0 if governed retrieval scope is a confidentiality boundary because it can append out-of-scope rows to a scoped query. In a strictly local, single-user MCP with no untrusted input, likelihood is lower, but the boundary violation is still real. Causal bare-ID mutation is P1 under local single-user operation and P0 when tenant/user/agent scoping is promised as authorization.

## Sources Consulted
- `002-mcp-retrieval-causal/review/lineages/codex-1/review-report.md`
- `002-mcp-retrieval-causal/review/lineages/codex-2/review-report.md`
- `002-mcp-retrieval-causal/review/lineages/codex-5/review-report.md`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`

## Assessment
newInfoRatio: 0.36

Novelty justification: security facts were mostly known; novelty came from threat-model calibration and remediation priority.

Confidence: high on community fallback bypass. Medium-high on causal severity because it depends on the product's declared scope-isolation contract.

## Reflection
Worked: direct code reads separated exploitability from boundary violation.

Failed: the local threat model is not fully formalized in a single source, so the recommendation must state its assumption.

Ruled out: "not a vulnerability because local." Local operation lowers likelihood but does not make explicit governed-scope bypass by-design.

## Recommended Next Focus
Deep-loop blast radius: determine whether prior fan-out review/research runs could have masked failures or under-delivered concurrency.
