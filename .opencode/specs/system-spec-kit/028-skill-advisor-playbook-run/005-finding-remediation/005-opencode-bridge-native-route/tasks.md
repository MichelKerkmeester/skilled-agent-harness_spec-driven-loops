---
title: "Tasks: OpenCode Bridge Native Route Fix (F4)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "F4 tasks bridge native"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/005-opencode-bridge-native-route"
    last_updated_at: "2026-05-26T20:40:00Z"
    last_updated_by: "deep-research-remediation"
    recent_action: "Specced tasks"
    next_safe_action: "Implement"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-005-005"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: OpenCode Bridge Native Route Fix (F4)

<!-- SPECKIT_LEVEL: 1 -->
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

- [ ] T001 Confirm compat/index.js exports probeAdvisorDaemon/readAdvisorStatus/handleAdvisorRecommend/buildSkillAdvisorBrief
- [ ] T002 Trace launcher lease/socket guard emitting `(no-bridge-socket)`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Rewrite loadNativeAdvisorModules() to import compat directly; keep launcher as fallback
- [ ] T004 Fix launcher: held lease without daemon-ipc.sock → reclaim; never poison MCP stdout
- [ ] T005 Replace blanket fail-open catch with an accurate diagnostic
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Re-run CL-005 bridge smoke → route:native + Advisor brief
- [ ] T007 forceNative:true succeeds when daemon live; genuine-down fails open with real reason
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] CL-005 returns route:native
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Root cause**: See `../research/research.md` §3 F4
<!-- /ANCHOR:cross-refs -->
