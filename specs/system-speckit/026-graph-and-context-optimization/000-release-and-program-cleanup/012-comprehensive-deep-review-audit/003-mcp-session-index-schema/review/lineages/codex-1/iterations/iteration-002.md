# Iteration 002 - Correctness

## Focus

Scoped `memory_index_scan` behavior, incremental stale cleanup, and orphan sweep boundaries.

## Files Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`

## Findings

### P1-002 - Scoped memory_index_scan still performs global stale and orphan deletes

Severity: P1

Category: correctness

Finding class: scoped-operation-global-mutation

Evidence:

- The public schema describes `specFolder` as "Limit scan to specific spec folder". [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:522]
- File discovery honors that scope for spec documents and graph metadata. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:410] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:414]
- When discovery returns no files, the handler still calls `runGlobalOrphanSweep()`. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:551] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:554]
- The same zero-file path calls `categorizeFilesForIndexing([])` and deletes `categorized.toDelete`. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:558] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:559]
- The non-empty path also categorizes stale paths and runs `runGlobalOrphanSweep()` after indexing. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:664] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:836] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:844]
- `categorizeFilesForIndexing` adds stale indexed paths that were not discovered. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:299]
- `listStaleIndexedPaths` reads all `memory_index` rows with a file path; it has no `spec_folder`, tenant, or scan-scope predicate. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:321]
- `sweepOrphanIndexRows` also scans `memory_index` globally by id and file path. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:452]

Impact:

A caller can request a scan limited to one spec folder, but the same call can delete stale or orphan index rows for unrelated folders. The code only removes rows whose backing file paths are absent, so this is not live file deletion, but it is still a mutation outside the advertised scan boundary. In governed or packet-local workflows, that makes scoped maintenance surprising and can invalidate unrelated memory rows.

Concrete fix:

Thread scan scope into `categorizeFilesForIndexing`, `listStaleIndexedPaths`, and `sweepOrphanIndexRows`, or skip global cleanup during scoped scans unless an explicit global-maintenance option is supplied. If governed fields remain accepted on `memory_index_scan`, apply tenant/session scope to cleanup as well.

## Claim Adjudication

```json
{
  "findingId": "P1-002",
  "claim": "memory_index_scan(specFolder=...) scopes file discovery but still runs stale and orphan deletion against the whole index.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:522",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:410",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:551",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:558",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:844",
    ".opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:321",
    ".opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:452"
  ],
  "counterevidenceSought": "Checked whether discovery scope was propagated into stale path selection or orphan sweep SQL; it was not.",
  "alternativeExplanation": "The global cleanup could be intended maintenance attached to any scan. The public argument text says the scan is limited, and the implementation does not expose an explicit global-cleanup opt-in.",
  "finalSeverity": "P1",
  "confidence": 0.84,
  "downgradeTrigger": "Downgrade if maintainers explicitly document specFolder as discovery-only while global stale cleanup is an intentional side effect."
}
```

## Negative Checks

- Not escalated to P0 because the stale and orphan paths only remove index rows whose backing files are already absent.
- No additional correctness finding recorded for scan mtime updates; comments and control flow keep mtime updates after successful indexing.

## Iteration Metrics

- New findings: P0=0, P1=1, P2=0
- newFindingsRatio: 0.25
- Status: complete

Review verdict: FAIL
