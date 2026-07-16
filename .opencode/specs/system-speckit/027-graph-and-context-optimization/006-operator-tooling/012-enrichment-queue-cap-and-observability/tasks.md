---
title: "Tasks: Cap the enrichment queue and expose scheduler health"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "enrichment queue cap tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/006-operator-tooling/012-enrichment-queue-cap-and-observability"
    last_updated_at: "2026-06-15T10:15:00Z"
    last_updated_by: "main-agent"
    recent_action: "Authored task breakdown"
    next_safe_action: "Validate + commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "012-enrichment-queue-cap-and-observability"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Cap the enrichment queue and expose scheduler health

<!-- SPECKIT_LEVEL: 3 -->

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

- [x] T001 Characterize the 010 P2 backlog (F-007/F-009/F-010/F-011) + 2 minors; capture tsc baseline; scaffold
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Queue cap (`MAX_QUEUED_ENRICHMENTS`) + drop counter; macrotask-boundary comment (`handlers/memory-save.ts`)
- [x] T003 Failure aggregation (`failureTotal`/`lastError` + rate-limited warn with suppressed-count summary) (`handlers/memory-save.ts`)
- [x] T004 `getBackgroundEnrichmentStats()` export (`handlers/memory-save.ts`)
- [x] T005 `backgroundEnrichment` block (stats + `pendingByStatus`) in both health response sites + recovery hint (`handlers/memory-crud-health.ts`)
- [x] T006 `shuttingDown` guard at scan start, before recoverPendingFiles (`context-server.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 `tsc --noEmit` 0; enrichment + async-scan + memory_health-edge 24/24; `npm run build` regenerated dist
- [ ] T008 Reconcile metadata; `validate.sh --strict`; commit
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] tsc 0; regression green; dist rebuilt
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
