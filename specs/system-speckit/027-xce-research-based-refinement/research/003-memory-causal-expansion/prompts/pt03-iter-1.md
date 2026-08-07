Deep-research iter 1/10 SCOPE-EXPANSION pass for packet .opencode/specs/system-spec-kit/027-xce-research-based-refinement.

CONTEXT: Pt-01 (deepseek-v4-pro, 10 iter) and pt-02 (gpt-5.5/high/fast, 10 IRQ) converged on five code-graph + skill-advisor phases (004→001→{002,003}→005). NOTHING in those passes addresses (1) mcp-coco-index improvements (spec.md:144 explicitly SCOPE-OUT) or (2) system-spec-kit memory backend / causal graph. Pt-03 covers exactly that gap: XCE teachings BEYOND code-graph. Output → research/027-xce-research-pt-03/.

ITER 1 FOCUS: RQ-A1 — Coco-index intent steering + query expansion.

READ FIRST:
- .opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/README.md (XCE public surface — note steering pattern, intent classification, "use first" directive)
- .opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/steering/CLAUDE.md (one IDE example of XCE steering rule shape)
- .opencode/skills/mcp-coco-index/SKILL.md (current invocation surface, when-to-fire conditions, query handling)
- .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py (current KNN search, dedup, path-class rerank ±0.05)
- .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py + client.py (MCP/CLI tool entrypoint — observe what params reach the search function)
- .opencode/skills/mcp-coco-index/references/search_patterns.md (existing query-optimization advice — note what's MANUAL today)
- (skim) .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-pt-01/research.md (pt-01 baseline, RQ9 SKIP boundary)
- (skim) .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-pt-02/research.md (pt-02 cross-validation summary)

QUESTION: Can XCE's intent-steering pattern (unconditional "use ccc_search FIRST" directive + intent classification) teach mcp-coco-index two things:
  (a) WHEN to fire (e.g. surface as a first-class action in the skill_advisor briefing for "find code that does X" / "where is X implemented" / "similar code" intents)?
  (b) HOW to expand the query — single user query → multiple intent-tagged sub-queries (e.g. "show me error handlers" → ["exception handling", "try-catch", "error recovery"]) before embedding + dedup?

Investigate:
- Where in the current code path would an intent classifier slot in (pre-embedding stage in query.py)?
- Can the existing path_class taxonomy (implementation/tests/docs/spec_research/generated/vendor) inform intent-tagged sub-query weighting?
- What does XCE's README.md tell us about how their intent-routing operates publicly (and what's closed-source)?
- Cost: extra embedding calls per query for sub-queries — bounded by what cap?
- LOC estimate for a minimal ADAPT (intent classifier shim + sub-query expander + result merger).
- Risk: query expansion that doesn't match user intent could degrade precision; how to gate?

DELIVERABLES (all 3 required):
1. WRITE `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-pt-03/iterations/iteration-001.md` with sections: Focus, Actions Taken (with file:line cites), Findings (each with file:line evidence + verdict ADOPT/ADAPT/DEFER/SKIP + LOC estimate + dependencies on existing 027 phases if any), Questions Answered, Questions Remaining, Next Focus (RQ-A2).
2. APPEND ONE LINE to `research/027-xce-research-pt-03/deep-research-state.jsonl` (must use `>>` append, NEVER overwrite):
   `{"type":"iteration","iteration":1,"newInfoRatio":<0..1>,"status":"complete","focus":"RQ-A1"}`
3. WRITE `research/027-xce-research-pt-03/deltas/iter-001.jsonl` with multi-line JSONL: 1 iteration record + ≥3 finding records like:
   `{"type":"finding","id":"f-iter001-NNN","severity":"P0|P1|P2","label":"...","verdict":"ADOPT|ADAPT|DEFER|SKIP","loc_estimate":"~NNN","dependencies":["Phase-001"],"iteration":1}`

CONSTRAINTS:
- LEAF agent. Max 12 tool calls. Stay under 12 minutes wall.
- READ-ONLY: 027/external/, 027/research/, .opencode/skills/mcp-coco-index/, .opencode/skills/system-spec-kit/mcp_server/.
- WRITE: research/027-xce-research-pt-03/ ONLY. NEVER touch 001-005/ phase dirs, NEVER touch 027/research/027-xce-research-pt-01/ or 027/research/027-xce-research-pt-02/, NEVER touch any code under mcp_server/.
- Cite file:line for EVERY claim. No bare assertions.
- Verdict diversity required ACROSS all 10 iter: ≥1 ADOPT + ≥1 ADAPT + ≥1 DEFER + ≥1 SKIP total. Iter 1 alone need not cover all four.
- Out of pt-03 scope: pt-02's 6 open code-graph policy decisions; SaaS dependencies (`mcp.xanther.ai`, `xanther.ai`); embedding-model swaps; full re-embed loops.

NEXT iter focus hint: RQ-A2 — Coco-index rerank fusion with code-graph HLD/LLD (Phase 001 dependency).
