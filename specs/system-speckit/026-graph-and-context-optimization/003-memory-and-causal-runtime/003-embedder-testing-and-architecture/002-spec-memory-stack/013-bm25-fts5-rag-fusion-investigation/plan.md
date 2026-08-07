---
title: "Implementation Plan: BM25 FTS5 RAG Fusion Investigation"
description: "Plan for a five-iteration, read-only research packet evaluating BM25-to-FTS5 impact on hybrid RAG fusion."
trigger_phrases:
  - "bm25 fts5 research plan"
  - "rag fusion lexical lane plan"
  - "deep research 013 plan"
importance_tier: "high"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/013-bm25-fts5-rag-fusion-investigation"
    last_updated_at: "2026-05-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed research plan for BM25 FTS5 RAG fusion investigation"
    next_safe_action: "Use research.md recommendation before implementing Option B"
    blockers: []
    key_files:
      - "research/research.md"
---
# Implementation Plan: BM25 FTS5 RAG Fusion Investigation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---
<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js, SQLite FTS5 |
| **Framework** | Spec Kit MCP context server |
| **Storage** | SQLite `memory_index` plus external-content `memory_fts` |
| **Testing** | Vitest test inventory, no live daemon queries |

### Overview

This plan executes a five-iteration deep-research packet inside the provided spec folder. The work is documentation-only: inspect code, predecessor research, tests, and official FTS5 capability docs; write independent iteration files; synthesize a decision recommendation.
<!-- /ANCHOR:summary -->

---
<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Spec folder supplied by user.
- [x] Scope limited to research files and packet docs.
- [x] Sub-agent dispatch prohibited by user.
- [x] Production daemon queries prohibited by user.

### Definition of Done
- [x] Five iteration files written.
- [x] Final synthesis written with seven requested sections.
- [x] Level 3 packet docs and metadata written.
- [ ] Strict validation passes after final edits.
<!-- /ANCHOR:quality-gates -->

---
<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Research packet with externalized iteration state.

### Key Components
- **Predecessor research**: anchors the original memory-saving recommendation and its caveat about ranking shifts.
- **JS BM25 path**: `bm25-index.ts` supplies tokenization, stemming, synonyms, in-memory scoring, and warmup behavior.
- **SQLite FTS5 path**: `sqlite-fts.ts` supplies weighted FTS5 BM25 over `memory_fts`.
- **RRF combiner**: `hybrid-search.ts` collects vector, FTS, BM25, trigger, graph, and degree lanes, then groups lexical candidates as `keyword`.
- **Tests**: BM25 and hybrid tests show current behavioral contracts and coverage gaps.

### Data Flow

Read predecessor and source evidence, write one complete iteration file at a time, append one JSONL state record for that iteration, then consolidate into `research/research.md` and packet metadata.
<!-- /ANCHOR:architecture -->

---
<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `bm25-index.ts` | JS in-memory BM25 lexical lane | Read-only evidence source | Iterations cite line-level behavior |
| `sqlite-fts.ts` | SQLite FTS5 BM25 wrapper | Read-only evidence source | Iterations cite line-level behavior |
| `hybrid-search.ts` | RRF channel collection and fusion | Read-only evidence source | Iteration 005 cites lane weights and keyword grouping |
| `vector-index-schema.ts` | `memory_fts` schema and triggers | Read-only evidence source | Iteration 002 cites external-content schema |
| `tests/*bm25*`, `tests/*hybrid-search*`, `tests/*fts*` | Existing coverage | Read-only evidence source | Iteration 004 quantifies likely breakage |

Required inventories:
- Same-class producers: exact paths supplied by user and verified with `rg`.
- Consumers of changed symbols: no source changes; consumer impact remains research-only.
- Matrix axes: JS features, FTS5 parity status, query class, RRF option.
- Algorithm invariant: RRF must retain at least one lexical rank list for lexical-plus-vector fusion.
<!-- /ANCHOR:affected-surfaces -->

---
<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read deep-research skill and spec-kit requirements.
- [x] Read predecessor iterations 001, 009, and 010.
- [x] Read current BM25, FTS5, RRF, startup warmup, schema, and tests.

### Phase 2: Core Implementation
- [x] Write Iteration 001 feature inventory.
- [x] Write Iteration 002 FTS5 capability map.
- [x] Write Iteration 003 30-query prediction table.
- [x] Write Iteration 004 test coverage analysis.
- [x] Write Iteration 005 RRF option analysis.
- [x] Write final synthesis.

### Phase 3: Verification
- [x] Confirm all required packet files exist.
- [x] Confirm iteration files exceed 30 lines.
- [ ] Run strict spec validation and patch any structural issues.
<!-- /ANCHOR:phases -->

---
<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static existence | Required docs and research files | `test -s`, `wc -l` |
| Structural validation | Level 3 packet compliance | `validate.sh --strict` |
| Source mutation guard | Confirm source files unchanged | `git status --short` |
| Behavioral prediction | 30 golden query classes | Code reading, no live daemon |
<!-- /ANCHOR:testing -->

---
<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Prior research packet 005 | Internal | Green | Recommendation wording would be unanchored |
| Official SQLite FTS5 docs | External primary docs | Green | Capability parity would rely on memory |
| Local tests | Internal | Green | Breakage estimate would be unsupported |
| Production daemon | Internal | Intentionally not used | Query predictions remain unmeasured |
<!-- /ANCHOR:dependencies -->

---
<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Research packet points to an incorrect or unwanted recommendation.
- **Procedure**: Edit or remove only this spec folder's research and docs; source files remain untouched.
<!-- /ANCHOR:rollback -->

---
<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Predecessor/source reads -> Iterations 001-005 -> Synthesis -> Validation
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Evidence gathering | Spec folder and source access | All iterations |
| Iterations | Evidence gathering | Synthesis |
| Synthesis | All iterations | Validation |
| Validation | Packet docs | Completion claim |
<!-- /ANCHOR:phase-deps -->

---
<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Evidence gathering | Medium | 1-2 hours |
| Iteration writing | High | 2-4 hours |
| Synthesis | Medium | 1 hour |
| Verification | Low | 15-30 minutes |
| **Total** | | **4-7 hours** |
<!-- /ANCHOR:effort -->

---
<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No source deployment.
- [x] No schema migration.
- [x] No daemon query.

### Rollback Procedure
1. Remove or edit the packet docs under the 013 spec folder.
2. Re-run strict validation if docs remain.
3. Do not touch source files as part of rollback.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Not applicable.
<!-- /ANCHOR:enhanced-rollback -->

---
<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
deep-research-005 Finding 1
          |
          v
JS BM25 inventory + FTS5 capability map
          |
          v
30-query prediction + test coverage + RRF impact
          |
          v
Recommendation in research.md and ADR-001
```
<!-- /ANCHOR:dependency-graph -->

---
<!-- ANCHOR:risk-mitigation -->
## L3: RISK MITIGATION

| Risk | Mitigation |
|------|------------|
| Query behavior predictions are unmeasured | Mark uncertain rows `REQUIRES_LIVE_TEST` and require golden-query follow-up |
| FTS5 feature claims drift from code reality | Separate built-in FTS5 capability from production schema capability |
| Memory savings over-prioritized | Decision matrix includes quality and implementation risk alongside memory |
<!-- /ANCHOR:risk-mitigation -->

---
<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Evidence gathering** - completed - CRITICAL
2. **Five iteration files** - completed - CRITICAL
3. **Synthesis and ADR** - completed - CRITICAL
4. **Strict validation** - in progress - CRITICAL

**Total Critical Path**: one research invocation.

**Parallel Opportunities**:
- Source and test reads were parallelized where safe.
<!-- /ANCHOR:critical-path -->

---
<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Evidence ready | Predecessor, source, and tests read | Phase 1 |
| M2 | Iterations complete | Five iteration files exist | Phase 2 |
| M3 | Decision ready | `research/research.md` and ADR written | Phase 2 |
| M4 | Packet valid | Strict validation passes | Phase 3 |
<!-- /ANCHOR:milestones -->
