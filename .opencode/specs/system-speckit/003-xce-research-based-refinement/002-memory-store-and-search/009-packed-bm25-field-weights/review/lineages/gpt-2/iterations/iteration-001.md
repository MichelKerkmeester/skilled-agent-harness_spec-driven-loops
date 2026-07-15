# Iteration 1: Correctness

## Focus
Correctness review of the packed in-memory BM25 implementation and the budget gate evidence.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 4
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker
- None.

### P1, Required
- **F001**: Warmup/RSS gate uses synthetic repeated filler instead of the full current corpus. REQ-001 requires the packed engine to warm the full current corpus within 150 MB RSS and 10 s [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-packed-bm25-field-weights/spec.md:102]. The only executable budget gate loops over `iterateCorpusSizedDocuments()` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/bm25-packed-inmemory.vitest.ts:117], and that generator builds every document from the same `sharedBody` derived from repeated stop-word filler plus only 97 trigger variants [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/eval/fixtures/bm25-packed-fixture.ts:102]. This proves a synthetic 10,245-document fixture, not the real current corpus term distribution required by the spec.

#### Claim Adjudication Packet: F001
```json
{
  "findingId": "F001",
  "claim": "The recorded warmup/RSS gate does not prove REQ-001 because the test uses a generated repeated-filler fixture rather than the full current corpus named in the requirement.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-packed-bm25-field-weights/spec.md:102",
    ".opencode/skills/system-spec-kit/mcp_server/tests/bm25-packed-inmemory.vitest.ts:117",
    ".opencode/skills/system-spec-kit/mcp_server/lib/eval/fixtures/bm25-packed-fixture.ts:102"
  ],
  "counterevidenceSought": "Read the packet verification docs, the packed budget test, and the packed fixture generator. Searched for alternate current-corpus budget evidence and only found the same fixture-backed numbers.",
  "alternativeExplanation": "The synthetic fixture may intentionally approximate current corpus byte size. That does not satisfy the wording 'full current corpus' because term diversity and postings shape drive memory use.",
  "finalSeverity": "P1",
  "confidence": 0.86,
  "downgradeTrigger": "Downgrade to P2 if a replayable current-corpus export or measurement artifact is added, or if REQ-001 is explicitly narrowed to synthetic byte-size fixture validation.",
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
| spec_code | partial | hard | `spec.md:102`, `tests/bm25-packed-inmemory.vitest.ts:117`, `fixtures/bm25-packed-fixture.ts:102` | Implementation exists, but the budget proof is fixture-only. |

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: correctness
- Novelty justification: Found one requirement-level proof gap with direct spec/test/fixture evidence.

## Ruled Out
- P0 severity: no direct evidence that production ranking or daemon warmup fails, only that the release gate is under-proven.

## Dead Ends
- Live-corpus measurement artifact: not present in the reviewed packet.

## Recommended Next Focus
Security review of engine routing and query/search surfaces.
Review verdict: CONDITIONAL
