# Iteration 001 - Correctness

## Focus

Correctness pass over session handling and causal edge creation.

## Files Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/session-state.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`

## Findings

### F001 - P1 - `memory_context` collapses all no-session callers onto one process-scoped session

`sessionManager.resolveTrustedSession(null)` mints a fresh UUID for missing caller sessions [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts:421]. `memory_context` discards that minted ID when `requestedSessionId` is null and instead uses `SPECKIT_MEMORY_SESSION_ID` or the deterministic process hash [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:1128]. It then passes that same `effectiveSessionId` into strategy options [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:1561] and persists session state under it [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:1634].

That means unrelated callers who omit `sessionId` share dedup/working-memory state for the process lifetime. The downstream retrieval state is keyed only by `sessionId` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/session-state.ts:272], and `memory_search` filters/marks results by that same ID [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1300]. The visible failure mode is result suppression or seen-result deprioritization leaking across independent calls, contrary to the server-manager contract that no-session calls should start a server-generated session.

Claim adjudication:

```json
{
  "findingId": "F001",
  "claim": "No-session memory_context calls reuse a deterministic process-scoped session instead of the fresh server-generated session ID, allowing retrieval session state to bleed across independent callers.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts:421",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:1128",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:1561",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1300",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/session-state.ts:272"
  ],
  "counterevidenceSought": "Checked session-manager trust resolution, memory_context lifecycle resolution, strategy option propagation, memory_search dedup, and session-state keying.",
  "alternativeExplanation": "The process-scoped ID may have been intended as an ephemeral fallback, but the presence of a minted UUID from resolveTrustedSession and tests naming it ephemeral UUID indicate the safer contract is per-call session minting.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade if session retrieval state and session dedup are disabled by default in all supported deployments or if a caller/session isolation layer wraps every no-session MCP call before this handler runs."
}
```

### F002 - P1 - explicit causal links can create orphan edges

`handleMemoryCausalLink` validates only presence and relation type, then calls `causalEdges.insertEdge(String(sourceId), String(targetId), ...)` directly [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:745] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:756]. The storage layer explicitly defers foreign-key validation [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:279] and inserts the supplied source/target IDs into `causal_edges` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:344].

That lets a caller create graph edges to nonexistent spec-doc records. The same handler family later has to detect orphans in stats, but the mutation path still returns success for an invalid lineage edge. This corrupts the read path: `memory_drift_why` can report relationships whose endpoints cannot be resolved into memory details.

Claim adjudication:

```json
{
  "findingId": "F002",
  "claim": "memory_causal_link can insert causal edges whose source or target memory does not exist.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:745",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:756",
    ".opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:279",
    ".opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:344"
  ],
  "counterevidenceSought": "Checked causal-graph handler validation and causal-edges insert path for existence checks or foreign-key enforcement before insertion.",
  "alternativeExplanation": "Tests may rely on synthetic IDs, as the storage comment says, but production handler code still exposes this path to tool callers without a production-only existence check.",
  "finalSeverity": "P1",
  "confidence": 0.86,
  "downgradeTrigger": "Downgrade if the public dispatcher rejects non-existing IDs before handleMemoryCausalLink is reached or if causal_edges has enforced SQLite foreign keys in the production schema."
}
```

## Verdict Rationale

No P0 was found in this correctness pass, but two P1 correctness issues affect retrieval isolation and causal graph integrity.

Review verdict: CONDITIONAL
