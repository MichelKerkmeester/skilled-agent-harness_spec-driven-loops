# Iteration 001: Security And Correctness

## Focus
Security and correctness pass over `memory_search`, with supporting reads through community fallback, session trust, runtime schemas, and result formatting.

## Findings

### F001 - P0 - Community fallback bypasses scoped retrieval and can return cross-tenant rows

The main search pipeline receives `tenantId`, `userId`, `agentId`, and `specFolder` in its config, so scoped retrieval is intended to constrain the candidate set. The community fallback runs after that pipeline, but it calls `searchCommunities(effectiveQuery, requireDb(), 5)` without passing any scope, then fetches `memory_index` rows by returned member IDs with no `tenant_id`, `user_id`, `agent_id`, or `spec_folder` predicate before appending them into `resultsForFormatting`. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:987] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1000] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1006] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1031]

The community search implementation confirms the fallback is global: it reads every row from `community_summaries`, scores summaries, and returns member IDs without any scope fields or predicate. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:101] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:124] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:168]

This is default-on in normal rollout: community summaries and community fallback are documented as default-enabled, and the feature flag helper treats missing flags as enabled. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:301] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:698] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts:53]

Impact: a weak scoped query with `tenantId`, `userId`, `agentId`, or `specFolder` can append unrelated community members to the response. If `includeContent` is true, formatting reads the returned row's `file_path` and embeds file contents. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:923] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:934] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:1012]

Concrete fix: pass the same normalized scope into `searchCommunities` or post-filter `memberRows` before appending them. For tenant/user/agent scope, fail closed. For `specFolder`, apply the same exact folder filter used by the main candidate path.

Claim adjudication:

```json
{
  "findingId": "F001",
  "claim": "The community fallback in memory_search can inject cross-scope memory_index rows after scoped primary retrieval.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:987",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1000",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1006",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1031",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:124",
    ".opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:934"
  ],
  "counterevidenceSought": "Checked the main pipeline scope filter, community-search implementation, default feature flags, and formatter publication gate/content path.",
  "alternativeExplanation": "The fallback could be intended as global retrieval, but memory_search accepts explicit tenant/user/agent/spec scope and the primary pipeline applies those constraints before the fallback.",
  "finalSeverity": "P0",
  "confidence": 0.91,
  "downgradeTrigger": "Downgrade if community_summaries membership is proven to be pre-partitioned per tenant/user/spec and impossible to mix across scope boundaries before memory_search reads it."
}
```

### F002 - P1 - `memory_search` accepts untrusted `sessionId` while neighboring handlers enforce server-managed sessions

`memory_search` destructures caller-supplied `sessionId` and threads it directly into trace creation, cache arguments, pipeline config, goal refinement, seen-result marking, and `sessionState` response metadata. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:664] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:882] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:899] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:970] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1085] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1375]

The trust boundary exists elsewhere: `memory_context` resolves session identity with `resolveTrustedSession`, and `memory_match_triggers` rejects untrusted `session_id` before touching working memory. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:1112] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:1511] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:223] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:228] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:235]

`resolveTrustedSession` requires the ID to be tracked, identity-bound, and tenant/user/agent-consistent. `memory_search` does not call it, and `normalizeScopeContext` only trims identifiers. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts:413] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts:429] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts:438] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts:448] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:216]

Impact: direct `memory_search` callers can use or poison an arbitrary session ID for retrieval state and get the current `sessionState` payload back. This is not as broad as F001 because result governance is not directly keyed by `sessionId`, but it violates the same server-managed session contract enforced by the adjacent public handlers.

Concrete fix: resolve caller-supplied `sessionId` through `sessionManager.resolveTrustedSession` before cache/session/retrieval-state use. Reject mismatches with `E_SESSION_SCOPE`, matching `memory_context` and `memory_match_triggers`.

Claim adjudication:

```json
{
  "findingId": "F002",
  "claim": "memory_search uses caller-supplied sessionId for session state without the trusted-session validation used by neighboring handlers.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:664",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1085",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1375",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:1112",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:228",
    ".opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts:413"
  ],
  "counterevidenceSought": "Checked normalizeScopeContext, pipeline candidate filtering, session-state manager behavior, memory_context, and memory_match_triggers.",
  "alternativeExplanation": "sessionId may have been intended only as a non-governance dedup key, but the handler returns and mutates retrieval session state and adjacent handlers now treat caller session IDs as a trust boundary.",
  "finalSeverity": "P1",
  "confidence": 0.84,
  "downgradeTrigger": "Downgrade if direct memory_search is proven private/internal-only or sessionState output is removed and arbitrary session IDs cannot observe or alter any cross-turn state."
}
```

## Files Reviewed
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts`
- `.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/governance/scope-governance.ts`

## Iteration Verdict
FAIL: one P0 and one P1 found.
Review verdict: FAIL
