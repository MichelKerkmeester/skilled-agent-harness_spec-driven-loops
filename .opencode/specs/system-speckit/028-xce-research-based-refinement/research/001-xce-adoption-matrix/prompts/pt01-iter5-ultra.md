Deep-research iter 5/10 for packet .opencode/specs/system-spec-kit/027-xce-research-based-refinement.

READ FIRST: <packet>/spec.md (especially RQ5), prior iters 001-004.

ITER 5 FOCUS: RQ5 PRAT Reverse-Engineering. PRAT = Persistent Recursive Abstract Tree (closed-source XCE algorithm). Decompose the name and propose the most likely pipeline using ONLY public clues (external/README.md docs + benchmark numbers + tool API shape) — DO NOT speculate beyond evidence.

Map each PRAT stage to a concrete local file:line in mcp_server/code_graph/ that could host the equivalent:
- Persistent: how does XCE persist? Likely content-hash-keyed cache vs version-tagged snapshots. Our local equivalent: code-graph-db.ts cache surface? indexer-types.ts snapshot fields?
- Recursive: how does XCE recurse? Likely tree-walk with memoization. Our: structural-indexer.ts AST walk + edge-resolver.ts recursion?
- Abstract: how does XCE abstract? Likely LLM-generated component descriptions / HLD/LLD layers. Our: NO equivalent yet — this is the gap (RQ1 finding).
- Tree: what tree structure? Likely AST + module hierarchy. Our: tree-sitter via mcp-coco-index? code_edges CONTAINS chain?

EACH PRAT inference MUST be marked with confidence level (high/medium/low) and labeled as "documented in external/" vs "inferred." NO speculation beyond public docs.

WRITE 3 ARTIFACTS:
1. <packet>/research/iterations/iteration-005.md (sections: Focus, Actions, Findings — including PRAT-stage-to-local-file map with confidence flags, Q-Answered, Q-Remaining, Next-Focus)
2. APPEND state.jsonl: {"type":"iteration","iteration":5,"newInfoRatio":<0..1>,"status":"complete","focus":"RQ5"}
3. <packet>/research/deltas/iter-005.jsonl

CONSTRAINTS: LEAF, max 12 tool calls, read-only external/+mcp_server/, write only research/, file:line cites, EVERY PRAT inference confidence-flagged.

DELIVERABLES:
- ≥3 file:line cites from external/README.md re: PRAT
- PRAT stage → local file map (4 rows, with confidence)
- Verdict: ADOPT / ADAPT / DEFER / SKIP — likely DEFER for closed-source full pipeline; ADAPT for individual stages
- Cheapness estimate: which PRAT stages we could approximate ON TOP of existing structural-indexer + tree-sitter + optional generation step

NEXT iter focus: RQ6 Steering Pattern Transfer (skill_advisor brief render-layer change).
