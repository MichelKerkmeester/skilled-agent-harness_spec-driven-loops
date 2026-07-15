# Deep Review Iteration 003

## Metadata
- Session: `fanout-codex-5-1780592962034-iuktuj`
- Generation: 1
- Focus: traceability
- Dimensions: traceability
- Verdict: CONDITIONAL

## Traceability Frame
The target spec makes schema-to-handler parity the central drift target: the problem statement says prior calibration already found schema-to-handler drift, the purpose is to audit the listed files with special attention to that parity, and REQ-002 requires every advertised option to be traced to handler usage or flagged (`spec.md:36-40`, `spec.md:67-68`, `spec.md:95-96`).

## Reviewed Evidence
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:519-522` defines the public `memory_index_scan` input schema with scan flags only.
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:531-550` defines the public `memory_ingest_start` input schema with `paths` and `specFolder` only.
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:455-462` accepts governed-ingest fields for `memory_index_scan`.
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:472-476` accepts governed-ingest fields for `memory_ingest_start`.
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:596-598` includes those governed fields in the strict allowed-parameter registry.
- `.opencode/skills/system-spec-kit/mcp_server/schemas/README.md:18-25` says this schema registry is the handler validation layer and that strict mode is enabled by default.
- `.opencode/skills/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:55-68` routes lifecycle tools through `validateToolArgs()` before handler dispatch.
- `.opencode/skills/system-spec-kit/mcp_server/tools/memory-tools.ts:100-104` routes embedder tools through validation and handler dispatch.
- `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts:17-39` confirms the lifecycle and memory dispatchers are registered in the entrypoint dispatch chain.

## Finding Status

### F001: Governed ingest metadata is accepted and validated, then discarded on scan/async ingest paths
Severity remains P1. Traceability sharpened the scope: this is not only a handler bug, it is a contract drift across the public tool definitions, strict schemas, and async execution path. The strict schema accepts governance fields for scan and ingest; the public `tool-schemas.ts` definitions do not advertise them; the handler/queue path still drops them before index writes.

Concrete impact remains unchanged from iterations 1-2: tenant/user/agent/session/provenance/retention metadata can be supplied to governed ingest surfaces but does not survive the scan/async ingestion path, despite the storage schema and retention sweep having columns and behavior for that metadata.

## Checks Passed / Ruled Out
- Dispatcher registration is not the cause. `memory_index_scan` and `memory_ingest_start` route through `lifecycleTools`, and embedder status/list/set route through `memoryTools`.
- Strict validation is not bypassed at these dispatch points. The relevant dispatcher calls `validateToolArgs()` before invoking each listed handler.
- The drift is localized to contract propagation and async execution metadata, not a missing tool registration.

## Traceability Protocols
| Protocol | Status | Evidence | Notes |
|----------|--------|----------|-------|
| `spec_code` | partial | `spec.md:67-68`, `spec.md:95-96`, `tool-input-schemas.ts:455-462`, `tool-input-schemas.ts:472-476`, `memory-index.ts:721`, `memory-ingest.ts:263`, `job-queue.ts:627`, `context-server.ts:2074-2077` | REQ-002 is covered, with one active P1 drift. |
| `checklist_evidence` | blocked | `spec.md:13`, no `checklist.md` in the slice folder | Level 1 slice has no checklist artifact to reconcile. |
| `feature_catalog_code` | partial | `tool-schemas.ts:519-522`, `tool-schemas.ts:531-550`, `tool-input-schemas.ts:596-598` | Public definitions and strict validation registry disagree for governed ingest fields. |
| `playbook_capability` | partial | `schemas/README.md:18-25`, `tools/lifecycle-tools.ts:55-68`, `tools/index.ts:17-39` | Entrypoint validation path exists; capability contract is blocked by F001. |

## New Findings
- None.

## Delta
- New P0: 0
- New P1: 0
- New P2: 0
- Refined P1: 1

Review verdict: CONDITIONAL
