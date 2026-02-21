# Implementation Plan: 138 - Intelligent Context Architecture

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js), SQLite (FTS5), Shell |
| **Framework** | system-spec-kit MCP memory layer, vitest |
| **Storage** | SQLite with FTS5 full-text search + graph edge tables |
| **Testing** | vitest unit + integration tests |

### Overview

This plan coordinates two workstreams that together upgrade the system-spec-kit intelligent context system. Workstream A (Hybrid RAG Fusion) enhances the memory retrieval pipeline in `lib/search/` by activating dormant graph features, introducing MMR diversity pruning, TRM confidence gating, BM25 weighted FTS5 queries, multi-query expansion, and AST-based chunking — all dark-launched via feature flags. Workstream B (Skill Graph Integration) migrates all nine skills to an SGQS-enriched graph metadata schema, providing the structured skill relationship data that Workstream A's graph channel depends on. Workstream B is fully complete; Workstream A has not yet started.

See sub-plans for phase details:
- `001-system-speckit-hybrid-rag-fusion/plan.md` — Workstream A phases 0–5
- `002-skill-graph-integration/plan.md` — Workstream B phases 1–5
- `003-unified-graph-intelligence/plan.md` — Workstream C: Integration phases 0+, 1+, 2+
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in spec.md
- [x] Success criteria measurable (precision, recall, confidence thresholds)
- [x] Workstream B complete — SGQS metadata available for graph channel
- [x] Feature flag infrastructure identified (SPECKIT_MMR, SPECKIT_TRM, SPECKIT_MULTI_QUERY)
- [x] Target files confirmed: hybrid-search.ts, rrf-fusion.ts, adaptive-fusion.ts, co-activation.ts

### Definition of Done
- [ ] All Workstream A phases (0–5) implemented and passing
- [ ] Workstream C (003) Phase 0+ complete — graphSearchFn wired and returning results
- [ ] Feature flags togglable without code changes
- [ ] vitest suite green with ≥80% coverage on modified modules
- [ ] No regression in existing memory_search / memory_context behaviour
- [ ] checklist.md P0 + P1 items verified with evidence
- [ ] implementation-summary.md written post-implementation
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Pipeline + Feature-Flag Dark Launch — a staged retrieval pipeline where each enhancement layer is independently gated behind an environment variable. Layers compose additively: each phase adds a new transformation without breaking prior behaviour.

### Key Components

- **hybrid-search.ts**: Top-level orchestrator that merges vector, FTS5, and graph channels into a ranked result set. Primary integration point for all Workstream A changes.
- **rrf-fusion.ts**: Reciprocal Rank Fusion combiner. Phase 2 extends it with BM25-weighted FTS5 CTEs and graph edge weight multipliers.
- **adaptive-fusion.ts**: Dormant `useGraph:true` path and adaptive-fusion weight tuning. Phase 0 activates existing code; Phase 1 adds TRM confidence gating.
- **co-activation.ts**: Dormant co-activation scoring. Phase 0 enables; Phase 4 adds PageRank authority and entity linking.
- **SGQS metadata (Workstream B output)**: Structured skill-graph edge data in SQLite, consumed by the graph channel in hybrid-search.ts.
- **Unified Graph Adapter (Workstream C output)**: Composite `graphSearchFn` wiring both Causal Edge and SGQS Skill Graph systems into the graph channel slot. See `003-unified-graph-intelligence/plan.md`.
- **Feature flag layer**: `process.env.SPECKIT_MMR`, `SPECKIT_TRM`, `SPECKIT_MULTI_QUERY` guard each enhancement independently.

### Data Flow

```
Query Input
    │
    ├─► [FTS5 BM25 channel]  ←── SQLite CTEs with edge-weight multipliers (Phase 2)
    ├─► [Vector channel]      ←── embeddings (unchanged)
    └─► [Graph channel]       ←── Unified Graph Adapter (WS-C: causal edges + SGQS skill graph)
           │
           ▼
    RRF Fusion (rrf-fusion.ts)
           │
           ▼
    Adaptive Fusion (adaptive-fusion.ts)
           │
           ▼
    MMR Diversity Pruning  (Phase 1, flag: SPECKIT_MMR)
           │
           ▼
    TRM Confidence Gating  (Phase 1, flag: SPECKIT_TRM)
           │
           ▼
    Multi-Query Expansion  (Phase 3, flag: SPECKIT_MULTI_QUERY, mode=deep only)
           │
           ▼
    Ranked + Diversified Result Set → MCP response
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Workstream B: Skill Graph Integration — COMPLETE

All five phases are done. SGQS metadata for all nine skills is present in SQLite. Sub-plan: `002-skill-graph-integration/plan.md`.

| Phase | Description | Status |
|-------|-------------|--------|
| B-1 | Tooling: check-links.sh, SGQS grammar, metadata mapping, coverage matrix | Done |
| B-2 | Pilot migration: system-spec-kit decomposition | Done |
| B-3 | Broad migration: all 9 skills | Done |
| B-4 | SGQS implementation + compatibility gates | Done |
| B-5 | Global verification: link integrity, traversal, SGQS scenarios | Done |

---

### Workstream A: Hybrid RAG Fusion — NOT STARTED

Sub-plan: `001-system-speckit-hybrid-rag-fusion/plan.md`

#### Phase 0: Activate Dormant Assets
- [ ] Enable `useGraph: true` in hybrid-search.ts configuration
- [ ] Activate adaptive-fusion weight path in adaptive-fusion.ts
- [ ] Enable co-activation scoring in co-activation.ts
- [ ] Enable adaptive fallback logic
- [ ] Smoke test: graph channel returns results for a known query

#### Phase 1: MMR Diversity Pruning + TRM Confidence Gating (Core Upgrade)
- [ ] Implement Maximal Marginal Relevance pruning in rrf-fusion.ts (flag: SPECKIT_MMR)
- [ ] Implement Threshold Relevance Masking confidence gate (flag: SPECKIT_TRM)
- [ ] Unit tests: MMR deduplication, TRM gating at boundary values

#### Phase 2: FTS5 BM25 Weighted Queries + Graph Edge Weight Multipliers
- [ ] Rewrite FTS5 query path in hybrid-search.ts to emit BM25-weighted scores
- [ ] Add SQLite CTE with graph edge weight multipliers in rrf-fusion.ts
- [ ] Integration test: FTS5 channel outscores unweighted baseline on targeted queries

#### Phase 3: Rule-Based Multi-Query Expansion (mode="deep")
- [ ] Implement synonym/expansion rules for deep-mode queries (flag: SPECKIT_MULTI_QUERY)
- [ ] Gate expansion to `mode === 'deep'` only — no impact on default searches
- [ ] Unit test: expansion rules produce expected query variants

#### Phase 4: AST-Based Chunking + PageRank Authority + Entity Linking
- [ ] Integrate remark-gfm AST parser for Markdown chunking
- [ ] Implement PageRank authority scoring for graph nodes in co-activation.ts
- [ ] Add entity linking pass to connect chunk entities to graph nodes
- [ ] Integration test: chunking produces finer-grained results than line-based split

#### Phase 5: Test Coverage (vitest)
- [ ] Write / extend vitest suites for all modified modules
- [ ] Coverage target: ≥80% line coverage on hybrid-search.ts, rrf-fusion.ts, adaptive-fusion.ts, co-activation.ts
- [ ] CI run green with no regressions
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | MMR pruning, TRM gating, multi-query expansion, BM25 weight math | vitest |
| Unit | AST chunking (remark-gfm), PageRank scoring, entity linking | vitest |
| Integration | Full hybrid-search pipeline: vector + FTS5 + graph channels → fused rank | vitest + SQLite in-memory |
| Integration | Feature flag toggling — each flag on/off produces expected behaviour delta | vitest |
| Regression | Existing memory_search / memory_context API contracts unchanged | vitest existing suite |
| Smoke | Phase 0 activation: graph channel returns results before any new logic | Manual / vitest |

All tests live in `test/` or co-located `*.test.ts` files. No new test framework dependencies — vitest is already installed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Workstream B (SGQS metadata) | Internal | Green — complete | Graph channel in Phase 0 cannot activate without edge data |
| SQLite FTS5 extension | Internal | Green — present | Phase 2 FTS5 BM25 queries blocked |
| remark-gfm (npm package) | External | Yellow — needs install | Phase 4 AST chunking blocked; fallback to line-split |
| vitest | Internal | Green — installed | Phase 5 coverage blocked |
| Feature flag env layer | Internal | Green — trivial to add | All phases can proceed without it but launch gating breaks |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Regression in memory_search precision, unexpected latency spike (>2x baseline), or test failures after any phase merge.
- **Procedure**: Disable the relevant feature flag (`SPECKIT_MMR=false`, `SPECKIT_TRM=false`, `SPECKIT_MULTI_QUERY=false`). Zero code rollback required for phases behind flags. For Phase 0 (activation), revert the config change in hybrid-search.ts (single line). No database migrations are involved — SQLite schema is unchanged.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
WS-B (Complete) ─────────────────────────────────────────────┐
                                                              │
Phase 0 (Activate dormant assets) ───────────────────────────┤
    │                                                         │
    ▼                                                         ▼
Phase 1 (MMR + TRM)                          Phase 2 (BM25 + Graph edge weights)
    │                                                         │
    └──────────────────────┬──────────────────────────────────┘
                           ▼
                   Phase 3 (Multi-query expansion)
                           │
                           ▼
                   Phase 4 (AST chunking + PageRank + entity linking)
                           │
                           ▼
                   Phase 5 (Test coverage + CI green)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| WS-B | None (done) | Phase 0 graph activation |
| Phase 0 | WS-B | Phase 1, Phase 2 |
| Phase 1 | Phase 0 | Phase 3 |
| Phase 2 | Phase 0 | Phase 3 |
| Phase 3 | Phase 1, Phase 2 | Phase 4 |
| Phase 4 | Phase 3 | Phase 5 |
| Phase 5 | Phase 4 | Release |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| WS-B (Skill Graph Integration) | High | 13–17 hours (complete) |
| WS-A Phase 0: Activate dormant assets | Low | 1–2 hours |
| WS-A Phase 1: MMR + TRM | Medium | 3–5 hours |
| WS-A Phase 2: BM25 + graph edge weights | High | 4–6 hours |
| WS-A Phase 3: Multi-query expansion | Medium | 2–3 hours |
| WS-A Phase 4: AST chunking + PageRank + entity linking | High | 5–8 hours |
| WS-A Phase 5: Test coverage | Medium | 3–4 hours |
| **WS-A Total** | | **18–28 hours** |
| **Grand Total (both workstreams)** | | **31–45 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Feature flags documented and defaults confirmed (all off = current behaviour)
- [ ] Baseline memory_search benchmark captured (latency + precision sample)
- [ ] vitest suite green on main branch before any Phase 0 changes merge

### Rollback Procedure
1. Set feature flag to `false` for the affected phase (immediate, no deploy needed)
2. If Phase 0 activation causes issues, revert the `useGraph: true` config line and redeploy
3. Run vitest regression suite to confirm restored behaviour
4. Document rollback reason in `memory/` context file for the next session

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — all changes are code-only; SQLite schema is read-only from Workstream A's perspective
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐
│   WS-B (Done)    │
│  SGQS Metadata   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│    Phase 0       │
│ Activate dormant │
└───────┬──────────┘
        │
   ┌────┴────┐
   ▼         ▼
┌──────┐  ┌──────┐
│  P1  │  │  P2  │
│ MMR  │  │ BM25 │
│ TRM  │  │Graph │
└──┬───┘  └──┬───┘
   └────┬────┘
        ▼
┌──────────────────┐
│    Phase 3       │
│  Multi-query     │
│  expansion       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│    Phase 4       │
│  AST chunking    │
│  PageRank        │
│  Entity linking  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│    Phase 5       │
│  Test coverage   │
│  CI green        │
└──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| WS-B SGQS metadata | None | Structured graph edges in SQLite | Phase 0 graph activation |
| Phase 0 activation | WS-B | Graph + co-activation channels live | Phase 1, Phase 2 |
| Phase 1 MMR + TRM | Phase 0 | Diversity-pruned, confidence-gated results | Phase 3 |
| Phase 2 BM25 + edge weights | Phase 0 | Weighted FTS5 + graph scores in fusion | Phase 3 |
| Phase 3 multi-query | Phase 1, Phase 2 | Expanded query set for deep mode | Phase 4 |
| Phase 4 AST + PageRank | Phase 3 | Finer-grained chunks, authority-scored nodes | Phase 5 |
| Phase 5 test coverage | Phase 4 | ≥80% coverage, CI green | Release |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **WS-B SGQS Metadata** — 13–17 hours — COMPLETE (unblocked)
2. **Phase 0: Activate dormant assets** — 1–2 hours — CRITICAL (gates everything)
3. **Phase 1: MMR + TRM** — 3–5 hours — CRITICAL (gates Phase 3)
4. **Phase 2: BM25 + graph edge weights** — 4–6 hours — CRITICAL (gates Phase 3, parallel with Phase 1)
5. **Phase 3: Multi-query expansion** — 2–3 hours — CRITICAL (gates Phase 4)
6. **Phase 4: AST chunking + PageRank + entity linking** — 5–8 hours — CRITICAL (gates Phase 5)
7. **Phase 5: Test coverage + CI** — 3–4 hours — CRITICAL (gates release)

**Total Critical Path (WS-A only)**: 18–28 hours

**Parallel Opportunities**:
- Phase 1 (MMR + TRM) and Phase 2 (BM25 + graph edge weights) can run simultaneously after Phase 0
- Phase 5 test writing can begin for Phase 0–2 modules while Phase 3–4 are in progress
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M0 | WS-B complete | SGQS metadata present for all 9 skills, Phase B-5 verified | Done |
| M1 | Graph channel live | Phase 0 complete; graph channel returns results in smoke test | Start of WS-A |
| M2 | Core retrieval upgraded | Phase 1 + Phase 2 complete; MMR + TRM + BM25 all flag-gated and tested | After M1 |
| M3 | Full pipeline integrated | Phase 3 + Phase 4 complete; deep-mode expansion and AST chunking working | After M2 |
| M4 | Release ready | Phase 5 complete; ≥80% coverage, CI green, no regressions, checklist P0/P1 verified | After M3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Dark Launch via Feature Flags

**Status**: Accepted

**Context**: Workstream A introduces five distinct retrieval enhancements. Rolling back a single enhancement after a combined deploy is costly.

**Decision**: Each enhancement is gated behind a dedicated environment variable. Runtime flag behavior follows rollout-policy semantics (unset/empty/`true` enabled, explicit `false` disabled), and rollout control uses explicit `false` during dark-launch phases where baseline behavior must be preserved.

**Consequences**:
- Positive: Each phase is independently reversible in seconds without a code deploy.
- Positive: Allows A/B comparison of individual enhancements in staging.
- Negative: Feature flag sprawl if not cleaned up post-stabilisation. Mitigation: flags are removed after each phase has been stable for two release cycles.

**Alternatives Rejected**:
- Branch-per-phase: Merge conflicts compound across five phases; rejected.
- Runtime config file: Adds config management overhead; env vars are sufficient.

---

### ADR-002: SGQS Metadata as Graph Channel Input

**Status**: Accepted

**Context**: The graph channel in hybrid-search.ts was dormant because no structured skill relationship data existed in SQLite.

**Decision**: Use Workstream B's SGQS-enriched edge data (already written to SQLite by WS-B) as the graph channel input. No new schema changes are required from Workstream A's side.

**Consequences**:
- Positive: Zero additional schema migration risk for Workstream A.
- Positive: Workstream B's Phase B-5 verification covers data integrity.
- Negative: Workstream A is blocked on Workstream B completion. Mitigation: WS-B is fully complete.

---

<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation
**Files**: spec.md (sections 1–3), plan.md (sections 1–3)
**Duration**: ~60s
**Agent**: Primary (@speckit / @general)
**Notes**: Must be read before any implementation agent begins. Contains feature flag names, target files, and dependency ordering.

### Tier 2: Parallel Execution

| Agent | Focus | Files |
|-------|-------|-------|
| Implementation Agent A | Phase 0 + Phase 1 (MMR, TRM, graph activation) | hybrid-search.ts, adaptive-fusion.ts, co-activation.ts |
| Implementation Agent B | Phase 2 (BM25, SQL CTEs, edge weights) | rrf-fusion.ts, hybrid-search.ts |
| Test Agent | Phase 5 skeleton + Phase 0–2 unit tests | test/*.test.ts |

**Duration**: ~90s (parallel)
**Sync Point**: SYNC-001 — after Phase 0 completes, confirm graph channel is live before Agent A proceeds to Phase 1 and Agent B proceeds to Phase 2.

### Tier 3: Integration
**Agent**: Primary
**Task**: Merge Phase 1 + Phase 2 outputs into Phase 3 (multi-query expansion depends on both). Resolve any import/type conflicts in hybrid-search.ts.
**Duration**: ~60s

### Tier 4: Late Phases (Sequential)
**Agent**: Primary or Implementation Agent A
**Task**: Phase 4 (AST chunking, PageRank, entity linking) then Phase 5 (full coverage sweep).
**Duration**: ~120s
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:workstreams -->
## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Owner | Key Files | Status |
|----|------|-------|-----------|--------|
| W-A | Hybrid RAG Fusion | Primary | hybrid-search.ts, rrf-fusion.ts, adaptive-fusion.ts, co-activation.ts | Not started |
| W-B | Skill Graph Integration | Primary | skills/*/SKILL.md, SQLite SGQS edges | Complete |
| W-C | Test Coverage | Primary | test/*.test.ts | Blocked on W-A |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | Phase 0 complete | W-A, W-C | Graph channel smoke test green; W-C test skeleton starts |
| SYNC-002 | Phase 1 + Phase 2 both complete | W-A, W-C | Integration test for fused ranking runs |
| SYNC-003 | Phase 4 complete | W-A, W-B (data check), W-C | Full pipeline test including SGQS graph data |
| SYNC-004 | Phase 5 complete | All | CI green, coverage report, checklist sign-off |

### File Ownership Rules
- **hybrid-search.ts**: W-A owns. No W-B changes post-completion.
- **rrf-fusion.ts**: W-A owns.
- **adaptive-fusion.ts**: W-A owns.
- **co-activation.ts**: W-A owns.
- **SQLite SGQS edges**: W-B owns (read-only from W-A).
- **test/*.test.ts**: W-C owns; W-A provides module exports for testability.
- Cross-workstream changes require a SYNC point before merge.
<!-- /ANCHOR:workstreams -->

---

<!-- ANCHOR:communication -->
## L3+: COMMUNICATION PLAN

### Checkpoints
- **Per Phase**: Update tasks.md checklist items with evidence markers before moving to the next phase.
- **Per SYNC point**: Write a brief note in `memory/` capturing what was confirmed and any decisions made at the sync.
- **Blockers**: Escalate immediately to spec.md blockers section + memory context update; do not proceed past a blocked SYNC point.

### Escalation Path
1. **Technical blockers** (e.g., remark-gfm AST API mismatch) → Document in memory, adjust Phase 4 scope, flag in tasks.md
2. **Scope changes** (e.g., new retrieval channel requested) → New spec folder or sub-folder; do not expand this spec's scope mid-implementation
3. **Test failures after merge** → Feature flag rollback (see Section 7 + L2 Enhanced Rollback); root-cause in scratch/ before re-attempting
<!-- /ANCHOR:communication -->

---

<!--
LEVEL 3+ PLAN
- Workstream A (Hybrid RAG Fusion): Phases 0–5, NOT STARTED
- Workstream B (Skill Graph Integration): ALL COMPLETE
- Two ADRs: feature flags, SGQS graph input
- AI Execution Framework: 4-tier with sync points
- Workstream Coordination: 3 workstreams, 4 sync points
-->
