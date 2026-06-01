---
title: "Retire the embedding sidecar execution path"
description: "The dead hf-local sidecar execution path was removed and the embedding execution router was collapsed to a single direct factory-backed adapter for all providers."
trigger_phrases:
  - "sidecar retirement and router collapse"
  - "SPECKIT_EMBEDDER_EXECUTION no-op shim"
  - "SidecarClient removal"
  - "embedding execution router simplification"
  - "hf-local direct adapter path"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/005-retire-sidecar` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server`

### Summary

The dead sidecar execution path was removed. After hf-local became an HTTP client (phase 003) supervised by the launcher (004), the in-process sidecar apparatus was redundant lifecycle machinery. The execution router was collapsed so every provider (ollama, hf-local, and the cloud cascade of voyage and OpenAI) resolves through one direct factory-backed adapter path. SPECKIT_EMBEDDER_EXECUTION is now an accepted-but-ignored one-release no-op so existing operator configs do not break.

### Added
- None.

### Changed
- The embedding execution router was collapsed to a single direct factory-backed adapter path for all providers including ollama, hf-local, and the cloud cascade.
- SPECKIT_EMBEDDER_EXECUTION is now an accepted-but-ignored no-op that logs once without changing routing behavior.
- Sidecar worker lifecycle snapshots were removed from the health endpoint payload.

### Fixed
- None.

### Verification
- npm run build (@spec-kit/shared and @spec-kit/mcp-server tsc) passed with no dangling imports from deleted files.
- Repository grep confirmed zero live references to SidecarClient, shouldUseSidecar, getSidecarWorkerSnapshot, recycleActiveSidecars, or SIDECAR_LOCAL_PROVIDERS.
- vitest run across embeddings, embedder, execution-router, embedders, and health test suites passed (10 files, 87 passed, 8 skipped).
- A 3-lens adversarial review (ollama and cloud non-regression, clean removal plus no-op shim, test scope) confirmed zero defects and two stale-doc residuals were cleaned.
- Packet validation via validate.sh --strict passed.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/lib/embedders/execution-router.ts` | Modified | Collapsed to remove the sidecar policy, client map, snapshot, and recycle surface plus the SidecarClient branch |
| `mcp_server/lib/embedders/execution-router.testables.ts` | Modified | Removed sidecar testable exports, kept non-sidecar ones |
| `mcp_server/lib/embedders/sidecar-client.ts` | Deleted | Obsolete sidecar client |
| `mcp_server/lib/embedders/sidecar-worker.ts` | Deleted | Obsolete sidecar worker |
| `mcp_server/lib/embedders/sidecar-client.testables.ts` | Deleted | Obsolete sidecar testables |
| `mcp_server/handlers/memory-crud-health.ts` | Modified | Dropped the dangling getSidecarWorkerSnapshot import and sidecar_workers health field |
| `mcp_server/tests/embedder-sidecar.vitest.ts` | Deleted | Sidecar-specific test file |
| `mcp_server/tests/embedders/sidecar-hardening.vitest.ts` | Deleted | Sidecar-specific test file |
| `mcp_server/tests/embedders/sidecar-worker.vitest.ts` | Deleted | Sidecar-specific test file |
| `mcp_server/tests/embedder-provider-dispose.vitest.ts` | Deleted | In-process dispose tests obsolete, surviving case moved to execution-router.vitest.ts |
| `mcp_server/tests/embedders/execution-router.vitest.ts` | Modified | Dropped sidecar-branch assertions, added SPECKIT_EMBEDDER_EXECUTION no-op assertion |
| `mcp_server/tests/stdio-logging-safety.vitest.ts` | Modified | Removed deleted-file exclusion entries |
| `mcp_server/lib/embedders/README.md` | Modified | Dropped deleted-file rows and described the single direct factory-backed path |
| `mcp_server/tests/embedders/README.md` | Modified | Dropped deleted-file rows and described the single direct factory-backed path |

### Follow-Ups
- SPECKIT_EMBEDDER_EXECUTION is still parsed as an accepted-but-ignored no-op for one release and the environment variable should be removed entirely in a follow-up.
- The collapsed router path is covered by focused vitest with mock transports but has not been exercised end-to-end through a live daemon and model server.
- The sentence-transformers backend description in types.ts mentions a Python sidecar concept (an unimplemented backend kind) which is unrelated to the deleted hf-local sidecar files and was left unchanged.
