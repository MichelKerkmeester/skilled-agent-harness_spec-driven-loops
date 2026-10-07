---
title: "Tasks: Comprehensive Bug Fix"
description: "Task breakdown for the comprehensive system-spec-kit and spec_kit command bug fix across analysis, implementation and verification phases."
trigger_phrases:
  - "comprehensive bug fix tasks"
  - "system spec kit fix task breakdown"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Comprehensive Bug Fix

<!-- SPECKIT_LEVEL: 3 -->
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
## Phase 1: Analysis

- [ ] T001 Analyze SKILL.md structure and content (`SKILL.md`)
- [ ] T002 Analyze template files (`templates/`)
- [ ] T003 Analyze scripts (`skill_advisor.py`, `generate-context.js`)
- [ ] T004 Analyze reference documents (`references/`)
- [ ] T005 Analyze all 7 command files (`commands/spec_kit/`)
- [ ] T006 Check cross-consistency between components
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T007 Fix `skill_advisor.py` regex bug and add health check (`skill_advisor.py`)
- [ ] T008 Add the full generate-context.js path to Gate 5 (`AGENTS.md`)
- [ ] T009 Create the implementation-summary.md template (`templates/implementation-summary.md`)
- [ ] T010 Create the planning-summary.md template (`templates/planning-summary.md`)
- [ ] T011 Fix Task tool syntax and add model advisory in debug.md (`commands/spec_kit/debug.md`)
- [ ] T012 Fix substr(), Windows paths and readline errors in generate-context.js (`generate-context.js`)
- [ ] T013 Fix section numbering and clarify tasks.md ownership in plan.md (`commands/spec_kit/plan.md`)
- [ ] T014 Add attempt counter logic in handover.md (`commands/spec_kit/handover.md`)
- [ ] T015 Fix MCP syntax in resume.md (`commands/spec_kit/resume.md`)
- [ ] T016 Add Step 10.5 and Gate 4 reference in complete.md (`commands/spec_kit/complete.md`)
- [ ] T017 Restructure SKILL.md sections and document checklists (`SKILL.md`)
- [ ] T018 Update template count to 12 in README.md (`README.md`)
- [ ] T019 Fix P3 priority and align definitions in checklist.md (`templates/checklist.md`)
- [ ] T020 Fix sections 12/13 and add the Level field in spec.md template (`templates/spec.md`)
- [ ] T021 Fix version and add task notation in tasks.md template (`templates/tasks.md`)
- [ ] T022 Add placeholders and parallel notation in decision-record.md template (`templates/decision-record.md`)
- [ ] T023 Remove non-existent template references in template_guide.md (`references/template_guide.md`)
- [ ] T024 Update template count and add Gate 4 in quick_reference.md (`references/quick_reference.md`)
- [ ] T025 Fix phrasing and add a Level 2 example in level_specifications.md (`references/level_specifications.md`)
- [ ] T026 Fix numbering and add a walkthrough in sub_folder_versioning.md (`references/sub_folder_versioning.md`)
- [ ] T027 Add the DESIGN DOCUMENT banner in path_scoped_rules.md (`references/path_scoped_rules.md`)
- [ ] T028 Create worked_examples.md with 4 practical examples (`references/worked_examples.md`)
- [ ] T029 Create scripts/README.md documenting all scripts (`scripts/README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T030 Verify skill_advisor.py discovery finds 9 skills
- [ ] T031 Verify AGENTS.md Gate 5 documents the full generate-context.js path
- [ ] T032 Verify both new templates render correctly
- [ ] T033 Verify debug.md Task tool syntax and model advisory
- [ ] T034 Verify generate-context.js cross-platform paths and readline handling
- [ ] T035 Verify all command files
- [ ] T036 Verify SKILL.md and README.md (template count fix)
- [ ] T037 Verify all template files
- [ ] T038 Verify all reference documents
- [ ] T039 Verify cross-consistency (templates 12, scripts 7, checklists 4, references 6)
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
