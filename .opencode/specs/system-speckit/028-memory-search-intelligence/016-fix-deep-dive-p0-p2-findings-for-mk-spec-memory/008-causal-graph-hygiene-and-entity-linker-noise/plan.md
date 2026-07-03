---
title: "Implementation Plan: Phase 8: causal-graph-hygiene-and-entity-linker-noise"
description: "Verify-first remediation of causal-graph noise and write-path bugs: ADR-gated co-occurrence disposition, ratchet removal, absorbed 028/006/002 P1-2/P1-4, linker/community/graph-signals fixes."
trigger_phrases:
  - "causal graph hygiene plan"
  - "entity linker noise fix approach"
  - "edge strength ratchet removal"
  - "cooccurrence relation migration"
  - "consolidation embedding lock fix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/008-causal-graph-hygiene-and-entity-linker-noise"
    last_updated_at: "2026-07-03T13:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Remediated REWORK: down-weight + verify-first surfaces, column-grep + session-trace fixes"
    next_safe_action: "Run Phase 1 baselines (vitest + edge histogram) before any code change"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-03-028-016-008-planning-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: causal-graph-hygiene-and-entity-linker-noise

<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (ESM, Node 22) inside `.opencode/skills/system-spec-kit/mcp_server/` |
| **Framework** | Spec Kit Memory MCP daemon (better-sqlite3 handlers + lib modules) |
| **Storage** | SQLite (better-sqlite3 + sqlite-vec); `causal_edges`, `entity_catalog`, `memory_entities`, `memory_surrogates`, communities tables; versioned migrations in `vector-index-schema.ts` |
| **Testing** | vitest (`mcp_server/tests/`), migration dry-runs on a DB copy, read-only SQL probes against the 1.3GB production DB |

### Overview
Execute the Section 4 requirement clusters in verify-first order: capture baselines, confirm every 🟡 finding against the live code (finding-is-a-hypothesis), then land fixes cluster by cluster with the ADR-001 co-occurrence down-weight as the centerpiece. The two absorbed 028/006/002 items are verify-first: P1-2's code fix is already present (`vector-index-schema.ts:1119-1129` == `causal-edges.ts:125`), so only the `WHERE derived_id IS NULL` backfill remains; P1-4's embedding already runs outside `BEGIN IMMEDIATE` (`consolidation.ts:574-578`), so only a concurrency test remains. Phase 013 re-points that tracker. Fixes to default-ON write-path behavior ship direct; the co-occurrence down-weight is a provenance-scoped strength UPDATE (no schema migration) and reversible.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (spec.md Sections 2-3)
- [ ] Success criteria measurable (spec.md Section 5; histogram/strength/identity/lock probes defined)
- [ ] Dependencies identified (002 predicate, 007 consumer, absorbed 028/006/002 contract read)
- [ ] Baselines captured BEFORE any change: vitest full-suite result, edge relation histogram, strength distribution snapshot, `memory_entities`/`entity_catalog` row counts

### Definition of Done
- [ ] P0 requirements (REQ-001..REQ-002) met with cited evidence; verify-first P1-2/P1-4 (REQ-003..REQ-004) and remaining P1s met or user-approved deferral
- [ ] Vitest re-run against the SAME baseline gate: zero new failures (regression-baseline-and-delta)
- [ ] Migration dry-run evidence (before/after counts on DB copy) attached to checklist items
- [ ] Docs updated (spec/plan/tasks/checklist/decision-record synchronized; ADRs ratified)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered daemon: handlers (`handlers/causal-links-processor.ts`) call lib modules (`lib/search/entity-linker.ts`, `lib/search/graph-lifecycle.ts`, `lib/graph/community-detection.ts`, `lib/graph/graph-signals.ts`, `lib/storage/consolidation.ts`, `lib/storage/causal-edges.ts`) over a shared better-sqlite3 connection; schema changes ride versioned migrations in `lib/search/vector-index-schema.ts`.

### Key Components
- **entity-linker (`lib/search/entity-linker.ts`)**: writes memory↔memory co-occurrence edges (`:865`), owns density guard, incremental/full matching, degree cache, catalog reads. Highest-noise producer; ADR-001 target.
- **graph-lifecycle (`lib/search/graph-lifecycle.ts`)**: `recomputeLocal` strength maintenance (`:309-323` ratchet), surrogate generation (`:532`), component-size estimation, dirty-set drain.
- **causal-links-processor (`handlers/causal-links-processor.ts`)**: frontmatter `causal_links` resolution; mapping table (`:67`) and fuzzy-LIKE fallback (`:290`).
- **community-detection (`lib/graph/community-detection.ts`)**: rebuild lifecycle, fingerprints, membership cache; ADR-002 naming target.
- **graph-signals (`lib/graph/graph-signals.ts`)**: momentum snapshot lookup and per-memory caches.
- **consolidation + causal-edges + content-id + vector-index-schema (storage/search)**: absorbed P1-2/P1-4 surfaces; migration home.

### Data Flow
Save path: memory save → causal-links-processor (frontmatter refs) + entity-linker (co-occurrence) → `causal_edges` writes → graph-lifecycle recompute → community/graph-signals caches. Read path (Phase 007's consumer): causal-boost/graph channel reads `causal_edges` and communities. This phase fixes the write/lifecycle side so the read side has truthful data.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/search/entity-linker.ts` (producer) | Inserts `'supports'` @0.7, `created_by='entity_linker'` (`:865`); density guard; catalog reads | update (ADR-001 down-weight strength, guard, ORDER BY, parity, containment) | Unit tests + provenance/strength histogram; rg inventory below |
| `lib/search/graph-lifecycle.ts` (producer) | Ratchets strengths on save (`MIN(1.0, strength + degreeBoost)`, `:309-323`); generates placeholder-title surrogates; traverses pseudo-nodes | update (idempotent strength = relation prior recomputed + degree, no accumulation; real titles; pseudo-node filter; dirty-set drain) | No-op-save strength test; surrogate title probe |
| `handlers/causal-links-processor.ts` (producer) | Maps `blocks`→reversed `enabled`; fuzzy-LIKE last-resort resolver | update (map `blocks`→`contradicts`; unresolved-with-suggestion) | Polarity + fallback unit tests |
| `lib/feedback/session-trace-causal-reducer.ts` (producer, flag-gated) | Infers an `enabled` edge from a single co-occurrence; prefers same-query sources (`selectPriorSearchSources`); flag `SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE` default OFF | update (≥2 distinct-session threshold; exclude same-query sources) | Threshold + same-query-exclusion unit test |
| `lib/search/vector-index-schema.ts` (schema/migration) | v40 backfill already hashes the live default `causal-edge:v1` (`:1119-1129`); partial UNIQUE index | update (already aligned — run derived_id backfill; add the down-weight strength-UPDATE migration) | Idempotent dry-run on DB copy; existing twin-identity test stays green |
| `lib/storage/causal-edges.ts` + `lib/content-id.ts` (identity policy) | Live default `causal-edge:v1` (`:125`); `DEFAULT_DERIVED_CAUSAL_EDGE_RULE_VERSION` defined at `content-id.ts:28` | investigate only — backfill/live already share it, no change expected | Existing identity/twin test across backfill/live |
| `lib/storage/consolidation.ts` (writer/lock) | Runs the O(n²) scan BEFORE `BEGIN IMMEDIATE` (`:574-578`); only the Hebbian write is under the lock; no `embedEdgeText` symbol exists | verify only — already lock-safe; add a concurrency/interleaving test | Concurrency window test; lock-scope assertion |
| `lib/graph/community-detection.ts` (lifecycle) | Rebuild only on checkpoint-restore; fingerprint sum; cache survives rebind; phantom members | update | Rebuild-cadence, stable-ID, rebind, phantom-member tests |
| `lib/graph/graph-signals.ts` (consumer/cache) | Exact now-7d momentum; memoryId-only cache keys | update (nearest snapshot; DB-identity keys) | Missed-day + dual-DB tests |
| Causal-boost / graph channel (`causal-boost.ts`, `graph-search-fn.ts`) (consumers) | Read `causal_edges` relations/strengths | unchanged here; Phase 007 owns; must be inventoried for relation-literal reads before ADR-001 lands | rg consumer inventory below; 007 harness re-run |
| Tests + docs (`mcp_server/tests/`, stage2/graph docs) | Encode current mapping/ratchet behavior | update alongside each fix; no test deleted to make green | Vitest delta vs baseline |

Required inventories:
- Same-class producers: `rg -n "'supports'|RELATION_TYPES\.SUPPORTS|entity_linker" .opencode/skills/system-spec-kit/mcp_server --glob '*.ts'` (every writer of the polluted relation before the down-weight; includes entity-linker `:865` and the flag-gated session-trace reducer).
- Consumers of changed symbols: `rg -n "\brelation\b|RELATION_TYPES|derived_id|rule_version|strength|created_by" .opencode/skills/system-spec-kit/mcp_server --glob '*.ts' --glob '*.md'` scoped to graph/boost/community readers; record each as update/unchanged/not-a-consumer in ADR-001.
- Matrix axes: {edge provenance: entity_linker | causal_links | session_trace | consolidation} × {relation: supports | caused | enabled | contradicts | supersedes | derived_from} × {endpoint: numeric | pseudo-node | deleted-memory} × {path: incremental | full-run | migration}; rows enumerated in tasks.md T-verification cluster.
- Algorithm invariant: edge identity is a pure function of (source_id, target_id, relation, rule_version) with ONE rule_version policy across backfill and live (verified present at `content-id.ts:28` + `vector-index-schema.ts:1119-1129`); strength is a pure, non-accumulating function of (relation prior, current graph state) — the relation prior is recomputed, not overwritten by a degree-only value. Adversarial cases: re-run backfill twice, save N times with zero new edges, reversed pair insert, deleted-endpoint insert.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Baselines captured: full vitest run, edge relation histogram, strength distribution, row counts (`causal_edges`, `entity_catalog`, `memory_entities`, `memory_surrogates` placeholder-title count)
- [ ] 🟡 confirm-before-fix pass: reproduce/quote each agent-reported finding in current code (report #19; Agent D linker/community/signals items; Agent H causal-links items; Agent C momentum/cache items)
- [ ] Absorbed contract read: `../../006-review-remediation/002-memory-schema-and-concurrency/spec.md` P1-2/P1-4 fix intent quoted into working notes; DB copy prepared for migration dry-runs

### Phase 2: Core Implementation
- [ ] Cluster A - ADR-001 co-occurrence down-weight: consumer inventory, provenance-scoped strength-UPDATE migration, entity-linker write change, causal-boost default exclusion by provenance
- [ ] Cluster B - graph-lifecycle: ratchet removal (idempotent relation-prior + degree), onWrite skip, pseudo-node filtering, dirty-set drain, surrogate real titles
- [ ] Cluster C - absorbed P1-2 (verify code fix present; run derived_id backfill on the 32,465 NULL rows) + P1-4 (verify embedding already outside the lock; add concurrency test)
- [ ] Cluster D - honest edge inference: causal-links-processor (polarity→`contradicts`, unresolved-with-suggestion fallback, liveness/parent filters) + session-trace reducer (≥2-session threshold, exclude same-query sources)
- [ ] Cluster E - entity-linker parity/hygiene: normalization parity, degree-cache invalidation, canonical pair order, density guard, catalog ORDER BY + pruning, per-memory error containment
- [ ] Cluster F - community lifecycle (cadence, stable IDs, fingerprint, rebind reset, phantom members; ADR-002) + graph-signals (nearest snapshot, per-DB keys)
- [ ] Cluster G - ADR-003 surrogate regeneration backlog (7,108 rows) through the async queue

### Phase 3: Verification
- [ ] Manual testing complete: post-migration histogram, no-op-save strength probe, twin-identity probe, lock-scope probe on DB copy
- [ ] Edge cases handled: adversarial matrix rows from the FIX ADDENDUM executed
- [ ] Documentation updated: ADRs ratified, checklist evidence filled, tasks reconciled, validate.sh --strict exit 0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | recomputeLocal derivation, mapping table polarity, fallback resolution, density guard, pair canonicalization, cache keys, nearest-snapshot lookup | vitest (`mcp_server/tests/`) |
| Integration | Migration dry-run (co-occurrence disposition, derived_id backfill alignment) on a copy of the production DB; consolidation concurrency window; DB-rebind cache reset | vitest + better-sqlite3 fixtures + DB copy |
| Manual | Read-only SQL probes: relation histogram, strength distribution before/after N no-op saves, placeholder-title surrogate count | sqlite3 CLI (read-only), evidence pasted into checklist.md |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 shared active-row predicate | Internal | Yellow (parallel phase) | Endpoint/member liveness filters land against a provisional predicate signature; re-verify at integration |
| Phase 007 causal-boost consumer fixes | Internal | Yellow (later in execution order) | SC-006 boost-amplification assertion deferred until 007; histogram gates unaffected |
| Absorbed 028/006/002 contract (P1-2, P1-4) | Internal | Green (contract readable; code already fixed, backfill+test pending) | None; this phase verifies + backfills, Phase 013 re-points the tracker |
| `maintenance-marker.ts` TTL contract | Internal | Green | P1-4 is verify-only; embedding already runs outside the lock, so no maintenance-handle change is needed |
| Production DB copy for dry-runs | Internal | Green | Without it, migration ships without count evidence: blocked by policy |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Post-migration histogram shows unexpected relation counts; vitest delta vs baseline shows new failures; save-path latency regresses; consolidation lock behavior changes on the default path.
- **Procedure**: Code changes revert via `git revert` of the phase commits (each cluster lands as its own commit). The co-occurrence down-weight ships with a reverse migration (restore strength 0.7 on `created_by='entity_linker'` rows) and is rehearsed on the DB copy before touching production.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Baselines + 🟡 verify) ──► Cluster A (ADR-001 migration) ──► Cluster G (surrogate regen)
                    │                        │
                    ├──► Cluster B (lifecycle/ratchet) ──► Cluster F (community + signals)
                    ├──► Cluster C (absorbed P1-2/P1-4)
                    ├──► Cluster D (causal-links)
                    └──► Cluster E (linker parity/hygiene)   all ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (baselines + verify) | None | All clusters |
| Cluster A (ADR-001) | Setup, consumer inventory | Cluster G, Phase 3 histogram gate |
| Clusters B/C/D/E | Setup | Phase 3 |
| Cluster F | Cluster B (pseudo-node filter feeds component sizing) | Phase 3 |
| Cluster G (ADR-003) | Cluster A (relation landscape final) | Phase 3 |
| Verification | All clusters | Phase close |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (baselines + 🟡 confirm pass) | Medium | 2-3 hours |
| Cluster A (disposition + migration) | High | 4-6 hours |
| Clusters B-E (write-path fixes) | High | 6-9 hours |
| Cluster F-G (community/signals/surrogates) | Medium | 3-5 hours |
| Verification | Medium | 2-3 hours |
| **Total** | | **17-26 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] DB copy snapshot taken before every migration dry-run and before the production run
- [ ] Reverse migration written and rehearsed on the copy (disposition is reversible by construction)
- [ ] Baseline histogram/strength/count evidence stored in checklist.md for after-the-fact comparison

### Rollback Procedure
1. Stop the daemon (no writes mid-rollback).
2. `git revert` the offending cluster commit(s); rebuild dist.
3. Run the reverse migration (restore relation/weight) if the disposition migration already ran.
4. Re-run the vitest baseline gate and the histogram probe; confirm parity with the stored baseline.

### Data Reversal
- **Has data migrations?** Yes (co-occurrence disposition; derived_id backfill alignment; surrogate regeneration).
- **Reversal procedure**: the down-weight migration is paired with a reverse migration (strength restore keyed on `created_by='entity_linker'`); the derived_id backfill touches only `WHERE derived_id IS NULL` rows or explicit skew rows recorded by the forward run; surrogate regeneration keeps prior rows recoverable until verification passes (soft-replace, then cleanup).
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Phase 1       │────►│  Cluster A      │────►│  Cluster G      │
│  Baselines +   │     │  ADR-001 move   │     │  ADR-003 regen  │
│  🟡 verify     │     └───────┬─────────┘     └────────┬────────┘
└──────┬─────────┘             │                        │
       │              ┌────────▼────────┐      ┌────────▼────────┐
       ├─────────────►│ Clusters B-E    │─────►│  Phase 3        │
       │              │ write-path fixes│      │  Verification   │
       └─────────────►│ + Cluster C abs.│      │  (gates + docs) │
                      └────────┬────────┘      └─────────────────┘
                               │
                      ┌────────▼────────┐
                      │  Cluster F      │
                      │  community/sig  │
                      └─────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baselines + 🟡 verify | None | Confirmed findings + baseline evidence | All clusters |
| Cluster A (ADR-001) | Consumer inventory | Clean relation histogram | G, boost gate |
| Cluster B (lifecycle) | Setup | Derived strengths, filtered traversal | F |
| Cluster C (absorbed) | Old-contract fix intent | Unified identity; lock-free embedding | Phase 3 |
| Clusters D/E (links/linker) | Setup | Honest resolution; path parity | Phase 3 |
| Cluster F (community/signals) | B | Living communities; correct caches | Phase 3 |
| Cluster G (ADR-003) | A | Real-title surrogates | Phase 3 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1 baselines + 🟡 confirm pass** - 2-3h - CRITICAL
2. **Cluster A consumer inventory + migration dry-run + ADR-001 ratification** - 4-6h - CRITICAL
3. **Cluster B ratchet removal (feeds strength gates + Cluster F)** - 2-3h - CRITICAL
4. **Phase 3 verification (histogram + baseline delta + strict validation)** - 2-3h - CRITICAL

**Total Critical Path**: 10-15 hours

**Parallel Opportunities**:
- Clusters C, D, E are independent of A/B and of each other; they can proceed in parallel after Phase 1.
- Test authoring for each cluster can run parallel to an adjacent cluster's implementation.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baselines + confirmations done | All 🟡 findings confirmed/refuted with quoted code; baseline evidence stored | End of Phase 1 |
| M2 | ADR-001 ratified + migration rehearsed | Dry-run counts match prediction on DB copy; consumer inventory complete | Mid Phase 2 |
| M3 | All clusters landed | REQ-001..REQ-012 implemented; vitest delta clean | End of Phase 2 |
| M4 | Phase close | SC-001..SC-006 evidenced; checklist P0/P1 complete; validate.sh --strict exit 0 | End of Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

Architecture decisions for this phase live in `decision-record.md`:

- **ADR-001**: Entity co-occurrence edge disposition: down-weight in place (recommended default, no schema migration) vs relocate to own relation (blocked by the `causal_edges` CHECK; needs a full table rebuild) (Proposed; ratify after dry-run + consumer inventory).
- **ADR-002**: Community detection naming: keep "Louvain" label vs rename to label-propagation vs implement real modularity (Proposed).
- **ADR-003**: Surrogate regeneration strategy for the 7,108 placeholder-title rows (Proposed).

---

<!--
LEVEL 3 PLAN
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records in decision-record.md
-->
