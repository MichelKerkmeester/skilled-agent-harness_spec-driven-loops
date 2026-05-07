# Iteration 002 - Security

## Scope Read

- `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts`

## Checks

- Reviewed provider resolution at `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:213`.
- Reviewed cross-encoder feature flag behavior at `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:98`.
- Reviewed outbound request construction for Voyage, Cohere, and local rerankers at `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:284`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:326`, and `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:366`.

## Findings

No new P0/P1/P2 security findings in this iteration. The code sends query/document text to configured reranker providers, but that behavior is already gated by provider environment and the cross-encoder feature flag, and is outside the length-penalty removal itself.

## Verification

- Scoped vitest command: PASS.

