Deep-research iter 4/10 SCOPE-EXPANSION pass for packet .opencode/specs/system-spec-kit/027-xce-research-based-refinement.

CONTEXT: Iter 1-3 covered RQ-A1..A3. This iter covers RQ-A4.

ITER 4 FOCUS: RQ-A4 — Few-shot example-bank retrieval for coco-index (XCE in-context exemplification analog).

READ FIRST:
- .opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/README.md (re-read with focus on XCE's exemplification / retrieval-augmentation public claims)
- .opencode/skills/mcp-coco-index/SKILL.md (search history features, prior-query awareness — likely none)
- .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py (current single-shot query path)
- .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/schema.py (current vec0 schema — can it host an example-bank table?)
- .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-pt-03/iterations/iteration-001.md..iteration-003.md (continuity)
- (skim) .opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts (memory-side feedback — note any reusable schema patterns)

QUESTION: Can prior validated hits surface as positive exemplars in the next query?
- Storage design: per-query "positive" record (query embedding + result file:line + user-validated flag); probably a new sqlite table or fork of ccc_feedback.
- Retrieval design: at query time, KNN over example-bank → if similar prior query exists, surface its positive hits as exemplars (separate result group, NOT mixed into ranking).
- vs. RQ-A3 (active feedback loop): A3 changes weights, A4 surfaces examples — distinct mechanisms.
- Privacy: example-bank is local; does the design need a clear-history / opt-out?
- Bounded growth: cap at N exemplars / TTL of M days?
- Cold start: empty bank → no-op fallback to current behavior.
- Risk: stale exemplars (file moved/deleted) — need reconciliation.
- LOC estimate.
- ADAPT vs DEFER tradeoff: complexity vs. value — does this duplicate code-graph's role?

DELIVERABLES (same shapes as iter 1):
1. iterations/iteration-004.md
2. state.jsonl append: `{"type":"iteration","iteration":4,"newInfoRatio":<0..1>,"status":"complete","focus":"RQ-A4"}`
3. deltas/iter-004.jsonl

CONSTRAINTS: same as iter 1.

NEXT iter focus hint: RQ-A5 — Cross-cutting coco+graph fused rerank stage.
