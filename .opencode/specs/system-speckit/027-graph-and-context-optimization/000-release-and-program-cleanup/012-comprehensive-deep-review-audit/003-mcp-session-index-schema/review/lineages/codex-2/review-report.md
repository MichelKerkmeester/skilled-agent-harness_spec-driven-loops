# Deep Review Report

## 1. Executive Verdict

Verdict: `CONDITIONAL`.

No P0 finding was found. One P1 remains open: governed scan/ingest arguments validate successfully but are not carried through to indexed records, while the public tool schemas do not advertise those accepted fields.

## 2. Scope Reviewed

Reviewed the requested session, memory index/ingest, embedder, context-server and schema surfaces:

- `session-bootstrap.ts`, `session-resume.ts`, `session-health.ts`, `session-learning.ts`
- `memory-index.ts`, `memory-index-discovery.ts`, `memory-index-alias.ts`, `memory-ingest.ts`
- `embedder-list.ts`, `embedder-set.ts`, `embedder-status.ts`
- `context-server.ts`, `tool-schemas.ts`, `schemas/tool-input-schemas.ts`, `schemas/README.md`

Supporting dispatch, governance, queue, save and embedder internals were read only where needed to verify call flow.

## 3. Findings

### P1: Governed scan/ingest validates governance fields but drops them before indexing

`memory_index_scan` and `memory_ingest_start` both accept governance fields in the validation layer, but their caller-facing JSON schemas omit those fields. The handlers then validate governance and proceed, but the execution paths do not pass normalized scope, provenance, retention or delete-after metadata into record creation.

Evidence:

- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:455` and `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:472` include governance fields in the Zod scan/ingest schemas.
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:596` and `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:598` allow those governance fields.
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:522` and `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:536` advertise public schemas without the same fields.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:330` validates governance, but `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:721` calls `indexSingleFile` with only quality/scan/embedding options.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:146` validates governance, but `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:263` creates a job containing only `id`, `paths` and `specFolder`.
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:45` and `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:208` define the ingest job object/table without governance fields.
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2074` initializes the ingest worker as `processFile(filePath)`, so job-specific governance cannot reach indexing.

Impact:

Governed callers can believe tenant/session/provenance/retention constraints were honored because the call validates. The resulting memory rows can instead be written without that scope or lifecycle metadata, which weakens retrieval isolation and retention behavior.

Fix:

Make public and runtime schemas agree, then carry the normalized governance decision through both paths. For `memory_index_scan`, pass scope/governance options into `indexSingleFile` and `indexMemoryFile`. For `memory_ingest_start`, persist governance metadata on `ingest_jobs`, load it in the worker, and invoke indexing with the same scope/provenance/retention metadata used by `memory_save`.

## 4. Evidence And Reasoning

The issue is not merely a documentation mismatch. `validateGovernedIngest(args)` is called in both scan and ingest handlers, proving the code intends to accept governed input. The downstream scan wrapper drops all governance fields before `indexMemoryFile`, and the async ingest job model has nowhere to store them.

The canonical `memory_save` path shows the expected behavior: it builds a scope object and applies governance metadata before creating indexed records. Scan and ingest do not match that contract.

## 5. Dimension Coverage

| Dimension | Result |
|---|---|
| Correctness | P1 found: validated options are not applied. |
| Security | P1 confirmed: tenant/session/retention controls can be silently lost. |
| Traceability | P1 confirmed: public schema and runtime validation disagree. |
| Maintainability | No additional P1/P2 finding found in alias, discovery, session or embedder surfaces. |

## 6. Schema/Handler Parity

Most reviewed tools had public schema, Zod validation and handler behavior aligned at the level needed for this slice. The exception is scan/ingest governance:

- Public schema: does not advertise governance fields.
- Zod schema: accepts governance fields.
- Handler: validates governance fields.
- Execution: does not persist or apply them.

That is the only material parity failure found.

## 7. Convergence

The loop ran five iterations: correctness, security, traceability, maintainability and stabilization. The final pass produced no new independent findings. P0 count stayed zero; P1 count stayed one.

## 8. Recommended Fixes

1. Decide whether `memory_index_scan` and `memory_ingest_start` should support governed ingestion.
2. If yes, add governance fields to `tool-schemas.ts` for both tools.
3. Pass normalized governance through `memory-index.ts` into `indexMemoryFile`.
4. Extend `IngestJob` and `ingest_jobs` to persist governance metadata.
5. Change the ingest worker contract from `processFile(filePath)` to a job-aware shape that can apply job governance.
6. Add regression tests that assert tenant/session/retention metadata lands on rows produced by scan and async ingest.

## 9. Residual Risk

This review was source-based and did not execute the TypeScript test suite. The evidence is direct enough for the P1 because the missing data path is visible in the type/interface, table schema, job creation and worker invocation.

No code was modified during the review.
