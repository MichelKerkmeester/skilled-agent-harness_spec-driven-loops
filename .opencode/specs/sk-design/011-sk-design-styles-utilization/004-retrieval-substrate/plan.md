---
title: "Implementation Plan: styles-library retrieval substrate"
description: "Phased plan to build the Phase A retrieval engine over the 1,290-bundle sk-design styles library: checked manifest generator, deterministic eligibility, disposable FTS5/BM25 accelerator, candidate cards, generation-guarded hydration, CORPUS_USE_PROOF v1 gate, and CI invalidation fixtures. Scaffold only; not yet built."
trigger_phrases:
  - "retrieval substrate plan"
  - "style-library.mjs plan"
  - "manifest generator plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/004-retrieval-substrate"
    last_updated_at: "2026-07-18T13:40:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the retrieval-substrate L3 plan"
    next_safe_action: "Implement the manifest schema and refresh algorithm behind build --write"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-retrieval-substrate-011-004"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: styles-library retrieval substrate

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ES modules (`.mjs`), no new runtime deps beyond `node:sqlite` / better-sqlite3 for the disposable projection |
| **Subject corpus** | `.opencode/skills/sk-design/styles/` (1,290 bundles; `_harness` excluded) |
| **Committed artifact** | `styles/_retrieval-manifest.json` (byte-stable) only |
| **Testing** | Vitest/node test fixtures under `styles/_engine/__tests__/` |

### Overview
Implement the Phase A substrate from `../001-research-utilization/research/lineages/sol/research.md` §15. A single local executable (`style-library.mjs`) exposes `build --write`, `build --check`, `query`, and `hydrate`. The manifest is the only committed retrieval artifact; the FTS5/BM25 projection is built on demand and discarded. Deterministic eligibility runs before ranking; hydration is generation-guarded; `CORPUS_USE_PROOF v1` gates any corpus-influenced ready claim. No watcher or daemon — the corpus rebuild is sub-second.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Research §4/§5/§9/§15 substrate contract reviewed and frozen as the build target
- [x] Manifest header + per-style field list agreed (research §9)
- [x] Facet vocabulary seed list drafted (`serif-role`, `warm-surface`, `license-restricted`, `generation-mismatch`)
- [x] Corpus generation-hash inputs enumerated (schema, crawl-manifest hash, sorted content hashes)

### Definition of Done
- [x] `build --check` byte-stable on an unchanged corpus; flags exact mutated ids
- [x] Eligibility demonstrably runs before ranking
- [x] Hydration refuses `generation-mismatch`; source-scan fallback returns `degraded:true`
- [x] `CORPUS_USE_PROOF v1` blocks an unproven ready claim
- [x] All change/invalidation fixtures pass in CI
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered hybrid retrieval (research §4): canonical committed manifest → deterministic eligibility → disposable same-generation lexical ranking → bounded candidate cards → mode-owned selection → generation-guarded hydration → `CORPUS_USE_PROOF v1`.

### Key Components
- **style-library.mjs** (`styles/_engine/`): CLI entrypoint dispatching `build`/`query`/`hydrate`.
- **manifest.mjs**: manifest schema, refresh algorithm, content + generation hashing, atomic write.
- **eligibility.mjs**: required-facet, exclusion, and provenance/rights gates — the first stage.
- **rank-fts.mjs**: disposable SQLite FTS5/BM25 projection + bounded source-scan fallback.
- **cards.mjs**: compact candidate-card assembly with byte caps.
- **hydrate.mjs**: generation-guarded, mode-scoped artifact/slice loading.
- **corpus-use-proof.mjs**: `CORPUS_USE_PROOF v1` schema + validator.

### Data Flow
```
build --write ──> _retrieval-manifest.json (committed, generation-hashed)
                        │
query ──> eligibility (facets/exclusions/provenance)  [FIRST — decides membership]
                        │
              disposable FTS5/BM25 rank OR bounded source scan (degraded)
                        │
              ≤5 candidate cards ──> mode-owned selection
                        │
hydrate ──> generation guard (re-hash) ──> permitted artifacts/slices
                        │
              CORPUS_USE_PROOF v1 ──> ready claim (blocked if invalid)
```

### Component Diagram
```
┌───────────────────────────────────────────────────────────────┐
│                 styles/_engine/style-library.mjs               │
├───────────────────────────────────────────────────────────────┤
│  build            query                 hydrate                │
│  ┌──────────┐     ┌──────────┐          ┌──────────┐           │
│  │manifest  │     │eligibility│─FIRST──▶ │  cards   │           │
│  │  .mjs    │     │  .mjs     │          │  .mjs    │           │
│  └────┬─────┘     └────┬──────┘          └────┬─────┘           │
│       │                │                      │                 │
│       ▼                ▼                      ▼                 │
│  _retrieval-      rank-fts.mjs           hydrate.mjs            │
│  manifest.json    (disposable FTS /      (generation guard)     │
│  (committed)       source-scan)               │                │
│                                               ▼                 │
│                                    corpus-use-proof.mjs         │
│                                    (CORPUS_USE_PROOF v1)        │
└───────────────────────────────────────────────────────────────┘
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Manifest generator
- [x] Manifest schema (header + per-style fields) per research §9
- [x] Refresh algorithm: enumerate/sort inputs, hash bytes, reparse only changed, remove deleted
- [x] Content hash per style; generation hash over schema + crawl-manifest hash + sorted content hashes
- [x] Atomic `--write` (temp file + rename); `corpus-changing` abort on fingerprint drift

### Phase 2: Eligibility (first stage)
- [x] Required-facet filter
- [x] Exclusion filter
- [x] Provenance/rights gate
- [x] Guarantee: ineligible styles cannot reach ranking

### Phase 3: Ranking + fallback
- [x] Disposable SQLite FTS5/BM25 projection built from the current generation
- [x] Bounded `DESIGN.md` source-scan fallback returning `degraded:true`
- [x] Deterministic tie-breaking and card ordering

### Phase 4: Cards + hydration
- [x] Compact candidate cards (≤5, byte-capped, score breakdown, provenance)
- [x] Generation-guarded hydration; refuse `generation-mismatch`
- [x] Mode-scoped includes and byte caps

### Phase 5: Proof gate + CI
- [x] `CORPUS_USE_PROOF v1` schema + validator
- [x] `build --check` byte-stability + add/change/delete invalidation fixtures
- [x] Fallback, generation-mismatch, ordering, and valid/invalid proof-card fixtures
- [x] CI selectors on `styles/**`, the engine, and mode contracts
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Coverage Target |
|-----------|-------|-------|-----------------|
| Unit | manifest hashing, eligibility gates, card byte-caps | node test | High on engine modules |
| Invalidation | byte-stable `--check`, add/change/delete, pre/post abort | fixtures | All research §9 fixtures |
| Fallback | stale/absent FTS → source scan `degraded:true` | fixtures | Both stale and absent |
| Guard | generation-mismatch hydration refusal | fixtures | Match + mismatch |
| Proof | valid/invalid `CORPUS_USE_PROOF v1` cards | fixtures | Both polarities |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Extracted styles corpus (packet 010) | Internal | Green (read-only) | No corpus to index |
| SQLite (node:sqlite / better-sqlite3) | External | Green | FTS accelerator only; source-scan fallback still works |
| Node ES-module runtime | Internal | Green | Engine cannot run |

This phase has **no upstream spec dependency** — it is the foundation the rest of packet 011 builds on.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: manifest instability, or the engine mis-scopes hydration.
- **Procedure**: delete `styles/_engine/` and `styles/_retrieval-manifest.json`; the corpus is untouched, and no mode yet depends on the engine at runtime until `../005-md-generator-schema-contract/` wires it in.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Manifest) ──> Phase 2 (Eligibility) ──> Phase 3 (Rank/Fallback) ──> Phase 4 (Cards/Hydrate) ──> Phase 5 (Proof/CI)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Manifest | None | Eligibility, Rank |
| Eligibility | Manifest | Rank, Cards |
| Rank/Fallback | Manifest, Eligibility | Cards |
| Cards/Hydrate | Rank | Proof gate |
| Proof/CI | All | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Manifest generator | Medium | 1.5-2 days |
| Eligibility | Low-Medium | 1 day |
| Ranking + fallback | Medium | 1-1.5 days |
| Cards + hydration | Medium | 1-1.5 days |
| Proof gate + CI | Medium | 1 day |
| **Total (Phase A)** | | **~5-8 engineer-days** |
| FTS accelerator (Phase B slice) | Low | **+1-2 days** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Manifest committed and `--check` green in CI
- [x] No mode wired to the engine until `../005-md-generator-schema-contract/`

### Rollback Procedure
1. Remove `styles/_engine/` modules and `styles/_retrieval-manifest.json`.
2. Revert CI selectors added for `styles/**`.
3. Confirm no mode runtime references the engine.

### Data Reversal
- **Has data migrations?** No — the manifest is a derived, regenerable projection.
- **Reversal procedure**: delete the manifest; regenerate later with `build --write`.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐
│  Manifest    │
│  (Phase 1)   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Eligibility  │
│  (Phase 2)   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Rank/Fallback│
│  (Phase 3)   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Cards/Hydrate│
│  (Phase 4)   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Proof/CI     │
│  (Phase 5)   │
└──────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| manifest.mjs | corpus | `_retrieval-manifest.json`, generation hash | eligibility, rank, hydrate |
| eligibility.mjs | manifest | eligible set | rank, cards |
| rank-fts.mjs | manifest, eligibility | ordered eligible set / degraded set | cards |
| cards.mjs | rank | ≤5 candidate cards | hydrate |
| hydrate.mjs | manifest, cards | permitted artifacts/slices | proof gate |
| corpus-use-proof.mjs | hydrate output | validated proof card | ready claim |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Manifest generator** - 2 days - CRITICAL (everything hashes off the generation)
2. **Eligibility** - 1 day - CRITICAL (decides membership before ranking)
3. **Ranking + fallback** - 1.5 days - CRITICAL
4. **Cards + hydration** - 1.5 days - CRITICAL
5. **Proof gate + CI** - 1 day - CRITICAL

**Total Critical Path**: ~7 days (within the 5-8 day Phase A estimate).

**Parallel Opportunities**:
- Proof-card schema can be drafted alongside the manifest.
- Source-scan fallback and FTS projection can be built in parallel behind one ranking interface.
- Fixtures can be authored as each stage lands.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Manifest | `build --write`/`--check` byte-stable + generation hash | Day 2 |
| M2 | Eligibility | Facet/exclusion/provenance gates first | Day 3 |
| M3 | Retrieval | Ranked cards + degraded fallback | Day 5 |
| M4 | Hydration | Generation-guarded, mode-scoped | Day 6 |
| M5 | Gated + CI | Proof gate + all invalidation fixtures | Day 7-8 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for full ADRs:

| ADR | Decision | Rationale |
|-----|----------|-----------|
| ADR-001 | Committed checked manifest is the only retrieval artifact | ~503 KB, ~1 ms scans; canonical, cheap, reviewable |
| ADR-002 | Deterministic eligibility decides; scores only order | Required-facets/negation need determinism (P@5 0.60 vs BM25 0.33) |
| ADR-003 | Disposable same-generation FTS5/BM25 accelerator | Cheap (~180 ms build), never authoritative, no drift risk |
| ADR-004 | Generation-guarded hydration + bounded source-scan fallback | Refuse stale values; degrade, never fail hard |
| ADR-005 | `CORPUS_USE_PROOF v1` blocking ready-gate | No un-provenanced or averaged corpus-influenced claim ships |

---

## RELATED DOCUMENTS

- **Specification**: `spec.md`
- **Tasks**: `tasks.md`
- **Checklist**: `checklist.md`
- **Decisions**: `decision-record.md`
- **Parent**: `../spec.md`
</content>
