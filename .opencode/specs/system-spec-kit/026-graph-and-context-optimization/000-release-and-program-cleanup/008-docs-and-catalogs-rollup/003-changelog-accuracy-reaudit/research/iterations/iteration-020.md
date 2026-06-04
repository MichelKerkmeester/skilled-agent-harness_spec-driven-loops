# Deep Research Iteration 020

> Audited changelog: `changelog-017-005-fix-investigation-p2s-for-deadcode-drift-comment-cleanup-sweep.md`
> Executor: cli-opencode openai/gpt-5.5-fast (high) --pure | exit=0 | 2026-06-04T15:02:54.000Z

## Finding

VERDICT: MAJOR-DRIFT
DRIFT: Changelog spec folder exists and Level 2 matches, but Summary/Changed and packet docs claim changed/shipped files that are absent: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts`, `.opencode/bin/lib/ensure-rerank-sidecar.cjs`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts`; changelog Files Changed omits those docs-claimed files; `implementation-summary.md` points docs to nonexistent `.opencode/specs/.../013-embedder-testing-and-architecture/...`; verification's 4-files/40-tests and CJS paths are not corroborated by current checkout.
NOTE: The four files listed in the changelog Files Changed table (`reindex.ts`, `execution-router.ts`, `index.ts`, `schema.ts`) exist, but broader claims do not match packet docs and shipped files.
