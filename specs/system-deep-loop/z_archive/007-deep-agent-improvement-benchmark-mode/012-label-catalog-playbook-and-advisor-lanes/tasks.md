---
title: "Tasks: Phase 12: catalog-playbook-advisor-lane-labels"
description: "Task list for lane labels in catalog and playbook plus the reduce-state mode mix display and its vitest."
trigger_phrases:
  - "lane legend"
  - "lane note"
  - "mode mix"
  - "reduce-state"
  - "tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/007-deep-agent-improvement-benchmark-mode/012-label-catalog-playbook-and-advisor-lanes"
    last_updated_at: "2026-05-29T09:41:00Z"
    last_updated_by: "build-agent"
    recent_action: "Track lane labels + reduce-state mode mix tasks"
    next_safe_action: "Run vitest then validate.sh --strict"
    blockers: []
    key_files:
      - ".opencode/skills/deep-agent-improvement/scripts/reduce-state.cjs"
      - ".opencode/skills/deep-agent-improvement/scripts/tests/reduce-state-mode-mix.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/012-label-catalog-playbook-and-advisor-lanes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: catalog-playbook-advisor-lane-labels

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

- [x] T001 Read reduce-state.cjs, feature_catalog.md, manual_testing_playbook.md
- [x] T002 Confirm records carry the mode field (score-candidate.cjs, run-benchmark.cjs)
- [x] T003 [P] Read the existing reduce-state-dashboard vitest for the test pattern
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add lane legend and per-category tags to feature_catalog.md
- [x] T005 Add lane note to manual_testing_playbook.md
- [x] T006 Add modes map to bucket, increment in registry builder, expose registry.modes
- [x] T007 Add formatLaneModeMix and render the mix in profile section and dashboard
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Add reduce-state-mode-mix.vitest.ts asserting the mix for model-benchmark records
- [x] T009 Run the full vitest suite green
- [x] T010 Fill spec, plan, tasks, implementation summary and run validate.sh --strict
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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

