---
title: "Tasks: Manual Testing Playbook Execution Sweep [template:level_3/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "manual playbook execution sweep tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/014-manual-playbook-execution-sweep"
    last_updated_at: "2026-07-02T06:10:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored tasks.md"
    next_safe_action: "Build manifest.tsv, run provider pre-flight, launch wave 1"
    blockers: []
    key_files: ["tasks.md", "manifest.tsv"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-02-031-manual-playbook-sweep"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Manual Testing Playbook Execution Sweep

<!-- SPECKIT_LEVEL: 3 -->
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

Given 485 individual scenarios, per-scenario status lives in `manifest.tsv`, not as individual tasks here. Tasks below track the sweep at wave/subsystem granularity.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Enumerate all manual testing playbook scenarios across the 3 subsystems (excluding a stray `node_modules` artifact under system-spec-kit's playbook folder)
- [x] T002 Build `manifest.tsv` (485 rows: subsystem, category, file path, status, verdict)
- [x] T003 Scaffold this spec folder
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Provider pre-flight: confirm `openai` is configured for cli-opencode
- [ ] T005 Run all system-spec-kit scenario waves (412 scenarios, ~42 waves of 10)
- [ ] T006 Run all system-code-graph scenario waves (26 scenarios, ~3 waves of 10)
- [ ] T007 Run all system-skill-advisor scenario waves (47 scenarios, ~5 waves of 10)
- [ ] T008 Confirm manifest shows 485/485 scenarios with a completed dispatch and real evidence
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Spot-check a sample of PASS verdicts per subsystem against independent re-execution
- [ ] T010 Write the consolidated final report in `implementation-summary.md` (totals + every FAIL/BLOCKED named)
- [ ] T011 Run `validate.sh --strict` on this folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 11 tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `manifest.tsv` shows 485/485 scenarios dispatched with real evidence
- [ ] Consolidated report reviewed by operator
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Scenario manifest**: See `manifest.tsv`
<!-- /ANCHOR:cross-refs -->
