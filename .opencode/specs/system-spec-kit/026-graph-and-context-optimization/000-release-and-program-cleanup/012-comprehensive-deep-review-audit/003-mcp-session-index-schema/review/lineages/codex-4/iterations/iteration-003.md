# Iteration 003 - Maintainability and Cohesion

## Focus

Maintainability review of schema ownership, handler/job propagation boundaries, test coverage shape, and operator documentation drift.

## Files Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-ingest.vitest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts`
- Previously reviewed handler/schema/docs files from iterations 001-002.

## Findings

No new P0/P1/P2 findings.

## Repeated Findings

- `C4-P1-001` remains active. The maintenance risk is that governance data has to cross several handoffs: public schema, runtime schema, `memory-index.ts`, `memory-ingest.ts`, the job queue, and `context-server.ts` worker registration.
- `C4-P2-002` remains active. Public schemas and runtime schemas are independently maintained, so parity can drift without a targeted comparison test.
- `C4-P2-003` remains active. Operator docs can still preserve old call shapes after runtime schemas move.

## Evidence Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:37` defines `expectPublicAndRuntimeAccept()`, which is a useful local pattern for public/runtime parity checks.
- `.opencode/skills/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:59` through line 87 validate public schema shape and uniqueness, but do not assert that every runtime-accepted argument is publicly advertised.
- `.opencode/skills/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:48` through line 99 cover runtime path validation for `memory_ingest_start`.
- `.opencode/skills/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:121` through line 130 check public path constraints for `memory_ingest_start`.
- `.opencode/skills/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:28` maps `memory_index_scan` to its handler, but the async ingest tools are not part of that dispatch mapping table.
- `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-ingest.vitest.ts:100` through line 106 assert that ingest jobs are created and enqueued, but the mocked job payload contains only paths/specFolder and no governance metadata.
- `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:794` through line 850 prove the lower-level scan wrapper can carry tenant/session scope when the caller supplies it.

## Assessment

The codebase has useful test seams for the needed fixes. The issue is not a broad maintainability failure; it is a missing contract across already-separated layers. A tight remediation can reuse the current schema tests and handler tests rather than introducing a new abstraction-heavy framework.

Recommended verification after remediation:

- Add public/runtime parity cases for `memory_index_scan` and `memory_ingest_start` governance fields.
- Add `memory_index_scan` handler coverage that passes governance fields and asserts `indexSingleFile()` / `indexMemoryFileFromScan()` receives the normalized scope.
- Add `memory_ingest_start` coverage that persists normalized governance on the job and worker coverage that forwards it to `indexSingleFile()`.
- Add a docs drift check or snapshot for MCP tool examples that mention `session_bootstrap` and `memory_ingest_start`.

Review verdict: CONDITIONAL
