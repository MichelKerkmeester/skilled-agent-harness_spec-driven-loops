---
title: "Tasks: Specs-Root Migration Execution"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "migration execution tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-relocate-specs-folder/003-migration-execution"
    last_updated_at: "2026-08-06T19:31:37Z"
    last_updated_by: "claude-code"
    recent_action: "Runbook scoping tasks complete; execution tasks intentionally unchecked"
    next_safe_action: "Operator separately approves an actual run"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-system-speckit-032-relocate-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Specs-Root Migration Execution

<!-- SPECKIT_LEVEL: 3 -->

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

Scope the runbook from phase 002's accepted design. This phase's own work — it's done.

- [x] T001 Confirm both ADRs Accepted in `002-migration-plan/decision-record.md` before scoping [evidence: `decision-record.md` shows ADR-001 status Accepted, ADR-002 status Accepted]
- [x] T002 Convert phase 002's `plan.md` §3-4 bullets into a literal, ordered, 11-step runbook with exact commands and checks [evidence: `plan.md` §4, steps 1-11]
- [x] T003 Name a rollback trigger and procedure for every mutating step [evidence: `plan.md` §7, split into pre-step-4, post-commit-pre-write, and post-commit-post-write cases]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Intentionally unchecked.** These are the actual runbook steps — none have been run. This section stays `[ ]` until the operator gives a separate, explicit approval to execute, per `spec.md` REQ-007.

- [ ] T004 Step 1: Pre-flight checks (`plan.md` §4 Step 1)
- [ ] T005 Step 2: Baseline manifest via `buildMigrationManifest`, confirm zero divergent-duplicates (`plan.md` §4 Step 2)
- [ ] T006 Step 3: Write and unit-test the topology-flip function against a fixture, not the real repo (`plan.md` §4 Step 3)
- [ ] T007 Step 4: THE ATOMIC STEP — flip + `.gitignore` rebase in one commit, verified before committing (`plan.md` §4 Step 4)
- [ ] T008 Step 5: Invert the 7 registry entries (`plan.md` §4 Step 5)
- [ ] T009 Step 6: Add the `SPEC_KIT_SPECS_DIR` override across 5 call sites (`plan.md` §4 Step 6)
- [ ] T010 Step 7: Fix the resolver-precedence disagreement (`plan.md` §4 Step 7)
- [ ] T011 Step 8: Update CI and operator-facing docs (`plan.md` §4 Step 8)
- [ ] T012 Step 9: Reindex Memory MCP (`plan.md` §4 Step 9)
- [ ] T013 Step 10: Invert the 61-test validation matrix (`plan.md` §4 Step 10)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Also unchecked — depends entirely on Phase 2 actually running first.

- [ ] T014 Step 11: Full verification sweep — `validate.sh --recursive --strict` on the whole repo, `git status --porcelain` clean (`plan.md` §4 Step 11)
- [ ] T015 Operator reviews the final state and confirms the migration is complete
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Phase 1 (scoping) tasks marked `[x]`
- [ ] All Phase 2/3 (execution) tasks remain `[ ]` until a separate operator approval to run
- [x] No `[B]` blocked tasks
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Prior Decisions**: See `../002-migration-plan/decision-record.md`
<!-- /ANCHOR:cross-refs -->
