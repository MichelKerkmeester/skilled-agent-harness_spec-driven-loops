---
title: "Tasks: Phase 9 — Community plugin support (flat-financing / tables / BRAT)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "obsidian community plugins tasks"
  - "mcp-obsidian phase 9 tasks"
  - "beancount tables brat tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/009-community-plugin-support"
    last_updated_at: "2026-08-02T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 9 tasks"
    next_safe_action: "Author references + assets"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/009-community-plugin-support"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 9 — Community plugin support (flat-financing / tables / BRAT)

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

- [ ] T001 Confirm verified plugin facts (repo id/author, data model, commands, settings) for all three
- [ ] T002 [P] Create `references/` and `assets/` directories
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 [P] Author `references/flat-financing.md` + `assets/beancount-example.beancount`
- [ ] T004 [P] Author `references/obsidian-tables.md` + `assets/table-example.table.md`
- [ ] T005 [P] Author `references/obsidian42-brat.md` + `assets/brat-data-entry.example.json`
- [ ] T006 Author `references/plugin-operation-logic.md` (the generalizing file-layer principle)
- [ ] T007 Author `assets/workflows.md` (install-via-BRAT, add-transaction, create/query-table as file ops)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Validate each example is well-formed (`.beancount` parses conceptually, `.table.md`/`.json` valid JSON)
- [ ] T009 Confirm every load-bearing claim is grounded or `VERIFY`-marked; Phase-5 handoff note present in each reference
- [ ] T010 `validate.sh` this phase; refresh `implementation-summary.md` + continuity; update `../changelog/`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] 4 references + 4 assets present and validated
- [ ] Every plugin has a working example + a file-layer workflow
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Consumed by**: Phase 5 `../005-skill-authoring/` (folds `references/` into the shipped skill)
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
