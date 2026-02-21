<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: 138 — Intelligent Context Architecture (Unified RAG Fusion + Skill Graphs)

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

This specification governs the transformation of the system-spec-kit from a basic retrieval system into an intelligent context engine through two complementary workstreams: Hybrid RAG Fusion (Workstream A) activates dormant tri-hybrid retrieval capabilities with fusion ranking and confidence gating, while Skill Graph Integration (Workstream B) decomposes monolithic skill files into a traversable knowledge graph that enriches the retrieval pipeline. Together they establish a zero-external-dependency, <120ms context delivery architecture on the existing v15 SQLite schema, eliminating the vocabulary mismatch and flat retrieval failures that currently degrade AI agent context quality.

**Key Decisions**: Reciprocal Rank Fusion over learned rerankers (latency vs. accuracy trade-off); in-process SGQS graph layer over Neo4j (zero external dependency constraint).

**Critical Dependencies**: Existing v15 SQLite schema must remain unchanged; BM25/FTS5 tokenizer behavior on current corpus must be validated before RRF weight tuning.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Number** | 138 |
| **Level** | 3+ |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-02-20 |
| **Branch** | `138-hybrid-rag-fusion` |
| **Parent Spec** | `.opencode/specs/003-system-spec-kit/` |
| **Workstream A Sub-Spec** | `001-system-speckit-hybrid-rag-fusion/spec.md` |
| **Workstream B Sub-Spec** | `002-skill-graph-integration/spec.md` |
| **Workstream C Sub-Spec** | `003-unified-graph-intelligence/spec.md` |
| **Workstream A Status** | Research + Planning COMPLETE — Implementation NOT started |
| **Workstream B Status** | ALL tasks COMPLETE |
| **Workstream C Status** | Spec + Planning COMPLETE — Implementation NOT started |
| **Complexity Score** | 92/100 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The system-spec-kit memory MCP operates three retrieval engines (Vector similarity, BM25 keyword, FTS5 full-text) in isolation, discarding the fusion signal that would emerge from combining their rankings. Simultaneously, skill knowledge is locked inside monolithic SKILL.md files with no graph traversal, forcing agents to load entire skill documents when only a subgraph of nodes is relevant. These two architectural gaps cause vocabulary-mismatch retrieval failures, low result diversity, and context payloads that are either too large (full skill files) or too shallow (single retrieval channel).

### Purpose

Deliver a unified intelligent context engine where hybrid retrieval with confidence gating and traversable skill graphs work together to provide AI agents with precise, diverse, and computationally affordable context within a 120ms latency ceiling — without any schema migrations or external database dependencies.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**Workstream A — Hybrid RAG Fusion** (sub-spec: `001-system-speckit-hybrid-rag-fusion/spec.md`)
- Unified Context Engine compositing Vector + BM25 + FTS5 channels via Reciprocal Rank Fusion (RRF)
- Maximal Marginal Relevance (MMR) diversity pruning on fused result sets
- Transparent Reasoning Module (TRM) with Z-score anomaly detection and confidence gating
- Multi-query expansion for vocabulary mismatch resolution (synonym + paraphrase variants)
- AST-based document parsing for structured section extraction
- PageRank authority scoring on the memory graph for result re-ranking

**Workstream B — Skill Graph Integration** (sub-spec: `002-skill-graph-integration/spec.md`)
- Decomposition of all 9 monolithic SKILL.md files into wikilink-connected Skill Graph nodes
- YAML frontmatter on all node files (id, title, type, tags, links)
- SGQS (Skill Graph-Lite Query Script) — Neo4j-style query layer implemented in-process on existing memory architecture
- Progressive disclosure traversal via `[[node]]` wikilinks
- Migration of: system-spec-kit, sk-documentation, mcp-code-mode, sk-git, mcp-chrome-devtools, mcp-figma, sk-code--full-stack, sk-code--opencode, workflows-code--web-dev

**Integration Layer**
- SGQS graph traversal results feeding into Workstream A's Graph Intelligence retrieval channel
- Skill Graph metadata enriching scatter-gather graph traversal during hybrid search
- Shared MCP server surface exposing unified `memory_context()` entry point
- Unified Graph Adapter connecting both Causal Edge and SGQS Skill Graph systems into a single `graphSearchFn`
- 7 Intelligence Amplification Patterns leveraging graph topology for diversity, authority, and routing
- See `003-unified-graph-intelligence/spec.md` for complete integration architecture

### Out of Scope

- External Neo4j or graph database deployment — in-process SGQS is the chosen approach; external graph DBs introduce operational overhead incompatible with the zero-external-dependency constraint
- Schema migrations on the v15 SQLite database — hard constraint; all enhancements must work within the existing schema
- Learned neural rerankers (cross-encoders, ColBERT) — latency cost exceeds the 120ms budget; RRF is the chosen fusion strategy
- New MCP tool surface beyond the existing `memory_*` namespace — all capability surfaced through existing tools
- Skills beyond the 9 listed in Workstream B scope

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/dist/memory/search.js` | Modify | Activate tri-hybrid retrieval channels and RRF fusion |
| `scripts/dist/memory/unified-engine.js` | Create | Unified Context Engine orchestrating all retrieval channels |
| `scripts/dist/memory/mmr.js` | Create | MMR diversity pruning module |
| `scripts/dist/memory/trm.js` | Create | Transparent Reasoning Module with Z-score confidence gating |
| `scripts/dist/memory/query-expand.js` | Create | Multi-query expansion for vocabulary mismatch |
| `scripts/dist/memory/ast-parser.js` | Create | AST-based document section extractor |
| `scripts/dist/memory/pagerank.js` | Create | PageRank authority scoring for memory graph |
| `scripts/dist/memory/sgqs.js` | Create | Skill Graph-Lite Query Script (in-process Neo4j-style layer) |
| `skill/*/nodes/*.md` | Create | Decomposed skill graph node files (9 skills, N nodes each) |
| `skill/*/SKILL.md` | Modify | Add wikilink index pointing to decomposed node files |

*See sub-specs for full per-file change tables.*
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Workstream | Requirement | Acceptance Criteria |
|----|-----------|-------------|---------------------|
| REQ-001 | A | Activate all three retrieval channels (Vector, BM25, FTS5) and fuse results using Reciprocal Rank Fusion | `memory_search()` returns results from all three channels; RRF-ranked list passes unit tests against known fixture corpus |
| REQ-002 | A | Transparent Reasoning Module must gate results below confidence threshold and surface Z-score outliers | TRM blocks results below `confidence_threshold=0.65`; Z-score anomalies flagged in response metadata |
| REQ-003 | A | End-to-end hybrid search latency ≤ 120ms at p95 on the production corpus | Benchmark harness reports p95 ≤ 120ms across 100 consecutive queries on v15 SQLite |
| REQ-004 | A | Zero schema migrations — all changes work on existing v15 SQLite schema | `sqlite3 .check` on db file shows no schema diff before/after implementation |
| REQ-005 | B | All 9 SKILL.md files decomposed into wikilink-connected node files with YAML frontmatter | Each skill directory contains `nodes/` subdirectory; all nodes parse without error via SGQS loader |
| REQ-006 | B | SGQS query layer resolves `[[node]]` wikilinks and returns traversal subgraphs | SGQS unit tests pass for depth-1 and depth-2 traversal on all 9 skill graphs |
| REQ-007 | Integration | SGQS graph traversal results available as a named channel in Unified Context Engine | `unified-engine.js` accepts `channels: ['vector', 'bm25', 'fts5', 'skill-graph']` configuration; skill-graph channel returns SGQS results |

### P1 — Required (complete OR user-approved deferral)

| ID | Workstream | Requirement | Acceptance Criteria |
|----|-----------|-------------|---------------------|
| REQ-008 | A | MMR diversity pruning reduces redundant results by ≥ 30% vs. naive top-K | A/B test on 50 multi-topic queries; MMR variant has ≥ 30% lower semantic similarity between returned documents |
| REQ-009 | A | Multi-query expansion generates ≥ 3 query variants and deduplicates results | Query expansion module produces ≥ 3 variants; deduplication keeps unique documents only |
| REQ-010 | A | AST-based parser extracts structured sections (h2, h3, code blocks) from memory documents | Parser correctly segments 95%+ of existing memory files in test suite |
| REQ-011 | A | PageRank authority scores computed on memory graph and incorporated into final ranking | PageRank scores present in result metadata; high-authority documents rank higher on authority-correlated test fixtures |
| REQ-012 | B | Progressive disclosure: SGQS returns minimal subgraph (depth-1) by default, expandable to depth-N | Default SGQS call returns depth-1 subgraph; `depth` parameter increases traversal radius |

### P2 — Optional (can defer without approval)

| ID | Workstream | Requirement | Acceptance Criteria |
|----|-----------|-------------|---------------------|
| REQ-013 | A | RRF weight parameters exposed as runtime configuration (not hardcoded) | `unified-engine.js` accepts `weights: { vector, bm25, fts5, skill_graph }` override parameter |
| REQ-014 | A | TRM reasoning traces persisted to scratch/ for debugging sessions | When `debug_mode=true`, TRM writes confidence breakdown to `scratch/trm-trace-{timestamp}.json` |
| REQ-015 | B | SGQS `MATCH` query syntax supports property filters (`WHERE node.type = 'procedure'`) | SGQS parser handles `WHERE` clauses on YAML frontmatter properties |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: p95 hybrid search latency ≤ 120ms on v15 SQLite production corpus, measured by benchmark harness over 100 queries
- **SC-002**: All three retrieval channels (Vector, BM25, FTS5) contribute to every fused result set; no channel silently returns empty
- **SC-003**: TRM correctly gates results below `confidence_threshold=0.65` in ≥ 99% of test cases
- **SC-004**: All 9 SKILL.md skills successfully decomposed; SGQS loader parses all node files without errors
- **SC-005**: SGQS depth-1 and depth-2 traversal unit tests pass for all 9 skill graphs
- **SC-006**: Integration channel (`skill-graph`) returns SGQS results through Unified Context Engine with no latency regression beyond the 120ms budget
- **SC-007**: Zero schema changes to v15 SQLite — confirmed by schema diff before/after
- **SC-008**: Workstream B sub-tasks remain COMPLETE (no regressions from integration work)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | v15 SQLite schema | Blocking — all retrieval channels depend on existing FTS5 virtual tables and vector columns being present and populated | Run schema validation script before any search module work begins |
| Dependency | BM25/FTS5 tokenizer behaviour on existing corpus | RRF weight tuning depends on channel signal quality; untested tokenizer edge cases could skew fusion | Validate tokenizer output on 50 representative memory documents before setting RRF weights |
| Dependency | Workstream B SGQS (REQ-006) | Graph Intelligence channel in Unified Context Engine cannot be wired until SGQS is stable | SGQS is already COMPLETE (Workstream B done); dependency is integration wiring only |
| Risk | 120ms latency budget exceeded by multi-query expansion | Generating 3+ query variants and running them in parallel adds wall-clock time | Expand queries in parallel goroutines / Promise.all; cache expansion results keyed by query hash |
| Risk | PageRank convergence time on large memory graphs | If memory graph is dense, PageRank may not converge within latency budget | Pre-compute PageRank scores at index time and cache; recompute incrementally on memory_save events |
| Risk | AST parser fails on non-standard markdown | Memory files use varied heading structures; parser may miss sections | Use robust markdown-it AST with fallback to regex for heading extraction; log parse failures to scratch/ |
| Risk | Wikilink resolution failures after skill graph decomposition | Broken `[[node]]` links cause SGQS traversal to silently drop nodes | SGQS loader validates all wikilinks at startup; broken links logged as warnings, not hard errors |
| Risk | Integration channel increases payload size beyond agent context limits | Skill graph subgraph results added to existing hybrid results could bloat context | MMR and TRM act as gatekeepers; enforce per-channel result cap (default 3 per channel) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: p95 hybrid search latency ≤ 120ms on v15 SQLite with all four channels active (Vector, BM25, FTS5, Skill Graph)
- **NFR-P02**: Multi-query expansion must not increase total query time by more than 40ms (all variants run in parallel)
- **NFR-P03**: PageRank scores must be pre-computed and cached; recomputation must not block search path
- **NFR-P04**: Memory footprint of in-process SGQS graph must not exceed 50MB resident for the 9-skill corpus

### Reliability
- **NFR-R01**: If any single retrieval channel fails, the Unified Context Engine must degrade gracefully and return results from remaining channels (no total failure)
- **NFR-R02**: TRM must never block ALL results — if confidence gating would eliminate 100% of results, return top-1 with a low-confidence flag
- **NFR-R03**: SGQS wikilink resolution failures must be non-fatal; broken links are logged and skipped

### Maintainability
- **NFR-M01**: All new modules (unified-engine.js, mmr.js, trm.js, query-expand.js, sgqs.js) must have corresponding unit test files
- **NFR-M02**: RRF fusion weights must be documented in code comments with rationale for chosen defaults
- **NFR-M03**: Skill graph node files must follow the documented YAML frontmatter schema; SGQS loader must reject malformed nodes with a clear error message

### Security & Privacy
- **NFR-S01**: No memory content transmitted outside the local process — all retrieval is in-process; no external API calls for search
- **NFR-S02**: Debug traces written to scratch/ must be excluded from git commits (covered by existing .gitignore patterns)
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Retrieval Boundaries
- **Empty corpus**: If the memory database has no documents, all channels return empty; Unified Context Engine returns empty result set with a `corpus_empty` flag — no crash
- **Single-channel availability**: If FTS5 virtual table is absent (fresh install), engine falls back to Vector + BM25 only; logs warning on startup
- **Query too short**: Single-character or empty queries bypass multi-query expansion and route directly to BM25 exact match

### RRF & Fusion
- **All channels return identical results**: MMR diversity pruning is a no-op; result set returned as-is with a `diversity_not_applicable` metadata flag
- **RRF ties**: Documents with identical RRF scores are broken by PageRank authority, then by recency (last_modified timestamp)
- **Confidence gating eliminates all results**: TRM returns top-1 result with `low_confidence: true` flag regardless of threshold; never returns empty set

### Skill Graph
- **Circular wikilinks**: SGQS traversal tracks visited nodes in a set; circular references are detected and traversal terminates without error
- **Missing node file**: If a `[[node]]` wikilink points to a non-existent file, SGQS logs a warning and continues traversal from other edges
- **Depth-N traversal on disconnected graph**: Disconnected skill graph components are returned as separate subgraph fragments in the response

### Integration
- **SGQS not yet initialized**: If Workstream A integration wiring runs before SGQS loader completes, the skill-graph channel returns empty with a `channel_not_ready` flag — fusion proceeds with 3 remaining channels
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 23/25 | Files: 10+ new/modified, LOC: ~1,500+ net new, Systems: memory MCP + all 9 skill directories |
| Risk | 22/25 | Core infrastructure change (search path), latency-critical (120ms budget), no schema fallback |
| Research | 18/20 | RRF weight calibration requires corpus analysis; MMR lambda tuning; PageRank convergence validation on real data |
| Multi-Agent | 14/15 | Two parallel workstreams (A: implementation pending, B: complete); integration coordination required |
| Coordination | 15/15 | Cross-workstream dependency (SGQS feeds hybrid engine); shared SQLite schema; shared MCP server surface |
| **Total** | **92/100** | **Level 3+ — Enterprise governance required** |

**Complexity Justification**: This specification governs core retrieval infrastructure changes that affect every AI agent using the memory MCP. Workstream A is not yet implemented, creating real execution risk. The latency constraint is hard (user-facing), the schema constraint is hard (data integrity), and the cross-workstream integration creates coordination overhead that justifies Level 3+ governance.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Hybrid search p95 latency exceeds 120ms due to multi-channel overhead | High | Medium | Parallel channel execution; PageRank pre-computation; profiling harness before release |
| R-002 | RRF weights produce worse retrieval quality than single-channel baseline | High | Low | A/B test against baseline on fixed evaluation set before switching default; easy rollback via config flag |
| R-003 | AST parser regression on production memory files | Medium | Medium | Validate parser on full existing corpus in CI before deployment; keep regex fallback path |
| R-004 | Workstream A integration breaks Workstream B's COMPLETE status | High | Low | Integration work isolated to new `unified-engine.js`; SGQS module is read-only from Workstream A's perspective |
| R-005 | TRM confidence threshold miscalibrated on real corpus | Medium | Medium | Expose threshold as runtime configuration; default 0.65 derived from Z-score analysis on 200 sample queries |
| R-006 | Skill graph node decomposition introduces maintenance burden | Low | High | Node files generated from SKILL.md structure; update procedure documented in sub-spec |
| R-007 | PageRank pre-computation adds unacceptable startup latency | Medium | Low | Compute incrementally; cache to disk between sessions; skip on cold start if cache valid |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Precise Multi-Topic Context Retrieval (Priority: P0)

**As an** AI agent performing a complex, multi-topic research task, **I want** hybrid retrieval that draws on keyword, semantic, and full-text signals simultaneously, **so that** I receive a diverse, high-quality result set even when my query terms don't exactly match stored document vocabulary.

**Acceptance Criteria**:
1. Given a query with vocabulary mismatch (synonyms used in query not in documents), When `memory_search()` is called, Then BM25 and Vector channels compensate for each other and the correct document appears in the top-5 RRF result
2. Given a multi-topic query, When MMR pruning is applied, Then adjacent results have semantic similarity < 0.85 (diversity guaranteed)

### US-002: Skill-Specific Context Without Full File Load (Priority: P0)

**As an** AI agent needing guidance on a specific sub-procedure within a skill, **I want** the context engine to return only the relevant skill graph nodes, **so that** I don't have to process the entire monolithic SKILL.md and can stay within my context window budget.

**Acceptance Criteria**:
1. Given a query matching a specific skill procedure, When SGQS depth-1 traversal runs, Then only the matched node and its direct neighbours are returned (not the full SKILL.md)
2. Given a traversal request with depth=2, When SGQS executes, Then second-order linked nodes are included and circular links do not cause infinite loops

### US-003: Confidence-Gated Result Quality (Priority: P0)

**As an** AI agent acting on retrieved context, **I want** the Transparent Reasoning Module to flag low-confidence results, **so that** I can apply appropriate scepticism to uncertain context rather than acting on it as ground truth.

**Acceptance Criteria**:
1. Given a query that returns ambiguous or low-similarity results, When TRM evaluates confidence scores, Then results below `confidence_threshold=0.65` are flagged with `low_confidence: true` in metadata
2. Given a pathological corpus where all results are below threshold, When TRM runs, Then at least 1 result is returned (never empty set), with `low_confidence: true`

### US-004: Infrastructure Stability Under Integration (Priority: P1)

**As the** system-spec-kit maintainer, **I want** Workstream A's hybrid engine to integrate with Workstream B's SGQS without regressing any existing functionality, **so that** the 9 already-completed skill graph migrations remain stable and operational.

**Acceptance Criteria**:
1. Given the integration of SGQS into the Unified Context Engine, When all existing Workstream B tests are re-run, Then 100% pass (zero regressions)
2. Given a failure in the skill-graph channel, When the Unified Context Engine runs, Then it degrades to 3-channel mode and returns results normally
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:approval-workflow -->
## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review (unified parent) | Project Owner | Pending | — |
| Workstream B Completion Review | Project Owner | Approved | 2026-02-20 |
| Workstream A Design Review | Project Owner | Pending | — |
| Workstream A Implementation Review | Project Owner | Pending | — |
| Integration Review (A + B unified) | Project Owner | Pending | — |
| Launch Approval | Project Owner | Pending | — |
<!-- /ANCHOR:approval-workflow -->

---

<!-- ANCHOR:compliance -->
## 13. COMPLIANCE CHECKPOINTS

### Architecture Compliance
- [x] Zero external database dependencies confirmed (SGQS is in-process)
- [x] Zero schema migrations required — v15 SQLite schema unchanged
- [ ] Latency budget validated on production corpus (p95 ≤ 120ms)
- [ ] Benchmark harness reviewed and approved

### Code Compliance
- [ ] All new modules have unit test coverage
- [ ] RRF weight defaults documented with calibration rationale
- [ ] SGQS query syntax documented for future skill authors
- [x] Coding standards followed (existing codebase patterns)
- [x] No external license dependencies introduced (in-process implementations only)

### Integration Compliance
- [x] Workstream B SGQS stable and COMPLETE before integration wiring begins
- [ ] Integration channel tested in isolation before being enabled by default
- [ ] Graceful degradation tested (single channel failure scenarios)
<!-- /ANCHOR:compliance -->

---

<!-- ANCHOR:stakeholders -->
## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Project Owner (michelkerkmeester) | Decision maker, sole implementer | High — core infrastructure change affects all daily AI agent workflows | Spec approval at each checkpoint; async review of implementation PRs |
| AI Agents (daily users) | Context consumers via memory MCP | High — retrieval quality directly impacts task accuracy | Validated via benchmark and test harness output; no human communication channel |
<!-- /ANCHOR:stakeholders -->

---

<!-- ANCHOR:changelog -->
## 15. CHANGE LOG

### v1.1 (2026-02-20)
**Added Workstream C (003-unified-graph-intelligence) covering the merge of Skill Graph topology with RAG Fusion pipeline through a Unified Graph Adapter. Spec, plan, tasks, checklist, and decision-record created.**

### v1.0 (2026-02-20)
**Initial unified specification**
- Established Level 3+ parent spec covering Workstream A (Hybrid RAG Fusion) and Workstream B (Skill Graph Integration)
- Documented cross-workstream integration architecture and shared constraints
- Recorded Workstream B status as COMPLETE; Workstream A as Research + Planning COMPLETE, Implementation NOT started
- Defined 92/100 complexity score and Level 3+ governance rationale
<!-- /ANCHOR:changelog -->

---

<!-- ANCHOR:questions -->
## 16. OPEN QUESTIONS

- **Q1**: Should RRF weights be tuned per-query-type (e.g., code queries vs. prose queries) or kept uniform across all query types? Uniform weights are simpler; per-type weights require query classification overhead.
- **Q2**: PageRank pre-computation frequency — should it trigger on every `memory_save` event or only on a scheduled interval (e.g., every 10 saves)? Every save is safest for freshness; interval reduces compute cost on bulk import sessions.
- **Q3**: Should the SGQS skill-graph channel be enabled by default in the Unified Context Engine, or opt-in via configuration? Default-on is simpler for users; opt-in allows incremental rollout and easier A/B testing.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Workstream A Sub-Spec**: `001-system-speckit-hybrid-rag-fusion/spec.md`
- **Workstream B Sub-Spec**: `002-skill-graph-integration/spec.md`
- **Workstream C Sub-Spec**: `003-unified-graph-intelligence/spec.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Research Archive**: See `research/` directory (13 analysis + recommendation documents)

---

<!--
LEVEL 3+ SPEC — 138: Intelligent Context Architecture
Parent spec governing two workstreams. Sub-specs hold detailed requirements.
Complexity: 92/100 | Status: In Progress | Schema constraint: v15 SQLite, zero migrations
-->
