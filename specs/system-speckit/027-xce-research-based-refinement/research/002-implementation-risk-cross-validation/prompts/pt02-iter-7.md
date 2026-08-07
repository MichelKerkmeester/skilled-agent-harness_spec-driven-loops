Deep-research iter 7/10 cross-validation pass for packet 027.

ITER 7 FOCUS: IRQ7 — TESTED_BY edge ground-truth.

READ FIRST:
- 027/003-code-graph-impact-analysis/spec.md (REQ-002 risk signal #4 = test-coverage gap, depends on TESTED_BY edge populated)
- mcp_server/code_graph/lib/indexer-types.ts:17-34 (EdgeType enum — confirm TESTED_BY is declared + DEFAULT_EDGE_WEIGHTS for it)
- mcp_server/code_graph/lib/structural-indexer.ts (FULL FILE — search for "TESTED_BY" emission paths; if not present, that's the BLOCKING finding)
- mcp_server/code_graph/lib/code-graph-db.ts (queryEdgesFrom for TESTED_BY usage)
- mcp_server/code_graph/lib/cross-file-edge-resolver.ts (does the resolver populate TESTED_BY post-indexing?)
- 027/research/027-xce-research-based-refinement-pt-02/iterations/iteration-001.md to 006.md (especially iter-2 finding on CONTAINS edge population — same investigation pattern)

QUESTION: Phase 003 risk-signal #4 (test-coverage gap) computes `untestedFlag = !hasTestEdge` where `hasTestEdge = queryEdgesFrom(symbolId, 'TESTED_BY')`. If structural-indexer.ts doesn't emit TESTED_BY edges today, this signal is broken from day 1 and Phase 003 needs an amendment to add edge population OR fall back to heuristic detection.

INVESTIGATE:
- Is `TESTED_BY` declared in `EdgeType` enum at indexer-types.ts? What's its weight in DEFAULT_EDGE_WEIGHTS?
- Search structural-indexer.ts for TESTED_BY string. Where (if anywhere) is it emitted? What pattern triggers emission?
- Common test-pattern detection: `*.test.ts`, `*.spec.ts`, files importing from `vitest`/`jest`/`mocha`. Which patterns does structural-indexer.ts use?
- Cross-file-edge-resolver: does it populate test edges by walking imports from test files to their subjects?
- If TESTED_BY is empty, what's the fallback for Phase 003?
  - Option A: Add edge population to indexer (significant scope creep; would extend Phase 003 to ~600 LOC)
  - Option B: Heuristic in Phase 003 — check if `<symbol-file>.test.ts` exists in the same directory (filesystem heuristic, no graph)
  - Option C: Mark `untestedFlag` as P2 / optional in spec; ship Phase 003 without it
- Empirically: query the live db (if available) for `SELECT COUNT(*) FROM code_edges WHERE edge_type = 'TESTED_BY'`. Don't actually run; reason from code.

DELIVERABLES (all 3 required):
1. WRITE `pt-02/iterations/iteration-007.md` (Focus, Actions with file:line, Findings with verdicts BLOCKING/CONFIRMED/NO-CHANGE-NEEDED, Q-Answered, Q-Remaining, Next Focus = IRQ8)
2. APPEND `>>` ONE LINE to `pt-02/deep-research-state.jsonl`:
{"type":"iteration","iteration":7,"newInfoRatio":<0..1>,"status":"complete","focus":"IRQ7"}
3. WRITE `pt-02/deltas/iter-007.jsonl` (1 iter record + ≥3 finding records)

CONSTRAINTS: LEAF, ≤12 tools, READ-ONLY 027/* + mcp_server/, WRITE pt-02/ ONLY, file:line cites required.

NEXT: IRQ8 — code_packages necessity escalation triggers.
