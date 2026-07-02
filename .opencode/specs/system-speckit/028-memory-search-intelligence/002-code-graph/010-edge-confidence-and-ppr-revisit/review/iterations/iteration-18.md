# Deep Review Iteration 18

## Dimension

Confidence-value internal consistency audit for edge metadata consumers.

Budget profile: adjudicate, targeted at 8-10 calls.

Scope: `mcp_server/lib` edge-confidence and evidence-class producers and consumers, plus focused test evidence for trace semantics.

## Files Reviewed

- `.opencode/skills/system-code-graph/mcp_server/lib/indexer-types.ts:38-48` - Local `CodeEdgeMetadata` evidence-class contract.
- `.opencode/skills/system-code-graph/mcp_server/lib/shared/shared-payload.ts:33-67` - Separate shared-payload edge-enrichment vocabulary, not the graph indexer edge metadata type.
- `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:148-182` - Differentiated CALLS metadata writer for `0.75/INFERRED` and `0.35/AMBIGUOUS`.
- `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1153-1168` - CALLS edge metadata selection under the differentiation flag.
- `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:47-65` - Metadata update helper preserving/writing confidence and evidence class.
- `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:144-160` - Cross-file differentiated writes for `0.9/EXTRACTED` and `0.3/AMBIGUOUS`.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:121-137` - Trace shape and context evidence-class rank factors.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:437-475` - `contextEdgeReliability` and transition-weight fallback logic.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:813-829` - Edge metadata formatting used by context output.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:921-981` - `why_included` trace ambiguity derivation.
- `.opencode/skills/system-code-graph/mcp_server/lib/query-result-adapter.ts:166-195` - Adapter pass-through for `confidence` and `evidenceClass`.
- `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-context-handler.vitest.ts:376-462` - Existing test expectation that `INFERRED` edges mark trace entries ambiguous.
- `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-context-handler.vitest.ts:579-612` - Existing coverage distinguishes `INFERRED` from `STRUCTURED` but does not cover `AMBIGUOUS`.

## Findings by Severity

### P0

None.

### P1

#### P1-018-001 - `AMBIGUOUS` evidence no longer sets `why_included.ambiguous`

File: `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:953-956`

Claim: The trace consumer still derives the `why_included[].ambiguous` boolean with `formattedEdge.evidenceClass === 'INFERRED'`, so newly differentiated CALLS edges marked `AMBIGUOUS` are emitted with an `AMBIGUOUS` edge-chain step but the containing file-level trace entry is not marked ambiguous.

Evidence: `ContextWhyIncluded` exposes an `ambiguous` boolean at `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:121-127`; new producers emit `AMBIGUOUS` for multi-candidate CALLS at `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:179-182` and `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:158-160`; the trace writer only checks `INFERRED` at `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:953-956`; tests assert the intended uncertain-edge behavior for `INFERRED` only at `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-context-handler.vitest.ts:579-612`.

Counterevidence sought: I checked `contextEdgeReliability` and confirmed `AMBIGUOUS` is intentionally ranked lower than `INFERRED` at `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:132-137` and used by `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:442-449`, so ranking is not the broken consumer. I also checked the query adapter at `.opencode/skills/system-code-graph/mcp_server/lib/query-result-adapter.ts:166-195`; it passes `evidenceClass` through and does not reinterpret ambiguity.

Alternative explanation: The field could have been intended to mean only inferred, not ambiguous. The nearby comment contradicts that narrower reading by describing heuristic/inferred uncertainty and the field itself is named `ambiguous`; after the new producer emits an explicit `AMBIGUOUS` class, excluding it makes the trace less conservative than the edge metadata it carries.

Final severity: P1.

Confidence: 0.86.

Downgrade trigger: Downgrade to P2 if the public contract is clarified so `why_included.ambiguous` deliberately means only `INFERRED`, or if no `includeTrace:true` consumer relies on the boolean and all consumers inspect `edgeChain[].evidenceClass` directly.

Finding class: cross-consumer.

Scope proof: Scoped grep across `mcp_server/lib` for `EdgeEvidenceClass|evidenceClass|contextEdgeReliability|\.confidence\b|confidence:` found the rank-blend consumer, the trace consumer, the adapter pass-through, and producer sites; no other in-scope consumer reinterprets `AMBIGUOUS` as non-ambiguous.

Affected surface hints: `code_graph_context includeTrace`, `why_included trace consumers`, `edge-confidence differentiation flag`, `CALLS edge metadata`.

Content hash: `code-graph-context.ts:953-956:ambiguous-evidenceclass-not-flagged:v1`.

### P2

None.

## Traceability Checks

- Edge evidence type coverage: PASS. The graph-local type is exactly `EXTRACTED | INFERRED | AMBIGUOUS` at `.opencode/skills/system-code-graph/mcp_server/lib/indexer-types.ts:41-48`; no missing fourth graph-local value was found.
- Shared-payload vocabulary: NOT APPLICABLE to this producer path. `.opencode/skills/system-code-graph/mcp_server/lib/shared/shared-payload.ts:33-67` defines a separate `GraphEdgeEnrichment.edgeEvidenceClass` vocabulary and is not the `CodeEdgeMetadata.evidenceClass` used by these CALLS edges.
- Confidence range assumptions: PASS. `contextEdgeReliability` clamps arbitrary confidence into `0..1` at `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:437-449`; the new `0.9`, `0.75`, `0.35`, and `0.3` values are in-range.
- Confidence distribution assumptions: PASS with caveat. The existing rank factors already distinguish `EXTRACTED`, `INFERRED`, and `AMBIGUOUS` at `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:132-137`; no `>=0.5` assumption was found in `contextEdgeReliability`.
- Other consumers: CONDITIONAL. `query-result-adapter.ts` passes metadata through safely, while `code-graph-context.ts` trace ambiguity logic mishandles the new explicit `AMBIGUOUS` class.

## Verdict

CONDITIONAL. No type-contract or rank-blend blocker was found, but one downstream trace consumer now has an internal consistency bug with the new `AMBIGUOUS` evidence class.

## Next Dimension

Continue under `stopPolicy=max-iterations` with a different integration angle: audit whether seeded-PPR ranking and context output tests cover mixed `EXTRACTED`/`INFERRED`/`AMBIGUOUS` edge metadata together, without re-emitting active P1-001, P1-002, P1-003, or P1-007.

Review verdict: CONDITIONAL
