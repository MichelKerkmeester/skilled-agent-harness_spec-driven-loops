---
title: "Tasks: Doc-Tooling and Template Fixes"
description: "Resolve the validator symlink path, add two template clarifications, verify both invocations."
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/021-documentation-quality-program/003-doc-tooling-and-template-fixes"
    last_updated_at: "2026-07-22T12:50:05Z"
    last_updated_by: "claude"
    recent_action: "All tasks shipped and verified."
    next_safe_action: "Proceed to phase 004."
    blockers: []
    key_files: []
---

# Tasks: Doc-Tooling and Template Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

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

- [x] T001 Reproduce the symlink error and locate the four `Path(__file__)` load sites in `shared/scripts/validate_document.py` (lines 188, 665, 1001, 1086).

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Replace `Path(__file__).parent` with `Path(__file__).resolve().parent` at the four load sites in `shared/scripts/validate_document.py`.
- [x] T003 Add the concrete-analogy bullet to WRITING RULES in `create-skill/assets/skill/skill-readme-template.md`.
- [x] T004 Add the validator-floor caveat under VALIDATION CHECKLIST in `skill-readme-template.md` and bump `version` to `1.8.0.6`.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Invoke the symlink `sk-doc/scripts/validate_document.py` on a conformant README; it reports VALID (was `Error: template_rules.json not found`).
- [x] T006 Invoke the real `shared/scripts/validate_document.py`; still VALID. `python3 -m py_compile` passes and `grep` finds no `resolve().resolve()`.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Both invocations VALID
- [x] `checklist.md` verified with evidence

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
