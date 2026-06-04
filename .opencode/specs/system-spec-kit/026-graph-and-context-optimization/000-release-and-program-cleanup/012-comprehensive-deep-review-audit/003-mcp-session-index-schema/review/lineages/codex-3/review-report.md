# Deep Review Report

## Executive Summary
Verdict: CONDITIONAL. The loop found no P0 findings, but it accepted two P1 governance/traceability issues and two P2 playbook drift issues. Release readiness is release-blocking until F001 and F002 are remediated or deliberately reclassified by an updated contract.

## Planning Trigger
The user requested a fan-out deep-review lineage for `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/003-mcp-session-index-schema`, with artifacts bound directly to `review/lineages/codex-3`. The requested executor was `cli-codex model=gpt-5.5`; this runtime is already Codex, so nested Codex CLI dispatch was not used.

## Active Finding Registry
| ID | Severity | Title | Primary Evidence |
|----|----------|-------|------------------|
| F001 | P1 | `retentionPolicy: "ephemeral"` does not trigger governed-ingest enforcement | `scope-governance.ts:225-230`, `scope-governance.ts:235-242`, `scope-governance.ts:261-280`, `memory-save.ts:3051-3061`, `memory-save.ts:3196-3200`, `scope-governance.ts:325-348` |
| F002 | P1 | Bulk scan and async ingest accept governance fields but drop them before indexing | `tool-input-schemas.ts:455-462`, `tool-input-schemas.ts:596-598`, `memory-index.ts:278-292`, `memory-index.ts:721-725`, `memory-ingest.ts:263-267`, `job-queue.ts:45-55`, `job-queue.ts:253-295`, `job-queue.ts:624-628`, `context-server.ts:2074-2077`, `memory-save.ts:3393-3400` |
| F003 | P2 | Session bootstrap playbook documents removed `input` and `includeGraphStatus` parameters | `tool-input-schemas.ts:608`, `tool-schemas.ts:653-660`, `032-session-bootstrap-reader-ready-context.md:37` |
| F004 | P2 | Session resume playbook expects `codeGraph.available` and `binaryPath` fields not returned by the handler | `session-resume.ts:104-110`, `session-resume.ts:710-723`, `333-session-resume.md:18-22`, `333-session-resume.md:91-100` |

## Remediation Workstreams
1. Fix governed-retention enforcement. Make any provided `retentionPolicy` trigger governed-ingest validation, and require explicit future `deleteAfter` plus tenant/session/provenance for ephemeral rows unless the contract is intentionally changed.
2. Propagate governance metadata through bulk scan and async ingest. `memory_index_scan` should pass normalized governance scope into `indexMemoryFile`; `memory_ingest_start` needs job persistence or side-table state so the worker can apply the same metadata per file.
3. Align manual playbooks with live session contracts. Update the bootstrap call to `specFolder` only, and either update session resume expectations to freshness/count fields or add the documented fields to the handler contract.

## Spec Seed
The target spec calls for a read-only audit of MCP session lifecycle, incremental indexing, ingest, embedder management, context-server entrypoint/dispatch, and schema layers. The audit treated schema-to-handler parity and documented call-shape drift as priority targets.

## Plan Seed
- Iteration 1 covered correctness across dispatch and session/embedder handlers.
- Iteration 2 covered security and accepted F001.
- Iteration 3 covered traceability/schema parity and accepted F002-F004.
- Iteration 4 covered maintainability and found no separate new issue beyond F002's queue/schema implications.
- Iteration 5 stabilized the registry with no new P0/P1 findings.

## Traceability Status
| Protocol | Status | Notes |
|----------|--------|-------|
| `spec_code` | complete | In-scope implementation files were inspected with direct file reads and `rg`. |
| `checklist_evidence` | not applicable | The target packet has no `checklist.md`. |
| `feature_catalog_code` | complete | Relevant feature catalog hits were checked; no accepted feature catalog finding. |
| `playbook_capability` | complete | F003 and F004 record accepted playbook drift. |

## Deferred Items
- No implementation changes were made by this lineage.
- No database or MCP runtime integration tests were run; this was a source-level review.
- Code Graph was unavailable, so structural relationships were validated by direct reads rather than graph queries.

## Audit Appendix
- Artifact root was bound directly to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/003-mcp-session-index-schema/review/lineages/codex-3`.
- `resolveArtifactRoot` was intentionally not run.
- `resource_map_present` was false for the target packet; the Resource Map Coverage Gate section is omitted by protocol, and a lineage-local `resource-map.md` was emitted for reviewed resources.
- Iteration verdicts: PASS, CONDITIONAL, CONDITIONAL, CONDITIONAL, CONDITIONAL.
