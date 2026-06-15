---
title: "Tasks: Formalize the parent-nested-skill pattern"
description: "Tasks for phase 003: sk-doc section + templates, /create:parent-skill, /doctor:parent-skill, the dogfooded benchmark, and the research reconcile."
trigger_phrases:
  - "formalize parent skill tasks"
  - "phase 003 tasks"
  - "create doctor benchmark tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/155-parent-nested-skill-pattern/003-formalize-pattern"
    last_updated_at: "2026-06-15T14:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored task list for the formalization phase"
    next_safe_action: "Validate and commit scoped"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-155-003-formalize-pattern-tasks"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Tasks: Formalize the parent-nested-skill pattern

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

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

- [x] T001 Gather target shapes: sk-doc structure, create trio, doctor route, skill-benchmark fixtures

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T001 [P] sk-doc §10 "Parent Skills with Nested Mode Packets" + hub/registry templates (markdown agent). (`.opencode/skills/sk-doc/references/skill_creation.md`, `.opencode/skills/sk-doc/assets/skill/parent_skill_*`)
- [x] T002 [P] `/create:parent-skill` command + 3 assets + README/agent-mirror registration (markdown agent). (`.opencode/commands/create/parent-skill.md` + assets)
- [x] T003 [P] `/doctor:parent-skill` route + `parent-skill-check.cjs` + workflow asset + router row (general agent). (`.opencode/commands/doctor/`)
- [x] T004 Benchmark fixtures (5 mode scenarios) + routing-precision scorecard. (`.opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/deep-loop-workflows/`)
- [x] T005 Reconcile research.md routingClass 3 → 4 (added `alias-fold`). (`../research/research.md`)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 sk-doc validator clean (0 new warnings); §10 present; templates parse
- [x] T007 /create YAMLs parse; 3 agent mirrors consistent (2 hits each)
- [x] T008 /doctor check PASS on deep-loop-workflows (exit 0) + negative-path (broken exit 1, missing exit 2); hygiene exit 0
- [x] T009 Benchmark fixtures valid (10 files); scorecard 3/3 lexical modes
- [x] T010 `validate.sh --strict` on this phase folder
- [x] T011 Commit scoped

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All four deliverables shipped + independently verified.
- [x] No `[B]` blocked tasks remaining.
- [x] No advisor/registry/skill behavior changed.
- [x] `validate.sh --strict` green.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Research**: `../research/research.md`

<!-- /ANCHOR:cross-refs -->
