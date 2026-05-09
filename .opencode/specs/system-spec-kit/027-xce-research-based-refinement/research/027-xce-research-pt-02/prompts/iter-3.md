Deep-research iter 3/10 cross-validation pass for packet 027.

ITER 3 FOCUS: IRQ3 — Phase 003 risk-formula weight validation.

READ FIRST:
- 027/003-code-graph-impact-analysis/spec.md (especially "Risk score formula" block + REQ-003 + L2 EDGE CASES)
- 027/research/027-xce-research-based-refinement-pt-02/iterations/iteration-001.md, iteration-002.md (prior iter findings — note iter-2 BLOCKING on CONTAINS edge contract may affect Phase 003's queryEdgesFrom/To risk signals)
- mcp_server/code_graph/lib/code-graph-db.ts:949-1083 (queryEdgesFrom, queryEdgesTo, queryFileDegrees, queryFileImportDependents)
- mcp_server/code_graph/lib/indexer-types.ts:17-34 (EdgeType, DEFAULT_EDGE_WEIGHTS — confidence baselines for risk-confidence signal)
- mcp_server/code_graph/lib/cross-file-edge-resolver.ts (existing edge walk patterns)

QUESTION: Phase 003 spec proposes deterministic risk score formula:
  `risk = normalize(fanIn) * 0.35 + normalize(hubDegree) * 0.25 + (untestedFlag ? 1.0 : 0) * 0.25 + normalize(transitiveDepth) * 0.15`

Are these weights defensible? Investigate:
- What's the empirical basis for `0.35/0.25/0.25/0.15`? (Spec says "design intuition" — admit it's unvalidated.)
- Sensitivity test: would shifting fan-in to 0.40 / hubDegree to 0.20 change rankings on a 5-task fixture? (Hypothetical — there's no labeled fixture yet.)
- Alternative formulas: multiplicative (`fanIn * hubDegree * untested * depth`)? Log-scaled (`log1p(fanIn) * 0.35 + ...`)? Is the additive model the right shape?
- Edge cases: what if fanIn=0 (orphan file)? formula returns 0 — is that right? An orphan file with no callers is LOW risk, but if it's also untested it should weight 0.25. Currently it does.
- What if untestedFlag is missing (TESTED_BY edge not populated)? — bridges to IRQ7.
- normalize() function unspecified — is it max-normalize, z-score, percentile? Without spec the score is non-reproducible across graphs of different sizes.
- BFS for transitive depth — capped at 3 hops. What's the rationale? Cycles? Performance? Why not 5 or 2?
- Is the formula composable with Phase 001's HLD `layer` for criticality weighting (Phase 003 spec mentions optional Phase 001 dep)?

DELIVERABLES (all 3 required):
1. WRITE `pt-02/iterations/iteration-003.md` (Focus, Actions with file:line, Findings with verdicts BLOCKING/CONFIRMED/NO-CHANGE-NEEDED, Q-Answered, Q-Remaining, Next Focus = IRQ4)
2. APPEND ONE LINE to `pt-02/deep-research-state.jsonl` (USE `>>`):
{"type":"iteration","iteration":3,"newInfoRatio":<0..1>,"status":"complete","focus":"IRQ3"}
3. WRITE `pt-02/deltas/iter-003.jsonl` (1 iteration record + ≥3 finding records)

CONSTRAINTS:
- LEAF, max 12 tool calls, READ-ONLY against 027/* + mcp_server/, WRITE pt-02/ ONLY.
- Cite file:line for EVERY claim.

NEXT: IRQ4 — Phase 004 confidence-edge-case stress (brief shape at confidence 0.79/0.80/0.81; uncertainty > confidence?).
