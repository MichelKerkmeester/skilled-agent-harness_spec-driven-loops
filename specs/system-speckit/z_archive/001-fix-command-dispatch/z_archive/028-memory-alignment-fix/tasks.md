---
title: "Tasks: Memory Alignment Fix"
description: "Task breakdown for the three-layer memory alignment defense: memory relocation, AI gate compliance, script alignment checks and content-based folder suggestion."
trigger_phrases:
  - "memory alignment fix tasks"
  - "three layer defense tasks"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Memory Alignment Fix

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

> Per-task state was not recorded at the time, so every task below is listed pending.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Immediate Fix (Memory Relocation)

- [ ] T001 Move Memory #95 from the `007-skill-system-improvements` memory folder to the `006-mcp-code-context-provider` memory folder
- [ ] T002 Update the `spec_folder` value in the moved memory file's YAML metadata
- [ ] T003 Delete the old index entry (ID 95) and index the new file location
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Layer A - AI Gate Compliance

- [ ] T004 Add explicit Phase 1 enforcement to Gate 5 (`AGENTS.md`)
- [ ] T005 Add HARD BLOCK enforcement when no argument is given (`commands/memory/save.md`)
- [ ] T006 Add content analysis and mismatch warning steps before folder selection (`commands/memory/save.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Layer B - Script Mandatory Alignment Check

- [ ] T007 Remove the bypass when `SPEC_FOLDER` is provided and always run alignment scoring in `detectSpecFolder()` (`scripts/generate-context.js`)
- [ ] T008 Add a prompt when the alignment score is below 50% (`scripts/generate-context.js`)
- [ ] T009 Improve keyword extraction and folder-name matching in `calculateFolderScore()` (`scripts/generate-context.js`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Layer C - Content-Based Suggestion

- [ ] T010 Add `suggestSpecFolder()` to analyze JSON content and return the top 3 matching folders with scores (`scripts/generate-context.js`)
- [ ] T011 Integrate `suggestSpecFolder()` into `detectSpecFolder()` and prompt on a significant mismatch (`scripts/generate-context.js`)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Testing & Verification

- [ ] T012 Verify a save with no argument prompts for folder selection
- [ ] T013 Verify a save with a mismatched folder warns and suggests alternatives
- [ ] T014 Verify a save with the correct folder proceeds normally
- [ ] T015 Verify the script always validates, even when the folder is provided explicitly
<!-- /ANCHOR:phase-5 -->

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
