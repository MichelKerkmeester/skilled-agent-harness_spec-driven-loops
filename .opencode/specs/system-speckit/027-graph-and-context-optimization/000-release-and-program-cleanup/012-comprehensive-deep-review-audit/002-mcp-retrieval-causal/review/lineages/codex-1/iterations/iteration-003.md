# Iteration 003 - Security Follow-Up and Traceability

## Focus

Security follow-up on session trust boundaries, plus traceability drift between advertised tool schemas and runtime behavior.

## Files Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tools/causal-tools.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/relation-backfill-conflict.vitest.ts`

## Findings

### F004 - P1 - `memory_search` accepts caller-supplied `sessionId` without the trusted-session gate

`memory_search` destructures `sessionId` directly from caller arguments [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:664]. It then uses that value for the retrieval trace [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:882], passes it into the main pipeline config [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:970], updates retrieval session state under it [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1085], and later applies session-state deduplication under the same value [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1375].

The neighboring handlers enforce the intended trust boundary. `memory_context` calls `sessionManager.resolveTrustedSession(args.sessionId ?? null, ...)` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:1112], and `memory_match_triggers` rejects untrusted caller session IDs before touching working memory [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:223] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:228] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:233]. The session manager rejects IDs that are not server-tracked or not identity-bound [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts:429] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts:438].

The result is an IDOR-style session-state channel in `memory_search`: a caller who guesses or reuses another session ID can affect or observe dedup/goal/anchor behavior for that session while equivalent context and trigger paths would reject the same ID.

Claim adjudication:

```json
{
  "findingId": "F004",
  "claim": "memory_search threads caller-supplied sessionId into trace, pipeline, goal/anchor state, and dedup without validating it through resolveTrustedSession.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:664",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:882",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:970",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1085",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1375",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:1112",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:223",
    ".opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts:429"
  ],
  "counterevidenceSought": "Searched memory-search for resolveTrustedSession and inspected every direct sessionManager use; only filtering/marking paths were present, not trust resolution.",
  "alternativeExplanation": "The older sessionManager.isEnabled dedup path may have been intended to protect state, but it accepts the same caller sessionId and does not replace resolveTrustedSession's tracked-session and identity checks.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade if all public memory_search callers are proven to wrap the handler with resolveTrustedSession before invocation, or if session retrieval state is permanently disabled in supported deployments."
}
```

### F005 - P1 - `memory_causal_stats.backfill` is accepted at runtime but absent from the public MCP schema

The runtime handler reads `args?.backfill` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:803] and runs relation-inference backfill when it is present [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:825] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:827]. Runtime validation explicitly accepts the nested `backfill` object and its opt-in collectors [SOURCE: .opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:414] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:420] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:427], and the allowed-parameter registry lists `memory_causal_stats: ['backfill']` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:592]. The causal dispatcher validates and forwards those args to `handleMemoryCausalStats` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tools/causal-tools.ts:36]. Tests confirm a valid backfill payload passes validation [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/relation-backfill-conflict.vitest.ts:209].

The public MCP tool list comes from `TOOL_DEFINITIONS` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/context-server.ts:1029], but `memory_causal_stats` still advertises an empty input schema [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:454] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:457]. Clients generated from `ListTools` cannot discover or validate the live backfill contract, and a schema-driven client may reject the very option the handler and tests now support.

Claim adjudication:

```json
{
  "findingId": "F005",
  "claim": "memory_causal_stats has a live backfill argument in handler validation and tests, but ListTools still advertises an empty input schema.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:803",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:825",
    ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:414",
    ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:592",
    ".opencode/skills/system-spec-kit/mcp_server/tools/causal-tools.ts:36",
    ".opencode/skills/system-spec-kit/mcp_server/context-server.ts:1029",
    ".opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:454",
    ".opencode/skills/system-spec-kit/mcp_server/tests/relation-backfill-conflict.vitest.ts:209"
  ],
  "counterevidenceSought": "Checked runtime handler, strict validation schema, dispatcher, public ListTools source, public tool definition, and a validation test for the backfill payload.",
  "alternativeExplanation": "The backfill may be intentionally hidden as an internal escape hatch, but it is exposed through public call validation and handler behavior rather than a private-only path.",
  "finalSeverity": "P1",
  "confidence": 0.84,
  "downgradeTrigger": "Downgrade if backfill is documented as intentionally private and public MCP clients are required to ignore ListTools schemas for this server."
}
```

## Traceability Checks

- `spec_code`: covered. The target spec names retrieval and causal files; this pass tied public schema drift and session-boundary behavior back to those scoped handlers.
- `checklist_evidence`: not applicable. The target packet is Level 1 and has no `checklist.md`.
- `feature_catalog_code`: partially covered. Handler feature comments advertise causal stats/backfill behavior, but the public tool schema does not expose the matching argument.
- `playbook_capability`: partially covered. The MCP schema contract is the operative capability surface for tool callers.

## Verdict Rationale

This pass added two P1 findings. Neither supersedes the P0 from iteration 002, but both affect public contract safety: session ID trust in search and tool-schema discoverability for causal backfill.

Review verdict: FAIL
