---
title: "Tasks: Scripts tree (032 subtree 008 phase 004)"
description: "The system-spec-kit surface has a small set of non-Python script filenames that still contain underscores, while Python scripts and test fixture names follow separate contracts. This phase renames only permitted script filenames and updates sourcing, imports, and registry references without touching Python filenames or test-runner magic."
trigger_phrases:
  - "system-spec-kit scripts tree"
  - "_utils.sh rename"
  - "run_arm.sh rename"
  - "kebab-case script filenames"
  - "kebab-case phase 004"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit/004-scripts-tree"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned scripts-tree tasks"
    next_safe_action: "Execute the non-Python script filename map after MCP consumers are stable"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: Scripts tree

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

- [ ] T001 Capture the complete non-Python script filename inventory and extension dispositions.
- [ ] T002 Record the two observed shell mappings and read their callers.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Apply the semantic script filename map.
- [ ] T004 Rewrite shell, benchmark, registry, and documentation references.
- [ ] T005 Preserve Python files, fixture data, executable bits, and script logic.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Verify: The inventory is complete — evidence: extension and role report.
- [ ] T007 Verify: The two shell targets resolve — evidence: source and benchmark path checks.
- [ ] T008 Verify: All callers are updated — evidence: reference sweep.
- [ ] T009 Verify: Exempt names are preserved — evidence: changed-path audit.
- [ ] T010 Verify: Script behavior and modes are stable — evidence: bash -n, smoke output, and mode comparison.
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

