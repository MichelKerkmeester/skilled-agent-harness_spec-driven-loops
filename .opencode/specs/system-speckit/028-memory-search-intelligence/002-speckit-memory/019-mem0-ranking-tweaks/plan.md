---
title: "Implementation Plan: Mem0 Ranking + Extraction Bundle (028 Memory impl phase 014)"
description: "Approach, sequencing and shared-infra dependencies for the 06 external-memory-systems cheap ranking + extraction bundle: gate-zero reindex first, the always-on config refactor, then flag-gated benchmark-first ranking tweaks, additive extraction changes and the verify-first content-hash trigger."
trigger_phrases:
  - "mem0 ranking tweaks plan 028"
  - "bm25 calibration sequencing"
  - "entity store boost shared infra"
  - "cascade extraction plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-speckit-memory/019-mem0-ranking-tweaks"
    last_updated_at: "2026-07-04T17:51:00.375Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored implementation plan"
    next_safe_action: "Run gate-zero corpus reindex"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-014-mem0-ranking-tweaks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Mem0 Ranking + Extraction Bundle (028 Memory impl phase 014)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node), Spec-Kit Memory MCP server |
| **Surface** | `.opencode/skills/system-spec-kit/mcp_server/` (search pipeline, extraction, save handlers) + `shared/algorithms/rrf-fusion.ts` |
| **Storage** | SQLite (FTS5 + vector index), existing `content_hash`, `entity_catalog`, `causal_edges` tables |
| **Testing** | Vitest unit + parity tests, reindexed-corpus recall benchmark via the eval/ablation harness |

### Overview
This phase lands the **Mem0 ranking + extraction bundle** (8 distinct candidates, all PENDING, absent from the Wave-0 030 record). The work splits into three classes by the **027 doctrine-class axis**: a single **correctness/config** change ships always-on (declarative regex config), the **recall-ranking tweaks** ship flag-gated default-off with shadow telemetry and a reindexed before/after baseline, the **extraction-side changes** ship additive and reversible. Two candidates are **gated** on a precondition, the entity-store boost on a new entity vector index (shared-infra) and content-hash reprocessing on a verify-first check that may close it as NO-TRANSFER.

The phase's mandatory **gate-zero** is the deferred corpus reindex: no recall candidate is measured against a quarter-dark index.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Each candidate's seam, evidence class, lev/eff and caveat pulled from the research (spec §3)
- [x] STATUS confirmed PENDING for all (cross-checked vs 030 §14, zero matches)
- [x] Gate-zero reindex identified as the phase precondition
- [x] Shared-infra dep (entity vector index) and verify-first item flagged

### Definition of Done
- [ ] Gate-zero reindex run + recall/saturation re-checked (SC-001)
- [ ] Always-on config refactor parity-proven (SC-002)
- [ ] Each ranking tweak flag-gated with byte-identical default-off path + shadow telemetry (SC-003)
- [ ] Extraction changes additive + reversible (SC-004)
- [ ] Candidate 8 resolved to build-or-NO-TRANSFER with evidence (SC-005)
- [ ] Typecheck, build, focused tests, strict packet validation pass (SC-006)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive seam edits inside the existing pipeline (`stage1-candidate-gen → stage2-fusion → stage3-rerank → stage4-filter`) plus the extraction (`entity-extractor.ts`) and save (`handlers/save/`) paths. No schema migration in this phase (entity-vector-index for #7 is its own gated build).

### Key Components by candidate
- **Declarative regex config (4)**, a JSON asset + a loader replacing the 5 hard-coded rules in `lib/extraction/entity-extractor.ts:82-121`. Config reproduces existing rules exactly, new types are data, not code.
- **BM25 calibration (1)**, a query-term-count → sigmoid-params lookup applied at the BM25 channel pre-fusion (`lib/search/sqlite-fts.ts`, `lib/eval/bm25-baseline.ts`).
- **Cardinality penalty (2)**, the quadratic damp on the rrf-fusion degree/co-activation channel (`shared/algorithms/rrf-fusion.ts:17`, `lib/search/graph-search-fn.ts` degree boost).
- **Lemmatization (3)**, pre-index + pre-query lemmatization at FTS tokenization with an `-ing` dual-index (`lib/search/sqlite-fts.ts`).
- **Cascade extraction (5)**, a broad node pass + a relation-binding pass in the extraction stage (additive over single-pass).
- **LLM memory-linking (6)**, extraction emits `linked_memory_ids`, consumed at `handlers/causal-graph.ts` / `causal-links-processor.ts` on the memory-ID graph.
- **Entity-store boost (7, gated)**, a NEW entity-embedding vector index + a new boost channel in `lib/search/hybrid-search.ts`.
- **Content-hash reprocessing (8, verify-first)**, IF a gap is confirmed, an auto-reset of derived-artifact state on `content_hash` change in `handlers/save/dedup.ts`.

### Data Flow (ranking tweaks)
1. Query enters, term-count bucket selects BM25 sigmoid params (candidate 1).
2. FTS tokenization lemmatizes query + index (candidate 3).
3. Degree/co-activation channel applies the cardinality penalty (candidate 2).
4. Optional entity-vector-index boost merges (candidate 7, gated).
5. All ranking deltas are flag-gated, default-off path is byte-identical to current fusion.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0: Gate-zero (precondition)
- [ ] Run the deferred corpus reindex (restore ~25% cold/un-embedded rows)
- [ ] Re-run recall + saturation checks, capture the reindexed baseline (regression-baseline rule)

### Phase 1: Correctness, always-on
- [ ] Candidate 4: declarative regex entity config + parity test (existing 5 rules byte-identical)

### Phase 2: Ranking tweaks, flag-gated, benchmark-first
- [ ] Candidate 1: BM25 sigmoid calibration (default-off flag + shadow telemetry)
- [ ] Candidate 2: entity cardinality penalty (default-off)
- [ ] Candidate 3: spaCy/lightweight lemmatization (default-off, resolve the dependency open question first)
- [ ] Per tweak: reindexed before/after recall baseline, promote default-on only on positive measured delta

### Phase 3: Extraction, additive
- [ ] Candidate 5: multi-pass cascade extraction (broad + relation-binding pass)
- [ ] Candidate 6: write-time LLM memory-linking (`linked_memory_ids`, memory-ID-graph reframe)

### Phase 4: Gated
- [ ] Candidate 8: verify-first vs the reindex path → build auto-reset OR close as NO-TRANSFER with evidence
- [ ] Candidate 7: entity vector index (shared-infra) → boost channel, only if the index is built or the semantic-edge-layer initiative lands first
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Parity | Declarative config reproduces the 5 hard-coded rules exactly | Vitest |
| Unit | Calibration buckets, cardinality penalty math (n=0,1,many), lemmatization + `-ing` dual-index, cascade fallback | Vitest |
| Default-off byte-identity | Each flag-gated tweak's off-path equals current ranking output | Vitest snapshot |
| Recall benchmark | Reindexed before/after recall delta per ranking tweak | eval/ablation harness |
| Verify-first | Candidate 8: does `memory_index_scan` re-derive on `content_hash` change? | Read + targeted repro |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Gate-zero corpus reindex | Internal | Pending | All recall benchmarks (1-3, 7) unmeasurable |
| Entity vector index | Internal (new build) | Not built | Candidate 7 cannot ship as scoring-only |
| spaCy or lightweight lemmatizer | External | Open decision | Candidate 3 effort + runtime footprint |
| eval/ablation harness (post-027/015 fix) | Internal | Green | Cannot capture recall deltas |
| Existing `content_hash` / `entity_catalog` | Internal | Green | Candidates 1-2, 8 lose their substrate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a ranking tweak regresses recall against the reindexed baseline, or an extraction change degrades save reliability.
- **Procedure**: ranking tweaks revert by leaving their flag default-off (zero blast radius), extraction changes revert their additive code path, the config refactor reverts to the inline 5 rules (parity test guarantees equivalence). Branch-only, nothing pushed or deployed without explicit user go.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 0 (Gate-zero reindex) ──> Phase 2 (ranking, benchmark-gated)
Phase 1 (config, always-on) ──independent──> ship anytime
Phase 3 (extraction) ──independent──> ship anytime
Phase 4 (gated #7/#8) ──depends on shared-infra / verify-first──> last
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 0 Gate-zero | None | Phase 2 benchmarks, Phase 4 #7 |
| 1 Config | None | None |
| 2 Ranking | Phase 0 | None |
| 3 Extraction | None | None |
| 4 Gated | Phase 0 (#7), verify-first (#8) | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Candidate | Lev/Eff (research) | Notes |
|-----------|--------------------|-------|
| 4 Declarative regex config | L/S | Best lev/eff in the campaign, correctness-class |
| 1 BM25 calibration | M/L | Benchmark-gated, constants need re-calibration on the reindexed corpus |
| 2 Cardinality penalty | M/L | Benchmark-gated, small math |
| 3 Lemmatization | M/M | Dependency decision drives effort |
| 5 Cascade extraction | M/M | Extra LLM pass |
| 6 LLM memory-linking | M/H | Memory-ID-graph reframe |
| 7 Entity-store boost | H/M | Shared-infra (new vector index), heaviest |
| 8 Content-hash reprocessing | M/M | May collapse to NO-TRANSFER |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Reindexed baseline captured before any ranking default-on
- [x] Feature flags configured (every ranking tweak default-off)
- [ ] Shadow telemetry wired for ranking tweaks

### Rollback Procedure
1. **Immediate**: set the offending ranking flag default-off (no redeploy needed).
2. **Revert code**: revert the additive extraction hunk, revert the config loader to inline rules (parity-guaranteed).
3. **Verify**: default-off recall output byte-identical to pre-change.

### Data Reversal
- **Has data migrations?** No in this phase (entity-vector-index for #7 is a separate gated build with its own migration + rollback).
<!-- /ANCHOR:enhanced-rollback -->
