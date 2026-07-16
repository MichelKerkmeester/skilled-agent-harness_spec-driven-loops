---
title: "Tasks: Shell/Python/Daemon Waves (Playbook Run Phase 004)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "playbook shell python daemon tasks"
  - "028 phase 004 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/009-playbook-run-and-remediation/004-shell-python-daemon"
    last_updated_at: "2026-05-26T20:00:00Z"
    last_updated_by: "playbook-run-operator"
    recent_action: "Phase 004 wave tasks complete"
    next_safe_action: "Rollup"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-phase-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Shell/Python/Daemon Waves (Playbook Run Phase 004)

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

- [x] T001 Read cli-devin / cli-opencode / sk-prompt-models SKILL.md (CLI-dispatch mandate)
- [x] T002 Compose RCAF + pre-planned prompt files for both executors
- [x] T003 [P] Probe devin auth + opencode providers (done in phase 001)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Dispatch OpenCode (DeepSeek) for SC/AI/LC waves
- [x] T005 Attempt Devin auto-mode dispatch (BLOCKED — needs dangerous)
- [x] T006 Create isolated worktree /tmp/devin-wt + symlink node_modules/dist
- [x] T007 Record dangerous-mode escalation (operator-approved) in dispatch log
- [x] T008 Re-dispatch Devin dangerous mode in worktree for PC/CP/AU
- [x] T009 Run OP-001..003 locally (daemon healthy path; fault-injection deferred)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Read cli-opencode RESULTS.md (SC/AI/LC) and cli-devin RESULTS.md (PC/CP/AU)
- [x] T011 Verify worktree git status clean (no tracked-file mutation)
- [x] T012 Reproduce PC-004 regression + PC-005 bench FAIL in main env
- [x] T013 Cross-check SC-005 accuracy vs NC-003 (corroborated)
- [x] T014 Record 32 verdicts + findings
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining (Devin auto-mode block resolved via dangerous+worktree)
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
