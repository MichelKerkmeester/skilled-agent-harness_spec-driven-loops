---
title: "Tasks: Unified Daemon CLI Reference and Skill Docs"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "003-cli-reference-and-skill-docs tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/004-shared-infrastructure/004-cli-tooling-ux/003-cli-reference-and-skill-docs"
    last_updated_at: "2026-06-11T01:21:47Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed daemon CLI reference and SKILL.md documentation consolidation"
    next_safe_action: "Use implementation-summary.md verification evidence for handoff"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-003-cli-reference-and-skill-docs"
      parent_session_id: null
    completion_pct: 100
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

- [x] T001 Inventory the scattered CLI docs (`README.md:100-110`, `AGENTS.md:133-143`, `ENV_REFERENCE.md:538-559`, system READMEs).
- [x] T002 Confirm the code-level exit-code taxonomy (`0/1/64/69/75`) and `jsonl` parsing behavior (`*-cli.ts:282-298`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Author the unified Daemon CLI Reference page (invocations, formats, exit codes, warm-only, examples, safety).
- [x] T004 [P] Add recovery commands + exit-code taxonomy to `system-code-graph/SKILL.md` or link the unified page.
- [x] T005 [P] Add recovery commands + exit-code taxonomy to `system-skill-advisor/SKILL.md` or link the unified page.
- [x] T006 Document `jsonl` as a single-line JSON payload in the reference and SKILL.md notes; cross-link from `system-spec-kit/SKILL.md:413`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Verify the reference page covers all six topics with a code-matched exit taxonomy.
- [x] T008 Verify each SKILL.md contains or links the recovery/exit-code content.
- [x] T009 Verify the `jsonl` single-line-payload note matches the parser at `*-cli.ts:282-298`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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
