---
title: "Feature Specification: Enrichment Observability - read-side gauges (028/001 impl)"
description: "Decoupled read-side observability for the background post-insert enrichment backlog: pending/failed gauges plus oldest-pending lag, all riding existing enrichment-status columns with no new state and no schema migration."
trigger_phrases:
  - "enrichment observability gauges"
  - "gauge pending failed lag"
  - "background enrichment backlog gauge"
  - "oldest pending enrichment age"
  - "memory health enrichment gauge"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/001-speckit-memory/013-enrichment-observability"
    last_updated_at: "2026-07-04T17:51:05.281Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Implemented gauge-lag health observability"
    next_safe_action: "Run packet validation and hand back verification evidence"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "../research/research.md"
      - "../../research/roadmap.md"
      - "../../research/synthesis/01-go-candidates.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-013-enrichment-observability"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Enrichment Observability - read-side gauges

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/028-xce-research-based-refinement` |
| **Parent Packet** | system-speckit/029-memory-search-intelligence/001-speckit-memory |
| **Subsystem** | Spec-Kit Memory MCP (PRIMARY) |
| **Source research** | `../research/research.md`, `../../research/roadmap.md`, `../../research/synthesis/01-go-candidates.md` |
| **Shipped record** | Wave-0 record |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Memory MCP splits the write path from background post-insert enrichment: a row commits immediately marked enrichment-pending, then an async, concurrency-capped scheduler runs the actual entity/graph enrichment later [CONFIRMED: `handlers/memory-save.ts:2934-2987`, `lib/search/vector-index-schema.ts:1884-1885`, `post_insert_enrichment_status TEXT NOT NULL DEFAULT 'complete'`]. Without read-side gauges over this backlog, a stuck or backed-up scheduler is a silent outage: the operator cannot see how many rows are pending/failed, nor how old the oldest unprocessed row is. The 027-revisit research (Q9 Observability) confirmed the substrate to surface this already exists and is unexposed for the age dimension [CONFIRMED: `../research/cross-packet-027-reconciliation/research.md:62,92,93`].

### Purpose
Expose decoupled read-side observability of the enrichment backlog, pending count, failed count (both shipped) and oldest-pending age (lag, not yet shipped), by reusing existing columns and the existing health query, with no new background state and no schema migration.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope - candidate list

| Candidate | One-line | Seam | Eff | Status |
|-----------|----------|------|-----|--------|
| **gauge-pending-failed** | alias the at-rest pending/failed backlog distribution onto the existing `getBackgroundEnrichmentStats` aggregator (no new state) | `handlers/memory-save.ts:2954-2972`, `handlers/memory-crud-health.ts:902-913` | S | **DONE** (`e1c6a3c793`) |
| **gauge-lag** | oldest-pending age = `MIN(created_at)` over rows WHERE `post_insert_enrichment_status != 'complete'`, surfaced as a backlog-age gauge, **decoupled from C4-C** (the consolidation cursor). It rides the existing status column + `created_at` + the health query | `handlers/memory-crud-health.ts` (extends the existing backlog query) | S | **DONE** |

> Both candidates are read-side only, additive and individually reversible. `gauge-pending-failed` shipped first. `gauge-lag` now extends the same health block. The research is explicit that lag is **decoupled from C4-C**, it does NOT depend on the consolidation cursor / Wave-1 shared infra [CONFIRMED: `../../research/roadmap.md:295`, `../../research/synthesis/01-go-candidates.md:32`, `../research/cross-packet-027-reconciliation/research.md:62`].

### Out of Scope
- The C4-C consolidation cursor + per-item `raw|in_progress|consolidated|failed` state machine (Wave-1/Wave-2, schema work), gauge-lag is explicitly decoupled from it.
- Enrichment retry-budget + dead-letter / terminal `failed` state (Wave-2, `boot enrichment replay`), which *adds* state. This sub-phase only *reads*.
- The `memory_history` valid-time as-of tool (separate Wave-1 candidate, sibling impl sub-phase).
- Any change to the scheduler, the write path or the enrichment work itself, gauges observe, they do not steer.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Modify | Extend the existing backlog query (`:902-913`) to also compute oldest-pending `created_at` and derive a lag/age gauge alongside the pending/failed distribution |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modify (optional) | If lag is surfaced through `getBackgroundEnrichmentStats` (`:2954-2972`), thread the oldest-pending timestamp/age as an additional field |
| Test alongside the changed handler | Create/Modify | Assert lag value from a fixture with known-age pending rows, assert zero/empty when no pending rows |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | gauge-lag computes oldest-pending age from existing columns only | `MIN(created_at)` over `memory_index WHERE post_insert_enrichment_status != 'complete'`, no new column, no schema migration, no new background state [research: `../../research/synthesis/01-go-candidates.md:32`] |
| REQ-002 | gauge-lag is decoupled from C4-C | No reference to / dependency on the consolidation cursor, rides the existing status column + `created_at` + the existing health query [research: `../../research/roadmap.md:295`] |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | gauge-lag degrades gracefully on a schema edge | When the column is absent or the query throws, the gauge returns a neutral value (0 / null) and the existing scheduler counters still surface, mirroring the shipped pending/failed catch-block [CONFIRMED: `handlers/memory-crud-health.ts:908-910`] |
| REQ-004 | gauge-pending/failed remains as-shipped | The pending/failed gauges (`e1c6a3c793`) are unchanged, lag is purely additive to the same health block |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Health output exposes oldest-pending enrichment age (lag) alongside the existing pending/failed counts, computed from `post_insert_enrichment_status` + `created_at` with no schema migration.
- **SC-002**: A fixture with N pending rows of known ages yields the correct lag. An empty/all-complete backlog yields a neutral zero/null gauge.
- **SC-003**: Typecheck, build, the focused handler test and `validate.sh --strict` on this packet pass. The pending/failed gauges are byte-unchanged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `created_at` column on `memory_index` | gauge-lag needs an age basis | Column CONFIRMED present [`lib/search/vector-index-schema.ts:368`, `created_at TEXT DEFAULT CURRENT_TIMESTAMP`, also in the canonical column lists `:102,133,154,165,189`] |
| Risk | Mixed/legacy timestamp formats in `created_at` | Lag arithmetic skewed | Compute age in the query (`MIN`/epoch) and assert against a fixed-age fixture, treat unparseable as neutral |
| Risk | Effort tag is structural inference, never benchmarked | "S" could be optimistic | Research states all effort/leverage are structural inference, not measured [CONFIRMED: `../../research/synthesis/01-go-candidates.md:3`], ship for correctness/reversibility |
| Risk | Misclassifying lag as C4-C-coupled (Wave-1 gating) | Unnecessary deferral | Research is explicit lag is **decoupled** [`../../research/roadmap.md:295`]. The Wave-1 placement in `synthesis/01` is for the *as-of tool*, lag's gate is needs-benchmark only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Implementation surfaces both `oldestPendingAt` and `oldestPendingAgeMs` in the health block, computed in `memory-crud-health.ts` where the backlog query already runs. `getBackgroundEnrichmentStats` remains DB-free.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Subsystem research**: `../research/research.md`
- **Roadmap (authoritative addenda)**: `../../research/roadmap.md`
- **GO candidates**: `../../research/synthesis/01-go-candidates.md`
- **027-revisit detail**: `../research/cross-packet-027-reconciliation/research.md`
<!-- /ANCHOR:related-docs -->
