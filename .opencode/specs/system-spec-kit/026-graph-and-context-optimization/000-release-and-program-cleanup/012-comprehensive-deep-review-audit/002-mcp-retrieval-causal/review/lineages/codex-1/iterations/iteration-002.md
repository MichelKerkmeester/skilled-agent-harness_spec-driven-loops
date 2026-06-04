# Iteration 002 - Security

## Focus

Security pass over scoped retrieval boundaries and fallback channels.

## Files Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`

## Findings

### F003 - P0 - community fallback can bypass `specFolder` and tenant/user/agent retrieval scope

`memory_search` correctly passes `specFolder`, `tenantId`, `userId`, and `agentId` into the main retrieval pipeline [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:946]. On weak results, it runs community fallback [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:987], calling `searchCommunities(effectiveQuery, requireDb(), 5)` without any scope arguments [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1000]. The helper itself only scans `community_summaries` and returns member IDs from summary rows; it has no scope parameters [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:101] and no tenant/spec filtering in the query [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:124].

The handler then fetches `memory_index` rows by those member IDs with `WHERE id IN (...)` only [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1006], marks them as `_communityFallback`, and appends them to the scoped pipeline results [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1027]. Because the final formatter receives this merged array [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1227], a governed query can return memories outside the caller's requested spec folder or tenant/user/agent boundary whenever the fallback is enabled and the scoped pipeline is weak.

Claim adjudication:

```json
{
  "findingId": "F003",
  "claim": "The community fallback path in memory_search can return memory_index rows outside the caller's specFolder or governance scope.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:946",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:987",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1000",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:101",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:124",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1006",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1027",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1227"
  ],
  "counterevidenceSought": "Checked the community-search helper signature and query, the fallback member-row fetch, and the final formatter path for any later scope filter.",
  "alternativeExplanation": "The fallback is gated by feature flags and weak-result detection, so not every scoped query leaks. That does not mitigate the flaw when the fallback is enabled, because the injected rows are fetched after the scoped pipeline has already run.",
  "finalSeverity": "P0",
  "confidence": 0.92,
  "downgradeTrigger": "Downgrade if community fallback is disabled in all supported deployments or if a downstream publication gate demonstrably removes out-of-scope rows before returning the response."
}
```

## Verdict Rationale

This pass found one P0 security issue: a fallback retrieval channel bypasses the governance filters used by the main pipeline.

Review verdict: FAIL
