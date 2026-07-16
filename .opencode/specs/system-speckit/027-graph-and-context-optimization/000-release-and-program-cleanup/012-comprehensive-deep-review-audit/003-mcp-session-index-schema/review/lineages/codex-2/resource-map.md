# Resource Map

## Review Target

Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/003-mcp-session-index-schema`

Resource map present at init: no.

## Primary Surfaces

| Surface | Files | Review role |
|---|---|---|
| Public MCP tool manifest | `mcp_server/tool-schemas.ts` | Caller-facing input schemas returned through `ListTools`. |
| Zod validation registry | `mcp_server/schemas/tool-input-schemas.ts`, `mcp_server/schemas/README.md` | Runtime validation and strict unknown-parameter behavior. |
| Context server entrypoint | `mcp_server/context-server.ts` | Tool dispatch, validation call path, session caller context and ingest queue startup. |
| Session lifecycle | `handlers/session-bootstrap.ts`, `handlers/session-resume.ts`, `handlers/session-health.ts`, `handlers/session-learning.ts` | Resume/bootstrap/health/learning behavior. |
| Index and ingest | `handlers/memory-index.ts`, `handlers/memory-ingest.ts`, `handlers/memory-index-discovery.ts`, `handlers/memory-index-alias.ts` | Scan, async ingest, discovery and alias handler behavior. |
| Embedder controls | `handlers/embedder-list.ts`, `handlers/embedder-set.ts`, `handlers/embedder-status.ts` | Embedder list, switch and reindex status behavior. |

## Supporting Surfaces

| Surface | Files | Reason read |
|---|---|---|
| Dispatch routers | `mcp_server/tools/index.ts`, `mcp_server/tools/lifecycle-tools.ts`, `mcp_server/tools/memory-tools.ts`, `mcp_server/handlers/index.ts` | Confirm handler dispatch and caller context boundaries. |
| Caller context | `mcp_server/lib/context/caller-context.ts` | Confirm session identity propagation. |
| Governance | `mcp_server/lib/governance/scope-governance.ts` | Compare validation semantics with scan/ingest persistence. |
| Ingest queue | `mcp_server/lib/ops/job-queue.ts` | Confirm async job payload and worker file-processing shape. |
| Canonical save path | `handlers/memory-save.ts`, `handlers/memory-save/create-record.ts` | Compare working governance persistence path with scan/ingest. |
| Embedder internals | `mcp_server/lib/embedders/schema.ts`, `mcp_server/lib/embedders/reindex.ts` | Verify embedder handler behavior did not introduce a separate active finding. |

## Novel Logic Gap

`F001` lives at the join between schemas, governed ingest validation and downstream indexing. The runtime accepts governance fields for scan/ingest and validates them, but neither the scan wrapper nor async ingest job model transports normalized governance into `indexMemoryFile`. That makes the issue cross-cutting rather than local to a single handler.
