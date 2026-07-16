---
title: "Feature Specification: Phase 8: causal-graph-hygiene-and-entity-linker-noise"
description: "The causal graph is 94% entity-linker noise and every save ratchets edge strengths toward 1.0, so graph signals cannot rank real causality."
trigger_phrases:
  - "causal graph hygiene"
  - "entity linker supports noise"
  - "edge strength ratchet"
  - "entity cooccurrence relation"
  - "causal edge derived id split"
  - "surrogate placeholder titles"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-speckit-memory/041-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/008-causal-graph-hygiene-and-entity-linker-noise"
    last_updated_at: "2026-07-04T17:51:12.479Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped 13 REQs; down-weighted 31,644 noise edges + regenerated 3,787 titles; 225 tests green"
    next_safe_action: "Phase 009 learning-feedback-loop-repair"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-03-028-016-008-planning-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "ADR-001 ratified down-weight-in-place: the 31,644 co-occurrence edges dropped 0.7 → 0.05 via a strength UPDATE, no schema migration, no CHECK rebuild."
      - "ADR-002 amended: the Louvain names stay + the misnomer is documented; the rename defers to post-006 with the real-modularity decision. The lifecycle fixes (rebuild cadence + stable IDs) shipped."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 8: causal-graph-hygiene-and-entity-linker-noise

<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

## EXECUTIVE SUMMARY

The live causal graph carries 33,101 edges, and 31,118 of them (94%) are auto-created entity-linker `'supports'` edges at fixed strength 0.7 (`entity-linker.ts:865`); real causal edges number roughly 1,983. On top of that, `recomputeLocal` applies an additive `MIN(1.0, strength + deg/max*0.1)` ratchet on every save (`graph-lifecycle.ts:309-323`), so all strengths converge to 1.0 and the strength signal dies. This phase down-weights the co-occurrence noise in place (ADR-001, no schema migration), removes the ratchet, repairs the linker and community lifecycles, and verifies two absorbed 028/006/002 items that live code already fixed: the derived_id identity split (code fixed at `vector-index-schema.ts:1119-1129`; only the backfill on the 32,465 NULL rows remains) and semantic-edge embedding, which already runs outside the `BEGIN IMMEDIATE` lock (`consolidation.ts:574-578`; only a concurrency test remains).

**Key Decisions**: ADR-001 entity co-occurrence edge disposition (relocate vs down-weight), ADR-002 community "Louvain" naming vs real modularity, ADR-003 surrogate regeneration strategy for 7,108 placeholder-title rows.

**Critical Dependencies**: Phase 002 shared active-row predicate (graph exclusions), Phase 007 causal-boost consumer fixes (measures whether boost amplifies real causality), Phase 013 closeout (re-points the absorbed 028/006/002 tracker).

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-03 |
| **Branch** | `system-speckit/029-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 13 |
| **Predecessor** | 007-ranking-filter-bypass-and-score-scale-fixes |
| **Successor** | 009-learning-feedback-loop-repair |
| **Handoff Criteria** | Causal reads sane (co-occurrence down-weighted, excluded by provenance+strength), ratchet removed with idempotent strengths, absorbed P1-2 backfill run + twin-identity test green, P1-4 lock-scope verified + concurrency test added, vitest delta vs baseline clean, all three ADRs Accepted |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Deep dive remediation phase children specification (parent: `016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory`).

**Scope Boundary**: Causal-graph data hygiene and graph-side write/lifecycle correctness: entity-linker co-occurrence pollution, edge-strength ratchet, causal-links reference resolution, entity-linker path parity and pruning, surrogate titles, community lifecycle, graph-signals caching, the session-trace causal-inference reducer, plus the two verify-first absorbed 028/006/002 items (P1-2 derived_id backfill, P1-4 embedding lock-scope). Ranking-side consumers of the graph (causal boost scaling, graph-FTS tokenization, community injection scoring) belong to Phase 007; learning-loop and retention items to Phase 009; pure perf caches to Phase 010.

**Dependencies**:
- Phase 002 (`002-archived-tier-and-tombstone-read-exclusions`): the shared active-row predicate this phase reuses when filtering graph members and edge endpoints.
- Phase 007 (`007-ranking-filter-bypass-and-score-scale-fixes`): consumer-side causal-boost fixes; the "boost amplifies real causality" success gate is measured on 007's fixed consumer.
- Absorbed contract: `../../../004-review-remediation/002-memory-schema-and-concurrency/` (P1-2, P1-4). Phase 013 updates that tracker's pointers; this phase executes the fixes.

**Deliverables**:
- Provenance-scoped strength UPDATE + code change executing the ADR-001 down-weight disposition for the ~31,536 entity-linker `'supports'`@0.7 edges (no schema migration).
- `recomputeLocal` strength that recomputes the relation prior and combines it idempotently with degree (no additive accumulation); `onWrite` skip when `inserted == 0`.
- P1-2 verified fixed in code (`vector-index-schema.ts:1119-1129` == `causal-edges.ts:125`); derived_id backfill run on the 32,465 NULL rows; existing twin-identity test kept green (absorbed P1-2).
- P1-4 verified: embedding already runs outside `BEGIN IMMEDIATE` (scan precedes the lock at `consolidation.ts:574-578`); concurrency/interleaving test added (absorbed P1-4).
- Session-trace causal reducer hardened: require ≥2 distinct-session co-occurrences and exclude same-query sources before inferring an edge (routed silent-drop).
- causal-links-processor, entity-linker, surrogate, community-lifecycle, and graph-signals fixes listed in Section 4.
- decision-record.md with ADR-001/002/003 ratified from dry-run evidence.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The causal graph is 94% entity-linker noise and every save ratchets edge strengths toward 1.0, so graph signals cannot rank real causality. Live production measurement (2026-07-03, 🟢 ledger L8) shows 31,118 of 33,101 `causal_edges` rows are entity-linker `'supports'` edges at hardcoded strength 0.7, `memory_entities` has grown to 561,785 rows with no pruning path, and 7,108 memory surrogates were generated against placeholder titles ("Memory NNNN", `graph-lifecycle.ts:532`). Alongside the data rot, the write path has correctness bugs: an additive strength ratchet (report #19), a fuzzy-LIKE reference fallback that links arbitrary memories, a `blocks` relation stored as reversed `enabled` (inverted polarity), incremental-vs-full linker normalization divergence, and two absorbed 028/006/002 schema/concurrency defects (derived_id identity split; semantic-edge embedding inside `BEGIN IMMEDIATE`).

### Purpose
After this phase, `causal_edges` contains a sane relation histogram where real causal relations dominate, edge strengths are derived (not ratcheted), the linker and community lifecycles produce the same graph on every path, and the absorbed schema/concurrency fixes hold, so the Phase 007 causal boost has real causality to amplify.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Entity-linker `'supports'` pollution disposition per ADR-001: down-weight in place (recommended; keeps `relation='supports'`, no schema migration) vs relocate (needs a CHECK table rebuild); provenance-scoped strength UPDATE for the ~31,536 existing edges; causal-boost exclusion of `created_by='entity_linker'` unless opted in (🟢 L8).
- `recomputeLocal` ratchet removal: stop the additive `strength + deg/max*0.1` accumulation (`graph-lifecycle.ts:309-323`, report #19 🟡); recompute the relation prior and combine it idempotently with degree (or hold degree in its own column) so the causal signal survives; typed-degree weight consistency; `onWrite` skip when `inserted == 0`.
- Absorbed 028/006/002 P1-2 (verify-first): the v40 backfill already hashes `DEFAULT_DERIVED_CAUSAL_EDGE_RULE_VERSION` (`vector-index-schema.ts:1119-1129`), matching the live-write default (`causal-edges.ts:125`); `content-id.ts:28` defines `causal-edge:v1`. Code fixed; the open work is running the `WHERE derived_id IS NULL` backfill on the 32,465 NULL rows and keeping the existing twin-identity test (`tests/derived-id-provenance.vitest.ts`) green.
- Absorbed 028/006/002 P1-4 (verify-first): confirm the expensive scan already runs outside `BEGIN IMMEDIATE` (`consolidation.ts:574-578`) and that `runSemanticEdgeEmbeddingPass`/`embedEdgeText` do not exist tree-wide (the cited `:684/:701` exceed the 634-line file); add a concurrency/interleaving test around the lock scope.
- Session-trace causal reducer (`lib/feedback/session-trace-causal-reducer.ts`, flag `SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE` default OFF): require ≥2 distinct-session co-occurrences and exclude same-query co-retrieved sources before inferring an `enabled` edge (routed silent-drop; today it infers from a single co-occurrence and prefers same-query sources).
- causal-links-processor: fuzzy-LIKE fallback becomes unresolved-with-suggestion; `blocks` stored as reversed `enabled` polarity inversion fixed (`causal-links-processor.ts:67,290`, Agent H P2 🟡); numeric-ref liveness/parent filters.
- entity-linker path parity: normalized incremental matching (full-run parity), degree-cache invalidation on `createEntityLinks`, canonical pair order for reversed A→B/B→A dup pairs (Agent D P2 🟡).
- Density guard counts numeric-endpoint (memory↔memory) edges only, not `heading:`/`alias:`/`concept:` pseudo-edges (Agent D P2 🟡).
- Entity catalog determinism and growth: ORDER BY on the LIMIT 500 catalog read; pruning path for `entity_catalog` (61,638 rows) and `memory_entities` (561,785 rows) (Agent D refinement 🟡, row counts 🟢).
- Per-memory linking error containment: a single memory's linking failure must not escalate to a full-corpus run inside the save path (Agent D contract 🟡).
- Surrogates: real titles at generation (`graph-lifecycle.ts:532` 🟢 code-verified) plus regeneration of the 7,108 placeholder-title rows per ADR-003; alias dup provenance fix.
- Community lifecycle: rebuild cadence beyond checkpoint-restore, stable community IDs, fingerprint sum-collision fix, DB-rebind cache reset, phantom injected member ids for deleted memories filtered (Agent D P2 🟡); "Louvain" naming honesty vs real modularity per ADR-002.
- Graph-signals: momentum nearest-snapshot lookup (exact now-7d match today, Agent C P2 🟡); per-DB cache keys (memoryId-only today, Agent C P2 🟡); pseudo-node filtering in `estimateComponentSize`/`recomputeLocal`; dirty-set drain when no refresh fn is registered.

### Out of Scope
- Causal-boost consumer scaling, typed-traversal cap saturation, graph-FTS OR-tokens, community injection scoring/existence-check-at-injection - Phase 007 owns the ranking consumers (report #11, #14).
- Learning loop, FSRS, retention sweeps (incl. absorbed 028/006/002 P1-5) - Phase 009.
- Perf-only caches (graph adjacency cache, community single-load map) - Phase 010; this phase only fixes correctness of existing caches.
- Rescue-layer ranking authority - Phase 006 decision gates ranking measurement.
- The old tracker's own doc updates at `../../../004-review-remediation/002-memory-schema-and-concurrency/` - Phase 013 re-points that contract; this phase must not edit it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/search/entity-linker.ts` | Modify | Co-occurrence relation write (:865) per ADR-001; density guard numeric-endpoint counting; normalized incremental matching; degree-cache invalidation; canonical pair order; catalog ORDER BY; per-memory error containment |
| `mcp_server/lib/search/graph-lifecycle.ts` | Modify | Remove recomputeLocal ratchet (:309-323); onWrite skip on inserted==0; surrogate real titles (:532); pseudo-node filtering in estimateComponentSize/recomputeLocal; dirty-set drain |
| `mcp_server/handlers/causal-links-processor.ts` | Modify | Fuzzy-LIKE fallback to unresolved-with-suggestion; blocks polarity mapping (:67); numeric-ref liveness/parent filters (:290) |
| `mcp_server/lib/graph/community-detection.ts` | Modify | Rebuild cadence; stable community IDs; fingerprint collision; DB-rebind cache reset; phantom member filtering; naming per ADR-002 |
| `mcp_server/lib/graph/graph-signals.ts` | Modify | Momentum nearest-snapshot lookup; per-DB cache keys |
| `mcp_server/lib/storage/consolidation.ts` | Verify | Confirm embedding already runs outside BEGIN IMMEDIATE (scan precedes lock ~:574-578; no `embedEdgeText` symbol exists); no code change, test only (absorbed P1-4) |
| `mcp_server/lib/search/vector-index-schema.ts` | Modify | Verify v40 backfill already aligned (:1119-1129, absorbed P1-2); provenance-scoped strength-UPDATE migration for the ADR-001 down-weight + derived_id `WHERE derived_id IS NULL` backfill + surrogate regeneration backlog |
| `mcp_server/lib/storage/causal-edges.ts` | Investigate | Live-write derived_id default `causal-edge:v1` (:125); already aligned with the backfill — confirm one identity, no change expected |
| `mcp_server/lib/content-id.ts` | Investigate | `DEFAULT_DERIVED_CAUSAL_EDGE_RULE_VERSION='causal-edge:v1'` (:28) hashed into edge identity; confirm backfill/live already share it, no change expected |
| `mcp_server/lib/feedback/session-trace-causal-reducer.ts` | Modify | Require ≥2 distinct-session co-occurrences; exclude same-query co-retrieved sources before inferring an `enabled` edge (routed silent-drop; flag `SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE` default OFF) |
| `mcp_server/tests/` | Create/Modify | Vitest coverage for each fix cluster; migration dry-run fixtures; concurrency/interleaving test for P1-4; ≥2-session threshold test for the session-trace reducer |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Entity co-occurrence disposition executed per ADR-001 (down-weight in place; provenance-scoped strength UPDATE, no schema migration) | Causal consumers exclude `created_by='entity_linker'` co-occurrence edges by default; `SELECT relation, created_by, ROUND(strength,2), COUNT(*) FROM causal_edges GROUP BY 1,2,3` shows the ~31,536 co-occurrence rows down-weighted below the causal band, so real causal edges dominate the default causal read |
| REQ-002 | `recomputeLocal` stops accumulating: replace the additive `strength = MIN(1.0, strength + degreeBoost)` ratchet (`graph-lifecycle.ts:309-323`) with a strength that recomputes the edge's relation prior each save and combines it idempotently with the current degree term (or holds the degree term in its own column so the relation prior stays pure); `onWrite` skips when `inserted == 0` (report #19) | Repeated no-op saves leave every edge strength byte-identical (SC-002 idempotency); the relation prior survives (a causal edge does not collapse to a degree-only value); unit test asserts strength is a pure, non-accumulating function of (relation prior, current graph state) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Verify the causal-edge `derived_id` identity fix is present, then run the backfill (absorbed 028/006/002 P1-2, verify-first) | Confirm `vector-index-schema.ts:1119-1129` already hashes `DEFAULT_DERIVED_CAUSAL_EDGE_RULE_VERSION` (='causal-edge:v1', `content-id.ts:28`), matching the live writer (`causal-edges.ts:125`) — the code defect is already fixed and the existing twin-identity test (`tests/derived-id-provenance.vitest.ts`) stays green; the only open work is running the idempotent `WHERE derived_id IS NULL` backfill on the 32,465/33,476 NULL rows so backfilled and live twins collapse under the partial UNIQUE index |
| REQ-004 | Verify semantic-edge embedding already runs outside the consolidation `BEGIN IMMEDIATE` lock, then lock it with a test (absorbed 028/006/002 P1-4, verify-first) | Confirm the structure: `consolidation.ts` runs the read-only scan (`scanReadOnly`) before `BEGIN IMMEDIATE` (:574-578) and holds the lock only over the Hebbian write; `runSemanticEdgeEmbeddingPass`/`provider.embedEdgeText` do not exist tree-wide and the cited `:684/:701` exceed the 634-line file — there is no embedding-inside-lock defect; add a concurrency/interleaving test asserting the immediate lock scope covers only the write phase |
| REQ-005 | causal-links-processor stops linking arbitrary memories: fuzzy-LIKE fallback returns unresolved-with-suggestion; `blocks` polarity no longer inverted to reversed `enabled`; numeric refs get liveness/parent filters | Unit tests: an unresolvable ref yields no edge plus a suggestion; a `blocks:` frontmatter link produces a non-inverted relation; numeric refs to deleted/chunk-parent rows are rejected |
| REQ-006 | Entity-linker path parity: incremental matching normalizes like the full run; `createEntityLinks` invalidates the degree cache; reversed A→B/B→A pairs collapse to one canonical pair | Same corpus produces the same edge set via incremental and full paths; degree cache never serves stale counts after a link write; no reversed dup pairs in a fresh link run |
| REQ-007 | Density guard counts numeric-endpoint (memory↔memory) edges only, so pseudo-edges cannot silently disable cross-doc linking | Unit test: accumulating `heading:`/`alias:`/`concept:` pseudo-edges does not trip the guard; real-edge density still does |
| REQ-008 | Entity catalog reads are deterministic and bounded: ORDER BY added to the LIMIT 500 read; pruning path exists for `entity_catalog` and `memory_entities` | Catalog read is stable across runs; pruning command/maintenance path demonstrably reduces stale rows on a DB copy (561,785-row baseline) |
| REQ-009 | Per-memory linking errors are contained: a single-memory failure never escalates to a full-corpus linking run inside the save path | Fault-injection test: one poisoned memory logs and skips; save latency stays bounded; no full-corpus fallback observed |
| REQ-010 | Surrogates get real titles at generation, and the 7,108 placeholder-title rows are regenerated per ADR-003; alias dup provenance fixed | New surrogates carry the document title; a post-regeneration probe finds zero "Memory NNNN" question surrogates (or the ADR-003-ratified residual with reason) |
| REQ-011 | Community lifecycle is live: rebuild cadence beyond checkpoint-restore, stable community IDs across rebuilds, fingerprint sum-collision fixed, module cache reset on DB rebind, phantom member ids for deleted memories filtered; naming per ADR-002 | Membership updates without a checkpoint-restore; rebuild keeps stable IDs for unchanged communities; rebind test shows no cross-DB cache bleed; injected members always exist |
| REQ-012 | Graph-signals correctness: momentum uses nearest-snapshot lookup (not exact now-7d), caches key on DB identity plus memoryId, pseudo-nodes filtered from `estimateComponentSize`/`recomputeLocal`, dirty-set drains when no refresh fn is registered | Momentum non-zero the day after a missed snapshot; two DBs in one process never share cached signals; component-size estimates count numeric nodes only; dirty set is bounded in a no-refresh-fn run |
| REQ-013 | Session-trace causal reducer requires ≥2 distinct-session co-occurrences and excludes same-query co-retrieved sources before inferring an edge (routed silent-drop; `lib/feedback/session-trace-causal-reducer.ts`, flag `SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE` default OFF) | A single co-occurrence no longer creates an edge; only sources co-occurring with the citation across ≥2 distinct sessions qualify; same-query co-retrieved sources are excluded from candidate selection (`selectPriorSearchSources`); a unit test with the flag ON asserts the threshold and the same-query exclusion |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Causal reads are sane: entity co-occurrence edges are down-weighted below the causal band and excluded from causal consumers by provenance (`created_by='entity_linker'`) by default, so the ≈1,983 real causal edges dominate what causal consumers read (measured via `relation, created_by, strength`, since down-weight keeps `relation='supports'`).
- **SC-002**: Edge strengths are idempotent: N repeated no-op saves produce zero strength drift, and the relation prior survives (strength is not overwritten with a degree-only value). Baseline today: every save ratchets +0.1-scaled toward 1.0.
- **SC-003**: `derived_id` identity fix confirmed present (`vector-index-schema.ts:1119-1129` == `causal-edges.ts:125`), the existing twin-identity test passes, and the `WHERE derived_id IS NULL` backfill collapses the 32,465 NULL rows so backfilled and live twins dedup under the partial UNIQUE index (absorbed P1-2; verified by dry-run on a DB copy).
- **SC-004**: Consolidation already holds no `BEGIN IMMEDIATE` across provider embedding — the read-only scan runs before the lock (:574-578) and no `embedEdgeText` symbol exists — and a new concurrency/interleaving test locks that lock-scope invariant in place (absorbed P1-4).
- **SC-005**: Baseline-before-no-regressions: vitest suite delta vs the Phase 1 captured baseline is zero new failures; graph-touching suites extended with the new adversarial cases.
- **SC-006**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` exits 0 at phase close, and the Phase 007 harness (post-006 decision) shows causal boost amplifying real causality rather than co-occurrence noise.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002 shared active-row predicate | Graph member/endpoint filtering diverges if 002 slips | Land 008's filters against the 002 predicate signature; feature-check at integration |
| Dependency | Phase 007 causal-boost consumer fixes | "Boost amplifies real causality" gate unmeasurable | Gate SC-006's boost assertion on 007 landing; histogram gates (SC-001) stand alone |
| Dependency | 028/006/002 absorbed contract (`../../../004-review-remediation/002-memory-schema-and-concurrency/`) | Divergent fix scope if both trackers execute | This phase verifies P1-2 (code already fixed; runs the backfill) and P1-4 (already lock-safe; adds the test); Phase 013 re-points the old tracker; do not edit it here |
| Risk | Down-weight UPDATE hits the wrong edges (provenance column ambiguity) | High | Dry-run on DB copy; select strictly on `created_by = 'entity_linker'` AND relation `supports` AND strength 0.7; count-assert before/after |
| Risk | Unknown consumers read `'supports'` relation semantics | Medium | Consumer inventory (plan FIX ADDENDUM) before relocation; ADR-001 records the blast radius |
| Risk | Surrogate regeneration cost (7,108 rows re-embedded) | Medium | ADR-003 chooses batch/lazy strategy; run through the async queue, not the save path |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Save-path linking stays bounded: no full-corpus linking or catalog scan inside a single memory save; migration runs batched and resumable so the daemon stays responsive.

### Security
- **NFR-S01**: All migration and linker SQL is parameterized; the fuzzy-fallback removal must not introduce a new string-interpolation surface; provenance columns are preserved for audit.

### Reliability
- **NFR-R01**: Consolidation never holds `BEGIN IMMEDIATE` across a provider call (reaper/lease starvation window closed); migrations are idempotent on re-run and safe to interrupt mid-batch.

---

## 8. EDGE CASES

### Data Boundaries
- Empty graph / fresh DB: recomputeLocal, density guard, and community rebuild must no-op cleanly with zero edges.
- Catalog beyond LIMIT 500: ORDER BY makes the selection deterministic; pruning keeps the working set inside the limit's usefulness.
- Reversed dup pairs (A→B and B→A) already persisted: migration collapses to canonical order without losing the stronger edge.

### Error Scenarios
- Edge endpoints referencing deleted memories: lifecycle filters and community member injection must skip them (coordinates with 002's predicate).
- Pseudo-node endpoints (`heading:`/`alias:`/`concept:`) in `estimateComponentSize`/`recomputeLocal` traversal: filtered, never mutated.
- Missed momentum snapshot day: nearest-snapshot lookup degrades gracefully instead of zeroing the channel all day.
- DB rebind mid-session (eval/ablation swap): community and graph-signals caches reset; no closed-connection reads and no cross-DB bleed.
- Embedding provider stall during consolidation: the read-only scan already runs before `BEGIN IMMEDIATE` (P1-4 verified, `consolidation.ts:574-578`), so the immediate lock is never held across provider work.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: 10, LOC: ~600-900, Systems: graph write path + storage + migration |
| Risk | 18/25 | Data down-weight UPDATE on ~31.5k edges + derived_id backfill on 32.5k NULL rows; verify-first concurrency test; Breaking: strength/provenance exclusion semantics for graph consumers |
| Research | 14/20 | 🟡 confirm-before-fix pass across nine agent-reported findings; two ADR dry-runs |
| Multi-Agent | 6/15 | Single-seat execution; parallelizable test authoring |
| Coordination | 10/15 | Dependencies on phases 002/007/013 plus the absorbed 028/006/002 contract |
| **Total** | **68/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Down-weight UPDATE touches non-linker `supports` edges (false positives) | H | M | Provenance-scoped WHERE (`created_by='entity_linker' AND relation='supports' AND strength=0.7`); dry-run counts on DB copy; before/after strength diff committed as evidence |
| R-002 | Hidden consumers of `'supports'` semantics break after the down-weight/exclusion | H | M | FIX ADDENDUM consumer inventory (rg over relation/strength/provenance literals) before code change; ADR-001 records every consumer and its action |
| R-003 | Surrogate regeneration floods the embedding queue (7,108 rows on an 8.7k backlog) | M | H | ADR-003: batched/off-peak regeneration through the retry queue; cap batch size; sequence after Phase 004 drain-rate fix if available |
| R-004 | Community rebuild cadence churns IDs and invalidates stored references | M | M | Stable-ID mapping keyed on membership fingerprint (post-collision-fix); rebuild test asserts ID stability for unchanged communities |
| R-005 | Absorbed P1-2 backfill corrupts existing derived_id rows | H | L | Code already aligned (`vector-index-schema.ts:1119-1129`); backfill touches only `WHERE derived_id IS NULL` (32,465 rows) or explicit skew reconciliation; test on a copy first (inherited from the 028/006/002 contract) |

---

## 11. USER STORIES

### US-001: Real causality in search boosts (Priority: P0)

**As a** memory-search operator, **I want** causal boosts computed over real causal edges instead of co-occurrence noise, **so that** graph-boosted results reflect actual cause/effect lineage.

**Acceptance Criteria**:
1. **Given** the ADR-001 down-weight UPDATE has run, **When** I group `causal_edges` by `relation, created_by, strength`, **Then** the `created_by='entity_linker'` co-occurrence edges sit below the causal strength band and real causal edges dominate the default causal read.
2. **Given** causal boost runs with default flags, **When** a query touches a memory with only co-occurrence neighbors, **Then** no co-occurrence-driven boost applies unless explicitly opted in.

### US-002: Stable edge strengths (Priority: P0)

**As a** graph maintainer, **I want** edge strength recomputed idempotently (relation prior recomputed, not accumulated), **so that** repeated saves cannot ratchet every edge to 1.0 and the causal signal survives.

**Acceptance Criteria**:
1. **Given** a memory with existing edges, **When** I re-save it N times with zero new edges, **Then** every edge strength stays byte-identical and the relation prior is preserved (`graph-lifecycle.ts:309-323` additive accumulation removed, not replaced by a degree-only value).

### US-003: One edge identity (Priority: P1)

**As a** schema owner, **I want** to confirm the one-`derived_id`-per-edge fix is already in code and then backfill the NULL rows, **so that** the partial UNIQUE index can dedup and replay identity holds (absorbed P1-2, verify-first).

**Acceptance Criteria**:
1. **Given** the backfill hasher (`vector-index-schema.ts:1119-1129`) and the live default (`causal-edges.ts:125`) already share `causal-edge:v1` and the twin-identity test passes, **When** the `WHERE derived_id IS NULL` backfill runs on the 32,465 NULL rows, **Then** a backfilled edge and its live-written twin are byte-equal and the UNIQUE index collapses them.

### US-004: No reaper starvation during consolidation (Priority: P1)

**As a** daemon operator, **I want** to confirm semantic-edge embedding already runs outside the write lock and lock a regression test around it, **so that** a slow provider cannot get the daemon reaped mid-write (absorbed P1-4, verify-first).

**Acceptance Criteria**:
1. **Given** consolidation runs the read-only scan before `BEGIN IMMEDIATE` (:574-578) and holds the lock only over the Hebbian write (no `embedEdgeText` symbol exists), **When** a concurrency test interleaves a competing writer, **Then** no embedding call executes under the immediate lock and the write phase is the only locked section.

### US-005: Honest reference resolution (Priority: P1)

**As a** doc author using causal frontmatter links, **I want** unresolvable references surfaced instead of guessed, **so that** the graph never links my doc to an arbitrary newest memory and never inverts `blocks` polarity.

**Acceptance Criteria**:
1. **Given** a `causal_links` ref that matches nothing exactly, **When** the processor runs, **Then** it records unresolved-with-suggestion instead of a fuzzy-LIKE edge (`causal-links-processor.ts:290`).
2. **Given** a `blocks:` link, **When** the edge is stored, **Then** its relation and direction express blocking without inverting to reversed `enabled` — mapped to `contradicts` (a CHECK-legal relation; a first-class `blocks` relation would need the same CHECK table rebuild) (`causal-links-processor.ts:67`).

### US-006: Deterministic linker and living communities (Priority: P1)

**As a** graph consumer, **I want** the incremental and full linker paths to agree, communities to update without checkpoint-restores, and graph-signals caches to respect DB identity, **so that** graph answers are reproducible.

**Acceptance Criteria**:
1. **Given** the same corpus, **When** linked incrementally vs in a full run, **Then** the resulting edge sets are identical (normalization parity, canonical pair order, fresh degree cache).
2. **Given** a missed momentum snapshot day and a mid-session DB rebind, **When** graph-signals are computed, **Then** momentum uses the nearest snapshot and no cache entry crosses DB identities.

---

## 12. OPEN QUESTIONS

- ADR-001 disposition is Proposed with down-weight-in-place as the recommended default (keeps `relation='supports'`, no schema migration); relocation to `entity_cooccurrence` stays a flip-option but pays a full CHECK table rebuild. Ratify from the dry-run counts + consumer inventory during execution.
- Which relation the un-inverted `blocks` maps to: prefer `contradicts` (CHECK-legal, no schema change); a first-class `blocks` relation would need the same CHECK table rebuild. Confirm with the RELATION_TYPES owner during execution.
- Surrogate regeneration batching (one-shot backfill vs lazy on-access) and its interaction with the Phase 004 embedding-queue drain rate; ADR-003 records the ratified choice.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md` (ADR-001/002/003)
- **Research Sources**: `../research/deep-dive-report.md` (§1 causal-edge rows, ledger L8; §3 P1 #19), `../research/findings-ledger.md` (Agent D + Agent H causal-links items), `../research/phase-decomposition.md` (§008)
- **Absorbed Contract**: `../../../004-review-remediation/002-memory-schema-and-concurrency/spec.md` (P1-2, P1-4; pointers updated by Phase 013)

---

<!--
LEVEL 3 SPEC
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
-->
