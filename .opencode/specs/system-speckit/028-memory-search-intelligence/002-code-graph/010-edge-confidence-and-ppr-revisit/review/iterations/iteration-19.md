# Dimension

Rollback and flag-toggle correctness for `SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION` and `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING`.

# Files Reviewed

- `.opencode/skills/system-code-graph/mcp_server/lib/edge-confidence-flags.ts:7`
- `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1035`
- `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:88`
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:452`
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:637`
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:701`
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:1112`
- `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1047`
- `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:598`
- `.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:619`

# Findings by Severity

## P0

None.

## P1

### P1-019-001 [P1] Flag-off impact queries still consume differentiated confidence persisted while the flag was on

- Claim: The flag values are read fresh on the observed write and seeded-PPR query paths, but rollback is not behaviorally clean. After an operator enables `SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION`, scans, then disables it, the flag-off impact paths still rank, display, and in one blast-radius path filter by the differentiated `metadata.confidence` and `metadata.evidenceClass` values left in `code_edges`.
- Evidence: `isCodeGraphEdgeConfidenceDifferentiationEnabled()` reads `process.env` from its default parameter at call time, not module load time [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/edge-confidence-flags.ts:7`]. `extractEdges()` calls it per edge-extraction invocation [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1035`] and writes differentiated `CALLS` metadata when enabled [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1166`]. `resolveCrossFileCallEdges()` also calls it inside the transaction [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:88`] and writes 0.9/`EXTRACTED` or 0.3/`AMBIGUOUS` metadata only when enabled [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:145`, `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:159`]. But the flag-off `code_graph_context` impact branch still calls `rankContextEdges()` [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:1156`], whose rank score unconditionally adds `contextEdgeReliability(result.edge)` [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:637`]. That reliability unconditionally multiplies `metadata.confidence` by the `metadata.evidenceClass` factor [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:442`]. The output formatter also unconditionally returns `edge.metadata?.confidence ?? edge.weight` [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:813`]. Separately, the blast-radius dependency path parses metadata confidence unconditionally [SOURCE: `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1047`] and filters on it [SOURCE: `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1086`].
- Counterevidence sought: I checked whether the seeded-PPR gate itself was cached or whether the impact branch normalized confidence when the edge-confidence flag is off. `seededPprRankingEnabled()` reads `process.env` at call time [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:452`] and `shouldUseSeededPprRanking()` is called inside the impact branch [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:1112`], so the seeded-PPR path selection is fresh. I did not find an equivalent edge-confidence read or normalization in `rankContextEdges()`, `contextEdgeReliability()`, `formatContextEdge()`, or `parseEdgeMetadataConfidence()`.
- Alternative explanation: The team may intend persisted confidence to become canonical once written, independent of the runtime flag. That conflicts with this iteration's stated rollback contract that the flag-off path behave as if the scan had never happened with the flag on.
- Final severity: P1.
- Confidence: 0.89.
- Downgrade trigger: Downgrade to P2 or no finding if the intended product contract is changed so `SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION` gates writes only, and previously persisted confidence metadata is explicitly allowed to affect flag-off reads.
- Finding class: cross-consumer.
- Scope proof: Same stale metadata is consumed by `code_graph_context` rank/output code and by the blast-radius dependency confidence filter; both are read/query surfaces rather than write paths.
- Affected surface hints: `code_graph_context impact`, `rankContextEdges`, `blast-radius import dependents`, `scan rollback`, `partial reindex recovery`.
- Content hash: `p1-019-001-flag-off-consumes-stale-differentiated-confidence-v1`.

## P2

None.

# Traceability Checks

- Fresh edge-confidence flag reads: PASS for observed write paths. `extractEdges()` and `resolveCrossFileCallEdges()` call the flag helper at runtime rather than caching its value at module load.
- Fresh seeded-PPR flag reads: PASS for observed `code_graph_context` impact path. `shouldUseSeededPprRanking(mode)` is called inside the `impact` branch.
- Flag-off rollback equivalence: FAIL. Differentiated metadata written under the flag-on path remains in the database and is consumed without checking the flag.
- Mixed-state reindex risk: REAL. Full scans persist one file at a time [SOURCE: `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:598`], and each file's storage is atomic only at the per-file boundary [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:619`]. An interrupted flag-on scan can therefore leave some files with new confidence gradients while other files retain old constant metadata. Flag-on PPR treats the mixed values as real transition weights, while flag-off flat impact ranking still consumes the same mixed metadata through `contextEdgeReliability()`.

# Verdict

CONDITIONAL. The env reads are fresh, but rollback is not behaviorally pure because stale differentiated confidence data changes flag-off query behavior.

# Next Dimension

Verify whether the intended contract should treat confidence metadata as persisted canonical graph data or as an experimental read/write behavior that must be normalized behind `SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION`.
Review verdict: CONDITIONAL
