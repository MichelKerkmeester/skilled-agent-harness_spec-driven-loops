---
title: "Tasks: cli-devin quality optimization"
description: "Phase C task list across budget engine + verification pipeline + recipes."
trigger_phrases:
  - "cli-devin quality tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-prompt/004-sk-prompt-small-model-optimization/004-budget-and-output-verification"
    last_updated_at: "2026-05-18T14:32:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 004 tasks.md"
    next_safe_action: "Author 004 checklist.md"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000015"
      session_id: "114-004-tasks-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: cli-devin quality optimization

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

**Format**: `T### [P?] Description`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

> Budget engine.

- [x] T001 Author `cli-devin/assets/per-model-budgets.json` (slim scope: 4 required models + 2 optional stubs)
- [x] T002 [P] Author `cli-devin/references/context-budget.md` (patterns + integration)
- [x] T003 [P] Update `cli-devin/assets/prompt_templates.md` §2 with truncation marker
- [x] T004 Empirical: confirm truncation marker visible on sample iter with context >70% window
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> Verification pipeline.

- [x] T005 Author `cli-devin/references/output-verification.md`
- [x] T006 Author `cli-devin/assets/confidence-scoring-rubric.md`
- [x] T007 Extend `post-dispatch-validate.ts` with optional verification-pass step
- [x] T008 Unit tests for verification step (compile/run/test/lint mocking)
- [x] T009 [P] Update 3 agent-config recipes with verification opt-in block
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> Integration + cross-references.

- [x] T010 Update `cli-devin/SKILL.md` §3 Model Selection cross-references
- [x] T011 Update `sk-small-model/references/pattern-index.md` (004 rows shipped)
- [x] T012 Integration test: enable verification, sample iter, confirm degraded marking on bad output
- [x] T013 Backward compat: dispatch without verification opt-in still works
- [x] T014 Update implementation-summary.md with empirical numbers
- [x] T015 Memory continuity update
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] T001-T015 all marked [x]
- [x] P0 requirements verified (5/5 from spec.md §4)
- [x] decision-record.md has ≥1 accepted ADR
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decisions**: `decision-record.md`
- **Implementation Summary**: `implementation-summary.md`
- **Research**: `../001-research-smallcode/research/research.md` §RQ1 + §RQ2 + iter-006 + iter-007
<!-- /ANCHOR:cross-refs -->
