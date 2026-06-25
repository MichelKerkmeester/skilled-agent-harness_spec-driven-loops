---
title: "Tasks: 028 Daemon Skills Playbook Validation [template:level_2/tasks.md]"
description: "The task list for the daemon-skills playbook validation. Stress run, isolation built, 222 of 471 playbook scenarios run across three models, scored, with findings and remediation logged. The remaining 249 spec-kit scenarios are recorded as not-run after the workspace wipe."
trigger_phrases:
  - "daemon skills playbook validation tasks"
  - "028 playbook benchmark task list"
  - "playbook validation run tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/000-release-cleanup/011-daemon-skills-playbook-validation"
    last_updated_at: "2026-06-25T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Marked run, scoring, and report tasks done. Remaining scenarios noted not-run"
    next_safe_action: "Operator decides whether to re-run the remaining 249 spec-kit scenarios"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-25-tasks-011-daemon-skills-playbook-validation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: 028 Daemon Skills Playbook Validation

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

**Task Format**: `T### [P?] Description (artifact)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Enumerate stress suites and playbook packages per skill (`plan.md`)
- [x] T002 Run the three vitest stress suites directly (results in `implementation-summary.md`)
- [x] T003 Build three disposable clones with per-clone daemon isolation, prove the real repo stays at 0 changes
- [x] T004 Kill the orphaned global daemon that watches and rewrites the real repo
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Author the dispatch driver: async pool, concurrency 3, per-model variant, index-resume
- [x] T011 Run phase-1 model pair (MiMo v2.5 Pro plus Kimi k2.7) over the early scenarios
- [x] T012 Swap MiMo out per operator directive, run phase-2 pair (Kimi k2.7 plus gpt-5.5 medium fast)
- [x] T013 Complete both smaller skills: advisor 47 of 47, code-graph 21 of 21
- [x] T014 [P] Run the spec-kit scenario sample reached before the wipe (154 of 403)
- [x] T015 Score each run for execution, verdict justification, quality, and insight
- [x] T016 Log findings to the insights log and remediation plans to the remediation log, live
- [ ] T017 Run the remaining 249 spec-kit scenarios (NOT RUN, frozen by the workspace wipe, operator chose salvage over re-run)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Recover the two eval logs by replaying recorded Write and Edit from the session transcript
- [x] T021 Parse the per-scenario verdict lines and coverage tallies back out of the transcript
- [x] T022 Re-confirm the two schema findings against the live DB read-only
- [x] T023 Consolidate stress, coverage, cross-model comparison, findings, and isolation caveats into the report
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

| Gate | State |
|------|-------|
| Stress recorded | Done |
| Playbook coverage recorded (222 of 471) | Done |
| Findings with remediation | Done (14 findings) |
| Full 471 coverage | Not met, frozen at 222 |
| Strict validation | Target exit 0 |
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` for the validation objective and scope
- `plan.md` for the harness and isolation recipe
- `implementation-summary.md` for the results and the 14 findings with remediation
- `checklist.md` for the QA evidence
<!-- /ANCHOR:cross-refs -->
