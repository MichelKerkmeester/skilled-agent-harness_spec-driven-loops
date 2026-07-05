---
title: "Tasks: Run-Now Control (Forced-Run Sentinel)"
description: "Completed task ledger for consume-once run-now sentinel control."
trigger_phrases:
  - "run now control"
  - "forced run sentinel"
  - "deep-research-run-now"
  - "run now sentinel"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/006-ux-observability-automation/004-run-now-control"
    last_updated_at: "2026-07-01T22:50:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/commands/deep/assets/deep_research_auto.yaml"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "scaffold-content-remediation-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Run-Now Control (Forced-Run Sentinel)

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

- [x] T001 Read the completed spec and confirm consume-once sentinel scope (`spec.md`).
- [x] T002 Confirm lifecycle event naming dependency from single-loop telemetry (`002-single-loop-telemetry-heartbeat/spec.md`).
- [x] T003 [P] Keep scheduler rewrite and fan-out forced-run behavior out of scope (`spec.md`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `state_paths.run_now_sentinel` for `.deep-research-run-now` (`deep_research_auto.yaml`).
- [x] T005 Add `step_run_now_check` before cadence wait and dispatch (`deep_research_auto.yaml`).
- [x] T006 Consume the sentinel before dispatch start (`deep_research_auto.yaml`).
- [x] T007 Emit `run_now_accepted` for accepted forced runs (`deep_research_auto.yaml`).
- [x] T008 Emit `run_now_rejected` when pause state blocks dispatch (`deep_research_auto.yaml`).
- [x] T009 Emit requested and restored lifecycle rows for auditability (`deep_research_auto.yaml`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Verify sentinel placement triggers immediate iteration and consumes the file.
- [x] T011 Verify paused loops reject run-now and keep the sentinel.
- [x] T012 Verify recreated sentinel intent is not consumed mid-run.
- [x] T013 Update plan and task docs to reflect completed implementation (`plan.md`, `tasks.md`).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual verification passed according to the completed specification.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
