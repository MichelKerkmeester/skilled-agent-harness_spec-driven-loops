# Deep-Research Strategy — Pt-03 (027-XCE Coco-Index + Memory Scope Expansion)

**Topic:** Pt-03 XCE teaching opportunities BEYOND code-graph: mcp-coco-index improvements + system-spec-kit memory backend / causal graph improvements.

**Spec folder:** `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`
**Packet:** `research/027-xce-research-pt-03/`
**Executor:** cli-codex / gpt-5.5 / reasoning=high / serviceTier=fast / sandbox=workspace-write
**Max iterations:** 10
**Convergence threshold:** 0.05
**Created:** 2026-05-09T11:30:00Z
**Session:** `2026-05-09-027-pt-03-codex-gpt55-coco-memory`

---

## Research Charter

**Goal.** Pt-01 and pt-02 are convergent on five code-graph + skill-advisor phases (004→001→{002,003}→005). Pt-03 extends scope to the two systems explicitly NOT covered by those phases: `mcp-coco-index` (the local semantic-search fork) and the system-spec-kit memory backend / causal graph. For each candidate XCE teaching, produce an ADOPT / ADAPT / DEFER / SKIP verdict with ≥3 file:line-cited findings.

**Non-goals.**
- Re-evaluate the existing 5 code-graph phases (pt-01 / pt-02 territory).
- Resolve pt-02's 6 open code-graph policy decisions (dangling-edge policy, module semantics, normalizer constants, test heuristic scope, Phase 005 split, third-pass necessity).
- Replace coco-index with anything (`spec.md:144` already SKIPs this).
- Adopt SaaS dependencies (`mcp.xanther.ai`, `xanther.ai`, etc. — pt-01 RQ9 SKIP boundary holds).
- Propose any change requiring an embedding-model swap or full re-embed (cost/risk out of scope).

**Stop conditions.**
- All 10 RQs answered with verdict + ≥3 cited findings, OR
- Convergence vote (3-signal) STOP at iter ≥ 4 AND graph_decision is STOP_ALLOWED or absent, OR
- maxIterationsReached at iter 10 (terminal cap; quality-guards are evidence, not blockers).

**Quality guards.**
- Verdict diversity: ≥1 each of ADOPT / ADAPT / DEFER / SKIP across all 10 iter findings.
- Evidence density: ≥3 file:line citations per RQ verdict.
- Cross-phase dependencies: each ADOPT/ADAPT must declare which existing 027 phase (001-005) it depends on.

---

## Key Questions

- [ ] **RQ-A1** — Can XCE's intent-steering pattern teach mcp-coco-index when to fire AND how to expand single queries into intent-tagged multi-queries?
- [ ] **RQ-A2** — Can Phase 001's deterministic HLD/LLD narrative be folded into coco-index's path-class rerank to boost hits near known module boundaries / role anchors?
- [ ] **RQ-A3** — Should `ccc_feedback` JSONL graduate from write-only telemetry to a feedback-driven rerank-weight loop?
- [ ] **RQ-A4** — Few-shot example-bank retrieval — can prior validated hits surface as positive exemplars in next query?
- [ ] **RQ-A5** — Cross-cutting: should coco-index and code-graph share a single fused rerank stage (one combined score)?
- [ ] **RQ-B1** — Should `memory_match_triggers` graduate from lexical/regex to embedding-based semantic similarity using the existing Voyage-4 cache?
- [ ] **RQ-B2** — Can `memory_context` assembly become LLM-curated (XCE-style dynamic packaging) instead of rule-based templates?
- [ ] **RQ-B3** — Can causal edges be auto-inferred from session traces within existing NFR-R01 caps?
- [ ] **RQ-B4** — Can `lib/feedback/feedback-ledger.ts` signals drive learned retention/decay decisions (constitutional-tier basement, hit-rate-weighted TTL)?
- [ ] **RQ-B5** — Cross-cutting: shared embedding cache + rerank infra between memory backend and coco-index?

---

## Iteration Allocation (planned)

| Iter | RQ | Group | Focus |
|------|----|----|----|
| 1 | RQ-A1 | A | Coco-index intent steering + query expansion (read SKILL.md, query.py, settings.py, .ccc_feedback schema) |
| 2 | RQ-A2 | A | Coco-index rerank fusion w/ code-graph HLD/LLD (Phase 001 dependency) |
| 3 | RQ-A3 | A | ccc_feedback graduation to active rerank loop |
| 4 | RQ-A4 | A | Few-shot example-bank retrieval |
| 5 | RQ-A5 | A | Cross-cutting coco+graph fused rerank |
| 6 | RQ-B1 | B | Semantic trigger matching (Voyage-4 reuse) |
| 7 | RQ-B2 | B | LLM-curated memory_context assembly |
| 8 | RQ-B3 | B | Session-trace bounded causal-edge inference |
| 9 | RQ-B4 | B | Feedback-ledger learned retention/decay |
| 10 | RQ-B5 | B | Cross-cutting coco+memory shared infra + final synthesis |

---

## Known Context

### Pt-01 baseline (10 iter, deepseek-v4-pro, converged 2026-05-08)
Adoption matrix across RQ1-RQ9 produced 4 ADOPT / 9 ADAPT / 2 DEFER / 6 SKIP verdicts. Five phase children scaffolded:
- **Phase 004** — Skill Advisor First-Action Mandate (L1, ~80-120 LOC, ADAPT)
- **Phase 001** — Deterministic HLD/LLD Narrative (L2, ~250 LOC, ADOPT)
- **Phase 002** — Symbol-to-Architecture Trace Tool (L2, ~390-460 LOC, ADAPT)
- **Phase 003** — Risk-Scored Impact Analysis (L2, ~430-570 LOC, ADAPT)
- **Phase 005** — Code-Graph Adoption Eval Harness (L3, ~500-800 LOC, ADAPT + DEFER eval methodology)

XCE explicitly SCOPED OUT (RQ9 boundary): SaaS hosting (mcp.xanther.ai), centralized xanther.ai dependency, closed PRAT internals, mini-swe-agent, SWE-bench Docker, hybrid multi-pass.

### Pt-02 cross-validation (10 IRQ, gpt-5.5 high fast, converged 2026-05-09)
Identified 6 open policy decisions in code-graph phases (dangling-edge, module semantics, normalizer constants, TESTED_BY direction, test heuristic, Phase 005 split). Out of pt-03 scope.

### Coco-index fork (current state)
- `mcp-coco-index/SKILL.md` — CLI + MCP surface, embedding model selection, references/
- `mcp-coco-index/mcp_server/cocoindex_code/query.py` — KNN search, dedup, path-class rerank ±0.05
- `mcp-coco-index/mcp_server/cocoindex_code/{indexer,schema,client,server,config,settings}.py`
- Embeddings: `voyage/voyage-code-3` (1024-dim) primary; `all-MiniLM-L6-v2` (384-dim) fallback
- Fork additions: `dedupedAliases`, `uniqueResultCount`, `source_realpath`, `content_hash`, `path_class`, `raw_score`, `rankingSignals`
- Code-graph integration points (separate stores): `mcp_server/code_graph/lib/seed-resolver.ts`, `mcp_server/code_graph/handlers/ccc-status.ts`, `mcp_server/lib/search/cocoindex-calibration.ts`
- `ccc_feedback` JSONL — write-only telemetry, never consumed (key observation from analysis)

### Memory backend (current state)
- `mcp_server/handlers/memory-{save,search,context,triggers,update,delete,list,validate,health,index-scan,causal-link,causal-stats,causal-unlink,drift-why,retention-sweep,bulk-delete,quick-search,ingest-{start,status,cancel}}.ts`
- 4-stage hybrid retrieval: vector (Voyage-4 1024-dim) → BM25 (FTS5) → causal-boost → rerank (Voyage Rerank when enabled)
- `mcp_server/lib/parsing/trigger-matcher.ts` — keyword/regex, candidate index, NOT semantic
- `mcp_server/lib/storage/causal-edges.ts` — 6 relations, 0-1 strength, weight history, sparse-first policy, 2-hop boost ceiling 0.2
- NFR-R01 caps: ≤20 edges/node, auto-edge strength ≤0.5, 100/relation/window
- `mcp_server/lib/feedback/feedback-ledger.ts` + `shadow-scoring.ts` — signals captured, NOT wired into trigger or retention scoring

### XCE source corpus (read-only, in `external/`)
- README.md (283 lines) — public surface, tool catalog, +7.4pp SWE-bench / ~20% token reduction, steering examples
- 6 IDE-specific steering rules (CLAUDE.md, kiro.md, .cursorrules, .clinerules, .windsurfrules, opencode-prompt.txt) — unconditional "use first" pattern
- 5 MCP server configs (cursor, windsurf, kiro, opencode, claude-code)
- 3 PNG assets (xce-hero, xce-benchmarks, xce-integrations)

### Resource map
`{spec_folder}/resource-map.md` is present at packet root → coverage gate active. Pt-03 should treat its inventoried files as the EXCLUSION SET when hunting for net-new files; flag only missed-from-map candidates as gaps.

---

## Next Focus

Iter 1 → RQ-A1 (Coco-index intent steering + query expansion). Read order: `external/README.md` (XCE steering examples) → `mcp-coco-index/SKILL.md` (current invocation conditions) → `mcp_server/cocoindex_code/query.py` (current query handling) → infer XCE-style intent classification overlay design.
