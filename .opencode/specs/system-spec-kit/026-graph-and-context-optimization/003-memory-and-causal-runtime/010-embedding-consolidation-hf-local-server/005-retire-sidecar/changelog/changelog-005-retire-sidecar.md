# Changelog — 005: Retire the embedding sidecar execution path

**Shipped**: 2026-05-29
**Commit**: 4b2c5de6a3

## What Changed
- Deleted hf-local sidecar apparatus: sidecar-client.ts, sidecar-worker.ts, sidecar-client.testables.ts
- Modified `mcp_server/lib/embedders/execution-router.ts` to collapse to single direct factory-backed adapter path for all providers
- Removed sidecar policy surface: SIDECAR_LOCAL_PROVIDERS, shouldUseSidecar, sidecar client map, getSidecarWorkerSnapshot, shutdownAllSidecars, recycleActiveSidecars, resolveExecutionPolicy, and SidecarClient branch
- SPECKIT_EMBEDDER_EXECUTION retained as accepted-but-ignored one-release no-op (logged once, no throw, no routing change)
- Deleted sidecar-specific test files: embedder-sidecar.vitest.ts, sidecar-hardening.vitest.ts, sidecar-worker.vitest.ts, embedder-provider-dispose.vitest.ts
- Modified `mcp_server/handlers/memory-crud-health.ts` to remove dangling getSidecarWorkerSnapshot import and sidecar_workers health field/payload
- Updated execution-router.vitest.ts to drop sidecar-branch assertions and add SPECKIT_EMBEDDER_EXECUTION no-op assertion
- Updated README files to describe single direct factory-backed path

## Why
Once hf-local is a client for a launcher-supervised model server, the sidecar branch becomes redundant lifecycle machinery. Keeping it would preserve duplicate env allowlists, snapshots, recycle paths, worker tests, and policy branches that no longer own native model memory.

## Verification
- `npm run build` (@spec-kit/shared + @spec-kit/mcp-server tsc): PASS (both; no dangling imports from deleted files)
- `rg "SidecarClient|shouldUseSidecar|getSidecarWorkerSnapshot|recycleActiveSidecars|SIDECAR_LOCAL_PROVIDERS" lib tests`: No live code references
- `vitest run` embeddings + embedder-* + execution-router + embedders/* + health: PASS (10 files; 87 passed / 8 skipped)
- 3-lens opus adversarial review (ollama/cloud non-regression, clean removal + no-op shim, test scope): PASS — 0 confirmed defects; 2 P2 stale-doc residuals cleaned
- `validate.sh --strict` on this packet: PASS
