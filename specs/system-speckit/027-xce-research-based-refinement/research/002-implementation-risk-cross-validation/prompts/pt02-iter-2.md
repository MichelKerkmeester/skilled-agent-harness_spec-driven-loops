Deep-research iter 2/10 cross-validation pass for packet 027.

ITER 2 FOCUS: IRQ2 — Phase 002 CONTAINS edge cross-language population.

READ FIRST:
- 027/002-code-graph-trace/spec.md (especially REQ-001 chain output + L2 EDGE CASES "Cross-language file" entry)
- 027/research/027-xce-research-based-refinement-pt-02/iterations/iteration-001.md (iter 1 findings — focus on overlap with 002 dependency)
- mcp_server/code_graph/lib/structural-indexer.ts (especially capturesToNodes around 944-993; CONTAINS edge emission paths)
- mcp_server/code_graph/lib/tree-sitter-parser.ts (which language grammars are loaded? WASM availability?)
- mcp_server/code_graph/lib/indexer-types.ts:17-34 (EdgeType enum, DEFAULT_EDGE_WEIGHTS for CONTAINS)
- mcp_server/code_graph/lib/code-graph-db.ts (queryEdgesTo for CONTAINS — Phase 002's primary walker)

QUESTION: Is the CONTAINS edge actually emitted by the indexer for ALL supported languages, or only for TS/JS? Phase 002's `traceSymbol()` walks `queryEdgesTo(symbolId, 'CONTAINS')` — if CONTAINS isn't populated for a language, trace returns just `{symbol, file, architectural_role}` with no class/module rungs.

INVESTIGATE:
- Which tree-sitter grammars are loaded (tree-sitter-wasms package — list)?
- For each grammar, does the indexer emit CONTAINS edges between symbols?
- Edge cases: nested classes, anonymous functions inside classes, Python decorators, Go interface methods, Rust impl blocks, TypeScript `namespace` (legacy), `export default class`.
- Phase 002 spec line ~115 says "fq_name prefix splitting (dot-delimited)" is a fallback when CONTAINS ends early. How robust is this fallback?
- How does Phase 002 behave when the CONTAINS chain is empty (file-level symbol)? Spec says `class: null` — is this honored everywhere?

DELIVERABLES (all 3 required):
1. WRITE `pt-02/iterations/iteration-002.md` with sections: Focus, Actions Taken (file:line cites), Findings (each with verdict BLOCKING/CONFIRMED/NO-CHANGE-NEEDED + file:line evidence), Questions Answered, Questions Remaining, Next Focus (IRQ3).
2. APPEND ONE LINE to `pt-02/deep-research-state.jsonl` (USE `>>` APPEND, never overwrite):
{"type":"iteration","iteration":2,"newInfoRatio":<0..1>,"status":"complete","focus":"IRQ2"}
3. WRITE `pt-02/deltas/iter-002.jsonl` with 1 iteration record + ≥3 finding records.

CONSTRAINTS:
- LEAF agent. Max 12 tool calls.
- READ-ONLY: 027/{spec.md, 001-005/, research/}, mcp_server/code_graph/, mcp_server/skill_advisor/.
- WRITE: pt-02/ ONLY. NEVER touch 001-005 phase dirs, NEVER touch mcp_server/.
- Cite file:line for EVERY claim.

NEXT iter focus hint: IRQ3 — Phase 003 risk-formula weight validation (`0.35/0.25/0.25/0.15` defensible?).
