# Deep-Research Iteration 10 — FINAL SYNTHESIS: write canonical research/research.md

## BINDING CONTRACT (pre-answered)

- **Gate 3**: **A) Use existing** = `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/017-cocoindex-memory-port-research/`. Do NOT ask.
- **Skill routing**: Do NOT invoke other skills. You ARE the synthesis iteration.
- **Sub-agent dispatch**: FORBIDDEN. LEAF.
- **Mode**: Execute directly.

## STATE

Iteration: 10 of 10 (FINAL — synthesis pass)
Answered: ALL 11 questions (K1.1, K1.2, K1.3, K1.4, K1.5, K1.6, K2.1, K2.2, K2.3, K2.4, K2.5)
Convergence: triggered (maxIterations cap + all questions answered).

## TASK

This iteration produces the **canonical synthesis** at `research/research.md`. Read all 9 prior iteration narratives, then write a consolidated 17-section research report following the deep-research skill convention.

## INPUTS TO READ

All paths under `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/017-cocoindex-memory-port-research/`:

1. `research/iterations/iteration-001.md` — ground truth baseline
2. `research/iterations/iteration-002.md` — K1.1 memoization + DAG verdict
3. `research/iterations/iteration-003.md` — K1.2 causal-graph lifecycle verdict
4. `research/iterations/iteration-004.md` — K1.3 statediff reconciliation verdict
5. `research/iterations/iteration-005.md` — K1.4 chunked embeddings + stable identity verdict
6. `research/iterations/iteration-006.md` — K1.5 auto causal-edge derivation verdict
7. `research/iterations/iteration-007.md` — K1.6 non-port confirmed + K2.1 prefix construction matrix
8. `research/iterations/iteration-008.md` — K2.2 + K2.3 namespace recommendation
9. `research/iterations/iteration-009.md` — K2.5 final recommendation matrix + cross-axis cohesion
10. `spec.md` (this packet) for scope re-check.

## OUTPUT — `research/research.md` (canonical)

Write to: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/017-cocoindex-memory-port-research/research/research.md`

Use the 17-section structure (or equivalent comprehensive structure). Suggested layout:

```
# 027/013 — cocoindex-main → spec_kit_memory port + MCP namespace shortening — RESEARCH SYNTHESIS

## 1. Executive Summary
3-4 paragraphs: what was investigated, headline findings, recommended path forward.

## 2. Research Context
Why this packet exists. Connection to 027 phase parent. Relation to prior pt-01..pt-04 work.

## 3. Methodology
9 iterations × cli-codex gpt-5.5 high fast. Iteration scope per axis. Convergence at iter-9/10 with all 11 questions answered.

## 4. Track 1 Findings — cocoindex-main → spec_kit_memory Port

### 4.1 K1.1 — Memoization + dependency-DAG indexing
Verdict: YES-WITH-ADAPTATION
- What cocoindex does (canonical fingerprint hashing + per-component memo records + dependency edges + delta propagation).
- What our stack has (linear-scan with content-hash skip in handlers/memory-index.ts).
- Adapted port: TS canonicalization + SQLite memo_records + dependency_edges tables + DAG-aware memory_index_scan.
- Schema sketch.
- File:line citations.

### 4.2 K1.2 — Stable-path tracking for causal graph
Verdict: YES-WITH-ADAPTATION
- ChildExistence/ChildComponentTombstone model (db_schema.rs:35).
- Adapted port: hard-delete active causal_edges + causal_edge_tombstones audit table + generation counter + sweep helper routing all deletion paths.
- Schema sketch.

### 4.3 K1.3 — State-diff reconciliation
Verdict: YES-WITH-ADAPTATION
- statediff.py (desired, prior) → {insert, upsert, replace, delete}.
- Adapted port: two-step write pipeline (target-state plan → typed actions through sinks); post-mutation hooks become subscribers.
- Target sinks: embedding/FTS/BM25/graph/cache/trigger/co-activation.

### 4.4 K1.4 — Incremental chunked embeddings
Verdict: YES-WITH-ADAPTATION
- Anchor-first chunk identity (preferred over heading-slug or positional).
- Per-chunk fingerprints stored durably.
- Schema additions on memory_index OR new memory_chunks table.

### 4.5 K1.5 — Auto causal-edge derivation
Verdict: YES-WITH-ADAPTATION
- Shape transfers (multi-phase: chunk extract → embed-dedup → LLM canonicalize → graph declare).
- Trust policy does NOT transfer — need per-edge confidence + extraction_method + quarantine table.
- Two-track derivation: Phase 1 deterministic frontmatter promoter (ship first); Phase 2 LLM extractor (gated on Phase 1 + chunk fingerprints).

### 4.6 K1.6 — Query intelligence
Verdict: NON-PORT CONFIRMED
- cocoindex offers no portable query intelligence (no router, no intent classifier, no RRF fusion, no channel routing). All retrieval delegated to per-backend native queries.
- Document this explicitly so future research doesn't revisit.

## 5. Track 2 Findings — MCP Namespace Shortening

### 5.1 K2.1 — Prefix construction mechanism
- `mcp__` is Claude Code's runtime composition; OpenCode uses similar shape; Gemini uses `mcp_<server>_<tool>` (single underscore separator, NOT double).
- Server name registered in `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.gemini/settings.json`.
- CRITICAL: Gemini policy parser splits after `mcp_` — server names with underscores are policy-ambiguous.

### 5.2 K2.2 — Regex/charset constraints
- Underscore-containing server names (`mk_memory`) inherit Gemini policy ambiguity.
- Hyphen-containing names (`mk-memory`) are unambiguous and pass all 4 runtimes' constraints.
- Bare names (`mk`) work but are generic and may collide with future siblings.

### 5.3 K2.3 — Per-tool prefix redundancy
- Server-only rename = lowest risk, lowest churn.
- Dropping tool-level `memory_` prefix = deferred follow-on (Option B).

### 5.4 K2.4 — Migration cost (callsite count)
- 166 raw `mcp__mk_spec_memory__` callsites across MD/TS/JSON/SH (includes packet-local prompts/spec).

### 5.5 K2.5 — Final naming recommendation
- **Option A (recommended): server-only rename `spec_kit_memory` → `mk-memory`** with hyphen (NOT underscore), all 59 raw tool names unchanged.
- Saves ~6 chars per tool reference; resolves Gemini policy ambiguity; minimal migration churn (server name in 4 config files + ~166 doc/code references).

## 6. Cross-Axis Cohesion + Proposed Downstream Implementation Packets

Bundle axes that compose well together:

### Packet proposal 028 — Memoization + dependency-DAG indexing foundation
- Scope: K1.1 + K1.4 (memo substrate + chunked embeddings).
- Primary files: `lib/search/vector-index-schema.ts` (schema additions), `lib/storage/incremental-index.ts` (DAG walking), new `lib/storage/memo.ts`, `lib/parsing/memory-parser.ts` (chunking).
- Estimated LOC: 800-1200.
- Dependencies: none (foundational).
- ROI × Effort: HIGH × MEDIUM.

### Packet proposal 029 — Causal-graph lifecycle (tombstones + sweep)
- Scope: K1.2.
- Primary files: `lib/search/vector-index-schema.ts` (tombstone table), `handlers/causal-graph.ts` (route deletes through helper), new `lib/causal/sweep.ts`.
- Estimated LOC: 300-500.
- Dependencies: none (self-contained).
- ROI × Effort: MEDIUM × LOW.

### Packet proposal 030 — Statediff reconciliation layer
- Scope: K1.3.
- Primary files: new `lib/storage/statediff.ts`, `handlers/memory-index.ts` (subscribe hooks), `handlers/memory-save.ts` (use statediff), causal-graph mutation paths.
- Estimated LOC: 600-900.
- Dependencies: 028 (memoization + DAG provides the prior-state lookups).
- ROI × Effort: MEDIUM × HIGH.

### Packet proposal 031 — Auto causal-edge derivation Phase 1 (frontmatter promoter)
- Scope: K1.5 Phase 1 only (deterministic, no LLM).
- Primary files: new `lib/causal/frontmatter-promoter.ts`, `handlers/memory-index.ts` (post-index hook).
- Estimated LOC: 300-500.
- Dependencies: 029 (lifecycle so spurious edges can be tombstoned).
- ROI × Effort: HIGH × LOW. (LLM-based Phase 2 deferred.)

### Packet proposal 032 — MCP namespace rename (`spec_kit_memory` → `mk-memory`)
- Scope: K2.x (all).
- Primary files: `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.gemini/settings.json`, all docs/code with `mcp__mk_spec_memory__` (166 sites).
- Estimated LOC: ~10 config lines + ~166 search-and-replace text changes.
- Dependencies: none (independent of Track 1).
- ROI × Effort: HIGH × LOW. Should ship FIRST since it's a high-visibility, low-risk win.

## 7. Recommended Sequencing
1. 032 — namespace rename (HIGH ROI × LOW effort, ship first).
2. 028 — memoization + DAG foundation (HIGH × MEDIUM; unlocks 030 + 031).
3. 029 — causal lifecycle (MEDIUM × LOW; unblocks 031).
4. 031 — frontmatter causal-edge promoter (HIGH × LOW; depends on 029).
5. 030 — statediff layer (MEDIUM × HIGH; depends on 028).
6. (Deferred) LLM Phase 2 for K1.5 — packet TBD post-031 evaluation.

## 8. Non-Goals / Out of Scope
- Implementation of any port — separate packets.
- code_graph + skill_advisor improvements — covered by 027 phases 002-006.
- cocoindex-code MCP wrapper changes — 027/001.
- Embedding-provider changes — 014/010-014/013.
- Linear/Notion external doc impact of namespace rename — out of scope.

## 9. Open Questions Remaining (for downstream packets)
- 028: which chunking strategy in practice — H2 only, or H2 + frontmatter blocks?
- 030: which sink first — embedding or FTS?
- 032: backward-compat shim? (Current default: NO per memory `feedback_delete_not_archive_or_comment`.)

## 10. References
- External library: `external/cocoindex-main/`
- Target MCP: `.opencode/skills/system-spec-kit/mcp_server/`
- Iteration narratives: `research/iterations/iteration-{001..009}.md`
- Convergence dashboard: `research/deep-research-dashboard.md`

## 11. Convergence Report
- Stop reason: max_iterations OR all_questions_answered (10 iterations executed; 11/11 K-questions answered)
- Total iterations: 10
- Convergence threshold: 0.05
- Last 3 newInfoRatios: ~0.78 → 0.62 → 0.22 → (this iter, synthesis)
- Executor: cli-codex gpt-5.5 high fast (~3-4 min per iter, ~30 min total wall clock for iter-1..9)
```

## ALSO PRODUCE

1. `research/iterations/iteration-010.md` — brief synthesis-iteration narrative noting convergence + pointing to the freshly-written research.md.

2. JSONL appended to state.jsonl: `{"type":"iteration","iteration":10,...,"focus":"final-synthesis-research-md-emission","newInfoRatio":<0.05-0.15 — synthesis is consolidation, no new info>,"answeredQuestions":[],"status":"insight"}`.

3. `research/deltas/iter-010.jsonl`.

## CONSTRAINTS

- LEAF. Max 12 tool calls. Most calls are READS of prior iteration narratives.
- The main deliverable is the FULL research.md content. Target 4000-6000 words.
- Cite verbatim file:line where claims rest on cocoindex / spec_kit_memory source.
- No special regex chars in JSONL `focus`.

Go.
