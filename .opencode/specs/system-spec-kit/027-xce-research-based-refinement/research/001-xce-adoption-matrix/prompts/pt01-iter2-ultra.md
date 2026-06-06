Deep-research iter 2/10 for packet .opencode/specs/system-spec-kit/027-xce-research-based-refinement.

READ FIRST: <packet>/spec.md (9 RQs + scope), <packet>/research/iterations/iteration-001.md (iter 1 findings on RQ1).

ITER 2 FOCUS: RQ2 Trace Tool Design. Define inputs/outputs for a new code_graph_trace tool that walks symbol -> file -> package -> repo. Examine our current edge table schema in mcp_server/code_graph/lib/code-graph-db.ts and indexer-types.ts. Compare against XCE xce_trace API surface in external/README.md. Determine: does our existing edge table store enough hierarchy to support trace, or is a schema delta required?

WRITE 3 ARTIFACTS:
1. <packet>/research/iterations/iteration-002.md (sections: Focus, Actions with file:line cites, Findings with file:line evidence, Q-Answered, Q-Remaining, Next-Focus)
2. APPEND to <packet>/research/deep-research-state.jsonl one line: {"type":"iteration","iteration":2,"newInfoRatio":<0..1>,"status":"complete","focus":"RQ2"}
3. <packet>/research/deltas/iter-002.jsonl (multi-line: 1 iteration record + one or more {"type":"finding","id":"f-iter002-NNN","severity":"P0|P1|P2","label":"...","iteration":2})

CONSTRAINTS: LEAF agent. Max 12 tool calls. read-only against external/, mcp_server/. write only research/. Cite file:line for every claim.

DELIVERABLES expected:
- ≥2 file:line cites from external/README.md describing xce_trace
- ≥2 file:line cites from mcp_server/code_graph/ on edge schema
- Verdict: ADOPT / ADAPT / DEFER / SKIP for code_graph_trace, with rationale
- Schema delta required? yes/no with details
- Estimated LOC for tool + schema work

NEXT iter focus: RQ3 Impact Analysis Schema (risk signals computable deterministically vs LLM-scored).
