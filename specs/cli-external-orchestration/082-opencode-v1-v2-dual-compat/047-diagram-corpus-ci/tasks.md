---
title: "Tasks: Phase 47: diagram-corpus-ci"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "diagram corpus ci tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 47: diagram-corpus-ci

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

- [x] T001 Date the break and the last green run from the workflow history (run `39165172090` at `be234e6f94`, last green `d04df31790`)
- [x] T002 Trace the failed assertion to the era rule and the README's first version (`.skilled/skills/sk-design/sk-design-diagram/scripts/families/metadata.cjs`, `.skilled/skills/sk-design/sk-design-diagram/scripts/README.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Set the README version to `1.2.0.1`, keeping its one earlier edition (`.skilled/skills/sk-design/sk-design-diagram/scripts/README.md`)
- [x] T004 Rewrite the era message to say the apply pass keeps a child doc's own edition and to set the major.minor by hand (`.skilled/skills/sk-design/sk-design-diagram/scripts/families/metadata.cjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Restore `1.0.1.0` and confirm the checker fails with the old value (`scratch/evidence/corpus-mutated-back.txt`)
- [x] T006 Confirm the checker passes at `1.2.0.1` (`scratch/evidence/corpus-after.txt`)
- [x] T007 Run the mutation suite before and after the fix (`scratch/evidence/mutation-before.txt`, `scratch/evidence/mutation-after.tap`)
- [x] T008 Confirm both applicator steps reproduce `assets/diagrams` byte for byte
- [x] T009 DeepSeek v4.1 flash max read-only review of the diff
- [ ] T010 Record the Diagram Corpus run id after the push to main (`implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` - T010 waits on the push to main
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
