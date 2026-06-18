# Iteration 001: Correctness

## Focus

Reviewed Phase 009 BM25 symbol resolver behavior against the phase scope and concrete handler integration.

## Scorecard

- Dimensions covered: correctness
- Files reviewed: 4
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0

## Findings

### P0, Blocker

- None.

### P1, Required

- **F002**: BM25 symbol resolver does not cover ambiguous exact matches or context seed suggestions promised by phase scope. The phase scope says the resolver is used when exact equality fails or is ambiguous and for `code_graph_context` seed suggestions [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/009-codegraph-bm25-symbol-resolver/spec.md:72] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/009-codegraph-bm25-symbol-resolver/spec.md:94] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/009-codegraph-bm25-symbol-resolver/spec.md:103-105]. The implementation only calls BM25 suggestions after symbolId, fq_name, and name all miss, returning suggestions through the unresolved-subject error path [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/query.ts:448-484]. The context handler resolves seeds through `resolveSubjectToRef` and falls back empty when no subject ref exists, with no BM25 resolver integration [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:137-148].

```json
{
  "findingId": "F002",
  "claim": "Phase 009 promises BM25 help for ambiguous exact matches and context seed suggestions, but the implementation only exposes BM25 candidates when exact subject resolution fully misses.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/009-codegraph-bm25-symbol-resolver/spec.md:72",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/009-codegraph-bm25-symbol-resolver/spec.md:94",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/009-codegraph-bm25-symbol-resolver/spec.md:103-105",
    ".opencode/skills/system-code-graph/mcp_server/handlers/query.ts:448-484",
    ".opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:137-148"
  ],
  "counterevidenceSought": "Searched system-code-graph/mcp_server for BM25, symbolResolution, resolveSymbolBm25, suggestions, and context references; only query.ts and tests call the resolver.",
  "alternativeExplanation": "The implementation summary says context internals were intentionally not wired, so the fix may be a spec/task amendment rather than code. The checked phase scope still overstates delivered behavior.",
  "finalSeverity": "P1",
  "confidence": 0.84,
  "downgradeTrigger": "Downgrade to P2 if the Phase 009 spec is amended to explicitly limit delivery to unresolved-subject query fallback only.",
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
| spec_code | partial | hard | spec.md:72; query.ts:448-484 | Phase 009 scope is broader than implementation. |

## Assessment

- New findings ratio: 1.0
- Dimensions addressed: correctness
- Novelty justification: First pass discovered one new P1 implementation/scope gap.

## Ruled Out

- Exact-match weakening: exact symbolId, fq_name, and name paths still run before BM25 fallback [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/query.ts:420-484].

## Dead Ends

- No separate context-seed resolver integration was found by text search.

## Recommended Next Focus

Review security-sensitive guardrails around provenance, env flags, tombstone persistence, and trace payloads.
Review verdict: CONDITIONAL
