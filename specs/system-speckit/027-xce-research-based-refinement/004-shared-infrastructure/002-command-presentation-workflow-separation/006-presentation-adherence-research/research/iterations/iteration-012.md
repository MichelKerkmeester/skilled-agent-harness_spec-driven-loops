# Iteration 012 (wave 2, gpt-5.5-fast xhigh) — Tool-returns-the-envelope (additive data.presentation)

**Verdict:** Yes: move the MEMORY:SEARCH and MEMORY:STATS rendering into tool-side deterministic code, but attach it additively as data.presentation.text and teach CLI text mode to print it. Replacing the current JSON MCP envelope would be a breaking change; additive rendering is low-to-medium migration cost and targets the mechanical failure directly.

## [MECHANISM] Attach rendered search text inside data
- Evidence: .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:1117 - const responseData: Record<string, unknown> = {
- Detail: memory_search currently returns structured JSON fields: searchType, count, constitutionalCount, results, quality/recovery/citation policy, and extra metadata, then wraps it with createMCPSuccessResponse at line 1145. There is no MEMORY:SEARCH render string today; the command prompt asks the model to transform data.results into that display.
- Recommendation: Add a pure renderer in the search formatter and attach data.presentation = { format: "memory_search.v1", text: "MEMORY:SEARCH ..." } after responseData is assembled, preserving data.results unchanged.

## [MECHANISM] Renderer must cover weak and empty paths
- Evidence: .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:790 - if (!results || results.length === 0) {
- Detail: The empty path returns a JSON envelope with recovery, citationPolicy, responsePolicy, and hints rather than a display block. This is the empirically weakest model path, so only rendering normal results would leave the failure mode unsolved.
- Recommendation: Render both Section 2 and Section 3 of search_presentation.txt in code: count > 0 groups rows; count = 0 emits the exact empty-result block plus any trigger/constitutional rows only when available.

## [NEW-FEATURE] memory_stats has all stats inputs but no dashboard
- Evidence: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:303 - return createMCPSuccessResponse({
- Detail: memory_stats returns totalMemories, byStatus, topFolders, totalSpecFolders, tierBreakdown, databaseSizeBytes, and lastIndexedAt in data at lines 306-321. The manage presentation asset expects a MEMORY:STATS dashboard, so the model currently performs field mapping and formatting.
- Recommendation: Add renderMemoryStatsPresentation(data) in handleMemoryStats and attach data.presentation.text with formatted bytes/date, tier rows, top folders, and STATUS=OK ACTION=stats.

## [CONSTRAINT] Do not replace MCP JSON content
- Evidence: .opencode/skills/system-spec-kit/mcp_server/context-server.ts:1248 - const envelope = JSON.parse(result.content[0].text) as Record<string, unknown>;
- Detail: Server middleware parses content[0].text as JSON to inject token budgets, session priming, graph context, passive enrichment, and truncation. memory_context also assumes nested JSON with data.results for budget enforcement, so raw text in content[0].text would break real consumers.
- Recommendation: Keep content[0].text as JSON and make the rendered envelope additive. If a raw text mode is needed, implement it in CLI/text rendering or as an explicit new render-only tool, not as the default MCP response.

## [CONSTRAINT] Consumers depend on structured fields, not prose
- Evidence: .opencode/skills/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:991 - expect(parsed?.data?.totalMemories).toBe(5);
- Detail: Tests and runtime consumers assert data.results, data.topFolders, totalMemories, byStatus, and related structured fields. I found no dependency on a command-visible free-form result shape; the only free-form fallback is CLI text summary output.
- Recommendation: Preserve all existing fields and tests. Add presentation fields with regression tests proving old JSON consumers still pass and new command render text is exact.

## [REFINEMENT] CLI can render deterministically with low cost
- Evidence: .opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts:665 - function renderPayload(payload: unknown, format: OutputFormat): string {
- Detail: The CLI already parses tool JSON and for text output returns summary/error/message before falling back to JSON. A small change can make --format text prefer data.presentation.text, giving a deterministic no-model render path for search and stats.
- Recommendation: Add extractPresentationText(payload) before the summary fallback in renderPayload; update CLI tests for memory_search and memory_stats text mode.

## [CONSTRAINT] Optional rendering must enter schema and cache key
- Evidence: .opencode/skills/system-spec-kit/mcp_server/lib/search/search-utils.ts:184 - return {
- Detail: memory_search cache keys include query, filters, includeTrace, cacheVersion, and other retrieval knobs, but no presentation/render mode. If rendered presentation is opt-in, cached command and non-command responses could otherwise cross-contaminate.
- Recommendation: If using an opt-in argument such as presentationFormat: "command", add it to SearchArgs, Zod/tool schemas, CacheArgsInput, buildCacheArgs, and command calls. If always attached, no cache-key change is needed but token cost rises.
