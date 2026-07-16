# Iteration 011 (wave 2, gpt-5.5-fast xhigh) — Hooks-layer enforcement seam

**Verdict:** The true mechanical solution is not more prompt prose: render the `MEMORY:SEARCH` block in code from the normalized search envelope, then expose it as a last-mile tool output for the model to copy. Best path is JSON-safe renderer in memory_search plus OpenCode `tool.execute.after` pass-through/rewrite; final assistant post-processing is currently unproven and riskier.

## [MECHANISM] Pre-model MCP rewrite seam exists
- Evidence: .opencode/skills/system-spec-kit/mcp_server/context-server.ts:1318 result.content[0].text = serializeEnvelopeWithTokenCount(envelope);
- Detail: The MCP server already mutates tool results after dispatch and before returning them to the client. This is a deterministic pre-model seam, but it currently assumes JSON envelopes for hint injection, token-budget enforcement, and graph/session metadata.
- Recommendation: Add a memory-search presentation renderer at this seam only as JSON metadata, or run it immediately before final serialization after all existing envelope augmentation.

## [MECHANISM] Search formatter has canonical rows
- Evidence: .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:1117 const responseData: Record<string, unknown> = {
- Detail: formatSearchResults is the cleanest internal assembly point because it owns normalized result rows, counts, constitutional counts, recovery policy, and already receives the original query. It can deterministically group by leaf folder and format scores without asking the model.
- Recommendation: Implement `renderMemorySearchPresentation({query,intent,count,results,recovery})` in/near `formatters/search-results.ts` and attach `data.presentation.memorySearchText` on both success and empty responses.

## [CONSTRAINT] Do not replace JSON too early
- Evidence: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1435 const cachePayload = extractSearchCachePayload(formatted);
- Detail: The memory_search handler still parses the JSON envelope after formatting for caching, publication gates, dedup, telemetry, session state, and feedback logging. Returning bare `MEMORY:SEARCH` text from formatSearchResults would break or bypass those mechanics.
- Recommendation: Keep the MCP response JSON-shaped internally; if bare text is required, do it as a last-mile OpenCode tool-output rewrite after handler/context-server processing.

## [NEW-FEATURE] Tool-output hook can be last-mile enforcement
- Evidence: .opencode/skills/system-spec-kit/mcp_server/tests/opencode-plugins-folder-purity.vitest.ts:25 'tool.execute.after',
- Detail: The repo recognizes `tool.execute.after` as a valid OpenCode plugin hook, and archived plugin docs describe tool-output pruning before output enters conversation. That is the right mechanical place to replace a memory_search tool transcript with an exact `MEMORY:SEARCH` block without destabilizing MCP internals.
- Recommendation: Prototype in `.opencode/plugins/mk-spec-memory.js`: on `tool.execute.after`, detect memory search/context tool names, parse output JSON, prefer `data.presentation.memorySearchText`, and set `hookOutput.output` to that exact text; fail open on parse errors.

## [CONSTRAINT] No active final-reply postprocessor
- Evidence: .opencode/skills/system-spec-kit/mcp_server/hooks/README.md:49 │ index.ts exports   │ ───▶ │ MCP envelope hints │
- Detail: The inspected MCP hooks layer is for startup/prompt context, mutation feedback, and MCP envelope hints, not assistant final-answer rewriting. A final reply validator may be possible through OpenCode's `experimental.text.complete`, but this repo shows it only as a recognized hook key, not an implemented path.
- Recommendation: Do not depend on post-processing the model reply for the fix; prefer pre-model tool-output rendering unless a separate spike proves `experimental.text.complete` can rewrite final assistant text safely.

## [REFINEMENT] memory_context wrapping must be handled
- Evidence: .opencode/commands/memory/search.md:49 Prefer `memory_context({ input: query, mode: "auto", intent, includeContent: true, enableDedup: true })`.
- Detail: /memory:search currently prefers memory_context, which wraps memory_search output instead of exposing top-level `data.results`. A memory_search-only rendered field may be buried in nested `data.content[0].text` and still require model interpretation.
- Recommendation: Either make retrieval mode call `memory_search` directly with a render/profile flag, or teach memory_context to hoist nested `data.presentation.memorySearchText` to top-level `data.presentation.memorySearchText`.
