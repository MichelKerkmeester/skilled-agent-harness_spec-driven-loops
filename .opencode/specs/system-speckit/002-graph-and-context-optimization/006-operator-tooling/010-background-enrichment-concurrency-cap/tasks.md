---
title: "Tasks: Bound the background-enrichment scheduler so a save or startup-scan burst cannot starve the daemon event loop"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "background enrichment cap tasks"
  - "enrichment scheduler tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/006-operator-tooling/010-background-enrichment-concurrency-cap"
    last_updated_at: "2026-06-14T20:50:00Z"
    last_updated_by: "main-agent"
    recent_action: "Authored task breakdown"
    next_safe_action: "Run the deep-review (T008)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "010-background-enrichment-concurrency-cap"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Bound the background-enrichment scheduler so a save or startup-scan burst cannot starve the daemon event loop

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

- [x] T001 Confirm the broken-cap defect in `handlers/memory-save.ts` (direct read + council + DB corroboration)
- [x] T002 Capture clean `tsc --noEmit` baseline (0 errors)
- [x] T003 Scaffold the Level 3 spec folder
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the `start(task)` helper (increment then `setImmediate`); remove the in-callback increment (`handlers/memory-save.ts`)
- [x] T005 Re-arm dequeued work via `start` in the `finally` instead of a synchronous call (`handlers/memory-save.ts`)
- [x] T006 Add a periodic `setImmediate` yield to the `startupScan` loop (`context-server.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 `tsc --noEmit` 0 errors (delta vs baseline); enrichment + async-scan regression green; `npm run build` regenerated dist
- [x] T008 Ran the deep-review (opus-4.8 via claude2) — converged iter 3/10, PASS w/ advisories, 0 P0/P1, 5 P2 deferred; report at `review/review-report.md`
- [x] T009 Reconcile completion metadata; `validate.sh --strict`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Deep-review verdict addressed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
