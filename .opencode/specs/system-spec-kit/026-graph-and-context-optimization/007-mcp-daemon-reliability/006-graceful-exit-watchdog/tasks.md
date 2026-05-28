---
title: "Tasks: Launcher RSS-ceiling watchdog + graceful-exit supervision (F1′)"
description: "Implementation task tracker for the process-tree RSS watchdog, graceful-exit recovery, crash-loop guard, and child-pid lease."
trigger_phrases:
  - "launcher watchdog tasks F1"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/006-graceful-exit-watchdog"
    last_updated_at: "2026-05-28T21:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored F1′ implementation tasks (all pending — spec ready)"
    next_safe_action: "Confirm REQ-008 host relaunch; implement T101 onward"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000613"
      session_id: "007-006-tasks"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Launcher RSS-ceiling watchdog + graceful-exit supervision (F1′)

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

- [ ] T001 [B] Confirm host-runtime relaunch-on-exit-0 contract (REQ-008) — blocks default-on breach-self-exit
- [ ] T002 Add additive `childPid` field to `writeLeaseFile` JSON after spawn (`mk-spec-memory-launcher.cjs`) [REQ-005]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 `sampleProcessTreeRssMb(runner?)`: roll up daemon child + sidecar grandchild RSS; injectable ps/`/proc` runner; EPERM=unknown (`mk-spec-memory-launcher.cjs`) [REQ-002/006]
- [ ] T004 Watchdog interval (`.unref()`); N consecutive `SPECKIT_CONTEXT_SERVER_MAX_RSS_MB` breaches → SIGTERM child (grace>5000) → SIGKILL → launcher graceful `process.exit` (`mk-spec-memory-launcher.cjs`) [REQ-001/003]
- [ ] T005 Refactor child-exit handler into a crash-loop-guarded supervisor (window/threshold/backoff env-overridable); give-up = fail loud + sidecar process-group reap (`mk-spec-memory-launcher.cjs`) [REQ-004/007]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Synthetic parent→child→grandchild RSS roll-up test (injectable ps) + EPERM-as-unknown test [REQ-002/006]
- [ ] T007 Crash-loop give-up + single-death-recovery tests; grace>5000 assertion [REQ-003/004]
- [ ] T008 Live: configured ceiling breach recycles before OS OOM with clean re-initialize (if REQ-008 confirmed) [SC-001]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] REQ-008 resolved; P0 tasks (T002-T005) complete
- [ ] No `[B]` blocked tasks remaining
- [ ] Tree-RSS + crash-loop tests green; child-pid lease shipped for phase 007
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Root cause + design**: See `../003-daemon-reliability-research/research/research.md` §6 + `research/iterations/iteration-003.md`
<!-- /ANCHOR:cross-refs -->
