Deep-research iter 3/10 for packet .opencode/specs/system-spec-kit/027-xce-research-based-refinement.

READ FIRST: <packet>/spec.md, <packet>/research/iterations/iteration-001.md, iteration-002.md.

ITER 3 FOCUS: RQ3 Impact Analysis Schema. XCE's xce_impact_analysis (external/README.md) returns changed-file set + downstream affected modules + risk assessment. Our local cross-file-edge-resolver and detect_changes (mcp_server/code_graph/lib/cross-file-edge-resolver.ts, change-detector.ts) walk edges but don't synthesize risk-scored payload.

QUESTION: Which risk signals can we compute deterministically from existing graph data (fan-in count, hub centrality, edge-drift score, test-coverage gap), and which would require LLM scoring? Goal: deterministic baseline first, optional LLM enrichment later.

WRITE 3 ARTIFACTS:
1. <packet>/research/iterations/iteration-003.md (sections: Focus, Actions with file:line cites, Findings, Q-Answered, Q-Remaining, Next-Focus)
2. APPEND to <packet>/research/deep-research-state.jsonl: {"type":"iteration","iteration":3,"newInfoRatio":<0..1>,"status":"complete","focus":"RQ3"}
3. <packet>/research/deltas/iter-003.jsonl (1 iteration record + findings with verdicts)

CONSTRAINTS: LEAF, max 12 tool calls, read-only against external/+mcp_server/, write only research/, file:line cites for every claim.

DELIVERABLES:
- ≥2 file:line cites from external/README.md on xce_impact_analysis
- ≥2 file:line cites from mcp_server/code_graph/lib/ on edge resolution
- Risk-signal table: signal | deterministic-from-graph | LLM-needed | rationale
- Verdict: ADOPT / ADAPT / DEFER / SKIP for code_graph_impact_analysis
- Estimated LOC for tool work

NEXT iter focus: RQ4 Get-Context Combiner (single-tool entry vs folded-into-context payload).
