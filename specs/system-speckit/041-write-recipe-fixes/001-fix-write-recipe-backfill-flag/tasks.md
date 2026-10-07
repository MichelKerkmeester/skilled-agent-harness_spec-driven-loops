---
title: "Tasks: Correct the graph metadata backfill command in the spec folder write recipe"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "fix write recipe backfill flag tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Correct the graph metadata backfill command in the spec folder write recipe

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

- [x] T001 Read the script's argument parser and confirm `--root` is not a target (`.skilled/skills/system-spec-kit/runtime/cli/graph/backfill-graph-metadata.ts`)
- [x] T002 Run the old command and record exit 1 as the baseline (`.skilled/skills/system-spec-kit/runtime/cli/dist/graph/backfill-graph-metadata.js`)
- [x] T003 [P] Search `.skilled`, `.claude`, `.opencode` and the root rule files for other copies of the wrong form
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Replace `--root <folder>` with `<folder>` in Step 5 (`.skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Run the recipe's command text with a real folder and `--dry-run`, and read exit 0
- [x] T006 Confirm the old form still exits 1, so the check can tell the two apart
- [x] T007 Run `validate.sh --strict` on this packet and read `RESULT: PASSED`
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
