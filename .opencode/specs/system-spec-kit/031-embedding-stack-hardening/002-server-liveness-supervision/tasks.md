---
title: "Tasks: Server liveness + supervision hardening"
description: "Implementation task tracker for wedged-but-loading detection, inference-liveness health fields with a bounded dispose-drain, a crash-loop give-up cooldown, and ENOSPC-resilient pid/lease/lock writes."
trigger_phrases:
  - "server liveness supervision tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/031-embedding-stack-hardening/002-server-liveness-supervision"
    last_updated_at: "2026-05-29T14:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored Level-1 task tracker for server liveness + supervision hardening"
    next_safe_action: "Implement phase 002"
    blockers: []
    key_files:
      - ".opencode/bin/lib/model-server-supervision.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003123"
      session_id: "031-002-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Server liveness + supervision hardening

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
- [ ] T001 Confirm predecessor handoff criteria from 001-selector-and-shared-socket
- [ ] T002 Inventory `healthPayload`, `probeModelServer`, `prepareModelServerDemandTarget`, `inFlightRawRuns`, pid/lease/lock writers
- [ ] T003 [P] Identify fault-injection tests (age window, cooldown, ENOSPC) to add
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] T004 Add `loadStartedAt` + bound the loading-age so a stuck cold-load is reaped (.opencode/bin/hf-model-server.cjs, .opencode/bin/lib/launcher-ipc-bridge.cjs) [REQ-001]
- [ ] T005 Add `lastSuccessfulEmbedAt` + `inFlightRawRuns.size`; bound the dispose-drain down from 120s (.opencode/bin/hf-model-server.cjs) [REQ-002, REQ-003]
- [ ] T006 Persist the crash-loop give-up cooldown; return 503 + reason during cooldown (.opencode/bin/lib/model-server-supervision.cjs) [REQ-004]
- [ ] T007 Make pid/lease/lock writes ENOSPC/EDQUOT/EROFS-resilient (.opencode/bin/lib/model-server-supervision.cjs, .opencode/bin/mk-spec-memory-launcher.cjs) [REQ-005]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T008 Confirm the loading-age bound tolerates a first-embed download [REQ-006]
- [ ] T009 Confirm the cooldown clears on recovery [REQ-007]
- [ ] T099 Run strict spec validation for this phase folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] All P0 tasks complete
- [ ] No `[B]` blocked tasks remaining
- [ ] Focused phase tests/static checks are green; F1/F3/004 + cross-launcher suites stay green; successor handoff (003) documented
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent packet**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
