# Deep Review Iteration 004

## Metadata
- Session: `fanout-codex-5-1780592962034-iuktuj`
- Generation: 1
- Focus: maintainability
- Dimensions: maintainability
- Verdict: CONDITIONAL

## Maintainability Frame
This pass reviewed whether the active drift is isolated enough to fix surgically and whether the remaining listed handlers introduce separate operational change-cost risks.

## Reviewed Evidence
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:254-269` models scan governance fields on the request argument type.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:278-292` narrows the shared `indexSingleFile()` option bag to quality/scan/async flags only.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:316-333` destructures scan flags and validates governed ingest arguments.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:721-725` calls `indexSingleFile()` without any normalized governance payload.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:38-49` models async ingest governance fields on the request argument type.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:146-149` validates governed ingest arguments.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:263-267` creates an ingest job with `id`, `paths`, and `specFolder` only.
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:253-257` defines `createIngestJob()` with no governance/provenance/retention slot.
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:266-282` persists only job identity, state, spec folder, paths, progress, errors, and timestamps.
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:624-627` invokes the configured file processor with only `nextPath`.
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2074-2077` binds that processor to `indexSingleFile(filePath, false)`.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-list.ts:87-115`, `embedder-set.ts:54-94`, and `embedder-status.ts:117-136` have small, cohesive handler surfaces and no separate finding in this dimension.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/session-health.ts:120-300`, `session-learning.ts:301-620`, `memory-index-discovery.ts:139-221`, and `memory-index-alias.ts:199-220` did not show a separate maintainability issue material enough for this review threshold.

## Finding Status

### F001: Governed ingest metadata is accepted and validated, then discarded on scan/async ingest paths
Severity remains P1. Maintainability review adds one reason this should be fixed at the boundary rather than patched piecemeal: governance fields exist in request arg types, strict validation, storage columns, and retention behavior, but there is no typed propagation object through `indexSingleFile()`, persisted ingest jobs, or the queue processor. That makes the failure mode easy to reintroduce when new governance metadata is added.

Concrete fix direction: normalize the governed-ingest decision once, pass the normalized metadata through scan and async ingest job records, and extend the queue processor/indexing contract so `indexMemoryFile()` receives the same governance payload as direct save/index paths.

## Checks Passed / Ruled Out
- Embedder list/set/status handlers are not part of F001 and did not expose a separate maintainability finding at the P2 threshold.
- Session health/resume/bootstrap dispatch shape was already covered; this pass did not find an additional operational clarity issue separate from the active P1.
- Discovery and alias helpers have bounded traversal/alias handling and did not create a separate review finding.

## New Findings
- None.

## Delta
- New P0: 0
- New P1: 0
- New P2: 0
- Refined P1: 1

Review verdict: CONDITIONAL
