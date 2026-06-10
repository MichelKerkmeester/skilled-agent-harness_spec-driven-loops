---
title: "Tasks: Unified Daemon CLI Reference and Skill Docs [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "003-cli-reference-and-skill-docs tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/016-cli-tooling-ux/003-cli-reference-and-skill-docs"
    last_updated_at: "2026-06-10T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded Level-1 task list (planned, unchecked)"
    next_safe_action: "Begin Phase 1 doc inventory tasks"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-003-cli-reference-and-skill-docs"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Unified Daemon CLI Reference and Skill Docs

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

- [ ] T001 Inventory the scattered CLI docs (`README.md:100-110`, `AGENTS.md:133-143`, `ENV_REFERENCE.md:538-559`, system READMEs).
- [ ] T002 Confirm the code-level exit-code taxonomy (`0/1/64/69/75`) and `jsonl` parsing behavior (`*-cli.ts:282-298`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Author the unified Daemon CLI Reference page (invocations, formats, exit codes, warm-only, examples, safety).
- [ ] T004 [P] Add recovery commands + exit-code taxonomy to `system-code-graph/SKILL.md` or link the unified page.
- [ ] T005 [P] Add recovery commands + exit-code taxonomy to `system-skill-advisor/SKILL.md` or link the unified page.
- [ ] T006 Document `jsonl` as a single-line JSON payload in the reference and SKILL.md notes; cross-link from `system-spec-kit/SKILL.md:413`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Verify the reference page covers all six topics with a code-matched exit taxonomy.
- [ ] T008 Verify each SKILL.md contains or links the recovery/exit-code content.
- [ ] T009 Verify the `jsonl` single-line-payload note matches the parser at `*-cli.ts:282-298`.
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
