# Iteration 1: Correctness

## Focus
Correctness pass across MCP entrypoint dispatch, strict input schemas, memory index/ingest handlers, session resume/bootstrap/health, and embedder management.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 12
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker
- None.

### P1, Required
- **F001**: Governed ingest metadata is accepted and validated, then discarded on scan/async ingest paths — `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:455` and `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:263` — `memory_index_scan` and `memory_ingest_start` accept governance fields through the strict schema, and their handlers call `validateGovernedIngest`, but the scan path calls `indexSingleFile` without scope/provenance options while the async ingest job persists only `id`, `state`, `spec_folder`, paths, progress, errors, and timestamps. The worker later calls only `processFileFn(nextPath)`, and the configured process function indexes the file without the validated governance metadata. A caller can therefore provide a complete governed-ingest request, receive successful validation, and still produce rows without the requested tenant/session/provenance/retention metadata. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:455`; SOURCE: `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:472`; SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:330`; SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:721`; SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:146`; SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:263`; SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:268`; SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:627`; SOURCE: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2074`]

```json
{
  "findingId": "F001",
  "claim": "Governed ingest metadata accepted by memory_index_scan and memory_ingest_start is not propagated to the indexing write paths, so tenant/session/provenance/retention fields can be silently dropped.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:455",
    ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:472",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:721",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:263",
    ".opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:268",
    ".opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:627",
    ".opencode/skills/system-spec-kit/mcp_server/context-server.ts:2074"
  ],
  "counterevidenceSought": "Checked memory-index ScanArgs and indexSingleFile wrapper, memory-ingest job creation, job table columns, queue worker processing, context-server queue initialization, and memory_save governance application for an alternate propagation path.",
  "alternativeExplanation": "The fields could be validation-only opt-ins, but the governance helper explicitly returns normalized persistence fields and memory_save applies them post-insert; accepting equivalent fields on scan/ingest while dropping them violates the same governed-ingest contract.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade if scan/ingest are intentionally documented as validation-only surfaces or if a follow-up path is shown to apply buildGovernancePostInsertFields for these jobs after indexing.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery from schema-to-handler propagation review" }
  ]
}
```

### P2, Suggestion
- None.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/003-mcp-session-index-schema/spec.md:40` | Correctness portion covered; full schema-to-handler parity continues in traceability iteration. |
| checklist_evidence | blocked | hard | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/003-mcp-session-index-schema/spec.md:7` | Level 1 slice has no checklist.md. |

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: correctness
- Novelty justification: one new P1 with direct evidence across schema, handler, queue storage, and worker execution.

## Ruled Out
- Dispatch coverage gap: listed session/index/ingest/embedder tools route through `dispatchTool` and lifecycle/memory dispatchers. Evidence: `.opencode/skills/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:39`, `.opencode/skills/system-spec-kit/mcp_server/tools/memory-tools.ts:44`.
- Caller-context drop: `dispatchTool` does not pass the parameter to dispatchers, but `context-server` wraps the call in `runWithCallerContext`, and `session_resume` reads AsyncLocalStorage via `getCallerContext`. Evidence: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1133`, `.opencode/skills/system-spec-kit/mcp_server/handlers/session-resume.ts:527`.
- Embedder active pointer premature flip: the reindex path stages vector writes and only swaps the active shard/pointer after successful completion. Evidence: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:511`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:662`.

## Dead Ends
- No `session_learning` public tool drift in this slice; the file backs `task_preflight`, `task_postflight`, and `memory_get_learning_history`, which are routed outside the named session tools.

## Recommended Next Focus
Security pass over path handling, scope enforcement, retention semantics, and session-id trust boundaries.
Review verdict: CONDITIONAL
