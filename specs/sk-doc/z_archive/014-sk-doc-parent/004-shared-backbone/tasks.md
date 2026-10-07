---
title: "Tasks: Build shared/ doc-quality backbone + facade symlinks"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-doc shared backbone tasks"
  - "sk-doc parent phase 004 tasks"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Build shared/ doc-quality backbone + facade symlinks

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [ ] T001 Confirm the phase 003 hub scaffold landed (`../003-hub-scaffold/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Move the 7 canonical validator scripts into shared/scripts/ (`.opencode/skills/sk-doc/shared/scripts/`)
- [ ] T003 Move the global references + frontmatter_versioning into shared/references/ (`.opencode/skills/sk-doc/shared/references/`)
- [ ] T004 Move the frontmatter/llms.txt/template_rules.json/flowchart assets into shared/assets/ (`.opencode/skills/sk-doc/shared/assets/`)
- [ ] T005 Establish the root facade symlinks (scripts + frontmatter_templates) (`.opencode/skills/sk-doc/`)
- [ ] T006 Write shared/README.md (`.opencode/skills/sk-doc/shared/README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Confirm the external consumers resolve unchanged (READMEs, `/doctor` audit_descriptions.py import, pre-commit hook, council test matrix)
- [ ] T008 Run `validate.sh` for this folder
- [ ] T009 Confirm `shared/` carries no graph-metadata.json or description.json
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
