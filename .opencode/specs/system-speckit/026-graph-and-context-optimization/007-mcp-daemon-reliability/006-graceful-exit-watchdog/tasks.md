---
title: "Tasks: Launcher RSS-ceiling watchdog + graceful-exit supervision (F1′)"
description: "Implementation task tracker for the process-tree RSS watchdog, graceful-exit recovery, crash-loop guard, and child-pid lease."
trigger_phrases:
  - "launcher watchdog tasks F1"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/006-graceful-exit-watchdog"
    last_updated_at: "2026-05-28T23:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented T002-T007 + REQ-007 reap fix; 12/12 tests; T001/T008 deferred"
    next_safe_action: "Confirm REQ-008 host relaunch to enable self-exit default-on; run T008 live"
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

- [ ] T001 [B] Confirm host-runtime relaunch-on-exit-0 contract (REQ-008) — DEFERRED: unconfirmed headlessly; breach-self-exit ships default-off behind `SPECKIT_LAUNCHER_RSS_SELF_EXIT=1`
- [x] T002 Add additive `childPid` field to `writeLeaseFile` JSON after spawn (`mk-spec-memory-launcher.cjs`) [REQ-005]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 `sampleProcessTreeRssMb(runner?)`: roll up daemon child + sidecar grandchild RSS; injectable ps/`/proc` runner; EPERM=unknown (`mk-spec-memory-launcher.cjs`) [REQ-002/006]
- [x] T004 Watchdog interval (`.unref()`); N consecutive `SPECKIT_CONTEXT_SERVER_MAX_RSS_MB` breaches → SIGTERM child (grace>5000) → SIGKILL → launcher graceful `process.exit` (default-off opt-in) (`mk-spec-memory-launcher.cjs`) [REQ-001/003]
- [x] T005 Refactor child-exit handler into a crash-loop-guarded supervisor (window/threshold/backoff env-overridable); give-up = fail loud + sidecar process-group reap via before-death descendant snapshot (REQ-007 reap-after-reparent fix) (`mk-spec-memory-launcher.cjs`) [REQ-004/007]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Synthetic parent→child→grandchild RSS roll-up test (injectable ps) + EPERM-as-unknown test + orphan-reap-from-snapshot + dead-pid-guard + kill-path EPERM + lease-shape tests (12/12) [REQ-002/005/006/007]
- [x] T007 Crash-loop give-up + single-death-recovery tests; grace>5000 assertion [REQ-003/004]
- [ ] T008 Live: configured ceiling breach recycles before OS OOM with clean re-initialize (if REQ-008 confirmed) [SC-001] — DEFERRED: needs a live daemon
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] P0 tasks (T002-T005) complete; REQ-008 deferred (breach-self-exit ships default-off behind opt-in as the documented mitigation)
- [~] T001 `[B]` remains deferred (REQ-008 host-relaunch unconfirmed headlessly) — mitigated by default-off gating
- [x] Tree-RSS + crash-loop tests green (12/12); child-pid lease shipped for phase 007
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Root cause + design**: See `../003-daemon-reliability-research/research/research.md` §6 + `research/iterations/iteration-003.md`
<!-- /ANCHOR:cross-refs -->
