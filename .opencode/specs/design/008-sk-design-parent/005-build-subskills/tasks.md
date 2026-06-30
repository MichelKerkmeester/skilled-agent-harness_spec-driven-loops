---
title: "Tasks: Phase 5: build-subskills"
description: "Concrete build steps for the three net-new sk-design children. Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "build sk-design subskills tasks"
  - "foundations motion audit tasks"
  - "net-new design children steps"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/005-build-subskills"
    last_updated_at: "2026-06-25T12:41:17Z"
    last_updated_by: "claude-opus"
    recent_action: "Populated the Level-1 task list for the net-new sub-skill build phase"
    next_safe_action: "Begin T004 (author sk-design-foundations)"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design/008-sk-design-parent/005-build-subskills"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: build-subskills

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

- [ ] T001 Confirm 003 umbrella + 004 onboarded children validate (precondition for routing gate)
- [ ] T002 Extract each child's corpus source clusters from `../001-corpus-research/research/research.md` §4
- [ ] T003 [P] Stand up package skeletons (SKILL.md + references/ + feature_catalog/ + manual_testing_playbook/ + changelog/) for all three children from sk-doc templates
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Author `sk-design-foundations` SKILL.md + references (color/type/layout, split-ready internals) + feature_catalog + manual_testing_playbook + changelog (`.opencode/skills/sk-design-foundations/`)
- [ ] T005 Author `sk-design-motion` SKILL.md + references (animation, micro-interactions, transitions, reduced-motion) + feature_catalog + manual_testing_playbook + changelog (`.opencode/skills/sk-design-motion/`)
- [ ] T006 Author `sk-design-audit` SKILL.md + references (a11y, perf, critique, harden, anti-slop) + feature_catalog + manual_testing_playbook + changelog (`.opencode/skills/sk-design-audit/`)
- [ ] T007 Add the P0-P3 severity + 5-dimension `/20` scoring contract to `sk-design-audit`, mirroring `sk-code-review`
- [ ] T008 Write each child's "When to use / When not to use / Pairs well with" sibling boundaries
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Run `validate.sh --strict` on each of the three children until each passes
- [ ] T010 Run a domain-representative routing query per child and confirm it resolves to the right child at >=0.8 (color/type/layout -> foundations; animation/transition -> motion; critique/a11y/perf -> audit)
- [ ] T011 Update spec/plan/tasks and refresh the per-child changelog entries to reflect the built state
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All three children pass `validate.sh --strict`
- [ ] Each child's routing query resolves to the right child at >=0.8
- [ ] Each child has a changelog entry
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

