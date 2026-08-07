# Iteration 001 - Security

## Focus

Governed bulk indexing scope propagation across `memory_ingest_start`, `memory_index_scan`, and the shared save/index path.

## Files Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts`

## Findings

### P0-001 - Governed bulk ingest and scan validate tenant scope, then index rows without that scope

Severity: P0

Category: security

Finding class: tenant-scope-loss

Evidence:

- `memory_ingest_start` declares governed ingest fields including `tenantId`, `sessionId`, `provenanceActor`, `retentionPolicy`, and `deleteAfter`. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:41]
- The handler validates those fields with `validateGovernedIngest(args)`. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:146]
- The queued job only receives `id`, `paths`, and `specFolder`; normalized governance metadata is not stored. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:263]
- `IngestJob` and its DB row shape have no tenant, actor, session, retention, or delete-after fields. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:45]
- The worker is initialized with `processFile: async (filePath) => { await indexSingleFile(filePath, false); }`, so async ingest indexing runs without a scope object. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/context-server.ts:2074]
- `memory_index_scan` also declares governed fields in `ScanArgs` and validates them. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:260] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:330]
- The scan indexing call passes `force`, quality mode, `fromScan`, and `asyncEmbedding`, but no `scope` or governance metadata. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:721]
- The lower-level `indexMemoryFile` does support a `scope` option. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2745]
- Direct `memory_save` correctly builds `saveScope` from the normalized governance decision and passes it to `indexMemoryFile`. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3196] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3393]
- Existing tests prove the scan wrapper can preserve scope when it is passed, but the test exercises `indexMemoryFileFromScan` directly rather than the MCP handler path. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:794]

Impact:

A caller can supply tenant/session/retention metadata to a bulk ingest or index scan. The request passes governed-ingest validation, but persisted memory rows are created with no corresponding scope metadata. In a governed memory system, an unscoped row is not tenant-bound; that can leak private indexed continuity into broader retrieval and can also drop retention metadata such as `ephemeral`/`deleteAfter`.

Concrete fix:

Persist the normalized governance payload on ingest jobs and pass a `scope` object plus post-insert governance fields into the worker's indexing call. For `memory_index_scan`, either remove the governed fields from `memoryIndexScanSchema`/`ALLOWED_PARAMETERS` or pass the normalized scope into `indexSingleFile`/`indexMemoryFileFromScan` for every indexed file and apply post-insert governance metadata consistently.

## Claim Adjudication

```json
{
  "findingId": "P0-001",
  "claim": "Governed bulk ingest and memory index scan accept and validate tenant/session/retention metadata but persist indexed memory rows without that metadata.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:41",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:146",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:263",
    ".opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:45",
    ".opencode/skills/system-spec-kit/mcp_server/context-server.ts:2074",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:260",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:330",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:721",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2745",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3196",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3393"
  ],
  "counterevidenceSought": "Checked the async job queue row shape, queue worker callback, memory_index_scan batch call, lower-level indexMemoryFile scope option, direct memory_save governed path, and scan wrapper tests.",
  "alternativeExplanation": "The governance fields could be intended as validation-only compatibility fields. That does not hold for a governed ingest contract because direct memory_save persists the same metadata and scan-origin wrapper tests explicitly preserve scope when supplied.",
  "finalSeverity": "P0",
  "confidence": 0.91,
  "downgradeTrigger": "Downgrade if bulk ingest and scan are proven impossible to call with governed metadata at the MCP boundary, or if unscoped rows are proven never visible to any governed retrieval path."
}
```

## Negative Checks

- No finding recorded for `session_resume` session-id binding in this pass; the handler rejects mismatches when caller context has a session id.
- No finding recorded for public JSON schema hiding the governance fields by itself; the security issue is that runtime validation accepts those fields and downstream persistence drops them.

## Iteration Metrics

- New findings: P0=1, P1=0, P2=0
- newFindingsRatio: 0.50
- Status: complete

Review verdict: FAIL
