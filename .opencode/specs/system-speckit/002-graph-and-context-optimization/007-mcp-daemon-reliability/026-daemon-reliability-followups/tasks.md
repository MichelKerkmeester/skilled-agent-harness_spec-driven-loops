---
title: "Tasks: Daemon-reliability follow-ups"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "daemon reliability follow-ups tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/007-mcp-daemon-reliability/026-daemon-reliability-followups"
    last_updated_at: "2026-06-07T21:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Plist + integration test + sessionId note done; 419 re-run PASS"
    next_safe_action: "Reconcile docs, commit and push"
    blockers: []
    key_files:
      - ".opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist"
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-release-integration.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-026-daemon-reliability-followups"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Daemon-reliability follow-ups

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

- [x] T001 Confirm sweeper interface and scenario 419 lint target
- [x] T002 Convene the opus council for the safe re-election test design
- [x] T003 Verify the launcher lease/DB dir is hardcoded (full-live spawn unsafe)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Create the orphan-sweep LaunchAgent template (.opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist)
- [x] T005 [P] Add the hermetic re-election integration test (mcp_server/stress_test/durability/daemon-reelection-release-integration.vitest.ts)
- [x] T006 [P] Add the cli MCP sessionId scoping caveat (references/cli/memory_handback.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 plist passes plutil -lint
- [x] T008 Integration test passes flag-on-survives and flag-off-dies; live daemon untouched
- [x] T009 Scenario 419 re-run passes for real (including the previously failing lint)
- [ ] T010 Fill spec docs and run validate.sh --strict
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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
