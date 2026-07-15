# Deep Review Iteration 003

## Focus
Traceability and schema-to-handler parity pass over `tool-schemas.ts`, `schemas/tool-input-schemas.ts`, `memory_index_scan`, `memory_ingest_start`, session bootstrap/resume documentation, and manual playbooks.

## Finding F002 - P1
Bulk scan and async ingest accept governed-ingest fields but do not propagate them to indexing.

### Evidence
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:455-462` accepts governance fields for `memory_index_scan`.
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:596-598` lists tenant, user, agent, session, provenance, retention policy, and delete-after fields as allowed parameters for `memory_index_scan` and `memory_ingest_start`.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:254-269` includes those fields in `ScanArgs`.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:330-333` validates governed ingest.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:278-292` forwards only `force`, quality-gate mode, scan provenance, and async embedding into `indexMemoryFile`.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:721-725` calls `indexSingleFile` from the scan loop without governance scope or retention metadata.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:146-149` validates governed ingest for async ingest.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:263-267` enqueues only job id, paths, and spec folder.
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:45-55` defines `IngestJob` without governance fields.
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:253-295` persists only id, state, spec folder, paths, counts, errors, and timestamps.
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:624-628` calls `processFileFn(nextPath)` with only a file path.
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2074-2077` initializes async ingest with `indexSingleFile(filePath, false)`.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3393-3400` shows the direct save path does pass `scope` into `indexMemoryFile`, and `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3431-3447` applies post-insert governance metadata.

### Impact
Bulk callers can send accepted tenant/session/provenance/retention metadata and receive a successful validation path, but the indexed rows from scan or async ingest are written without those fields. That breaks schema-to-handler parity and can make retention and scoped retrieval behavior differ between direct saves and bulk ingestion.

### Concrete Fix
Carry the normalized governance decision into `indexSingleFile` and then into `indexMemoryFile` for `memory_index_scan`. For async ingest, persist the normalized governance fields on the job record or a side table and pass them through the worker's `processFile` callback.

### Claim Adjudication
- Claim: accepted governance arguments are discarded on scan and async ingest.
- Alternate explanation considered: `validateGovernedIngest` might intentionally be a preflight-only guard for those tools.
- Decision: accepted as P1. The allowed parameter list and handler argument types expose the fields, but neither scan nor queued worker has a persistence path for the normalized decision. The direct save path demonstrates the expected propagation pattern.

## Finding F003 - P2
The session bootstrap playbook still documents removed `input` and `includeGraphStatus` parameters.

### Evidence
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:608` allows only `specFolder` for `session_bootstrap`.
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:653-660` advertises only `specFolder` in the MCP schema.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/discovery/session-bootstrap-reader-ready-context.md:37` documents `session_bootstrap({ input: "resume mk-spec-memory playbook audit", includeGraphStatus: true })`.

### Impact
The documented manual test call is rejected by the strict schema boundary. Operators following the playbook cannot validate the live bootstrap tool with the command shown there.

### Concrete Fix
Update the playbook command to `session_bootstrap({ specFolder: "<optional spec folder>" })`, and move the expected graph readiness checks to response assertions instead of input flags.

## Finding F004 - P2
The session resume playbook expects `codeGraph.available` and `binaryPath`, but the live `codeGraph` payload exposes freshness and counts only.

### Evidence
- `.opencode/skills/system-spec-kit/mcp_server/handlers/session-resume.ts:104-110` defines `CodeGraphStatus` as `status`, `lastScan`, `nodeCount`, `edgeCount`, and `fileCount`.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/session-resume.ts:710-723` returns that `codeGraph` object in `SessionResumeResult`.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/context-preservation/session-resume.md:18-22` requires `codeGraph.available` and `binaryPath`.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/context-preservation/session-resume.md:91-100` repeats the same expected fields.

### Impact
The playbook is asserting fields that are not part of the handler contract, so a correct live `session_resume({})` response can fail the documented manual validation.

### Concrete Fix
Either add explicit `available` and `binaryPath` fields to `CodeGraphStatus`, or update the playbook to validate `status`, `lastScan`, and the count fields that the handler actually returns.

Review verdict: CONDITIONAL
