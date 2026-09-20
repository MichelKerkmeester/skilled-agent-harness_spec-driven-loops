---
title: "Tasks: Phase 006/005-notion-bases — Notion Bases reference-docs deep research"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "006 notion-bases research tasks"
  - "notion bases deep research tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/005-notion-bases"
    last_updated_at: "2026-08-22T09:30:00Z"
    last_updated_by: "claude"
    recent_action: "Authored retrospective task list for the completed research run"
    next_safe_action: "Hand synthesis.md to phase 009 apply pass"
    blockers: []
    key_files:
      - "spec.md"
      - "synthesis.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-006-005-notion-bases"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 006/005-notion-bases — Notion Bases reference-docs deep research

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

- [ ] T001 Seed the `bgarciamoura/obsidian-notion-bases-plugin` repository and installed v1.12.0 behavior
- [ ] T002 [P] Enumerate the research sub-questions in `spec.md` §3 (per-column YAML keys, mandatory marker, embed/view/rollup/lookup edge cases)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Run iteration 1 against the seeded sources (18 cited findings)
- [ ] T004 Confirm the per-column YAML key spelling against `src/types.ts`/`src/database-manager.ts`
- [ ] T005 Record the deep-loop append-gateway blocker that halted further automated iterations
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Mechanically reduce the confirmed iteration-1 findings into `research.md`
- [ ] T007 Write the prioritized P0/P1/P2 edit table in `synthesis.md`, citing every row to a research finding
- [ ] T008 `validate.sh` this phase; refresh continuity
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] Per-column YAML key spelling and mandatory-marker gap resolved with citations
- [ ] `synthesis.md` hands phase 009 a decided, prioritized edit table
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `research/research.md`
- **Synthesis**: See `synthesis.md`
- **Previous phase**: `../004-dataview/`
- **Next phase**: `../006-meta-bind/`
<!-- /ANCHOR:cross-refs -->
