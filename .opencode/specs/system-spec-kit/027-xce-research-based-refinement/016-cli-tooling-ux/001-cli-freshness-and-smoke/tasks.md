---
title: "Tasks: CLI Freshness Gate Fix and Offline Smoke [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "001-cli-freshness-and-smoke tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/016-cli-tooling-ux/001-cli-freshness-and-smoke"
    last_updated_at: "2026-06-10T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded Level-1 task list (planned, unchecked)"
    next_safe_action: "Begin Phase 1 reproduction tasks"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-001-cli-freshness-and-smoke"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: CLI Freshness Gate Fix and Offline Smoke

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

- [ ] T001 Reproduce the mtime-only stale-`69` false-positive on a content-clean dist (`.opencode/bin/spec-memory.cjs:24-42`).
- [ ] T002 Confirm `SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1` yields `list-tools count=37` (gate-bug, not coverage-bug).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Implement a content-hash freshness gate (or build-touches-dist invariant) in `.opencode/bin/spec-memory.cjs`.
- [ ] T004 [P] Classify stale-dist into an actionable plugin status in `mk-spec-memory-bridge.mjs:266-280`; keep stderr sanitized.
- [ ] T005 [P] Add the unified offline smoke command/script for 37/8/9 list-tools counts + stale-dist health (no daemon/build/scan), reusing `cli-list-tools-parity.md:32-56`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Verify a plain rebuild restores freshness and an mtime-only touch no longer trips the gate.
- [ ] T007 Verify the smoke run reports 37/8/9 + stale-dist verdict with no daemon/build/scan.
- [ ] T008 Verify plugin status shows an actionable stale-dist state with stderr still sanitized.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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
