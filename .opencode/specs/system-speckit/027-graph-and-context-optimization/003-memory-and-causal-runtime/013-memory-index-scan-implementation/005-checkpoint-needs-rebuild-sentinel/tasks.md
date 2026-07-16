---
title: "Tasks: checkpoint-v2 .needs-rebuild Sentinel"
description: "Task Format: T### [P?] Description (file path). Ordered so each step is verifiable before the next; the implementer reads current code at each site first."
trigger_phrases:
  - "checkpoint needs-rebuild sentinel"
  - "post-restore derived rebuild failure"
  - "boot derived rebuild repair"
  - "checkpoint sentinel tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/005-checkpoint-needs-rebuild-sentinel"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored sentinel task breakdown from follow-up research"
    next_safe_action: "Start T001 - read current checkpoints.ts restore + rebuild code"
    blockers: []
    key_files:
      - "mcp_server/lib/storage/checkpoints.ts"
      - "mcp_server/context-server.ts"
      - "mcp_server/handlers/memory-index.ts"
      - "mcp_server/lib/search/vector-index-store.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "checkpoint-sentinel-packet-setup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: checkpoint-v2 .needs-rebuild Sentinel

<!-- SPECKIT_LEVEL: 3 -->
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

- [ ] T001 Read current restore + rebuild code and confirm real line ranges and the rebuild-step set (mcp_server/lib/storage/checkpoints.ts)
- [ ] T002 Confirm packet 004's edit region so the sentinel check lands in a distinct, additive region (mcp_server/handlers/memory-index.ts)
- [ ] T003 [P] Branch off; confirm no `dist/` rebuild, no daemon restart, no live-DB access (repo)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Make `runPostRestoreRebuilds()` return `{completed, failed, skipped}` and export ONE shared derived-rebuild helper (mcp_server/lib/storage/checkpoints.ts)
- [ ] T005 Add `.needs-rebuild` path/write/clear helpers next to the restore-journal helpers (mcp_server/lib/storage/checkpoints.ts)
- [ ] T006 Write the sentinel from `restoreCheckpointV2()` on a failed/skipped summary; keep the restore result success (mcp_server/lib/storage/checkpoints.ts)
- [ ] T007 Add the boot + pre-scan sentinel check; run the bounded helper; clear on success (mcp_server/context-server.ts)
- [ ] T008 Add the scan-lease sentinel check + repair count, additive and in a distinct region (mcp_server/handlers/memory-index.ts)
- [ ] T009 [P] Preserve/create rebuild-needed state in swap-done journal recovery (mcp_server/lib/search/vector-index-store.ts)
- [ ] T010 Keep the boot FTS `.unclean-shutdown` auto-heal contract unchanged; ensure the sentinel path is a separate trigger (mcp_server/context-server.ts)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Test: forced rebuild failure writes `.needs-rebuild` and the restore still returns success (mcp_server tests)
- [ ] T012 Test: a successful repair clears the sentinel; a failed repair retains it and never blocks boot/scan (mcp_server tests)
- [ ] T013 Test: the scan reports repair counts; swap-done recovery without evidence preserves/creates rebuild-needed state (mcp_server tests)
- [ ] T014 Run scoped typecheck of touched TS and `validate.sh --strict` for this packet (repo)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] New + affected vitest suites pass and `validate.sh --strict` passes for this packet
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
