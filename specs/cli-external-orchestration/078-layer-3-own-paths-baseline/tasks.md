---
title: "Tasks: Scope the cli-opencode Layer 3 baseline to the dispatch target's own paths"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "layer 3 own paths baseline tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Scope the cli-opencode Layer 3 baseline to the dispatch target's own paths

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

- [x] T001 Read every Layer 3 statement in full (`.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md`, `.skilled/skills/cli-external-orchestration/cli-opencode/references/destructive-scope-violations.md`, `.skilled/skills/cli-external-orchestration/cli-opencode/references/permissions-matrix.md`)
- [x] T002 [P] Search every doc root for clean-tree and recovery-baseline wording and classify each hit
- [x] T003 [P] Run the engine's `compute` on both files to get the derived versions
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Reword the Layer 3 prose, command block, baseline sentence and checklist row (`.skilled/skills/cli-external-orchestration/cli-opencode/references/destructive-scope-violations.md`)
- [x] T005 Reword the Layer 3 clause of rule 15 (`.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md`)
- [x] T006 Set the reference's build segment to the derived value plus one for this commit (`.skilled/skills/cli-external-orchestration/cli-opencode/references/destructive-scope-violations.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Confirm each old phrase hits its file at `HEAD` and is gone from the working file
- [x] T008 Confirm the reworded text holds no em dash and no semicolon
- [x] T009 Run `validate.sh --strict` on this packet and read `RESULT: PASSED`
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
