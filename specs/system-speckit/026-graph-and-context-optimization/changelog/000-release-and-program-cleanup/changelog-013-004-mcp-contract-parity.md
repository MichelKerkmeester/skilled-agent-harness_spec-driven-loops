---
title: "013/004 MCP Contract Parity"
description: "Four MCP tool contracts were realigned with runtime validation, governed-ingest metadata now reaches scan and async paths, stale graph guidance was corrected and parity tests guard against future schema drift."
trigger_phrases:
  - "013/004 mcp contract parity"
  - "tool schema drift fixed"
  - "governed ingest threading"
  - "embedding reconcile coverage parity"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-04

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/013-comprehensive-audit-remediation/004-mcp-contract-parity`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/013-comprehensive-audit-remediation`

### Summary

The public MCP contracts for four tools now match the runtime schemas and validation behavior. Embedding-reconcile dry runs now predict apply coverage, governed ingest metadata survives scan and async ingest paths, stale code-graph bootstrap guidance no longer promises queries work on stale graphs and a contract parity test compares public schema keys against Zod keys for the tools in scope. The same pass exposed causal scope fields so the retrieval hardening phase is reachable through real MCP traffic.

### Added

- Public and Zod schema fields for governed `memory_index_scan` and `memory_ingest_start` inputs
- Nested `backfill` public schema for `memory_causal_stats`, including the dry-run default and write boundary
- Optional `tenantId/userId/agentId` on `memory_drift_why` and `memory_causal_link` public and Zod schemas
- `tool-contract-parity.vitest.ts`, guarding public-vs-Zod property-key parity for the four cluster tools
- Nullable `governance_json` column on ingest jobs, guarded by a PRAGMA migration check

### Changed

- Embedding-reconcile dry-run coverage now uses the same rowid-or-dimension-row predicate as apply repair
- `activeOnly` is documented as a reserved no-op because active shard verification is always runtime-resolved
- `indexMemoryFile`, `memory_index_scan`, async ingest job creation and the ingest worker now pass governed ingest decisions through to post-insert metadata application
- Bootstrap guidance now says stale code graph queries block with `code_graph_not_ready` until `session_bootstrap` refreshes readiness

### Fixed

- Dry-run `coverage.successMissingActiveVector` no longer undercounts rows that apply would reset with `repairSuccessCoverage:true`
- Public MCP schemas no longer hide runtime-accepted governance and causal scope fields for the tools in scope
- Stale `[Phase 007]`, `Phase 027` and "still works" guidance text was removed from the affected schema and bootstrap surfaces

### Verification

- `_dimTable` removed and `dimTable` read in coverage query: PASS
- `[Phase 007]` token removed from `tool-schemas.ts`: PASS, grep 0 hits
- `Phase 027` heading and "still works" removed from `context-server.ts`: PASS, grep 0 hits
- D7 parity test authored for four tools: PASS
- D1/D3/D6 test assertions authored across three test files: PASS
- `mcp_server` typecheck and vitest: DEFERRED to central because peer edits were active in the same package

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts` | Modified | Coverage predicate parity and reserved-no-op comment |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Modified | Public schema parity, governance fields, causal fields, stale token cleanup |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Modified | Zod and allow-list causal scope fields |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modified | Governance threading through `indexMemoryFile` |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Modified | Governance passed into `indexSingleFile` |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts` | Modified | Governance persisted on ingest jobs |
| `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts` | Modified | `governance_json` column, rehydration and worker forwarding |
| `.opencode/skills/system-spec-kit/mcp_server/tools/types.ts` | Modified | Scan argument governance fields |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modified | Stale-graph guidance and ingest worker governance forwarding |
| `.opencode/skills/system-spec-kit/mcp_server/tests/tool-contract-parity.vitest.ts` | Created | Public-vs-Zod parity guard |
| `.opencode/skills/system-spec-kit/mcp_server/tests/vector-coverage-hygiene.vitest.ts` | Modified | Coverage count and apply-parity assertion |
| `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-ingest.vitest.ts` | Modified | Governance-threading assertion |
| `.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts` | Modified | Stale-graph guidance assertions |

### Follow-Ups

- Central verification should validate the additive `ingest_jobs.governance_json` migration and run the broader typecheck and vitest suite.
- D3 test coverage reaches the handler boundary. A full end-to-end DB assertion is left for central integration coverage.
