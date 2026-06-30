---
title: "Tasks: Daemon disposal relaunch-flap guard"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "daemon disposal flap tasks"
  - "launcher relaunch guard tasks"
  - "mcp respawn fix tasks"
  - "orphan gate tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/017-daemon-disposal-flap-guard"
    last_updated_at: "2026-06-07T13:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Marked implementation + verification tasks complete"
    next_safe_action: "Runtime-verify on fresh session"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-017-daemon-disposal-flap-guard"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Daemon disposal relaunch-flap guard

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

- [x] T001 Verify report against first-party code: launcher already guards its own shutdown; real gap = disposal race (250ms relaunch fires before launcher SIGTERM)
- [x] T002 Confirm recycle + crash-recovery both flow through scheduleRelaunch with the owner alive; confirm MCP host is the launcher's direct parent (orphan detection reliable)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add `LAUNCHER_INITIAL_PPID = process.ppid` const at module load (`mk-spec-memory-launcher.cjs`)
- [x] T004 Gate the scheduleRelaunch timer callback: abort + clearAllLeaseFiles + exit when `launcherShutdownInProgress` or orphaned (ppid changed / == 1) (`mk-spec-memory-launcher.cjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 `node --check` the launcher (clean)
- [x] T006 Run launcher vitest suite (watchdog 15/15; clean-close + reap + session-proxy + ipc-probe 39/39 = 54 pass, no regression)
- [x] T007 `validate.sh --strict` for this packet; document deferred RC-2 (ownership re-election), mk-code-index proxy, reap hardening, CLAUDE_SESSION_PID, persistent log
- [ ] T008 [B] Runtime-verify the flap stops on a FRESH session (`.cjs` activates on a fresh launcher) — owed to the next dev session
- [x] T009 Extract the gate predicate into pure `shouldAbortRelaunchOnFire` (`lib/model-server-supervision.cjs`); re-export + call it from the launcher (behavior-identical)
- [x] T010 Add 5 disposal-gate unit cases to `mcp_server/tests/launcher-watchdog.vitest.ts` (owner-alive / shutdown / changed-ppid / orphan-to-1 / crash-recycle); 20/20 pass
- [x] T011 Add feature-catalog entry + `feature_catalog.md` registration
- [x] T012 Add playbook scenario 421 + `manual_testing_playbook.md` table row + file-count reconciliation (386 scenario / 320 catalog)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All in-session tasks marked `[x]`
- [x] No `[B]` blockers except the runtime-verify owed to a fresh session (documented)
- [x] Manual verification (syntax + unit tests + logic) passed
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
