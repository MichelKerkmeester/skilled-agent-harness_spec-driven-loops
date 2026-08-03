---
title: "Tasks: Phase 016: Content and Operations Depth"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "webflow content ops"
  - "schema markup"
  - "whtml depth"
  - "compression lifecycle"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-mcp-webflow/016-content-ops-depth"
    last_updated_at: "2026-08-03T13:58:52Z"
    last_updated_by: "pi"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-mcp-webflow-016"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: placeholder

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] [P1] T001 Fix localization card locale-management promise. [evidence: `content/localization-fonts-forms.md`]
- [x] [P1] T002 Add schema-markup + compression lifecycle + WHTML depth to sitemap card. [evidence: `operations/sitemap-scripts-assets-whtml.md`]
- [x] [P1] T003 Add webhook delivery contract + utility/AI advisory to site-pages-scripts card. [evidence: `content/site-pages-scripts.md`]
- [x] [P2] T004 Fix page-metadata example to use `get_page_metadata`. [evidence: `assets/examples/read-cms-content.md`]

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 [Implement core feature 1]
- [ ] T005 [Implement core feature 2]
- [ ] T006 [Implement core feature 3]
- [ ] T007 [Add error handling]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Test happy path manually
- [ ] T009 Test edge cases
- [ ] T010 Update documentation
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All tasks completed with evidence markers.
- Packet validators green; recursive strict validation 0 errors.

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

