# Iteration 001: Correctness

## Focus
Dimension: correctness. Reviewed the VectorStore port contract, the better-sqlite implementation, fake implementation, and contract tests.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 3
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker
- None.

### P1, Required
- **F001**: BetterSqliteVectorStore ignores caller-supplied vector IDs. The port contract exposes `VectorRecord.id` and `get(id)`/`delete(id)` as the stable identifier API, and the fake stores records by that ID. The better-sqlite adapter accepts a `VectorRecord`, forwards `String(record.id)`, but the legacy branch builds `IndexMemoryParams` without that ID and delegates to `index_memory`, which allocates/uses memory-index IDs instead. A caller that upserts `{ id: "left" }` cannot reliably `get("left")` or `delete("left")` against the production adapter even though the fake supports it. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/vector-store.ts:175-187] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/vector-store.ts:215-233] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/fakes/storage-ports.ts:184-197]

```json
{
  "findingId": "F001",
  "claim": "BetterSqliteVectorStore does not preserve the caller-supplied VectorRecord.id as the key used by get/delete, unlike the fake implementation.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/vector-store.ts:175-187",
    ".opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/vector-store.ts:215-233",
    ".opencode/skills/system-spec-kit/mcp_server/tests/fakes/storage-ports.ts:184-197"
  ],
  "counterevidenceSought": "Checked the adapter upsert/get/delete methods, the fake VectorStore implementation, and the current vector contract test path that uses search-returned IDs instead of caller IDs.",
  "alternativeExplanation": "The adapter may intentionally expose the legacy memory_index numeric ID model, but that contradicts the new port interface and fake behavior, so the production port and fake are not substitutable.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade if the port contract is explicitly changed to document legacy memory_index IDs as authoritative and tests assert caller IDs are intentionally ignored.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

### P2, Suggestion
- None.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `.opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/vector-store.ts:175-233` | VectorStore exists, but keyed port substitution is not behaviorally equivalent between fake and production adapter. |

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: correctness
- Novelty justification: First pass found a production/fake contract mismatch with direct source evidence.

## Ruled Out
- GraphTraversal routing regression: MemoStore and causal-boost routing use the port and have equivalence/fake tests; reserved for maintainability pass.

## Dead Ends
- No P0 evidence found in this pass.

## Recommended Next Focus
Security review of maintenance and contention ports.
Review verdict: CONDITIONAL
