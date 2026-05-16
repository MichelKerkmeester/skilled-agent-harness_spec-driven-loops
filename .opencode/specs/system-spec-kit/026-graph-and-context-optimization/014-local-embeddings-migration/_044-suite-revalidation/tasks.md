---
title: "Tasks: 043 Suite Revalidation"
description: "Task list for the post-substrate-wave 24-- scenario suite revalidation."
trigger_phrases:
  - "043 tasks"
  - "suite revalidation tasks"
  - "post-wave scenario runner tasks"
importance_tier: "critical"
contextType: "spec"
status: "fail"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/_044-suite-revalidation"
    last_updated_at: "2026-05-14T16:35:00Z"
    last_updated_by: "main-agent"
    recent_action: "Recorded failed scenario attempts caused by nested codex exec startup"
    next_safe_action: "Rerun after Codex app-server startup works in child processes"
    blockers:
      - "Nested codex exec app-server initialization permission error"
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000043"
      session_id: "_044-suite-revalidation-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 043 Suite Revalidation

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

- [x] T001 Scaffold Level 2 packet at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/_044-suite-revalidation/`.
- [x] T002 [P] Locate playbook files 401-415.
- [x] T003 [P] Identify baseline TSV at `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14b-post-032.summary.tsv`.
- [x] T004 [P] Confirm dispatch constraints: main branch, no commits, no SpawnAgent, no playbook/source edits.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Create `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-post-wave.sh`.
- [x] T006 Make the runner executable.
- [x] T007 Execute scenarios 401-415 through the runner.
- [x] T008 Capture `run-2026-05-14-post-wave.summary.tsv`.
- [x] T009 Capture per-scenario logs under `per-scenario-logs-post-wave/`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Aggregate PASS/PARTIAL/FAIL/SKIP counts.
- [x] T011 Compare scenario deltas against the 032/002 baseline.
- [x] T012 Update `implementation-summary.md` with the requested baseline delta table.
- [x] T013 Update checklist evidence and metadata status.
- [x] T014 Run strict packet validation.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 15 scenarios attempted or explicitly skipped.
- [x] New summary TSV path exists.
- [x] Baseline comparison is documented.
- [x] Strict packet validation result is recorded.
- [x] Binding trace can be emitted.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Checklist**: See `checklist.md`.
- **Summary**: See `implementation-summary.md`.
- **Evidence**: `_sandbox/24--local-llm-query-intelligence/evidence/`.
<!-- /ANCHOR:cross-refs -->
