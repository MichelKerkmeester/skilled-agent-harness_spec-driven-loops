---
title: "Tasks: system-code-graph Vitest Suite Triage"
description: "Implementation tasks for system-code-graph Vitest Suite Triage."
trigger_phrases:
  - "system-code-graph-suite-triage"
  - "010 follow-on 1"
  - "code-graph 31 failures triage"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-memory-leak-follow-ons-arc/001-system-code-graph-suite-triage"
    last_updated_at: "2026-05-22T18:30:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded follow-on phase."
    next_safe_action: "Plan and execute this phase when ready."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0a01010101010101010101010101010101010101010101010101010101010101"
      session_id: "010-memory-leak-follow-ons-arc-001"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Source baseline documented in arc 009 phase 007 implementation-summary.md."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: system-code-graph Vitest Suite Triage

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

- [ ] T001 Read the child spec and arc 009 phase 007 source baseline. (`spec.md`, `../009-memory-leak-remediation-arc/007-code-graph-launcher-and-db-lifecycle/implementation-summary.md`)
- [ ] T002 Capture the current failing-test inventory for the broader suite. (`.opencode/skills/system-code-graph/mcp_server/tests/`)
- [ ] T003 Replace scaffold placeholders in `plan.md` with concrete execution details. (`plan.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Classify failing runtime-detection tests. (`.opencode/skills/system-code-graph/mcp_server/tests/`)
- [ ] T005 Classify failing graph payload, parser, and walker tests. (`.opencode/skills/system-code-graph/mcp_server/tests/`)
- [ ] T006 Classify failing context, query, startup, and readiness tests. (`.opencode/skills/system-code-graph/mcp_server/tests/`)
- [ ] T007 Apply scoped bug fixes for failures proven to be product bugs. (`.opencode/skills/system-code-graph/mcp_server/`)
- [ ] T008 Add documented skips or quarantine pointers where broader work is required. (`.opencode/skills/system-code-graph/mcp_server/tests/`)
- [ ] T009 Record the per-test triage table. (`implementation-summary.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Run targeted verification for changed files. (`.opencode/skills/system-code-graph/mcp_server/`)
- [ ] T011 Run the broader suite or documented quarantine baseline. (`.opencode/skills/system-code-graph/mcp_server/`)
- [ ] T012 Fill implementation evidence and limitations. (`implementation-summary.md`)
- [ ] T013 Strict-validate this phase and the parent arc. (`validate.sh --strict`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] T004-T009 cover every failing test from the source baseline.
- [ ] T010-T011 pass or are documented with explicit environment limits.
- [ ] T012 records the final triage outcome.
- [ ] T013 exits 0 for both phase and parent arc.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Parent arc**: `../spec.md`
- **Phase spec**: `./spec.md`
- **Source baseline**: `../../009-memory-leak-remediation-arc/007-code-graph-launcher-and-db-lifecycle/implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
