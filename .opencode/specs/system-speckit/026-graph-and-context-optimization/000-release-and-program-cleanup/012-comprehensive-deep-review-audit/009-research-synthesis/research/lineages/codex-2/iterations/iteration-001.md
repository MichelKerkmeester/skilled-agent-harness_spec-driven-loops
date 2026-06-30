# Iteration 001 - Doc/Schema Drift

## Focus

Find the common root cause behind doc/schema-to-code drift, using concrete examples rather than aggregating review labels.

## Findings

1. The public install guide documents `memory_embedding_reconcile()` as controlled by `dryRun: false`, but the live public schema exposes `mode: "dry-run" | "apply"` instead. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:737`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:338`]

2. The runtime schema agrees with `mode`, not `dryRun`, and the implementation derives apply mode from `args.mode === "apply"`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:306`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:294`]

3. `activeOnly` is exposed in the public and runtime schemas, but the reconcile implementation reads `mode`, `resetMissing`, `requireActiveShard`, and `repairSuccessCoverage`; it does not consume `activeOnly`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:343`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:299`]

4. Governed bulk metadata drift is a second version of the same problem. Runtime validation allows governance fields for `memory_index_scan` and `memory_ingest_start`, while public tool schemas hide them. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:596`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:520`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:531`]

5. The handlers validate governed ingest, then drop the normalized governance context before indexing. `memory_index_scan` calls `indexSingleFile` with scan/embedding options only, and async ingest stores job id, paths, and specFolder only. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:330`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:721`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:146`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:253`]

## Sources Consulted

- `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md`
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts`

## Assessment

Root cause: contracts are split across human docs, public MCP tool definitions, runtime validation schemas, handlers, and downstream helpers without a single enforced source of truth. The governance example is more serious than stale docs because it validates metadata at the boundary and then silently loses it before persistence.

## Reflection

This is not merely documentation drift. It is contract drift across the API surface and implementation pipeline.

## Recommended Next Focus

Determine whether metadata drift follows the same pattern across spec control artifacts.
