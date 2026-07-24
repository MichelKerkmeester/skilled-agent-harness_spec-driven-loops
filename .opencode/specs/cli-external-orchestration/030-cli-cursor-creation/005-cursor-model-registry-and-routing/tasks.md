---
title: "Tasks: Cursor model registry and routing"
description: "Task breakdown for the Cursor model registry and routing phase."
trigger_phrases: ["cli-cursor model registry tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/005-cursor-model-registry-and-routing"
    last_updated_at: "2026-07-24T04:16:30Z"
    last_updated_by: "claude-code"
    recent_action: "Authored tasks.md for phase 005"
    next_safe_action: "Author checklist.md"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Cursor model registry and routing

<!-- ANCHOR:notation -->
## Task Notation
`T### [P?] Description (file path)` - `[P]` marks tasks that could run in parallel.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] T001 Read `references/models/glm-5.2.md` as the structural template for a per-model profile
- [ ] T002 Resolve the open question: Composer-only vs. executor rows on every hosted frontier model
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] T003 Author `references/models/composer.md` (Cursor-native model; auth-gated context/pricing/slug as TBD)
- [ ] T004 [P] Add Composer to `references/models/_index.md`
- [ ] T005 [P] Add a Composer entry to `assets/model-profiles.json` with `cli-cursor` recorded as a driving executor
- [ ] T006 Add `cli-cursor` to the coverage arrays in `check-prompt-quality-card-sync.sh`
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T007 Run `check-prompt-quality-card-sync.sh`; confirm it passes with `cli-cursor` covered
- [ ] T008 Grep `composer.md` to confirm auth-gated fields carry a TBD marker, not a fabricated number
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] T009 `validate.sh 005-cursor-model-registry-and-routing --strict` passes 0/0; SC-001..SC-003 met; write `implementation-summary.md`
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Depends on phase 003's `cli-cursor/assets/prompt-quality-card.md` existing for the sync gate.
- Structural precedent: `../../029-cli-devin-revival/005-devin-model-registry-and-quota/`.
<!-- /ANCHOR:cross-refs -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `checklist.md`
