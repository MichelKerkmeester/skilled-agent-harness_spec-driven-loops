# Dimension

Correctness audit of `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts`, focused on the confidence-differentiation write path inside `resolveCrossFileCallEdges`.

# Files Reviewed

- `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:84-169`
- `.opencode/skills/system-code-graph/mcp_server/lib/edge-confidence-flags.ts:5-11`
- `.opencode/skills/system-code-graph/mcp_server/lib/indexer-types.ts:41-49`
- `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-cross-file-edges.vitest.ts:132-282`
- `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-cross-file-edges.vitest.ts:306-392`
- `.opencode/skills/sk-code-review/references/review_core.md:28-49`

# Findings by Severity

## P0

No new P0 findings.

## P1

### P1-007 [P1] Name-only cross-file resolution is promoted to extracted confidence

- Claim: With `SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION=true`, the resolver assigns `confidence: 0.9` and `evidenceClass: "EXTRACTED"` when exactly one same-name callable exists outside the importing file, even though the resolver does not validate that the candidate came from the import declaration's target module. A single unrelated same-name callable can therefore receive extracted-grade confidence silently.
- Evidence: `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:133-148` builds candidates only from `edge.import_name`, filters out the importing file, then treats `candidates.length === 1` as resolved. `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:145-150` writes `0.9` / `EXTRACTED` for that resolved branch when the flag is enabled. `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:105-115` selects only import name and import file path, not the import specifier's resolved module path. The flag itself is only the literal env check in `.opencode/skills/system-code-graph/mcp_server/lib/edge-confidence-flags.ts:7-10`, so this over-classification is specific to the enabled path.
- Counterevidence sought: I checked whether the resolver selected or compared a resolved import target path before the confidence write; it does not in the reviewed query or candidate filter. I also checked focused tests for a mismatch case where the only same-name callable is not the imported module; existing tests cover happy-path resolution, ambiguous same-name candidates, enabled ambiguous metadata, same-file stability, and fixture-name disambiguation, but not this mismatch.
- Alternative explanation: The implementation may intentionally use global name uniqueness as sufficient for target rewriting. Even under that policy, the evidence class and confidence should reflect heuristic inference rather than extracted certainty unless the import target path is validated.
- Final severity: P1.
- Confidence: 0.82.
- Downgrade trigger: Downgrade to P2 if a separate invariant guarantees import nodes are only created when the imported module's concrete callable was scanned and is the only candidate, or if downstream seeded-PPR ignores `confidence`/`evidenceClass` from resolver-written metadata.
- Finding class: algorithmic.

## P2

No new P2 findings.

# Traceability Checks

- Resolved/ambiguous/unresolved classification: The branch split is internally consistent for raw candidate counts. Zero candidates increments `unresolved`; more than one candidate increments `ambiguousSkipped`; exactly one candidate increments `resolved`.
- Flag gating: The new metadata write path is gated. `updateTargetAndMetadata.run(...)` and `updateMetadata.run(...)` are both inside `if (confidenceDifferentiationEnabled)` branches in `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:145-161`; with the flag off, the resolved path uses `updateTarget.run(...)` only and the ambiguous path does not write metadata.
- SQL safety: The update statements use positional placeholders (`?`) for target ids, metadata JSON, and edge ids in `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:117-131`; I did not find string interpolation in the update statements.
- Candidate-list edge cases: Same-file call targets are excluded from resolver activity and covered by `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-cross-file-edges.vitest.ts:306-336`. Ambiguous multi-candidate cases remain on the import node and receive low confidence only when the flag is enabled. The uncovered edge is a single global same-name candidate from a different module than the import declaration, which can be resolved and promoted as extracted confidence.

# Verdict

CONDITIONAL due to one new P1 correctness finding in the enabled confidence-differentiation path.

# Next Dimension

Recommended next pass: focused regression-test audit for resolver mismatch cases, especially import-target path mismatch under enabled edge confidence differentiation.

Review verdict: CONDITIONAL
