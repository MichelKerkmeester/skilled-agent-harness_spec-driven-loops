---
title: "Tasks: Fence the enrichment scheduler and startup scan in fatalShutdown before closeDb"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "enrichment scan shutdown fence tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/006-operator-tooling/011-enrichment-and-scan-shutdown-fence"
    last_updated_at: "2026-06-15T08:00:00Z"
    last_updated_by: "main-agent"
    recent_action: "Authored task breakdown"
    next_safe_action: "Validate + commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "011-enrichment-and-scan-shutdown-fence"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Fence the enrichment scheduler and startup scan in fatalShutdown before closeDb

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

- [x] T001 Confirm F-008/F-012 + the fileWatcher/ingestWorker fence precedent (`context-server.ts:1626-1646`)
- [x] T002 Scaffold the Level 3 spec folder
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 `enrichmentShuttingDown` flag + exported `shutdownBackgroundEnrichment()` (`handlers/memory-save.ts`)
- [x] T004 Bail points in `run` (before requireDb + after the embed await) + re-arm guard + schedule guard (`handlers/memory-save.ts`)
- [x] T005 Call the enrichment fence in fatalShutdown's sync block; break the scan loop on `shuttingDown`; track `startupScanPromise`; await it before `closeDb` (`context-server.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 `tsc --noEmit` 0 errors; `npm run build` regenerated dist (fences present)
- [x] T007 Tests: enrichment 14/14; lifecycle-shutdown 4/4; shutdown-hooks 4/4; real-shutdown daemon-reelection 4/4
- [ ] T008 Reconcile metadata; `validate.sh --strict`; commit
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Shutdown + enrichment tests green
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
