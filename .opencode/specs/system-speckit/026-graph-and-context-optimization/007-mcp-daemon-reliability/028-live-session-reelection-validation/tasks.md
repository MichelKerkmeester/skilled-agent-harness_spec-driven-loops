---
title: "Tasks: Live two-session daemon re-election adoption test"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "live reelection validation tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/028-live-session-reelection-validation"
    last_updated_at: "2026-06-08T05:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Live test, reap fix, docs reconciled, suites green"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-028-live-session-reelection-validation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Live two-session daemon re-election adoption test

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

- [x] T001 Prove the isolated single-launcher harness (probe spawns a real launcher, gets a working MCP round-trip)
- [x] T002 Build the two-session live test and reproduce the finding (reelect-live-test, reelect-doublewriter)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Convene the council (2 claude2 opus + 1 cli-codex) to verify the finding and choose the fix
- [x] T004 Implement reap-before-respawn on the stale-reclaim branch (.opencode/bin/mk-spec-memory-launcher.cjs)
- [x] T005 [P] Add the fresh-session-after-dispose case + the single-writer lsof check (daemon-reelection-adoption-live.vitest.ts)
- [x] T006 [P] Reconcile the changelog, RELEASE_NOTES, and ENV_REFERENCE to the proven behavior
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Durability suite green (18/18) and launcher-lease suite green (11/11)
- [x] T008 Standalone repro confirms the orphan reaped within 1s (single writer)
- [x] T009 Fill spec docs and run validate.sh --strict
- [x] T010 Commit, push
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
