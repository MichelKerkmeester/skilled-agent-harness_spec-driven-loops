---
title: "Tasks: command asset emitters (020 phase 003 child 004)"
description: "Tasks for aligning `/create:*` auto, confirm, and presentation assets with kebab-case emitted paths without renaming the source asset files."
trigger_phrases:
  - "create command asset emitter tasks"
  - "create auto confirm naming tasks"
  - "hyphenated command asset output tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/003-create-generators-and-templates/004-command-asset-emitters"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/003-create-generators-and-templates/004-command-asset-emitters"
    last_updated_at: "2026-07-18T06:38:11Z"
    last_updated_by: "codex"
    recent_action: "Completed the command asset emitter task set and verification"
    next_safe_action: "Integrate this child with the phase 003 parent after central review"
    blockers: []
    key_files: []
    completion_pct: 100
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

- [x] T001 Enumerate every create auto, confirm, and presentation asset and map its source path, keys, output values, and displayed paths. Evidence: `sourceAssetFilenames` covers 33/33 root assets.
- [x] T002 Load child 001-003 output contracts and phase 002's catalog/playbook consumer matrix. Evidence: `PY_JS_MATRIX_PASS=28`.
- [x] T003 [P] Prepare temporary target roots and representative route inputs for every command family. Evidence: `AUTO_FILES=22` and `CONFIRM_FILES=22`.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Align skill and parent-skill asset output rules with child 001. Evidence: `test_emitter_contract_tokens`.
- [x] T005 Align catalog/playbook asset roots, leaves, links, and conflict checks with child 002 and phase 002. Evidence: Lane C `32/30`.
- [x] T006 Align readme, agent, command, changelog, flowchart, and benchmark asset output rules with child 003. Evidence: `test_emitter_contract_tokens`.
- [x] T007 Preserve source asset filenames, YAML/JSON keys, field names, exact tool contracts, and later-rename boundaries. Evidence: `test_source_asset_filenames_remain_stable`.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Verify: the complete asset inventory covers every create command family and all three asset modes. Evidence: asset inventory 33/33.
- [x] T009 Verify: skill/parent, catalog/playbook, and remaining command-family routes emit the expected hyphenated paths. Evidence: `test_emitter_contract_tokens`.
- [x] T010 Verify: catalog/playbook new-only output is typed correctly, old-only remains readable, both roots fail closed, and missing roots fail loudly. Evidence: `JS_MATRIX_PASS=16`.
- [x] T011 Verify: source asset filenames and mapping keys are unchanged, with only emitted values/messages updated. Evidence: `test_source_asset_filenames_remain_stable`.
- [x] T012 Recursively scan all temporary command targets and record zero non-exempt underscore path segments. Evidence: `ZERO_NON_EXEMPT_UNDERSCORES=1`.
- [x] T013 Record route counts, output listings, displayed paths, diagnostics, and exit codes for auto and confirm coverage. Evidence: `AUTO_FILES=22` and `CONFIRM_FILES=22`.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete. Evidence: `T001-T013`.
- [x] All requirements in `spec.md` are met with evidence.
- [x] Every command asset family has nonzero route evidence and the source-file rename boundary remains clean. Evidence: 33/33 source assets preserved.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Consumer contract**: See `../../002-root-name-consumer-migration/checklist.md`.
<!-- /ANCHOR:cross-refs -->
