---
title: "Tasks: Designer Capability Deepening"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "designer tasks"
  - "designer guide"
  - "DRAFT-003"
  - "designer card"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-mcp-webflow/010-designer-capabilities"
    last_updated_at: "2026-08-03T09:02:22Z"
    last_updated_by: "pi"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-mcp-webflow-010"
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

- [x] [P0] T001 Write `references/designer-capabilities.md` (canvas model, bridge boundary, edit loop, element tree, styles/tokens, components, breakpoints, gates, worked flows). [evidence: new file, 11 numbered sections, 5/8 trigger phrases, `importance_tier: important`]

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] [P0] T002 Deepen `feature-catalog/design/designer.md` card with canvas logic, edit loop, element/token semantics, guide link (v1.1.0.0). [evidence: `designer.md` v1.1.0.0, 7 trigger phrases, guide in SOURCE FILES]
- [x] [P0] T003 Add playbook scenario DRAFT-003 (`designer-edit/designer-edit.md`), canonical 5-section shape. [evidence: file created; `validate_skill_package.py` PASS]
- [x] [P0] T004 Update playbook root: coverage 17 scenarios, scenario index, wave list, cross-reference row, description. [evidence: `manual-testing-playbook.md` rows DRAFT-003 at index + cross-ref]
- [x] [P1] T005 Update catalog root Designer-family entry (Current Reality + category path links). [evidence: `feature-catalog.md` designer entry links `design/designer.md`]

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] [P1] T006 Repair broken cross-links from the category move (root, cards, examples, benchmark anchor). [evidence: packet link check 0/0 broken]
- [x] [P1] T007 Regenerate leaf-manifest and run all validators. [evidence: `package_skill.py --check` PASS, leaf-manifest written, fleet metadata 11/11 passed]

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All seven tasks completed with evidence markers (T001-T007).
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

