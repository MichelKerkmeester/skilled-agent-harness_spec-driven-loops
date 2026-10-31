---
title: "Tasks: Let the continuity writer save into a research-level folder"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "research folder continuity tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Let the continuity writer save into a research-level folder

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

- [x] T001 [P] Capture the green baseline of the continuity write suite before any change (`specs/system-speckit/052-research-folder-continuity/scratch/before/vitest-baseline.txt`)
- [x] T002 Record the scaffolded continuity blocks of the five 082 research children 014 through 018 (`specs/system-speckit/052-research-folder-continuity/scratch/before/research-continuity-blocks.txt`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write the research-record case and the non-research refusal case in the continuity write suite (`.skilled/skills/system-spec-kit/runtime/cli/tests/save-continuity-write.vitest.ts`)
- [x] T004 Run the new cases against the unfixed writer to prove the research case red (`specs/system-speckit/052-research-folder-continuity/scratch/before/vitest-new-test-on-old-code.txt`)
- [x] T005 [P] Add `continuityHostPath(leafPath)` to the save writer (`.skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts`)
- [x] T006 [P] Route the continuity plan and write through `hostPath` so the block lands in the chosen host (`.skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run the continuity write suite against the fixed writer and see 17 of 17 pass (`specs/system-speckit/052-research-folder-continuity/scratch/after/vitest.txt`)
- [x] T008 [P] Typecheck with `tsc --noEmit` and rebuild dist with `npm run build`, both exit 0 (`.skilled/skills/system-spec-kit/runtime/cli/dist/core/workflow.js`)
- [x] T009 [P] Save the five 082 research children 014 through 018 through the writer with composed continuity payloads, all exit 0 with no refusal logged (`specs/system-speckit/052-research-folder-continuity/scratch/after/save-runs.txt`)
- [x] T010 Compare the five continuity blocks before and after so every scaffold string is gone (`specs/system-speckit/052-research-folder-continuity/scratch/after/research-continuity-blocks.txt`)
- [x] T011 [P] Validate the 082 packet recursively and strictly, 19 of 19 RESULT PASSED (`specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat`)
- [x] T012 Fill spec.md, plan.md, tasks.md and implementation-summary.md (`specs/system-speckit/052-research-folder-continuity`)
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

