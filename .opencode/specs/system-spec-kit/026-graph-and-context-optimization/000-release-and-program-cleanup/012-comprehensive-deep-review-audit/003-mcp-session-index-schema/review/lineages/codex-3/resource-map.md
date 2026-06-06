# Resource Map

## Target
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/003-mcp-session-index-schema`

## Lineage
- Artifact dir: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/003-mcp-session-index-schema/review/lineages/codex-3`
- Session id: `fanout-codex-3-1780592962034-hmdvp1`
- Graph mode: graphless fallback

## Implementation Files Reviewed
| File | Review Use |
|------|------------|
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Dispatch, strict validation boundary, async ingest queue initialization. |
| `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts` | Dispatch table shape. |
| `.opencode/skills/system-spec-kit/mcp_server/tools/memory-tools.ts` | Memory tool routing and embedder dispatch. |
| `.opencode/skills/system-spec-kit/mcp_server/tools/lifecycle-tools.ts` | Lifecycle tool routing. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` | Composite bootstrap behavior and degraded hints. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/session-resume.ts` | Resume payload, code graph status, auth binding. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/session-health.ts` | Health and structural trust state. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/session-learning.ts` | Session learning validation and SQL safety. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Bulk scan validation, index wrapper, scan loop. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts` | Scan discovery and path scope. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-alias.ts` | Alias conflict detection. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts` | Async ingest validation and job creation. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts` | Async ingest job persistence and worker callback. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Direct save governance comparison path. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/governance/scope-governance.ts` | Governed ingest validation and post-insert field mapping. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-list.ts` | Embedder listing. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-set.ts` | Embedder selection and reindex kickoff. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts` | Reindex status. |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Public MCP schema contracts. |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Strict input validation and allowed-parameter map. |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/README.md` | Schema extraction context. |

## Documentation Files Reviewed
| File | Review Use |
|------|------------|
| `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | Checked for stale session/bootstrap call shapes; none accepted. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/03--discovery/session-bootstrap-reader-ready-context.md` | F003 stale bootstrap call shape. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/22--context-preservation/session-resume.md` | F004 stale session resume expected fields. |
| `.opencode/skills/system-spec-kit/feature_catalog/22--context-preservation/tool-routing-enforcement.md` | Search hit checked; no accepted finding. |

## Finding to Resource Links
| Finding | Primary Resources |
|---------|-------------------|
| F001 | `scope-governance.ts`, `memory-save.ts` |
| F002 | `tool-input-schemas.ts`, `memory-index.ts`, `memory-ingest.ts`, `job-queue.ts`, `context-server.ts`, `memory-save.ts` |
| F003 | `tool-input-schemas.ts`, `tool-schemas.ts`, `session-bootstrap-reader-ready-context.md` |
| F004 | `session-resume.ts`, `session-resume.md` |
