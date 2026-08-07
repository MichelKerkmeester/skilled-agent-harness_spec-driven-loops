---
title: "Tasks: README Migration Audit"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "readme migration audit tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-relocate-specs-folder/005-readme-migration-audit"
    last_updated_at: "2026-08-07T20:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "Tasks scoped from plan.md's 3 steps"
    next_safe_action: "Execute T001-T007 in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-system-speckit-032-relocate-005"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: README Migration Audit

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

- [x] T001 Real README census: count non-worktree README files, split by inside/outside `specs/`, identify literal `.opencode/specs` hits [evidence: 753 non-worktree READMEs (742 under `.opencode/`), 22 with a literal `.opencode/specs` hit, root `README.md` confirmed among them]
- [x] T002 Verify CLI-to-model mapping against real docs, not memory [evidence: both `cli-devin/SKILL.md` and `cli-opencode/SKILL.md` read in full; `cli-opencode/references/providers-and-models.md` has no GLM entries at all, confirming `cli-devin` is the only real GLM path; `deepseek/deepseek-v4-flash` confirmed as a live-verified cli-opencode model]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Launch the dual-executor `/deep:review` via the `system-deep-loop` skill, `:auto`, `spec_folder` bound to this phase, 10 iters each executor, `--stop-policy=max-iterations` (`plan.md` §4 Step 1)
- [ ] T004 Confirm both executor labels show route-proof fields (`target_agent: "deep-review"`, `resolved_route`, `agent_definition_loaded: true`, `mode: "review"`) across their iterations (`plan.md` §4 Step 1 Check)
- [ ] T005 Apply fixes for every confirmed finding, verified against the real current topology before applying (`plan.md` §4 Step 2)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 `validate.sh --recursive --strict` on the whole `032-relocate-specs-folder` family, 0 errors/0 warnings (`plan.md` §4 Step 3)
- [ ] T007 `git status --porcelain` clean of anything outside this phase's scope; commit and push to `skilled/v4.0.0.0` (`plan.md` §4 Step 3)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Phase 1 (setup) tasks marked `[x]`
- [ ] All Phase 2/3 tasks marked `[x]` with evidence
- [ ] No `[B]` blocked tasks remaining
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
