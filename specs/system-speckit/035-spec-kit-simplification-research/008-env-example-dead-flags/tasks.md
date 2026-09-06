---
title: "Tasks: Env example dead flags"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "env dead flags tasks"
  - "env census tasks"
  - "template cleanup tasks"
  - "task dependencies"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Env example dead flags

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

- [x] T001 Extract every variable name from the template (.env.example)
- [x] T002 Census each name against production read sites in the real tree, including extension-less git hooks (.opencode)
- [x] T003 [P] Map the reader modules of the ranking and embedding flags to their own importers (.opencode/skills/system-spec-kit/shared)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Remove the thirteen dead variables and the empty section they left; renumber the banners (.env.example)
- [x] T005 Reword the ranking banner and the spec-document discovery flag (.env.example)
- [x] T006 Remove the two rows for flags read only by an unreachable module (.opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md)
- [x] T007 Remove the unused batch constants and renumber the sections (.opencode/skills/system-spec-kit/runtime/core/config.ts)
- [x] T008 Delete the stale skill-level template (.opencode/skills/system-spec-kit/.env.example)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Rebuild the runtime and run the env-reference drift guard (.opencode/skills/system-spec-kit/runtime)
- [x] T010 Run the CLI typecheck (.opencode/skills/system-spec-kit/runtime/cli)
- [x] T011 Rerun the census over the final template and validate this child and the parent (specs/system-speckit/035-spec-kit-simplification-research)
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
