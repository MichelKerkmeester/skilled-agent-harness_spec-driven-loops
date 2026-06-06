Deep-research iter 2/10 SCOPE-EXPANSION pass for packet .opencode/specs/system-spec-kit/027-xce-research-based-refinement.

CONTEXT: Iter 1 covered RQ-A1 (coco-index intent steering + query expansion). This iter covers RQ-A2.

ITER 2 FOCUS: RQ-A2 — Coco-index rerank fusion with code-graph HLD/LLD (Phase 001 dependency).

READ FIRST:
- .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-code-graph-hld-lld/spec.md (Phase 001 deterministic HLD/LLD design — note role/file/module classification output schema)
- .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-code-graph-hld-lld/plan.md (planned API — what does generateHLD()/generateLLD()/generateFileNarrative() return?)
- .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py (current rerank logic — find path-class rerank ±0.05 site)
- .opencode/skills/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts (current bridge: coco→graph anchor resolution — what fields does it consume?)
- .opencode/skills/system-spec-kit/mcp_server/lib/search/cocoindex-calibration.ts (current overfetch + dedup wrapper)
- .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-pt-03/iterations/iteration-001.md (your iter 1 findings — refer for continuity)
- .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-pt-03/deep-research-strategy.md (Known Context section)

QUESTION: Can Phase 001's deterministic HLD/LLD narrative (when shipped) be folded into coco-index's rerank stage to boost hits located near known module boundaries / role anchors? Specifically:
- Today: coco rerank uses path_class only (implementation/tests/docs/etc., ±0.05 nudge).
- Proposed: rerank also boosts hits whose enclosing file's `architectural_role` matches the query intent (e.g. query "where is auth middleware initialized" → boost hits in files classified as `module_init` or `middleware_setup`).
- What HLD/LLD fields would coco's rerank need to consume? Static export from Phase 001's generator, or live db query?
- LOC estimate for the rerank-fusion shim.
- Hard dependency on Phase 001 ship — what does pt-03 do if Phase 001 hasn't shipped (DEFER vs ADAPT-with-feature-flag)?
- Risk: stale HLD/LLD (file changed but not regenerated) introduces wrong boosts. Mitigation?
- Out of scope: replacing coco's embedding model; modifying graph schema for new edge types.

DELIVERABLES (all 3 required):
1. WRITE `research/027-xce-research-pt-03/iterations/iteration-002.md` (same structure as iter 1).
2. APPEND ONE LINE to `research/027-xce-research-pt-03/deep-research-state.jsonl`:
   `{"type":"iteration","iteration":2,"newInfoRatio":<0..1>,"status":"complete","focus":"RQ-A2"}`
3. WRITE `research/027-xce-research-pt-03/deltas/iter-002.jsonl` with iteration record + ≥3 finding records.

CONSTRAINTS: same as iter 1.

NEXT iter focus hint: RQ-A3 — ccc_feedback JSONL graduation to active rerank-weight loop.
