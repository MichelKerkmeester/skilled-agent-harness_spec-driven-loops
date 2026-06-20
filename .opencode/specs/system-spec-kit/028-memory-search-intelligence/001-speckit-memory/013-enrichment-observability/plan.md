---
title: "Implementation Plan: Enrichment Observability - read-side gauges (028/001 impl)"
description: "Approach + sequencing for the decoupled enrichment-backlog gauges: pending/failed shipped at e1c6a3c793, gauge-lag (oldest-pending age) now extends the same health backlog query with no schema migration and no shared-infra dependency."
trigger_phrases:
  - "enrichment observability plan"
  - "gauge lag implementation plan"
  - "backlog age gauge approach"
  - "memory health gauge sequencing"
  - "decoupled enrichment gauge"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/013-enrichment-observability"
    last_updated_at: "2026-06-19T08:41:16Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Implemented gauge-lag query extension"
    next_safe_action: "Run packet validation and hand back verification evidence"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-013-enrichment-observability"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Enrichment Observability - read-side gauges

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node), Spec-Kit Memory MCP server |
| **Framework** | better-sqlite3 over `memory_index`, MCP handler layer |
| **Storage** | SQLite (`memory_index.post_insert_enrichment_status`, `created_at`) - no migration |
| **Testing** | vitest (handler-scoped unit test alongside the changed handler) |

### Overview
Two read-side gauges over the background post-insert enrichment backlog. `gauge-pending-failed` already shipped - the pending/failed distribution is computed from the existing health backlog query and folded into `getBackgroundEnrichmentStats`. `gauge-lag` shipped at b18c077311: extends that same backlog query to read the oldest-pending `created_at` and derive an age/lag gauge. No new background state, no schema migration, no dependency on the C4-C consolidation cursor - the research is explicit that lag is decoupled and rides the existing columns.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (`spec.md`)
- [x] Success criteria measurable (`spec.md` §5)
- [x] Dependencies identified - `created_at` column CONFIRMED present, no schema migration

### Definition of Done
- [x] gauge-lag computes oldest-pending age from existing columns and surfaces in the health block
- [x] Focused handler test passes (known-age fixture + empty-backlog neutral case)
- [x] Typecheck green, pending/failed gauges unchanged
- [x] `validate.sh --strict` on this packet passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-side observability extension. The health handler already runs one grouped query over the non-complete backlog [CONFIRMED: `handlers/memory-crud-health.ts:904-907`], lag is an additive aggregate on the same table, no new query plan class.

### Key Components
- **`memory-crud-health.ts:902-913`**: owns the at-rest backlog observability block. The pending/failed distribution is built here and merged into `getBackgroundEnrichmentStats`. gauge-lag extends this block to also pull `MIN(created_at)` over the non-complete rows and derive an age.
- **`memory-save.ts:2954-2972` (`getBackgroundEnrichmentStats`)**: the aggregator that returns the scheduler counters + the at-rest distribution. Optionally threads a lag field for parity with pending/failed.
- **`vector-index-schema.ts`**: source of the `post_insert_enrichment_status` column (`:1884-1885`) and `created_at` (`:368`) - read-only here.

### Data Flow
Health request → backlog query over `memory_index WHERE post_insert_enrichment_status != 'complete'` → (a) GROUP BY status → pending/failed counts (shipped), (b) `MIN(created_at)` → oldest-pending age → lag gauge (new) → merged into the `backgroundEnrichment` health block.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is an additive observability change touching a public health response field - inventory the read-side consumers so the new lag field does not collide with the existing pending/failed contract.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `handlers/memory-crud-health.ts:902-913` | Builds the at-rest enrichment backlog block (pending/failed) | Update - add oldest-pending age | `rg -n "backgroundEnrichment\|enrichmentPendingByStatus" handlers/` |
| `handlers/memory-save.ts:2954-2972` (`getBackgroundEnrichmentStats`) | Aggregates scheduler counters + distribution | Update (optional) - thread lag field, or leave the aggregator untouched and compute lag in the health handler | `rg -n "getBackgroundEnrichmentStats" handlers/` |
| Health-response consumers / tests | Observe the `backgroundEnrichment` block | Unchanged for pending/failed, assert the new lag field | `rg -n "backgroundEnrichment\|pendingByStatus" . --glob '*.ts'` |

Required inventories:
- Consumers of the changed symbol: `rg -n 'getBackgroundEnrichmentStats|backgroundEnrichment|post_insert_enrichment_status' .opencode/skills/system-spec-kit/mcp_server --glob '*.ts'`.
- Matrix axes: backlog states × (some pending / none pending) × (column present / absent).
- Algorithm invariant: lag = age of the oldest row whose `post_insert_enrichment_status != 'complete'`, with zero such rows lag is neutral (0 / null), never an error.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: gauge-pending-failed (DONE - `e1c6a3c793`)
- [x] Read-side pending/failed distribution computed from the backlog query
- [x] Folded into `getBackgroundEnrichmentStats` (`pending`, `failed` fields)
- [x] Catch-block leaves the distribution empty on a schema edge

### Phase 2: gauge-lag (DONE)
- [x] Read the seam: `memory-crud-health.ts` + `getBackgroundEnrichmentStats`
- [x] Extend the backlog query with `MIN(created_at)` over non-complete rows, derive oldest-pending age
- [x] Surface both `oldestPendingAt` and `oldestPendingAgeMs` in the `backgroundEnrichment` block
- [x] Preserve the existing neutral-degrade behavior

### Phase 3: Verification
- [x] Handler unit test: known-age pending fixture → expected lag, empty backlog → neutral
- [x] Typecheck, confirm pending/failed gauges unchanged
- [x] `validate.sh --strict` on this packet
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `memory-crud-health` lag computation: known-age fixture, empty backlog neutral, column-absent neutral | vitest |
| Regression | pending/failed gauge values unchanged from the `e1c6a3c793` baseline | vitest (existing health test) |
| Build | typecheck + dist build of the MCP server | `tsc` / package build |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `memory_index.created_at` column | Internal (schema) | Green - CONFIRMED present (`lib/search/vector-index-schema.ts:368`) | gauge-lag has no age basis, degrade to neutral |
| `memory_index.post_insert_enrichment_status` column | Internal (schema) | Green - CONFIRMED present (`lib/search/vector-index-schema.ts:1884-1885`) | Backlog query empty, lag neutral (existing catch-block path) |
| gauge-pending-failed backlog query (`e1c6a3c793`) | Internal (this packet) | Green - shipped | lag extends this exact query, sequences directly after |
| C4-C consolidation cursor / Wave-1 shared infra | Internal | N/A - **decoupled** | No dependency, lag rides existing columns only [`../../research/roadmap.md:295`, `../../research/synthesis/01-go-candidates.md:32`] |

**Sequencing**: gauge-pending-failed → gauge-lag (lag extends the same backlog query the pending/failed gauges introduced, no other ordering constraint). **Gate**: needs-benchmark only (structural-inference effort, no measured delta) - NOT schema-migration, NOT shared-infra-dep. Ships for correctness/reversibility per the 028 broadening doctrine.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: lag arithmetic skews on legacy timestamp formats, the new field breaks a health-response consumer, or build/tests regress.
- **Procedure**: branch-only, additive read-side field - revert the single `memory-crud-health.ts` hunk (and the optional `memory-save.ts` field). The pending/failed gauges (`e1c6a3c793`) are untouched and remain live, no schema or state to undo.
<!-- /ANCHOR:rollback -->
