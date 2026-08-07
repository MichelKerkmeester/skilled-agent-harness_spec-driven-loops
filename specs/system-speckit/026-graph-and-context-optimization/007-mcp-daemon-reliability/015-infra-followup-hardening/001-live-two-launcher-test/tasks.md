---
title: "Tasks: Live F2 clean-close reap coverage"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "live reap test tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening/001-live-two-launcher-test"
    last_updated_at: "2026-05-30T22:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored tasks to manifest scaffold"
    next_safe_action: "Gate then commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/tests/launcher-clean-close-reap.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003603"
      session_id: "036-001-tasks"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Tasks: Live F2 clean-close reap coverage

<!-- SPECKIT_LEVEL: 2 -->
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

- [x] T001 Map reap seams (reapLeaseChildBeforeRespawn deps, marker via MEMORY_DB_PATH, bridge probe) and confirm launcher disk == HEAD
- [x] T002 Choose deterministic reap-function coverage over flaky launcher-process spawning
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Export reapLeaseChildBeforeRespawn + uncleanMarkerPresent from mk-spec-memory-launcher.cjs (export-only)
- [x] T004 Write launcher-clean-close-reap.vitest.ts: marker-path case + already-dead + graceful-clean + graceful-dirty + ignore-SIGTERM branches
- [x] T005 Add unknown-eperm liveness guard (skip-with-reason) + bounded SIGKILL-case timeout
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Run the suite green (5/5); confirm SIGKILL-escalation case is bounded/deterministic
- [x] T007 node --check launcher; comment-hygiene 0 violations; strict-validate the packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All four reap branches asserted + green
- [x] Production change is export-only (no logic edit)
- [x] Docs strict-validate exit 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Barrier under test**: `.opencode/bin/mk-spec-memory-launcher.cjs` reapLeaseChildBeforeRespawn (shipped in 032/001)
<!-- /ANCHOR:cross-refs -->
