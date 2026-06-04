# Deep Review Report - codex-1

## Verdict

FAIL. This lineage converged after five iterations with one active P0, one active P1, and one active P2. The P0 blocks release readiness.

## Findings

### P0-001 - Governed bulk ingest and scan validate tenant scope, then index rows without that scope

`memory_ingest_start` and `memory_index_scan` accept governed fields such as tenant/session/provenance/retention metadata and validate them, but the bulk indexing paths do not pass that normalized scope into the indexing calls. Direct `memory_save` does preserve scope, which makes the bulk paths the inconsistent and unsafe cases.

Primary evidence:

- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:146`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:263`
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:45`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2074`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:330`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:721`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3393`

Fix: persist normalized governance metadata on ingest jobs and thread it through scan/index calls, or remove governed fields from those runtime schemas until they are honored.

### P1-002 - Scoped memory_index_scan still performs global stale and orphan deletes

The public schema says `specFolder` limits the scan, and discovery uses that filter, but stale/orphan cleanup queries the full `memory_index` table. A scoped scan can therefore delete stale/orphan index rows outside the requested folder.

Primary evidence:

- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:522`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:410`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:551`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:558`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:844`
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:321`
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:452`

Fix: pass scan scope into stale path selection and orphan sweeping, or make global cleanup an explicit opt-in outside scoped scans.

### P2-003 - Review slice has no executable evidence trail beyond spec.md

The target slice declares Level 1 review requirements and success criteria, but the target directory contains only `spec.md`. There is no plan, tasks, checklist, implementation summary, description metadata, graph metadata, or resource map for evidence reconciliation.

Primary evidence:

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/003-mcp-session-index-schema/spec.md:13`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/003-mcp-session-index-schema/spec.md:95`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/003-mcp-session-index-schema/spec.md:105`

Fix: backfill the Level 1 evidence files and mandatory metadata, or explicitly document that this review child gets its evidence exclusively from lineage artifacts.

## Coverage

| Dimension | Status |
|---|---|
| Security | covered with P0-001 |
| Correctness | covered with P1-002 |
| Traceability | covered with P2-003 |
| Maintainability | covered; no additional P0/P1/P2 |

## Traceability

| Protocol | Result |
|---|---|
| spec_code | pass_with_findings |
| checklist_evidence | not_applicable_missing |
| feature_catalog_code | pass_with_findings |
| playbook_capability | not_applicable_missing |

## Synthesis

The release decision is FAIL because P0-001 can create unscoped indexed memory rows from governed bulk operations. P1-002 is a separate scope-contract defect in scan cleanup. P2-003 does not block runtime behavior, but it makes this review slice harder to audit and merge cleanly.
