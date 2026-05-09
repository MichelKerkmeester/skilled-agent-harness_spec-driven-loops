Deep-research iter 5/10 SCOPE-EXPANSION pass for packet .opencode/specs/system-spec-kit/027-xce-research-based-refinement.

CONTEXT: Iter 1-4 covered RQ-A1..A4 (coco-index group internal). This iter covers RQ-A5 — the cross-cut between coco-index and code-graph.

ITER 5 FOCUS: RQ-A5 — Cross-cutting: coco+graph fused rerank stage.

READ FIRST:
- .opencode/skills/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts (current pipeline: coco hits → seed-resolver → graph anchor)
- .opencode/skills/system-spec-kit/mcp_server/lib/search/cocoindex-calibration.ts (current pipeline: coco overfetch + dedup wrapper)
- .opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/ccc-status.ts (status integration)
- .opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/session-resume.ts (session-bootstrap exposes coco availability)
- .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-code-graph-hld-lld/spec.md (Phase 001 — what graph-side rerank inputs would exist post-ship)
- .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-code-graph-trace/spec.md (Phase 002 — trace tool output as rerank input)
- .opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-code-graph-impact-analysis/spec.md (Phase 003 — impact-score as rerank weight)
- .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-pt-03/iterations/iteration-001.md..iteration-004.md

QUESTION: Should coco-index and code-graph share a SINGLE FUSED rerank stage (one combined score) instead of today's coco→seed-resolver→graph-anchor→rescore pipeline?
- Today: coco returns ranked hits; seed-resolver maps to graph anchors; result is two scores (coco raw + path_class rerank) plus a graph anchor (no graph score involved in ranking).
- Proposed: a fusion stage that combines coco's similarity score, path_class signal, graph node centrality (fan-in/fan-out from Phase 003), architectural_role match (from Phase 001), and trace-distance (from Phase 002).
- Where would fusion live (new module under lib/search/? or extension of cocoindex-calibration.ts?)
- Score normalization across heterogeneous signals — log-cap, min-max, learned weights?
- Dependency chain: hard-depends on Phases 001+002+003 ship; otherwise fusion has nothing to fuse.
- LOC estimate for the fusion stage (~150-300?).
- Risk: tightly coupling coco and code-graph removes the option to use coco standalone (current SKILL.md ships standalone). Mitigation: feature flag.
- Verdict shape: ADAPT (fusion stage as pluggable, default-off), DEFER (until 001/002/003 ship), or SKIP (unjustified complexity)?

DELIVERABLES (same shapes):
1. iterations/iteration-005.md
2. state.jsonl append: `{"type":"iteration","iteration":5,"newInfoRatio":<0..1>,"status":"complete","focus":"RQ-A5"}`
3. deltas/iter-005.jsonl

CONSTRAINTS: same as iter 1. This is the LAST coco-index iter; iter 6 transitions to memory backend (RQ-B1).

NEXT iter focus hint: RQ-B1 — Memory backend semantic trigger matching.
