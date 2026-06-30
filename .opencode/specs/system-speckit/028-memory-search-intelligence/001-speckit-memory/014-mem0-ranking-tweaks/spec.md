---
title: "Feature Specification: Mem0 Ranking + Extraction Bundle (028 Memory impl phase 014)"
description: "Implement the 06 external-memory-systems cheap ranking + extraction bundle for Spec-Kit Memory MCP: query-length BM25 sigmoid calibration, entity cardinality penalty, spaCy lemmatization, declarative regex entity config, multi-pass cascade extraction, write-time LLM memory-linking, separate entity-store boost and the verify-first content-hash reprocessing trigger. Entirely absent from the Wave-0 030 record. All candidates PENDING."
trigger_phrases:
  - "mem0 ranking tweaks 028"
  - "bm25 sigmoid calibration memory"
  - "entity cardinality penalty"
  - "spacy lemmatization fts"
  - "cascade extraction memory mcp"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/014-mem0-ranking-tweaks"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped 4 candidates always-on + 2 default-off, closed 8 NO-TRANSFER"
    next_safe_action: "Run gate-zero corpus reindex"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "../research/research.md"
      - "../research/external-memory-systems/research.md"
      - "../../research/synthesis/06-memory-systems-findings.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-014-mem0-ranking-tweaks"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---

# Feature Specification: Mem0 Ranking + Extraction Bundle (028 Memory impl phase 014)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | in_progress |
| **Status detail** | Candidates 4 + 2 shipped, candidate 8 resolved NO-TRANSFER, candidates 1, 3, 5, 6, 7 PENDING on their gates |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Packet** | `system-spec-kit/028-memory-search-intelligence/001-speckit-memory` (Memory MCP research phase, PRIMARY) |
| **Source research** | `../research/research.md`, `../research/external-memory-systems/{research.md,iterations,deltas}`, `../../research/synthesis/06-memory-systems-findings.md`, `../../research/roadmap.md` (MEMORY-SYSTEMS addendum) |
| **Wave-0 done-record** | Wave-0 record, this bundle is **entirely absent** from it |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 028 campaign's external-memory-systems child (`007-memory-systems`, 22 iterations across Mem0 / Graphiti / Letta / Cognee) surfaced a bundle of **cheap ranking and extraction improvements** for the Spec-Kit Memory MCP, mostly mined from **Mem0** scoring/extraction plus two Cognee extraction-config wins. The Wave-0 implementation packet (030) shipped a different, determinism-and-correctness-first slate. **None of this bundle was implemented**, it is absent from 030 §14. These candidates therefore remain open work.

The bundle has two characters:
- **Recall-ranking tweaks** (BM25 sigmoid calibration, entity cardinality penalty, lemmatization, separate entity-store boost), small additive scoring gains that change recall ordering and so are **benchmark-gated** (they alter recall magnitudes, which the regression-baseline rule requires measuring before/after).
- **Extraction-side changes** (declarative regex entity config, multi-pass cascade extraction, write-time LLM memory-linking), additive to the entity/relation extraction stage.

Plus one **verify-first** candidate (content-hash reprocessing trigger) that may collapse to NO-TRANSFER once checked against the existing reindex path.

### Purpose
Document, scope and sequence the bundle as a single Memory-subsystem implementation phase: pull each candidate's confirmed seam, evidence class, leverage/effort and roadmap caveats from the research, mark per-candidate STATUS (all PENDING, none has a 030 commit) and gate each behind its true precondition (gate-zero reindex for recall measurement, shared entity-vector-index infra for the entity-store boost, verify-first for content-hash reprocessing).

### Critical context (from the 028 roadmap MEMORY-SYSTEMS addendum + synthesis, authoritative)
- **No candidate has a measured before/after benefit number**, every leverage/effort tag is structural inference, never a benchmarked delta. Ship for correctness/reversibility, not a promised delta.
- **Reindex is gate-zero.** Per `synthesis/06` + `07-reconciliation-with-027-002.md`, the deferred corpus reindex (restoring ~25% cold/un-embedded rows) is the precondition for measuring *any* recall candidate, you cannot benchmark recall against a quarter-dark index. The first action of this phase is the reindex + re-run of the recall/saturation checks.
- **027 doctrine-class axis (overlays Wave tiers):** correctness ships always-on (the declarative-regex config refactor). New results-affecting intelligence (every ranking tweak + the entity-store boost) ships shadow-gated / default-off and earns activation on live evidence.
- **Finder estimates ran optimistic**, assume any un-scoped GO is optimistic until a blast-radius pass confirms it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope, the bundle (8 distinct candidates, the 11 requested IDs collapse to 8)

The requested ID list carries `M0-`/`M-` prefix duplicates for the same three ranking candidates, and they collapse as noted.

| # | Candidate (id) | Verdict | Lev/Eff | Seam (file:line) | Class |
|---|----------------|---------|---------|------------------|-------|
| 1 | **bm25-sigmoid-calibration** (`M0-bm25-sigmoid-calibration` ≡ `M-bm25-sigmoid-calibration`) | GO (iter-9) | M/L | `mem0/utils/scoring.py:16-40,43-54` → BM25 channel calibration pre-fusion (internal `lib/search/sqlite-fts.ts` BM25 + `lib/eval/bm25-baseline.ts`) | EXTENDS aionforge, ranking, benchmark-gated |
| 2 | **entity-cardinality-penalty** (`M-entity-cardinality-penalty` ≡ `M0-entity-cardinality-penalty`) | GO (iter-9) | M/L | `mem0/memory/main.py:1645-1647` → `lib/search/rrf-fusion.ts` degree/co-activation channel | NET-NEW, ranking, benchmark-gated |
| 3 | **spacy-lemmatization-bm25** (`M-spacy-lemmatization-bm25` ≡ `M0-spacy-lemmatization-bm25`) | NET-NEW GO (iter-7) | M/M | `mem0/utils/lemmatization.py:22-50`, `mem0/memory/main.py:904,1483` → `lib/search/sqlite-fts.ts` (FTS does not lemmatize today) | NET-NEW, ranking, benchmark-gated |
| 4 | **declarative-regex-entity-config** (`CG-declarative-regex-entity-config`) | NET-NEW GO (iter-19) | L/S | `cognee/regex_entity_config.json:1-62`, `regex_entity_extractor.py:1-80` → `lib/extraction/entity-extractor.ts:82-121` (5 hard-coded regex rules) | NET-NEW, **correctness/config, always-on** (best lev/eff in the campaign) |
| 5 | **cascade-extraction** (`CG-cascade-extraction`) | GO (iter-9) | M/M | `cognee/tasks/graph/cascade_extract/utils/extract_nodes.py:15-42` → LLM extraction stage (`lib/extraction/entity-extractor.ts`, single-pass today) | EXTENDS Mem0, extraction, additive |
| 6 | **llm-memory-linking** (`M0-llm-memory-linking`) | GO (iter-9) | M/H | `mem0/configs/prompts.py:692-701` + Example 10 `:843-858` → `handlers/causal-graph.ts` / `causal-links-processor.ts` | EXTENDS memclaw, extraction, additive |
| 7 | **entity-store-boost** (`M0-entity-store-boost`) | HOLDS NET-NEW + REFINE (iter-6) | H/M | `mem0/memory/main.py:1577-1657`, `utils/entity_extraction.py:123-144` → `lib/search/hybrid-search.ts` (no entity *vector* index today, closest analog = rrf-fusion DEGREE channel `:17`, count-based) | NET-NEW, ranking, **shared-infra dep (entity vector index)** |
| 8 | **content-hash-reprocessing-trigger** (`CG-content-hash-reprocessing-trigger`) | NET-NEW, needs-verify (iter-19) | M/M | `cognee/ingest_data.py:109-112,155-175` → `handlers/save/dedup.ts` (skip-if-unchanged, no auto-reset of derived artifacts) | **VERIFY-FIRST, may collapse to NO-TRANSFER** vs the existing `memory_index_scan` reindex path |

> The campaign's same-pass adversarial verify (iter-6 / iter-9, native Opus, refute-by-default) confirmed candidates 1-6 as additive/reversible GOs against live `mcp_server/` code. Candidate 7 HOLDS as net-new but was REFINEd to "entity-embedding index → new boost channel" (a real shared-infra commitment). Candidate 8 is the lone unverified item.

### Implementation status (this session)

| # | Candidate | Status | Evidence / reason |
|---|-----------|--------|-------------------|
| 4 | declarative-regex-entity-config | **DONE** (always-on) | 5 inline rules moved to a declarative `EntityExtractionRule[]` (`lib/extraction/entity-extractor.ts`) + shipped JSON asset `lib/extraction/entity-extraction-rules.json`, loaded via `SPECKIT_ENTITY_CONFIG_PATH` with fail-closed fallback to built-ins. Parity test proves config-driven extraction byte-identical to the built-ins. |
| 2 | entity-cardinality-penalty | **DONE** (default-off) | `cardinalityPenalty(n)=1/(1+0.001·(n−1)²)` on the degree channel in `lib/search/graph-search-fn.ts`, gated by `SPECKIT_CARDINALITY_PENALTY` (`isOptInEnabled`, default-off → byte-identical). Wired at the non-excluded degree-channel seam (`computeDegreeScores`), not `rrf-fusion.ts`. Promotion default-on still needs the reindexed before/after benchmark. |
| 8 | content-hash-reprocessing-trigger | **NO-TRANSFER** (closed) | Verified: `handlers/save/dedup.ts` only returns `unchanged`/`duplicate` when content (hash) is **unchanged**. On a `content_hash` change it returns null and the save proceeds to full re-index, which re-derives entities (`handlers/save/post-insert.ts:332` → `extractEntities` + `refreshAutoEntitiesForMemory`) and embeddings. Cognee's auto-reset-on-change behavior already exists, no code needed. |
| 1 | bm25-sigmoid-calibration | **PENDING** | Bucket boundaries + sigmoid constants are benchmark-owned (not portable from Mem0, open question #4). Whether a monotonic BM25-channel calibration even shifts rank-based fusion is itself the benchmark question. Not resolvable without the gate-zero reindexed corpus + eval harness. |
| 3 | spacy-lemmatization-bm25 | **PENDING** | Blocked on the unresolved lemmatizer-dependency decision (heavy spaCy vs lightweight, T008 `[B]`, open question #1). Not safe to unilaterally introduce a new runtime dependency into FTS tokenization. |
| 5 | cascade-extraction | **PENDING** | Requires multi-pass LLM extraction, not deterministically unit-testable without a live LLM and the in-repo extractor is pure-rule-based (no single-pass LLM stage to cascade here). |
| 6 | llm-memory-linking | **PENDING** | Requires write-time LLM extraction emitting `linked_memory_ids`. LLM-dependent, not deterministically testable here. |
| 7 | entity-store-boost | **PENDING** | Requires a NEW entity vector index (schema/shared-infra), and the spec forbids a scoring-only attempt. Schema migration is out of scope for this session. |

### Out of Scope (documented, NOT built this phase)
- The Wave-2 **semantic edge layer** (`CG-edge-vector-index`, `CG-edge-aware-triplet-search`, `GR-fact-embedding-on-edge`, `GR-semantic-fact-dedup-merge`, `GR-semantic-invalidation-discovery`), one coherent prove-first build. The entity-store boost (#7) shares its "no edge/entity vector substrate" gate but is scoped narrower here.
- The Wave-2 **async sleep-time consolidation** initiative (`LT-bg-sleeptime-agent`, `LT-turn-cadence-trigger`, `LT-llm-transcript-chunking`).
- Bi-temporal / event-time invalidation (`MEM-fact-invalidation-event-time`, `GR-temporal-ordering-invalidation`), iterative recall (`CG-iterative-context-extension`), tiered-recall-budget, compaction-fallback-ladder, all separate Memory impl phases.
- The Advisor port of these tweaks (`ADV-bm25-calibration`, `XC-cardinality-to-advisor`), a Skill-Advisor subsystem, near-no-op at ~22-skill scale.
- Modifying the external reference systems under `external/`.

### Files to Change
Per-candidate. Each candidate's seam is in the table above. Production code under `.opencode/skills/system-spec-kit/mcp_server/` (search, extraction, save handlers) plus `shared/algorithms/rrf-fusion.ts`. A new entity-extraction JSON config asset for candidate 4. Tests alongside each change. Each ranking tweak (1-3, 7) lands behind a default-off flag with shadow telemetry per the 027 doctrine.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria (research-cited) |
|----|-------------|--------------------------------------|
| REQ-001 | Declarative regex entity config (candidate 4) | Entity-type regex rules move from the 5 hard-coded rules at `entity-extractor.ts:82-121` into a JSON config (type + pattern + metadata) loadable without code edits. Existing 5 rules reproduced byte-identically by the config. New types addable without code change. Correctness-class, always-on. |
| REQ-002 | BM25 sigmoid calibration (candidate 1) | BM25 sigmoid normalization midpoint/steepness selected from a query-term-count bucket (short → steeper/lower, long → flatter/higher), mirroring `mem0/utils/scoring.py:16-40`. Default-off flag. Shadow telemetry captured. Measured against a reindexed corpus baseline before any default-on. |
| REQ-003 | Entity cardinality penalty (candidate 2) | High-cardinality link nodes damped by the quadratic `weight = 1/(1 + 0.001·(numLinked−1)²)` (`mem0/memory/main.py:1645-1647`) on the rrf-fusion degree/co-activation channel. Default-off. Before/after recall ordering captured. |
| REQ-004 | spaCy lemmatization for BM25 (candidate 3) | Pre-index AND pre-query lemmatization (e.g. "attending"→"attend", "memories"→"memory") with a dual-index of `-ing` originals for noun/verb ambiguity, mirroring `mem0/utils/lemmatization.py:22-50`. Applied at `sqlite-fts.ts` tokenization. Default-off, benchmark-gated. |
| REQ-005 | Multi-pass cascade extraction (candidate 5) | Node-first broad extraction pass (feeding `previous_nodes` back to raise recall) THEN a separate relation-binding pass, decoupling entity recall from edge extraction (`cascade_extract/utils/extract_nodes.py:15-42`). Additive over the single-pass extractor. Extra extraction-time LLM cost acknowledged and bounded. |
| REQ-006 | Write-time LLM memory-linking (candidate 6) | Extraction emits `linked_memory_ids` per fact so the relationship graph forms at write time vs post-hoc `memory_causal_link` calls (`mem0/configs/prompts.py:692-701`). Additive, with the memory-ID-graph constraint (causal graph is memory-ID → memory-ID, NOT entity-node, an iter-6 systemic finding) respected. |

### P2 - Gated (require a precondition before build)

| ID | Requirement | Gate |
|----|-------------|------|
| REQ-007 | Entity-store boost (candidate 7) | Requires a NEW entity vector index (none exists today). Build the entity-embedding index first, then a vector-matched-entity boost channel with similarity × cardinality penalty. **Shared-infra dependency**, do not attempt as a scoring-only tweak. |
| REQ-008 | Content-hash reprocessing trigger (candidate 8) | **Verify-first.** Confirm whether `memory_index_scan` already re-derives embeddings/entities/edges when `content_hash` changes (`handlers/save/dedup.ts` vs the reindex path). If it does, candidate collapses to NO-TRANSFER and is closed. Only build the auto-reset-on-change if a real gap is confirmed. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The gate-zero corpus reindex runs and the recall/saturation checks are re-run BEFORE any recall-ranking candidate (1-3, 7) is built or benchmarked.
- **SC-002**: Candidate 4 (declarative regex config) ships always-on with the existing 5 rules reproduced byte-identically (no recall change), proven by a parity test.
- **SC-003**: Each ranking tweak (1-3) lands behind a default-off flag with shadow telemetry. Its default-off path is byte-identical to current ranking.
- **SC-004**: Candidates 5-6 (extraction) are additive and reversible. The single-pass / post-hoc-linking paths remain available.
- **SC-005**: Candidate 8 is resolved to either a confirmed gap (build) or NO-TRANSFER (close with evidence), not left ambiguous.
- **SC-006**: Typecheck, build, focused tests and strict packet validation pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Gate-zero corpus reindex (~25% cold rows) | Recall benchmarks read against a quarter-dark index → meaningless deltas | Reindex + re-run recall/saturation checks as the phase's first action (SC-001) |
| Dependency | Entity vector index (candidate 7) | No entity *vector* index exists, a scoring-only attempt is impossible | Treat #7 as shared-infra, build the index first or defer to the semantic-edge-layer initiative |
| Risk | spaCy runtime dependency (candidate 3) | New heavy NLP dependency in the FTS tokenization path | Confirm a lightweight lemmatizer is acceptable, gate default-off, benchmark cost |
| Risk | Ranking tweaks change recall magnitudes | Regression-baseline rule violated if shipped without measurement | Default-off + shadow telemetry + reindexed before/after baseline per 027 doctrine |
| Risk | Cascade + LLM-linking add extraction-time LLM cost | Save latency / token cost grows | Bound passes, make additive + reversible, measure extraction cost |
| Risk | Candidate 8 overlaps existing reindex | Wasted build / duplicate logic | Verify-first (REQ-008) before any code |
| Constraint | Causal graph is memory-ID → memory-ID, NOT entity-node (iter-6) | LLM-linking / entity candidates that assume entity nodes are mis-mapped | Reframe to the memory-ID graph before building #6/#7 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Default-off ranking-tweak paths add zero measurable latency to default recall (byte-identical path).
- **NFR-P02**: Cascade extraction and write-time linking bound their extra LLM passes. Extraction-time cost is measured and reported.

### Correctness / Determinism
- **NFR-C01**: The declarative-regex config reproduces the existing 5 rules exactly (parity test), so the always-on refactor is behavior-neutral.
- **NFR-C02**: No ranking tweak is promoted default-on without a reindexed before/after recall baseline (regression-baseline rule).

### Reversibility
- **NFR-R01**: Every candidate is independently reversible, ranking tweaks via a flag, extraction changes via additive code paths.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Single-term query**: BM25 calibration bucket must handle the shortest query (steepest midpoint) without divide-by-zero.
- **Zero linked nodes**: cardinality penalty `1/(1+0.001·(n−1)²)` must return 1.0 (no penalty) at n=0 and n=1.
- **Non-lemmatizable token**: lemmatization passes tokens through unchanged. The `-ing` dual-index must not double-count a token that is already a base form.

### Error Scenarios
- **spaCy/lemmatizer unavailable**: FTS tokenization degrades to the current non-lemmatized path, not a throw.
- **Malformed entity-config JSON**: fail closed to the built-in 5 rules with a logged warning, never crash extraction.
- **Cascade refine pass fails**: fall back to the broad-pass result (partial extraction), never lose the first pass.

### Concurrent Operations
- **Re-save during reprocessing (candidate 8)**: if built, the content-hash reset must be idempotent so a concurrent re-save does not double-trigger re-derivation.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Assessment |
|-----------|------------|
| Code surface | Medium, touches search pipeline, FTS tokenization, extraction and save handlers across 8 candidates |
| Data migration | None in this phase (entity-vector-index for candidate 7 is a separate gated build) |
| Runtime risk | Low for the always-on config refactor, medium for ranking tweaks (recall-magnitude change, mitigated by default-off + reindexed baseline) |
| Reversibility | High, ranking tweaks via flags, extraction via additive paths, config via parity-proven equivalence |
| Hardest item | Candidate 7 (entity-store boost), H/M, blocked on a new entity vector index |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Is a heavy spaCy dependency acceptable in the FTS path, or should candidate 3 use a lightweight rule-based lemmatizer? **OPEN**, affects REQ-004 effort.
- Does `memory_index_scan` already re-derive all artifacts on `content_hash` change? **OPEN, resolved by REQ-008 verify-first, gates candidate 8.**
- Should the entity-store boost (candidate 7) be folded into the Wave-2 semantic-edge-layer initiative rather than built standalone? **OPEN**, shared-infra decision.
- BM25 calibration bucket boundaries and sigmoid constants need re-calibration on the ~1000-memory reindexed corpus (Mem0's values are not portable as-is). **OPEN, benchmark-owned.**
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Source research (PRIMARY)**: `../research/research.md`
- **External-memory-systems detail**: `../research/external-memory-systems/{research.md, iterations/iteration-001.md, iteration-002.md, iteration-007.md, iteration-009.md, iteration-019.md}`
- **Plain-language before→after**: `../../research/synthesis/06-memory-systems-findings.md`
- **Roadmap (MEMORY-SYSTEMS addendum, authoritative)**: `../../research/roadmap.md`
<!-- /ANCHOR:related-docs -->
