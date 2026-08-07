# Iteration 10 — maintainability — tests-and-gaps

**Dispatch:** gpt-5.5-fast high (cli-opencode), real verdict returned (dispatchOk=true).

**Verdict:** FAIL

## Findings

- **[P1] Force and dryRun acceptance tests can now pass without making any assertion**
  - File: `.opencode/skills/system-spec-kit/mcp_server/tests/integration-save-pipeline.vitest.ts` (line 75)
  - Evidence: `try { await saveHandler.handleMemorySave({ filePath: fakePath, force: true }); } catch (error: unknown) { expect(getErrorMessage(error)).not.toMatch(/force/); }` performs no assertion when `handleMemorySave` returns the new structured error response instead of throwing. Same stale pattern repeated for `dryRun` at lines 85-93. (Verified: catch-block-only assertion; on the new structured-error path the catch never fires, so the test silently passes with zero assertions.)
  - Recommendation: Update both tests to assert the returned structured response directly — e.g. `isError === true`, `data.code === 'E089'`, and that the returned error text does not blame `force`/`dryRun`.

- **[P1] Default async enrichment is only flag-tested, not behavior-tested through the save path**
  - File: `.opencode/skills/system-spec-kit/mcp_server/tests/search-flags.vitest.ts` (line 267)
  - Evidence: `it('post-insert enrichment runs async by default; SYNC=true forces synchronous', () => { expect(isPostInsertEnrichmentAsync()).toBe(true); ... })` verifies only the helper. The ordering regression in `memory-save-dedup-order.vitest.ts` line 60 explicitly guards the synchronous branch, leaving the default async save behavior unexercised end-to-end.
  - Recommendation: Add a handler-level test that runs `indexMemoryFile` with default env, asserts the deferred async enrichment status in the response, verifies background enrichment is scheduled and records completion, and adds a `SPECKIT_POST_INSERT_ENRICHMENT_SYNC=true` counterpart proving synchronous inline recording still works.

- **[P1] Observed enrichment backfill failures are not covered by a failure-mode regression**
  - File: `.opencode/skills/system-spec-kit/mcp_server/tests/enrichment-state.vitest.ts` (line 196)
  - Evidence: The backfill test only covers the success path: `const result = await repairIncompleteMarkers({ database: db }, { limit: 10 }); expect(result).toEqual({ scanned: 1, repaired: 1, failed: 0 });`. No test forces `repairEnrichmentOnReplay` to fail and asserts the `failed` count/status semantics, despite the known ~17% backfill enrichment failures.
  - Recommendation: Add a regression that inserts pending/partial/failed rows with unparseable or failing enrichment input, makes `runPostInsertEnrichmentIfEnabled` reject, and asserts `repairIncompleteMarkers` reports `failed > 0`, preserves diagnosable marker state, and does not spin indefinitely on repeated passes.

- **[P2] 37-tool tests do not catch public package metadata still advertising 36 tools**
  - File: `.opencode/skills/system-spec-kit/mcp_server/package.json` (line 4)
  - Evidence: `"description": "Semantic Memory MCP Server - provides 36 tools ..."` still advertises 36 tools, while `context-server.vitest.ts` line 162 now describes `Group 2: Tool Definitions (37 tools)` and asserts the schema list length. (Verified: package.json line 4 still reads "provides 36 tools".)
  - Recommendation: Update the package metadata to 37 tools, or add a small metadata drift test if this description is treated as user-facing contract documentation.
