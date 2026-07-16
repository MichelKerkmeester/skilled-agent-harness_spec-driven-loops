---
title: "Tasks: command asset emitters (032 phase 003 child 004)"
description: "Tasks for aligning `/create:*` auto, confirm, and presentation assets with kebab-case emitted paths without renaming the source asset files."
trigger_phrases:
  - "create command asset emitter tasks"
  - "create auto confirm naming tasks"
  - "hyphenated command asset output tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/003-create-generators-and-templates/004-command-asset-emitters"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/003-create-generators-and-templates/004-command-asset-emitters"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the task breakdown for command asset output naming"
    next_safe_action: "Build the complete command asset inventory"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Command Asset Emitters

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

- [ ] T001 Enumerate every create auto, confirm, and presentation asset and map its source path, keys, output values, and displayed paths.
- [ ] T002 Load child 001-003 output contracts and phase 002's catalog/playbook consumer matrix.
- [ ] T003 [P] Prepare temporary target roots and representative route inputs for every command family.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Align skill and parent-skill asset output rules with child 001.
- [ ] T005 Align catalog/playbook asset roots, leaves, links, and conflict checks with child 002 and phase 002.
- [ ] T006 Align readme, agent, command, changelog, flowchart, and benchmark asset output rules with child 003.
- [ ] T007 Preserve source asset filenames, YAML/JSON keys, field names, exact tool contracts, and later-rename boundaries.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Verify: the complete asset inventory covers every create command family and all three asset modes.
- [ ] T009 Verify: skill/parent, catalog/playbook, and remaining command-family routes emit the expected hyphenated paths.
- [ ] T010 Verify: catalog/playbook new-only output is typed correctly, old-only remains readable, both roots fail closed, and missing roots fail loudly.
- [ ] T011 Verify: source asset filenames and mapping keys are unchanged, with only emitted values/messages updated.
- [ ] T012 Recursively scan all temporary command targets and record zero non-exempt underscore path segments.
- [ ] T013 Record route counts, output listings, displayed paths, diagnostics, and exit codes for auto and confirm coverage.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete.
- [ ] All requirements in `spec.md` are met with evidence.
- [ ] Every command asset family has nonzero route evidence and the source-file rename boundary remains clean.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Consumer contract**: See `../../002-root-name-consumer-migration/checklist.md`.
<!-- /ANCHOR:cross-refs -->
