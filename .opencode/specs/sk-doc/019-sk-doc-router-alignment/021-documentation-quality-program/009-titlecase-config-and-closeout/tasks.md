---
title: "Tasks: Title-Case Enforcement, Config Flip, and Closeout"
description: "Refine the check, flip the config, transform the headers, verify, and record the deferred findings."
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/009-titlecase-config-and-closeout"
    last_updated_at: "2026-07-22T16:06:06Z"
    last_updated_by: "claude"
    recent_action: "All tasks complete and the program is closed."
    next_safe_action: "Operator ff-merge to v4."
    blockers: []
    key_files: []
---

# Tasks: Title-Case Enforcement, Config Flip, and Closeout

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

- [x] T001 Refine `is_uppercase_section` in `validate_document.py` to exempt code spans, parentheticals, function signatures and internal-capital proper nouns; verify against a sanity set.
- [x] T002 Separate the 270 genuine offenders from the mixed-case false positives with the refined `is_uppercase_section`.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Flip `h2UppercaseRequired` to true for reference and asset in `template-rules.json`.
- [x] T004 Apply the deterministic exempt-preserving transform to the 270 headers across the 58 reference/asset files (`titlecase-true.json`).
- [x] T005 Fix the residual 5 files: the fallback for code-span-only headers in `is_uppercase_section`, and the two fenced template-body files.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Validate all 667 reference/asset files with `validate_document.py` and confirm 0 h2-uppercase failures.
- [x] T007 Re-run `audit_readmes.py` and confirm the template-invalid count fell (43 to 41), no regression.
- [x] T008 Record the three deferred code findings (`RIG_ROOT`, `dispatch-swe16`, `10a-manifest-source`) in `context-index.md`.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All reference/asset files VALID with the flip; program validates recursively clean
- [x] `checklist.md` verified with evidence

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
