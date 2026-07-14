---
title: "Tasks: system-skill-advisor scripts"
description: "Concrete tasks for the non-Python script filename rename, dataset reference closure, and Python exemption verification."
trigger_phrases:
  - "advisor scripts tasks"
  - "regression fixture rename tasks"
  - "script reference closure tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/002-scripts"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/002-scripts"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored scripts tasks"
    next_safe_action: "Begin with the non-Python script inventory"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Python script names and imports remain exempt."
---

# Tasks: system-skill-advisor scripts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| [ ] | Pending |
| [x] | Completed |
| [P] | Parallelizable |
| [B] | Blocked |

Task format: T### [P?] Description (file path)
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Enumerate all script paths and classify non-Python filenames versus Python exemptions
- [ ] T002 Inventory every old regression-dataset path in loaders, fixtures, docs, playbooks, and metadata
- [ ] T003 Capture BASE JSONL record count, regression result, holdout result, and collision report
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename skill_advisor_regression_cases.jsonl to skill-advisor-regression-cases.jsonl
- [ ] T005 Update advisor-validate.ts and build-holdout.mjs dataset resolution
- [ ] T006 Update holdout provenance, tests, manual playbook, references, and install commands
- [ ] T007 Preserve the five named Python filenames, imports, module names, and JSONL fields
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Scan for stale live dataset paths and classify retained non-path mentions
- [ ] T009 Run Python regression, routing-accuracy, holdout, and TypeScript validation checks
- [ ] T010 Compare dataset records, output schema, and discovery counts to BASE
- [ ] T011 Record the new dataset path for the references, playbook, and subtree-gate consumers
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked [x]
- [ ] No [B] blocked tasks remain
- [ ] Every requirement in spec.md has pinned evidence
- [ ] The phase checklist is fully satisfied by the central verifier
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
- **Checklist**: See checklist.md
<!-- /ANCHOR:cross-refs -->
