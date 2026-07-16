# Iteration 002 - Security

## Focus
Scope enforcement in retrieval pagination and causal graph mutations.

## Actions
- Traced `memory_search` cursor creation and cursor resumption.
- Read progressive disclosure cursor encoding, decoding, scope checks, and chained continuation behavior.
- Read causal graph link/unlink handlers, input schemas, TypeScript args, and storage mutation calls.

## Findings

### F002 - P1 - Scoped progressive cursors drop scope on chained continuation
`memory_search` resolves cursors with a scope key and builds progressive responses with the same key. `createCursor` stores that key in the first cursor, and `resolveCursor` rejects mismatched scopes only when the decoded payload contains `scopeKey`. The next cursor created inside `resolveCursor` omits `payload.scopeKey`, so page two and later cursors are no longer bound to tenant/user/agent scope.

Evidence:
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:704`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1258`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:329`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:367`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:402`
- `.opencode/skills/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:504`

Fix:
Copy `payload.scopeKey` into `nextPayload`, and add a chained scoped-cursor test that resolves page two with both matching and mismatched scope.

Claim adjudication packet:
```json
{
  "findingId": "F002",
  "claim": "Chained progressive cursors lose scope enforcement after the first continuation.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:367",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:402"
  ],
  "counterevidenceSought": "Checked memory_search cursor resolve call and progressive-disclosure tests for chained scoped cursor coverage.",
  "alternativeExplanation": "The omission may be accidental because the in-memory cursor store is keyed by random UUID, but scope enforcement is explicitly present for the first cursor.",
  "finalSeverity": "P1",
  "confidence": 0.93,
  "downgradeTrigger": "Downgrade if continuation cursors are never returned after the first page in production or an outer dispatcher rejects unscoped continuation payloads."
}
```

### F003 - P1 - Causal graph link/unlink endpoints mutate raw IDs without governed scope checks
The public causal mutation schemas expose `sourceId`, `targetId`, and `edgeId`, but no tenant, user, or agent scope fields. The handler passes raw IDs to `insertEdge` and `deleteEdge`, and the storage layer deletes by edge ID alone. That bypasses the governed-scope pattern used by retrieval handlers and can create or remove graph edges for memories outside the caller's intended scope.

Evidence:
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:691`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:757`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:996`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:406`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:433`
- `.opencode/skills/system-spec-kit/mcp_server/tools/types.ts:306`
- `.opencode/skills/system-spec-kit/mcp_server/tools/types.ts:328`
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:743`

Fix:
Add scope fields to causal link/unlink schemas, verify source/target/edge ownership against `memory_index`, and fail closed when scoped rows do not match.

Claim adjudication packet:
```json
{
  "findingId": "F003",
  "claim": "Causal graph mutation tools can modify edges without governed scope validation.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:757",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:996",
    ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:406",
    ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:433"
  ],
  "counterevidenceSought": "Checked public schemas, TypeScript tool args, handler destructuring, and storage calls for tenant/user/agent scope fields.",
  "alternativeExplanation": "The MCP may be deployed as a single-user local process, reducing exploitability in that deployment mode.",
  "finalSeverity": "P1",
  "confidence": 0.86,
  "downgradeTrigger": "Downgrade if the server has a proven single-principal boundary before tool dispatch or causal mutations are disabled for governed stores."
}
```

## Coverage
- correctness: covered
- security: covered
- traceability: pending
- maintainability: pending

Review verdict: CONDITIONAL
