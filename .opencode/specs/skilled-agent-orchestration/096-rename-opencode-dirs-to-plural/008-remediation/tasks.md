---
title: "Tasks: 103 - 101 cli-opencode regression remediation"
description: "Task list for the 103 remediation."
trigger_phrases:
  - "103 tasks"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/008-remediation"
    last_updated_at: "2026-05-08T01:15:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored task list"
    next_safe_action: "Phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-08"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: 103 - 101 cli-opencode regression remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Read 102 review-report finding details
- [x] T002 Identify cosmetic deferral (P2-032)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T010 P1-027 add --pure to 4 if_cli_opencode branches
- [x] T011 P1-028 remove sandboxMode from cli-opencode allowed fields + rebuild dist
- [x] T012 P2-027r add cli-opencode disambiguation regex to explicit.ts
- [x] T013 P2-028 add 4 cli-opencode unit-test cases
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T020 Run 25-test vitest suite
- [x] T021 Run 33-test combined executor suite
- [x] T022 Smoke-test cli-opencode advisor routing
- [x] T023 Smoke-test sandboxMode rejection
- [x] T024 Author implementation-summary.md
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] P2-032 deferral documented in continuity blockers
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Spec**: `spec.md`
- **Plan**: `plan.md`
- **Implementation Summary**: `implementation-summary.md`
- **Driving findings**: `../102-track-rereview-2/review/review-report.md`
<!-- /ANCHOR:cross-refs -->
