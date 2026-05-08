Deep-Research iteration 1 of 10 for the 027 XCE adoption-research packet.

PACKET: .opencode/specs/system-spec-kit/027-xce-research-based-refinement
SPEC AUTHORITY: read PACKET/spec.md FIRST for the full 9-RQ list and scope.

THIS ITERATION: focus on RQ1 (Architectural Context Gap). Compare XCE's xce_architecture_context payload (HLD/LLD/component-description per file) vs our local code_graph_context payload (raw symbols + edges + readiness). Propose minimum-viable HLD/LLD schema we could emit deterministically from existing graph data, no LLM yet.

ACTIONS (3-5):
1. Read PACKET/external/README.md (full file, ~283 lines). Quote exact lines describing xce_architecture_context payload shape.
2. Read .opencode/skills/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts. List tools registered. Locate code_graph_context schema.
3. Read at least one of .opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/*.ts. What payload fields does it return?
4. Diff XCE's payload vs ours. Note fields XCE has that we lack.
5. Draft minimum-viable HLD/LLD schema (deterministic, no LLM). Mark fields needing LLM as [LLM-required].

OUTPUT 3 ARTIFACTS (workflow validation will reject the iteration if any is missing):

ARTIFACT 1 - iteration narrative at PACKET/research/iterations/iteration-001.md with sections: Focus, Actions Taken (with file:line cites), Findings (with file:line cites), Questions Answered, Questions Remaining, Next Focus.

ARTIFACT 2 - APPEND one JSONL line to PACKET/research/deep-research-state.jsonl using exact type "iteration":
{"type":"iteration","iteration":1,"newInfoRatio":<0..1>,"status":"complete","focus":"RQ1 Architectural Context Gap"}

ARTIFACT 3 - PACKET/research/deltas/iter-001.jsonl with one {"type":"iteration",...} line plus one or more {"type":"finding","id":"f-iter001-NNN","severity":"P0|P1|P2","label":"...","iteration":1} lines.

CONSTRAINTS: LEAF agent (no sub-dispatch). Max 12 tool calls. Read-only against external/, mcp_server/code_graph/, mcp_server/skill_advisor/. Forbidden writes: any path under mcp_server/, any path under external/. Allowed writes: only research/ subfolder of the packet. Cite file:line for every claim.

NEXT FOCUS HINT for iteration 2: RQ2 Trace Tool Design. Define code_graph_trace inputs/outputs (symbol -> file -> package -> repo). Determine if existing edge table is sufficient or schema delta is needed.
