---
title: "Tasks: Add launcher supervision for the hf model server"
description: "Implementation task tracker for Lazy-spawn the hf model server as a launcher-supervised sibling child with a second crash-loop guard, generalized RSS watchdog, modelServerPid lease field, health probe, and respawn lock."
trigger_phrases:
  - "launcher supervision tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/004-launcher-supervision"
    last_updated_at: "2026-05-29T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored deferred tasks for launcher-owned lazy model-server supervision"
    next_safe_action: "Implement after hf-local can call the model server"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000494"
      session_id: "029-004-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Add launcher supervision for the hf model server

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

- [x] T001 Confirm predecessor handoff criteria from 003-hf-local-http-client
- [x] T002 Inventory affected files and symbols before implementation
- [x] T003 [P] Identify focused tests to add or migrate
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add launchModelServer() with lazy sibling-child spawn [REQ-001]
- [x] T005 Instantiate second crash-loop guard and relaunch timer [REQ-002]
- [x] T006 Generalize RSS watchdog to accept pid and model-server env ceilings [REQ-003]
- [x] T007 Add modelServerPid to lease and teardown/reap paths [REQ-004]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T08 Add probeModelServer and socket-keyed respawn lock [REQ-005]
- [x] T09 Test lazy spawn, relaunch/give-up, RSS breach, signal reap, loading-alive probe [REQ-006]
- [x] T099 Run strict spec validation for this phase folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 tasks complete
- [x] No `[B]` blocked tasks remaining
- [x] Focused phase tests/static checks are green and predecessor/successor handoff is documented
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent packet**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

