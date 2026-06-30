---
title: "Tasks: 101/008 Council Surface Polish"
description: "Task list for SKILL.md polish, series changelog, 3-test smoke vitest."
trigger_phrases:
  - "101/008 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/101-deep-multi-ai-council-skill/008-council-surface-polish"
    last_updated_at: "2026-05-11T11:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored task breakdown"
    next_safe_action: "Start T010"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "101-008-surface-polish"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 101/008 Council Surface Polish

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Inspect v1.0.0.0.md changelog format
- [x] T002 Inspect SKILL.md sections that need cross-references
- [x] T003 Scaffold packet 008
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Update SKILL.md Resource Discovery + Key Resources sections
- [x] T011 Author `changelog/v1.1.0.0.md`
- [x] T012 Author `tests/council-helpers-smoke.vitest.ts` (3 tests)
- [x] T013 Update `mcp_server/package.json` `test:council` to include the new vitest
- [x] T014 Update parent 101 spec.md phase map + graph-metadata.json
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T030 Run new smoke vitest standalone
- [x] T031 Run full 10-file council matrix via `npm run test:council`
- [x] T032 Run sk-doc quick_validate
- [x] T033 Strict spec validation on 008 + parent 101
- [x] T034 Author real implementation-summary.md
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 requirements REQ-001..REQ-005 verified
- [ ] Full 10-file matrix passes
- [ ] Strict spec validation 0/0 on 008 + parent 101
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: `../007-council-infrastructure-hardening/`
<!-- /ANCHOR:cross-refs -->
