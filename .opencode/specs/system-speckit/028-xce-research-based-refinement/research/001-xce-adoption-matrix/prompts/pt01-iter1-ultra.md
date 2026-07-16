Deep-research iter 1/10 for packet .opencode/specs/system-spec-kit/027-xce-research-based-refinement.

READ FIRST: <packet>/spec.md (has 9 RQs + scope + constraints).

ITER 1 FOCUS: RQ1 Architectural Context Gap. Compare XCE xce_architecture_context payload (from external/README.md) vs our code_graph_context payload (from .opencode/skills/system-spec-kit/mcp_server/code_graph/). Diff fields. Propose minimum-viable HLD/LLD schema deterministic from existing graph (no LLM yet).

WRITE 3 ARTIFACTS (all required):
1. <packet>/research/iterations/iteration-001.md (sections: Focus, Actions, Findings with file:line cites, Q-Answered, Q-Remaining, Next-Focus)
2. APPEND to <packet>/research/deep-research-state.jsonl one line: {"type":"iteration","iteration":1,"newInfoRatio":<0..1>,"status":"complete","focus":"RQ1"}
3. <packet>/research/deltas/iter-001.jsonl (multi-line: one iteration record + one or more {"type":"finding","id":"f-iter001-NNN","severity":"P0|P1|P2","label":"...","iteration":1})

CONSTRAINTS: LEAF agent. Max 12 tool calls. read-only against external/, mcp_server/. write only research/. Cite file:line for every claim. NEXT iter focus: RQ2 Trace Tool Design.
