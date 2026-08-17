---
title: "Tasks: Forward --stop-policy on the deep-research fan-out path"
description: "Task ledger for wiring stop_policy end to end and generalizing the max-iterations validator."
trigger_phrases:
  - "deep-research stop-policy forwarding tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/system-deep-loop/040-deep-research-stop-policy-forwarding"
    last_updated_at: "2026-08-17T19:30:00.000Z"
    last_updated_by: "claude"
    recent_action: "Wired stop_policy through both YAMLs; validator now covers research forced-depth."
    next_safe_action: "Run validation and the runtime tests."
    blockers: []
    key_files:
      - "specs/system-deep-loop/040-deep-research-stop-policy-forwarding/tasks.md"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-040-stop-policy-forwarding"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Forward --stop-policy on the deep-research fan-out path

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

- [x] T001 Confirm the gap at each layer. Evidence: `git show HEAD` gate `loopType !== 'review'`; auto YAML 0 `stop-policy`; presentation had no `stop_policy` row.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Add the `stop_policy` resolution row to `deep-research-presentation.txt`. Evidence: new row after `convergence_mode`.
- [x] T003 Declare + require + forward `stop_policy` in `deep-research-auto.yaml` and `deep-research-confirm.yaml`. Evidence: both grep `stop-policy {stop_policy}` = 1.
- [x] T004 Generalize `findMaxIterationsPolicyViolation` to research with loop-type-aware state names. Evidence: `fanout-run.cjs` gate `loopType !== 'review' && loopType !== 'research'`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Add research forced-depth validator test cases. Evidence: `fanout-run.vitest.ts` 3 new research `it` blocks.
- [x] T006 Run the validator block + full suite green. Evidence: `fanout-run.vitest.ts` 9/9 block, 109 total.
- [x] T007 `node --check` the runtime. Evidence: `fanout-run.cjs` exit 0.
- [ ] T008 Commit the packet on v4. Evidence: pending the commit.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Implementation tasks marked `[x]`. Evidence: `tasks.md` T001-T007.
- [ ] Commit task T008 complete. Evidence: pending.
- [x] No `[B]` blocked tasks remaining. Evidence: `tasks.md` has no blocked entry.
- [x] Verification passed. Evidence: `implementation-summary.md` Verification table.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
