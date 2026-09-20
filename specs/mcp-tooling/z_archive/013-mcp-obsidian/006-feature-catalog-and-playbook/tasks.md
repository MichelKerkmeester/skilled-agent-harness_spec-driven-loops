---
title: "Tasks: Phase 6 — Feature catalog + manual-testing playbook for the mcp-obsidian mode"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "obsidian catalog tasks"
  - "obsidian playbook tasks"
  - "mcp-obsidian phase 6 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/006-feature-catalog-and-playbook"
    last_updated_at: "2026-08-02T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 6 catalog + playbook tasks"
    next_safe_action: "Read the two sk-create doctrines, then copy the mcp-click-up template"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/006-feature-catalog-and-playbook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6 — Feature catalog + manual-testing playbook for the mcp-obsidian mode

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

- [x] T001 Read `sk-create-feature-catalog` + `sk-create-manual-testing-playbook` doctrine; note the required card/scenario structure [Evidence: both doctrine files were read]
- [x] T002 Extract the shipped feature surface from the verified build context and the Phase 3/4 package references; decide the category taxonomy [Evidence: verified build context and source references]
- [x] T003 [P] Mirror `mcp-click-up/{feature-catalog,manual-testing-playbook}/` as the structural template under `mcp-obsidian/` [Evidence: reference catalog and playbook shapes mirrored]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author the `FEATURE-CATALOG.md` root inventory with CLI + MCP metrics, routing note, and current-state boundaries (`mcp-obsidian/feature-catalog/FEATURE-CATALOG.md`) [Evidence: root document validates with 0 issues]
- [x] T005 Author per-feature CLI cards under `<cli-prefix>-*` categories with implementation/source tables, SOURCE METADATA, and >=3 `trigger_phrases` (`mcp-obsidian/feature-catalog/<cli-prefix>-*/`) [Evidence: 11 CLI cards validate]
- [x] T006 Author MCP cards under `mcp-{high,medium,low}-priority` categories, including the explicit nine-tool `VERIFY` boundary (`mcp-obsidian/feature-catalog/mcp-*-priority/`) [Evidence: confirmed MCP cards and VERIFY boundary documented]
- [x] T007 Author the `manual-testing-playbook/` root policy and 17 scenario contracts with stable IDs, `stage: routing`, and catalog cross-references [Evidence: 17 contracts and unique IDs pass]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run `check_no_hyphenated_catalog_content.py` + `validate_document.py` on the catalog; all checks pass [Evidence: hyphenation and document validators pass]
- [x] T009 Validate the playbook; all 17 scenarios have the 9 contract fields, stable IDs, stage frontmatter, and resolving cross-references [Evidence: scoped checker reports 17/17 scenario contracts and resolving links]
- [ ] T010 Run final phase closeout and update `../changelog/`; changelog mutation is intentionally deferred because the user explicitly forbade editing the existing package files
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` (T010 remains pending under the explicit no-edit constraint)
- [x] Both packages validate (hyphenation + document checks pass; playbook validates)
- [x] Feature IDs stable; catalog covers CLI + MCP; catalog <-> playbook cross-references resolve
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Next phase**: `../007-hub-registration-and-advisor/`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
