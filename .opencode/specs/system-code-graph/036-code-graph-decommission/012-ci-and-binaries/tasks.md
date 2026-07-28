---
title: "Tasks: Phase 12: ci-and-binaries"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission/012-ci-and-binaries"
    last_updated_at: "2026-07-28T04:51:16Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-012-ci-and-binaries"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 12: ci-and-binaries

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Confirm phases 003-011 removed every caller so deleting the launcher breaks nothing — evidence: `scratch/closeout-facts.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Delete launcher, CLI shim, and six launcher vitest suites (concurrent session)
- [x] T003 Strip the shared `launcher-ipc-bridge.cjs` code-graph branch (never deleted; serves mk-spec-memory + mk-skill-advisor)
- [x] T004 Remove smoke matrices (commit `fef098b6b2`)
- [x] T005 Clear gitignore patterns for the subsystem's database and build artifacts
- [x] T006 Remove `build_pkg "code-graph"` step from `deploy-mcp.sh`
- [x] T007 Delete the CI isolation job (commit `1e548b0ed5`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Confirm both surviving daemons (mk-spec-memory, mk-skill-advisor) start and serve after the shared bridge strip — evidence: `scratch/closeout-facts.md`
- [x] T009 Confirm remaining CI is green with the isolation job absent — evidence: `scratch/closeout-facts.md`
- [x] T010 Confirm no executable targeting the subsystem remains in the bin directory — evidence: `scratch/closeout-facts.md`
- [x] T011 Confirm no gitignore orphan pattern points inside the removed folder — evidence: `scratch/closeout-facts.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (daemon start + CI green + sweep)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
