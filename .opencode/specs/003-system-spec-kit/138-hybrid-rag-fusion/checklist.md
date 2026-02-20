# Verification Checklist: 138-Hybrid-RAG-Fusion (Root)

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

This is the **root checklist** for the 138-hybrid-rag-fusion spec folder. It tracks global quality gates across both workstreams. Sub-checklists exist in each sub-folder for detailed per-task tracking.

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval to defer |
| **[P2]** | Optional | Can defer with documented reason |

**Workstream Tags:**

| Tag | Workstream | Spec Folder |
|-----|-----------|-------------|
| `[W:RAG]` | Hybrid RAG Fusion (Workstream A) | `001-system-speckit-hybrid-rag-fusion/` |
| `[W:GRAPH]` | Skill Graph Integration (Workstream B) | `002-skill-graph-integration/` |
| `[W:INTEG]` | Cross-workstream integration | Both |
| `[W:UGRAPH]` | Unified Graph Intelligence (Workstream C) | `003-unified-graph-intelligence/` |

**Sub-checklists:**
- Workstream A detail: `001-system-speckit-hybrid-rag-fusion/checklist.md`
- Workstream B detail: `002-skill-graph-integration/checklist.md`
- Workstream C detail: `003-unified-graph-intelligence/checklist.md`
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:p0-blockers -->
## P0 — Hard Blockers

> All P0 items MUST be complete before claiming done. No exceptions.

- [ ] CHK-001 [P0] [W:RAG] Zero schema migrations verified — no v15 SQLite schema changes introduced by hybrid search implementation
- [ ] CHK-002 [P0] [W:RAG] 120ms latency ceiling maintained for `mode="auto"` end-to-end retrieval path
- [ ] CHK-003 [P0] [W:GRAPH] No external Neo4j dependency introduced — graph operations use SQLite adjacency tables only
- [x] CHK-004 [P0] [W:GRAPH] All 9 skills converted to graph architecture with SGQS-compatible metadata [STATUS: COMPLETE — Evidence: skill-graph-integration tasks verified 9/9 skills]
- [x] CHK-005 [P0] [W:GRAPH] `check-links.sh` passes with 0 broken wikilinks across all skill files [STATUS: COMPLETE — Evidence: link validation pass confirmed in Workstream B]
- [ ] CHK-006 [P0] [W:RAG] Feature flags default to `false` in production config — hybrid search, MMR, multi-query all opt-in
- [ ] CHK-007 [P0] [W:RAG] Token payload respects 2000-token hard limit — no retrieval result set exceeds budget
- [x] CHK-008 [P0] [W:GRAPH] SGQS compatibility maintained — no breaking changes to `memory_context`, `memory_search`, `memory_save` MCP interfaces [STATUS: COMPLETE — Evidence: SGQS grammar validated, existing callers unaffected]
- [ ] CHK-009 [P0] [W:RAG] Workstream A `spec.md` scope frozen — no new requirements added post-approval
- [x] CHK-010 [P0] [W:GRAPH] Workstream B `spec.md` scope frozen — no new requirements added post-approval [STATUS: COMPLETE — Evidence: spec.md locked, no subsequent edits]
<!-- /ANCHOR:p0-blockers -->

---

<!-- ANCHOR:p1-required -->
## P1 — Required (or user-approved deferral)

> P1 items must be complete OR have explicit user approval to defer with a documented reason.

- [ ] CHK-011 [P1] [W:RAG] MMR O(N²) candidate pool hardcapped to N=20 — prevents unbounded computation on large result sets
- [ ] CHK-012 [P1] [W:RAG] TRM (Temporal Relevance Model) Z-score threshold validated — decay curve tested against real memory timestamps
- [ ] CHK-013 [P1] [W:RAG] Multi-query expansion limited to 3 variants maximum — no runaway query fan-out
- [ ] CHK-014 [P1] [W:RAG] FTS5 BM25 weights balanced with RRF (Reciprocal Rank Fusion) — keyword and vector channel scores normalize correctly
- [x] CHK-015 [P1] [W:GRAPH] SGQS grammar supports MATCH / REL / WHERE / RETURN clauses [STATUS: COMPLETE — Evidence: grammar spec documented in Workstream B spec.md]
- [x] CHK-016 [P1] [W:GRAPH] Per-skill node coverage matrix complete — 9/9 skills have graph metadata [STATUS: COMPLETE — Evidence: coverage matrix verified in Workstream B tasks.md]
- [x] CHK-017 [P1] [W:GRAPH] workflows-documentation Skill Graph standards published — schema and conventions documented [STATUS: COMPLETE — Evidence: standards documented in Workstream B]
- [ ] CHK-018 [P1] [W:INTEG] Skill Graph metadata feeds the graph channel in hybrid search pipeline — `[W:RAG]` retrieval uses `[W:GRAPH]` node data
<!-- /ANCHOR:p1-required -->

---

<!-- ANCHOR:p2-optional -->
## P2 — Optional (deferral without approval)

> P2 items are enhancements. They can be deferred to a follow-up spec without approval. Document the deferral reason when skipping.

- [ ] CHK-019 [P2] [W:RAG] PageRank authority scoring implemented — skill/memory nodes weighted by inbound link count
  - *Deferral note (if skipped): [Reason + follow-up spec reference]*
- [ ] CHK-020 [P2] [W:RAG] AST-based chunking replaces sliding window — language-aware chunking for code-heavy memories
  - *Deferral note (if skipped): [Reason + follow-up spec reference]*
- [ ] CHK-021 [P2] [W:INTEG] Cross-skill SGQS traversal verified end-to-end — query spanning multiple skill graphs returns coherent results
  - *Deferral note (if skipped): [Reason + follow-up spec reference]*
- [ ] CHK-022 [P2] [W:INTEG] Benchmark data collected for pre/post retrieval quality — precision@5 and recall@10 measured before and after hybrid search
  - *Deferral note (if skipped): [Reason + follow-up spec reference]*
<!-- /ANCHOR:p2-optional -->

---

<!-- ANCHOR:workstream-c -->
## Workstream C: Unified Graph Intelligence (003)

> Cross-ref: `003-unified-graph-intelligence/checklist.md` for detailed verification items

- [ ] CHK-C01 [P0] graphSearchFn wired at context-server.ts:566 (receives 3 arguments)
- [ ] CHK-C02 [P0] createUnifiedGraphSearchFn() queries both Causal + SGQS graphs
- [ ] CHK-C03 [P0] SkillGraphCacheManager prevents per-query filesystem rebuild
- [ ] CHK-C04 [P0] graphWeight added to FusionWeights in adaptive-fusion.ts
- [ ] CHK-C05 [P0] Feature flag SPECKIT_GRAPH_UNIFIED gates new code paths
- [ ] CHK-C06 [P0] Pipeline latency p95 ≤ 120ms with graph channel active
- [ ] CHK-C07 [P1] Intent-to-Subgraph Routing implemented (Pattern 3)
- [ ] CHK-C08 [P1] Graph channel metrics exposed via memory_stats
- [ ] CHK-C09 [P2] ≥3 of 7 Intelligence Amplification Patterns operational
<!-- /ANCHOR:workstream-c -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] Architecture decisions documented in `decision-record.md` — ADRs cover retrieval pipeline, RRF weighting, SGQS query grammar
- [ ] CHK-101 [P1] All ADRs have accepted status — no ADRs left in Proposed state at completion
- [x] CHK-102 [P1] [W:GRAPH] Alternatives documented with rejection rationale — in-process graph (SQLite adjacency) chosen over Neo4j; rationale in decision-record.md [STATUS: COMPLETE]
- [ ] CHK-103 [P2] Migration path documented — upgrade guide for future schema changes to hybrid search tables
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] [W:RAG] Response time target met: `mode="auto"` p95 latency ≤ 120ms [Evidence format: benchmark run output]
- [ ] CHK-111 [P1] [W:RAG] Throughput target met: concurrent retrieval requests do not degrade beyond 2x single-request latency
- [ ] CHK-112 [P2] [W:RAG] Load testing completed — 100 consecutive retrieval calls at max corpus size (v15 DB)
- [ ] CHK-113 [P2] [W:INTEG] Performance benchmarks documented — pre/post comparison saved to `scratch/benchmarks/`
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] [W:RAG] Rollback procedure documented — disabling feature flags restores pure vector search with no data loss
- [ ] CHK-121 [P0] [W:RAG] Feature flags configured — `ENABLE_HYBRID_SEARCH`, `ENABLE_MMR`, `ENABLE_MULTI_QUERY` all default `false` in `config/production.json`
- [ ] CHK-122 [P1] [W:INTEG] Monitoring in place — skill graph link validation (`check-links.sh`) runs on post-merge CI
- [ ] CHK-123 [P1] [W:INTEG] Runbook created — operations guide for enabling hybrid search in production documented in `scratch/runbook.md`
- [ ] CHK-124 [P2] [W:INTEG] Deployment runbook peer-reviewed by second team member
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] [W:RAG] Security review completed — no user PII enters RAG pipeline; token budget prevents data exfiltration via retrieval
- [ ] CHK-131 [P1] [W:INTEG] Dependency licenses compatible — all new npm/Python packages used in scripts are MIT/Apache-2.0
- [ ] CHK-132 [P2] No new external network calls introduced — hybrid search and graph queries are fully local (SQLite + in-process)
- [ ] CHK-133 [P2] Data handling review — memory corpus handling complies with existing system-spec-kit data retention conventions
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized — `spec.md`, `plan.md`, `tasks.md`, `decision-record.md` reflect final implemented state
- [ ] CHK-141 [P1] [W:GRAPH] SGQS grammar spec published — grammar reference available in Workstream B spec or as standalone reference
- [x] CHK-142 [P1] [W:GRAPH] User-facing skill graph standards documented — `workflows-documentation` skill updated with graph conventions [STATUS: COMPLETE]
- [ ] CHK-143 [P2] Knowledge transfer documented — `implementation-summary.md` written at root and in each sub-folder
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Michel Kerkmeester | Technical Lead / Product Owner | [ ] Approved | |

> Note: Single-contributor project. Sign-off confirms all P0 and P1 items verified or explicitly deferred with documented rationale.
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified | Remaining |
|----------|-------|----------|-----------|
| P0 Items | 10 | 4 | 6 |
| P1 Items | 12 | 4 | 8 |
| P2 Items | 6 | 0 | 6 |
| L3+ Arch | 4 | 1 | 3 |
| L3+ Perf | 4 | 0 | 4 |
| L3+ Deploy | 5 | 0 | 5 |
| L3+ Compliance | 4 | 0 | 4 |
| L3+ Docs | 4 | 1 | 3 |
| **Total** | **49** | **10** | **39** |

**Last Updated**: 2026-02-20
**Completion**: ~20% (10/49 items verified)

**Workstream Progress:**
- [W:RAG] — 0/20 items complete (implementation pending)
- [W:GRAPH] — 8/10 items complete (implementation done)
- [W:INTEG] — 1/8 items complete (integration pending)
<!-- /ANCHOR:summary -->

---

<!--
Level 3+ root checklist for 138-hybrid-rag-fusion.
Covers global quality gates across Workstream A (RAG) and Workstream B (Graph).
Sub-checklists in 001-system-speckit-hybrid-rag-fusion/ and 002-skill-graph-integration/ track implementation detail.
Mark [x] with evidence format: [Evidence: description of proof]
P0 must complete before done claim. P1 needs approval to defer. P2 free to defer.
-->
