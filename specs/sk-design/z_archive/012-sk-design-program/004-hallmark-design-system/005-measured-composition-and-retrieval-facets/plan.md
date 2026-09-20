---
title: "Implementation Plan: Measured Composition and Retrieval Facets"
description: "Implement additive measured composition records, normalized page-shape facets, and compatibility evidence."
trigger_phrases:
  - "measured composition DNA"
  - "page shape retrieval facets"
  - "style composition query"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets"
    last_updated_at: "2026-07-23T07:04:12Z"
    last_updated_by: "implementation-agent"
    recent_action: "Verified measured composition facets"
    next_safe_action: "Regenerate metadata and commit scoped changes"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/lib/database/schema.mjs"
      - ".opencode/skills/sk-design/styles/lib/database/indexer.mjs"
      - ".opencode/skills/sk-design/styles/lib/database/retrieval.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "measured-composition-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Measured Composition and Retrieval Facets

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
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
| **Language/Stack** | Node.js ESM and SQLite |
| **Framework** | `node:test` |
| **Storage** | Versioned persistent style database |
| **Testing** | Database suite plus strict spec validator |

### Overview
Extend the current projection instead of adding another extraction subsystem. The indexer derives a canonical JSON record and normalized facets from data it already parses; retrieval consumes those facets only through new opt-in request keys.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented. [EVIDENCE: `spec.md` problem and scope anchors]
- [x] Success criteria measurable. [EVIDENCE: `spec.md` defines five observable success criteria]
- [x] Dependencies identified. [EVIDENCE: dependencies anchor lists artifacts, serialization helpers, and metadata ownership]

### Definition of Done
- [x] All acceptance criteria implemented. [EVIDENCE: schema, indexer, retrieval, and compatibility subtests pass]
- [x] Full database suite passing. [EVIDENCE: tests 73, pass 73, fail 0]
- [x] Strict packet validation reconciled with metadata ownership. [EVIDENCE: Errors 0; graph metadata absent pending orchestrator generation]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Deterministic materialized projection with opt-in query facets.

### Key Components
- **Schema**: `composition_dna_json` stores the structured style record; `style_composition_facets` supports indexed lookup.
- **Indexer**: Derives evidence, region sequence, layout axes, token emphasis, and navigation/footer shape.
- **Retrieval**: Applies required composition facets before ranking and preferred facets in the structured lane.

### Data Flow
Canonical layout, `DESIGN.md` headings, and token-axis counts flow through canonical derivation, stable JSON serialization, normalized facet persistence, eligibility filtering, and structured ranking.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `styles` table | Shipped style record | Add JSON projection with legacy default | v2 migration preservation test |
| Indexer | Flat-file projection | Derive and backfill composition data | exact projection and repeat-index test |
| Retrieval fingerprint | Cursor/request identity | Append keys only when provided | fixed legacy digest test |
| Eligibility and structured lane | Filter and rank | Add dedicated composition facet path | filter/rank compatibility test |

Required inventories:
- Same-class producers: `parseStyle` is the sole style-record projection producer.
- Consumers of changed symbols: schema, indexer, retrieval, and database tests are the bounded consumers.
- Matrix axes: fresh row, migrated v2 row, empty migrated projection, required facet, preferred facet, omitted keys.
- Algorithm invariant: identical indexed evidence produces byte-identical canonical composition JSON and sorted facets.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the research syntheses and live database path. [EVIDENCE: spec research basis and affected-surfaces inventory]
- [x] Capture the 69-test baseline. [EVIDENCE: pre-change command reports tests 69, pass 69, fail 0]
- [x] Freeze the additive query and migration invariants. [EVIDENCE: architecture and algorithm invariant documented above]

### Phase 2: Core Implementation
- [x] Add version-compatible composition storage and migration. [EVIDENCE: v2 record preservation subtest passes]
- [x] Add deterministic `compositionDNA` and facet derivation. [EVIDENCE: repeated-index composition subtest passes]
- [x] Add opt-in composition filtering and ranking. [EVIDENCE: composition facet filter/rank subtest passes]
- [x] Add migration, derivation, retrieval, and compatibility tests. [EVIDENCE: four new subtests pass in the full suite]

### Phase 3: Verification
- [x] Run focused database tests. [EVIDENCE: tests 31, pass 31, fail 0]
- [x] Run the full database suite. [EVIDENCE: tests 73, pass 73, fail 0]
- [x] Run strict packet validation and record the metadata exception. [EVIDENCE: strict output reports Errors 0 and missing graph metadata]
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Canonical derivation and facet ranking | `node:test` |
| Migration | v2 row preservation and new schema surfaces | `DatabaseSync` |
| Integration | Full database projection and retrieval suite | `node --test tests/database/index.mjs` |
| Contract | Level 2 packet anchors and completion evidence | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing canonical and `DESIGN.md` artifacts | Internal | Available | Projection would fall back to partial evidence |
| Stable JSON and raw comparator helpers | Internal | Available | Deterministic bytes and ordering would be unavailable |
| Orchestrator metadata generation | Workflow | Pending | Strict validation reports generated metadata integrity |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Database regression, legacy fingerprint drift, or incorrect page-shape eligibility.
- **Procedure**: Restore the three database modules and three tests; discard this additive phase packet. Existing v2 databases remain readable by the restored code.
<!-- /ANCHOR:rollback -->

---

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Research synthesis and live database | Core |
| Core | Setup | Verify |
| Verify | Core | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | Read and baseline |
| Core Implementation | Medium | Schema, indexer, retrieval, tests |
| Verification | Medium | Full suite and strict validation |
| **Total** | | **One bounded implementation pass** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Legacy schema behavior captured in a migration test. [EVIDENCE: v2 record preservation subtest passes]
- [x] Legacy request fingerprint captured as a fixed digest. [EVIDENCE: fixed digest compatibility subtest passes]
- [x] Existing query DTO guarded by the full database suite. [EVIDENCE: frozen oracle and telemetry byte-identity subtests pass]

### Rollback Procedure
1. Stop publishing composition-enabled generations.
2. Restore the prior schema, indexer, retrieval, and test files.
3. Rebuild a v2 generation from the unchanged authoritative corpus.
4. Run the full database suite before republishing.

### Data Reversal
- **Has data migrations?** Additive schema migration only.
- **Reversal procedure**: Rebuild from the authoritative flat-file corpus; no source artifact changes require reversal.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
