---
title: "Tasks: Enrichment Observability — read-side gauges (028/001 impl)"
description: "Task Format: T### [P?] Description (file path). gauge-pending-failed pre-checked done at e1c6a3c793; gauge-lag pending."
trigger_phrases:
  - "enrichment observability tasks"
  - "gauge lag tasks"
  - "backlog age gauge breakdown"
  - "memory health gauge tasks"
  - "enrichment gauge checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/013-013-enrichment-observability"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author task breakdown for enrichment-observability gauges"
    next_safe_action: "Execute T004: extend backlog query with MIN(created_at)"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-013-enrichment-observability"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
# Tasks: Enrichment Observability — read-side gauges

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

gauge-pending-failed (DONE — shipped `e1c6a3c793`): the read-side backlog query + aggregator this sub-phase extends already exist.

- [x] T001 Compute the at-rest backlog distribution from the non-complete rows query (`handlers/memory-crud-health.ts:904-907`) — shipped `e1c6a3c793`
- [x] T002 Fold pending/failed into `getBackgroundEnrichmentStats` (`handlers/memory-save.ts:2969-2970`) — shipped `e1c6a3c793`
- [x] T003 Neutral-degrade on a schema edge via the catch-block (`handlers/memory-crud-health.ts:908-910`) — shipped `e1c6a3c793`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

gauge-lag (PENDING — needs-benchmark gate; no schema migration, no shared-infra dep).

- [ ] T004 Read the seam: backlog query + `getBackgroundEnrichmentStats` (`handlers/memory-crud-health.ts:902-913`; `handlers/memory-save.ts:2954-2972`)
- [ ] T005 Extend the backlog query with `MIN(created_at)` over rows WHERE `post_insert_enrichment_status != 'complete'` (`handlers/memory-crud-health.ts:904-907`)
- [ ] T006 Derive oldest-pending age (lag) and merge it into the `backgroundEnrichment` health block (`handlers/memory-crud-health.ts:912-913`)
- [ ] T007 Preserve the catch-block neutral-degrade (lag → 0/null when the column is absent or the query throws) (`handlers/memory-crud-health.ts:908-910`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 [P] Handler unit test: known-age pending fixture → expected lag; empty/all-complete backlog → neutral zero/null
- [ ] T009 Confirm pending/failed gauge values byte-unchanged from the `e1c6a3c793` baseline; typecheck + build green
- [ ] T010 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` passes
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All Phase 2 + Phase 3 tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] gauge-lag surfaces oldest-pending age from existing columns; manual + unit verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Shipped record (pending/failed)**: `../../../030-memory-search-intelligence-impl/spec.md` §14 (`e1c6a3c793`)
<!-- /ANCHOR:cross-refs -->
