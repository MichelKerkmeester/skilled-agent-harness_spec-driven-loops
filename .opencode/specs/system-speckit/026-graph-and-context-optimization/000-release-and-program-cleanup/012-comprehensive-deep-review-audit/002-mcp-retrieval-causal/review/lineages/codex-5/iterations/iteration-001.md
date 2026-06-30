# Iteration 1: Correctness - Causal Edge Integrity

## Focus

Dimension: correctness.

Files reviewed:
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`

## Scorecard

- Dimensions covered: correctness
- Files reviewed: 3
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.45

## Findings

### P1, Required

- **F001**: Causal edge writers can create edges to the wrong or non-existent memory record. The public `memory_causal_link` handler validates only presence and relation before calling `insertEdge` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:701`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:745`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:757`]. The storage layer explicitly defers foreign-key validation [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:279`] and then inserts the edge directly [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:344`]. The automatic processor has a second integrity path: title and fuzzy fallback resolution query `memory_index` globally and pick the latest matching row [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:264`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:290`]. A typo, stale title, or duplicated title can therefore create orphan or incorrect lineage edges instead of failing closed.

## Claim Adjudication Packets

```json
{
  "findingId": "F001",
  "claim": "Causal edge creation accepts endpoints without proving both endpoints resolve to the intended memory records, allowing orphan or wrong-target edges.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:701",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:757",
    ".opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:279",
    ".opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:344",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:264",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:290"
  ],
  "counterevidenceSought": "Read the public causal handler, automatic causal-link processor, and storage insert path; searched for endpoint existence or scope validation around insertEdge and reference resolution.",
  "alternativeExplanation": "The storage comment says FK validation was deferred for tests, but the public handler still represents the tool as linking spec-doc records, so production calls need handler-level validation even if storage stays test-friendly.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade if the dispatcher proves all sourceId, targetId, and auto-extracted references are prevalidated against memory_index and scoped before reaching these handlers.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/002-mcp-retrieval-causal/spec.md:38` | Correctness dimension started; causal edge integrity does not meet the safety expectation for causal graph query correctness. |
| checklist_evidence | pending | hard | - | No checklist file reviewed in this iteration. |

## Assessment

- New findings ratio: 0.45
- Dimensions addressed: correctness
- Novelty justification: first correctness pass found a concrete graph-integrity failure with direct insert-path evidence.

## Ruled Out

- SQL injection in the causal auto-processor path: dynamic `IN` clauses are constructed from placeholders, not interpolated values [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:133`].

## Dead Ends

- Direct storage-only fix: storage is intentionally test-permissive, so the safer fix likely belongs in public handler validation and scoped auto-resolution.

## Recommended Next Focus

Security pass over scoped retrieval fallback and causal graph ID-only access.

Review verdict: CONDITIONAL
