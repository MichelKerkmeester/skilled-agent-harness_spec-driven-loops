# Deep-Research Iteration 6 — K1.5 deep-dive: auto causal-edge derivation via multi-phase entity resolution

## BINDING CONTRACT (pre-answered)

- **Gate 3**: **A) Use existing spec folder** = `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/017-cocoindex-memory-port-research/`. Do NOT ask.
- **Skill routing**: Do NOT invoke other skills via slash commands. You ARE the deep-research iteration.
- **Sub-agent dispatch**: FORBIDDEN. LEAF.
- **Mode**: Execute directly.

## STATE

Iteration: 6 of 10
Answered: K2.4, K1.1, K1.2, K1.3, K1.4 (all YES-WITH-ADAPTATION)
Remaining: **K1.5** (this iter), K1.6, K2.1, K2.2, K2.3, K2.5
Last 3 ratios: 0.62 -> ? -> ? | Stuck: 0

## FOCUS

**K1.5 — Can causal edges be auto-derived from spec-doc relationships (supersedes, caused-by, cited-by) using cocoindex's `conversation_to_knowledge` multi-phase extraction pattern (LLM extract → embed-dedup → canonical → graph), all incremental? How do we validate LLM-extracted edges to avoid graph pollution?**

Verdict: YES / YES-WITH-ADAPTATION / NO + concrete pipeline sketch + confidence/validation scheme.

## PRIOR EVIDENCE

- Our current `causal_edges` (iter-1): manually created via `memory_causal_link`; `created_by` is `'manual'|'auto'`. Auto path exists but is sparse.
- Our `relations` are constrained set: `caused, supports, contradicts, supersedes, produced, cited_by` (iter-1).
- Cocoindex `examples/conversation_to_knowledge/`: multi-stage LLM extract → embedding-based dedup → canonical entity → declare graph rows. All incremental via memo + stable paths.
- iter-2 K1.1 established the memo/DAG substrate is viable for our stack.
- iter-3 K1.2 established lifecycle/cleanup model for causal edges.
- iter-5 K1.4 established chunk-level fingerprints — relevant because LLM extraction operates per chunk.

## INVESTIGATION TARGETS

**Cocoindex side — multi-phase pipeline:**
1. Read `external/cocoindex-main/examples/conversation_to_knowledge/main.py` (or equivalent) in full. What's the pipeline shape? How many LLM calls per artifact? What's the dedup mechanism?
2. Look for `entity_resolution`, `dedup`, `canonicalize`, `merge_entities` patterns. How are duplicate-but-spelled-differently entities resolved (embedding similarity threshold? exact match? LLM judge?)?
3. Check for confidence scoring on extracted edges — does cocoindex track per-edge confidence, or trust LLM outputs unconditionally?

**Our side — auto causal-edge surface:**
4. Read `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts` — look for any `auto`-flagged or programmatic edge-creation paths (e.g., `created_by:'auto'`).
5. Search for existing auto-derivation hints: `rg -n 'supersedes|caused_by|cited_by' .opencode/specs/system-spec-kit/ | head -30` — how do spec docs currently encode relationships? (Frontmatter? body prose? `predecessor:` field?)
6. Read `description.json` and `graph-metadata.json` of a few representative spec packets to see what relationship metadata is ALREADY structured and could be auto-promoted to causal edges without LLM extraction at all (deterministic path).

**Cross-cutting — validation/pollution prevention:**
7. Survey what "auto causal-edge polluted graph" looks like — has any prior packet hit this? Check `feedback_*` memory files via `ls /Users/michelkerkmeester/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/memory/feedback_*causal* 2>/dev/null` (read-only).

## ANALYSIS DELIVERABLE

**Two-track derivation model:**

| Track | Source | Mechanism | Pollution risk | Verdict |
|-------|--------|-----------|---------------|---------|
| Deterministic (low-risk) | Frontmatter fields (`predecessor:`, `supersedes:`, `parent_id`, `children`, `depends_on`, `related_to`) | Parser reads fields, emits edges directly. No LLM. | Near-zero (assuming author discipline). | ? |
| LLM-derived (high-info) | Body prose, "this packet builds on X", "this fixes Y" | LLM extraction per chunk → embed-dedup → confidence-scored edges | Real, needs gates | ? |

**Confidence/validation scheme:**

- Each auto-extracted edge tagged with `confidence: 0..1` + `extraction_method: 'frontmatter'|'llm'|'embedding_similarity'`.
- Thresholds: deterministic = auto-accept; LLM ≥ 0.85 = auto-accept; 0.7–0.85 = quarantine table for human review; < 0.7 = drop.
- Quarantine sweep: new MCP tool (or extension of `memory_causal_stats`) lists pending edges for review.

**Verdict on K1.5**: YES / YES-WITH-ADAPTATION / NO + one-paragraph justification.

If YES or YES-WITH-ADAPTATION, sketch:
- Phase 1: deterministic frontmatter promoter (Pure TS, no LLM, ship first).
- Phase 2: LLM extractor (incremental per chunk, gated on K1.4 chunk fingerprints).
- Confidence gate: schema additions to `causal_edges` (`confidence`, `extraction_method`, `extracted_at`).
- Quarantine table: `causal_edges_pending` with same schema + reviewer fields.

## CONSTRAINTS

- LEAF. Max 12 tool calls. Cite file:line.
- No special regex chars in JSONL `focus`.

## OUTPUT CONTRACT

1. `research/iterations/iteration-006.md`
2. JSONL appended with `{"type":"iteration","iteration":6,...,"focus":"k1-5-auto-causal-edge-derivation",...}`
3. `research/deltas/iter-006.jsonl`

Stop: 10 min wall, ≤12 tool calls.

Go.
