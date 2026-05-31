---
title: "Tasks: Substrate stress-harness hardening [template:level_3/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "substrate harness tasks"
  - "harness hardening tasks"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/016-substrate-harness-hardening"
    last_updated_at: "2026-05-31T12:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All tasks completed; suite green"
    next_safe_action: "Optional ADR-003 temp DB-dir lever (deferred)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-038"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Substrate stress-harness hardening

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

- [x] T001 Confirm fix sites + reusable helpers (`run-substrate-stress-harness.mjs`, `mk-code-index-launcher.cjs`)
- [x] T002 Create the 038 packet and Level 3 docs
- [x] T003 [P] Scaffold the new vitest file (`substrate-harness-hardening.vitest.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Maintainer-mode + INDEX_* suppression in the code-index child env (`run-substrate-stress-harness.mjs`)
- [x] T005 Run-id-stamped TSV + non-clobbering EPERM sidecar (`run-substrate-stress-harness.mjs`)
- [x] T006 `processStartedAt` cross-platform helper (`run-substrate-stress-harness.mjs`)
- [x] T007 Start-time identity gate in `liveOwnerForService` via `leaseOwnerMatch` (`run-substrate-stress-harness.mjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Identity / TSV / env-suppression vitest cases pass (`substrate-harness-hardening.vitest.ts`)
- [x] T009 Existing live-owner SKIP test still passes (`substrate-runner-harness.vitest.ts`)
- [x] T010 Full `npm run stress` green (24 files / 87 tests); docs + metadata + strict validate
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (full stress suite green)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
