# Iteration 003: Traceability

## Focus
Dimension: traceability. Compared spec/tasks/implementation-summary completion claims against the shipped VectorStore adapter and contract tests.

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 5
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker
- None.

### P1, Required
- **F002**: VectorStore.clear removes memory rows, not only vector records. The port interface describes `clear()` as removing vector records, but the production adapter deletes the active vector table, `active_memory_projection`, and the entire `memory_index` table in one transaction. That is broader than a vector-store abstraction and can delete non-vector memory metadata if used outside an isolated test database. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/vector-store.ts:95-96] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/vector-store.ts:264-271]

```json
{
  "findingId": "F002",
  "claim": "BetterSqliteVectorStore.clear deletes memory_index rows even though the VectorStore contract says clear removes vector records.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/vector-store.ts:95-96",
    ".opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/vector-store.ts:264-271"
  ],
  "counterevidenceSought": "Checked the VectorStore interface text, the production clear implementation, and current contract tests for a non-vector memory_index preservation assertion.",
  "alternativeExplanation": "The legacy vector store may have historically owned memory_index, but the new port name and interface narrow the abstraction to vector records, so deleting all memory rows is an unsafe contract boundary.",
  "finalSeverity": "P1",
  "confidence": 0.84,
  "downgradeTrigger": "Downgrade if the port is renamed/documented as the full memory-index store and clear is explicitly specified to wipe memory_index plus projections.",
  "transitions": [
    { "iteration": 3, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

### P2, Suggestion
- **F003**: Contract tests do not exercise caller-ID parity or non-vector clear boundaries. The current VectorStore contract retrieves and deletes using IDs returned from search, not the caller-supplied ID inserted in the same test, and the clear test only checks that search is empty afterward. This lets F001 and F002 pass the contract suite. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/storage-ports-contract.vitest.ts:301-304] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/storage-ports-contract.vitest.ts:310-325]

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/015-storage-adapter-ports/spec.md:74-77`; `.opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/vector-store.ts:175-233` | Five ports exist, but VectorStore contract behavior is not fully substitutable. |
| checklist_evidence | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/015-storage-adapter-ports/tasks.md:69-71`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/015-storage-adapter-ports/implementation-summary.md:146-173` | Verification evidence is broad, but the vector port contract tests miss two contract-boundary assertions. |

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: traceability
- Novelty justification: Found one new required contract-scope issue and one test gap that explains why it was not caught.

## Ruled Out
- Completion-doc fabrication: targeted verification evidence is present in implementation-summary.md; the issue is coverage granularity, not absent evidence.

## Dead Ends
- No resource-map coverage gate ran because no packet `resource-map.md` was present at init.

## Recommended Next Focus
Maintainability review of graph traversal routing and residual coupling decisions.
Review verdict: CONDITIONAL
