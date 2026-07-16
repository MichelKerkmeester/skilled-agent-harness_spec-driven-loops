# Deep Review Iteration 004

## Focus
Maintainability pass over schema centralization, handler argument drift, queue boundaries, and follow-on change safety.

## Evidence Reviewed
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:519-552` exposes public MCP schemas for bulk index and async ingest.
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:455-462` and `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:596-598` maintain a stricter internal validation surface that currently accepts more fields than the public MCP schema advertises.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:254-292` has governance fields in handler args but a narrower private `indexSingleFile` wrapper.
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:45-55` and `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:253-295` keep ingest job state minimal, which makes adding governance propagation a schema/database migration rather than a local handler-only edit.
- `.opencode/skills/system-spec-kit/mcp_server/schemas/README.md` describes the schema extraction goal, but the active public tool schemas still live in `tool-schemas.ts`.

## Findings
No new maintainability finding was added beyond F002. The maintainability risk is a direct consequence of that accepted P1: validation, public schemas, handler args, and queue persistence encode different views of the same tool contract.

## Coverage Update
- Dimension covered: maintainability.
- Follow-on work should prefer one normalized governed-ingest payload type shared by direct save, scan, and async ingest.
- The queue change needs a migration/test path because job persistence currently has no place to store scope/provenance/retention metadata.

Review verdict: CONDITIONAL
