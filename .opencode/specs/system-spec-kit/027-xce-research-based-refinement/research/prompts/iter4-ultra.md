Deep-research iter 4/10 for packet .opencode/specs/system-spec-kit/027-xce-research-based-refinement.

READ FIRST: <packet>/spec.md, prior iter findings (iteration-001/002/003.md).

ITER 4 FOCUS: RQ4 Get-Context Combiner. XCE's xce_get_context (external/README.md) is an omnibus first-call combiner that fetches search + arch + trace at task entry. Our existing code_graph_context (mcp_server/code_graph/handlers/context.ts, lib/code-graph-context.ts) is per-target. Question: should we ship a NEW code_graph_context_omni tool, or FOLD the omnibus capability into the existing code_graph_context payload?

Examine: existing budget-allocator.ts payload-size budget logic. What's the per-call payload-size cap? What's the trade-off between one big response vs separate tool calls? Cite file:line.

WRITE 3 ARTIFACTS:
1. <packet>/research/iterations/iteration-004.md (sections: Focus, Actions, Findings, Q-Answered, Q-Remaining, Next-Focus)
2. APPEND to <packet>/research/deep-research-state.jsonl: {"type":"iteration","iteration":4,"newInfoRatio":<0..1>,"status":"complete","focus":"RQ4"}
3. <packet>/research/deltas/iter-004.jsonl

CONSTRAINTS: LEAF, max 12 tool calls, read-only against external/+mcp_server/, write only research/, file:line cites for every claim.

DELIVERABLES:
- ≥2 file:line cites from external/README.md on xce_get_context
- ≥2 file:line cites from mcp_server/code_graph/lib/budget-allocator.ts and handlers/context.ts
- Decision: NEW tool vs FOLD-IN, with payload-size budget rationale
- Verdict: ADOPT / ADAPT / DEFER / SKIP
- Estimated LOC

NEXT iter focus: RQ5 PRAT Reverse-Engineering (most-likely PRAT pipeline from public clues; map stages to local files).
