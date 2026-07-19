---
title: "Tasks: Templates and examples (020 subtree 008 phase 005)"
description: "The system-spec-kit template surface contains underscore-bearing directory and file names in the examples and stress-test layouts, including level_1, level_2, level_3, level_3+, stress_test, and EXTENSION_GUIDE.md. This phase moves permitted template paths and updates generator, renderer, and documentation pointers while preserving tool-mandated manifest templates."
trigger_phrases:
  - "system-spec-kit templates and examples"
  - "level_1 template rename"
  - "stress_test template rename"
  - "EXTENSION_GUIDE rename"
  - "kebab-case phase 005"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit/005-templates-and-examples"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned template-example tasks"
    next_safe_action: "Execute the template path map after script callers are stable"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: Templates and examples

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Inventory the template tree and all path consumers.
- [ ] T002 Capture baseline renders for level 1, level 2, level 3, and level 3+.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Apply semantic template directory/file mappings.
- [ ] T004 Rewrite generator, renderer, manifest, README, and example pointers.
- [ ] T005 Preserve tool-mandated template basenames and compare rendered trees.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Verify: Inventory is complete — evidence: template path report.
- [ ] T007 Verify: All permitted targets resolve — evidence: generator and renderer checks.
- [ ] T008 Verify: Tool-mandated names are unchanged — evidence: exemption diff.
- [ ] T009 Verify: Rendered output retains structure — evidence: baseline comparison.
- [ ] T010 Verify: No stale template pointer remains — evidence: old-path sweep.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green in the central validation worktree
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

