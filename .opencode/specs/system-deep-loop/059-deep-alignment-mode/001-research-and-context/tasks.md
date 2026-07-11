---
title: "Tasks: Phase 1: research-and-context"
description: "Task list for the read-only phase 001 research gate before the deep-alignment architecture freeze."
trigger_phrases:
  - "deep-alignment research tasks"
  - "runtime inventory tasks"
  - "prior art review tasks"
  - "standards surface tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/001-research-and-context"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted pending tasks for the research gate"
    next_safe_action: "Execute T001 first-read pass"
    blockers: []
    key_files:
      - ".opencode/specs/system-deep-loop/059-deep-alignment-mode/001-research-and-context/spec.md"
      - ".opencode/specs/system-deep-loop/059-deep-alignment-mode/001-research-and-context/plan.md"
      - ".opencode/specs/system-deep-loop/059-deep-alignment-mode/001-research-and-context/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-001-research-and-context"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: research-and-context

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

- [ ] T001 Confirm phase scope, parent handoff criteria, and the no-write boundary outside `001-research-and-context/` (spec.md §3 Scope)
- [ ] T002 [P] List the exact deep-review + runtime files to read (SKILL.md, runtime/scripts/*.cjs, deep-review/scripts/reduce-state.cjs)
- [ ] T003 [P] List the exact prior-art and standards-surface files to read for 052/055/051 and sk-doc/sk-git/sk-design/sk-code
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Execute the runtime-engine pass; record shared-vs-mode-local script findings with file:line evidence
- [ ] T005 Execute the prior-art pass over 052, 055, and 051; record each program's actual delivered scope
- [ ] T006 Execute the standards-surface pass over sk-doc, sk-git, sk-design, sk-code; record concrete adapter-source files
- [ ] T007 Execute the reference-implementation pass over the 130/131 packets; record the scoping question, ruleset, and fix pattern used
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Reconcile all four passes into one internally consistent research/context map in spec.md
- [ ] T009 Confirm zero files outside this phase folder were touched during execution
- [ ] T010 Run phase-folder validation and stop for human review before phase 002 begins
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
