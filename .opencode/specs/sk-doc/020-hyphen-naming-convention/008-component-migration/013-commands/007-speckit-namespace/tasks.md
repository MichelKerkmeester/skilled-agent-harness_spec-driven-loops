---
title: "Tasks: speckit command namespace naming (032 phase 008/013/007)"
description: "Execution tasks for the speckit workflow/presentation asset rename and reference closure."
trigger_phrases:
  - "speckit namespace naming tasks"
  - "speckit asset rename tasks"
  - "speckit command reference repair"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands/007-speckit-namespace"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands/007-speckit-namespace"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored speckit namespace tasks"
    next_safe_action: "Execute the speckit asset rename closure"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: Speckit command namespace naming

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
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Load the frozen speckit map, BASE manifest, and commands-parent handoff.
- [ ] T002 [P] Inventory references to the 12 `speckit_*` assets and record external consumers.
- [ ] T003 Confirm `/speckit:*` IDs, keys, frontmatter fields, and compliant command files are excluded.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename complete, implement, plan, and resume auto/confirm/presentation assets to mapped kebab-case targets.
- [ ] T005 Update command, README, asset-local, test, and external path-valued references in one closure.
- [ ] T006 Record dynamic, key, ID, and non-path occurrences in the disposition ledger.
- [ ] T007 Preserve command IDs, workflow keys, file modes, and target uniqueness.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Compare the final speckit manifest with all 12 map rows and check collisions.
- [ ] T009 Resolve every asset pointer and run command-reference checks.
- [ ] T010 Exercise complete, implement, plan, and resume modes against BASE scenarios.
- [ ] T011 Confirm no ID, key, exemption, or sibling namespace changed.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked [x]
- [ ] No [B] blocked tasks remain
- [ ] Every requirement in spec.md has evidence in the candidate report
- [ ] The phase checklist is green
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Governing policy**: See `../../../001-convention-policy-and-scope/spec.md`
- **Commands parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
