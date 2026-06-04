# Iteration 001 - Correctness and Security

## Focus

Correctness and security review of the scoped session, index, ingest, embedder, and dispatch surfaces.

## Files Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/session-resume.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/session-health.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/session-learning.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-alias.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-list.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-set.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- Supporting modules followed for evidence: `handlers/memory-save.ts`, `lib/ops/job-queue.ts`, `lib/governance/scope-governance.ts`, `tools/lifecycle-tools.ts`

## Findings

### P1 - Governed metadata is accepted on bulk ingest surfaces but dropped before indexing

The runtime schema accepts governed ingest metadata for `memory_index_scan` and `memory_ingest_start`, and both handlers call `validateGovernedIngest(args)`, so callers can reasonably expect tenant/session/provenance/retention metadata to apply to the rows created by these bulk paths. The actual indexing calls never receive that metadata.

Evidence:

- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:455` defines `memoryIndexScanSchema`, and lines 461-462 spread `governanceSchemaFields` into the accepted runtime arguments.
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:472` defines `memoryIngestStartSchema`, and lines 474-476 also spread `governanceSchemaFields`.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:330` validates governed ingest, but `indexSingleFile()` is called with only force/quality/fromScan/async flags at lines 721-725. The wrapper at lines 278-292 forwards no scope, provenance, or retention options.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:146` validates governed ingest, but `createIngestJob()` only receives `id`, `paths`, and `specFolder` at lines 262-267.
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:253` defines `createIngestJob()` with only `id`, `paths`, and `specFolder`; lines 268-281 persist only those fields.
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:619` pulls only a file path from the job, and line 627 calls `processFileFn(nextPath)` with no job metadata.
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2074` initializes the ingest worker, and lines 2075-2077 index each file via `indexSingleFile(filePath, false)`.
- The single-file path shows what correct propagation looks like: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3196` builds `saveScope`, lines 3391-3400 pass it into `indexMemoryFile()`, and lines 3431-3437 apply governance metadata after insert.

Impact:

Bulk scan or async ingest requests that include tenant/session/provenance/retention metadata can create unscoped or incorrectly retained memory rows. In a governed retrieval setup, this risks cross-tenant visibility and audit/retention drift while still giving the caller a validation-success path.

Fix:

Thread a normalized governance payload through both bulk paths. For `memory_index_scan`, pass at least the normalized scope into `indexSingleFile()` and apply retention/provenance metadata consistently with `memory_save`. For `memory_ingest_start`, persist the normalized governance payload on the job row and change `processFileFn` to receive `{ filePath, governance }`. If these fields are not meant to be supported on bulk tools, remove them from `memoryIndexScanSchema`, `memoryIngestStartSchema`, and `ALLOWED_PARAMETERS` instead of accepting and ignoring them.

## Non-Findings

- `session_bootstrap` expects full `session_resume` to emit structural trust; full resume includes a `structural-context` section with `structuralTrust`, so the fail-closed bootstrap path is satisfied.
- Ephemeral retention without full governance is covered by `tests/governance-ephemeral-decouple.vitest.ts`, including the explicit `deleteAfter` only case, so that behavior is intentional rather than a review finding.
- Embedder list/set/status schemas match their handlers and the reindex path uses a staging shard before flipping the active pointer.

Review verdict: CONDITIONAL
