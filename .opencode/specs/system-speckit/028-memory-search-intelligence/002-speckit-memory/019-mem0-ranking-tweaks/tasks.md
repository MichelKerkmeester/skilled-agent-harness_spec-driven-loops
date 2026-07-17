---
title: "Tasks: Mem0 Ranking + Extraction Bundle (028 Memory impl phase 014)"
description: "Task breakdown for the 06 external-memory-systems cheap ranking + extraction bundle. All tasks PENDING, none of the 8 distinct candidates appears in the Wave-0 030 done-record (030 §14 cross-check = zero matches)."
trigger_phrases:
  - "mem0 ranking tweaks tasks 028"
  - "bm25 calibration tasks"
  - "cascade extraction tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-speckit-memory/019-mem0-ranking-tweaks"
    last_updated_at: "2026-07-04T17:51:00.375Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored task breakdown, all candidates PENDING (zero 030 commit coverage)"
    next_safe_action: "T001, run the gate-zero corpus reindex"
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

# Tasks: Mem0 Ranking + Extraction Bundle (028 Memory impl phase 014)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

> **Status note:** ALL tasks below are `[ ]` PENDING. None of the 8 distinct candidates in this bundle has a Wave-0 commit, a per-ID grep of the Wave-0 evidence returns zero matches for every requested ID. There are no pre-checked `[x]` done tasks in this phase.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Gate-zero precondition (recall measurability)
- [ ] T001 Run the deferred corpus reindex (restore ~25% cold/un-embedded rows) [reindex]
- [ ] T002 Re-run recall + saturation checks, capture the reindexed baseline numbers (regression-baseline rule) [baseline]

### Candidate 4: declarative regex entity config (always-on, correctness-class)
- [x] T003 Author the JSON entity-config asset (type + pattern + metadata) reproducing the 5 hard-coded rules (`lib/extraction/entity-extractor.ts:82-121`) [1h]. `lib/extraction/entity-extraction-rules.json` + `EntityExtractionRule[]`, parity test green
- [x] T004 Add the config loader + fail-closed-to-builtin-rules fallback (`lib/extraction/entity-extractor.ts`) [1h]. `loadEntityExtractionRules()` reads `SPECKIT_ENTITY_CONFIG_PATH`, falls back to built-ins on any read/parse/validation failure
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Candidate 1: BM25 sigmoid calibration (flag-gated)
- [ ] T005 Resolve the BM25 query-term-count buckets + sigmoid constants on the reindexed corpus (Mem0's values are not portable) [research]
- [ ] T006 Implement the term-count → sigmoid-params lookup at the BM25 channel (`lib/search/sqlite-fts.ts`, `lib/eval/bm25-baseline.ts`) behind a default-off flag [2h]

### Candidate 2: entity cardinality penalty (flag-gated)
- [x] T007 [P] Implement the quadratic damp `1/(1+0.001·(n−1)²)` on the degree/co-activation channel (`lib/search/graph-search-fn.ts` `computeDegreeScores`) behind a default-off flag [1h]. `SPECKIT_CARDINALITY_PENALTY` (default-off, byte-identical off-path), wired at the degree-channel seam (not `rrf-fusion.ts`, owned by a concurrent change). Promotion default-on still owes the reindexed before/after benchmark (T021).

### Candidate 3: spaCy / lightweight lemmatization (flag-gated)
- [ ] T008 [B] Resolve the lemmatizer-dependency open question (heavy spaCy vs lightweight rule-based) [decision]
- [ ] T009 Implement pre-index + pre-query lemmatization + `-ing` dual-index at FTS tokenization (`lib/search/sqlite-fts.ts`) behind a default-off flag, degrade-not-throw if unavailable [3h]

### Candidate 5: multi-pass cascade extraction (additive)
- [ ] T010 Implement broad node-extraction pass (feed `previous_nodes` back) + separate relation-binding pass (`lib/extraction/entity-extractor.ts`) [3h]

### Candidate 6: write-time LLM memory-linking (additive)
- [ ] T011 Reframe linking onto the memory-ID graph (causal graph is memory-ID → memory-ID, NOT entity-node, an iter-6 systemic finding) [research]
- [ ] T012 Emit `linked_memory_ids` per fact at extraction, consume at write time (`handlers/causal-graph.ts`, `causal-links-processor.ts`) additive over post-hoc `memory_causal_link` [3h]

### Candidate 8: content-hash reprocessing trigger (verify-first)
- [x] T013 Verify whether `memory_index_scan` already re-derives embeddings/entities/edges on `content_hash` change (`handlers/save/dedup.ts` vs the reindex path) [research]. Confirmed: dedup short-circuits ONLY on unchanged content, on hash change it returns null and the save re-indexes.
- [x] T014 Resolve: build the auto-reset-on-change IF a real gap is confirmed, ELSE close as NO-TRANSFER with cited evidence [decision]. **NO-TRANSFER**: `post-insert.ts:332` re-runs `extractEntities` + `refreshAutoEntitiesForMemory` (delete + re-derive) and embeddings re-generate on a changed save. The Cognee behavior already exists, no code.

### Candidate 7: entity-store boost (shared-infra, gated)
- [ ] T015 [B] Build (or adopt) the entity-embedding vector index, none exists today, prerequisite for any entity-vector boost [packet-scale]
- [ ] T016 [B] Add the vector-matched-entity boost channel (similarity × cardinality penalty) to `lib/search/hybrid-search.ts`, default-off + benchmark [2h]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Parity + unit
- [x] T017 Parity test: config-driven extraction byte-identical to the inline 5 rules (candidate 4) (`tests/mem0-ranking-tweaks.vitest.ts`) [30m]
- [x] T018 [P] Unit test the cardinality penalty at n=0, n=1 (→1.0, no penalty) and high-n damping (candidate 2) (`tests/mem0-ranking-tweaks.vitest.ts`) [30m]
- [ ] T019 Fallback test: cascade refine-pass failure preserves the broad-pass result (candidate 5) [30m]. PENDING (candidate 5 not built)

### Recall benchmarks (reindexed before/after, per flag-gated tweak)
- [ ] T020 Shadow telemetry + reindexed recall delta for candidate 1, promote default-on only on positive delta [1h]
- [ ] T021 Reindexed before/after recall baseline for candidate 2 [45m]
- [ ] T022 Reindexed before/after recall baseline for candidate 3 [45m]
- [ ] T023 Bound + measure the extra extraction-time LLM cost for candidates 5-6 [30m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Phase 0 gate-zero reindex run + baseline captured
- [ ] Candidate 4 always-on with parity test green
- [ ] Each ranking tweak (1-3) flag-gated, byte-identical default-off, with a reindexed before/after baseline
- [ ] Candidates 5-6 additive + reversible, extraction cost measured
- [ ] Candidate 8 resolved (build OR NO-TRANSFER with evidence)
- [ ] Candidate 7 either shipped on a built entity-vector-index or explicitly deferred to the semantic-edge-layer initiative
- [ ] Typecheck, build, focused tests, strict packet validation pass
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source research**: `../research/research.md`, `../research/external-memory-systems/`
<!-- /ANCHOR:cross-refs -->
