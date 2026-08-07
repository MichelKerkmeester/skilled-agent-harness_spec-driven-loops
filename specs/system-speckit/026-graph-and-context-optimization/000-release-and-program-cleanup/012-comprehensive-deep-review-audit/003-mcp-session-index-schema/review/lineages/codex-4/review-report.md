# Deep Review Report - codex-4

## 1. Executive Summary

Verdict: `CONDITIONAL`.

Release readiness state: `converged` for the review loop. This lineage completed four passes, covered all configured dimensions, and found no P0 findings. One active P1 remains, so the reviewed slice should route to remediation before being treated as shippable.

Active findings:

| Severity | Count |
|----------|-------|
| P0 | 0 |
| P1 | 1 |
| P2 | 2 |

`hasAdvisories=true` because two P2 findings remain active.

Scope reviewed:

- MCP session lifecycle handlers: bootstrap, resume, health, learning.
- Memory index and async ingest handlers.
- Embedder list/set/status handlers.
- `context-server.ts` registration and dispatch boundary.
- Public tool schemas, runtime tool-input schemas, selected tests, feature catalog, and manual playbook call shapes.

## 2. Planning Trigger

Plan remediation because `C4-P1-001` is active. The issue affects governed bulk ingest/index behavior: callers can provide tenant/session/provenance/retention metadata, validation accepts it, but the metadata is not carried into the rows created by scan or async ingest paths.

No P0 was found, so this is not a release-blocking failure in review-loop terms. It is still a required fix before claiming the governed ingest surface is complete.

## 3. Active Finding Registry

### C4-P1-001 - P1 - Governed metadata is accepted on bulk ingest surfaces but dropped before indexing

The runtime schema accepts governed ingest metadata for `memory_index_scan` and `memory_ingest_start`, and both handlers call `validateGovernedIngest(args)`. The actual indexing paths never receive the normalized governance metadata.

Evidence:

- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:455`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:472`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:330`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:721`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:146`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:262`
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:253`
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:627`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2075`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3196`

Required fix: thread normalized governance through both bulk paths, including scan-originated saves and async ingest jobs. If governed metadata is not intended for bulk tools, remove it from the runtime schemas and allowed-parameter lists.

### C4-P2-002 - P2 - Public tool definitions hide runtime-accepted governed ingest fields

`ListTools` returns public schemas from `TOOL_DEFINITIONS`, but execution validates against runtime schemas. Public schemas for `memory_index_scan` and `memory_ingest_start` omit governance fields accepted by runtime validation.

Evidence:

- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1028`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1052`
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:519`
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:531`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:233`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:455`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:472`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:596`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:598`

Recommended fix: generate or share public schemas from the runtime schema source, or add explicit parity tests for these two tools.

### C4-P2-003 - P2 - Operator playbook and catalog examples use stale MCP call shapes

The session bootstrap playbook calls removed arguments, and the governed ingest catalog advertises a `dryRun` argument for `memory_ingest_start` that live schemas do not accept.

Evidence:

- `.opencode/skills/system-spec-kit/manual_testing_playbook/discovery/session-bootstrap-reader-ready-context.md:37`
- `.opencode/skills/system-spec-kit/feature_catalog/governance/governed-ingest-cancel-lifecycle.md:28`
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:531`
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:649`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:472`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:598`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:608`

Recommended fix: update examples to current object call shapes and add a doc drift check for MCP tool invocation examples.

## 4. Remediation Workstreams

| Workstream | Findings | Outcome |
|------------|----------|---------|
| Governed bulk propagation | C4-P1-001 | Bulk scan and async ingest persist/apply tenant, user, agent, session, provenance, and retention metadata consistently with `memory_save`. |
| Schema parity | C4-P1-001, C4-P2-002 | Public `TOOL_DEFINITIONS`, runtime Zod schemas, and allowed-parameter filters agree for governed ingest fields. |
| Operator docs | C4-P2-003 | Manual playbook and feature catalog examples match live MCP schemas. |

## 5. Spec Seed

Problem statement: governed metadata supplied to bulk index/ingest tools is currently validated but not applied to indexed records, and the surrounding public/docs contracts are out of sync.

In scope:

- `memory_index_scan` governance propagation.
- `memory_ingest_start` job persistence and worker propagation.
- Public schema/runtime schema/allowed-parameter parity.
- Operator docs call-shape updates.

Out of scope:

- Changing unrelated memory-save behavior.
- Changing retrieval or causal graph behavior except where governed rows become scoped correctly.
- Reworking the whole tool schema architecture unless needed for parity.

Acceptance criteria:

- Governed scan-created rows carry the requested scope/provenance/retention metadata.
- Governed async-ingest-created rows carry the same metadata after worker processing.
- Runtime and public schemas expose the same governance argument set for the affected tools.
- Stale `session_bootstrap` and `memory_ingest_start` examples are removed or corrected.

## 6. Plan Seed

1. Normalize governance once in `memory_index_scan` and pass the normalized payload into `indexSingleFile()` / `indexMemoryFile()`.
2. Extend ingest job storage to persist normalized governance metadata, then pass it into the worker callback and indexing call.
3. Add handler tests proving scan and async ingest propagate tenant/session scope.
4. Add public/runtime schema parity tests for `memory_index_scan` and `memory_ingest_start`.
5. Update manual playbook and feature catalog examples to the current object-style MCP call shapes.

## 7. Traceability Status

| Protocol | Status | Notes |
|----------|--------|-------|
| spec_code | covered | Scoped spec claims were traced through handlers, schemas, context-server registration, and relevant tests. |
| checklist_evidence | skipped | The target child packet has no `checklist.md`. |
| feature_catalog_code | covered_with_advisory | `C4-P2-003` covers stale governed ingest catalog call shape. |
| playbook_capability | covered_with_advisory | `C4-P2-003` covers stale session bootstrap playbook call shape. |
| resource_map | skipped | No `resource-map.md` existed at init. |

## 8. Deferred Items

- No resource-map coverage gate ran because the target child packet had no `resource-map.md`.
- No checklist-evidence audit ran because the target child packet had no `checklist.md`.
- Code graph was unavailable for this lineage; grep/read fallback supplied concrete file:line evidence.

## 9. Audit Appendix

Iterations:

| Iteration | Focus | Result |
|-----------|-------|--------|
| 001 | correctness/security | Found `C4-P1-001`. |
| 002 | traceability | Found `C4-P2-002` and `C4-P2-003`. |
| 003 | maintainability | No new findings. |
| 004 | stabilization | No new findings; legal-stop gates passed. |

Convergence evidence:

- Last two new-finding ratios: `0.00`, `0.00`.
- Dimensions covered: correctness, security, traceability, maintainability.
- Legal-stop gates: convergence, dimension coverage, P0 resolution, evidence density, scope, claim adjudication, graphless fallback all passed.

Final verdict: `CONDITIONAL`.
