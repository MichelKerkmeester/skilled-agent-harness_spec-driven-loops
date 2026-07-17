---
title: "Tasks: INSTALL-GUIDE canonical filename normalization (sk-doc 021)"
description: "Task list for the INSTALL-GUIDE canonical-naming migration: classifier recognition, renames, filename references, and verification."
trigger_phrases:
  - "install-guide normalization tasks"
  - "INSTALL-GUIDE rename tasks"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/021-install-guide-canonical-naming"
_memory:
  continuity:
    packet_pointer: "sk-doc/021-install-guide-canonical-naming"
    last_updated_at: "2026-07-17T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded the completed INSTALL-GUIDE migration task list"
    next_safe_action: "Validate the packet and commit"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: INSTALL-GUIDE canonical filename normalization

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Classifier
- [x] T001 Add hyphen-stem recognition (`install-guide`) to the `install_guide` branch of `detect_document_type`.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Rename
- [x] T002 `git mv` the 3 case-only `install-guide.md` files → `INSTALL-GUIDE.md` via a temp name.
- [x] T003 `git mv` the 9 `INSTALL_GUIDE.md` + 2 `install_guide.md` files → `INSTALL-GUIDE.md`.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: References
- [x] T004 Replace `.md`-suffixed filename references across `.opencode` (excl. `specs/`) + root `README.md`.
- [x] T005 Preserve the bare `install_guide` doc-type id (classifier return, `--type` choices, adapter list, `template_rules.json`, tests) and the JSON key.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:phase-4 -->
## Phase 4: Verify
- [x] T006 Verify: a renamed `INSTALL-GUIDE.md` path classifies as `install_guide` (direct `detect_document_type` test).
- [x] T007 Verify: no prefixed `*INSTALL-GUIDE.md` over-reach remains (reverted the one test-fixture reference).
- [x] T008 Verify: no install-guide markdown link breakage; validator test suite is pre-existing-red (0/11 with and without the change).
<!-- /ANCHOR:phase-4 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] 14 files renamed to `INSTALL-GUIDE.md`; zero old-casing files remain.
- [x] Renamed files classify as `install_guide`; doc-type contract preserved.
- [x] No old `.md`-suffixed filename reference remains outside `specs/`.
<!-- /ANCHOR:completion -->
