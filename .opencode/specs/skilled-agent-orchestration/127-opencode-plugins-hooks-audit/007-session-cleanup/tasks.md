---
title: "Tasks: session-cleanup audit"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "session-cleanup audit"
  - "session-cleanup review"
  - "session-cleanup plugin findings"
  - "opencode plugin audit"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/127-opencode-plugins-hooks-audit/007-session-cleanup"
    last_updated_at: "2026-07-10T06:47:39.994Z"
    last_updated_by: "gpt-5.6-sol-fast-audit"
    recent_action: "Audit of session-cleanup complete"
    next_safe_action: "Remediation is a future packet"
    blockers: []
    key_files:
      - ".opencode/plugins/session-cleanup.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plugin-audit-127"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: session-cleanup audit

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
- [x] T001 Identify `session-cleanup` + its Claude hook counterpart [evidence: mapping in `review/review-report.md`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T002 Audit `.opencode/plugins/session-cleanup.js` + Claude hook (read-only) [evidence: 10 findings in `review/review-report.md`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T003 Record findings + verdict [evidence: verdict REFINE in `review/review-report.md`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] Audit tasks marked `[x]`
- [x] Findings documented; remediation deferred to a future packet
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Findings**: See `review/review-report.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
