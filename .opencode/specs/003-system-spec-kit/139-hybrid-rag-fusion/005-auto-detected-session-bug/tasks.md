---
title: "Tasks: Auto-Detected Session Selection Bug [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "tasks"
  - "auto-detected session bug"
  - "folder detector"
  - "regression tests"
  - "tasks core"
importance_tier: "high"
contextType: "implementation"
---
# Tasks: Auto-Detected Session Selection Bug

<!-- SPECKIT_LEVEL: 2 -->
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

- [ ] T001 Reproduce and document incorrect archived-session selection baseline (`.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts`)
- [ ] T002 Define canonical path normalization rules for `specs/` and `.opencode/specs/` aliases (`.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts`)
- [ ] T003 [P] Build test matrix for archive, alias, and mtime distortion scenarios (`.opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Implement active non-archived candidate preference with explicit archive/fixture filtering (`.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts`)
- [ ] T005 Implement deterministic candidate scoring and stable tie-breakers resilient to mtime skew (`.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts`)
- [ ] T006 Implement low-confidence confirmation/fallback gate for ambiguous selection (`.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts`)
- [ ] T007 Align confidence threshold behavior with alignment validator integration (`.opencode/skill/system-spec-kit/scripts/spec-folder/alignment-validator.ts`)
- [ ] T008 Update command behavior documentation for resume/handover auto-detection (`.opencode/command/spec_kit/resume.md`, `.opencode/command/spec_kit/handover.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Add regression tests: active non-archived preference and alias determinism (`.opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js`)
- [ ] T010 Add regression tests: mtime distortion resilience and low-confidence confirmation path (`.opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js`)
- [ ] T011 Run targeted validation/tests and record evidence in checklist (`.opencode/specs/003-system-spec-kit/139-hybrid-rag-fusion/005-auto-detected-session-bug/checklist.md`)
- [ ] T012 Review scope lock and confirm no unrelated detector behavior changed (`.opencode/specs/003-system-spec-kit/139-hybrid-rag-fusion/005-auto-detected-session-bug/spec.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Acceptance criteria REQ-001 through REQ-004 verified with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

---
