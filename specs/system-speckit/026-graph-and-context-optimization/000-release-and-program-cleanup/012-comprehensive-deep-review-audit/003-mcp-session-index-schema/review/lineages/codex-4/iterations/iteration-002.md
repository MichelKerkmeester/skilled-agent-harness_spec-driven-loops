# Iteration 002 - Traceability and Schema Parity

## Focus

Traceability review across the target spec, public MCP tool definitions, runtime schemas, and operator-facing docs.

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/003-mcp-session-index-schema/spec.md`
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/discovery/session-bootstrap-reader-ready-context.md`
- `.opencode/skills/system-spec-kit/feature_catalog/governance/governed-ingest-cancel-lifecycle.md`

## Findings

### P2 - Public tool definitions hide runtime-accepted governed ingest fields

The server returns `TOOL_DEFINITIONS` from `ListTools`, while tool execution validates against the runtime Zod schemas. Those two views disagree for the bulk ingest/index tools: clients discover only the base fields, but the runtime accepts the governance field set.

Evidence:

- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1028` registers `ListToolsRequestSchema`, and lines 1029-1030 return `TOOL_DEFINITIONS`.
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1052` validates calls with `validateToolArgs()`.
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:519` defines public `memory_index_scan`; line 522 lists only `specFolder`, `force`, `includeConstitutional`, `includeSpecDocs`, and `incremental`.
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:531` defines public `memory_ingest_start`; lines 537-549 list only `paths` and `specFolder`.
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:233` defines the governance field set, and lines 455-462 / 472-476 include it in the runtime schemas.
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:596` and line 598 allow those governance fields at the parameter filter.

Impact:

MCP clients and generated docs cannot discover the governed bulk-ingest fields even though the server accepts them. This also makes the active P1 harder to notice because the advertised contract hides the same fields whose values are currently dropped by the implementation.

Fix:

Generate or share the public JSON schemas from the same source as `tool-input-schemas.ts`, or explicitly add the governance fields to `memoryIndexScan` and `memoryIngestStart` in `tool-schemas.ts`. Add a parity test covering the public tool definition, runtime schema, and `ALLOWED_PARAMETERS` entries for these tools.

### P2 - Operator playbook and catalog examples use stale MCP call shapes

Two operator-facing examples no longer match the live schemas.

Evidence:

- `.opencode/skills/system-spec-kit/manual_testing_playbook/discovery/session-bootstrap-reader-ready-context.md:37` calls `session_bootstrap({ input: ..., includeGraphStatus: true })`.
- The live public schema for `session_bootstrap` only exposes `specFolder` at `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:649` through line 659.
- Runtime filtering also allows only `specFolder` for `session_bootstrap` at `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:608`.
- `.opencode/skills/system-spec-kit/feature_catalog/governance/governed-ingest-cancel-lifecycle.md:28` advertises `memory_ingest_start(paths, dryRun)`.
- The live public schema for `memory_ingest_start` exposes `paths` and `specFolder` at `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:531` through line 549, and runtime filtering at `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:598` has no `dryRun`.

Impact:

The docs steer manual testers toward calls that are rejected or silently stripped by the runtime validator. That weakens the release cleanup goal of making the MCP session/index tooling operator-ready.

Fix:

Update the playbook to call `session_bootstrap({ specFolder })` or no arguments, and update the catalog to show the current `memory_ingest_start({ paths, specFolder, ...governance })` object shape. Add doc drift checks for examples that mention MCP tool invocations.

## Non-Findings

- `session_resume` public schema and runtime schema both include `specFolder`, `sessionId`, and `minimal`, so the resume call shape is aligned.
- `embedder_list`, `embedder_set`, and `embedder_status` public schemas match the runtime argument lists.
- `checklist_evidence` is skipped rather than failed because the target child packet does not contain `checklist.md`.

Review verdict: CONDITIONAL
