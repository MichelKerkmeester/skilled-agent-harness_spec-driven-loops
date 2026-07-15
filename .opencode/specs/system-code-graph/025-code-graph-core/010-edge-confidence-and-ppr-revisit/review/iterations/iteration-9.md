# Dimension

Correctness audit of `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts`, focused on `buildDifferentiatedCallsEdgeMetadata` and its gated same-file `CALLS` call site behind `SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION`.

# Files Reviewed

- `.agents/skills/deep-loop-workflows/deep-review/SKILL.md:175` - iteration artifact and verdict contract.
- `.agents/skills/sk-code-review/references/review_core.md:28` - severity doctrine loaded before final calls.
- `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:148` - shared edge metadata builder and evidence-class branching.
- `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:175` - full `buildDifferentiatedCallsEdgeMetadata` function.
- `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1021` - `extractEdges` setup, `nodesByName`, and flag read.
- `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1051` - `preferredKinds` same-name target selection.
- `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1140` - same-file `CALLS` extraction loop and gated metadata call site.
- `.opencode/skills/system-code-graph/mcp_server/lib/indexer-types.ts:42` - `EdgeEvidenceClass` type definition.
- `.opencode/skills/system-code-graph/mcp_server/lib/edge-confidence-flags.ts:7` - strict default-off flag parser.
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:326` - flag documentation and legacy behavior summary.
- `.opencode/specs/system-code-graph/025-code-graph-core/010-edge-confidence-and-ppr-revisit/decision-record.md:62` - intended same-file candidate-cardinality mapping.
- `.opencode/specs/system-code-graph/025-code-graph-core/010-edge-confidence-and-ppr-revisit/spec.md:167` - zero-candidate default-tier boundary.
- `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-cross-file-edges.vitest.ts:306` - same-file resolver-pass regression coverage adjacent to this path.

# Findings by Severity

## P0

None.

## P1

No new P1 findings.

## P2

No new P2 findings.

# Traceability Checks

- Candidate cardinality: PASS. `buildDifferentiatedCallsEdgeMetadata` filters `candidate.symbolId !== callerSymbolId` before evaluating `matchingCandidates.length > 1`, so the caller's own symbol is not counted as an ambiguity candidate. Recursive calls do not exercise this helper because the upstream `CALLS` loop skips `calledName === caller.name`; that is an existing extraction boundary, not a new differentiated-metadata defect.
- Numeric confidence and evidence class: PASS. The same-file single-candidate path returns `0.75/INFERRED`; the multi-candidate path returns `0.35/AMBIGUOUS`. Both evidence strings are valid members of `EdgeEvidenceClass` in `indexer-types.ts`, and `buildEdgeMetadata` handles both branches.
- Call-site coverage: PASS with boundary. When the flag is enabled, every same-file `CALLS` edge that reaches `edges.push` uses `buildDifferentiatedCallsEdgeMetadata`; with the flag disabled, it preserves legacy `0.8/INFERRED/heuristic`. Calls that the existing extractor never emits, including same-name recursive calls, remain outside this helper.
- Duplicate-name scopes: PASS with expected ambiguity. Multiple same-name functions or methods in a file are grouped by `nodesByName`, and the helper lowers confidence to ambiguous after excluding the caller. The target selection remains first-match/name-based through `preferredKinds`, but the new metadata correctly reflects that ambiguity instead of claiming the default uniform confidence.
- Prior findings: No duplicate emitted. This iteration does not re-emit P1-001, P1-002, P1-003, P2-004, P2-005, or P2-006. Active prior P1s keep the overall review verdict conditional.

# Verdict

CONDITIONAL. This focused audit found no new defect in the same-file confidence-differentiation helper or gated call site, but the review packet still has active prior P1 findings outside this dimension.

# Next Dimension

Continue with the scheduled batch dimensions without merging this iteration into shared state manually. The orchestrator should merge `review/deltas/iter-009.jsonl` after the parallel batch completes.

Review verdict: CONDITIONAL
