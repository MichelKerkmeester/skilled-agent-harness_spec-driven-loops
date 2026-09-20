---
title: "Feature Specification: Measured Composition and Retrieval Facets"
description: "Additive compositionDNA records and page-shape retrieval facets derived from existing measured style evidence."
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
# Feature Specification: Measured Composition and Retrieval Facets

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-22 |
| **Branch** | Orchestrator-owned isolated worktree |
| **Parent Spec** | `../spec.md` |
| **Phase** | 5 |
| **Research Basis** | `../../../001-research/004-hallmark-design-skill-research/research/lineages/sol-codex/research.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shipped style database can query text, generic facets, token axes, capabilities, and vectors, but it cannot describe or query the measured page shape already present in each style's canonical record, token axes, and `DESIGN.md` headings.

### Purpose
Store a compact, independently designed `compositionDNA` projection for each style and expose dedicated page-shape filter and ranking facets. The projection stays evidence-derived, deterministic, clean-room, and additive to the existing database and request contracts.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A structured `composition_dna_json` style-record column with a versioned measured projection.
- A normalized `style_composition_facets` table for page-shape lookup.
- Deterministic derivation from `canonical.designSystem.layout`, `DESIGN.md` headings, and indexed token-axis counts.
- Region sequence, layout axes, token emphasis, navigation shape, footer shape, evidence inputs, and evidence confidence.
- `requiredCompositionFacets` for eligibility filtering and `compositionFacets` for structured ranking.
- Schema migration, deterministic indexing, facet retrieval, and backward-compatibility tests.

### Out of Scope
- Hallmark source content, identifiers, theme names, presets, or authored page-shape labels.
- New extraction passes, browser measurement, vector-provider changes, or persistent-cutover changes.
- Changes to existing card DTOs, legacy query keys, or default ranking behavior.
- Parent-packet edits or generated `description.json` and `graph-metadata.json` files.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/styles/lib/database/schema.mjs` | Modify | Add the composition record column, facet table, index, and compatible migration |
| `.opencode/skills/sk-design/styles/lib/database/indexer.mjs` | Modify | Derive, persist, and backfill deterministic composition data |
| `.opencode/skills/sk-design/styles/lib/database/retrieval.mjs` | Modify | Filter and rank through dedicated composition facets |
| `.opencode/skills/sk-design/styles/tests/database/{schema,indexer,retrieval}.test.mjs` | Modify | Prove migration, derivation, retrieval, and compatibility |
| `005-measured-composition-and-retrieval-facets/*.md` | Add | Record Level 2 scope, plan, tasks, checks, and evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Persist structured measured composition data | Every newly indexed style has deterministic versioned `compositionDNA` JSON and normalized composition facets |
| REQ-002 | Preserve shipped records and requests | A v2 record retains all legacy fields, omitted composition keys retain the legacy fingerprint, and existing query output stays unchanged |
| REQ-003 | Keep the implementation clean-room | No Hallmark prose, identifiers, names, token values, or presets enter code, fixtures, or stored records |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Filter by page shape | `requiredCompositionFacets` excludes styles lacking every requested composition facet |
| REQ-005 | Rank by page shape | `compositionFacets` adds deterministic structured-lane weight without changing default ranking |
| REQ-006 | Backfill migrated databases | Records with the default empty projection or no composition facets are re-verified during the next explicit indexing run |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The database suite passes with all pre-existing and new tests green.
- **SC-002**: Exact legacy query fingerprint `sha256:86e7aa340ebede8e807767155d3f40f339a2881318ddd2f1278065a7386b9257` remains stable.
- **SC-003**: Repeated indexing emits byte-identical `composition_dna_json` for unchanged evidence.
- **SC-004**: Required and preferred composition facets filter and rank independently from legacy facets.
- **SC-005**: Strict packet validation has no failures other than orchestrator-owned generated metadata integrity.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Documentation headings are not DOM regions | Page-shape claims could overstate evidence | Label headings as documented regions and preserve explicit evidence inputs |
| Risk | Schema additions invalidate old cursors | Existing callers could fail after upgrade | Add fingerprint keys only when callers explicitly provide them |
| Risk | Migrated rows remain empty | Composition queries miss existing styles | Force verification for empty projections or empty facet sets |
| Dependency | Existing style artifacts | Derivation needs canonical layout, headings, or token axes | Emit a partial-confidence projection when evidence is sparse |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Composition filtering uses an indexed normalized table.
- **NFR-P02**: Existing requests perform no composition scoring unless a composition query key is present.

### Security
- **NFR-S01**: Facet values use the existing bounded normalization path.
- **NFR-S02**: No new filesystem or external-network input is introduced.

### Reliability
- **NFR-R01**: Canonical serialization keeps composition records byte-deterministic.
- **NFR-R02**: Schema migration supplies a non-breaking `{}` default for existing records.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty layout: Store a null descriptor and partial confidence.
- No headings: Store an empty region sequence and zero region count.
- Tied token counts: Select the primary axis by raw lexical order.

### Error Scenarios
- Unknown composition facet: Return no eligible cards without affecting other queries.
- Migrated empty record: Preserve the record and backfill on the next explicit index operation.
- Explicit empty composition arrays: Treat them as new request keys while preserving omitted-key fingerprints.

### State Transitions
- Existing schema v2: Add the column and facet table without rewriting legacy values or changing generation identity.
- First post-migration index: Re-verify empty composition rows and persist the derived projection.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Three runtime modules and three focused test files |
| Risk | 10/25 | Shipped schema and request fingerprint compatibility |
| Research | 6/20 | Two syntheses plus live database behavior |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The bounded derivation and query contract are fixed for this phase.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
