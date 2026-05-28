---
title: "Tasks: Non-destructive mcp-server build (RC-4)"
description: "Task tracker for removing the destructive mcp_server prebuild clean and verifying the build stays complete, non-destructive, and incremental."
trigger_phrases:
  - "non-destructive mcp build tasks"
  - "prebuild clean removal tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/031-nondestructive-mcp-server-build"
    last_updated_at: "2026-05-28T20:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All tasks complete: build change + verification (dist-freshness 18/18, orphan 5/6)"
    next_safe_action: "None; F4 complete pending strict validate + commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/package.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000312"
      session_id: "031-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Non-destructive mcp-server build (RC-4)

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Confirm only mcp_server has the destructive prebuild clean (`mcp_server/package.json` vs shared/scripts)
- [x] T002 Confirm composite tsc + `dist/tsconfig.tsbuildinfo` (incrementality source)
- [x] T003 Confirm `dist.next` staging fights composite outDir → in-place incremental is the right fix
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Remove `prebuild` auto-clean from `mcp_server/package.json`
- [x] T005 Add `rebuild` script (`clean && build`) for explicit full rebuilds
- [x] T006 Keep `clean` available for manual full wipe
- [x] T007 Confirm `finalize-dist.mjs` artifact asserts still gate completeness (unchanged)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 `npm run build` leaves dist intact + complete; ~1s incremental (tsbuildinfo reused)
- [x] T009 `dist-freshness` 18/18; orphan detection 5/6 (1 pre-existing skip) — no regression
- [x] T010 Update spec/plan/tasks/checklist/implementation-summary
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Build verified non-destructive + complete + incremental; regression tests pass
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Root cause**: See `../030-mcp-daemon-reliability/research/research.md` (RC-4)
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
