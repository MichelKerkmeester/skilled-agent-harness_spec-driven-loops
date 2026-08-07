# Iteration 002 - Security Pass

## Scope

Focused on caller-controlled session boundaries in `memory_search` and compared that path against the trusted-session handling already present in sibling handlers.

## Files Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/session-state.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`

## Findings

### F002 - P1 - `memory_search` accepts raw caller `sessionId` for dedup and retrieval state

Claim: `memory_search` uses a caller-supplied `sessionId` directly for session deduplication and retrieval state mutation, unlike `memory_context` and `memory_match_triggers`, which validate caller session IDs through the trusted session manager.

Evidence:

- [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`:646] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`:683] destructure `sessionId` directly from caller args.
- [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`:687] passes that raw `sessionId` into `normalizeScopeContext`.
- [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`:1283] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`:1297] use the raw ID for in-memory retrieval dedup when `sessionManager` is disabled.
- [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`:1301] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`:1334] use the raw ID with `applySessionDedup`.
- [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`:1375] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`:1391] mark returned IDs as seen and attach `sessionState` using the raw ID.
- [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts`:926] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts`:935] reserve sent hashes for whatever session string is passed to `filterSearchResults`.
- [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/session-state.ts`:92] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/session-state.ts`:118] create state for arbitrary session IDs.
- [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/session-state.ts`:127] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/session-state.ts`:149] mutate goal and seen-result state for arbitrary session IDs.
- [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts`:1111] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts`:1126] show the sibling trusted-session rejection path.
- [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts`:223] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts`:245] show the same guard in trigger matching.

Impact: a caller who knows or guesses another session ID can affect that session's dedup and seen-result state, suppressing future search results or reading session state metadata. This is a session-scope authorization bug in the lower-level retrieval tool.

Concrete fix: resolve `memory_search.sessionId` through `sessionManager.resolveTrustedSession` before any scope normalization, cache key construction, dedup, or retrieval-state mutation. Reject untrusted IDs with `E_SESSION_SCOPE`, matching `memory_context` and `memory_match_triggers`. Add regression tests for untrusted IDs and for accepted server-minted IDs.

Claim adjudication:

- Counterevidence sought: whether `memory_search` is private-only and never directly callable through MCP.
- Counterevidence found: `tool-schemas.ts` defines `memory_search` as an exposed L2 tool, and `tools/causal-tools.ts` style dispatch validation is not enough to provide session ownership.
- Alternative explanation: raw session IDs may be legacy client-provided handles. That still conflicts with the newer trusted-session guard used by sibling handlers.
- Final severity: P1.
- Confidence: high.
- Downgrade trigger: downgrade only if `memory_search` is removed from public MCP exposure or session dedup/state is disabled for caller-provided IDs.

## Traceability Check

- `spec_code`: covered against the security dimension in [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/002-mcp-retrieval-causal/spec.md`:36] to [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/002-mcp-retrieval-causal/spec.md`:40].
- `playbook_capability`: covered by comparing public tool schema behavior with handler session-boundary behavior.

## Reducer Delta

- New findings: F002.
- Dimensions covered: security.
- Severity delta: P1 +1.
- New findings ratio: 0.33.

Review verdict: CONDITIONAL
