# Iteration 2: Security - Scoped Retrieval Fallback

## Focus

Dimension: security.

Files reviewed:
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`

## Scorecard

- Dimensions covered: security
- Files reviewed: 3
- New findings: P0=1 P1=0 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.67

## Findings

### P0, Blocker

- **F002**: `memory_search` can leak out-of-scope rows through the community fallback. The main pipeline receives the caller's governed scope fields [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:953`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:955`], and the stage-1 summary path later applies scope filtering [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1347`]. The community fallback bypasses that scoped pipeline: it calls `searchCommunities(effectiveQuery, requireDb(), 5)` with no `specFolder`, `tenantId`, `userId`, or `agentId` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1000`], fetches member rows with `WHERE id IN (...)` only [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1006`], then appends those rows into the response [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1027`]. `searchCommunities` itself reads all community summaries and returns member IDs without any scope input [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:101`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:124`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:168`]. Under weak scoped results, a tenant- or spec-scoped query can receive unrelated memory rows.

## Claim Adjudication Packets

```json
{
  "findingId": "F002",
  "claim": "The community fallback path appends memory rows without reapplying caller scope filters, so scoped memory_search calls can receive out-of-scope results.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:953",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:955",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1000",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1006",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1027",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:101",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:124",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:168"
  ],
  "counterevidenceSought": "Checked the stage-1 scoped summary path for comparison, searched community-search for tenant/spec filters, and inspected the fallback fetch/append code for post-filtering.",
  "alternativeExplanation": "The canonical-source filter later drops some non-canonical rows, but it does not enforce tenant, user, agent, or spec scope, so it is not a scope control.",
  "finalSeverity": "P0",
  "confidence": 0.93,
  "downgradeTrigger": "Downgrade only if community fallback is disabled by default in production or memberRows are filtered by the same scope predicate before formatting.",
  "transitions": [
    { "iteration": 2, "from": null, "to": "P0", "reason": "Initial discovery" }
  ]
}
```

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | fail | hard | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/002-mcp-retrieval-causal/spec.md:36` | The scoped retrieval implementation has a concrete security bypass. |
| checklist_evidence | pending | hard | - | No checklist file reviewed in this iteration. |

## Assessment

- New findings ratio: 0.67
- Dimensions addressed: security
- Novelty justification: first scoped retrieval security pass found a cross-scope data exposure path.

## Ruled Out

- Main pipeline scope filtering as the source of this leak: the bug is specifically the post-pipeline community fallback, not the normal stage-1 scoped flow.

## Dead Ends

- Relying on downstream response formatting: formatting has no tenant/spec authority and cannot reconstruct the caller's scope once rows are appended.

## Recommended Next Focus

Security replay over causal graph read/stats/unlink surfaces.

Review verdict: FAIL
