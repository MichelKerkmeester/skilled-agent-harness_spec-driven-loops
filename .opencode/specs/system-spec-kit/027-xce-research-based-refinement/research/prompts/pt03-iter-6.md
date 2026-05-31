Deep-research iter 6/10 SCOPE-EXPANSION pass for packet .opencode/specs/system-spec-kit/027-xce-research-based-refinement.

CONTEXT: Iter 1-5 covered RQ-A1..A5 (coco-index group). Iter 6 transitions to Group B — memory backend / causal graph.

ITER 6 FOCUS: RQ-B1 — Memory backend semantic trigger matching (Voyage-4 reuse).

READ FIRST:
- .opencode/skills/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts (current keyword/regex implementation, candidate index, UNICODE_TOKEN_PATTERN)
- .opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts (memory_match_triggers entrypoint)
- .opencode/skills/system-spec-kit/mcp_server/lib/cognitive/ (attention-decay, tier-classifier, co-activation — observe what's NOT trigger-matching but adjacent)
- .opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts (existing Voyage-4 1024-dim cache — can it serve trigger embeddings?)
- .opencode/skills/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts (existing query expansion via embedding similarity — semantic precedent)
- .opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/README.md (XCE's intent classification angle)
- .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-pt-03/iterations/ (continuity)

QUESTION: Should memory_match_triggers graduate from lexical/regex to embedding-based semantic similarity using the existing Voyage-4 1024-dim cache?
- Today: trigger_phrases JSON array → token reverse index → exact / word-boundary match (CJK substring + Latin word).
- Proposed: optional semantic stage — embed user prompt → cosine-similar against pre-computed trigger embeddings; threshold-gated; UNION with current lexical results.
- Why hybrid not replace: lexical preserves precision for explicit phrase triggers ("save context", "/memory:save"); semantic adds recall for paraphrases ("save the current state").
- Cost: per-prompt embedding call — bounded by lexical-first short-circuit (only embed if lexical found nothing OR low-confidence)?
- Threshold tuning: where to set the cosine cutoff?
- Cold start: triggers without embeddings — backfill via memory_index_scan?
- Storage: extend trigger_phrases JSON or add embeddings table?
- LOC estimate for hybrid trigger matcher.
- Risk: false positives from semantic over-matching → cognitive-tier classifier mis-prioritization.
- Verdict shape: ADOPT (hybrid is clearly correct), ADAPT (with feature flag), DEFER (lexical sufficient), SKIP (against design)?

DELIVERABLES (same shapes):
1. iterations/iteration-006.md
2. state.jsonl append: `{"type":"iteration","iteration":6,"newInfoRatio":<0..1>,"status":"complete","focus":"RQ-B1"}`
3. deltas/iter-006.jsonl

CONSTRAINTS: same as iter 1.

NEXT iter focus hint: RQ-B2 — Memory backend LLM-curated context assembly.
