# Iteration 2: Security

## Focus
Security pass over path validation, session-id trust boundaries, governed-ingest scope and retention semantics, and embedder/job operational boundaries.

## Scorecard
- Dimensions covered: security
- Files reviewed: 8
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=1 P2=0
- New findings ratio: 0.00

## Findings

### P0, Blocker
- None.

### P1, Required
- **F001 refinement**: The governed-ingest propagation bug has security impact because memory rows have tenant/session/provenance/retention columns and retention sweep behavior keyed by `delete_after`, but scan/async ingest do not write the validated normalized metadata into those columns. This confirms P1 rather than P2. I did not escalate to P0 because `memory_ingest_start` rejects traversal and paths outside allowed roots, and `session_resume` rejects mismatched explicit `sessionId` when the transport provides a real caller session id. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1721`; SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1788`; SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-retention-sweep.ts:36`; SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:195`; SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:217`; SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/session-resume.ts:527`; SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/session-resume.ts:537`]

### P2, Suggestion
- None.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/003-mcp-session-index-schema/spec.md:40` | Security portion covered; full schema-to-handler parity remains open. |
| checklist_evidence | blocked | hard | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/003-mcp-session-index-schema/spec.md:7` | No checklist.md exists in this Level 1 slice. |

## Assessment
- New findings ratio: 0.00
- Dimensions addressed: security
- Novelty justification: no new finding IDs; F001 severity was validated against trust-boundary evidence.

## Ruled Out
- Path traversal via `memory_ingest_start`: the handler checks `..` path segments, resolves/realpaths inputs, and requires canonical targets under allowed memory roots. Evidence: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:195`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:217`.
- Cross-session targeted resume under HTTP/WS: `session_resume` rejects explicit `sessionId` values that differ from the caller context unless a permissive rollout env var is set. Evidence: `.opencode/skills/system-spec-kit/mcp_server/handlers/session-resume.ts:537`.
- Embedder name command/path injection: `embedder_set` trims, length-checks, and resolves the name through the manifest registry before queueing. Evidence: `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-set.ts:59`, `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-set.ts:63`.

## Dead Ends
- `validateInputLengths` does not inspect `paths[]`, but `memory_ingest_start` has its own per-path maximum length and cap, so this did not produce a separate finding.

## Recommended Next Focus
Traceability pass: compare every advertised option in `tool-schemas.ts` and strict Zod schemas against handler usage, with F001 as the known drift anchor.
Review verdict: CONDITIONAL
